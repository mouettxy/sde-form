<template lang="pug">
.client__field
  v-text-field(
    :prepend-inner-icon='$icons.user',
    :loading='isLoading',
    :success-messages='sucMsg',
    :error-messages='errMsg',
    v-model='value',
    :color='color',
    persistent-hint,
    autocomplete='false',
    hint='Введите номер клиента в нашей системе. Если вы новый клиент укажите название компании.',
    label='Номер клиента в системе SDE'
  )
</template>

<script>
import _ from 'lodash'
import { colors } from '@/mixins/'
import { mapActions, mapMutations } from 'vuex'

export default {
  name: 'ClientField',

  mixins: [colors],

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
      if (!this.value) {
        this.errMsg = 'Обязательное поле для заполнения.'
        this.RESET_STATE
        this.isLoading = false
        return
      }

      const status = await this.GET_CLIENT(this.value)

      switch (status) {
        case 200:
          this.errMsg = ''
          this.sucMsg = 'Успешный ввод.'
          break
        case 204:
          this.errMsg = ''
          this.sucMsg =
            'Добро пожаловать. Свяжитесь с администрацией сайта что бы получить постоянный идентификатор клиента.'
          break
        case 500:
          this.errMsg =
            'Произошла ошибка. Перезагрузите страницу и попробуйте ещё раз, или свяжитесь с администрацией сайта.'
          this.RESET_STATE
          break
        default:
          this.errMsg =
            'Произошла ошибка. Перезагрузите страницу и попробуйте ещё раз, или свяжитесь с администрацией сайта.'
          this.RESET_STATE
      }
      this.isLoading = false
    },
  },

  watch: {
    value(value) {
      this.debouncedUserData()
    },
  },

  created() {
    this.debouncedUserData = _.debounce(this.getUserData, 500)
  },
}
</script>

<style scoped></style>
