import { http } from '../plugins/axios'
import _ from 'lodash'

export const endpoints = {
  order: '/api/v2/order/',
  state: '/api/v2/client/state/',
}

export const sendOrder = async (raw, processed) => {
  try {
    const response = await http.post(endpoints.order, { raw, processed })

    if (response.status !== 200) {
      return false
    }

    return response.data
  } catch (e) {
    return false
  }
}

export const saveOrder = async (state, id) => {
  try {
    const response = await http.post(`/api/v2/client/${id}/orders/`, { state })

    if (response.status !== 200) {
      return false
    }

    return response.data
  } catch (e) {
    return false
  }
}
