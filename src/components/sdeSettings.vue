<template lang="pug">
.settings__main
  v-card.elevation-6.settings__main-wrap
    v-switch(v-model='$vuetify.theme.dark', label='Тёмная тема')
    v-switch(
      v-model='fillDefaultClientAddressWrapper',
      label='"От нас" как начало всех заявок',
      persistent-hint,
      :disabled='!isRememberedUser'
    )
</template>

<script>
import _ from 'lodash'

import colors from '@/mixins/colors'
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: '',

  mixins: [colors],

  props: [],

  data: () => ({
    isOpen: false,

    fillDefaultClientAddress: localStorage.getItem('fillDefaultClientAddress') === 'true',
    rememberedUserID: localStorage.getItem('rememberedUserID') || undefined,
  }),

  computed: {
    ...mapState(['client']),
    fillDefaultClientAddressWrapper: {
      get() {
        return this.fillDefaultClientAddress
      },
      set(value) {
        this.fillDefaultClientAddress = value
        localStorage.setItem('fillDefaultClientAddress', value)
        document.location.reload()
      },
    },
    isRememberedUser() {
      return !!localStorage.getItem('rememberedUserID')
    },
  },

  methods: {
    ...mapActions(['GET_CLIENT']),
    ...mapMutations(['RESET_STATE']),
  },

  watch: {
    isDark(val) {
      localStorage.setItem('isDarkTheme', val)
    },
  },

  mounted() {},
}
</script>

<style lang="stylus" scoped>
full-page()
  height 100vh
  height calc(100vh - 50px)

.settings__main
  full-page()
  padding 6px

  .settings__main-wrap
    padding 12px
</style>
