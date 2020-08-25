import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import store from './store'
import './plugins/mask'
import './plugins/map'
import './plugins/toaster'
import _ from 'lodash'
import moment from 'moment'

Vue.config.productionTip = false

export const unicornBus = new Vue({
  methods: {
    setDateToAddresses(type, index = 0, addresses = undefined) {
      if (type === 'all') {
        addresses = _.cloneDeep(addresses)
        const getTimeOffset = index => {
          let lastIndex = _.findLastIndex(addresses)
          let size = _.size(addresses)

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
        }
        _.each(addresses, (e, index) => {
          let m = moment()
            .locale('ru')
            .add(getTimeOffset(index), 'm')
          e.fields.datetime = `${m.format('L')} ${m.format('LT')}`
        })

        return addresses
      } else if (type === 'single') {
        addresses = _.cloneDeep(addresses)
        const getTimeOffset = index => {
          let lastIndex = _.findLastIndex(addresses)
          let size = _.size(addresses)

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
        }
        let m = moment()
          .locale('ru')
          .add(getTimeOffset(index), 'm')
        addresses[index].fields.datetime = `${m.format('L')} ${m.format('LT')}`

        return addresses[index]
      }
    },
  },
})

new Vue({
  vuetify,
  store,
  render: h => h(App),
}).$mount('#app')
