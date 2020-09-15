import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import {
  OrderAddress as Address,
  OrderInformation as Information,
  OrderPrices as Prices,
  OrderRoute,
  OrderRoute as Route
} from '@/typings/order'
import { filter as lodashFilter, isUndefined, each as lodashEach } from 'lodash'

@Module({
  name: 'addresses',
  namespaced: true
})
export default class Addresses extends VuexModule {
  public addresses: Address[] = []
  public information?: Information = undefined
  public prices?: Prices = undefined
  public routes?: Route[] = undefined

  get isAddressesReachLimit() {
    return (!isUndefined(this.addresses) && this.addresses.length > 5) || false
  }

  get addressList() {
    return this.addresses
  }

  @Mutation
  ADD_ADDRESS(payload: Address) {
    if (!this.isAddressesReachLimit) {
      this.addresses ? this.addresses.push(payload) : (this.addresses = [payload])

      let id = 1
      lodashEach(this.addresses, (address) => {
        address.id = id
        id++
      })
    }
  }

  @Mutation
  ADD_ORDER(payload: any) {
    //
  }

  @Mutation
  REMOVE_ADDRESS(payload: number) {
    this.addresses = lodashFilter(this.addresses, (e: Address): boolean => {
      return e.id !== payload
    }) as Address[]

    if (!isUndefined(this.addresses) && !this.addresses.length) {
      this.addresses = []
    }
  }

  @Mutation
  UPDATE_ADDRESSES(payload: [Address]) {
    this.addresses = payload
  }

  @Mutation
  UPDATE_ORDER(payload: [Address]) {
    this.addresses = payload
  }

  @Mutation
  UPDATE_ROUTES(payload?: OrderRoute[]) {
    this.routes = payload
  }

  @Action
  reset() {
    //
  }

  @Action
  async add(payload?: Address) {
    if (payload) {
      this.context.commit('ADD_ADDRESS', payload)
      return Promise.resolve(true)
    }
  }

  @Action
  async addOrder(payload: any) {
    this.context.commit('ADD_ORDER', payload)
    return Promise.resolve(true)
  }
}
