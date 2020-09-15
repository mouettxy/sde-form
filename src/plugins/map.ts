import Vue from 'vue'
import * as GmapVue from 'gmap-vue'

Vue.use(GmapVue, {
  load: {
    key: process.env.VUE_APP_GOOGLE_API_KEY,
    libraries: 'places,directions'
  },
  installComponents: true
})
