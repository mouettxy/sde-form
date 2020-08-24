import _, { add, over } from 'lodash'
import { address } from '../plugins/axios'

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

const log = function(...args) {
  if (process.env.NODE_ENV === 'development') {
    console.debug(...args)
  }
}

function updatePrice(state, store) {
  calculateRoutesPrice(state, store)
  calculateAddressesPrice(state, store)
  store.dispatch(MERGE_PRICES)
}

function calculateAddressesPrice(state, store) {
  if (state.priceList === undefined) {
    log('Init price list...')
    store.commit(INIT_PRICE_LIST, 'init')
  }
  if (state.addressList) {
    const additionals = calculateAdditionals(state.addressList, state.client)
    log('Commiting additionals ', additionals)
    store.commit(SET_ADDRESSES_PRICE, additionals)
  } else {
    /* log('Resetting price list...')
    store.commit(INIT_PRICE_LIST, 'reset') */
  }
}

function calculateAdditionals(addresses, client) {
  const buyInBuyOut = calculateBuyInBuyOut(addresses, client)
  const additionals = calculateAdditionalsAddresses(addresses, client)
  const bundles = calculateBundles(addresses)
  let overall = buyInBuyOut + additionals.price + bundles
  if (additionals.entries >= 5) {
    log('Additional entries >= 5, adding 10% to additional overall value')
    overall = (overall / 100) * 10
  }
  return {
    buyInBuyOut,
    additionals,
    bundles,
    overall,
  }
}

function calculateBuyInBuyOut(addresses, client) {
  let accumulate = 0
  _.each(addresses, e => {
    if (typeof client === 'string') {
      if (e.fields.buyin) {
        accumulate += 35
      }
      if (e.fields.buyout) {
        accumulate += 35
      }
    } else {
      if (e.fields.buyin && !(client.free_pay === '1')) {
        accumulate += 35
      }
      if (e.fields.buyout && !(client.free_cash === '1')) {
        accumulate += 35
      }
    }
  })
  return accumulate
}

function calculateAdditionalsAddresses(addresses, client) {
  let accumulate = 0
  let entries = 0
  _.each(addresses, e => {
    if (typeof client === 'string') {
      if (e.fields.takeIn) {
        entries += 1
        accumulate += 35
      }
      if (e.fields.takeOut) {
        entries += 1
        accumulate += 35
      }
    } else {
      if (e.fields.takeIn && !(client.free_in === '1')) {
        entries += 1
        accumulate += 35
      }
      if (e.fields.takeOut && !(client.free_out === '1')) {
        entries += 1
        accumulate += 35
      }
    }
    if (e.fields.bus) {
      entries += 1
      accumulate += 75
    }
  })
  if (entries >= 5) {
    accumulate = (accumulate / 100) * 10
  }
  return {
    price: accumulate,
    entries,
  }
}

function calculateBundles(addresses) {
  let accumulate = 0
  _.each(addresses, e => {
    accumulate += e.fields.bundles * 5
  })
  return accumulate
}

function calculateRoutesPrice(state, store) {
  if (state.priceList === undefined) {
    log('Init price list...')
    store.commit(INIT_PRICE_LIST, 'init')
  }
  if (state.route) {
    let price
    if (typeof state.client === 'string') {
      price = calculateMileagePrice(state.route.overallDistance, NaN)
    } else {
      price = calculateMileagePrice(state.route.overallDistance, parseInt(state.client.Input))
    }
    log('Commiting price ', { price })
    store.dispatch(SET_ROUTES_PRICE, { price })
  } else {
    /* log('Resetting price list...')
    store.commit(INIT_PRICE_LIST, 'reset') */
  }
}

function calculateMileagePrice(mileage, rate) {
  try {
    if (mileage <= 3) {
      return 90
    } else if (mileage > 3 && mileage <= 5) {
      return 120
    } else if (!isNaN(rate)) {
      if (rate > 0) {
        return mileage * rate
      }
    } else if (5 < mileage < 10) {
      return mileage * 23
    } else if (10 <= mileage < 20) {
      return mileage * 21
    } else {
      return mileage * 19
    }
  } catch (e) {
    console.debug(e)
    return 0
  }
}

export default store => {
  // вызывается после инициализации хранилища
  store.subscribe((mutation, state) => {
    const affectedMutations = [
      UPDATE_ROUTE,
      UPDATE_ADDRESS_FIELDS,
      INIT_ADDRESS_FIELDS,
      DEL_ADDRESS,
      UPDATE_COMPLETE_ADDRESS_FIELDS,
      INIT_COMPLETE_ADDRESS_FIELDS,
    ]
    if (_.includes(affectedMutations, mutation.type)) {
      let debouncedPrice = _.debounce(updatePrice, 1000)
      debouncedPrice(state, store)
    }
  })
}
