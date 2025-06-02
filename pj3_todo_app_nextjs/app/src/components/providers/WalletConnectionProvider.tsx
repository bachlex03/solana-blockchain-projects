"use client";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import React, { useMemo } from "react";

function WalletConnectionProvider({ children }: { children: React.ReactNode }) {
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => {
    if (network === WalletAdapterNetwork.Devnet) {
      return clusterApiUrl(network);
    }

    return clusterApiUrl(network);
  }, [network]);

  const wallets = useMemo(() => [new PhantomWalletAdapter()], [network]);
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default WalletConnectionProvider;
