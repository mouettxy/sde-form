import Vue from 'vue'
import * as GmapVue from 'gmap-vue'

Vue.use(GmapVue, {
  load: {
    key: 'AIzaSyCfgtxr_hEtON5EuNEoQA0vpJOSdXs-lJU',
    libraries: 'places,directions',
  },
  installComponents: true,
})
