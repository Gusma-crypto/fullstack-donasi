import { http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    injected(), 
    walletConnect({ 
      projectId: '21e36a1001257f69d649b7e661af1308' // Project ID Anda
    }),
  ],
  transports: {
    [sepolia.id]: http(),
  },
})