<template lang="pug">
v-card.elevation-3.address-picker(v-if='addressList.length > 0')
  v-dialog(v-model='addressDialog', max-width='50%', :fullscreen='isMobile')
    v-card
      v-card-title
        span Выберите адрес
      v-card-text
        address-field

  .add-address
    v-btn(@click='addressDialog = true', :color='defaultAddAddressColor', text)
      v-icon(left, :color='defaultAddAddressColor') mdi-plus
      | Добавить адрес

  .address-list.py-8
    v-card.address.elevation-1(v-for='address in addressList', :key='address.id')
      .address-move
        template(v-if='isMobile')
          v-btn(icon)
            v-icon mdi-arrow-up
          v-btn(icon)
            v-icon mdi-arrow-down
        template(v-else)
          v-btn(icon)
            v-icon mdi-cursor-move
      span.address-name {{address.address}}
      v-btn.address-settings-btn(icon)
        v-icon mdi-cog
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Mixins } from 'vue-property-decorator'
import { breakpoints, colors } from '@/mixins'

import AddressField from '@/components/AddressField.vue'

import { addressesModule } from '@/store'

@Component({
  components: {
    AddressField
  }
})
export default class AddressPicker extends Mixins(breakpoints, colors) {
  public addressDialog = false

  get addressList() {
    return addressesModule.addressList
  }
}
</script>

<style lang="sass" scoped>
.address-picker
  margin-top: 12px
  padding: 12px

  .address
    display: flex
    flex-direction: row
    justify-content: space-between
    align-content: center

    .address-name
      font-size: 18px
      margin-top: 4px
</style>
