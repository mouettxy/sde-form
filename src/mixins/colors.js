export default {
  computed: {
    color() {
      return this.$vuetify.theme.isDark ? 'primary' : '#181818'
    },
    colorTab() {
      return this.$vuetify.theme.isDark ? '#181818' : '#f0f0f0'
    },
    colorTabText() {
      return this.$vuetify.theme.isDark ? 'primary' : '#181818'
    },
    isDark() {
      return this.$vuetify.theme.dark
    },
  },
}
