import { useState } from "react";
import Media from "./Media";
import Banner from "./Banner";
import Header from "../Header/Header";

function MediaImage (props) {
    const [section,setSection] = useState(1);
    return <section className="dashboard__area">
        {props.render}
        <Header />
    <div className="dashboard__admin__area">
      <div className="admin__inner__blk">
        <div className="admin__content">
          <h4>Media Image &gt; {section==1 ?"Banner":"Media"}</h4>
        </div>
      </div>
    </div>
    <div className="categorie__btn mt-20">
      <a className={section === 1 ? "active" : ""} onClick={()=>setSection(1)}>
        Banner
      </a>
      <a className={section === 2 ? "active" : ""} onClick={()=>setSection(2)}>Media</a>
    </div>
    {section === 1 ? <Banner /> : <Media />}
  </section>
  
}

export default MediaImage;