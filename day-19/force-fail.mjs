import {
  createSolanaRpc,
  createKeyPairSignerFromBytes,
  createTransactionMessage,
  pipe,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstruction,
  signTransactionMessageWithSigners,
  getSignatureFromTransaction,
  getBase64EncodedWireTransaction,
  lamports,
} from "@solana/kit";
import { getTransferSolInstruction } from "@solana-program/system";
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

const rpc = createSolanaRpc("https://api.devnet.solana.com");

// Load your funded devnet wallet (the fee payer)
const senderBytes = new Uint8Array(JSON.parse(await readFile(join(homedir(), ".config/solana/id.json"), "utf-8")));
const sender = await createKeyPairSignerFromBytes(senderBytes);

// Use the broke wallet's address as the recipient
const brokeBytes = new Uint8Array(JSON.parse(await readFile("/tmp/broke-wallet.json"), "utf-8"));
const recipient = (await createKeyPairSignerFromBytes(brokeBytes)).address;

// Build a transfer of 500 SOL -- Far more than the funded wallet has
const transferIx = getTransferSolInstruction({
  source: sender,
  destination: recipient,
  amount: lamports(5_000_000_000n),
});

const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

const message = pipe(
  createTransactionMessage({ version: 0 }),
  (tx) => setTransactionMessageFeePayer(sender.address, tx),
  (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
  (tx) => appendTransactionMessageInstruction(transferIx, tx)
);

const signedTx = await signTransactionMessageWithSigners(message);
const signature = getSignatureFromTransaction(signedTx);

// skip Prefligh byppasses local smulation, so the tx lands oon chain and fails there
await rpc
  .sendTransaction(getBase64EncodedWireTransaction(signedTx), {
    skipPreflight: true,
    encoding: "base64",
  }).send();

console.log(`
Failed tx signature: ${signature}
Explorer: https://explorer.solana.com/tx/${signature}?cluster=devnet
`)
