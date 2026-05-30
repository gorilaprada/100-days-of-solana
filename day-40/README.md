# Day 40: Build a non transferable token with you as the permanent delegate
 
---
# Lessons learned:

- Creating a token with the following 3 Token Extensions can be useful for credentials.

Token Extensions:
1. Non transferable: token cannot be transfered and is sould bound to the wallet it was minted in.
2. Permanent delegate: the permanent delegate acoount can burn the token without the approval of the token owner.
3. Metadata: Useful to give meaning to a token. Human readable data.

- These extensions pair well for credentials like certifications or building access because they are non transferable. Meaning they cannot be given or sold to anyone other than the first owner, and, because the permanent delegate account(e.g. the credential issuer) can burn the token (i.e. revoke the certification/building access) of a specific wallet without its approval keeping control over its issued credentials.
