<template lang="pug">
.send-order__main
  v-card.send-order__main-wrap.elevation-6
    v-card-title
      .send-order__top-actions-block
        v-btn(icon, @click='backToFilling()', size='60px')
          v-icon {{ $icons.leftArrow }}
        span Оформление заявки
    v-card-text
      v-card.send-order__client.elevation-3
        v-timeline(dense)
          v-timeline-item.send-order__buttons(:icon='$icons.check')
            v-card.pa-2
              v-btn(color='primary', block, @click='callExpeditor()') Вызвать экспедитора
              v-divider.mt-4.mb-n2.mx-4
              v-row
                v-col(cols='12', lg='6', md='6')
                  v-text-field(
                    :color='color',
                    label='Сохранённый адрес',
                    hint='Укажите имя для сохранённого адреса. Заявка будет отправлена.',
                    type='text',
                    auocomplete='false',
                    :prepend-inner-icon='$icons.save',
                    v-model.number='addressSaveName',
                    :error-messages='addressSaveErrors'
                  )
                v-col(cols='12', lg='6', md='6')
                  v-btn.mt-4(color='primary', block, @click='callExpeditor(true)') Cохранить заявку
          v-timeline-item.send-order__client(:icon='$icons.user')
            v-card
              v-card-title.secondary.send-order__client-header
                template(v-if='isNew')
                  span Добро пожаловать в SDE {{clientInformation}}, не забудьте связаться с администрацией сайта для получения постоянного идентификатора клиента.
                template(v-if='clientInformation')
                  v-icon(color='#181818') {{$icons.user}}
                  span {{ clientInformation.CLIENT }} {{clientInformation.customer_name}}
          v-timeline-item.send-order__address(
            v-for='address in addresses.addresses',
            :key='address.id',
            fill-dot,
            small,
            :icon='$icons.mapMarker'
          )
            v-card.send-order__address-wrap.elevation-2
              v-card-title.secondary.send-order__address-header
                v-icon(size='1.4rem', color='#181818') {{$icons.mapMarker}}
                span {{compact(address.address)}}
              v-card-text.send-order__address-text
                v-list-item(two-line, v-if='address.fields.phone')
                  v-list-item-content
                    v-list-item-title Телефон
                    v-list-item-subtitle {{address.fields.phone}}
                v-list-item(two-line, v-if='address.fields.comment')
                  v-list-item-content
                    v-list-item-title Комментарий
                    v-list-item-subtitle {{address.fields.comment}}
                v-list-item(two-line, v-if='address.fields.datetime')
                  v-list-item-content
                    v-list-item-title Когда доставить / Получить
                    v-list-item-subtitle {{address.fields.datetime}}
                v-list-item(two-line, v-if='address.fields.bundles')
                  v-list-item-content
                    v-list-item-title Наборы
                    v-list-item-subtitle Колиество наборов: {{address.fields.bundles}}
                v-list-item(two-line, v-if='address.fields.buyin')
                  v-list-item-content
                    v-list-item-title Выкуп
                    v-list-item-subtitle
                      span {{address.fields.buyin}}
                      v-icon(size='1rem') {{$icons.rub}}
                v-list-item(two-line, v-if='address.fields.buyout')
                  v-list-item-content
                    v-list-item-title Выручка
                    v-list-item-subtitle
                      span {{address.fields.buyout}}
                      v-icon(size='1rem') {{$icons.rub}}
                v-list-item(two-line, v-if='address.fields.takeIn')
                  v-list-item-content
                    v-list-item-title Заносим
                v-list-item(two-line, v-if='address.fields.takeOut')
                  v-list-item-content
                    v-list-item-title Выносим
                v-list-item(two-line, v-if='address.fields.bus')
                  v-list-item-content
                    v-list-item-title Требуется автобус
          v-timeline-item.send-order__info(fill-dot, small, :icon='$icons.info', v-if='addresses')
            v-card
              v-card-title.secondary.send-order__info-header
                v-icon(size='1.4rem', color='#181818') {{$icons.info}}
                span Доп. информация
              v-card-text.send-order__info-text
                v-list-item(two-line, v-if='addresses.info.comment')
                  v-list-item-content
                    v-list-item-title Комментарий
                    v-list-item-subtitle {{addresses.info.comment}}
                v-list-item(two-line, v-if='addresses.info.whoPays')
                  v-list-item-content
                    v-list-item-title Кто оплачивает доставку
                    v-list-item-subtitle {{addresses.info.whoPays}}
                v-list-item(two-line, v-if='addresses.info.quick')
                  v-list-item-content
                    v-list-item-title Срочная доставка
                v-list-item(two-line, v-if='addresses.info.car')
                  v-list-item-content
                    v-list-item-title Доставка автомобилем
                v-list-item(two-line, v-if='addresses.info.optimizeRoute')
                  v-list-item-content
                    v-list-item-title Оптимизировать маршрут
          v-timeline-item.send-order__price(:icon='$icons.cash')
            v-card
              v-card-title.secondary.send-order__price-header
                v-icon(size='1.4rem', color='#181818') {{$icons.cash}}
                span Цена
              v-card-text
                v-simple-table.send-order__price-table
                  template(v-slot:default='')
                    tbody
                      tr(v-if='addresses.routes').send-order__price-payed-row
                        td Расстояние ({{addresses.routes.overallDistance}} км.)
                        td
                        td
                          span + {{ round(prices.routes.price) }}
                          v-icon(size='1rem') {{$icons.rub}}
                      tr(v-if='prices.additionals').send-order__price-payed-row
                        td Дополнительные услуги
                        td
                        td
                          span + {{ prices.additionals }}
                          v-icon(size='1rem') {{$icons.rub}}
                      tr(v-if='prices.addresses.buyInBuyOut').send-order__price-payed-row
                        td Выручка / Выкуп
                        td
                        td
                          span + {{ prices.addresses.buyInBuyOut }}
                          v-icon(size='1rem') {{$icons.rub}}
                      tr(v-if='prices.addresses.additionals.price').send-order__price-payed-row
                        td Прочее
                        td
                        td
                          span + {{ prices.addresses.additionals.price }}
                          v-icon(size='1rem') {{$icons.rub}}
                      tr(v-if='prices.addresses.bundles').send-order__price-payed-row
                        td Наборы
                        td
                        td
                          span + {{ prices.addresses.bundles }}
                          v-icon(size='1rem') {{$icons.rub}}
                      tr(v-if='addresses.info.quick').send-order__price-payed-row
                        td
                        td Срочная доставка
                        td
                          span + 20%
                      tr(v-if='addresses.info.car').send-order__price-payed-row
                        td
                        td Доставка автомобилем
                        td
                          span + 15%
                      template(v-if='addresses')
                        tr(v-if='prices.addresses.additionals.entries > 5').send-order__price-discount-row
                          td
                          td Количество доп. услуг
                          td
                            span - 5%
                      template(v-if='typeof clientInformation !== "string" && clientInformation')
                        tr(v-if='clientInformation.discount').send-order__price-discount-row
                          td
                          td Скидка клиента
                          td
                            span - {{ clientInformation.discount }}%
                      tr(v-if='prices.overall').send-order__price-final-row.success
                        td
                        td Итого
                        td
                          span(:class='prices.discounted !== prices.overall ? "send-order__line-through" : ""') + {{ prices.overall }}
                          v-icon(size='1rem') {{$icons.rub}}
                      tr(v-if='prices.discounted').send-order__price-final-row.success
                        td
                        td Со скидкой
                        td
                          span + {{ prices.discounted }}
                          v-icon(size='1rem') {{$icons.rub}}
          v-timeline-item.send-order__buttons(:icon='$icons.check')
            v-card.pa-2
              v-btn(color='primary', block, @click='callExpeditor()') Вызвать экспедитора
              v-divider.mt-4.mb-n2.mx-4
              v-row
                v-col(cols='12', lg='6', md='6')
                  v-text-field(
                    :color='color',
                    label='Сохранённый адрес',
                    hint='Укажите имя для сохранённого адреса. Заявка будет отправлена.',
                    type='text',
                    auocomplete='false',
                    :prepend-inner-icon='$icons.save',
                    v-model.number='addressSaveName',
                    :error-messages='addressSaveErrors'
                  )
                v-col(cols='12', lg='6', md='6')
                  v-btn.mt-4(color='primary', block, @click='callExpeditor(true)') Cохранить заявку
</template>

<script>
import _, { add } from 'lodash'
import moment from 'moment'
import { sendOrder, saveOrder } from '@/api/order'
import { colors, breakpoints } from '@/mixins/'
import { mapState } from 'vuex'

export default {
  name: 'SendOrder',

  mixins: [colors, breakpoints],

  props: [],

  data: () => ({
    addressSaveName: '',
    addressSaveErrors: '',
  }),

  computed: {
    ...mapState(['client', 'addressList', 'addressInfo', 'priceList', 'route', 'isNewClient']),
    clientInformation() {
      const client = _.cloneDeep(this.client)
      return client
    },
    addresses() {
      let addresses = _.cloneDeep(this.addressList)
      addresses = {
        addresses,
        info: _.cloneDeep(this.addressInfo),
        routes: _.cloneDeep(this.route),
      }
      return addresses
    },
    prices() {
      const prices = _.cloneDeep(this.priceList)
      return prices
    },
    isNew() {
      const isNew = _.cloneDeep(this.isNewClient)
      return isNew
    },
  },

  methods: {
    backToFilling() {
      this.$emit('back')
    },
    async callExpeditor(needSave) {
      if (needSave) {
        if (!this.addressSaveName) {
          this.addressSaveErrors = 'Обязательно укажите имя сохранённого адреса.'
          return
        }

        let results = this.formatData()
        let id = await sendOrder(results.raw, results.processed)
        let state = {
          name: this.addressSaveName,
          addressInfo: this.addressInfo,
          addressList: this.addressList,
          priceList: this.priceList,
          route: this.route,
        }

        let saved = await saveOrder(_.cloneDeep(state), this.client.CLIENT)
        if (id !== false) {
          this.$emit('order-sended', { id, client: this.client.CLIENT })
        } else {
          this.$emit('order-sended-error')
        }

        if (saved !== false) {
          this.$emit('order-saved')
        } else {
          this.$emit('order-saved-error')
        }
      } else {
        let results = this.formatData()
        let id = await sendOrder(results.raw, results.processed)

        if (id !== false) {
          this.$emit('order-sended', { id, client: this.client.CLIENT })
        } else {
          this.$emit('order-sended-error')
        }
      }
    },
    formatAddress(address) {
      let phone = address.fields.phone
      if (phone) {
        phone = phone.replace(/\D/g, '')
        if (phone[0] === '7') {
          phone = '8' + phone.slice(1)
        } else {
          phone = '8' + phone
        }
      }
      let a = _([address.address, address.fields.comment, phone || false])
        .compact()
        .value()
        .join(', ')
      let b = _([
        address.fields.takeIn ? 'занос' : false,
        address.fields.takeOut ? 'вынос' : false,
        address.fields.buyin ? `выкуп(${address.fields.buyin})` : false,
        address.fields.buyout ? `выручка(${address.fields.buyout})` : false,
        address.fields.bundles ? `наборов ${address.fields.bundles}` : false,
      ])
        .compact()
        .value()
        .join(', ')

      let c = b ? `${a} (${b})` : a
      return c
    },
    formatData() {
      const client = this.clientInformation
      const addresses = this.addresses.addresses
      const info = this.addresses.info
      const fields = id => {
        return addresses[id].fields
      }

      let from = this.formatAddress(addresses[0])
      let to = _(addresses.slice(1))
        .map(e => {
          return this.formatAddress(e)
        })
        .value()
        .join(' ---> ')
      let buyin = _.reduce(
        addresses,
        (r, v) => {
          r += v.fields.buyout
          return r
        },
        0
      )

      const processed = {
        комментарий_загрузки: '',
        месяц: moment()
          .locale('ru')
          .startOf('month')
          .format('L'),
        дата: moment()
          .locale('ru')
          .format('L'),
        время_заявки: moment()
          .locale('ru')
          .format('LTS'),
        время_подачи: fields(0).datetime || '',
        время_выполнения: fields(_.size(addresses) - 1).datetime || '',
        откуда: from,
        куда: to,
        автомобиль: info.car ? 'Требуется автомобиль' : false,
        номер_клиента: !this.isNew ? client.CLIENT : client,
        кто: !this.isNew ? client.customer_name : '',
        телефон_клиента: !this.isNew ? client.customer_phone : '',
        тариф: !this.isNew ? client.Input : '',
        форма_оплаты: !this.isNew ? client.payment_form : '',
        промокод: !this.isNew ? client.who_attracted : '',
        скидка: !this.isNew ? client.discount : '',
        условия_оплаты: !this.isNew ? client.payment_type : '',
        кто_платит: info.whoPays || '',
        кто_везёт: (!this.isNew ? (client.stop_delivery === '1' ? 'не возим' : '') : '') + (info.optimizeRoute || ''),
        пробег: this.addresses.routes.overallDistance,
        время_в_пути: this.addresses.routes.overallTimeString,
        'стоимость допов': this.prices.additionals || '',
        стоимость: this.prices.overall || '',
        стоимость_со_скидкой: this.prices.discounted || this.prices.overall || '',
        выручка: buyin,
        комментарий: info.comment || '',
      }

      let id = 'id'
      let additionals = 'additionals'

      const rawTag = (strings, type, args) => {
        return { strings, type, args }
      }

      const rawTagEval = (key, exp) => {
        let id = _.last(key) === 'a' ? '0' : _.last(key)
        let idExists = typeof addresses[id] !== 'undefined'
        exp.strings = _.map(_.compact(exp.strings), e => {
          return e.trim()
        })
          .join('')
          .split('.')
        if (exp.type === 'id') {
          if (exp.strings[0] === 'fields') {
            if (exp.strings[1] === 'phone') {
              return idExists
                ? addresses[id][exp.strings[0]][exp.strings[1]]
                  ? '8' + addresses[id][exp.strings[0]][exp.strings[1]].replace(/\D/g, '')
                  : ''
                : ''
            }
            return idExists ? addresses[id][exp.strings[0]][exp.strings[1]] : ''
          } else if (exp.strings[0] === 'address') {
            return idExists ? addresses[id][exp.strings[0]] : ''
          }
        } else if (exp.type === 'additionals') {
          return idExists
            ? _.compact([
                addresses[id].fields.takeIn ? 'Занос' : '',
                addresses[id].fields.takeOut ? 'Вынос' : '',
                addresses[id].fields.bus ? 'Встретить или отправить автобус' : '',
              ]).join('; ')
            : ''
        }
        return [key, exp]
      }

      let rawMappings = {
        date_time_otkuda: rawTag`${id} fields.datetime`,
        date_time_kuda_1: rawTag`${id} fields.datetime`,
        date_time_kuda_2: rawTag`${id} fields.datetime`,
        date_time_kuda_3: rawTag`${id} fields.datetime`,
        date_time_kuda_4: rawTag`${id} fields.datetime`,
        date_time_kuda_5: rawTag`${id} fields.datetime`,
        dop_uslugi_otkuda: rawTag`${additionals}`,
        dop_uslugi_kuda_1: rawTag`${additionals}`,
        dop_uslugi_kuda_2: rawTag`${additionals}`,
        dop_uslugi_kuda_3: rawTag`${additionals}`,
        dop_uslugi_kuda_4: rawTag`${additionals}`,
        dop_uslugi_kuda_5: rawTag`${additionals}`,
        komment_otkuda: rawTag`${id} fields.comment`,
        komment_kuda_1: rawTag`${id} fields.comment`,
        komment_kuda_2: rawTag`${id} fields.comment`,
        komment_kuda_3: rawTag`${id} fields.comment`,
        komment_kuda_4: rawTag`${id} fields.comment`,
        komment_kuda_5: rawTag`${id} fields.comment`,
        otkuda: rawTag`${id} address`,
        kuda_1: rawTag`${id} address`,
        kuda_2: rawTag`${id} address`,
        kuda_3: rawTag`${id} address`,
        kuda_4: rawTag`${id} address`,
        kuda_5: rawTag`${id} address`,
        nabor_otkuda: rawTag`${id} fields.bundles`,
        nabor_kuda_1: rawTag`${id} fields.bundles`,
        nabor_kuda_2: rawTag`${id} fields.bundles`,
        nabor_kuda_3: rawTag`${id} fields.bundles`,
        nabor_kuda_4: rawTag`${id} fields.bundles`,
        nabor_kuda_5: rawTag`${id} fields.bundles`,
        summ_pay_otkuda: rawTag`${id} fields.buyout`,
        summ_pay_kuda_1: rawTag`${id} fields.buyout`,
        summ_pay_kuda_2: rawTag`${id} fields.buyout`,
        summ_pay_kuda_3: rawTag`${id} fields.buyout`,
        summ_pay_kuda_4: rawTag`${id} fields.buyout`,
        summ_pay_kuda_5: rawTag`${id} fields.buyout`,
        tel_otkuda: rawTag`${id} fields.phone`,
        tel_kuda_1: rawTag`${id} fields.phone`,
        tel_kuda_2: rawTag`${id} fields.phone`,
        tel_kuda_3: rawTag`${id} fields.phone`,
        tel_kuda_4: rawTag`${id} fields.phone`,
        tel_kuda_5: rawTag`${id} fields.phone`,
        viruchka_otkuda: rawTag`${id} fields.buyin`,
        viruchka_kuda_1: rawTag`${id} fields.buyin`,
        viruchka_kuda_2: rawTag`${id} fields.buyin`,
        viruchka_kuda_3: rawTag`${id} fields.buyin`,
        viruchka_kuda_4: rawTag`${id} fields.buyin`,
        viruchka_kuda_5: rawTag`${id} fields.buyin`,
      }

      let rawMappingsModified = {}

      _.each(rawMappings, (e, k) => {
        rawMappingsModified[k] = rawTagEval(k, e)
      })

      const raw = {
        customer: !this.isNew ? client.CLIENT : client,
        komment: info.comment || '',
        kto_opl_dost: info.whoPays || '',
        route_opt: info.optimizeRoute ? 'Оптимизировать маршрут' : '',
        srochno: info.quick || '',
        summ_pay: buyin || '',
        car: info.car ? 'Требуется автомобиль' : '',
        ...rawMappingsModified,
      }

      return { raw, processed }
    },
    compact(val) {
      const search = ['г Краснодар, ', 'ул им. ', 'ул ']
      _.each(search, e => {
        val = val.replace(e, '')
      })
      return val
    },
    round(val) {
      return _.round(val)
    },
  },

  watch: {},

  mounted() {},
}
</script>

<style lang="stylus" scoped>
colors = {
  primary: #ffcc01,
  black: #181818,
  secondary: #E0E0E0,
  white: #fff
}

+prefix-classes('send-order__')
  .main
    padding 6px

    .main-wrap
      padding 6px

      .client
        .client-header
          background colors.primary
          color colors.black
          font-size 1rem
          font-weight 400

      .address
        .address-wrap
          .address-header
            background colors.primary
            color colors.black
            font-size 1rem
            font-weight 400

      .info
        .info-header
          background colors.primary
          color colors.black
          font-size 1rem
          font-weight 400

      .price
        .price-header
          background colors.primary
          color colors.black
          font-size 1rem
          font-weight 400

        .price-table
          .price-final-row
            background colors.secondary

          .line-through
            text-decoration line-through

      .top-actions-block
        font-size 1.4rem

.send-order__info-text
  .v-list-item
    padding 0

    .v-icon
      margin-bottom 2px

.send-order__address-text
  .v-list-item
    padding 0

    .v-icon
      margin-bottom 2px

.send-order__price
  .v-list-item
    padding 0

    .v-icon
      margin-bottom 2px
</style>
