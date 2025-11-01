import { http, createConfig } from 'wagmi'
import { sapphireTestnet } from './chains'

export const config = createConfig({
  chains: [sapphireTestnet],
  transports: {
    [sapphireTestnet.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
