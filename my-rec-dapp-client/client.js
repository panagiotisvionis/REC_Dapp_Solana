const anchor = require('@project-serum/anchor');
const { SystemProgram } = anchor.web3;

// Program ID (χρησιμοποιήστε το πραγματικό σας Program ID)
const programId = new anchor.web3.PublicKey('9YgyLsBaGy8mU4X4k4CuPmcxhwkAcRD51mGvjWXkeMqn');

// Σημείο πρόσβασης στο devnet
const connection = new anchor.web3.Connection('https://api.devnet.solana.com', 'confirmed');

// Δημιουργία παρόχου (provider)
const provider = new anchor.AnchorProvider(connection, anchor.Wallet.local(), {
  preflightCommitment: 'confirmed',
});

// Ορισμός του προγράμματος
const idl = require('./idl.json');
const program = new anchor.Program(idl, programId, provider);

async function measureTransactionTime(transactionFunction, description) {
  const startTime = Date.now(); // Ξεκινήστε το χρονόμετρο
  
  console.log(`${description} started at ${new Date(startTime).toISOString()}`);

  const signature = await transactionFunction();
  console.log(`${description} Transaction Signature:`, signature);

  await connection.confirmTransaction(signature);
  const transactionDetails = await connection.getConfirmedTransaction(signature);

  const endTime = Date.now(); // Σταματήστε το χρονόμετρο
  const timeDifference = (endTime - startTime) / 1000; // από milliseconds σε δευτερόλεπτα

  const fee = transactionDetails.meta.fee;
  const feeInSOL = fee / anchor.web3.LAMPORTS_PER_SOL;
  const computeUnitsConsumed = transactionDetails.meta.computeUnitsConsumed;

  console.log(`${description} completed at ${new Date(endTime).toISOString()} in`, timeDifference, 'seconds');
  console.log(`${description} cost:`, fee, 'lamports (', feeInSOL, 'SOL)');
  console.log(`${description} compute units consumed:`, computeUnitsConsumed);
}

async function main() {
  const recAccount = anchor.web3.Keypair.generate();

  await measureTransactionTime(async () => {
    const signature = await program.rpc.issueRec('example_data', {
      accounts: {
        recAccount: recAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [recAccount],
    });
    console.log('REC issued:', recAccount.publicKey.toString());
    return signature;
  }, 'REC issued');

  await measureTransactionTime(async () => {
    const signature = await program.rpc.verifyRec('example_data', {
      accounts: {
        recAccount: recAccount.publicKey,
      },
    });
    return signature;
  }, 'REC verified');

  await measureTransactionTime(async () => {
    const requestAccount = anchor.web3.Keypair.generate();
    const signature = await program.rpc.requestRec(new anchor.BN(1000), {
      accounts: {
        requestAccount: requestAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [requestAccount],
    });
    return signature;
  }, 'REC request submitted');

  await measureTransactionTime(async () => {
    const sellRecAccount = anchor.web3.Keypair.generate();
    const signature = await program.rpc.issueAndSellRec('example_data', new anchor.BN(1000), {
      accounts: {
        recAccount: sellRecAccount.publicKey,
        user: provider.wallet.publicKey,
        producer: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [sellRecAccount],
    });
    console.log('REC issued and sold:', sellRecAccount.publicKey.toString());
    return signature;
  }, 'REC issued and sold');
}

main().then(() => console.log('Done')).catch(err => console.error(err));
