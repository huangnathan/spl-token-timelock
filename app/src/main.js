import ElementPlus from 'element-plus'
import '@/assets/style/tailwind.css'

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
    autoConnect: false
}

createApp(App)
    .use(SolanaWallets, walletOptions)
    .use(ElementPlus)
    .use(router)
    .mount('#app')
