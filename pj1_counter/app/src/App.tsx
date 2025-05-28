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
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl, Keypair } from "@solana/web3.js";
import { web3 } from "@coral-xyz/anchor";

import "./App.css";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";
import InitializedButton from "./components/InitializedButton";
import IncrementButton from "./components/IncrementButton";
import DecrementButton from "./components/DecrementButton";

function App() {
  const [demoAccount, setDemoAccount] = useState<Keypair>(
    web3.Keypair.generate() // Generate a new keypair for demo purposes
  );

  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(() => [new PhantomWalletAdapter()], [network]);

  return (
    <>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <WalletMultiButton />
            <h1>Hello Solana</h1>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                margin: "20px 0",
                fontWeight: "bold",
              }}
            >
              Counter: {0}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <InitializedButton demoAccount={demoAccount} />
              <IncrementButton demoAccount={demoAccount} />
              <DecrementButton demoAccount={demoAccount} />
            </div>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
}

export default App;
