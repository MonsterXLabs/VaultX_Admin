import { useEffect, useState } from "react"
import { ConnectButton, useActiveAccount, useActiveWalletChain, useSwitchActiveWalletChain } from "thirdweb/react";
import { client } from "../../utils/client";
import { chain } from "../../utils/contract";
import { getItemWithExpiry } from "@/lib/utils";
const Header = () => {
  const activeChain = useActiveWalletChain();
  const switchChain = useSwitchActiveWalletChain();
  const [admin, setAdmin] = useState()
  useEffect(() => {
    const admin = getItemWithExpiry("admin")
    admin && setAdmin(JSON.parse(admin))
  }, [])

  useEffect(() => {

  })

  useEffect(() => {
    if (activeChain && activeChain.id !== chain.id) {
      switchChain(chain);
    }
  }, [activeChain]);
  return (
    <div className="dashboard__header__area ">
      <div className="sidebar__open__btn none__desk">
        <span />
        <span />
        <span />
      </div>
      {/* {!address ? <a role="button" className="common__btn" onClick={() => open()}>
        Connect Wallet
      </a>: <p className="address" onClick={() => disconnect()}>{trimString(address)}</p>} */}
      <ConnectButton
        client={client}
        className={"common_btn"}
        appMetadata={{
          name: "Monster App",
          url: "https://tadmin.vault-x.io",
        }}
      />
      <div className="header__super__admin">
        <h5>
          {admin?.name}{" "}
          <span>
            <i className="far fa-angle-down" />
          </span>
        </h5>
        <p>{admin?.role === "MASTER" ? "Super Admin" : "Admin"}</p>
      </div>
    </div>
  )
}

export default Header
