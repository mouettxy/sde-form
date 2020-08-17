import { address, geocoder } from '../plugins/axios'
import _ from 'lodash'

export const getAddressSuggestions = async function(query) {
  const locations = [
    {
      region: 'Краснодарский',
    },
    {
      region: 'Адыгея',
    },
    {
      region: 'Крым',
    },
    {
      region: 'Севастополь',
    },
  ]
  const response = await address.post('/address', {
    query,
    locations,
  })

  if (response.status === 200) {
    return response.data.suggestions
  } else {
    return false
  }
}

export const getAddressLatLon = async function(address) {
  const response = await geocoder.get('/3', {
    params: {
      q: address,
      src: 'addr',
    },
  })

  let coordinates = response.data['result']['address'][0]['features'][0]['geometry']['geometries'][0]['coordinates']

  if (!response.status == 200 || !coordinates) {
    return false
  }

  coordinates = _.reverse(coordinates)
  return {
    lat: coordinates[0],
    lon: coordinates[1],
    geocoderResponse: response.data,
  }
}
