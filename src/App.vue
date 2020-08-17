<template lang="pug">
v-app
  v-main
    sdeForm
</template>

<script>
import sdeForm from '@/components/sdeForm'

export default {
  name: 'App',

  components: {
    sdeForm,
  },

  data: () => ({}),

  created() {
    window.addEventListener('resize', () => {
      let vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    })
  },
}
</script>

<style lang="stylus">
html
  overflow hidden !important
  height 100%

body
  overflow hidden
  min-height 100%
  width 100%
</style>
