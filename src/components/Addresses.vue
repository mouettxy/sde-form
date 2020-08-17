<template lang="pug">
v-slide-y-transition(v-if='addressList')
  .address-list__main
    v-card.address-list__main-wrap.elevation-3
      v-fab-transition
        v-tabs(
          v-show='!isLoading',
          v-model='active',
          :background-color='colorTab',
          :color='colorTabText',
          :vertical='!isMobile',
          :next-icon='$icons.rightArrow',
          :prev-icon='$icons.leftArrow',
          show-arrows
        )
          v-tab(v-for='address in addressList', :key='address.id') {{compact(address.address)}}
          v-tab-item(v-for='address in addressList', :key='address.id')
            AddressFields(:addr_id='address.id')
            .address-list__actions
              v-btn.address-list__actions-close(@click='removeAddress(address.id)') Удалить адрес
      v-fab-transition
        template(v-if='isLoading')
          .address-list__loader
            v-progress-circular(indeterminate, color='primary')
</template>

<script>
import _ from 'lodash'
import AddressFields from '@/components/AddressFields'
import { colors, breakpoints } from '@/mixins/'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Addresses',

  mixins: [colors, breakpoints],

  components: {
    AddressFields,
  },

  props: [],

  data: () => ({
    active: 0,
    isLoading: false,
  }),

  computed: {
    ...mapState(['addressList']),
    size() {
      return _.size(this.addressList)
    },
  },

  methods: {
    ...mapActions(['DEL_ADDRESS']),
    compact(val) {
      const search = ['г Краснодар, ', 'ул им. ', 'ул ']
      _.each(search, e => {
        val = val.replace(e, '')
      })
      return val
    },
    removeAddress(id) {
      this.DEL_ADDRESS(id)
    },
  },

  watch: {
    addressList: function(n) {
      this.isLoading = true
      setTimeout(() => {
        if (this.size) {
          this.active = this.size - 1
        }
        setTimeout(() => {
          this.isLoading = false
        }, 300)
      }, 700)
    },
  },

  created() {},
}
</script>

<style lang="stylus">
.address-list__main
  margin-top 6px

  .v-tab
    text-transform none
    max-width 200px
    word-wrap break-word

  .address-list__actions
    padding 6px

  .address-list__loader
    padding 170px

    .v-progress-circular
      left 50%
</style>
