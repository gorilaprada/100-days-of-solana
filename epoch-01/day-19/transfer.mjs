import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { homedir } from "node:os";
import {
  address,
  createKeyPairSignerFromBytes,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  pipe,
  createTransactionMessage,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstruction,
  signTransactionMessageWithSigners,
  getSignatureFromTransaction,
  getBase64EncodedWireTransaction,
  lamports,
  devnet,
} from "@solana/kit";
import { getTransferSolInstruction } from "@solana-program/system";

// Configuration
const RPC_URL = devnet("https://api.devnet.solana.com");
const WS_URL = devnet("wss://api.devnet.solana.com");
const LAMPORTS_PER_SOL = 1_000_000_000n;
const COMMITMENT_LEVELS = ["processed", "confirmed", "finalized"];

// Helper function
function statusUpdate(message) {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(message);
}

// Parse command-line args
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("Usage: node transfer.mjs <RECIPIENT_ADDRESS> <AMOUNT_IN_SOL>");
  console.error("Example: node transfer.mjs GrAkKfEpTKQuVHG2Y97Y2FF4i7y7Q5AHLK94JBy7Y5yv 0.1");
  process.exit(1);
}

const recipientAddress = address(args[0]);
const solAmount = parseFloat(args[1]);

if (isNaN(solAmount) || solAmount <= 0) {
  console.error("Error: Amount must be positive number.");
  process.exit(1)
}

async function waitForCommitment(rpc, signature, targetCommitment) {
  const targetIndex = COMMITMENT_LEVELS.indexOf(targetCommitment);

  while (true) {
    const { value } = await rpc
      .getSignatureStatuses([signature], { searchTransactionHistory: true })
      .send();

    const status = value[0];

    if (status?.err) {
      throw new Error(`Transaction failed on-chain: ${JSON.stringify(status.err)}`);
    }

    if (status) {
      const currentIndex = COMMITMENT_LEVELS.indexOf(status.confirmationStatus);
      if (currentIndex >= targetIndex) break;
    }

    await new Promise((r) => setTimeout(r, 500));
  }
}

async function transferWithConfirmation(rpc, signer, toAddress, amountInSOL) {
  const destination = address(toAddress);
  const lamportAmount = lamports(BigInt(Math.round(amountInSOL * 1_000_000_000)));

  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

  const transactionMessage = pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => setTransactionMessageFeePayerSigner(signer, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    (tx) => appendTransactionMessageInstruction(
      getTransferSolInstruction({
        source: signer,
        destination,
        amount: lamportAmount,
      }),
      tx
    )
  );

  const signedTransaction = await signTransactionMessageWithSigners(transactionMessage);
  const signature = getSignatureFromTransaction(signedTransaction);
  const wireTransaction = getBase64EncodedWireTransaction(signedTransaction);

  console.log(`\n Sending ${amountInSOL} SOL to ${toAddress}...\n`)

  // Send the transaction
  statusUpdate("Status: Sending transaction...");
  await rpc.sendTransaction(wireTransaction, { encoding: "base64" }).send();

  statusUpdate("Status: Processed (included in a block)...");

  // Wait for the confirmed transaction
  await waitForCommitment(rpc, signature, "confirmed");
  statusUpdate("Status: Confirmed (supermajority voted)...");

  // Wait for the finalized status
  await waitForCommitment(rpc, signature, "finalized");
  statusUpdate("Status: Finalized (irreversible)");
  console.log("\n");

  return signature;
}

// Load Keypair form the default Solana CLI location
async function loadKeypair() {
  const keypairPath = resolve(homedir(), ".config", "solana", "id.json");
  const secretKeyJson = await readFile(keypairPath, "utf-8");
  const secretKeyBytes = new Uint8Array(JSON.parse(secretKeyJson));
  const keypair = await createKeyPairSignerFromBytes(secretKeyBytes);
  return keypair;
}


// Main function
async function main() {
  console.log("Solana Transfer Tool\n================\n");

  // Connect to devnet
  const rpc = createSolanaRpc(RPC_URL);
  const rpcSubscriptions = createSolanaRpcSubscriptions(WS_URL);
  console.log("Connected to Solana devnet.\n");

  // Load the sender keypair
  const sender = await loadKeypair();
  console.log(`
    Sender: ${sender.address},
    Recipient: ${recipientAddress.toString()},
    Amount: ${solAmount} SOL

  `);

  //Transaction logic
  try {
    const signature = await transferWithConfirmation(rpc, sender, recipientAddress, solAmount);

    console.log(`
    Transaction successful!
    Signature: ${signature}
    View on Solana Explorer:
    https://explorer.solana.com/tx/${signature}?cluster=devnet
  `)
  } catch (err) {
    console.error(`\nTransfer failed: ${err.message}`);
    process.exit(1);
  }

  // Show updated balance
  const { value: newBalance } = await rpc.getBalance(sender.address).send();
  const newBalanceInSol = Number(newBalance) / Number(LAMPORTS_PER_SOL);
  console.log(`\n New sender balance: ${newBalanceInSol} SOL`);
}

main();
