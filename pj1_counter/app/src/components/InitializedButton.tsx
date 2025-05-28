import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { program } from "../anchor/setup";
import { useState } from "react";
import type { Keypair } from "@solana/web3.js";

type InitializedButtonProps = {
  demoAccount: Keypair;
};

const InitializedButton = ({ demoAccount }: InitializedButtonProps) => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [isLoading, setIsLoading] = useState(false);

  const handleOnClick = async () => {
    if (!publicKey) {
      console.error("Wallet not connected");
      return;
    }

    setIsLoading(true);

    console.log("Public Key:", publicKey.toBase58());
    console.log("demoAccount:", demoAccount.publicKey.toBase58());

    try {
      const tx = await program.methods
        .initialize()
        .accounts({
          counter: demoAccount.publicKey,
          user: publicKey,
        })
        .signers([demoAccount])
        .transaction();

      console.log("Transaction created:", tx);

      // Send the transaction and get the signature
      const signature = await sendTransaction(tx, connection, {
        signers: [demoAccount],
      });

      console.log("Transaction signature:", signature);

      // Confirm the transaction
      const latestBlockHash = await connection.getLatestBlockhash();
      const confirmTransaction = await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: signature,
      });

      if (confirmTransaction.value.err) {
        console.error(
          "Transaction failed with error:",
          confirmTransaction.value.err
        );
        throw new Error("Transaction confirmation failed");
      }

      console.log("Transaction confirmed:", tx);

      // const tx = await sendTransaction(transaction, connection, {
      //   signers: [demoAccount],
      // });

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
      Initialize
    </button>
  );
};

export default InitializedButton;
