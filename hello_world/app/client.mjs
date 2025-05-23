import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { getKeypairFromFile } from "@solana-developers/helpers";

const programId = new PublicKey("3GkjcNj8NpfnUs8qiYGbcttfERNupxP9N28JFMbA6Guv")
console.log("Program ID: ", programId)
console.log("Program ID: ", programId.toBase58())


// Connect to a solana cluster. Either to your local test validator or to devnet
const connection = new Connection("http://localhost:8899", "confirmed")
//const connection = new Connection("https://api.devnet.solana.com", "confirmed");
console.log("Connection: ", connection)

// We load the keypair that we created in a previous step
const keyPair = await getKeypairFromFile("~/.config/solana/id.json");
console.log("KeyPair: ", keyPair)
console.log("KeyPair.publicKey: ", keyPair.publicKey.toBase58())
console.log("KeyPair.secretKey: ", keyPair.secretKey.toString("base64"))

// Every transaction requires a blockhash
const blockhashInfo = await connection.getLatestBlockhash();
console.log("Blockhash: ", blockhashInfo)

// Create a new transaction
const tx  = new Transaction({
    ...blockhashInfo
})
console.log("Transaction: ", tx)


// Add our Hello World instruction
const instruction = new TransactionInstruction({
    programId: programId, // The program ID deployed to the cluster
    data: Buffer.from([]), // The instruction data, a instruction parameter that the program will use to perform its logic | Empty for now
    keys: []
}) 
console.log("Instruction: ", instruction)

tx.add(instruction);
console.log("Transaction with instruction: ", tx)

// Sign the transaction with your previously created keypair
tx.sign(keyPair);
console.log("Transaction with signature: ", tx)

const txHash = await connection.sendRawTransaction(tx.serialize()); // signature
console.log("Transaction sent with hash: ", txHash);

// Confirm the transaction
await connection.confirmTransaction({
    blockhash: blockhashInfo.blockhash,
    lastValidBlockHeight: blockhashInfo.lastValidBlockHeight,
    signature: txHash,
});


console.log(
  `Congratulations! Look at your ‘Hello World' transaction in the Solana Explorer:
  https://explorer.solana.com/tx/${txHash}?cluster=custom`,
);
