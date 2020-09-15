import Vue from 'vue'
import VueNotification from '@kugatsu/vuenotification'
import { TimelineMax } from 'gsap'
import { NotificationPluginOptions } from '@/typings/NotificationsPlugin'

Vue.use(VueNotification, {
  timer: 7,
  showCloseIcn: true,
  animateIn: function(): any {
    // @ts-ignore
    const el = this.notificationEl
    const tl = new TimelineMax().from(el, 0.4, {
      left: 999,
      width: 0,
      position: 'absolute'
    })

    return tl
  },
  animateOut: function(): any {
    // @ts-ignore
    const el = this.notificationEl
    const tl = new TimelineMax().to(el, 0.3, {
      left: 999,
      width: 0,
      position: 'relative'
    })

    return tl
  }
} as NotificationPluginOptions)
