<template lang="pug">
v-app
  sdeForm
</template>

<script>
import sdeForm from '@/components/sdeForm'

export default {
  name: 'App',

  components: {
    sdeForm,
  },

  data: () => ({}),

  methods: {
    async generate() {
      /* let clients = await http.get('/api/v2/client/')
      console.log(clients) */
      /* clients = _.filter(clients.data, e => {
        return _.includes(a, e.CLIENT)
      })
      let clientsWithError = []
      let clientsWithAliases = []
      _.each(clients, async e => {
        setTimeout(async () => {
          if (e.CLIENT && !!_.trim(e.ADDR)) {
            if (e.aliases === null) {
              let newAlias = {
                name: 'От нас / К нам',
                address: e.ADDR,
                lat: undefined,
                lon: undefined,
              }

              try {
                let suggestions = await getAddressSuggestions(newAlias.address)
                let suggestion = suggestions[0]
                if (!suggestion.data.geo_lat || !suggestion.data.geo_lon) {
                  clientsWithError.push(e.CLIENT)
                } else {
                  newAlias.lat = suggestion.data.geo_lat
                  newAlias.lon = suggestion.data.geo_lon

                  let id = await http.post(`/api/v2/client/${e.CLIENT}/aliases/`, newAlias)
                  console.log(id)
                }
              } catch (err) {
                clientsWithError.push(e.CLIENT)
              }
            } else {
              clientsWithAliases.push(e.CLIENT)
            }
          }
        }, 1000)
      })
      console.log(clientsWithError, 'errors')
      console.log(clientsWithAliases, 'aliases') */
      /* let clientsWithError = []
      _.each(clients, async e => {
        if (e.CLIENT && !!_.trim(e.ADDR)) {
          if (e.aliases === null) {
            let newAlias = {
              name: 'От нас / К нам',
              address: e.ADDR,
              lat: undefined,
              lon: undefined,
            }

            setTimeout(async () => {
              try {
                let suggestions = await getAddressSuggestions(newAlias.address)
                let suggestion = suggestions[0]
                if (!suggestion.data.geo_lat || !suggestion.data.geo_lon) {
                  clientsWithError.push(e.CLIENT)
                } else {
                  newAlias.lat = suggestion.data.geo_lat
                  newAlias.lon = suggestion.data.geo_lon

                  let id = await http.post(`/api/v2/client/${e.CLIENT}/aliases/`, newAlias)
                  console.log(id)
                }
              } catch (err) {
                clientsWithError.push(e.CLIENT)
              }
            }, 500)
          }
        }
      })

      console.log(clientsWithError) */
    },
  },

  async created() {},
}
</script>

<style lang="stylus">
html
  overflow hidden !important
  height 100%

body
  overflow hidden
  min-height 100%
  width 100%

::-webkit-scrollbar
  width 8px

/* Track */
::-webkit-scrollbar-track
  box-shadow none
  border-radius 0

/* Handle */
::-webkit-scrollbar-thumb
  background #ffcc01
  border-radius 8px

input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active
  background-color inherit !important
</style>
