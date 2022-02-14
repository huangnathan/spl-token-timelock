import ElementPlus from 'element-plus'
import '@/assets/style/tailwind.css'

import { router } from './router'

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).use(ElementPlus).use(router).mount('#app')
