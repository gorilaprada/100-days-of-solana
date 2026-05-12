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
  sendAndConfirmTransactionFactory,
  lamports,
  devnet,
} from "@solana/kit";
import { getTransferSolInstruction } from "@solana-program/system";

// Configuration
const RPC_URL = devnet("https://api.devnet.solana.com");
const WS_URL = devnet("wss://api.devnet.solana.com");
const LAMPORTS_PER_SOL = 1_000_000_000n;

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

const transferLamports = lamports(BigInt(Math.round(solAmount * Number(LAMPORTS_PER_SOL))));

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

  // Check the sender's balance
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

  const transactionMessage = pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => setTransactionMessageFeePayerSigner(sender, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    (tx) =>
      appendTransactionMessageInstruction(
        getTransferSolInstruction({
          source: sender,
          destination: recipientAddress,
          amount: transferLamports,
        }),
        tx
      )
  );

  // Sign the transaction
  const signedTransaction = await signTransactionMessageWithSigners(transactionMessage);
  const signature = getSignatureFromTransaction(signedTransaction);

  // Send and confirm
  console.log("\nSending transaction...");
  const sendAndConfirm = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });
  await sendAndConfirm(signedTransaction, { commitment: "confirmed" });

  console.log(`
    Transaction confirmed!
    Signature: ${signature}
    Explorer: https://explorer.solana.com/tx/${signature}?cluster-devnet
  `);

  // Show updated balance
  const { value: newBalance } = await rpc.getBalance(sender.address).send();
  const newBalanceInSol = Number(newBalance) / Number(LAMPORTS_PER_SOL);
  console.log(`\n New sender balance: ${newBalanceInSol} SOL`);
}

main().catch((err) => {
  console.error(`\nTransfer failed: ${err.message}`);
  process.exit(1);
})
