<template lang="pug">
v-card.order-preview(:class='{"mobile": isMobile}')
  v-card-title
    .order-preview__header
      v-btn(icon, @click='closePreview', size='60px')
        v-icon {{ $icons.leftArrow }}
      span Оформление заявки
  v-card-text
    v-card.order-preview__main.elevation-3
      v-timeline(dense)
        v-timeline-item.order-preview__buttons(icon='mdi-check')
          v-card.pa-2
            v-btn(color='primary', block, @click='sendOrder') {{$t("orderPreview.sendOrder")}}
            add-order-dialog
              template(#buttons='{openDialog}')
                v-btn(color='primary', block, @click='openDialog')
        v-timeline-item.order-preview__client(icon='mdi-account')
          v-card
            v-card-title.secondary.send-order__client-header.text-wrap
              template(v-if='isNewClient')
                span {{$t("orderPreview.newClientDisclaimer")}}
              template(v-if='user && !isNewClient')
                v-icon(color='#181818') mdi-account
                span {{ user.CLIENT }} {{user.customer_name}}
        v-timeline-item.send-order__address(
          v-for='address in addresses',
          :key='address.id',
          fill-dot,
          small,
          icon='mdi-map-marker'
        )
          address-preview(:address='address')
        v-timeline-item.send-order__info(fill-dot, small, :icon='$icons.info', v-if='addresses')
          address-info-preview(:info='information')
        v-timeline-item.send-order__price(icon='mdi-cash-marker')
          address-prices-preview(:prices='prices')
        v-timeline-item.order-preview__buttons(icon='mdi-check')
          v-card.pa-2
            v-btn(color='primary', block, @click='sendOrder') {{$t("orderPreview.sendOrder")}}
            add-order-dialog
              template(#buttons='{openDialog}')
                v-btn(color='primary', block, @click='openDialog')
</template>

<script>
import { Component, Mixins } from 'vue-property-decorator'
import { colors, breakpoints } from '@/mixins/'
import { addressesModule, authModule } from '@/store'
import { cloneDeep } from 'lodash'

import AddOrderDialog from '@/components/dialogs/AddOrderDialog.vue'
import AddressInfoPreview from '@/components/order-preview/AddressInfoPreview.vue'
import AddressPreview from '@/components/order-preview/AddressPreview.vue'
import AddressPricesPreview from '@/components/order-preview/AddressPricesPreview.vue'

@Component({
  components: {
    AddOrderDialog,
    AddressInfoPreview,
    AddressPreview,
    AddressPricesPreview
  }
})
export default class OrderPreview extends Mixins(colors, breakpoints) {
  get information() {
    return cloneDeep(addressesModule.information)
  }

  get addresses() {
    return cloneDeep(addressesModule.addresses)
  }

  get prices() {
    return cloneDeep(addressesModule.prices)
  }

  get routes() {
    return cloneDeep(addressesModule.routes)
  }

  get user() {
    return cloneDeep(authModule.user)
  }

  get isNewUser() {
    return typeof authModule.user === 'string'
  }

  closePreview() {
    this.$emit('back')
  }

  /* async callExpeditor(needSave) {
      if (needSave) {
        if (!this.addressSaveName) {
          this.addressSaveErrors = 'Обязательно укажите имя сохранённого адреса.'
          return
        }

        if (
          _.includes(
            _.map(this.client.saved_orders, (e) => e.name),
            this.addressSaveName
          )
        ) {
          this.addressSaveErrors = 'Адрес с таким именем уже существует'
          return
        }

        const results = this.formatData()
        const state = {
          name: this.addressSaveName,
          addressInfo: this.addressInfo,
          addressList: this.addressList,
          priceList: this.priceList,
          route: this.route
        }

        this.SEND_ORDER({ results, state, needSave })
      } else {
        const results = this.formatData()

        this.SEND_ORDER({ results })
      }
    }, */
}
</script>

<style lang="stylus">
colors = {
  primary: #ffcc01,
  black: #181818,
  secondary: #E0E0E0,
  white: #fff
}

full-page()
  height calc(100vh - 50px)

+prefix-classes('send-order__')
  .main
    padding 6px
    z-index 100
    position absolute
    top -8px
    width calc(100% + 6px)

    &.is-mobile
      padding 6px
      z-index 100
      position absolute
      top -6px
      width calc(100% + 6px)

    .main-wrap
      overflow scroll
      full-page()
      padding 6px

      .client
        .client-header
          background colors.primary
          color colors.black
          font-size 1rem
          font-weight 400

      .address
        .address-wrap
          .address-header
            background colors.primary
            color colors.black
            font-size 1rem
            font-weight 400

      .info
        .info-header
          background colors.primary
          color colors.black
          font-size 1rem
          font-weight 400

      .price
        .price-header
          background colors.primary
          color colors.black
          font-size 1rem
          font-weight 400

        .price-table
          .price-final-row
            background colors.secondary

          .line-through
            text-decoration line-through

      .top-actions-block
        font-size 1.4rem

.send-order__info-text
  .v-list-item
    padding 0

    .v-icon
      margin-bottom 2px

.send-order__address-text
  .v-list-item
    padding 0

    .v-icon
      margin-bottom 2px

.send-order__price
  .v-list-item
    padding 0

    .v-icon
      margin-bottom 2px

.text-wrap
  word-break break-word
</style>
