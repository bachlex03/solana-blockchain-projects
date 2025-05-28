import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Pj2EscrowPda } from "../target/types/pj2_escrow_pda";

describe("pj2_escrow_pda", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.pj2EscrowPda as Program<Pj2EscrowPda>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});

// import * as anchor from "@coral-xyz/anchor";
// import { Program } from "@coral-xyz/anchor";
// import { Counter } from "../target/types/counter";
// import { PublicKey } from "@solana/web3.js";

// // Mocha test suite
// describe("counter", () => {
//   // Configure the client to use the local cluster.
//   anchor.setProvider(anchor.AnchorProvider.env());

//   const program = anchor.workspace.counter as Program<Counter>;

//   const [counterPDA] = PublicKey.findProgramAddressSync(
//     [Buffer.from("counter")],
//     program.programId
//   )

//   it("Is initialized!", async () => {
//     try {
//       const transactionSignature = await program.methods.initialize().rpc();

//       // Fetch the account data
//       const accountData = await program.account.counter.fetch(counterPDA);

//       console.log("Your transaction signature:", transactionSignature);
//       console.log(`Count: ${accountData.count}`)
//     }
//     catch (error) {
//       console.log(error);
//     }
//   });

//   it("Increment", async () => {
//     try {
//       const transactionSignature = await program.methods.increment().rpc();

//       const accountData = await program.account.counter.fetch(counterPDA);

//       console.log("Your transaction signature:", transactionSignature);
//       console.log(`Count: ${accountData.count}`)
//     }
//     catch (error) {
//       console.log(error);
//     }
//   })
// });
