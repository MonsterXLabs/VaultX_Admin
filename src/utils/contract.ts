import { getContract } from "thirdweb";
import { baseSepolia, base } from "thirdweb/chains";
import { client } from "./client";
import { privateKeyToAccount } from "thirdweb/wallets";

// get a contract
const addr = import.meta.env.VITE_CONTRACT_ADDRESS || "0xd68627231763aed59A521138Bd1C3FD53ECeafd4";
const isTest = import.meta.env.VITE_PUBLIC_ENV === "testnet";
export const contract = getContract({
  client,
  chain: isTest ? baseSepolia : base,
  address: addr,
});

export const address = addr;
export const chain = isTest ? baseSepolia : base;

export const maxBlocksWaitTime = 300;

export const adminAccount = privateKeyToAccount({ client, privateKey: import.meta.env.VITE_ADMIN_PRIVATE_KEY });

export const marketplaceURL = isTest ? import.meta.env.VITE_TESTNET_URL : import.meta.env.VITE_MAINNET_URL;