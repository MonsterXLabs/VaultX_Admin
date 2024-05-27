import { useState } from "react";
import Unresolved from "./Unresolved";
import Solved from "./Solved";
import Reject from "./Reject";

import Header from "../Header/Header";

function Arbitration(props) {
  const [active, setActive] = useState(1);
  return (
    <section className="dashboard__area">
      {props.render}
      <Header />
      <div className="dashboard__admin__area">
        <div className="admin__inner__blk">
          <div className="admin__content">
            <h4>Arbitration</h4>
          </div>
          <div className="categorie__btn">
            <a
              className={active === 1 ? "active" : ""}
              onClick={() => setActive(1)}
            >
              Unresolved
            </a>
            <a
              className={active === 2 ? "active" : ""}
              onClick={() => setActive(2)}
            >
              Solved
            </a>
            <a
              className={active === 3 ? "active" : ""}
              onClick={() => setActive(3)}
            >
              Reject
            </a>
          </div>
          {active===1 && <Unresolved />}
          {active===2 && <Solved />}
          {active===3 && <Reject />}
        </div>
      </div>
    </section>
  );
}

export default Arbitration;
