import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Pj1Counter } from "../target/types/pj1_counter";
import assert from "assert";

describe("pj1_counter", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();

  anchor.setProvider(provider);

  const program = anchor.workspace.pj1Counter as Program<Pj1Counter>;

  let _counter_acc = null;

  it("Is initialized!", async () => {
    const counter_acc = anchor.web3.Keypair.generate();

    console.log(
      "Counter account public key:",
      counter_acc.publicKey.toBase58()
    );

    // Add your test here.
    const tx = await program.methods
      .initialize()
      .accounts({
        counter: counter_acc.publicKey,
        user: provider.wallet.publicKey,
      })
      .signers([counter_acc])
      .rpc();

    console.log("Your transaction signature", tx);

    const account = await program.account.counter.fetch(counter_acc.publicKey);

    console.log("Counter account data:", account);
    console.log("Counter value:", account.count);

    assert.equal(account.count, 0, "Initialized account must be 0");

    _counter_acc = counter_acc;
  });

  it("Update previous counter!", async () => {
    const counter_acc = _counter_acc;

    console.log(
      "Counter account public key:",
      counter_acc.publicKey.toBase58()
    );

    const tx = await program.methods
      .update(new anchor.BN(100))
      .accounts({
        counter: counter_acc.publicKey,
      })
      .rpc();

    console.log("Your transaction signature", tx);

    const account = await program.account.counter.fetch(counter_acc.publicKey);

    console.log("Counter account data:", account);
    console.log("Counter value:", account.count);

    assert.equal(account.count, 100, "Updated account must be 100");
  });

  it("Increment counter!", async () => {
    const counter_acc = _counter_acc;

    console.log(
      "Counter account public key:",
      counter_acc.publicKey.toBase58()
    );

    const tx = await program.methods
      .increment()
      .accounts({
        counter: counter_acc.publicKey,
      })
      .rpc();

    console.log("Your transaction signature", tx);

    const account = await program.account.counter.fetch(counter_acc.publicKey);

    console.log("Counter account data:", account);

    console.log("Counter value:", account.count);

    assert.equal(account.count, 101, "Incremented account must be 101");
  });

  it("Decrement counter!", async () => {
    const counter_acc = _counter_acc;

    console.log(
      "Counter account public key:",
      counter_acc.publicKey.toBase58()
    );

    const tx = await program.methods
      .decrement()
      .accounts({
        counter: counter_acc.publicKey,
      })
      .rpc();

    console.log("Your transaction signature", tx);

    const account = await program.account.counter.fetch(counter_acc.publicKey);

    console.log("Counter account data:", account);

    console.log("Counter value:", account.count);

    assert.equal(account.count, 100, "Decremented account must be 100");
  });
});
