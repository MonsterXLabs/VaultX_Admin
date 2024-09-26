import { useState } from "react";
import FeeHistory from "./FeeHistory";
import FeeSettings from "./FeeSettings";
import Header from "../Header/Header";

function Fee(props) {
  const [active, setActive] = useState(1);
  return <section className="dashboard__area">
    {props.render}
    <Header />
    <div className="dashboard__admin__area">
      <div className="admin__inner__blk">
        <div className="admin__content">
          <h4>Marketplace Fee Management</h4>
        </div>
        <div className="marketplace_ico">
          <a>
            <img src="assets/img/Base.svg" alt="" />
          </a>
        </div>
        <div className="categorie__btn">
          <a className={active === 1 ? "active" : ""} onClick={() => setActive(1)}>
            History
          </a>
          <a className={active === 2 ? "active" : ""} onClick={() => setActive(2)}>Setting</a>
        </div>
        {active === 1 ? <FeeHistory /> : <FeeSettings />}
      </div>
    </div>
  </section>

}

export default Fee;