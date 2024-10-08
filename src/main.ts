import './assets/main.css'
import './assets/view-design.css'
import './assets/layer-design.css'
import './assets/anim.css'
import VueCookies from 'vue-cookies'
import router from './router'
import Notifications from '@kyvg/vue3-notification'
import VueKonva from 'vue-konva';
import VueSlider from 'vue-slider-component'

import { createApp } from 'vue'
import App from './App.vue'

import 'vue-slider-component/theme/default.css'

const app = createApp(App)
app.use(VueCookies)
app.use(router)
app.use(Notifications)
app.use(VueKonva)
app.component('VueSlider', VueSlider)
app.mount('#app')
