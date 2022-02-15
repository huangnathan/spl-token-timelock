import { useWallet } from 'solana-wallets-vue'

export const useSolanaWallet = () => {
    const { connected } = useWallet()

    return {
        connected
    }
}