<template lang="pug">
.fields__main
  template(v-if='priceList && priceList.overall')
    v-scale-transition
      PriceLabel

  MoreThanSixAddresses

  v-container.fields__main-wrap(fluid)
    v-row.fields__row
      v-col.fields__cols.fields__panel(cols='12', lg='5', md='6')
        v-card.fields__panel-wrap(elevation='6')
          v-tabs.fields__panel-tabs(
            v-model='active',
            :background-color='colorTab',
            :color='colorTabText',
            :next-icon='$icons.rightArrow',
            :prev-icon='$icons.leftArrow',
            :touch='false',
            touchless,
            show-arrows,
            grow
          )
            v-tab Настройки
            v-tab Оформите заявку
            v-tab(v-if='isMobile') Карта
          v-tabs-items.fields__panel-tabs(v-model='active')
            v-tab-item
              SettingsBlock
            v-tab-item
              OrderBlock(:state='state', @state-change='onStateChange')
            v-tab-item(v-if='isMobile')
              sdeMap.fields__map
      v-col.fields__cols.fields__map(cols='12', lg='7', md='6', v-if='!isMobile')
        sdeMap
</template>

<script>
import _ from 'lodash'

import MoreThanSixAddresses from '@/components/snackbars/MoreThanSixAddresses'
import SettingsBlock from '@/components/app-blocks/SettingsBlock'
import OrderBlock from '@/components/app-blocks/OrderBlock'
import PriceLabel from '@/components/PriceLabel'
import sdeMap from '@/components/sdeMap'

import { mapState, mapActions } from 'vuex'

import { colors, breakpoints } from '@/mixins/'

import { unicornBus } from '@/main'

export default {
  name: 'sdeForm',

  components: {
    MoreThanSixAddresses,
    SettingsBlock,
    OrderBlock,
    PriceLabel,
    sdeMap,
  },

  mixins: [colors, breakpoints],

  data: () => ({
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
    onStateChange(state) {
      this.state = state
    },
    ...mapActions(['GET_CLIENT', 'RESET_FORM', 'ADD_ADDRESS']),
  },

  watch: {
    breakpoints: {
      handler(val) {
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
      setTimeout(() => {
        this.active = 1
      }, 500)
    } else {
      this.active = 1
    }

    unicornBus.$on('order-sended-saved', data => {
      this.state = 'filling'
    })
    unicornBus.$on('order-sended', data => {
      this.state = 'filling'
    })
    unicornBus.$on('order-sended-error', () => {
      this.state = 'filling'
    })
  },
}
</script>

<style lang="stylus">
colors = {
  primary: #ffcc01,
  black: #181818
}

full-page()
  height calc(100vh - 50px)

+prefix-classes('fields__')
  .main
    margin-top 50px
    full-page()
    display flex
    flex-direction column

  .row
    width 100%
    height 100%
    margin-right 0
    margin-left 0

  .main-wrap
    padding 0

  .map
    padding 0

  .panel
    padding 0

    .panel-wrap
      full-page()

  .addresses-wrap
    overflow scroll
    full-page()
    padding 6px

    .addresses-inputs
      padding 16px

  .send-order-wrap
    overflow scroll
    full-page()

.fields__panel-tabs
  .spacer
    height 128px

  .v-slide-group__content.v-tabs-bar__content
    .v-tabs-slider
      background colors.primary !important

.v-text-field__slot
  textarea
    font-size 0.9rem
</style>
