export default {
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.xl || this.$vuetify.breakpoint.lg || this.$vuetify.breakpoint.md ? false : true
    },
    breakpoints() {
      let a = this.$vuetify.breakpoint
      return [a.xl, a.lg, a.md, a.sm, a.xs]
    },
  },
}
