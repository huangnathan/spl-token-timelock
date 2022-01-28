const anchor = require('@project-serum/anchor');

describe('spl-token-timelock', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());
  const program = anchor.workspace.SplTokenTimelock;


  const vesting = anchor.web3.Keypair.generate();
  let vestingAccount = null;
  let vestingSigner = null;

  it('create_vesting!', async () => {


    



    const tx = await program.rpc.createVesting();

    console.log("Your transaction signature", tx);
  });
});
