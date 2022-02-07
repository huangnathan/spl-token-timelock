const anchor = require('@project-serum/anchor');
const {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  NATIVE_MINT,
} = require("@solana/spl-token");
const {
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  SYSVAR_CLOCK_PUBKEY,
  LAMPORTS_PER_SOL,
} = require("@solana/web3.js");
const { SystemProgram } = anchor.web3;
const { BN } = anchor;

describe('spl-token-timelock', () => {

  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.SplTokenTimelock;

  let escrowTokens;
  let nonce;

  // Divide by 1000 since Unix timestamp is seconds
  let start = new BN(+new Date() / 1000 + 4);
  // +60 seconds
  let end = new BN(+new Date() / 1000 + 60);
  // In seconds
  const period = new BN(1);
  // Amount to deposit
  const totalAmount = new BN(1 * LAMPORTS_PER_SOL);

  const vesting = anchor.web3.Keypair.generate();

  const vestingId = 100;
  const vestingName = [];
  const investorAddress = [];
  it('create_vesting!', async () => {
    [escrowTokens, nonce] = await PublicKey.findProgramAddress(
      [vesting.publicKey.toBuffer()],
      program.programId
    );
    const tx = await program.rpc.createVesting(
      nonce, start, end, totalAmount, period, new BN(0), new BN(0),
      {
        accounts: {
          granter: provider.wallet.publicKey,
          sender: vesting.publicKey,
          recipient: vesting.publicKey,
          beneficiary: provider.wallet.publicKey,
          vesting: vesting.publicKey,
          vault: provider.wallet.publicKey,
          mint: NATIVE_MINT,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          clock: SYSVAR_CLOCK_PUBKEY,
          rent: SYSVAR_RENT_PUBKEY,
        },
        signers: [vesting],
      });

    console.log("create vesting :", tx);
  });
});
