import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'

// 1. Get projectId from .env file
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
if (!projectId) {
  throw new Error("You need to provide VITE_WALLETCONNECT_PROJECT_ID in .env file");
}

// 2. Set chains
const sepolia = {
  chainId: 11155111,
  name: 'Sepolia',
  currency: 'ETH',
  explorerUrl: 'https://sepolia.etherscan.io',
  rpcUrl: 'https://rpc.sepolia.org'
}

// 3. Create modal
const metadata = {
  name: 'Prototipe Web3 Kabupaten',
  description: 'Portal Layanan Publik Terdesentralisasi',
  url: 'http://localhost:5173', // origin must match your domain & subdomain
  icons: ['https://avatars.mywebsite.com/logo.png']
}

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [sepolia],
  projectId,
  enableAnalytics: false, // Optional - defaults to your Cloud configuration
  themeMode: 'light'
})
