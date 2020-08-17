<template lang="pug">
GmapMap.elevation-1(ref='sdeMap', :class='isMobileClass', :options='mapOptions', :center='{lat: lat, lng: lon}')
</template>

<script>
import { gmapApi, install } from 'gmap-vue'
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
import _ from 'lodash'

const debug = false

export default {
  name: 'sdeMap',

  data: () => ({
    lat: 45.035279,
    lon: 38.97412,
    lastAddrsSize: undefined,
  }),

  methods: {
    ...mapActions(['UPDATE_ROUTE']),
  },

  computed: {
    isMobileClass() {
      return this.$vuetify.breakpoint.xl || this.$vuetify.breakpoint.lg || this.$vuetify.breakpoint.md
        ? 'desktop-map'
        : 'mobile-map'
    },
    ...mapState(['addressList']),
    mapOptions() {
      let styles = []
      if (this.$vuetify.theme.isDark) {
        styles = [
          { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
          {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }],
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }],
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{ color: '#263c3f' }],
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#6b9a76' }],
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#38414e' }],
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#212a37' }],
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#9ca5b3' }],
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#746855' }],
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#1f2835' }],
          },
          {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#f3d19c' }],
          },
          {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{ color: '#2f3948' }],
          },
          {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }],
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#17263c' }],
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#515c6d' }],
          },
          {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#17263c' }],
          },
        ]
      }

      return {
        zoom: 12,
        disableDefaultUI: true,
        styles,
      }
    },
    google: gmapApi,
    DirectionsService() {
      return new this.google.maps.DirectionsService()
    },
    DirectionsRenderer() {
      const a = new this.google.maps.DirectionsRenderer()
      a.setMap(this.$refs.sdeMap.$mapObject)
      return a
    },
  },

  watch: {
    addressList(addresses, addressesOld) {
      if (addresses === undefined) {
        this.UPDATE_ROUTE(undefined)
      }
      if (_.size(addresses) !== this.lastAddrsSize) {
        this.lastAddrsSize = _.size(addresses)
        if (_.size(addresses) >= 2) {
          const addrs = [...addresses]
          let origin = addrs.shift()
          origin = { lat: parseFloat(origin.lat), lng: parseFloat(origin.lon) }
          let destination = addrs.pop()
          destination = { lat: parseFloat(destination.lat), lng: parseFloat(destination.lon) }

          let waypoints = []

          if (_.size(addrs) > 0) {
            waypoints = _.map(addrs, e => {
              return { location: { lat: parseFloat(e.lat), lng: parseFloat(e.lon) } }
            })
          }
          if (origin && destination) {
            if (debug) {
              const temp = {
                routes: [
                  {
                    from: 'ул. имени Артюшкова, 15, Краснодар, Краснодарский край, Россия, 350016',
                    to: 'ул. Северная, 7, Краснодар, Краснодарский край, Россия, 350004',
                    distance: 8.6,
                    time: 17,
                    timeString: '17 м.',
                  },
                  {
                    from: 'ул. Северная, 7, Краснодар, Краснодарский край, Россия, 350004',
                    to: 'ул. Гаврилова П.М., 102, Краснодар, Краснодарский край, Россия, 350020',
                    distance: 5.2,
                    time: 10,
                    timeString: '10 м.',
                  },
                ],
                overallDistance: 13.8,
                overallTime: 27,
                overallTimeString: '27 м.',
              }
              this.UPDATE_ROUTE(temp)
            } else {
              this.DirectionsService.route(
                {
                  origin,
                  waypoints,
                  destination,
                  travelMode: 'WALKING',
                },
                (response, status) => {
                  if (status === 'OK' && response) {
                    this.DirectionsRenderer.setDirections(response)

                    // making route info object
                    let route = response.routes[0]
                    let legs = route.legs
                    let routeInfo = {
                      routes: [],
                      overallDistance: 0,
                      overallTime: 0,
                      overallTimeString: undefined,
                    }
                    _.each(legs, e => {
                      let distance = _.round(e.distance.value / 1000, 1)
                      let time = _.round((distance / 30) * 60)
                      let timeString = time >= 60 ? `${_.round(time / 60)}ч. ${_.round(time % 60)} м.` : `${time} м.`
                      routeInfo.routes.push({
                        from: e.start_address,
                        to: e.end_address,
                        distance,
                        time,
                        timeString,
                      })
                      routeInfo.overallDistance += distance
                      routeInfo.overallTime += time
                      routeInfo.overallTimeString =
                        routeInfo.overallTime >= 60
                          ? `${_.round(routeInfo.overallTime / 60)}ч. ${_.round(routeInfo.overallTime % 60)} м.`
                          : `${routeInfo.overallTime} м.`
                    })
                    this.UPDATE_ROUTE(routeInfo)
                  }
                }
              )
            }
          }
        } else if (_.size(addresses) <= 0) {
          this.UPDATE_ROUTE(undefined)
        }
      }
    },
  },

  async mounted() {
    // * Load map according to user position
    // navigator.geolocation.getCurrentPosition(
    //   pos => {
    //     this.lat = pos.coords.latitude
    //     this.lon = pos.coords.longitude
    //   },
    //   err => {
    //     console.debug(err.code, err.message)
    //   },
    //   {
    //     enableHighAccuracy: true,
    //     timeout: 5000,
    //     maximumAge: 0,
    //   }
    // )
  },
}
</script>

<style lang="stylus" scoped>
.vue-map-container
  &.mobile-map
    width 100%
    height calc(100vh - 49px)

  &.desktop-map
    width 100%
    height 100%
</style>
