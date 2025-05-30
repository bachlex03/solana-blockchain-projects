import { Program, type Provider } from "@coral-xyz/anchor";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import idl from "./idl.json";
import { type Pj2EscrowPda } from "./idl";

const devnet = clusterApiUrl("devnet");

const connection = new Connection(devnet, "processed");

// const provider = new AnchorProvider(connection, new Wallet({
//     pu
// }), {
//     commitment: "processed",
// });


const [escrowPDA] = PublicKey.findProgramAddressSync(

const provider: Provider = {
  connection: connection,
  publicKey: new PublicKey(idl.address),
};

export const program = new Program<Pj2EscrowPda>(idl, provider);
