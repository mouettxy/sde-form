<template lang="pug">
.order-view
  v-slide-x-transition(appear)
    template(v-show='state === "filling"')
      .order-view__cards
        user-auth
        user-favorite
        address-picker
        address-info
        address-buttons
  v-slide-y-reverse-transition(leave-absolute, mode='out-in')
    template(v-if='state === "completing"')
      SendOrder(@back='fromSendOrder()')
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { colors, breakpoints } from '@/mixins'

import UserAuth from '@/components/UserAuth.vue'
import UserFavorite from '@/components/UserFavorite.vue'
import AddressPicker from '@/components/AddressPicker.vue'
import AddressInfo from '@/components/AddressInfo.vue'
import AddressButtons from '@/components/AddressButtons.vue'

import { authModule } from '@/store'

@Component({
  components: {
    UserAuth,
    UserFavorite,
    AddressPicker,
    AddressInfo,
    AddressButtons
  }
})
export default class OrderView extends Mixins(colors, breakpoints) {
  @Prop(String) state?: string

  get isLoggedIn() {
    return authModule.isLoggedIn
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
