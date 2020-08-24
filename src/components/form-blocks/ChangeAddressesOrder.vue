<template lang="pug">
v-card.change-address-order__main.elevation-3(v-if='addressList.length >= 2')
  v-card-title
    span Изменения порядка маршрута
  v-card-text
    template(v-if='!isMobile')
      v-list
        draggable(v-model='addressList', @start='drag = true', @end='drag = false', v-bind='dragOptions')
          transition-group(type='transition', :name='!drag ? "flip-list" : null')
            v-list-item(v-for='address in addressList', :key='address.id')
              v-list-item-icon
                v-icon(color='primary') {{$icons.move}}
              v-list-item-content {{ address.address }}
    template(v-else)
      v-list
        transition-group(type='transition', name='list')
          v-list-item(v-for='address in addressList', :key='address.id')
            v-list-item-icon
              v-btn(icon, @click='addressMoveUp(address)')
                v-icon(color='primary') {{$icons.upArrow}}
            v-list-item-content
              span {{ address.address }}
            v-list-item-icon
              v-btn(icon, @click='addressMoveDown(address)')
                v-icon(color='primary') {{$icons.downArrow}}
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import { colors, breakpoints } from '@/mixins/'
import draggable from 'vuedraggable'
import _ from 'lodash'

export default {
  name: 'ClientFavorites',

  components: {
    draggable,
  },

  mixins: [colors, breakpoints],

  props: [],

  data: () => ({
    drag: false,
  }),

  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
        forceFallback: true,
      }
    },
    addressList: {
      get() {
        return this.$store.state.addressList
      },
      set(value) {
        this.$store.commit('UPDATE_ADDRESSES_ORDER', value)
      },
    },
  },

  methods: {
    addressMoveUp(address) {
      // meta
      const addresses = _.cloneDeep(this.addressList)
      const key = parseInt(_.findKey(addresses, address))
      const keyLast = parseInt(_.findLastKey(addresses))
      const keyBefore = key === 0 ? keyLast : key - 1
      const keyAfter = key === keyLast ? 0 : key + 1

      // replace addresses
      let temp_ = addresses[keyBefore]
      addresses[keyBefore] = addresses[key]
      addresses[key] = temp_

      // !FIXME: maybe strict mode error
      this.addressList = addresses
    },
    addressMoveDown(address) {
      // meta
      const addresses = _.cloneDeep(this.addressList)
      const key = parseInt(_.findKey(addresses, address))
      const keyLast = parseInt(_.findLastKey(addresses))
      const keyBefore = key === 0 ? keyLast : key - 1
      const keyAfter = key === keyLast ? 0 : key + 1

      // replace addresses
      let temp_ = addresses[keyAfter]
      addresses[keyAfter] = addresses[key]
      addresses[key] = temp_
      console.log({ addresses, key, keyLast, keyBefore, keyAfter })
      // !FIXME: maybe strict mode error
      this.addressList = addresses
    },
  },

  watch: {},

  created() {},
}
</script>

<style lang="stylus">
.cursor-move
  &:hover
    cursor move

+prefix-classes('change-address-order__')
  .main
    margin-top 6px

.list-enter, .list-leave-to
  opacity 0

.list-enter-active, .list-leave-active
  transition opacity 0.5s ease

.list-move
  transition transform 0.5s ease-out
</style>
