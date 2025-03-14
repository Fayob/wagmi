import { http, createConfig } from 'wagmi'
import { base, mainnet, sepolia, liskSepolia } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

const projectId = ''

export const config = createConfig({
  chains: [mainnet, base, sepolia, liskSepolia],
  connectors: [
    injected(),
    walletConnect({ projectId, showQrModal: true }),
    metaMask(),
    safe(),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
    [liskSepolia.id]: http(),
  },
})