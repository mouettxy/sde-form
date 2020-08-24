import Vue from 'vue'
import axios from 'axios'

let config = {
  baseURL: 'https://api.sde.ru.com/api/v2/',
  /*   proxy: 'https://api.sde.ru.com', */
  timeout: 10000,
  validateStatus: status => {
    return status < 500
  },
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
}

let dadataConfig = {
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

let geocoderConfig = {
  baseUrl: 'http://search.maps.sputnik.ru/search',
  get: {
    'Content-Type': 'application/json',
  },
}

const _axios = axios.create(config)
const _dadata = axios.create(dadataConfig)
const _geocoder = axios.create(geocoderConfig)

_axios.interceptors.request.use(
  function(config) {
    console.debug(`sending request to ${config.baseURL}`)
    return config
  },
  function(error) {
    console.debug('error when sending request', error)
    return Promise.reject(error)
  }
)

_axios.interceptors.response.use(
  function(response) {
    console.debug('getting response', response)
    return { data: response.data, status: response.status }
  },
  function(error) {
    console.debug('error when response', error)
    return Promise.reject(error)
  }
)

Vue.prototype.$http = _axios

export const http = _axios
export const dadata = _dadata
export const geocoder = _geocoder
