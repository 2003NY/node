import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { StargateClient,GasPrice, coin } from "@cosmjs/stargate";

import {
    CosmWasmClient,
    SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";

import fs from "fs";

const rpc = "https://rpc.xion-testnet-1.burnt.com:443";
const mnemonic =
  "road wheel quick abstract dolphin hotel brush raise equip notice shield door typical amount always bronze staff old own story company sketch decrease brisk";

const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: "xion",
});

const [account] = await wallet.getAccounts();

console.log("account is : ",account.address);

const client = await SigningCosmWasmClient.connectWithSigner(rpc,wallet, {
    gasPrice: GasPrice.fromString("0.001uxion"),
});

async function storeCode() {
    const wasmFile = fs.readFileSync("./cw_counter.wasm");
    const wasmBytes = new Uint8Array(wasmFile);

    const uploadCounter = await client.upload(account.address, wasmBytes, "auto");
    let contractId = uploadCounter.codeId;
    console.log("Contract ID : ",contractId);
}

const contractId = 1426;

async function instantiate() {
    const ins_msg = {};

    let ins_reply = await client.instantiate(account.address, contractId, ins_msg, "nilesh-contract","auto");
    console.log("Contract Address is : ",ins_reply.contractAddress);
    return ins_reply.contractAddress;
}

instantiate();

let counter_contract = "xion16clg54v3xktfqk80llazyc3k5n87cdahn0x8tnamvzw84yunufaq2rc283";


async function increment() {
    
    const inc_msg = {
        increment_counter: {},
    };

    const inc_reply=await client.execute(
        account.address,
        counter_contract,
        inc_msg,
        "auto"
    );

    console.log(
        "counter increment sucessfully and hash of transaction is",
        inc_reply.transactionHash
    );
}

increment()