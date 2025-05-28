import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { program } from "../anchor/setup";
import { useState } from "react";
import type { Keypair } from "@solana/web3.js";

type InitializedButtonProps = {
  demoAccount: Keypair;
};

const DecrementButton = ({ demoAccount }: InitializedButtonProps) => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [isLoading, setIsLoading] = useState(false);

  const handleOnClick = async () => {
    if (!publicKey) {
      console.error("Wallet not connected");
      return;
    }

    setIsLoading(true);

    try {
      const transaction = await program.methods
        .increment()
        .accounts({
          counter: demoAccount.publicKey,
        })
        .transaction();

      const tx = await sendTransaction(transaction, connection);

      console.log("Transaction sent:", tx);

      const account = await program.account.counter.fetch(
        demoAccount.publicKey
      );

      console.log("Counter account data:", account);
      console.log("Counter value:", account.count);
    } catch (error) {
      console.error("Transaction failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handleOnClick} disabled={!publicKey || isLoading}>
      Decrement
    </button>
  );
};

export default DecrementButton;
