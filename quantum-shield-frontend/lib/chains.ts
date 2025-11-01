import { defineChain } from 'viem'

export const sapphireTestnet = defineChain({
  id: 23295,
  name: 'Oasis Sapphire Testnet',
  network: 'sapphire-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'TEST-ROSE',
    symbol: 'TEST-ROSE',
  },
  rpcUrls: {
    default: { http: ['https://testnet.sapphire.oasis.io'] },
    public: { http: ['https://testnet.sapphire.oasis.io'] },
  },
  blockExplorers: {
    default: {
      name: 'Sapphire Explorer',
      url: 'https://testnet.explorer.sapphire.oasis.io',
    },
  },
  testnet: true,
})
