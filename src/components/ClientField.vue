<template lang="pug">
.client__field
  v-scroll-y-transition
    v-text-field(
      v-if='!client || isNewClient',
      :prepend-inner-icon='$icons.user',
      :loading='isLoading',
      :success-messages='sucMsg',
      :error-messages='errMsg',
      v-model='value',
      :color='color',
      persistent-hint,
      autocomplete='sde_login_form_hsvv',
      hint='Введите номер клиента в нашей системе. Если вы новый клиент укажите название компании.',
      label='Номер клиента в системе SDE'
    )
  v-scroll-y-transition
    v-text-field(
      v-if='showPassword',
      :prepend-inner-icon='$icons.password',
      :append-icon='$icons.login',
      @click:append='onLoginClient',
      type='password',
      v-model='password',
      :color='color',
      persistent-hint,
      autocomplete='sde_password_form_mxxt',
      hint='Введите пароль клиента в нашей системе.',
      label='Пароль клиента в системе SDE'
    )
  v-scroll-y-transition
    v-switch(v-show='showPassword', v-model='needRemember', label='Запомнить меня')
  v-slide-y-transition
    template(v-if='client && !isNewClient')
      v-list(v-if='client')
        v-list-item.px-0
          v-list-item-content
            v-list-item-title Авторизованы под ID {{client.CLIENT}}
            v-list-item-subtitle Пользователь: {{client.customer_name}}
          v-list-item-action
            v-btn(icon, @click='removeClient')
              v-icon {{$icons.close}}
</template>

<script>
import _ from 'lodash'
import { colors } from '@/mixins/'
import { mapActions, mapMutations, mapState } from 'vuex'
import { clientApi as api } from '@/api/'
import bcrypt from 'bcryptjs'

export default {
  name: 'ClientField',

  mixins: [colors],

  data: () => ({
    isOpen: false,
    isLoading: false,

    errMsg: '',
    sucMsg: '',

    clientTemp: undefined,
    value: '',
    showPassword: false,
    needRemember: false,
    password: '',
  }),

  computed: {
    ...mapState(['client', 'isNewClient']),
  },

  methods: {
    ...mapActions(['GET_CLIENT', 'SET_NEW_CLIENT']),
    ...mapMutations(['RESET_STATE']),
    async removeClient() {
      this.RESET_STATE()
      localStorage.removeItem('rememberedUserID')
      this.value = undefined
      this.sucMsg = ''
      this.errMsg = ''
    },
    async pingUser() {
      this.isLoading = true
      if (!this.value) {
        this.errMsg = 'Обязательное поле для заполнения.'
        this.RESET_STATE()
        this.isLoading = false
        this.showPassword = false
        this.client = undefined
        return
      }

      try {
        const clientPing = await api.getClient(this.value)

        if (clientPing.status === 200) {
          this.clientTemp = clientPing.data
          this.showPassword = true
        } else {
          this.clientTemp = undefined
          this.showPassword = false
        }
      } catch (e) {
        this.clientTemp = undefined
        this.showPassword = false
        await this.SET_NEW_CLIENT(this.value)
      }

      this.isLoading = false
    },
    async onLoginClient() {
      if (!this.clientTemp) {
        this.$notification.error('Не удалось получить данные клиента.')
        return false
      }

      if (this.clientTemp.password === null) {
        if (this.clientTemp.hash === this.password) {
          const status = await this.GET_CLIENT(this.value)

          switch (status) {
            case 200:
              this.errMsg = ''
              this.sucMsg = 'Успешный ввод.'
              this.$notification.success('Успешная авторизация.')
              this.showPassword = false
              if (this.needRemember) {
                localStorage.setItem('rememberedUserID', this.value)
              }
              break
            case 500:
              this.errMsg =
                'Произошла ошибка. Перезагрузите страницу и попробуйте ещё раз, или свяжитесь с администрацией сайта.'
              this.RESET_STATE()
              break
            default:
              this.errMsg =
                'Произошла ошибка. Перезагрузите страницу и попробуйте ещё раз, или свяжитесь с администрацией сайта.'
              this.RESET_STATE()
          }
        } else {
          this.$notification.error('Неверный пароль.')
        }
      } else {
        let client = _.cloneDeep(this.clientTemp)
        client.password = client.password.replace('$2y$', '$2a$')
        bcrypt.compare(this.password, client.password, async (err, res) => {
          if (err) {
            console.debug(err)
            this.$notification.error('Ошибка при проверке пароля. Попробуйте снова.')
            return false
          }

          if (!res) {
            this.$notification.error('Неверный пароль.')
            return false
          }

          const status = await this.GET_CLIENT(this.value)

          switch (status) {
            case 200:
              this.errMsg = ''
              this.sucMsg = 'Успешный ввод.'
              this.$notification.success('Успешная авторизация.')
              this.showPassword = false
              if (this.needRemember) {
                localStorage.setItem('rememberedUserID', this.value)
              }
              break
            case 500:
              this.errMsg =
                'Произошла ошибка. Перезагрузите страницу и попробуйте ещё раз, или свяжитесь с администрацией сайта.'
              this.RESET_STATE()
              break
            default:
              this.errMsg =
                'Произошла ошибка. Перезагрузите страницу и попробуйте ещё раз, или свяжитесь с администрацией сайта.'
              this.RESET_STATE()
          }
        })
      }
    },
  },

  watch: {
    value(value) {
      if (value !== undefined) {
        this.debouncedPingUser()
      }
    },
  },

  async created() {
    this.debouncedPingUser = _.debounce(this.pingUser, 500)
  },
}
</script>

<style scoped></style>
