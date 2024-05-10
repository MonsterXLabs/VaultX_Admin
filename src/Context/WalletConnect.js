import { createContext, useState } from "react"
import { createWeb3Modal } from "@web3modal/wagmi/react"
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config"
import { WagmiProvider } from "wagmi";
import {polygon} from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

const projectId = "cc7204248baa9711fe943f0e9a4eb47c"

const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
}

const chains = [polygon]
const config = defaultWagmiConfig({
  chains, // required
  projectId, // required
  metadata, // required
})

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
})

export const WalletContext = createContext(null)

export function WalletContextProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [sidebar, setSidebar] = useState(false)

  // const getUser = async () => {
  //  try {
  //   const {
  //     data: { user },
  //   } = await userServices.getSingleUser()
  //   setUser(user)
  //  } catch (error) {
  //   console.log({ error })
  //  }
  // }

  return (
    <WalletContext.Provider
      value={{
        isLoggedIn,
        user,
        sidebar,
        setSidebar,
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </WalletContext.Provider>
  )
}
