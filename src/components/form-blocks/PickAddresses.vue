<template lang="pug">
.pick-addresses__main(v-if='addressList')
  v-slide-y-transition
    v-card
      keep-alive
        Addresses
      CompleteAddressFields(v-if='priceList && client')
  v-scroll-x-transition(v-if='isLoading')
    .pick-addresses__main-loader(:class='{"accent2": isDark, "white": !isDark}', v-if='isLoading')
      .pick-addresses__main-loader-wrap
        v-progress-circular(indeterminate, color='primary', size='64')
</template>

<script>
import { mapState } from 'vuex'
import Addresses from '@/components/Addresses'
import CompleteAddressFields from '@/components/CompleteAddressFields'
import _ from 'lodash'
import { colors } from '@/mixins/'

export default {
  name: 'PickAddresses',

  components: {
    Addresses,
    CompleteAddressFields,
  },

  mixins: [colors],

  props: [],

  data: () => ({
    isLoading: false,
  }),

  computed: {
    ...mapState(['priceList', 'client', 'addressList']),
    size() {
      return _.size(this.addressList)
    },
  },

  methods: {},

  watch: {
    addressList: function(n) {
      this.isLoading = true
      setTimeout(() => {
        this.isLoading = false
      }, 1000)
    },
  },

  created() {},
}
</script>

<style lang="stylus">
.pick-addresses__main
  margin-top 12px
  position relative

  .pick-addresses__main-loader
    position absolute
    z-index 1000
    top 0
    height 100%
    width 100%

  .pick-addresses__main-loader-wrap
    position relative
    top calc(50% - 50px)
    left calc(50% - 20px)
</style>
