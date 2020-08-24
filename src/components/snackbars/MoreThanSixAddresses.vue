<template lang="pug">
v-snackbar(v-model='moreThanSixAddresses', color='error', timeout='10000', left='left', top='top')
  | Максимальное количество адресов в заявке - 6.
  template(v-slot:action='{ attrs }')
    v-btn(dark='', text='', v-bind='attrs', @click='moreThanSixAddresses = false')
      | Закрыть
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: '',

  props: {},

  data: () => ({}),

  computed: {
    moreThanSixAddresses: {
      get() {
        return this.$store.state.moreThanSixAddresses
      },
      set(value) {
        this.$store.state.moreThanSixAddresses = value
      },
    },
  },

  methods: {},

  watch: {},

  created() {},
}
</script>

<style lang="stylus" scoped></style>
