import { useWeb3Modal } from "@web3modal/wagmi/react"
import {useEffect, useState} from "react"
import { useAccount, useDisconnect } from "wagmi"
import {trimString} from "../../utils/helpers"

const Header = () => {
  const {open} = useWeb3Modal()
  const {address} = useAccount()
  const { disconnect } = useDisconnect()
  const [admin, setAdmin] = useState()
  useEffect(() => {
    const admin = localStorage.getItem("admin")
    admin && setAdmin(JSON.parse(admin))
  }, [])
  return (
    <div className="dashboard__header__area ">
      <div className="sidebar__open__btn none__desk">
        <span />
        <span />
        <span />
      </div>
     {!address ? <a role="button" className="common__btn" onClick={() => open()}>
        Connect Wallet
      </a>: <p className="address" onClick={() => disconnect()}>{trimString(address)}</p>}
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
