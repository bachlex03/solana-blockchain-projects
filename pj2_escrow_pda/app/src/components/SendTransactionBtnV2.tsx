import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { AnchorProvider, BN, Program, setProvider } from "@coral-xyz/anchor";
import idl from "../anchor2/idl.json";
import { type Pj2EscrowPda, IDL } from "../anchor2/idl";

const SendTransactionBtnV2 = () => {
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();

  async function handleOnClick() {
    if (!anchorWallet || !anchorWallet.publicKey) {
      console.error("Anchor wallet is not connected");
      return;
    }

    const provider = new AnchorProvider(connection, anchorWallet, {
      preflightCommitment: "processed",
    });
    console.log("[VAR]::provider:", provider);

    setProvider(provider);
    console.log("[VAR]::provider:", provider);

    const program = new Program(idl, provider);
    const program2 = new Program<Pj2EscrowPda>(IDL, provider);

    const from = anchorWallet.publicKey;
    const to = new PublicKey("EQeNhVUmS75zr5QetxKwWWLNmdU5Npa7fZ1XzbLX2DQY");

    const seeds = [Buffer.from("escrow"), from.toBuffer(), to.toBuffer()];
    const [escrowPDA] = PublicKey.findProgramAddressSync(
      seeds,
      program.programId
    );

    const amount = 100;
    try {
      const tx = await program.methods
        .createEscrow(new BN(amount))
        .accounts({
          escrow: escrowPDA,
          from: from,
          to: to,
        })
        .rpc();
    } catch (error) {
      console.error("[LOG]::Error creating escrow:", error);
      return;
    }

    if (!program.provider.sendAndConfirm) {
      console.error("Provider does not support sendAndConfirm method");
      return;
    }

    // try {
    //   console.log("[LOG]::Sending transaction...");
    //   const signature = await program.provider.sendAndConfirm(tx);
    //   console.log("[LOG]::Transaction successful with signature:", signature);
    // } catch (error) {
    //   console.error("[LOG]::Transaction failed:", error);
    // }

    // const escrowAccount = await program2.account.escrowAccount.fetch(
    //   escrowPDA
    // );

    // console.log("[VAR]::escrowAccount:", escrowAccount);

    // console.log("[LOG]::value:", escrowAccount.amount.toString());
  }

  return (
    <button className="btn btn-primary" onClick={handleOnClick}>
      Send Transaction v2
    </button>
  );
};

export default SendTransactionBtnV2;
