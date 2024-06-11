import { getContract } from "thirdweb";
import { polygon } from "thirdweb/chains";
import { client } from "./client";
// get a contract
const addr = import.meta.env.VITE_CONTRACT_ADDRESS || "0xE9bBE398b3Bf34791Dac5F53952a8acf6286DE26";
export const contract = getContract({
  // the client you have created via `createThirdwebClient()`
  client,
  // the chain the contract is deployed on
  chain: polygon,
  // the contract's address
  address: addr,
});

export const address = addr;