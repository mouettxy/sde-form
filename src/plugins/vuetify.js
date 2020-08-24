import Vue from 'vue'
import {
  mdiMapMarker,
  mdiMagnify,
  mdiAccount,
  mdiPlus,
  mdiPhone,
  mdiCalendarClock,
  mdiCash,
  mdiInformationVariant,
  mdiTrayPlus,
  mdiTrayMinus,
  mdiPackageVariant,
  mdiBusStop,
  mdiCar,
  mdiTruckFast,
  mdiCogSync,
  mdiCreditCardCheck,
  mdiComment,
  mdiCalendar,
  mdiClock,
  mdiClose,
  mdiCurrencyRub,
  mdiArrowLeft,
  mdiArrowRight,
  mdiInformation,
  mdiCheck,
  mdiContentSave,
  mdiCursorMove,
  mdiArrowUp,
  mdiArrowDown,
  mdiLock,
  mdiLogin,
} from '@mdi/js'
import Vuetify, { VApp, VNavigationDrawer, VFooter, VToolbar, VFadeTransition } from 'vuetify/lib'
import { ClickOutside, Intersect, Mutate, Resize, Ripple, Scroll, Touch } from 'vuetify/lib/directives'
import DatetimePicker from 'vuetify-datetime-picker'
import 'vuetify/src/styles/main.sass'

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VToolbar,
    VFadeTransition,
  },
  directives: {
    Ripple,
    ClickOutside,
    Intersect,
    Mutate,
    Resize,
    Scroll,
    Touch,
  },
})

Vue.use(DatetimePicker)

const _icons = {
  mapMarker: mdiMapMarker,
  move: mdiCursorMove,
  save: mdiContentSave,
  rub: mdiCurrencyRub,
  search: mdiMagnify,
  close: mdiClose,
  user: mdiAccount,
  plus: mdiPlus,
  phone: mdiPhone,
  date: mdiCalendarClock,
  calendar: mdiCalendar,
  clock: mdiClock,
  cash: mdiCash,
  info: mdiInformation,
  bundle: mdiPackageVariant,
  bus: mdiBusStop,
  car: mdiCar,
  fast: mdiTruckFast,
  optimize: mdiCogSync,
  whoPays: mdiCreditCardCheck,
  comment: mdiComment,
  takeIn: mdiTrayPlus,
  takeOut: mdiTrayMinus,
  leftArrow: mdiArrowLeft,
  rightArrow: mdiArrowRight,
  upArrow: mdiArrowUp,
  downArrow: mdiArrowDown,
  check: mdiCheck,
  password: mdiLock,
  login: mdiLogin,
}

Vue.prototype.$icons = _icons

const vuetifyOpts = {
  icons: {
    iconfont: 'mdiSvg',
  },
  rtl: false,
  theme: {
    dark: false,
    themes: {
      dark: {
        primary: '#C79C00',
        accent: '#525252',
        accent2: '#1E1E1E',
        secondary: '#E0E0E0',
        success: '#689f38',
        info: '#2196F3',
        warning: '#FB8C00',
        error: '#FF5252',
      },
      light: {
        primary: '#FFCC01',
        accent: '#525252',
        accent2: '#1E1E1E',
        secondary: '#E0E0E0',
        success: '#689f38',
        info: '#2196F3',
        warning: '#FB8C00',
        error: '#FF5252',
      },
    },
  },
}

Vue.use(Vuetify)

export default new Vuetify(vuetifyOpts)
