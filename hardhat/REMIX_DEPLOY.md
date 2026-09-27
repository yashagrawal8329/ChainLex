# Remix IDE — click-by-click deploy (beginner)

You are putting `ChainLexRegistry.sol` on the Sepolia test blockchain.
No Infura key. No Alchemy key. Remix is free.

Before you start, install MetaMask in Chrome/Brave:
https://metamask.io

---

## STEP 1 — Open Remix

1. Open Chrome
2. Go to: https://remix.ethereum.org
3. If a welcome popup appears, click **Done** or close it
4. Left sidebar icons (top to bottom) you will use:
   - File Explorer (document icon)
   - Solidity Compiler (S icon)
   - Deploy and Run (Ethereum logo)

---

## STEP 2 — Create the Solidity file

1. Click the **File Explorer** icon (top-left)
2. You should see a folder named `contracts`
3. Right-click `contracts` -> **New File**
4. Name it exactly:

```
ChainLexRegistry.sol
```

5. Open `hardhat/contracts/ChainLexRegistry.sol` from this project
6. Copy ALL of that file (from `// SPDX-License-Identifier: MIT` to the last `}`)
7. Paste it into Remix so the editor shows the full contract

If Remix already has `1_Storage.sol`, ignore it. You only need `ChainLexRegistry.sol`.

---

## STEP 3 — Compile

1. Click the **Solidity Compiler** icon (left sidebar, looks like an S)
2. At the top, **COMPILER** dropdown: choose `0.8.24`
   - If 0.8.24 is missing, pick any `0.8.24+commit...`
3. Make sure the file name shown is `ChainLexRegistry.sol`
4. Click the green button **Compile ChainLexRegistry.sol**
5. Success = green checkmark on the Compiler icon
6. If red errors appear, you did not paste the full file. Go back to STEP 2

---

## STEP 4 — Put MetaMask on Sepolia

1. Open the MetaMask extension
2. Click the network name at the top (often `Ethereum Mainnet`)
3. Turn on **Show test networks** if needed (MetaMask Settings -> Advanced)
4. Select **Sepolia**
5. Copy your wallet address (click the account name)

You need free Sepolia ETH for gas:

1. Open https://cloud.google.com/application/web3/faucet/ethereum/sepolia
   or https://www.alchemy.com/faucets/ethereum-sepolia
2. Paste your MetaMask address
3. Request test ETH
4. Wait until MetaMask Sepolia balance is more than 0

Do not use real Ethereum mainnet. Use **Sepolia** only.

---

## STEP 5 — Connect Remix to MetaMask

1. In Remix, click **Deploy and Run Transactions** (Ethereum logo, left sidebar)
2. Find **ENVIRONMENT**
3. Change it from `Remix VM` to **Injected Provider - MetaMask**
4. MetaMask popup appears -> click **Connect** / **Next** / **Connect**
5. Confirm the Remix page now shows:
   - Environment: Injected Provider - MetaMask
   - Account: your `0x...` address
   - Network should mention Sepolia (chain id 11155111)

If it says Mainnet, switch MetaMask to Sepolia, then refresh Remix.

---

## STEP 6 — Deploy the contract

1. Still on Deploy and Run
2. **CONTRACT** dropdown: choose `ChainLexRegistry`
   - Not Storage, not Ballot
3. Leave constructor empty (this contract has no constructor inputs)
4. Click the orange **Deploy** button
5. MetaMask popup appears
6. Check it is **Sepolia**
7. Click **Confirm**
8. Wait 10–30 seconds

Success = a new section **Deployed Contracts** appears at the bottom of the left panel.

---

## STEP 7 — Copy the contract address

1. Scroll to **Deployed Contracts**
2. You will see `CHAINLEXREGISTRY AT 0x........`
3. Click the copy icon next to that `0x` address
4. It looks like: `0xAbC123...` (42 characters)

That address is what this app needs.

---

## STEP 8 — Send me the address

Paste it here like this:

```
CONTRACT_ADDRESS=0xYourCopiedAddress
NETWORK=sepolia
```

I will put it in `backend/.env` and `frontend/src/lib/contractAddress.json`.
After that, Connect Wallet in ChainLex and click **Anchor Contract to Blockchain**.

---

## If something fails

| What you see | What to do |
| --- | --- |
| Compile red errors | Paste the full `ChainLexRegistry.sol` again |
| MetaMask not found | Install MetaMask, unlock it, reload Remix |
| Wrong network | MetaMask must be Sepolia, not Ethereum Mainnet |
| Insufficient funds | Get Sepolia ETH from a faucet, wait, retry Deploy |
| Deploy button grey | Compile first, then select contract `ChainLexRegistry` |
| Remix VM selected | Change Environment to Injected Provider - MetaMask |

Do not use Remix VM for the live app. Remix VM is only a fake local chain inside the browser. ChainLex needs the real Sepolia address from STEP 7.
