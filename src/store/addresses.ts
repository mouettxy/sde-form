import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import {
  AddressFields,
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
    if (this.addresses.length > 5) {
      return true
    }

    return false
  }

  get addressList() {
    return this.addresses
  }

  @Mutation
  ADD_ADDRESS(payload: Address) {
    this.addresses ? this.addresses.push(payload) : (this.addresses = [payload])

    let id = 1
    lodashEach(this.addresses, (address) => {
      address.id = id
      id++
    })
  }

  @Mutation
  ADD_ORDER(payload: any) {
    console.log(payload)
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
  UPDATE_FIELDS(payload: { id: number; fields: AddressFields }) {
    lodashFilter(this.addresses, { id: payload.id })[0].fields = payload.fields
  }

  @Mutation
  UPDATE_LIST(payload: Address[]) {
    this.addresses = payload
  }

  @Mutation
  UPDATE_ROUTES(payload?: OrderRoute[]) {
    this.routes = payload
  }

  @Mutation
  UPDATE_INFO(payload: Information) {
    this.information = payload
  }

  @Action
  reset() {
    //
  }

  @Action
  updateList(payload: Address[]) {
    this.context.commit('UPDATE_LIST', payload)
  }

  @Action
  async add(payload?: Address) {
    if (payload) {
      if (!this.isAddressesReachLimit) {
        this.context.commit('ADD_ADDRESS', payload)
        return Promise.resolve(true)
      }
    }

    return Promise.resolve(false)
  }

  @Action
  async addOrder(payload: any) {
    this.context.commit('ADD_ORDER', payload)
    return Promise.resolve(true)
  }

  @Action
  async updateFields(payload: { id: number; fields: AddressFields }) {
    this.context.commit('UPDATE_FIELDS', payload)
    return Promise.resolve(true)
  }

  @Action
  async updateInfo(payload: Information) {
    this.context.commit('UPDATE_INFO', payload)
    return Promise.resolve(true)
  }
}
