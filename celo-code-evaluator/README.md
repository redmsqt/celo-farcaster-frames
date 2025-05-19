# GitSpect - Celo Project Auditor

![GitSpect Logo](https://gitspect.vercel.app/icon.png)

A Warpcast Mini-App for comprehensive code audits of Celo blockchain projects, featuring secure payment integration and shareable audit reports.

## 🌟 Features

- **Github Repository Audits**: Detailed analysis of smart contract and full Celo projects.
- **Payment Integration**: 0.01 CELO fee per audit (anti-spam).
- **Warpcast Sharing**: One-click results sharing to Farcaster.
- **Mobile-First UI**: Optimized for Warpcast's mini-app experience.
- **Score Breakdown**: Criteria-based evaluation system.

## 🛠️ Tech Stack

### Frontend

- Built with [Warpcast Mini-App Starter](https://github.com/farcasterxyz/mini-app-starter) (`npm create @farcaster/mini-app`).
- React + TypeScript.
- Wagmi v2 for Celo transactions.
- Frames.js for Warpcast integration.
- Tailwind CSS for styling.

### Backend

- Modified from [Celo Hackathon Agent](https://github.com/celo-org/hackathon-agent) by the Celo Team.
- Enhanced with GitSpect-specific audit parameters.
- Deployed on Vercel Edge Functions.

## 🚀 Installation

```bash
# Clone repository
git clone https://github.com/celo-org/celo-farcaster-frames/
cd celo-farcaster-frames
cd celo-code-evaluator
cd gitspect

# Install dependencies
npm install

# Run development server
npm run dev
```

## 🔍 How It Works

1. User submits a GitHub repository URL.
2. Pays 0.01 CELO via in-app transaction.
3. System analyzes:
   - Code quality.
   - Security practices.
   - Celo-specific patterns.
4. Generates a shareable audit report.

## 📸 Screenshots

<!-- Add screenshots of the application here -->

## 🤝 Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/fooBar`).
3. Commit your changes (`git commit -am 'Add some fooBar'`).
4. Push to the branch (`git push origin feature/fooBar`).
5. Open a Pull Request.

## 🙏 Acknowledgments

- Celo Team for the original [audit engine](https://github.com/celo-org/hackathon-agent).
- Farcaster for the [mini-app starter kit](https://github.com/farcasterxyz/mini-app-starter).
