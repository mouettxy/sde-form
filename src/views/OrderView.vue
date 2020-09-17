<template lang="pug">
.order-view
  v-slide-x-transition(appear)
    template(v-show='state === "order"')
      .order-view__cards
        user-auth
        user-favorite
        address-picker
        address-info
        address-buttons(@previw='toPreview')
  v-slide-y-reverse-transition(leave-absolute, mode='out-in')
    template(v-if='state === "preview"')
      order-preview(@back='fromPreview')
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { colors, breakpoints } from '@/mixins'

import UserAuth from '@/components/UserAuth.vue'
import UserFavorite from '@/components/UserFavorite.vue'
import AddressPicker from '@/components/AddressPicker.vue'
import AddressInfo from '@/components/AddressInfo.vue'
import AddressButtons from '@/components/AddressButtons.vue'
import OrderPreview from '@/views/OrderPreview.vue'

import { authModule } from '@/store'

@Component({
  components: {
    UserAuth,
    UserFavorite,
    AddressPicker,
    AddressInfo,
    AddressButtons,
    OrderPreview
  }
})
export default class OrderView extends Mixins(colors, breakpoints) {
  @Prop(String) state?: string

  get isLoggedIn() {
    return authModule.isLoggedIn
  }

  fromPreview() {
    this.state = 'order'
  }

  toPreview() {
    this.state = 'preview'
  }
}
</script>

<style lang="sass">
.order-view
  padding: 12px
  overflow-y: scroll
  height: $height-mobile-sde

  .vertical-spacer
    height: 256px
</style>
