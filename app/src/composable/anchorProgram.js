import { useSolanaWallet } from '@/composable/solana'
import {
    PublicKey, SystemProgram,
    Keypair,
    SYSVAR_RENT_PUBKEY,
    SYSVAR_CLOCK_PUBKEY
} from '@solana/web3.js'
import {
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    Token
} from '@solana/spl-token'
import { uuid } from '@/utils'

export const useProgram = () => {

    const createVesting = async (params) => {
        const { program, provider } = useSolanaWallet()

        console.error('--- program ---', program)

        program.addEventListener('CreateVestingEvent', (event, slot) => {
            console.log('slot: ', slot)
            console.log('event data: ', event.data.toNumber())
            console.log('event status: ', event.status)
        })

        const granter = provider.wallet

        const { amount, investorName, investorAddress, start, end, cliff, period, tgePercent } = params
        // local token key
        const mint = new PublicKey('ETkPzML3sDMSZRMYxfpsADTCKj11fsxCbPpMb7QbsuqY')

        const granterToken = await Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            mint,
            granter.publicKey
        )

        const recipient = new PublicKey(investorAddress)
        const recipientToken = await Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            mint,
            recipient.publicKey
        )

        const vesting = Keypair.generate()

        const [escrowVault, nonce] = await PublicKey.findProgramAddress(
            [vesting.publicKey.toBuffer()],
            program.programId
        )

        const vestId = uuid()
        const tx = await program.rpc.createVesting(
            amount,
            nonce,
            vestId,
            investorName,
            investorAddress,
            start,
            end,
            period,
            cliff,
            tgePercent,
            {
                accounts: {
                    granter: granter.publicKey,
                    mint: mint,
                    granterToken: granterToken,
                    recipient: recipient.publicKey,
                    recipientToken: recipientToken,
                    vesting: vesting.publicKey,
                    escrowVault: escrowVault,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                    systemProgram: SystemProgram.programId,
                    clock: SYSVAR_CLOCK_PUBKEY,
                    rent: SYSVAR_RENT_PUBKEY
                },
                signers: [granter.payer, vesting]
            }
        )

        console.log('tx: ', tx)
    }

    return {
        createVesting
    }
}