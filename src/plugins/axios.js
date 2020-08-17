import Vue from 'vue'
import axios from 'axios'

let config = {
  baseURL: 'https://api.sde.ru.com',
  headers: {
    'Content-Type': 'application/json',
  },
}

let configDadata = {
  baseURL: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest',
  headers: {
    common: {
      Authorization: 'Token 8660205bb41fd82d6f57ae8280c8517ca964801e',
    },
    post: {
      'Content-Type': 'application/json',
    },
  },
}

let configGeocoder = {
  baseUrl: 'http://search.maps.sputnik.ru/search',
  get: {
    'Content-Type': 'application/json',
  },
}

const _axios = axios.create(config)
const _axiosDadata = axios.create(configDadata)
const _axiosGeocoder = axios.create(configGeocoder)

_axios.interceptors.request.use(
  function(config) {
    console.log(`sending request to ${config.baseURL}`)
    return config
  },
  function(error) {
    console.log('error when sending request', error)
    return Promise.reject(error)
  }
)

_axios.interceptors.response.use(
  function(response) {
    console.log('getting response', response)
    return response
  },
  function(error) {
    console.log('error when response', error)
    return Promise.reject(error)
  }
)

Vue.prototype.$http = _axios
Vue.prototype.$http.$address = _axiosDadata
Vue.prototype.$http.$geocoder = _axiosGeocoder

export const http = _axios
export const address = _axiosDadata
export const geocoder = _axiosGeocoder
