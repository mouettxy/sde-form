<template lang="pug">
v-scroll-y-transition
  v-card.saved-data__main.elevation-6(v-if='isDisplayed')
    v-card-title.saved-data__main-title Сохранённые данные пользователя
    v-tabs(
      :background-color='colorTab',
      :color='colorTabText',
      :vertical='!isMobile',
      :next-icon='$icons.rightArrow',
      :prev-icon='$icons.leftArrow',
      show-arrows,
      grow
    )
      v-tab(v-if='isAliasesExists') Адреса
      v-tab(v-if='isAddressesExists') Заявки
      v-tab-item.saved-data__addresses.pa-8(v-if='isAliasesExists')
        v-autocomplete(
          :color='color',
          @input='addAliasWrapper',
          hide-no-data,
          :filter='filterObject',
          v-model='aliasValue',
          :items='aliasList',
          :search-input.sync='aliasQuery',
          :success-messages='aliasSuccess',
          autocomplete='no',
          type='search',
          item-value='id',
          item-text='name',
          attach='.alias-attach-to__wrapper',
          label='Поиск по доступным адресам'
        )
          template(v-slot:item='data')
            v-list-item-content
              v-list-item-title {{data.item.name}}
              v-list-item-subtitle
                | {{data.item.address}}
        .alias-attach-to
          .alias-attach-to__wrapper
      v-tab-item.pa-8(v-if='isAddressesExists')
        v-card.saved-data__addresses-wrap(flat)
          v-autocomplete(
            :color='color',
            @input='addOrderWrapper',
            hide-no-data,
            :filter='filterObjectOrder',
            v-model='orderValue',
            :items='orderList',
            :search-input.sync='orderQuery',
            :success-messages='orderSuccess',
            item-value='id',
            item-text='name',
            autocomplete='no',
            type='search',
            attach='.order-attach-to__wrapper',
            label='Поиск по доступным заявкам'
          )
            template(v-slot:item='data')
              v-list-item-content
                v-list-item-title {{data.item.name}}
                v-list-item-subtitle.ml-2(v-for='address in data.item.addresses', :key='address')
                  span.grey--text {{address}}
        .order-attach-to
          .order-attach-to__wrapper
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import { colors, breakpoints } from '@/mixins/'
import _ from 'lodash'
export default {
  name: 'ClientFavorites',

  mixins: [colors, breakpoints],

  props: [],

  data: () => ({
    aliasValue: undefined,
    aliasQuery: undefined,
    orderQuery: undefined,
    orderValue: undefined,
    aliasSuccess: '',
    orderSuccess: '',
  }),

  computed: {
    ...mapState(['client']),
    ...mapGetters(['isAliasesExists', 'isAddressesExists']),
    aliasList() {
      return _.map(this.client.aliases, (e, index) => ({
        id: index,
        name: e.name,
        address: e.address,
      }))
    },
    orderList() {
      return _.map(this.client.saved_orders, (e, index) => ({
        id: index,
        name: e.name,
        addresses: _.map(e.addressList, e => {
          return e.address
        }),
      }))
    },
    isDisplayed() {
      return this.isAddressesExists || this.isAliasesExists
    },
  },

  methods: {
    ...mapActions(['ADD_ADDRESS', 'ADD_ORDER']),

    filterObject(item, queryText, itemText) {
      return (
        item.name.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1 ||
        item.address.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1
      )
    },

    filterObjectOrder(item, queryText, itemText) {
      return item.name.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1
    },

    smoothEraseAliasQuery(speed = 25) {
      if (this.aliasQuery) {
        this.aliasQuery = this.aliasQuery.substring(0, this.aliasQuery.length - 1)
        setTimeout(() => {
          this.smoothEraseAliasQuery(speed)
        }, speed)
      } else {
        this.aliasValue = undefined
        this.aliasQuery = undefined
        this.ordersQuery = undefined
        this.ordersValue = undefined
        this.aliasSuccess = ''
        this.ordersSuccess = ''
      }
    },

    smoothEraseOrderQuery(speed = 25) {
      if (this.orderQuery) {
        this.orderQuery = this.orderQuery.substring(0, this.orderQuery.length - 1)
        setTimeout(() => {
          this.smoothEraseOrderQuery(speed)
        }, speed)
      } else {
        this.aliasValue = undefined
        this.aliasQuery = undefined
        this.ordersQuery = undefined
        this.ordersValue = undefined
        this.aliasSuccess = ''
        this.ordersSuccess = ''
      }
    },

    async addAliasWrapper() {
      await this.addAddress(this.client.aliases[this.aliasValue])
      this.aliasSuccess = 'Успешное добавление адреса'
      setTimeout(() => {
        this.smoothEraseAliasQuery(30)
      }, 500)
    },

    async addOrderWrapper() {
      await this.addOrder(this.client.saved_orders[this.orderValue])
      this.orderSuccess = 'Успешное добавление заказа'
      setTimeout(() => {
        this.smoothEraseOrderQuery(30)
      }, 500)
    },

    addAddress(alias) {
      const address = { ...alias, isAlias: true, completed: false }
      this.ADD_ADDRESS(address)
    },
    addOrder(order) {
      this.ADD_ORDER(order)
    },
  },

  watch: {},

  created() {},
}
</script>

<style lang="stylus">
+prefix-classes('saved-data__')
  .main
    margin-top 12px

    .main-title
      word-break break-word

.alias-attach-to
  position relative

  .alias-attach-to__wrapper
    top -65px
    position absolute

.order-attach-to
  position relative

  .order-attach-to__wrapper
    top -65px
    position absolute
</style>
