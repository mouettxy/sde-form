<template lang="pug">
v-card.elevation-3.address-picker(v-if='addressList.length > 0')
  v-dialog(v-model='addressDialog', max-width='50%', :fullscreen='isMobile', transition='dialog-bottom-transition')
    v-card
      v-card-title
        span {{ $t("addressField.header") }}
        v-spacer
        v-btn(icon, @click='addressDialog = false')
          v-icon mdi-close
      v-card-text
        address-field

  .add-address
    v-btn(@click='addressDialog = true', :color='defaultAddAddressColor', text)
      v-icon(left, :color='defaultAddAddressColor') mdi-plus
      | {{ $t("addressField.btn") }}

  draggable.address-list.py-8(v-model='addressList', @start='drag = true', @end='drag = false', v-bind='dragOptions')
    transition-group(type='transition', :name='!drag ? "list" : null')
      .address.elevation-1(v-for='address in addressList', :key='address.id')
        keep-alive
          address-fields(:address='address')
            template(#default='{on}')
              template(v-if='isMobile')
                v-row.buttons-row
                  v-col
                    .address-move
                      v-btn(icon)
                        v-icon mdi-cursor-move
                  v-col
                    v-btn.address-settings-btn(@click='on', icon)
                      v-icon mdi-cog
                v-row.address-name-row
                  span.address-name {{address.address}}
              template(v-else)
                .address-move
                  v-btn(icon)
                    v-icon mdi-cursor-move
                span.address-name {{address.address}}
                v-btn.address-settings-btn(@click='on', icon)
                  v-icon mdi-cog
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { breakpoints, colors } from '@/mixins'

import AddressField from '@/components/AddressField.vue'
import AddressFields from '@/components/AddressFields.vue'
import draggable from 'vuedraggable'

import { addressesModule } from '@/store'

@Component({
  components: {
    AddressField,
    draggable,
    AddressFields
  }
})
export default class AddressPicker extends Mixins(breakpoints, colors) {
  public addressDialog = false
  public drag = false

  get dragOptions() {
    return {
      animation: 200,
      handle: '.address-move',
      group: 'description',
      disabled: false,
      ghostClass: 'ghost',
      forceFallback: true
    }
  }

  get addressList() {
    return addressesModule.addressList
  }

  set addressList(val) {
    addressesModule.updateList(val)
  }
}
</script>

<style lang="sass">
.address-picker
  margin-top: 12px
  padding: 12px

  .address
    margin-top: 12px

    .address-fields

      .address-header

        &.desktop
          padding: 8px
          display: flex
          flex-direction: row
          justify-content: space-between
          align-content: center

        &.mobile
          .address-name-row
            margin-left: 0
            margin-right: 0
            text-align: center
            padding: 12px
          .buttons-row
            text-align: center

    &:first-child
      margin-top: 0

    .address-name
      width: 100%
      font-size: 18px
      margin-top: 4px
</style>
