<template lang="pug">
.order-view
  v-slide-x-transition(appear)
    template(v-show='state === "filling"')
      .fields__addresses(flat)
        .fields__addresses-wrap
          user-auth
          user-favorite
          address-picker
          address-info
          // -
            template(v-if='priceList')
            v-btn(color='primary', block, @click='toSendOrder()', v-if='priceList.overall') Вызвать экспедитора
            v-spacer
  v-slide-y-reverse-transition(leave-absolute, mode='out-in')
    template(v-if='state === "completing"')
      SendOrder(@back='fromSendOrder()')
  .vertical-spacer
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { colors, breakpoints } from '@/mixins'

import UserAuth from '@/components/UserAuth.vue'
import UserFavorite from '@/components/UserFavorite.vue'
import AddressPicker from '@/components/AddressPicker.vue'
import AddressInfo from '@/components/AddressInfo.vue'

import { authModule } from '@/store'

@Component({
  components: {
    UserAuth,
    UserFavorite,
    AddressPicker,
    AddressInfo
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
