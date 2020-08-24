<template lang="pug">
.address-fields__main
  v-card.address-fields__main-wrap(flat)
    v-form(v-model='valid')
      v-row
        v-col(cols='12', lg='6', md='6')
          v-text-field(
            :color='color',
            label='Телефон',
            auocomplete='false',
            :prepend-inner-icon='$icons.phone',
            v-model='address.phone',
            v-mask='\'+7 (###) ###-##-##\'',
            hint='Экспедитор сможет с вами связаться, а так же уведомит по смс о прибытии.'
          )
        v-col(cols='12', lg='6', md='6')
          v-datetime-picker(
            label='Когда забрать/Доставить',
            :textFieldProps='{ "prepend-inner-icon": $icons.date, color: color, "v-model": address.datetime }',
            :datePickerProps='{ locale: "ru-ru", "header-color": "accent" }',
            :timePickerProps='{ format: "24hr", "header-color": "accent" }',
            dateFormat='dd.MM.yyyy',
            timeFormat='HH:mm',
            v-model='date',
            clearText='Сбросить',
            okText='Применить',
            @input='onDateChange'
          )
            template(slot='dateIcon')
              v-icon {{$icons.calendar}}
            template(slot='timeIcon')
              v-icon {{$icons.clock}}
      v-row
        v-col(cols='12', lg='4', md='4')
          v-text-field(
            :color='color',
            label='Выручка',
            type='number',
            auocomplete='false',
            :prepend-inner-icon='$icons.takeOut',
            v-model.number='address.buyout'
          )
        v-col(cols='12', lg='4', md='4')
          v-text-field(
            :color='color',
            label='Выкуп',
            type='number',
            auocomplete='false',
            :prepend-inner-icon='$icons.takeIn',
            v-model.number='address.buyin'
          )
        v-col(cols='12', lg='4', md='4')
          v-text-field(
            :color='color',
            label='Набор товара',
            hint='Укажите количество наименований товара. Несём ответственность за состав заказа.',
            type='number',
            auocomplete='false',
            :prepend-inner-icon='$icons.bundle',
            v-model.number='address.bundles'
          )
        v-col(cols='12')
          v-textarea(
            :color='color',
            rows='2',
            label='Комментарий',
            auocomplete='false',
            :prepend-inner-icon='$icons.comment',
            v-model='address.comment',
            hint='Укажите любую дополнительную информацию к адресу'
          )
      v-row
        v-col(cols='6')
          v-switch(:color='color', v-model='address.takeIn', label='Занос')
        v-col(cols='6')
          v-switch(:color='color', v-model='address.takeOut', label='Вынос')
        v-col(cols='12')
          v-switch(:color='color', v-model='address.bus', label='Встретить/Отправить автобус')
</template>

<script>
import moment from 'moment'
import _ from 'lodash'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { colors } from '@/mixins/'

export default {
  name: 'AddressFields',

  mixins: [colors],

  props: ['addr_id'],

  data: () => ({
    date: undefined,
    isManuallyModified: false,
    valid: true,
    address: {
      phone: '',
      datetime: undefined,
      bundles: 0,
      comment: '',
      buyin: 0,
      buyout: 0,
      takeIn: false,
      takeOut: false,
      bus: false,
    },
  }),

  computed: {
    ...mapState(['addressList']),
    ...mapGetters(['addressById']),
    addressDate() {
      return this.address.datetime
    },
  },

  methods: {
    ...mapMutations(['UPDATE_ADDRESS_FIELDS']),

    getTimeOffset() {
      let index = _.findIndex(this.addressList, { id: this.addr_id })
      let lastIndex = _.findLastIndex(this.addressList)
      let size = _.size(this.addressList)

      if (size === 1 || index === 0) {
        return 20
      }

      if (size === 2 && index === 1) {
        return 20 + 35
      }

      if (index === lastIndex) {
        return 20 + 35 + (size - 2) * 25
      }

      return 20 + index * 25
    },
    updateTimeField() {
      let m = moment()
        .locale('ru')
        .add(this.getTimeOffset(), 'm')
      this.date = `${m.format('L')} ${m.format('LT')}`
      this.address.datetime = `${m.format('L')} ${m.format('LT')}`
      return `${m.format('L')} ${m.format('LT')}`
    },
    onDateChange() {
      this.isManuallyModified = true
    },
  },

  watch: {
    addressList: {
      handler(val) {
        this.address = this.addressById(this.addr_id).fields
      },
    },
    address: {
      handler(val) {
        this.debouncedHandler({ id: this.addr_id, address: this.address })
      },
      deep: true,
    },
  },

  mounted() {
    this.updateTimeField()

    this.address = this.addressById(this.addr_id).fields

    setInterval(() => {
      if (!this.isManuallyModified) {
        this.updateTimeField()
      }
    }, 1000)

    this.debouncedHandler = _.debounce(this.UPDATE_ADDRESS_FIELDS, 500)
  },
}
</script>

<style lang="stylus">
.address-fields__main
  padding 12px 12px 0 12px

  .address-fields__main-wrap
    padding 12px 12px 0 12px

    .col-xl-11, .col-xl-10, .col-xl-9, .col-xl-8, .col-xl-7, .col-xl-6, .col-xl-5, .col-xl-4, .col-xl-3, .col-xl-2, .col-xl-1, .col-lg, .col-lg-auto, .col-lg-12, .col-lg-11, .col-lg-10, .col-lg-9, .col-lg-8, .col-lg-7, .col-lg-6, .col-lg-5, .col-lg-4, .col-lg-3, .col-lg-2, .col-lg-1, .col-md, .col-md-auto, .col-md-12, .col-md-11, .col-md-10, .col-md-9, .col-md-8, .col-md-7, .col-md-6, .col-md-5, .col-md-4, .col-md-3, .col-md-2, .col-md-1, .col-sm, .col-sm-auto, .col-sm-12, .col-sm-11, .col-sm-10, .col-sm-9, .col-sm-8, .col-sm-7, .col-sm-6, .col-sm-5, .col-sm-4, .col-sm-3, .col-sm-2, .col-sm-1, .col, .col-auto, .col-12, .col-11, .col-10, .col-9, .col-8, .col-7, .col-6, .col-5, .col-4, .col-3, .col-2, .col-1
      padding 2px

    .v-input, .v-input-control, .v-text-field
      padding-top 0
      margin-top 0
</style>
