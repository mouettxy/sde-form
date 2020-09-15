// import _ from 'lodash'
// import priceSettings from '@/prices.json'

import { Store } from 'vuex'

// const DEL_ADDRESS = 'DEL_ADDRESS'
// const INIT_ADDRESS_FIELDS = 'INIT_ADDRESS_FIELDS'
// const UPDATE_ADDRESS_FIELDS = 'UPDATE_ADDRESS_FIELDS'
// const UPDATE_ROUTE = 'UPDATE_ROUTE'
// const INIT_PRICE_LIST = 'INIT_PRICE_LIST'
// const INIT_COMPLETE_ADDRESS_FIELDS = 'INIT_COMPLETE_ADDRESS_FIELDS'
// const UPDATE_COMPLETE_ADDRESS_FIELDS = 'UPDATE_COMPLETE_ADDRESS_FIELDS'
// const SET_PRICE_LIST = 'SET_PRICE_LIST'

// let originalLog = console.debug
// // Overwriting
// console.debug = function() {
//   var args = [].slice.call(arguments)
//   originalLog.apply(console.debug, [getCurrentDateString()].concat(args))
// }
// // Returns current timestamp
// function getCurrentDateString() {
//   return new Date().toISOString() + ' ::'
// }

// class Price {
//   constructor(state, store, priceSettings) {
//     this.state = state
//     this.store = store
//     this.client = state.client
//     this.addresses = state.addressList
//     this.isNewClient = state.isNewClient

//     this.settings = undefined
//     _.forEach(priceSettings, (e, k) => {
//       if (k === this.client.region) {
//         this.settings = e
//       }
//     })
//     if (this.settings === undefined) {
//       this.settings = priceSettings['default']
//     }
//   }

//   /* sSetAddressesPrice(additionals) {
//     console.debug('Commiting additionals ...')
//     console.debug(additionals)

//     this.store.commit(SET_ADDRESSES_PRICE, additionals)
//   }

//   sSetRoutesPrice(price) {
//     console.debug('Commiting routes price ...')
//     console.debug(price)

//     this.store.dispatch(SET_ROUTES_PRICE, { price })
//   } */

//   /* -------------------------------------------------------------------------- */
//   /*                                  ADDRESSES                                 */
//   /* -------------------------------------------------------------------------- */

//   addressesPrice() {
//     if (!_.isEmpty(this.state.addressList)) {
//       const additionals = this.additionals()

//       return additionals
//     }

//     return {
//       buyInBuyOut: 0,
//       additionals: 0,
//       bundles: 0,
//       overall: 0,
//     }
//   }

//   additionals() {
//     let freeExtraPoint = typeof this.client === 'string' ? false : this.client.free_extra_point === '1' ? true : false

//     const bInOut = this.bInOut()
//     const additionalsAddresses = this.additionalsAddresses()
//     const bundles = this.bundles()

//     let overall = bInOut + additionalsAddresses.price + bundles

//     if (additionalsAddresses.entries >= this.settings.additionals.entries) {
//       let discount = overall * (this.settings.additionals.entriesDiscount / 100)
//       overall -= discount
//     }

//     if (_.size(this.addresses) > 2 && freeExtraPoint) {
//       overall += (_.size(this.address) - 2) * this.settings.additionals.extraPoint
//     }

//     return {
//       buyInBuyOut: bInOut,
//       additionals: additionalsAddresses,
//       bundles,
//       overall,
//     }
//   }

//   bInOut() {
//     let accumulate = 0
//     let freePay = typeof this.client === 'string' ? false : this.client.free_pay === '1' ? true : false
//     let freeCash = typeof this.client === 'string' ? false : this.client.free_cash === '1' ? true : false

//     _.each(this.addresses, e => {
//       if (e.fields.buyin && !freePay) {
//         accumulate += this.settings.additionals.buyin
//       }
//       if (e.fields.buyout && !freeCash) {
//         accumulate += this.settings.additionals.buyout
//       }
//     })

//     return accumulate
//   }

//   additionalsAddresses() {
//     let accumulate = 0
//     let entries = 0
//     let freeIn = typeof this.client === 'string' ? false : this.client.free_in === '1' ? true : false
//     let freeOut = typeof this.client === 'string' ? false : this.client.free_out === '1' ? true : false

//     _.each(this.addresses, e => {
//       if (e.fields.takeIn && !freeIn) {
//         entries += 1
//         accumulate += this.settings.additionals.takeIn
//       }
//       if (e.fields.takeOut && !freeOut) {
//         entries += 1
//         accumulate += this.settings.additionals.takeOut
//       }
//       if (e.fields.bus) {
//         entries += 1
//         accumulate += this.settings.additionals.bus
//       }
//     })

//     return {
//       price: accumulate,
//       entries,
//     }
//   }

//   bundles() {
//     let accumulate = 0

//     _.each(this.addresses, e => {
//       accumulate += e.fields.bundles * this.settings.additionals.bundle
//     })

//     return accumulate
//   }

//   /* -------------------------------------------------------------------------- */
//   /*                                   ROUTES                                   */
//   /* -------------------------------------------------------------------------- */

//   routes() {
//     if (this.state.route) {
//       let rate = typeof this.state.clinet !== 'string' ? this.client.Input : NaN
//       let price = this.mileage(this.state.route.overallDistance, rate)

//       if (_.isNaN(price) || _.isNull(price) || price === undefined) {
//         console.debug('Routes price incorrect for some reason ...')
//         price = 0
//       }

//       return { price }
//     }

//     return { price: 0 }
//   }

//   mileage(mileage, rate) {
//     try {
//       const isTrue = expr => {
//         if (expr !== 'false') {
//           return true
//         }
//         return false
//       }

//       let price = undefined

//       _.forEach(this.settings.mileage, (e, k) => {
//         let templatedExpression = _.template(e.expression)({ mileage, rate, client: this.client })
//         let templatedPrice = _.template(e.price)({ mileage, rate, client: this.client })
//         let templatedModifier = _.template(e.modifier)({ mileage, rate, client: this.client })

//         if (isTrue(templatedExpression)) {
//           if (isTrue(templatedModifier)) {
//             price = parseInt(templatedPrice) * parseInt(templatedModifier)
//             return false
//           }

//           price = parseInt(templatedPrice)
//           return false
//         }
//       })

//       if (price !== undefined) {
//         return price
//       } else {
//         let tPriceFinally = _.template(this.settings.mileageFinally.price)({ mileage, rate, client: this.client })
//         let tModifierFinally = _.template(this.settings.mileageFinally.modifier)({
//           mileage,
//           rate,
//           client: this.client,
//         })

//         return parseInt(tPriceFinally) * parseInt(tModifierFinally)
//       }
//     } catch (e) {
//       console.debug(e)
//       return 0
//     }
//   }

//   get() {
//     if (this.state.priceList === undefined) {
//       console.debug('INIT price list ...')

//       this.store.commit(INIT_PRICE_LIST, 'init')
//     }

//     let addresses = this.addressesPrice()
//     let routes = this.routes()

//     let priceList = { addresses, routes, additionals: 0, overall: 0, discounted: 0 }

//     if (_.size(this.addresses) >= 2) {
//       let accumulate = 0
//       let discounted = 0

//       if (priceList.addresses) {
//         if (priceList.addresses.overall) {
//           accumulate += priceList.addresses.overall
//           priceList.additionals = priceList.addresses.overall
//         } else {
//           priceList.additionals = 0
//         }
//       }

//       if (priceList.routes) {
//         if (priceList.routes.price) {
//           accumulate += priceList.routes.price
//         }
//       }

//       if (this.state.addressInfo) {
//         if (this.state.addressInfo.car) {
//           let markup = accumulate * (this.settings.carMarkup / 100)
//           accumulate += markup
//         }

//         if (this.state.addressInfo.quick) {
//           let markup = accumulate * (this.settings.quickMarkup / 100)
//           accumulate += markup
//         }
//       }

//       if (typeof this.client !== 'string') {
//         if (this.client.discount) {
//           let discount = parseInt(this.client.discount)
//           if (!isNaN(discount)) {
//             discounted = accumulate
//             discounted -= (discounted / 100) * discount
//           }
//         }
//       }

//       priceList.overall = _.round(accumulate)
//       priceList.discounted = discounted ? _.round(discounted) : _.round(accumulate)
//     } else {
//       priceList.overall = 0
//     }

//     console.debug('Setting price list ...')
//     console.debug(priceList)

//     this.store.commit(SET_PRICE_LIST, priceList)
//   }
// }

// export default store => {
//   // вызывается после инициализации хранилища
//   store.subscribe((mutation, state) => {
//     const affectedMutations = [
//       UPDATE_ROUTE,
//       UPDATE_ADDRESS_FIELDS,
//       INIT_ADDRESS_FIELDS,
//       DEL_ADDRESS,
//       UPDATE_COMPLETE_ADDRESS_FIELDS,
//       INIT_COMPLETE_ADDRESS_FIELDS,
//     ]
//     if (_.includes(affectedMutations, mutation.type)) {
//       let price = new Price(state, store, priceSettings)

//       let debouncedPrice = _.debounce(price.get.bind(price), 500)
//       debouncedPrice(state, store, priceSettings)
//     }
//   })
// }

export default (store: Store<any>) => {
  console.log(store)
}
