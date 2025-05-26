// hello_word.ts

import {
  Keypair,
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  TransactionInstruction,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import fs from "mz/fs";
import path from "path";
import * as borsh from "borsh";
import { createKeypairFromFile, getPayer, getRpcUrl } from "./utils";
import * as BufferLayout from "@solana/buffer-layout";
import { Buffer } from "buffer";

let connection: Connection;

let payer: Keypair;

let programId: PublicKey;

let greetedPubkey: PublicKey;

const PROGRAM_PATH = path.resolve(__dirname, "../dist/program");

const PROGRAM_SO_PATH = path.join(PROGRAM_PATH, "hello_world_v2.so");

const PROGRAM_KEYPAIR_PATH = path.join(
  PROGRAM_PATH,
  "hello_world_v2-keypair.json"
);

class GreetingAccount {
  counter = 0;
  constructor(fields: { counter: number } | undefined = undefined) {
    if (fields) {
      this.counter = fields.counter;
    }
  }
}

/**
 * Borsh schema definition for greeting accounts
 */
const GreetingSchema = new Map([
  [GreetingAccount, { kind: "struct", fields: [["counter", "u32"]] }],
]);

/**
 * The expected size of each greeting account.
 */
const GREETING_SIZE = borsh.serialize(
  GreetingSchema,
  new GreetingAccount()
).length;

/**
 * Establish a connection to the cluster
 */
export async function establishConnection(): Promise<void> {
  const rpcUrl = await getRpcUrl();
  connection = new Connection(rpcUrl, "confirmed");
  const version = await connection.getVersion();
  console.log("[LOG]::Connection to cluster established:", rpcUrl, version);
}

export async function establishPayer(): Promise<void> {
  let fees = 0;

  if (!payer) {
    const latestBlockHash = await connection.getLatestBlockhash();

    console.log("[LOG:VAR]::latestBlockHash:", latestBlockHash);

    payer = await getPayer();

    console.log("[LOG:VAR]::payer:", payer);

    const transaction = new Transaction({
      ...latestBlockHash,
      feePayer: payer.publicKey,
    });

    console.log("[LOG:VAR]::transaction:", transaction);

    const message = transaction.compileMessage();

    console.log("[LOG:VAR]::message:", message);

    const feeResponse = await connection.getFeeForMessage(message, "confirmed");

    console.log("[LOG:VAR]::feeResponse:", feeResponse);

    if (feeResponse.value === null) {
      throw new Error("Failed to get fee for message");
    }
    fees += feeResponse.value;

    console.log("Fees required for transaction:", fees);

    // Calculate the cost to fund the greeter account
    fees += await connection.getMinimumBalanceForRentExemption(GREETING_SIZE);

    console.log(
      "Fees required for greeting account creation:",
      fees,
      "lamports"
    );
  }

  let lamports = await connection.getBalance(payer.publicKey);

  if (lamports < fees) {
    throw new Error(
      `Insufficient funds: ${lamports} lamports available, but ${fees} lamports required.`
    );
  }

  console.log(
    "Using account",
    payer.publicKey.toBase58(),
    "containing",
    lamports / LAMPORTS_PER_SOL,
    "SOL to pay for fees"
  );
}

/**
 * Check if the hello world BPF program has been deployed
 */
export async function checkProgram(): Promise<void> {
  try {
    const programKeypair = await createKeypairFromFile(PROGRAM_KEYPAIR_PATH);
    programId = programKeypair.publicKey;
  } catch (err) {
    const errMsg = (err as Error).message;
    throw new Error(
      `Failed to read program keypair at '${PROGRAM_KEYPAIR_PATH}' due to error: ${errMsg}. Program may need to be deployed with \`solana program deploy dist/program/helloworld.so\``
    );
  }

  // Check if the program has been deployed
  const programInfo = await connection.getAccountInfo(programId);
  if (programInfo === null) {
    if (fs.existsSync(PROGRAM_SO_PATH)) {
      throw new Error(
        "Program needs to be deployed with `solana program deploy dist/program/helloworld.so`"
      );
    } else {
      throw new Error("Program needs to be built and deployed");
    }
  } else if (!programInfo.executable) {
    throw new Error(`Program is not executable`);
  }
  console.log(`Using program ${programId.toBase58()}`);

  // Derive the address (public key) of a greeting account from the program so that it's easy to find later.
  const GREETING_SEED = "hello";
  greetedPubkey = await PublicKey.createWithSeed(
    payer.publicKey,
    GREETING_SEED,
    programId
  );

  // Check if the greeting account has already been created
  const greetedAccount = await connection.getAccountInfo(greetedPubkey);
  if (greetedAccount === null) {
    console.log(
      `Greeting account ${greetedPubkey.toBase58()} does not exist yet.`
    );

    console.log(
      "Creating account",
      greetedPubkey.toBase58(),
      "to say hello to"
    );

    const lamports = await connection.getMinimumBalanceForRentExemption(
      GREETING_SIZE
    );

    const transaction = new Transaction();

    transaction.add(
      SystemProgram.createAccountWithSeed({
        fromPubkey: payer.publicKey,
        basePubkey: payer.publicKey,
        seed: GREETING_SEED,
        newAccountPubkey: greetedPubkey,
        lamports,
        space: GREETING_SIZE,
        programId,
      })
    );

    await sendAndConfirmTransaction(connection, transaction, [payer]);
  }

  console.log("[LOG:VAR]::greetedAccount:", greetedAccount);
}

function createIncrementInstruction() {
  const layout = BufferLayout.struct<{ instruction: number }>([
    BufferLayout.u8("instruction"),
  ]);
  const data = Buffer.alloc(layout.span);

  layout.encode(
    {
      instruction: 0, // 0 for increment
    },
    data
  );

  return data;
}

function createDecrementInstruction() {
  const layout = BufferLayout.struct<{ instruction: number }>([
    BufferLayout.u8("instruction"),
  ]);
  const data = Buffer.alloc(layout.span);

  layout.encode(
    {
      instruction: 1, // 0 for increment
    },
    data
  );

  return data;
}

function createSetCounterInstruction(counter: number) {
  const layout = BufferLayout.struct<{
    instruction: number;
    value: number;
  }>([BufferLayout.u8("instruction"), BufferLayout.u32("value")]);

  console.log("[LOG:VAR]::layout:", layout);
  console.log("[LOG:VAR]::layout.span:", layout.span);

  const data = Buffer.alloc(layout.span);

  console.log("[LOG:VAR]::data:", data);
  console.log("[LOG:VAR]::data.length:", data.length);
  console.log("[LOG:VAR]::data.byteLength:", data.byteLength);
  console.log("[LOG:VAR]::data.buffer.byteLength:", data.buffer.byteLength);
  console.log("[LOG:VAR]::data.buffer:", data.buffer);

  layout.encode(
    {
      instruction: 2,
      value: counter,
    },
    data
  );

  console.log("[LOG:VAR]::data after encode:", data);
  console.log("[LOG:VAR]::data.length after encode:", data.length);
  console.log("[LOG:VAR]::data.byteLength after encode:", data.byteLength);
  console.log(
    "[LOG:VAR]::data.buffer.byteLength after encode:",
    data.buffer.byteLength
  );
  console.log("[LOG:VAR]::data.buffer after encode:", data.buffer);

  return data;
}

/**
 * Say hello
 */
export async function sayHello(): Promise<void> {
  console.log("[LOG]::Saying hello to", greetedPubkey.toBase58());

  const instruction = new TransactionInstruction({
    keys: [{ pubkey: greetedPubkey, isSigner: false, isWritable: true }],
    programId,
    data: createSetCounterInstruction(100), // All instructions are hellos
  });

  await sendAndConfirmTransaction(
    connection,
    new Transaction().add(instruction),
    [payer]
  );
}

/**
 * Report the number of times the greeted account has been said hello to
 */
export async function reportGreetings(): Promise<void> {
  const accountInfo = await connection.getAccountInfo(greetedPubkey);
  if (accountInfo === null) {
    throw "Error: cannot find the greeted account";
  }

  const greeting = borsh.deserialize(
    GreetingSchema,
    GreetingAccount,
    accountInfo.data
  );

  console.log(
    greetedPubkey.toBase58(),
    "has been greeted",
    greeting.counter,
    "time(s)"
  );
}
