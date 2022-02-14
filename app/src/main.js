import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/style/tailwind.css'

import i18n from './locales'

import store from './store'

import { router } from './router'

import { createApp } from 'vue'
import App from './App.vue'

import 'solana-wallets-vue/styles.css'
import SolanaWallets from 'solana-wallets-vue'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter
} from '@solana/wallet-adapter-wallets'

const walletOptions = {
    wallets: [
        new PhantomWalletAdapter(),
        new SlopeWalletAdapter(),
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet })
    ],
    autoConnect: true
}

export const app = createApp(App)
app.use(SolanaWallets, walletOptions)
app.use(ElementPlus)
app.use(router)
app.use(i18n)
app.use(store)
app.mount('#app')

