# Day 4: Here are the achievements. 
Produced a simple web app that provides the ability to connect to a SOL wallet and displays it's public key and it's balance.

## Achievements:
1. Used @wallet-standard/app to connect to a wallet and get its address
2. Used @solana/kit to get the wallets balance on devnet and display it

## Lessons learned:
The app would not prompt me to connect to the wallet but instead was hanging. Context: I use a remote server to develop my apps.

The "Requesting connection" hang occurred because browser extensions require a Secure Context (HTTPS or localhost) to interact with
dApps; accessing the app via a raw Meshnet IP caused the wallet to silently block the connection for security.

The fix was using an SSH Local Port Forward to tunnel the remote traffic to the client's localhost:3000, 
tricking the browser into a secure state that allowed the Wallet Standard handshake to trigger.

