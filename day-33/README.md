# Day 33: Making a non transferrable token using the Solana spl-token CLI

---

## Lessons learned:
- One of the extensions that a Solana tokens can have is being non transferrable by creation.

- This attribute is directly enforced by the Token-2022 program.

- This means that the token has to be minted in the account it is destined to be because it cannot be transferred ever.

- The only thing the owner can do is burn the token and reclaim the ATA (Assiociated token account) rent.


