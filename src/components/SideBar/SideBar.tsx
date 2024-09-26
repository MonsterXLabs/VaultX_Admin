import { useState, useEffect } from "react";

interface SideBarProps {
  onButtonClick: (tab: string) => void;
  activeTab: string;
  onLogout: (tab: string) => void;
}

const SideBar: React.FC<SideBarProps> = ({ onButtonClick, activeTab, onLogout }) => {
  const [active, setActive] = useState<string>(activeTab);

  useEffect(() => {
    setActive(activeTab);
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    onLogout('login');
  };

  const handleButtonClick = (tab: string) => {
    setActive(tab);
    onButtonClick(tab);
  };

  return (
    <>
      {/* =================== DASHBOARD AREA START ===================== */}
      <section className="dashboard__sidebar desk__sidebar pt-30">
        <div className="dashboard__menu">
          <nav>
            <ul>
              <li className={active === 'dashboard' ? "active" : ''} onClick={() => handleButtonClick('dashboard')}>
                <a href="#">
                  <span>
                    <img src="assets/img/sidebar_ico_1.svg" alt="" />
                  </span>
                  Dashboard
                </a>
              </li>
              <li className={active === 'homepage' ? "active" : ''} onClick={() => handleButtonClick('homepage')}>
                <a href="#">
                  <span>
                    <img src="assets/img/sidebar_ico_2.svg" alt="" />
                  </span>
                  Homepage
                </a>
              </li>
              <li className={active === 'mediaimage' ? "active bottom__border" : 'bottom__border'} onClick={() => handleButtonClick('mediaimage')}>
                <a href="#">
                  <span>
                    <img src="assets/img/sidebar_ico_3.svg" alt="" />
                  </span>
                  Media Image
                </a>
              </li>
              <li className={active === 'order' ? "active" : ''} onClick={() => handleButtonClick('order')}>
                <a href="#">
                  <span>
                    <img src="assets/img/sidebar_ico_4.svg" alt="" />
                  </span>
                  Order
                </a>
              </li>
              <li className={active === 'arbitration' ? "active" : ''} onClick={() => handleButtonClick('arbitration')}>
                <a href="#">
                  <span>
                    <img src="assets/img/sidebar_ico_15.svg" alt="" />
                  </span>
                  Arbitration
                </a>
              </li>
              <li className={active === 'user' ? "active" : ''} onClick={() => handleButtonClick('user')}>
                <a href="#">
                  <span>
                    <img src="assets/img/sidebar_ico_5.svg" alt="" />
                  </span>
                  User
                </a>
              </li>
              <li className={active === 'nfts' ? "active" : ''} onClick={() => handleButtonClick('nfts')}>
                <a href="#">
                  <span>
                    <img src="assets/img/sidebar_ico_6.svg" alt="" />
                  </span>
                  NFTs
                </a>
              </li>
              <li className={active === 'curation' ? "active" : ''} onClick={() => handleButtonClick('curation')}>
                <a href="#">
                  <span>
                    <img src="assets/img/sidebar_ico_7.svg" alt="" />
                  </span>
                  Curation
                </a>
              </li>
              <li className={active === 'category' ? "active bottom__border" : 'bottom__border'} onClick={() => handleButtonClick('category')}>
                <a href="#">
                  <span>
                    <img src="assets/img/sidebar_ico_8.svg" alt="" />
                  </span>
                  Category
                </a>
              </li>
              <li className={active === 'fee' ? "active" : ''} onClick={() => handleButtonClick('fee')}>
                <a href="#">
                  <span>
                    <img src="assets/img/sidebar_ico_9.svg" alt="" />
                  </span>
                  Fee
                </a>
              </li>
              <li className={active === 'tooltip' ? "active" : ''} onClick={() => handleButtonClick('tooltip')}>
                <a href="#">
                  <span>
                    <img src="assets/img/sidebar_ico_10.svg" alt="" />
                  </span>
                  Tool Tip
                </a>
              </li>
              <li className={active === 'translation' ? "active" : ''} onClick={() => handleButtonClick('translation')}>
                <a href="#">
                  <span>
                    <img src="assets/img/sidebar_ico_11.svg" alt="" />
                  </span>
                  Translation
                </a>
              </li>
              <li className={active === 'networks' ? "active" : ''} onClick={() => handleButtonClick('networks')}>
                <a href="#">
                  <span>
                    <img src="assets/img/sidebar_ico_12.svg" alt="" />
                  </span>
                  Network
                </a>
              </li>
              <li className={active === 'administrator' ? "active bottom__border" : 'bottom__border'} onClick={() => handleButtonClick('administrator')}>
                <a href="#">
                  <span>
                    <img src="assets/img/sidebar_ico_13.svg" alt="" />
                  </span>
                  Administrator
                </a>
              </li>
              <li className={active === 'mint' ? "active bottom__border" : 'bottom__border'} onClick={() => handleButtonClick('mint')}>
                <a href="#" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'black',
                  background: '#DDF247'
                }}>
                  Mint
                </a>
              </li>
              <li onClick={handleLogout}>
                <a href="#">
                  <span>
                    <img src="assets/img/sidebar_ico_14.svg" alt="" />
                  </span>
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
  );
};

export default SideBar;
