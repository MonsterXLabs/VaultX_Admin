import {createPublicClient, createWalletClient, custom, http} from "viem"
import {polygon, polygonMumbai} from "viem/chains"
import {createConfig} from "wagmi"

export const chains = {
  137: polygon,
  80001: polygonMumbai,
}

console.log(process.env.REACT_APP_NODE_ENV)
export const chain = process.env.REACT_APP_NODE_ENV === "DEV" ? "80001" : "137"

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
  chains: [polygon, polygonMumbai],
  transports: {
    [polygon.id]: http(),
    [polygonMumbai.id]: http(),
  },
})
