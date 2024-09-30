import { getContract } from "thirdweb";
import { baseSepolia, base } from "thirdweb/chains";
import { client } from "./client";

// get a contract
const addr = import.meta.env.VITE_CONTRACT_ADDRESS || "0xd68627231763aed59A521138Bd1C3FD53ECeafd4";
const isTest = import.meta.env.VITE_PUBLIC_ENV === "testnet";
export const contract = getContract({
  // the client you have created via `createThirdwebClient()`
  client,
  // the chain the contract is deployed on
  chain: isTest ? baseSepolia : base,
  // the contract's address
  address: addr,
});

export const address = addr;
export const chain = isTest ? baseSepolia : base;

export const maxBlocksWaitTime = 300;