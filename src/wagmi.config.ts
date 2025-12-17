import { http, createConfig } from 'wagmi';
import { injected, walletConnect, coinbaseWallet } from '@wagmi/connectors';

// Custom Tempo Testnet (dari docs resmi Tempo, chain ID 42429)
const tempoTestnet = {
  id: 42429,
  name: 'Tempo Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'USD', // placeholder, Tempo stablecoin-focused
    symbol: 'USD',
  },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.tempo.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Tempo Scout', url: 'https://scout.tempo.xyz' }, // kalau ada explorer resmi
  },
  // Tempo punya fee sponsor, tapi untuk basic cukup ini
} as const;

// Project ID WalletConnect (daftar gratis di cloud.walletconnect.com kalau mau WC support)
const projectId = 'MASUKIN_PROJECT_ID_KAMU_KALAU_PUNYA'; // atau hapus walletConnect kalau ga butuh

export const config = createConfig({
  chains: [tempoTestnet],
  connectors: [
    injected(), // MetaMask dll
    walletConnect({ projectId }), // comment/hapus kalau ga ada projectId
    coinbaseWallet(),
  ],
  transports: {
    [tempoTestnet.id]: http('https://rpc.testnet.tempo.xyz'),
  },
});