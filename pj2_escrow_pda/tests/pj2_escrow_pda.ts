import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Pj2EscrowPda } from "../target/types/pj2_escrow_pda";
import assert from "assert";

describe("pj2_escrow_pda", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.pj2EscrowPda as Program<Pj2EscrowPda>;

  const from = anchor.AnchorProvider.local().wallet.publicKey;
  console.log("[LOG]::from:", from.toBase58());

  const to = anchor.web3.Keypair.generate().publicKey;
  console.log("[LOG]::to:", to.toBase58());

  const seeds = [Buffer.from("escrow"), from.toBuffer(), to.toBuffer()];
  const [escrowPDA] = anchor.web3.PublicKey.findProgramAddressSync(
    seeds,
    program.programId
  );

  it("Is initialized!", async () => {
    try {
      const amount = new anchor.BN(100);
      console.log("[LOG]::amount:", amount.toString());

      const tx = await program.methods
        .createEscrow(amount)
        .accounts({
          escrow: escrowPDA,
          from: from,
          to: to,
        })
        .rpc();
      console.log("Your transaction signature:", tx);

      const escrowAccount = await program.account.escrowAccount.fetch(
        escrowPDA
      );
      console.log("[LOG]::escrowAccount:", escrowAccount);

      console.log("[LOG]::amount:", escrowAccount.amount);
      console.log("[LOG]::amount:", escrowAccount.amount.toNumber());

      assert.equal(
        escrowAccount.amount.toNumber(),
        100,
        "Escrow amount should be 100"
      );
      assert.ok(escrowAccount.from.equals(from), "From address should match");
      assert.ok(escrowAccount.to.equals(to), "To address should match");
    } catch (error) {
      console.error("[LOG]::Error initializing escrow:", error);
      assert.fail("Initialization failed");
    }
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
