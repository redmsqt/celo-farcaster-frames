# Farcaster Mini Apps: MultiSend on Celo Network 🪐

Project Link : https://farcaster.xyz/miniapps/UKOQQBoJYBM6/celo-multi-sender

This project is a Farcaster Mini App that enables users to **multi-send CELO tokens** to multiple Farcaster users in a single transaction, directly from a web interface. Built with [NextJS](https://nextjs.org/), TypeScript, and React, it leverages the Neynar API for user search and the Celo blockchain for token transfers.

---

## Features

- **MultiSend on Celo:** Send CELO tokens to multiple Farcaster users at once using a single transaction.
- **Farcaster User Search:** Search for Farcaster users by username and select recipients.
- **Wallet Integration:** Connect your wallet (Celo-compatible) to send tokens securely.
- **Network Switching:** Automatically prompts users to switch to the Celo network if not already connected.
- **Referral Tracking:** Integrates with Divvi's referral SDK for tracking and analytics.
- **Modern UI:** Clean, responsive interface with user feedback for errors and transaction status.

---

## Guide

Check out [this Neynar docs page](https://docs.neynar.com/docs/create-farcaster-miniapp-in-60s) for a simple guide on how to create a Farcaster Mini App in less than 60 seconds!

---

## Getting Started

To create a new mini app project, run:

```bash
npx @neynar/create-farcaster-mini-app@latest
```

To run the project locally:

```bash
cd <PROJECT_NAME>
npm install
npm run dev
```

---

## How It Works

1. **Connect Wallet:**
   - Click "Connect Wallet" to link your Celo-compatible wallet (e.g., MetaMask with Celo network).
2. **Switch to Celo:**
   - If not already on Celo, the app will prompt you to switch networks.
3. **Search Users:**
   - Use the search bar to find Farcaster users by username. Select one or more users to add as recipients.
4. **Enter Amount:**
   - Specify the amount of CELO to send to each user. The app calculates the total required balance.
5. **Send Tokens:**
   - Click "Send" to initiate a multi-send transaction. The app encodes the transaction, adds a referral tag, and submits it to the Celo blockchain.
6. **Track Transaction:**
   - View transaction status and a link to Celo Explorer for confirmation.

---

## API & Blockchain Details

- **User Search:** Uses Neynar's API to search for Farcaster users and retrieve their verified Ethereum addresses.
- **MultiSend Contract:** Interacts with a deployed MultiSend smart contract on the Celo network to batch transfers.
- **Referral SDK:** Optionally appends a referral tag for analytics and rewards.

---

## Deploying to Vercel

For projects that have made minimal changes to the quickstart template, deploy to Vercel by running:

```bash
npm run deploy:vercel
```

---

## Building for Production

To create a production build, run:

```bash
npm run build
```

The above command will generate a `.env` file based on the `.env.local` file and user input. Be sure to configure those environment variables on your hosting platform.

---

## Local Development & Customization

- **Edit UI and Logic:** Main logic is in `src/components/Send.tsx` and user search in `src/components/ui/tabs/HomeTab.tsx`.
- **Environment Variables:** Configure Neynar API keys and other secrets in `.env.local`.
- **Smart Contract:** The MultiSend contract address is set in the code. Update as needed for your deployment.

---

## Contributing

Feel free to fork this repo and submit pull requests for improvements, bug fixes, or new features!

---

## License

MIT. See [LICENSE](./LICENSE) for details.
