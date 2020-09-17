<template lang="pug">
v-card.elevation-3.address-picker(v-if='addressList.length > 0')
  add-address-dialog
    template(#button='{open}')
      .add-address
        v-btn(@click='open', :color='defaultAddAddressColor', text)
          v-icon(left, :color='defaultAddAddressColor') mdi-plus
          | {{ $t("addressField.btn") }}

  draggable.address-list.py-8(v-model='addressList', @start='drag = true', @end='drag = false', v-bind='dragOptions')
    transition-group(type='transition', :name='!drag ? "list" : null')
      .address.elevation-1(v-for='address in addressList', :key='address.id')
        keep-alive
          address-fields(:address='address')
            template(#buttons='{remove}')
              v-row.text-center
                v-col
                  add-alias-dialog(:alias='address', v-if='!address.isAlias')
                    template(#button='{open}')
                      v-btn(@click='open', color='success', text, :content='$t("aliasField.tip")', v-tippy)
                        v-icon(left) mdi-bookmark-plus
                        | {{$t("aliasField.btn")}}
                v-col
                  v-btn(@click='remove', color='error', text, :content='$t("addressFields.removeTip")', v-tippy)
                    v-icon(left) mdi-trash-can
                    | {{$t("addressFields.removeBtn")}}
            template(#default='{on, show}')
              template(v-if='isMobile')
                v-row.buttons-row
                  v-col
                    .address-move
                      v-btn(icon)
                        v-icon mdi-cursor-move
                  v-col
                    v-btn.address-settings-btn(@click='on', icon)
                      template(v-if='show')
                        v-icon mdi-close
                      template(v-else)
                        v-icon mdi-cog
                v-row.address-name-row
                  span.address-name {{address.address}}
              template(v-else)
                .address-move
                  v-btn(icon)
                    v-icon mdi-cursor-move
                span.address-name {{address.address}}
                v-btn.address-settings-btn(@click='on', icon)
                  template(v-if='show')
                    v-icon mdi-close
                  template(v-else)
                    v-icon mdi-cog
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { breakpoints, colors } from '@/mixins'

import AddAliasDialog from '@/components/dialogs/AddAliasDialog.vue'
import AddAddressDialog from '@/components/dialogs/AddAddressDialog.vue'
import AddressFields from '@/components/AddressFields.vue'
import draggable from 'vuedraggable'

import { addressesModule } from '@/store'

@Component({
  components: {
    AddAliasDialog,
    AddAddressDialog,
    draggable,
    AddressFields
  }
})
export default class AddressPicker extends Mixins(breakpoints, colors) {
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
