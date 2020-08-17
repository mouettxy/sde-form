<template lang="pug">
.fields__main
  v-snackbar(v-model='msg', :color='msgColor', left='left', timeout='7000', top='top')
    | {{msgText}}
    template(v-slot:action='{ attrs }')
      v-btn(dark='', text='', v-bind='attrs', @click='msg = false')
        | Закрыть

  v-container.fields__main-wrap(fluid)
    v-row.fields__row
      v-col.fields__cols.fields__panel(cols='12', lg='5', md='6')
        v-card.fields__panel-wrap(elevation='6')
          v-tabs.fields__panel-tabs(
            v-model='active',
            :background-color='colorTab',
            :color='colorTabText',
            center-active,
            :next-icon='$icons.rightArrow',
            :prev-icon='$icons.leftArrow',
            show-arrows,
            grow
          )
            v-tab Настройки
            v-tab Оформите заявку
            v-tab(v-if='isMobile') Карта
            v-tab-item
              v-card.fields__settings(flat)
                perfect-scrollbar.fields__settings-wrap
                  sdeSettings
            v-tab-item
              v-slide-x-transition
                template(v-if='state === "filling"')
                  v-card.fields__addresses(flat)
                    perfect-scrollbar.fields__addresses-wrap
                      v-card.fields__addresses-inputs.elevation-6
                        ClientField(v-if='!isRememberedUser')
                        AddressField(:disabled='!$store.state.client')
                      ClientFavorites
                      Addresses
                      CompleteAddressFields(v-if='priceList && client')
                      template(v-if='priceList')
                        v-btn(color='primary', block, @click='toSendOrder()', v-if='priceList.overall') Вызвать экспедитора
                      v-spacer
              v-slide-x-transition
                template(v-if='state === "completing"')
                  perfect-scrollbar.fields__send-order-wrap
                    SendOrder(@back='fromSendOrder()', @order-sended='orderSended', @order-sended-error='orderSendedError')
                    v-spacer
            v-tab-item(v-if='isMobile')
              sdeMap.fields__map(style='height: 90vh')
      v-col.fields__cols.fields__map(cols='12', lg='7', md='6', v-if='!isMobile')
        sdeMap
    v-scale-transition
      PriceLabel(v-if='priceList && priceList.overall')
</template>

<script>
import _ from 'lodash'
import ClientFavorites from '@/components/ClientFavorites'
import AddressField from '@/components/AddressField'
import Addresses from '@/components/Addresses'
import ClientField from '@/components/ClientField'
import PriceLabel from '@/components/PriceLabel'
import CompleteAddressFields from '@/components/CompleteAddressFields'
import sdeMap from '@/components/sdeMap'
import sdeSettings from '@/components/sdeSettings'
import SendOrder from '@/components/SendOrder'

import { mapState, mapActions } from 'vuex'

import { colors, breakpoints } from '@/mixins/'

export default {
  name: 'sdeForm',

  components: {
    AddressField,
    ClientField,
    ClientFavorites,
    Addresses,
    PriceLabel,
    CompleteAddressFields,
    sdeSettings,
    SendOrder,
    sdeMap,
  },

  mixins: [colors, breakpoints],

  data: () => ({
    msg: false,
    msgColor: 'success',
    msgText: '',
    state: 'filling',
    active: 2,
  }),

  computed: {
    ...mapState(['priceList', 'client']),
    isRememberedUser() {
      if (localStorage.getItem('rememberedUserID')) {
        const userId = parseInt(localStorage.getItem('rememberedUserID'))
        if (!isNaN(userId)) {
          return userId
        }
      }
      return false
    },
  },

  methods: {
    ...mapActions(['GET_CLIENT', 'RESET_FORM']),
    toSendOrder() {
      this.state = 'completing'
    },
    fromSendOrder() {
      this.state = 'filling'
    },
    async orderSended(info) {
      this.state = 'filling'
      this.msg = true
      this.msgColor = 'success'
      this.msgText = `Заявка ${info.id} успешно передана в работу.`

      this.RESET_FORM
      await this.GET_CLIENT(info.client)
    },
    async orderSendedError() {
      this.msg = true
      this.msgColor = 'error'
      this.msgText = 'Не удалось передать заявку в работу. Попробуйте снова, или свяжитесь с администрацией сайта.'

      this.RESET_FORM
      if (this.isRememberedUser) {
        await this.GET_CLIENT(this.isRememberedUser)
      }
    },
  },

  watch: {
    breakpoints: {
      handler(val) {
        console.log(val)
        if (!this.isMobile) {
          this.active = 1
        } else {
          this.active = 2
        }
      },
    },
  },

  async mounted() {
    if (localStorage.getItem('isDarkTheme') === 'true') {
      this.$vuetify.theme.dark = true
    } else {
      this.$vuetify.theme.dark = false
    }

    if (this.isRememberedUser) {
      await this.GET_CLIENT(this.isRememberedUser)
    }

    if (this.isMobile) {
      this.active = 2
      this.active = 1
    } else {
      this.active = 1
    }
  },
}
</script>

<style lang="stylus">
colors = {
  primary: #ffcc01,
  black: #181818
}

full-page()
  /* height 100vh
  height calc(var(--vh, 1vh) * 100) */
  height calc(100vh - 50px)

+prefix-classes('fields__')
  .main
    margin-top 50px
    full-page()
    display flex
    flex-direction column

  .main-wrap
    padding 0

  .map
    padding 0

  .panel
    padding 0 6px 0 12px

    .panel-wrap
      full-page()

  .addresses-wrap
    full-page()
    padding 6px

    .addresses-inputs
      padding 16px

  .send-order-wrap
    full-page()

.fields__panel-tabs
  .spacer
    height 64px

  .v-slide-group__content.v-tabs-bar__content
    /* .v-tab
    color lightness(colors.black, 50%) !important
    &.v-tab--active
      color colors.black !important */
    .v-tabs-slider
      background colors.primary !important
</style>
