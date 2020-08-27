<template lang="pug">
.address-list__main
  v-card.address-list__main-wrap.elevation-3
    v-tabs(
      v-model='active',
      :background-color='colorTab',
      :color='colorTabText',
      :vertical='!isMobile',
      :next-icon='$icons.rightArrow',
      :prev-icon='$icons.leftArrow',
      show-arrows
    )
      v-tab(v-for='address in addressList', :key='address.id')
        span.address-list__address-title {{compact(address.address)}}
      v-tab-item.address-list__fields(v-for='address in addressList', :key='address.id')
        v-btn.address-list__actions-close(@click='removeAddress(address.id)', icon)
          v-icon {{$icons.close}}
        keep-alive
          AddressFields(:addr_id='address.id')
        v-scroll-y-reverse-transition
          .address-list__actions(v-if='!address.isAlias && !isNewClient')
            v-row
              v-col(cols='12')
                v-text-field(
                  label='Назовите адрес',
                  hint='Мы сохраним адрес и заполненные поля под этим именем.',
                  v-model='val',
                  :prepend-inner-icon='$icons.save',
                  :success-messages='sucMsg',
                  :error-messages='errMsg',
                  persistent-hint
                )
              v-col
                v-btn.address-list__actions-add(@click='addAlias(address.id)', block, color='accent') Сохранить
</template>

<script>
import { clientApi as api } from '@/api'
import _ from 'lodash'
import AddressFields from '@/components/AddressFields'
import { colors, breakpoints } from '@/mixins/'
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'Addresses',

  mixins: [colors, breakpoints],

  components: {
    AddressFields,
  },

  props: [],

  data: () => ({
    active: 0,
    sucMsg: '',
    errMsg: '',
    val: '',
  }),

  computed: {
    ...mapState(['client', 'addressList', 'isNewClient']),
    ...mapGetters(['addressById']),
    size() {
      return _.size(this.addressList)
    },
  },

  methods: {
    ...mapMutations(['UPDATE_ADDRESS_ALIAS']),
    ...mapActions(['DEL_ADDRESS', 'UPDATE_ALIASES']),
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
    async addAlias(id) {
      if (!this.val) {
        this.$notification.error('Укажите кодовое название адреса')
        return false
      }

      if (
        _.includes(
          _.map(this.client.aliases, e => e.name),
          this.val
        )
      ) {
        this.$notification.error('Адрес с таким названием уже существует')
        return false
      }

      const alias = _.cloneDeep(this.addressById(id))

      try {
        const response = await api.setAliases(this.client.CLIENT, {
          fields: alias.fields,
          name: this.val,
          address: alias.address,
          lat: alias.lat,
          lon: alias.lon,
        })

        if (response.status === 200) {
          alias.isAlias = true
          this.$notification.success('Успешное добавление адреса.')
          this.UPDATE_ALIASES()
          this.UPDATE_ADDRESS_ALIAS({ id })
        } else {
          this.$notification.error('Ошибка сервера. Повторите позднее...')
          return false
        }
      } catch (e) {
        console.log(e)
        this.$notification.error('Ошибка сервера. Повторите позднее ...')
        return false
      }
    },
  },

  watch: {
    addressList: function(n) {
      if (this.size) {
        this.active = this.size - 1
      }
    },
  },

  created() {},
}
</script>

<style lang="stylus">
.address-list__main
  margin-top 6px

  .address-list__address-title
    overflow hidden
    text-overflow ellipsis

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

.address-list__fields
  position relative

.address-list__actions-close
  position absolute
  z-index 1000
  right 10px
</style>
