import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Calculator } from "../target/types/calculator";
const { SystemProgram } = anchor.web3
import { expect } from 'chai';

// Mocha predescribed `it blocks`
describe("calculator", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  // Reference to the program, sort of abstraction to call methos of our program
  const program = anchor.workspace.Calculator as Program<Calculator>;
  const programProvider = program.provider as anchor.AnchorProvider;

  // Keypair generation for calculator account
  const calculatorKey = anchor.web3.Keypair.generate();

  const text = "Testing Calculator for SSoS"

  // Test block creation
  it("Create a Calculator instance!", async () => {
    // We call `create` instance. Set the Calc keypair as signer
    await program.methods.create(text).accounts(
      {
        calculator: calculatorKey.publicKey,
        user: programProvider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      }
    ).signers([calculatorKey]).rpc()

  // fetching the account back and read the content of the string in it
  const account = await program.account.calculator.fetch(calculatorKey.publicKey)
  expect(account.greeting).to.eql(text)
  });

  // Testing Addition
  it("Testing Addition", async() => {
    await program.methods.add(new anchor.BN(2), new anchor.BN(3))
      .accounts({
        calculator: calculatorKey.publicKey,
      }).rpc()
    const account = await program.account.calculator.fetch(calculatorKey.publicKey)
    expect(account.result).to.eql(new anchor.BN(5))
  })

  // Testing Subtraction
  it("Testing Subtraction", async() => {
    await program.methods.sub(new anchor.BN(2), new anchor.BN(3))
      .accounts({
        calculator: calculatorKey.publicKey,
      }).rpc()
    const account = await program.account.calculator.fetch(calculatorKey.publicKey)
    expect(account.result).to.eql(new anchor.BN(-1))
  })

  // Testing Multiplication
  it("Testing Multiplication", async() => {
    await program.methods.mul(new anchor.BN(5), new anchor.BN(2))
      .accounts({
        calculator: calculatorKey.publicKey,
      }).rpc()
    const account = await program.account.calculator.fetch(calculatorKey.publicKey)
    expect(account.result).to.eql(new anchor.BN(10))
  })

  // Testing Division
  it("Testing Division", async() => {
    await program.methods.div(new anchor.BN(5), new anchor.BN(2))
      .accounts({
        calculator: calculatorKey.publicKey,
      }).rpc()
    const account = await program.account.calculator.fetch(calculatorKey.publicKey)
    expect(account.result).to.eql(new anchor.BN(2))
  })

  // Testing Modulus
  it("Testing Modulus", async() => {
    await program.methods.modu(new anchor.BN(5), new anchor.BN(2))
      .accounts({
        calculator: calculatorKey.publicKey,
      }).rpc()
    const account = await program.account.calculator.fetch(calculatorKey.publicKey)
    expect(account.result).to.eql(new anchor.BN(1))
  })
  
});
