<template lang="pug">
v-card.price-label-m__main.elevation-12(v-if='isMobile')
  animated-number.price-label-m__price.black--text(
    :color='color',
    easing='easeInOutSine',
    :value='priceList.overall',
    :duration='800',
    :formatValue='formatToPrice'
  )
  v-icon.black--text(size='2rem') {{ $icons.rub }}
v-card.price-label__main.elevation-12(v-else)
  v-icon.black--text(size='2rem') {{ $icons.rub }}
  animated-number.price-label__price.black--text(
    easing='easeInOutSine',
    :value='priceList.overall',
    :duration='800',
    :formatValue='formatToPrice'
  )
</template>

<script>
import { mapState } from 'vuex'
import AnimatedNumber from 'animated-number-vue'

import { colors, breakpoints } from '@/mixins/'

export default {
  name: '',

  mixins: [colors, breakpoints],

  props: [],

  components: {
    AnimatedNumber,
  },

  data: () => ({}),

  computed: {
    ...mapState(['priceList']),
  },

  methods: {
    formatToPrice(value) {
      return `${Number(value).toFixed(0)}`
    },
  },

  watch: {},

  created() {},
}
</script>

<style lang="stylus" scoped>
.price-label__main
  position absolute
  top 50%
  right 0
  padding 6px
  background #ffcc01

  .price-label__price
    display inline-block
    vertical-align middle
    font-size 1.5rem

.price-label-m__main
  position absolute
  top calc(100% - 60px)
  left 0
  padding 6px
  background #ffcc01

  .price-label-m__price
    display inline-block
    vertical-align middle
    font-size 1.5rem
</style>
