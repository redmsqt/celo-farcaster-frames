# Self Verification Frame for Farcaster

Demo Link: https://self-verification-fram.netlify.app/

![Farcaster Frame](https://img.shields.io/badge/Farcaster-Frame-8A63D2)
![Self Protocol](https://img.shields.io/badge/Integration-Self_Protocol-blue)

A plug-and-play template for adding identity verification to Farcaster Frames using Self Protocol. Perfect for:
- ✅ Bot prevention
- ✅ Airdrop eligibility
- ✅ Proof-of-humanity
- ✅ Geo-gated content


## 🛠 Installation

```bash
git clone https://github.com/your-repo/self-verification-frame.git
cd self-verification-frame
npm install

## Configuration 
1. create .env.local file


NEXT_PUBLIC_URL="https://your-domain.com"
NEXT_PUBLIC_APP_SCOPE="your_unique_app_scope"

2. Replace placeholder images in /public:

og-image.png (1200×630)

verified-image.png

failed-image.png

## 🚀 Deployment
 
 npm install -g vercel
vercel deploy --prod

## Integration flow


1. User clicks "Verify with Self" in Frame

2. QR code appears (powered by Self Protocol)

3. User scans with Self mobile app

4. Proof is verified by your backend

5. Frame updates to show success/error

sequenceDiagram
    User->>Frame: Clicks Verify
    Frame->>Self: Shows QR Code
    Self->>Backend: Sends Proof
    Backend->>Frame: Returns Result
    Frame->>User: Shows Status
