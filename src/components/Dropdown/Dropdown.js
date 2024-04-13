import { useState } from "react";

function Dropdown (props) {
    const [open,setOpen] = useState(false);
    const close = (item) => {
        props.setValue(item)
        setOpen(false);
    }

    return <div className={open ? "nice-select open" : "nice-select"} onClick={()=>setOpen(!open)} tabIndex={0}>
    <span className="current">{props.value? props.value: props.data[0]}</span>
    <ul className="list">
        {props.data.map((item,key)=>{
            return <li data-value={key} className="option selected" onClick={() => close(item)}>
           {item}
            </li>
        })}
    </ul>
    </div>
}

export default Dropdown;