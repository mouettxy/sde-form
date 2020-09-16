<template lang="pug">
v-app
  v-app-bar(dense).elevation-0
    v-app-bar-nav-icon(@click.stop='menu = true')
    v-toolbar-title {{ $t("title") }}
    v-spacer
    v-btn.text-lowercase(text, color='primary', href='https://sde.ru.com', target='_blank') sde

  v-navigation-drawer(v-model='menu', absolute, temporary).menu
    v-list(dense).menu-links
      v-list-item-group
        v-list-item(href='https://api.sde.ru.com/client/cabinet.php', target='_blank')
          v-list-item-title {{ $t("menu.clientCabinet") }}
        v-list-item(href='https://sde.ru.com/#contacts', target='_blank')
          v-list-item-title {{ $t("menu.contacts") }}
        v-list-item(href='https://sde.ru.com/payment', target='_blank')
          v-list-item-title {{ $t("menu.payment") }}
        v-list-item(href='https://sde.ru.com/#prices', target='_blank')
          v-list-item-title {{ $t("menu.deliveryCost") }}
    v-card(flat, :color='isDark ? "accent" : "secondary"').menu-info
      v-card-text
        .menu-info__item(:class='{"white--text": isDark}') 10.00 - 23.00
        a(href='tel:+79186619960', text, :class='{"white--text": isDark}').menu-info__item +7 (918) 661 99 60
        a(href='tel:+9786525482', text, :class='{"white--text": isDark}').menu-info__item +7 (978) 652 54 82
        .menu-info__item(:class='{"white--text": isDark}') © {{(new Date()).getFullYear()}} sde

  template(v-if='pricesOverall')
    v-scale-transition
      PriceLabel

  v-main
    v-container.sde-form(fluid)
      v-row.sde-row(no-gutters)
        v-col(cols='12', lg='5', md='6')
          v-tabs(
            v-model='activeTab',
            :background-color='defaultTabColor',
            :color='defaultTabTextColor',
            next-icon='mdi-arrow-right',
            prev-icon='mdi-arrow-left',
            show-arrows,
            grow
          )
            v-tab {{ $t("makeOrder") }}
            v-tab(v-if='isMobile') {{ $t("map") }}
            v-tab-item
              order-view(:state='state', @state-change='onStateChange')
            v-tab-item(v-if='isMobile')
              keep-alive
                map-block
        v-col(cols='12', lg='7', md='6', v-if='!isMobile')
          keep-alive
            map-block

  v-footer.px-2(padless, fixed, app, :color='defaultFooterColor')
    span {{ new Date().getFullYear() }} - sde
    v-spacer
    v-btn(
      icon,
      :disabled='!$cookies.get("remembered-id")',
      @click='defaultStartOrder',
      :content='$t("homeMapMarkerTip")',
      v-tippy
    )
      v-icon(:color='$cookies.get("fill-default-address") ? "success" : "dark"') mdi-home-map-marker
    v-btn(icon, @click='changeTheme', :content='$t("invertColorsTip")', v-tippy)
      v-icon(:color='isDark ? "success" : "dark"') mdi-invert-colors
    v-btn.text-uppercase(text, @click='changeLocale', :content='$t("changeLocaleTip")', v-tippy) {{$i18n.locale}}
</template>

<script lang="ts">
import { colors, breakpoints } from '@/mixins'
import { Component, Mixins, Watch } from 'vue-property-decorator'
import eventBus from '@/eventBus'

import OrderView from '@/views/OrderView.vue'
import MapBlock from '@/views/MapBlock.vue'
import PriceLabel from '@/views/PriceLabel.vue'

import { addressesModule, authModule } from '@/store'
import { filter as lodashFilter } from 'lodash'
import { OrderAddress } from './typings/order'

@Component({
  name: 'App',

  components: {
    OrderView,
    PriceLabel,
    MapBlock
  }
})
export default class App extends Mixins(colors, breakpoints) {
  public menu = false
  public state = 'filling'
  public activeTab = 1

  @Watch('breakpoints')
  onBreakpointsChange() {
    if (!this.isMobile) {
      this.activeTab = 0
    } else {
      this.activeTab = 1
    }
  }

  get pricesOverall() {
    return addressesModule.prices?.overall
  }

  onStateChange(state: string) {
    this.state = state
  }
  isRememberedUser() {
    const cookie = this.$cookies.get('remembered-id')
    if (cookie) {
      const userId = parseInt(cookie)
      if (!isNaN(userId)) {
        return userId
      }
    }
    return false
  }
  changeLocale() {
    if (this.$i18n.locale === 'ru') {
      this.$i18n.locale = 'en'
      this.$cookies.set('locale', 'en')
    } else {
      this.$i18n.locale = 'ru'
      this.$cookies.set('locale', 'ru')
    }
  }
  defaultStartOrder() {
    if (this.$cookies.get('fill-default-address')) {
      this.$cookies.remove('fill-default-address')
      document.location.reload()
    } else {
      this.$cookies.set('fill-default-address', true)
      document.location.reload()
    }
  }
  changeTheme() {
    if (this.isDark) {
      this.$vuetify.theme.dark = false
      this.$cookies.remove('dark-theme')
    } else {
      this.$vuetify.theme.dark = true
      this.$cookies.set('dark-theme', true)
    }
  }

  async mounted() {
    if (this.$cookies.get('dark-theme') === 'true') {
      this.$vuetify.theme.dark = true
    } else {
      this.$vuetify.theme.dark = false
    }

    const isRememeredUser = this.isRememberedUser()
    if (typeof isRememeredUser === 'number') {
      await authModule.relog({ type: 'default', id: isRememeredUser })
    }

    if (this.$cookies.get('fill-default-address')) {
      if (addressesModule.addressList.length <= 0) {
        const defaultAddress = lodashFilter(authModule.aliases, { name: 'От нас / К нам' })[0] as OrderAddress

        addressesModule.add(defaultAddress)
      }
    }

    if (this.isMobile) {
      this.activeTab = 1
      setTimeout(() => {
        this.activeTab = 0
      }, 500)
    } else {
      this.activeTab = 0
    }

    eventBus.$on('order-sended-saved', () => {
      this.state = 'filling'
    })
    eventBus.$on('order-sended', () => {
      this.state = 'filling'
    })
    eventBus.$on('order-sended-error', () => {
      this.state = 'filling'
    })
    eventBus.$on('address-added', (payload: any) => {
      if (payload.name !== 'От нас / К нам' && !payload.isAlias) {
        this.$notification.success(`Успешное добавление адреса ${payload.address}`)
      }
    })
  }
}
</script>

<style lang="sass">
@import './assets/main'

html
  overflow: hidden !important
  height: 100%

body
  overflow: hidden
  min-height: 100%
  width: 100%

::-webkit-scrollbar
  width: 4px

/* Track */
::-webkit-scrollbar-track
  box-shadow: none
  border-radius: 0

/* Handle */
::-webkit-scrollbar-thumb
  background: #ffcc01
  border-radius: 0px

input:-webkit-autofill
  -webkit-box-shadow: 0 0 0 50px #fafafa inset
  -webkit-text-fill-color: #181818


input:-webkit-autofill:focus
  -webkit-box-shadow: 0 0 0 50px #fafafa inset
  -webkit-text-fill-color: #181818

.sde-form
  height: $height-root-sde
  padding: 0 !important

  .sde-row
    height: $height-root-sde

.menu
  .v-navigation-drawer__content
    display: flex
    justify-content: top
    flex-direction: column

  .menu-links
    flex-grow: 4

  .menu-info
    flex-grow: 1
    .menu-info__item
      display: block
      color: rgba(0, 0, 0, 0.6)
      text-decoration: none
</style>
