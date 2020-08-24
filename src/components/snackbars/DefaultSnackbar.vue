<template lang="pug">
v-snackbar(v-model='msg', :color='color', left='left', timeout='7000', top='top')
  | {{ text }}
  template(v-slot:action='{ attrs }')
    v-btn(dark='', text='', v-bind='attrs', @click='msg = false')
      | Закрыть
</template>

<script>
import { unicornBus } from '@/main'

export default {
  name: 'DefaultSnackbar',

  props: {},

  data: () => ({
    msg: false,
    color: '',
    text: '',
  }),

  computed: {},

  methods: {},

  watch: {},

  created() {
    unicornBus.$on('order-sended-saved', data => {
      this.msg = true
      this.color = 'success'
      this.text = `Заявка ${data} успешно сохранена и передана в работу.`
    })
    unicornBus.$on('order-sended', data => {
      this.msg = true
      this.color = 'success'
      this.text = `Заявка ${data} успешно передана в работу.`
    })
    unicornBus.$on('order-sended-error', () => {
      this.msg = true
      this.color = 'error'
      this.text = 'Произошла ошибка при отправке заявки. Попробуйте снова или свяжитесь с администрацией сайта.'
    })
  },
}
</script>

<style lang="stylus" scoped></style>
