import { createApp } from 'vue'

import Root from './Root.vue'
import router from './router'

import './assets/main.scss'

const app = createApp(Root)
app.use(router)

router.isReady().then(() => {
  app.mount('#root')
})
