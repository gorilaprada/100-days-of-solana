import {
  generateKeyPairSigner,
  createSolanaRpc,
  devnet,
  address
} from "npm:@solana/kit"

// Creating a wallet (done)
// const wallet = await generateKeyPairSigner();
//
// Printing address
// console.log("Your wallet address:", wallet.address);

// Acessing Devnet public RPC
const rpc = createSolanaRpc(devnet("https://api.devnet.solana.com"));
// Establishing my wallet
const walletAddress = address("CENSORED_WALLET");

console.log("Your wallet address:", walletAddress);
console.log("\nThis address is your pubkey.");
console.log("Private key stays in memory. In real app, save it securely");

// Getting wallet balance
const { value: balance } = await rpc.getBalance(walletAddress).send();
const balanceInSol = Number(balance) / 1_000_000_000;

// Printing wallet balance
console.log(`Balance: ${balanceInSol} SOL`);
