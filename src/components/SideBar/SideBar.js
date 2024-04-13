import { useState } from "react";

function SideBar ({onButtonClick,activeTab,onLogout}) {
    const [active,setActive] = useState(activeTab);
    const handleLogout = () => {
      localStorage.setItem('isLoggedIn',false);
      localStorage.removeItem("token")
      localStorage.removeItem("admin")
      onLogout('login')
    }
    return <>{/* =================== DASHBOARD AREA START ===================== */}
    <section className="dashboard__sidebar desk__sidebar pt-30">
      <div className="dashboard__menu">
        <nav>
          <ul>
            <li className={active === 'dashboard' ? "active" : ''} onClick={()=>onButtonClick('dashboard')}>
              <a href="#">
                <span>
                  <img src="assets/img/sidebar_ico_1.svg" alt="" />
                </span>
                Dashboard
              </a>
            </li>
            <li className={active === 'homepage' ? "active" : ''} onClick={()=>onButtonClick('homepage')}>
              <a href="#">
                <span>
                  <img src="assets/img/sidebar_ico_2.svg" alt="" />
                </span>{" "}
                Homepage
              </a>
            </li>
            <li className={active === 'mediaimage' ? "active bottom__border" : 'bottom__border'} onClick={()=>onButtonClick('mediaimage')}>
              <a href="#">
                <span>
                  <img src="assets/img/sidebar_ico_3.svg" alt="" />
                </span>{" "}
                Media Image
              </a>
            </li>
            <li className={active === 'order' ? "active" : ''} onClick={()=>onButtonClick('order')}>
              <a href="#">
                <span>
                  <img src="assets/img/sidebar_ico_4.svg" alt="" />
                </span>{" "}
                Order
              </a>
            </li>
            <li className={active === 'user' ? "active" : ''} onClick={()=>onButtonClick('user')}>
              <a href="#">
                <span>
                  <img src="assets/img/sidebar_ico_5.svg" alt="" />
                </span>{" "}
                User
              </a>
            </li>
            <li className={active === 'nfts' ? "active" : ''} onClick={()=>onButtonClick('nfts')}>
              <a href="#">
                <span>
                  <img src="assets/img/sidebar_ico_6.svg" alt="" />
                </span>{" "}
                NFTs
              </a>
            </li>
            <li className={active === 'curation' ? "active" : ''} onClick={()=>onButtonClick('curation')}>
              <a href="#">
                <span>
                  <img src="assets/img/sidebar_ico_7.svg" alt="" />
                </span>{" "}
                Curation
              </a>
            </li>
            <li className={active === 'category' ? "active bottom__border" : 'bottom__border'} onClick={()=>onButtonClick('category')}>
              <a href="#">
                <span>
                  <img src="assets/img/sidebar_ico_8.svg" alt="" />
                </span>{" "}
                Category
              </a>
            </li>
            <li className={active === 'fee' ? "active" : ''} onClick={()=>onButtonClick('fee')}>
              <a href="#">
                <span>
                  <img src="assets/img/sidebar_ico_9.svg" alt="" />
                </span>{" "}
                Fee
              </a>
            </li>
            <li className={active === 'tooltip' ? "active" : ''} onClick={()=>onButtonClick('tooltip')}>
              <a href="#">
                <span>
                  <img src="assets/img/sidebar_ico_10.svg" alt="" />
                </span>{" "}
                Tool Tip
              </a>
            </li>
            <li className={active === 'translation' ? "active" : ''} onClick={()=>onButtonClick('translation')}>
              <a href="#">
                <span>
                  <img src="assets/img/sidebar_ico_11.svg" alt="" />
                </span>{" "}
                Translation
              </a>
            </li>
            <li className={active === 'networks' ? "active" : ''} onClick={()=>onButtonClick('networks')}>
              <a href="#">
                <span>
                  <img src="assets/img/sidebar_ico_12.svg" alt="" />
                </span>{" "}
                Network
              </a>
            </li>
            <li className={active === 'administrator' ? "active bottom__border" : 'bottom__border'} onClick={()=>onButtonClick('administrator')}>
              <a href="#">
                <span>
                  <img src="assets/img/sidebar_ico_13.svg" alt="" />
                </span>{" "}
                Administrator
              </a>
            </li>
            <li onClick={()=>handleLogout()}>
              <a href="#">
                <span>
                  <img src="assets/img/sidebar_ico_14.svg" alt="" />
                </span>{" "}
                Log Out
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </section>
    <div className="overlay" />
    {/* =================== DASHBOARD AREA END ===================== */}
    </> 
}

export default SideBar;