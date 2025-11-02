# Quick Start - Demo Recording Guide

## ✅ Status: All Systems Ready!

All services are running:
- ✅ **Frontend**: http://localhost:3000
- ✅ **ROFL Oracle**: Running (PID: 2605656)
- ✅ **Sapphire Testnet**: Connected (Chain ID: 23295)
- ✅ **GitHub**: https://github.com/ARZER-TW/quantumshield-rofl-kyc

---

## 🚀 3-Minute Quick Demo Script

### Terminal Setup (3 windows)

#### Terminal 1 - ROFL Log Monitor (Right side)
```bash
# Clear and monitor ROFL logs
> /tmp/rofl_ethereum_sig.log
tail -f /tmp/rofl_ethereum_sig.log
```

#### Terminal 2 - Demo Commands (Bottom)
```bash
cd /mnt/c/Users/tl/Desktop/claude-test

# Show project structure
echo "📁 QuantumShield ROFL KYC Oracle Project:"
echo ""
ls -la | grep -E "quantum|rofl|README|LICENSE"
echo ""
echo "📁 Three core components:"
echo "  🌐 quantum-shield-frontend  - Next.js (Kyber1024 encryption)"
echo "  🔧 rofl-kyc-oracle         - Rust ROFL Oracle (TEE)"
echo "  📜 quantum-shield-contracts - Solidity smart contracts"
```

#### Browser - Frontend (Left side)
1. Open: http://localhost:3000
2. Press F12 to open Console
3. Ready to demonstrate

---

## 📝 5-Step Demo Flow

### Step 1: Introduction (30s)
**Browser**: Show homepage

**Say**:
> "This is QuantumShield - a KYC verification system combining post-quantum cryptography with Oasis ROFL framework. It demonstrates ROFL's three key features: off-chain computation, data confidentiality, and external integration."

**Point out**:
- "Powered by Kyber768 + ROFL TEE" badge
- 7-step workflow diagram

---

### Step 2: Show Architecture (30s)
**Terminal 2**:
```bash
echo "🔐 Kyber1024 Post-Quantum Encryption:"
echo "  • Public key: 1568 bytes"
echo "  • Private key: 3168 bytes"
echo "  • Security: NIST Level 5 (256-bit quantum security)"
echo ""
echo "🎯 ROFL Framework Benefits:"
echo "  ✅ Off-chain computation in TEE"
echo "  ✅ Data confidentiality guaranteed"
echo "  ✅ External API integration capability"
```

**Say**:
> "We use Kyber1024, the highest level NIST-standardized post-quantum encryption, running in ROFL's TEE environment for maximum security."

---

### Step 3: Submit KYC (1min)
**Browser**: Fill form and submit
```
Full Name: Alice Chen
Date of Birth: 1995-05-15
Nationality: Taiwan
Document Type: Passport
Document Number: A123456789
```

**Actions**:
1. Click "Connect MetaMask"
2. Fill the form above
3. Click "Submit KYC Verification"
4. **Switch to Console (F12)**

**Console shows**:
```
🔐 Starting Kyber encryption...
📦 Encrypted package size: 1719 bytes
📤 Sending to ROFL Oracle...
```

**Say**:
> "Watch as the data gets encrypted with Kyber1024. The 1719-byte encrypted package is now being sent to our ROFL Oracle running in TEE."

---

### Step 4: ROFL Processing (1min)
**Switch to Terminal 1** (ROFL logs)

**Logs will show**:
```
[INFO] 📥 Received encrypted KYC request
[INFO] 🔓 Decrypting with Kyber1024...
[INFO] ✅ Decryption successful: 123 bytes
[INFO] ℹ️  Decrypted KYC Document:
[INFO]    Full name: Alice Chen
[INFO]    Birth date: 1995-05-15
[INFO] 🔍 Starting KYC verification...
[INFO] ✅ Age verification passed: 29 years old
[INFO] ✅ Not on sanctions list
[INFO] ✅ KYC Verification Result: is_valid: true
[INFO] 📝 Signing message...
[INFO] ✅ ECDSA signature generated (65 bytes)
[INFO] ✅ Transaction confirmed: 0x...
[INFO] ⛓️  Gas used: 78645
```

**Say**:
> "This demonstrates ROFL's power:
> - Complex computations like Kyber decryption and sanctions checking happen off-chain in TEE
> - Sensitive data stays in TEE, never exposed
> - ECDSA signature provides cryptographic proof
> - Only 78,645 gas used, very efficient!"

---

### Step 5: Verification & Summary (30s)
**Back to Browser**:
1. Click "Query Verification Status"
2. Shows: ✓ KYC Verification Passed

**Terminal 2**:
```bash
echo "🎯 QuantumShield demonstrates ROFL perfectly:"
echo ""
echo "✅ Off-chain Computation: Complex operations in TEE"
echo "✅ Data Confidentiality: No sensitive data on-chain"
echo "✅ External Integration: Sanctions list, AI models possible"
echo "✅ Post-Quantum Security: Kyber1024 protection"
echo ""
echo "GitHub: https://github.com/ARZER-TW/quantumshield-rofl-kyc"
echo ""
echo "Thank you! 🚀"
```

**Say**:
> "QuantumShield shows how ROFL enables secure, private, and efficient KYC verification. It's ready for today's privacy needs and tomorrow's quantum threats. Thank you!"

---

## 🎥 Recording Tools

### Option 1: Loom (Easiest)
1. Go to: https://www.loom.com/
2. Install browser extension
3. Click Record → Choose "Screen + Camera"
4. Auto-uploads, get share link

### Option 2: OBS Studio (Professional)
1. Download: https://obsproject.com/
2. Setup scenes: Browser + Terminals
3. Start recording
4. Upload to YouTube

---

## 📋 Detailed Script

For complete step-by-step instructions and narration:
**See: [DEMO_RECORDING_SCRIPT_EN.md](DEMO_RECORDING_SCRIPT_EN.md)**

Includes:
- Detailed commands for each stage
- Suggested narration
- Screen transition timing
- Tips and best practices

---

## ✅ Pre-Flight Check

Run this before recording:
```bash
bash check_demo_ready_en.sh
```

Should show all ✅ green checkmarks.

---

## 🎬 Ready to Record!

You now have:
- ✅ All services running
- ✅ GitHub repository live
- ✅ Complete demo script
- ✅ Quick 3-minute flow
- ✅ Detailed 5-minute script

**Start recording whenever you're ready!** 🎥

Good luck! 🚀
