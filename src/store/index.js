import Vue from 'vue'
import Vuex from 'vuex'
import { http } from '../plugins/axios'
import _, { update, over } from 'lodash'
import price from './price'
import moment from 'moment'

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

Vue.use(Vuex)

const state = {
  client: undefined,
  addressList: undefined,
  addressInfo: undefined,
  priceList: undefined,
  route: undefined,
  isNewClient: false,
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
   * Sets price affected to routes and Google Maps API (that means this calls is not often)
   * @param {object} payload
   * @param {int} paylaod.id
   */
  [SET_ROUTES_PRICE]({ commit, dispatch, state }, payload) {
    try {
      if (state.priceList) {
        commit(SET_ROUTES_PRICE, payload)
      } else {
        commit(INIT_PRICE_LIST)
        commit(SET_ROUTES_PRICE, payload)
      }
    } catch (e) {
      console.debug(e)
    }
  },
  /**
   * Sets price affected to address. Very often calls
   * @param {object} payload
   */
  [SET_ADDRESSES_PRICE]({ commit, dispatch }, payload) {
    try {
      if (state.priceList) {
        commit(SET_ADDRESSES_PRICE, payload)
      } else {
        commit(INIT_PRICE_LIST)
        commit(SET_ADDRESSES_PRICE, payload)
      }
    } catch (e) {
      console.debug(e)
    }
  },
  /**
   * Merges routes and addresses prices, applies discount if exists
   * @param {object} payload
   */
  [MERGE_PRICES]({ commit }, payload) {
    try {
      commit(MERGE_PRICES, payload)
    } catch (e) {
      console.debug(e)
    }
  },
  /**
   * Trying to get client data by it's id. If search succeseful trying to get some aliases tho.
   * @param {number, string} Client id to search
   * @return {number} Status code of response. Possible values [200, 204, 500].
   */
  async [GET_CLIENT]({ commit }, id) {
    const getClient = `/api/v2/client/${id}`
    const getAliases = `/api/v2/client/${id}/aliases`
    const getOrders = `/api/v2/client/${id}/orders/`
    const response = await http.get(getClient)
    if (response.status === 200) {
      const responseAliases = await http.get(getAliases)
      const responseOrders = await http.get(getOrders)

      response.data.aliases = responseAliases.data || ''
      response.data.saved_orders = responseOrders.data || ''

      commit(RESET_STATE)
      commit(ADD_CLIENT, response.data)
      commit(INIT_COMPLETE_ADDRESS_FIELDS, response.data)
      return 200
    } else if (response.status === 204) {
      commit(RESET_STATE)
      commit(ADD_CLIENT, id)
      commit(INIT_COMPLETE_ADDRESS_FIELDS, response.data)
      return 204
    } else {
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
    commit(INIT_ADDRESS_FIELDS)
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
  },
}

const mutations = {
  [ADD_ORDER](state, order) {
    state.addressList = order.addressList
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
  [UPDATE_COMPLETE_ADDRESS_FIELDS](state, paylaod) {
    state.addressInfo = paylaod
  },
  [INIT_COMPLETE_ADDRESS_FIELDS](state, payload) {
    let base = {
      quick: false,
      car: false,
      optimizeRoute: false,
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
  [UPDATE_ROUTE](state, payload) {
    state.route = payload
  },
  [UPDATE_ADDRESS_FIELDS](state, payload) {
    let address = _.filter(state.addressList, { id: payload.id })[0]
    address.fields = payload.address
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
      state.addressList.push(payload)
    } else {
      state.addressList = [payload]
    }
  },
  [CALC_ADDRESS_ID](state) {
    let id = 1
    _.each(state.addressList, address => {
      address.id = id
      id++
    })
  },
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
  [RESET_STATE](state) {
    state.client = undefined
    state.addressList = undefined
    state.priceList = undefined
    state.route = undefined
    state.isNewClient = false
  },
}

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  plugins: [price],
})
