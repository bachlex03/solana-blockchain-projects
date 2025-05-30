// import {
//   useAnchorWallet,
//   useConnection,
//   useWallet,
// } from "@solana/wallet-adapter-react";
// import { Connection, PublicKey } from "@solana/web3.js";
// import { AnchorProvider, BN, Program, web3 } from "@coral-xyz/anchor";

// import { clientPubkey, program, walletPubkey } from "../anchor/setup";
// import { IDL } from "../anchor/idl";
import idl from "../anchor/idl.json";

import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { AnchorProvider, Program, web3 } from "@coral-xyz/anchor";
import { Connection, PublicKey, SendTransactionError } from "@solana/web3.js";

const SendTransactionBtn = () => {
  const wallet = useWallet();
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();

  console.log("walletPubkey:", wallet?.publicKey?.toBase58());
  console.log("anchorWallet:", anchorWallet?.publicKey?.toBase58());

  const devnetConnection = new Connection(
    "https://api.devnet.solana.com",
    "processed"
  );

  const handleOnClick = async () => {
    try {
      console.log("Sending transaction...");
      console.log("Wallet:", wallet);
      console.log("Anchor Wallet:", anchorWallet);

      if (!wallet || !anchorWallet) {
        console.error("Wallet not connected");
        return;
      }

      console.log("Using connection:", devnetConnection.rpcEndpoint);

      const provider = new AnchorProvider(devnetConnection, anchorWallet, {
        commitment: "processed",
      });
      anchor.setProvider(provider);

      const programId = new web3.PublicKey(
        "EeYjBR5CXBe5BML86bf5e71uUUHojYSYvQ8r3Htiqo52"
      );

      const program = new Program(idl, {
        ...provider,
      });

      console.log("Program ID:", program.programId.toBase58());

      const from = provider.wallet.publicKey; // The signer's public key
      const to = new PublicKey("EQeNhVUmS75zr5QetxKwWWLNmdU5Npa7fZ1XzbLX2DQY"); // Replace with recipient's public key

      console.log("From:", from.toBase58());
      console.log("To:", to.toBase58());

      const [escrowPda, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from("escrow"), from.toBuffer(), to.toBuffer()],
        program.programId
      );

      console.log("Escrow PDA:", escrowPda.toBase58(), "Bump:", bump);

      const amount = 100; // Replace with the desired amount
      const tx = await program.methods
        .createEscrow(new anchor.BN(amount))
        .accounts({
          escrow: escrowPda,
          from: from,
          to: to,
          systemProgram: web3.SystemProgram.programId,
        })
        .transaction();

      console.log("Transaction ID:", tx);

      const signature = await provider.sendAndConfirm(tx, undefined, {
        commitment: "confirmed",
      });

      console.log("Transaction signature:", signature);

      const escrowAccount = await program.account.escrowAccount.fetch(
        escrowPda
      );

      console.log("Escrow Account:", escrowAccount);

      console.log("value:", escrowAccount.amount.toString());

      // const idl = JSON.parse(fs.readFileSync("../anchor/idl.json", "utf8"));

      // console.log("Program ID:", program.programId.toBase58());
      // console.log("idl", idl);

      // const connection = new Connection(
      //   "https://api.devnet.solana.com",
      //   "processed"
      // );

      // const provider = new AnchorProvider(connection, anchorWallet, {
      //   preflightCommitment: "processed",
      // });

      // const programId = new PublicKey(idl.address);

      // const program = new Program(idl, {
      //   ...provider,
      //   publicKey: programId,
      // });

      // const toKey = new PublicKey(
      //   "EQeNhVUmS75zr5QetxKwWWLNmdU5Npa7fZ1XzbLX2DQY"
      // );

      // console.log("To Key:", toKey.toBase58());

      // console.log("Program ID:", program.programId.toBase58());

      // const [escrowPDA, bump] = PublicKey.findProgramAddressSync(
      //   [Buffer.from("escrow"), wallet.publicKey.toBuffer(), toKey.toBuffer()],
      //   program.programId
      // );
      // console.log("Escrow PDA:", escrowPDA.toBase58(), "Bump:", bump);

      // const tx = await program.methods
      //   .createEscrow(new BN(30))
      //   .accounts({
      //     escrowAccount: program.account.escrowAccount,
      //     from: walletPubkey,
      //     to: clientPubkey,
      //   })
      //   .transaction();

      // const signature = await wallet.sendTransaction(tx, connection, {
      //   signers: [],
      // });

      // console.log("Transaction ID:", tx);
      // console.log("Transaction signature:", signature);

      // const latestBlockHash = await connection.getLatestBlockhash();
      // const confirmTransaction = await connection.confirmTransaction({
      //   blockhash: latestBlockHash.blockhash,
      //   lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      //   signature: signature,
      // });

      // if (confirmTransaction.value.err) {
      //   console.error(
      //     "Transaction failed with error:",
      //     confirmTransaction.value.err
      //   );
      //   throw new Error("Transaction confirmation failed");
      // }

      // console.log("Transaction confirmed:", tx);

      // console.log("Transaction sent:", tx);
    } catch (error: unknown) {
      // console.log("Transaction failed:", error);
      if (error instanceof SendTransactionError) {
        console.log(
          "Error sending transaction:",
          await error.getLogs(devnetConnection)
        );
      } else {
        console.log("Error sending transaction:", error);
      }
    }
  };

  return (
    <button
      className="btn btn-primary"
      onClick={handleOnClick}
      disabled={!anchorWallet || !wallet || !wallet.publicKey}
    >
      Send Transaction
    </button>
  );
};

export default SendTransactionBtn;
