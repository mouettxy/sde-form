<template lang="pug">
v-autocomplete.address__search(
  v-model='value',
  :loading='isLoading',
  :items='suggestions',
  :search-input.sync='query',
  :error-messages='errMsg',
  :prepend-inner-icon='$icons.mapMarker',
  :append-icon='$icons.search',
  :success-messages='sucMsg',
  :disabled='disabled',
  @input='onInput',
  :color='color',
  hide-no-data,
  no-filter,
  persistent-hint,
  hint='Выбранный адрес появится в списке путей.',
  label='Укажите адрес доставки'
)
</template>

<script>
import _ from 'lodash'
import { mapActions } from 'vuex'
import { colors } from '@/mixins/'
import { getAddressSuggestions, getAddressLatLon } from '../api/addresses'

export default {
  name: 'AddressField',

  mixins: [colors],

  props: {
    disabled: Boolean,
  },

  data: () => ({
    errMsg: '',
    sucMsg: '',

    isLoading: false,

    // query
    query: '',
    value: {},
    entries: [],
  }),

  methods: {
    ...mapActions(['ADD_ADDRESS']),
    setError(action, text) {
      if (action === 'set') {
        this.errMsg = text
      } else if (action === 'del') {
        this.errMsg = ''
      }
    },
    setSuccess(action, text) {
      if (action === 'set') {
        this.sucMsg = text
      } else if (action === 'del') {
        this.sucMsg = ''
      }
    },
    resetSelect() {
      this.isLoading = false
      this.smoothEraseQuery(25)
    },
    smoothEraseQuery(speed = 50) {
      if (this.query) {
        this.query = this.query.substring(0, this.query.length - 1)
        setTimeout(() => {
          this.smoothEraseQuery(speed)
        }, speed)
      } else {
        this.value = {}
        this.entries = []
        this.sucMsg = ''
        this.errMsg = ''
      }
    },
    async onInput() {
      this.isLoading = true

      if (!this.value.suggestion.house) {
        this.setError('set', 'Не указан дом.')
        return
      }

      if (!this.value.suggestion.geo_lat || !this.value.suggestion.geo_lon) {
        const response = await getAddressLatLon(this.value.detailedAddress)

        if (response) {
          this.value = {
            ...this.value,
            ...response,
            usedGeocoder: true,
          }
        } else {
          this.resetSelect()
          this.setError(
            'set',
            'Не удалось получить данные по адресу. Попробуйте ещё раз или свяжитесь с администрацией сайта.'
          )
        }
      }

      const address = {
        ...this.value,
        isAlias: false,
        completed: false,
      }

      this.ADD_ADDRESS(address)

      this.setSuccess('set', 'Адрес успешно добавлен')
      setTimeout(() => {
        this.resetSelect()
      }, 1000)
    },
    async getSuggestions() {
      this.isLoading = true
      const response = await getAddressSuggestions(this.query)
      if (response) {
        this.entries = response
      } else {
        this.setError('set', 'Не удалось получить подсказки, попробуйте переформулировать запрос.')
      }
      this.isLoading = false
    },
  },

  computed: {
    suggestions() {
      if (!this.entries) {
        return []
      }
      const items = _(this.entries)
        .map(entry => {
          const information = {
            address: entry.value,
            detailedAddress: entry.unrestricted_value,
            usedGeocoder: false,
            geocoderResponse: {},
            suggestion: entry.data,
            lat: entry.data.geo_lat,
            lon: entry.data.geo_lon,
          }
          const address = entry.value
          const suggestion = {
            value: information,
            text: address,
          }
          return Object.assign({}, suggestion)
        })
        .value()
      return items
    },
  },

  watch: {
    query(value) {
      if (value !== null) {
        if (value.length > 3) {
          this.isLoading = 'success'
          this.debouncedSuggestions()
        } else {
          this.setError('del')
        }
      }
    },
  },

  created() {
    this.debouncedSuggestions = _.debounce(this.getSuggestions, 500)
  },
}
</script>

<style>
.address__search .notranslate {
  transform: none !important;
}
</style>
