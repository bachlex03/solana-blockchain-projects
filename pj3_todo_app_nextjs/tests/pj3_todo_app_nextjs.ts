import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Pj3TodoAppNextjs } from "../target/types/pj3_todo_app_nextjs";

describe("pj3_todo_app_nextjs", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.pj3TodoAppNextjs as Program<Pj3TodoAppNextjs>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
