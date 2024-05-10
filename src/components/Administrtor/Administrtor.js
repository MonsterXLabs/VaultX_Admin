import { useState } from "react";
import List from "./List";
import Add from "./Add";
import Header from "../Header/Header";

function Administrtor(props) {
  const [mode, setMode] = useState("view");

  const [editValue, setEditValue] = useState({});

  const discard = () => {
    setEditValue({})
    setMode("view");
  };

  const handelEditAdnim = async (value) => {
    setEditValue(value);

    setMode("edit");

    // setTimeout(    setMode("edit"),500
    // )

  };
  return (
    <section className="dashboard__area">
      {props.render}
      <Header />
      <div className={mode === "view" ? "dashboard__admin__area" : "d-none"}>
        <div className="admin__inner__blk">
          <div className="admin__content">
            <h4>Administrator Management</h4>
            <div className="admin__inner__btn">
              <a
                href="#"
                className="common__btn"
                onClick={() => setMode("add")}
              >
                Add Administrator
              </a>
            </div>
          </div>
        </div>
      </div>
      {mode === "view" ? (
        <List handelEditAdnim={handelEditAdnim} />
      ) : mode === "add" || "edit" ? (
        <Add onCancel={discard} mode={mode} initialValue={editValue} />
      ) : (
        <List handelEditAdnim={handelEditAdnim} />
      )}
    </section>
  );
}

export default Administrtor;
