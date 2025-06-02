import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Pj3TodoAppNextjs } from "../target/types/pj3_todo_app_nextjs";
import assert from "assert";

describe("pj3_todo_app_nextjs", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .pj3TodoAppNextjs as Program<Pj3TodoAppNextjs>;

  const authorityPubkey = anchor.getProvider().wallet.publicKey;
  const authorityPubkey2 = anchor.AnchorProvider.local().wallet.publicKey;

  const userProfileSeeds = [
    Buffer.from("USER_STATE"),
    authorityPubkey.toBuffer(),
  ];

  const [userProfilePDA] = anchor.web3.PublicKey.findProgramAddressSync(
    userProfileSeeds,
    program.programId
  );

  console.log("[LOG]::userProfilePDA:", userProfilePDA.toBase58());

  it("Initialize user profile!", async () => {
    console.log("[LOG]::userProfilePDA:", userProfilePDA.toBase58());

    const userProfileExists = await program.account.userProfile
      .fetch(userProfilePDA)
      .catch((err) => {
        console.log("[LOG]::User profile does not exist yet.", err);
      });

    console.log("[LOG]::userProfileExists:", userProfileExists);

    if (userProfileExists) {
      console.log(
        "[LOG]::User profile already exists, skipping initialization."
      );
      return;
    }

    // Add your test here.
    const tx = await program.methods
      .initializeUser()
      .accounts({
        authority: authorityPubkey,
        userProfile: userProfilePDA,
      })
      .rpc();

    console.log("[LOG]::tx:", tx);

    let userProfile = await program.account.userProfile.fetch(userProfilePDA);

    console.log("[LOG]::userProfile:", userProfile);
    console.log(
      "[LOG]::userProfile.authority:",
      userProfile.authority.toBase58()
    );

    assert.ok(
      userProfile.authority.equals(authorityPubkey),
      "Authority should match"
    );
  });

  it("Fetch all user profiles!", async () => {
    const userProfiles = await program.account.userProfile.all();
    console.log("[LOG]::userProfiles:", userProfiles);

    // assert.ok(userProfiles.length > 0, "User profiles should not be empty");
  });

  it("Add todo item!", async () => {
    let userProfile = await program.account.userProfile.fetch(userProfilePDA);

    const todoItemSeeds = [
      Buffer.from("TOTO_STATE"),
      authorityPubkey.toBuffer(),
      Buffer.from([userProfile.lastTodo]),
    ];

    const [todoPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      todoItemSeeds,
      program.programId
    );

    const content = Date.now().toString();

    const tx = await program.methods
      .addTodoItem(content, userProfile.lastTodo)
      .accounts({
        authority: authorityPubkey,
        userProfile: userProfilePDA,
        todoAccount: todoPDA,
      })
      .rpc();
    console.log("[LOG]::tx:", tx);

    const todoItem = await program.account.todoAccount.fetch(todoPDA);
    console.log("[LOG]::todoItem:", todoItem);
    console.log("[LOG]::todoItem.content:", todoItem.content);

    const updatedUserProfile = await program.account.userProfile.fetch(
      userProfilePDA
    );
    console.log("[LOG]::updatedUserProfile:", updatedUserProfile);
    console.log(
      "[LOG]::userProfile.todoCount:",
      updatedUserProfile.todoCount.toString()
    );
  });

  it("mark todo item idx 0 as done!", async () => {
    const idx = Buffer.from([0]);

    const seeds = [
      Buffer.from("TOTO_STATE"),
      authorityPubkey.toBuffer(),
      Buffer.from([idx[0]]),
    ];

    const [todoPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      seeds,
      program.programId
    );
    console.log("[LOG]::todoPDA:", todoPDA.toBase58());

    const tx = await program.methods
      .markTodoItem(0)
      .accounts({
        authority: authorityPubkey,
        userProfile: userProfilePDA,
      })
      .rpc();
    console.log("[LOG]::tx:", tx);

    const todoItem = await program.account.todoAccount.fetch(todoPDA);
    console.log("[LOG]::todoItem:", todoItem);
  });

  it("Remove todo item idx 0!", async () => {
    const idx = Buffer.from([0]);

    const seeds = [
      Buffer.from("TOTO_STATE"),
      authorityPubkey.toBuffer(),
      Buffer.from([idx[0]]),
    ];

    const [todoPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      seeds,
      program.programId
    );
    console.log("[LOG]::todoPDA:", todoPDA.toBase58());

    const tx = await program.methods
      .removeTodoItem(0)
      .accounts({
        authority: authorityPubkey,
        userProfile: userProfilePDA,
        todoAccount: todoPDA,
      })
      .rpc();
    console.log("[LOG]::tx:", tx);

    const todoItems = await program.account.todoAccount.all();
    console.log("[LOG]::todoItems:", todoItems);

    const userProfile = await program.account.userProfile.fetch(userProfilePDA);
    console.log("[LOG]::userProfile:", userProfile);
    console.log(
      "[LOG]::userProfile.todoCount:",
      userProfile.todoCount.toString()
    );
    assert.ok(
      userProfile.todoCount === 0,
      "Todo count should be 0 after removal"
    );
  });
});
