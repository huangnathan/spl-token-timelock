import { computed } from 'vue'
import { useWallet, useAnchorWallet } from 'solana-wallets-vue'
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js'
import { Provider, Program } from '@project-serum/anchor'
import idl from '@/assets/json/spl_token_timelock.json'

const clusterUrl = import.meta.env.VITE_APP_MODE === 'production' ? clusterApiUrl('mainnet-beta') : 'http://127.0.0.1:8899'
const preflightCommitment = 'processed'
const commitment = 'confirmed'
const programID = new PublicKey(idl.metadata.address)

export const useSolanaWallet = () => {
    const { connected } = useWallet()
    const wallet = useAnchorWallet()
    const connection = new Connection(clusterUrl, commitment)
    const provider = computed(() => new Provider(connection, wallet.value, { preflightCommitment, commitment }))
    const program = computed(() => new Program(idl, programID, provider.value))

    return {
        connected,
        connection,
        provider,
        program
    }
}