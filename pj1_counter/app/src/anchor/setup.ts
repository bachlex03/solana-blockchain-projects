import { Program, type Provider } from "@coral-xyz/anchor";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { type Pj1Counter, IDL } from "./idl";

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

export const program = new Program<Pj1Counter>(IDL, provider);
