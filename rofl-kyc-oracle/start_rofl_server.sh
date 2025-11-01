#!/bin/bash

# Start ROFL Oracle HTTP Server
# This script loads environment variables and starts the server

echo "🔧 Loading environment variables..."
export ROFL_PRIVATE_KEY=0x3ee6edd4924ecc36e054d049933f686b9e9442f2c29c567c1db13e538ff7c825
export SAPPHIRE_RPC=https://testnet.sapphire.oasis.io
export KYC_REGISTRY_ADDRESS=0x69783F54224870Df22B1FD75780AD3bC3145720a
export RUST_LOG=info

echo "🚀 Starting ROFL Oracle Server..."
echo "📍 Address: http://127.0.0.1:8080"
echo "📡 Endpoint: POST /verify-kyc"
echo ""
echo "Press Ctrl+C to stop the server"
echo "----------------------------------------"

cargo run --release --bin rofl_server
