#!/bin/bash
echo "🔍 Pre-Recording Check:"
echo ""

# 1. Check frontend
if curl -s http://localhost:3000 | grep -q "QuantumShield"; then
    echo "✅ Frontend running normally (http://localhost:3000)"
else
    echo "❌ Frontend not running"
    echo "   Please execute: cd quantum-shield-frontend && npm run dev"
fi

# 2. Check ROFL
if ps aux | grep -q "[r]ofl_server"; then
    echo "✅ ROFL Oracle running normally"
    ps aux | grep "[r]ofl_server" | awk '{print "   PID: " $2}'
else
    echo "❌ ROFL not running"
    echo "   Please start ROFL Oracle"
fi

# 3. Check blockchain
if curl -s https://testnet.sapphire.oasis.io -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' | grep -q "0x5aff"; then
    echo "✅ Sapphire Testnet connection normal (Chain ID: 23295)"
else
    echo "⚠️  Sapphire Testnet connection issue"
fi

# 4. Check GitHub
if git remote get-url origin 2>/dev/null | grep -q "ARZER-TW"; then
    echo "✅ GitHub repository connected"
    echo "   https://github.com/ARZER-TW/quantumshield-rofl-kyc"
else
    echo "⚠️  GitHub repository not connected"
fi

# 5. Check log file
if [ -f /tmp/rofl_ethereum_sig.log ]; then
    echo "✅ ROFL log file exists"
else
    echo "⚠️  Recommended: create log file: touch /tmp/rofl_ethereum_sig.log"
fi

echo ""
echo "🎥 Recording readiness check complete!"
echo ""
echo "📋 Recommended terminal layout:"
echo "  Terminal 1: tail -f /tmp/rofl_ethereum_sig.log  (Monitor ROFL logs)"
echo "  Terminal 2: Execute demo commands"
echo "  Browser: http://localhost:3000 (Open F12 Console)"
echo ""
echo "📝 Complete demo script: DEMO_RECORDING_SCRIPT_EN.md"
