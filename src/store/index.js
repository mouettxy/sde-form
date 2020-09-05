import Vue from 'vue'
import Vuex from 'vuex'

import _ from 'lodash'
import moment from 'moment'

import { ordersApi, clientApi } from '@/api/'
import { unicornBus } from '@/main'
import endpoints from '@/api/endpoints'

import price from './price'

const ADD_ADDRESS = 'ADD_ADDRESS'
const ADD_CLIENT = 'ADD_CLIENT'
const GET_CLIENT = 'GET_CLIENT'
const RESET_CLIENT = 'RESET_CLIENT'
const CALC_ADDRESS_ID = 'CALC_ADDRESS_ID'
const DEL_ADDRESS = 'DEL_ADDRESS'
const INIT_ADDRESS_FIELDS = 'INIT_ADDRESS_FIELDS'
const UPDATE_ADDRESS_FIELDS = 'UPDATE_ADDRESS_FIELDS'
const UPDATE_ROUTE = 'UPDATE_ROUTE'
const RESET_STATE = 'RESET_STATE'
const INIT_PRICE_LIST = 'INIT_PRICE_LIST'
const SET_ROUTES_PRICE = 'SET_ROUTES_PRICE'
const SET_ADDRESSES_PRICE = 'SET_ADDRESSES_PRICE'
const MERGE_PRICES = 'MERGE_PRICES'
const INIT_COMPLETE_ADDRESS_FIELDS = 'INIT_COMPLETE_ADDRESS_FIELDS'
const UPDATE_COMPLETE_ADDRESS_FIELDS = 'UPDATE_COMPLETE_ADDRESS_FIELDS'
const RESET_FORM = 'RESET_FORM'
const ADD_ORDER = 'ADD_ORDER'
const UPDATE_ADDRESSES_ORDER = 'UPDATE_ADDRESSES_ORDER'
const SEND_ORDER = 'SEND_ORDER'
const SAVE_ORDER = 'SAVE_ORDER'
const SOFTRESET_STATE = 'SOFTRESET_STATE'
const SET_ALIASES = 'SET_ALIASES'
const RELOG_CLIENT = 'RELOG_CLIENT'
const UPDATE_ALIASES = 'UPDATE_ALIASES'
const UPDATE_ADDRESS_ALIAS = 'UPDATE_ADDRESS_ALIAS'
const SET_NEW_CLIENT = 'SET_NEW_CLIENT'
const SET_PRICE_LIST = 'SET_PRICE_LIST'
const SET_ALWAYTS_IN_OUT = 'SET_ALWAYTS_IN_OUT'
Vue.use(Vuex)

const state = {
  client: undefined,
  addressList: undefined,
  addressInfo: undefined,
  priceList: undefined,
  route: undefined,
  isNewClient: false,
  moreThanSixAddresses: false,
}

const getters = {
  /**
   * Returns address by given id
   * @return {object} address object
   */
  addressById: state => id => {
    return _.filter(state.addressList, { id })[0]
  },
  /**
   * Get current aliases state.
   * @return {boolean} true if almost one alias exist else return false
   */
  isAliasesExists(state) {
    return typeof state.client === 'string' ? false : state.client ? (state.client.aliases ? true : false) : false
  },
  isAddressesExists(state) {
    return typeof state.client === 'string' ? false : state.client ? (state.client.saved_orders ? true : false) : false
  },
  /**
   * Get length of address array
   * @return {number} Size of address array, if not address array returns 0
   */
  addressesLength(state) {
    if (state.addressList) {
      return _.size(state.addressList)
    } else {
      return 0
    }
  },
}

const actions = {
  /* -------------------------------------------------------------------------- */
  /*                               CLIENT ACTIONS                               */
  /* -------------------------------------------------------------------------- */

  async [SET_NEW_CLIENT]({ commit }, name) {
    commit(RESET_FORM)
    commit(ADD_CLIENT, name)
    commit(INIT_COMPLETE_ADDRESS_FIELDS, name)
  },

  async [UPDATE_ALIASES]({ state, commit }) {
    try {
      const responseAliases = await clientApi.getAliases(state.client.CLIENT)
      if (responseAliases.status === 200) {
        commit(SET_ALIASES, responseAliases.data)
        return true
      }
      return false
    } catch (e) {
      console.debug(e)
      return false
    }
  },

  async [RELOG_CLIENT]({ state, commit }, id = undefined) {
    try {
      id = id || state.client.CLIENT

      const response = await clientApi.getClient(id)

      if (response.status === 200) {
        const responseAliases = await clientApi.getAliases(id)
        const responseOrders = await clientApi.getAddresses(id)

        response.data.aliases = responseAliases.data || ''
        response.data.saved_orders = responseOrders.data || ''

        commit(RELOG_CLIENT, response.data)

        return true
      }
      return false
    } catch (e) {
      console.debug(e)
      return false
    }
  },

  [SAVE_ORDER]({ state }, data) {
    if (!state.isNewClient) {
      clientApi.saveOrder(data.state, state.client.CLIENT)
    }
  },
  async [SEND_ORDER]({ state, dispatch }, payload) {
    if (payload.needSave) {
      dispatch(SAVE_ORDER, { state: payload.state })
    }

    const id = await ordersApi.sendOrder(payload.results.raw, payload.results.processed, payload.results.modern)
    let client =
      typeof state.client === 'string'
        ? localStorage.getItem('rememberedUserID')
          ? localStorage.getItem('rememberedUserID')
          : false
        : state.client.CLIENT

    if (id) {
      if (payload.needSave) {
        unicornBus.$emit('order-sended-saved', id)
      } else {
        unicornBus.$emit('order-sended', id)
      }

      if (client) {
        dispatch(GET_CLIENT, client, true)
      } else {
        dispatch(RESET_FORM)
      }
    } else {
      console.log(id)
      unicornBus.$emit('order-sended-error')
      if (client) {
        dispatch(GET_CLIENT, client, true)
      } else {
        dispatch(RESET_FORM)
      }
    }
  },
  [ADD_ORDER]({ commit }, order) {
    commit(ADD_ORDER, order)
  },
  /**
   * Completely resets state
   */
  [RESET_FORM]({ commit }) {
    commit(RESET_FORM)
  },
  /**
   * Trying to get client data by it's id. If search succeseful trying to get some aliases tho.
   * @param {number, string} Client id to search
   * @return {number} Status code of response. Possible values [200, 204, 500].
   */
  async [GET_CLIENT]({ commit, dispatch, state }, id, completelyReset, softReset) {
    const response = await clientApi.getClient(id)
    if (response.status === 200) {
      const responseAliases = await clientApi.getAliases(id)
      const responseOrders = await clientApi.getAddresses(id)

      response.data.aliases = responseAliases.data || ''
      response.data.saved_orders = responseOrders.data || ''

      if (completelyReset) {
        commit(RESET_FORM)
      } else if (softReset) {
        commit(SOFTRESET_STATE)
      } else {
        commit(RESET_STATE)
      }

      commit(ADD_CLIENT, response.data)
      commit(INIT_COMPLETE_ADDRESS_FIELDS, response.data)
      if (localStorage.getItem('fillDefaultClientAddress') === 'true') {
        let address = _.filter(state.client.aliases, { name: 'От нас / К нам' })
        address = { ...address[0], isAlias: true, completed: false }
        dispatch(ADD_ADDRESS, address)
        commit(SET_ALWAYTS_IN_OUT)
      }

      return 200
    } else if (response.status === 204) {
      if (completelyReset) {
        commit(RESET_FORM)
      } else {
        commit(RESET_STATE)
      }
      commit(ADD_CLIENT, id)
      commit(INIT_COMPLETE_ADDRESS_FIELDS, response.data)
      return 204
    } else {
      commit(RESET_FORM)
      console.error('Error on load client ', response.data)
      return 500
    }
  },

  /**
   * Adding address and recalculate all ID
   *
   * @param {obj} obj that constains information about address
   * @return void
   */
  [ADD_ADDRESS]({ commit }, address) {
    commit(ADD_ADDRESS, address)
    commit(CALC_ADDRESS_ID)
    if (!address.fields) {
      commit(INIT_ADDRESS_FIELDS)
    }
    commit(SET_ALWAYTS_IN_OUT)

    unicornBus.$emit('address-added', address)
  },

  /**
   * Delete address from list by ID
   *
   * @param {int} id of address
   * @return void
   */
  [DEL_ADDRESS]({ commit, state }, id) {
    if (state.addressList) {
      commit(DEL_ADDRESS, id)
      commit(CALC_ADDRESS_ID)
    }
  },

  /**
   * Sets address fields on address with given id
   * @param {object} payload
   * @param {number} payload.id
   * @param {object} payload.address
   */
  [UPDATE_ADDRESS_FIELDS]({ commit }, payload) {
    commit('UPDATE_ADDRESS_FIELDS', payload)
  },

  /**
   * Set routes object
   *
   * @param {object} payload
   * @param {Array<{from: string, to: string, distance: int, time: int, timeString: string}>} payload.routes
   * @param {int} payload.overallDistance
   * @param {string} payload.overallTimeString
   * @param {int} payload.overallTime
   */
  [UPDATE_ROUTE]({ commit }, payload) {
    commit(UPDATE_ROUTE, payload)
    commit(SET_ALWAYTS_IN_OUT)
  },
}

const mutations = {
  /* -------------------------------------------------------------------------- */
  /*                              CLIENT MUTATIONS                              */
  /* -------------------------------------------------------------------------- */

  [ADD_CLIENT](state, payload) {
    if (typeof payload === 'string') {
      state.client = payload
      state.isNewClient = true
    } else {
      state.client = payload
      state.isNewClient = false
    }
  },
  [RESET_CLIENT](state) {
    state.client = undefined
    state.isNewClient = false
  },
  [SET_ALIASES](state, payload) {
    state.client.aliases = payload
  },
  [RELOG_CLIENT](state, payload) {
    state.client = payload
  },

  /* -------------------------------------------------------------------------- */
  /*                              ADDRESS MUTATIONS                             */
  /* -------------------------------------------------------------------------- */

  [SET_ALWAYTS_IN_OUT](state) {
    let addresses = state.addressList

    if (!this.isNewClient) {
      let alwaysIn = state.client.always_in === '1'
      let alwaysOut = state.client.always_out === '1'
      if (alwaysIn || alwaysOut) {
        _.each(addresses, (e, i) => {
          if (i === 0 && alwaysOut) {
            e.fields.takeIn = false
            e.fields.takeOut = true
          } else if (i === _.findLastIndex(addresses) && alwaysIn) {
            e.fields.takeIn = true
            e.fields.takeOut = false
          } else if (alwaysIn) {
            e.fields.takeIn = true
            e.fields.takeOut = false
          }
        })
      }
    }
  },
  [UPDATE_ADDRESSES_ORDER](state, addresses) {
    state.addressList = addresses
  },
  [UPDATE_COMPLETE_ADDRESS_FIELDS](state, paylaod) {
    state.addressInfo = paylaod
  },
  [INIT_COMPLETE_ADDRESS_FIELDS](state, payload) {
    let base = {
      quick: false,
      car: false,
      whoPays: 'Из выручки',
      comment: '',
    }
    if (typeof payload === 'string') {
      state.addressInfo = base
    } else {
      base.whoPays = payload.payment_who ? payload.payment_who : 'Из выручки'
      state.addressInfo = base
    }
  },
  [UPDATE_ADDRESS_ALIAS](state, payload) {
    let address = _.filter(state.addressList, { id: payload.id })[0]
    address.isAlias = true
  },
  [UPDATE_ADDRESS_FIELDS](state, payload) {
    let address = _.filter(state.addressList, { id: payload.id })[0]
    if (address) {
      address.fields = payload.address
    }
  },
  [INIT_ADDRESS_FIELDS](state) {
    let address = _.last(state.addressList)
    const date = moment()
      .locale('ru')
      .format('L')
    const time = moment('20.00', 'HH:mm')
      .locale('ru')
      .format('LT')
    const datetime = `${date} ${time}`
    const defaultFields = {
      phone: '',
      datetime,
      bundles: 0,
      comment: '',
      buyin: 0,
      buyout: 0,
      takeIn: false,
      takeOut: false,
      bus: false,
    }
    if (address.isAlias) {
      if (address.name == 'От нас / К нам') {
        let phone = _.clone(state.client.customer_phone)
        if (phone[0] == '8' || phone[0] == '7') {
          phone = phone.slice(1)
        }
        if (phone[0] + phone[1] == '+7') {
          phone = phone.slice(2)
        }
        phone = phone.replace(/(\d\d\d)(\d\d\d)(\d\d)(\d\d)/, '($1) $2-$3-$4')
        address.fields = {
          phone: phone,
          datetime,
          bundles: 0,
          buyin: 0,
          buyout: 0,
          comment: state.client.customer_adress_comment,
          takeIn: state.client.always_in === '1' ? true : false,
          takeOut: state.client.always_out === '1' ? true : false,
          bus: false,
        }
      } else {
        address.fields = defaultFields
      }
    } else {
      address.fields = defaultFields
    }
  },
  [DEL_ADDRESS](state, payload) {
    state.addressList = _.filter(state.addressList, e => {
      return e.id !== payload
    })

    if (state.addressList.length === 0) {
      state.addressList = undefined
    }
  },
  [ADD_ADDRESS](state, payload) {
    if (state.addressList) {
      if (state.addressList.length > 5) {
        state.moreThanSixAddresses = true
      } else {
        state.addressList.push(payload)
        state.moreThanSixAddresses = false
      }
    } else {
      state.addressList = [payload]
      state.moreThanSixAddresses = false
    }
  },
  [CALC_ADDRESS_ID](state) {
    let id = 1
    _.each(state.addressList, address => {
      address.id = id
      id++
    })
  },

  /* -------------------------------------------------------------------------- */
  /*                           GLOBAL STATE MUTATIONS                           */
  /* -------------------------------------------------------------------------- */

  [ADD_ORDER](state, order) {
    state.addressList = unicornBus.setDateToAddresses('all', 0, order.addressList)
    state.addressInfo = order.addressInfo
    state.priceList = order.priceList
    state.route = order.route
  },
  [RESET_FORM](state) {
    state.client = undefined
    state.addressList = undefined
    state.addressInfo = undefined
    state.priceList = undefined
    state.route = undefined
    state.isNewClient = false
  },
  [RESET_STATE](state) {
    state.client = undefined
    state.addressList = undefined
    state.priceList = undefined
    state.route = undefined
    state.isNewClient = false
  },
  [SOFTRESET_STATE](state) {
    state.client = undefined
  },

  /* -------------------------------------------------------------------------- */
  /*                               PRICE MUTATIONS                              */
  /* -------------------------------------------------------------------------- */

  [SET_PRICE_LIST](state, payload) {
    state.priceList = payload
  },
  [SET_ROUTES_PRICE](state, payload) {
    state.priceList.routes = payload
  },
  [SET_ADDRESSES_PRICE](state, payload) {
    state.priceList.addresses = payload
  },
  [MERGE_PRICES](state) {
    if (_.size(state.addressList) >= 2) {
      let accumulate = 0
      let discounted = 0
      let addresses = state.priceList.addresses

      let routes = state.priceList.routes

      if (addresses) {
        if (addresses.overall) {
          accumulate += addresses.overall
          state.priceList.additionals = addresses.overall
        } else {
          state.priceList.additionals = 0
        }
      }

      if (routes) {
        if (routes.price) {
          accumulate += routes.price
        }
      }

      if (state.addressInfo.car) {
        accumulate += (accumulate / 100) * 15
      }

      if (state.addressInfo.quick) {
        accumulate += (accumulate / 100) * 20
      }

      if (typeof state.client !== 'string') {
        if (state.client.discount) {
          let discount = parseInt(state.client.discount)
          if (!isNaN(discount)) {
            discounted = accumulate
            discounted -= (discounted / 100) * discount
          }
        }
      }

      state.priceList.overall = _.round(accumulate)
      state.priceList.discounted = discounted ? _.round(discounted) : _.round(accumulate)
    } else {
      state.priceList.overall = 0
    }
  },
  [INIT_PRICE_LIST](state, action) {
    if (action === 'init') {
      state.priceList = {
        routes: undefined,
        addresses: undefined,
        overall: 0,
        discounted: 0,
        additionals: 0,
      }
    } else if (action === 'reset') {
      state.priceList = undefined
    }
  },

  /* -------------------------------------------------------------------------- */
  /*                               ROUTE MUTATIONS                              */
  /* -------------------------------------------------------------------------- */

  [UPDATE_ROUTE](state, payload) {
    state.route = payload
  },
}

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  plugins: [price],
})
