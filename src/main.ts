import '@/assets/main.css'

import { createApp } from 'vue'
import App from '@/App.vue'
import ui from "@nuxt/ui/vue-plugin"
import { router } from '@/router'
import appConfig, {registerIcons} from "./app.config.ts"
import { createPinia } from "pinia";

const pinia = createPinia()

await registerIcons()

createApp(App)
  .use(router)
  .use(ui)
  .use(pinia)
  .provide('appConfig', appConfig)
  .mount('#app')