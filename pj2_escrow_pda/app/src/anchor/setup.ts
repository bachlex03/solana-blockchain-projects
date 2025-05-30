import { Program, type IdlAccounts, type Provider } from "@coral-xyz/anchor";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { type Pj2EscrowPda, IDL } from "./idl";

// const localnet = "http://127.0.0.1:8899";
const devnet = clusterApiUrl("devnet");

const connection = new Connection(devnet, "confirmed");

const programId = new PublicKey(IDL.address);

// new AnchorProvider(connection, wallet, {
//   preflightCommitment: "confirmed",
// })

console.log("Program ID:", programId.toBase58());

const provider: Provider = {
  connection: connection,
  publicKey: programId,
};

export const walletPubkey = new PublicKey(
  "GtS3fRj6d1aeSZczSccD3XNRwyd4AbzzkpMd9uaj2TS6"
);
export const clientPubkey = new PublicKey(
  "EQeNhVUmS75zr5QetxKwWWLNmdU5Npa7fZ1XzbLX2DQY"
);

export const program = new Program<Pj2EscrowPda>(IDL, provider);

export const [escrowPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("escrow"), walletPubkey.toBuffer(), clientPubkey.toBuffer()],
  program.programId
);

export type EscrowPDA = IdlAccounts<Pj2EscrowPda>["escrowAccount"];
