/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl, Keypair } from "@solana/web3.js";
import { web3 } from "@coral-xyz/anchor";

import "./App.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import SendTransactionBtn from "./components/SendTransactionBtn";
import SendTransactionBtnV2 from "./components/SendTransactionBtnV2";

function App() {
  const network = WalletAdapterNetwork.Devnet;
  // const localnet = "http://127.0.0.1:8899";

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  // const endpoint = useMemo(() => localnet, [localnet]);

  const wallets = useMemo(() => [new PhantomWalletAdapter()], [network]);

  return (
    <>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                padding: "1rem",
                zIndex: 1000,
                display: "flex",
                gap: "0.5rem",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
            >
              <WalletMultiButton />
              <WalletDisconnectButton />
            </div>
            <h1>Hello Solana</h1>
            <SendTransactionBtn />
            <SendTransactionBtnV2 />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
}

export default App;
