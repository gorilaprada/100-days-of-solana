import { createSolanaRpc, devnet, address } from "npm:@solana/kit"

const walletAddress = Deno.env.get("PUB_ADDRESS");
console.log(walletAddress);

// Connect to devnet
const rpc = createSolanaRpc(devnet("https://api.devnet.solana.com"));

const targetAddress = address(`${walletAddress}`);

// Query the balance
const { value: balanceInLamports} = await rpc
  .getBalance(targetAddress)
  .send();

const balanceInSol = Number(balanceInLamports) / 1_000_000_000;

console.log(`Address: ${targetAddress}`);
console.log(`Balance: ${balanceInSol} SOL`);
