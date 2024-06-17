import { getContract } from "thirdweb";
import { polygon } from "thirdweb/chains";
import { client } from "./client";
// get a contract
const addr = import.meta.env.VITE_CONTRACT_ADDRESS || "0xd68627231763aed59A521138Bd1C3FD53ECeafd4";
export const contract = getContract({
  // the client you have created via `createThirdwebClient()`
  client,
  // the chain the contract is deployed on
  chain: polygon,
  // the contract's address
  address: addr,
});

export const address = addr;