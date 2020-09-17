<template lang="pug">
v-slide-y-transition
  .address-buttons
    template(v-if='pricesOverall')
      v-btn(color='primary', block) Предпросмотр заявки
      v-btn(color='primary', block) Вызвать экспедитора
      v-btn(color='primary', block) Сохранить заявку
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { addressesModule } from '@/store'
@Component
export default class AddressButtons extends Vue {
  get pricesOverall() {
    if (addressesModule.prices) {
      return addressesModule.prices.overall > 0
    }

    return false
  }
}
</script>

<style lang="sass">
.address-buttons
  margin-top: 12px

  .v-btn
    margin-top: 6px
    &:first-child
      margin-top: 0
</style>
