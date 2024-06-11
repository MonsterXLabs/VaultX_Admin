import { useEffect, useState } from "react";
import FirstSection from "./FirstSection";
import SecondSection from "./SecondSection";
import ThirdSection from "./ThirdSection";
import FourthSection from "./FourthSection";
import Header from "../Header/Header";
import { HomepageServices } from "../../services/homepageServices";

function Homepage (props) {
    const [section,setSection] = useState(1);
    const [sectionData,setSectionData] = useState({});
    const nextSection = (value) => {
      setSection(value)
    }

    const getsectionData =()=>{
     const service= new HomepageServices()
     service.getSections().then(res=>{
      setSectionData(res.data)
     }).catch(err=>{
      console.log("Error in getting data",err)
     })
    }

    useEffect(()=>{
      getsectionData();
    },[])
    return <>
    {props.render}
    <section className="dashboard__area">
    <Header />
    <div className="dashboard__admin__area">
      <div className="admin__inner__blk">
        <div className="admin__content">
          <h4>Homepage &gt; Section {section}</h4>
        </div>
      </div>
    </div>
    <div className="categorie__btn mt-20">
      <a className={section === 1 ? "active" : ""} value={1} onClick={()=>nextSection(1)}>
        Section 1
      </a>
      <a className={section === 2 ? "active" : ""} value={2} onClick={()=>nextSection(2)}>Section 2</a>
      <a className={section === 3 ? "active" : ""} value={3} onClick={()=>nextSection(3)}>Section 3</a>
      <a className={section === 4 ? "active" : ""} value={4} onClick={()=>nextSection(4)}>Section 4</a>
    </div>
    {section === 1 ? <FirstSection data={sectionData}/> : section === 2 ? <SecondSection data={sectionData}/> : section === 3 ? <ThirdSection data={sectionData}/> : section === 4 ? <FourthSection data={sectionData}/> : <FirstSection />}
    </section>
  </>
  
}

export default Homepage;