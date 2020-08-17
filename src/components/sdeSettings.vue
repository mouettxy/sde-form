<template lang="pug">
.settings__main
  v-card.elevation-6.settings__main-wrap
    v-switch(v-model='$vuetify.theme.dark', label='Тёмная тема')
    v-text-field(
      :prepend-inner-icon='$icons.user',
      :loading='isLoading',
      :success-messages='sucMsg',
      :error-messages='errMsg',
      v-model='value',
      :color='color',
      persistent-hint,
      autocomplete='false',
      hint='Сохраните номер клиента что бы не вводить его несколько раз.',
      label='Номер клиента в системе SDE'
    )
</template>

<script>
import _ from 'lodash'
import ClientField from '@/components/ClientField'

import colors from '@/mixins/colors'
import { mapActions, mapMutations } from 'vuex'

export default {
  name: '',

  mixins: [colors],

  components: {
    ClientField,
  },

  props: [],

  data: () => ({
    isOpen: false,
    isLoading: false,

    errMsg: '',
    sucMsg: '',

    value: '',
  }),

  computed: {},

  methods: {
    ...mapActions(['GET_CLIENT']),
    ...mapMutations(['RESET_STATE']),
    async getUserData() {
      this.isLoading = true

      const a = (type, msg, id) => {
        const b = () => {
          this.RESET_STATE
          localStorage.removeItem('rememberedUserID')
          this.isLoading = false
        }
        if (type === 'err') {
          this.errMsg = ''
          this.sucMsg = msg
          b()
        } else if (type === 'realErr') {
          this.sucMsg = ''
          this.errMsg = msg
          b()
        } else if (type === 'suc') {
          this.errMsg = ''
          this.sucMsg = msg
          localStorage.setItem('rememberedUserID', id)
          this.isLoading = false
        }
      }
      if (!this.value) {
        a('err', 'Успешное удаление пользователя (если таковой был) из памяти.')
        return
      }

      const status = await this.GET_CLIENT(this.value)

      switch (status) {
        case 200:
          a('suc', 'Пользователь сохранён на данном устройстве.', this.value)
          break
        case 204:
          a(
            'realErr',
            'Невозможно запомнить нового пользователя. Свяжитесь с администрацией сайта что бы получить постоянный идентификатор клиента.'
          )
          break
        case 500:
          a(
            'realErr',
            'Произошла ошибка. Перезагрузите страницу и попробуйте ещё раз, или свяжитесь с администрацией сайта.'
          )
          break
        default:
          a(
            'realErr',
            'Произошла ошибка. Перезагрузите страницу и попробуйте ещё раз, или свяжитесь с администрацией сайта.'
          )
      }
    },
  },

  watch: {
    isDark(val) {
      localStorage.setItem('isDarkTheme', val)
    },
    value(value) {
      this.debouncedUserData()
    },
  },

  mounted() {
    this.debouncedUserData = _.debounce(this.getUserData, 500)
  },
}
</script>

<style lang="stylus" scoped>
full-page()
  height 100vh
  height calc(var(--vh, 1vh) * 100)

.settings__main
  full-page()
  display flex
  flex-direction column
  padding 6px

  .settings__main-wrap
    padding 12px
</style>
