<template lang="pug">
v-card.fields__settings(flat)
  .fields__settings-wrap
    sdeSettings
</template>

<script>
import sdeSettings from '@/components/sdeSettings'

export default {
  name: 'SettingsBlock',

  components: {
    sdeSettings,
  },

  props: [],

  data: () => ({}),

  computed: {},

  methods: {},

  watch: {},

  created() {},
}
</script>

<style lang="stylus" scoped></style>
