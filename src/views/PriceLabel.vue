<template lang="pug">
v-card.elevation-12(:class='{"price-label-m__main": isMobile, "price-label__main": !isMobile}')
  animated-number.price-label-m__price.black--text(
    :color='color',
    easing='easeInOutSine',
    :value='priceList.overall',
    :duration='800',
    :formatValue='formatToPrice'
  )
  v-icon.black--text(size='2rem') {{ $icons.rub }}
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { colors, breakpoints } from '@/mixins/'

import { addressesModule } from '@/store'

@Component
export default class PriceLabel extends Mixins(colors, breakpoints) {
  public pricesOverall?: number = addressesModule.prices?.overall || undefined

  formatToPrice(value: string | number) {
    return `${Number(value).toFixed(0)}`
  }
}
</script>

<style lang="sass" scoped>
.price-label__main
  z-index: 1000
  position: absolute
  top: 50%
  right: 0
  padding: 6px
  background: #ffcc01

  .price-label__price
    display: inline-block
    vertical-align: middle
    font-size: 1.5rem

.price-label-m__main
  z-index: 1000
  position: absolute
  top: calc(100% - 120px)
  left: 0
  padding: 6px
  background: #ffcc01

  .price-label-m__price
    display: inline-block
    vertical-align: middle
    font-size: 1.5rem
</style>
