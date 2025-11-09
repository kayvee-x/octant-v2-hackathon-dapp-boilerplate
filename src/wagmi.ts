// src/wagmi.ts  (CREATE THIS FILE)
import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { injected, coinbaseWallet } from 'wagmi/connectors';

const TENDERLY_RPC = 'https://virtual.mainnet.eu.rpc.tenderly.com/82c86106-662e-4d7f-a974-c311987358ff'; // Your Tenderly RPC
export const config = createConfig({
  chains: [sepolia],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Onchain Pension' }),
  ],
  transports: {
    [sepolia.id]: http(TENDERLY_RPC),
  },
});