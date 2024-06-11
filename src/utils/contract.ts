import { getContract } from "thirdweb";
import { polygon } from "thirdweb/chains";
import { client } from "./client";
// get a contract
export const contract = getContract({
  // the client you have created via `createThirdwebClient()`
  client,
  // the chain the contract is deployed on
  chain: polygon,
  // the contract's address
  address: "0x4e4b76EFa8CA0E11D21B79860F2b4256ef435cF2",
});

export const address = "0x4e4b76EFa8CA0E11D21B79860F2b4256ef435cF2";