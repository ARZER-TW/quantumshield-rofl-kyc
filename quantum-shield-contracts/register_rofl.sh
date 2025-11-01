#!/bin/bash

# 使用合約 owner 註冊 ROFL 節點
export PRIVATE_KEY=0x3ee6edd4924ecc36e054d049933f686b9e9442f2c29c567c1db13e538ff7c825
export CONTRACT_ADDRESS=0x69783F54224870Df22B1FD75780AD3bC3145720a
export ROFL_NODE=0x5D228D1964960512Ca9e7603E24aAEbc881C076A

forge script script/RegisterROFL.s.sol:RegisterROFLScript \
  --rpc-url https://testnet.sapphire.oasis.io \
  --broadcast \
  --legacy
