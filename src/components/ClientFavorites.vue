<template lang="pug">
v-scroll-y-transition
  v-card.saved-data__main.elevation-3(v-if='isDisplayed')
    v-card-title.saved-data__main-title Сохранённые данные пользователя
    v-tabs(
      :background-color='colorTab',
      :color='colorTabText',
      :vertical='!isMobile',
      touchless,
      :next-icon='$icons.rightArrow',
      :prev-icon='$icons.leftArrow',
      show-arrows,
      grow
    )
      v-tab(v-if='isAliasesExists') Адреса
      v-tab(v-if='isAddressesExists') Маршруты
      v-tab-item.saved-data__addresses(v-if='isAliasesExists')
        v-card.saved-data__addresses-wrap(flat)
          v-menu(
            v-for='alias in client.aliases',
            :key='alias.name',
            bottom,
            right,
            transition='scale-transition',
            origin='top left'
          )
            template(v-slot:activator='{ on }')
              v-chip.saved-data__chip(:class='isMobile ? "is-mobile" : ""', label, color='primary', v-on='on')
                v-btn(icon, @click.stop='addAddress(alias)')
                  v-icon(color='black') {{ $icons.plus }}
                span {{ alias.name }}
            v-list.saved-data__tooltip-address
              v-list-item
                v-list-item-content
                  v-list-item-title {{ alias.name}}
                  v-list-item-content {{ alias.address }}
                v-list-item-action
                  v-btn(icon, @click='addAddress(alias)')
                    v-icon {{ $icons.plus }}
      v-tab-item(v-if='isAddressesExists')
        v-card.saved-data__addresses-wrap(flat)
          v-menu(
            v-for='order in client.saved_orders',
            :key='order.name',
            bottom,
            right,
            transition='scale-transition',
            origin='top left'
          )
            template(v-slot:activator='{ on }')
              v-chip.saved-data__chip(:class='isMobile ? "is-mobile" : ""', label, color='primary', v-on='on')
                v-btn(icon, @click.stop='addOrder(order)')
                  v-icon(color='black') {{ $icons.plus }}
                span {{ order.name }}
            v-list.saved-data__tooltip-order
              v-list-item
                v-list-item-content
                  v-list-item-title {{ order.name}}
                  v-list-item-content
                    span(v-for='address in order.addressList') {{address.address}}
                      v-divider.ma-2
                v-list-item-action
                  v-btn(icon, @click='addOrder(order)')
                    v-icon {{ $icons.plus }}
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import { colors, breakpoints } from '@/mixins/'
import { add } from 'lodash'

export default {
  name: 'ClientFavorites',

  mixins: [colors, breakpoints],

  props: [],

  data: () => ({}),

  computed: {
    ...mapState(['client']),
    ...mapGetters(['isAliasesExists', 'isAddressesExists']),
    isDisplayed() {
      return this.isAddressesExists || this.isAliasesExists
    },
  },

  methods: {
    ...mapActions(['ADD_ADDRESS', 'ADD_ORDER']),
    addAddress(alias) {
      const address = { ...alias, isAlias: true, completed: false }
      this.ADD_ADDRESS(address)
    },
    addOrder(order) {
      console.log(order)
      this.ADD_ORDER(order)
    },
  },

  watch: {},

  created() {},
}
</script>

<style lang="stylus" scoped>
+prefix-classes('saved-data__')
  .main
    margin-top 6px

    .main-title
      word-break break-word

  .addresses
    .addresses-wrap
      padding 12px

  .chip
    margin-top 6px
    min-width 45%
    max-width 45%
    width 45%
    color #000 !important
    font-size 1rem !important
    font-weight 500
    margin-left 6px
    padding-left 0

  .tooltip-address
    padding 0

.saved-data__main
  .saved-data__chip
    &.is-mobile
      min-width 100% !important
      max-width 100% !important
      width 100% !important

.saved-data__tooltip-address
  .v-list-item__title
    font-weight 700

  .v-list-item__content
    padding 0
</style>
