import {createPublicClient, createWalletClient, custom, http} from "viem"
import {polygon, polygonMumbai, polygonAmoy} from "viem/chains"
import {createConfig} from "wagmi"

export const chains = {
  137: polygon,
  80001: polygonMumbai,
  80002: polygonAmoy,
}

console.log(process.env.REACT_APP_NODE_ENV)
export const chain = process.env.REACT_APP_NODE_ENV === "DEV" ? "80002" : "137"

export const createPublicClientLocal = () => {
  return createPublicClient({
    chain: chains[chain],
    transport: http(),
  })
}

export const createWalletClientLocal = () => {
  return createWalletClient({
    chain: chains[chain],
    transport: custom(window.ethereum),
  })
}

export const config = createConfig({
  chains: [polygon, polygonMumbai,polygonAmoy],
  transports: {
    [polygon.id]: http(),
    [polygonMumbai.id]: http(),
    [polygonAmoy.id]: http(),
  },
})
