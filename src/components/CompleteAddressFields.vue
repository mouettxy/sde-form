<template lang="pug">
.ca-fields__main
  v-fab-transition
    v-card.ca-fields__main-wrap.elevation-6(v-if='priceList.overall')
      v-form.ca-fields__form(v-model='valid')
        v-row
          v-col(cols='12')
            v-textarea(
              :color='color',
              rows='2',
              label='Комментарий',
              auocomplete='false',
              :prepend-inner-icon='$icons.comment',
              v-model='completeAddress.comment',
              hint='Укажите любую дополнительную информацию к заказу'
            )
          v-col(cols='12', lg='6', md='6')
            v-switch(label='Срочная доставка (+20% стоимости)', v-model='completeAddress.quick')
              template(v-slot:label, v-if='!isMobile')
                | Срочная доставка
                br
                | (+20%, стоимости)
          v-col(cols='12', lg='6', md='6')
            v-switch(label='Требуется автомобиль (+15% стоимости)', v-model='completeAddress.car')
              template(v-slot:label, v-if='!isMobile')
                | Требуется автомобиль
                br
                | (+15% стоимости)
          v-col(cols='12', lg='6', md='6')
            v-switch(label='Оптимизировать маршрут (Бесплатно)', v-model='completeAddress.optimizeRoute')
              template(v-slot:label, v-if='!isMobile')
                | Оптимизировать маршрут
                br
                | (Бесплатно)
          v-col(cols='12', lg='6', md='6')
            v-radio-group(v-model='completeAddress.whoPays')
              v-radio(label='Из выручки', value='Из выручки')
              v-radio(label='Отправитель', value='Отправитель')
              v-radio(label='Получатель', value='Получатель')
              v-radio(label='Заказчик', value='Заказчик')
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import _ from 'lodash'

import { colors, breakpoints } from '@/mixins/'

export default {
  name: 'CompleteAddressFields',

  mixins: [colors, breakpoints],

  props: [],

  data: () => ({
    valid: true,
    completeAddress: {
      quick: false,
      car: false,
      optimizeRoute: false,
      whoPays: 'Из выручки',
      comment: '',
    },
  }),

  computed: {
    ...mapState(['priceList', 'addressInfo']),
  },

  methods: {
    ...mapMutations(['UPDATE_COMPLETE_ADDRESS_FIELDS']),
  },

  watch: {
    addressInfo: {
      handler(val) {
        this.completeAddress = this.addressInfo
      },
      deep: true,
    },
    completeAddress: {
      handler(val) {
        this.debouncedHandler(this.completeAddress)
      },
      deep: true,
    },
  },

  mounted() {
    this.completeAddress = _.cloneDeep(this.addressInfo)
    this.debouncedHandler = _.debounce(this.UPDATE_COMPLETE_ADDRESS_FIELDS, 500)
  },
}
</script>

<style lang="stylus" scoped>
+prefix-classes('ca-fields__')
  .main
    margin-top 6px

    .main-wrap
      padding 12px 12px 12px 12px

      .form
        padding 12px 12px 12px 12px

.ca-fields__main
  .col-xl-11, .col-xl-10, .col-xl-9, .col-xl-8, .col-xl-7, .col-xl-6, .col-xl-5, .col-xl-4, .col-xl-3, .col-xl-2, .col-xl-1, .col-lg, .col-lg-auto, .col-lg-12, .col-lg-11, .col-lg-10, .col-lg-9, .col-lg-8, .col-lg-7, .col-lg-6, .col-lg-5, .col-lg-4, .col-lg-3, .col-lg-2, .col-lg-1, .col-md, .col-md-auto, .col-md-12, .col-md-11, .col-md-10, .col-md-9, .col-md-8, .col-md-7, .col-md-6, .col-md-5, .col-md-4, .col-md-3, .col-md-2, .col-md-1, .col-sm, .col-sm-auto, .col-sm-12, .col-sm-11, .col-sm-10, .col-sm-9, .col-sm-8, .col-sm-7, .col-sm-6, .col-sm-5, .col-sm-4, .col-sm-3, .col-sm-2, .col-sm-1, .col, .col-auto, .col-12, .col-11, .col-10, .col-9, .col-8, .col-7, .col-6, .col-5, .col-4, .col-3, .col-2, .col-1
    padding 2px

  .v-input, .v-input-control, .v-text-field
    padding-top 0
    margin-top 0
</style>
