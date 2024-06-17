import Header from "../Header/Header"
import {address} from "../../utils/contract";

function Networks (props) {
    return <section className="dashboard__area">
        {props.render}
      <Header />
    <div className="dashboard__admin__area">
      <div className="admin__inner__blk">
        <div className="admin__content">
          <h4>Network information</h4>
        </div>
      </div>
    </div>
    <div className="categorie__btn mt-20">
      <a className="active" href="#">
        Polygon
      </a>
      {/* <a href="#">Ethereum</a> */}
    </div>
    <div className="common__edit__proe__wrap mt-50">
      <div className="edit__profilfile__inner__top__blk">
        <div className="edit__profile__inner__title">
          <h5>Blockchain Network</h5>
        </div>
        {/* <div className="update__btn">
          <a href="#" className="common__btn">
            Update
          </a>
        </div> */}
      </div>
      <div className="network__text__area">
        <p>
          Network Name <span>Polygon</span>
        </p>
        <p>
          Chain ID <span>137</span>
        </p>
        <p>
          Symbol <span>MATIC</span>
        </p>
        <p>
          Rpc <span>https://polygon-rpc.com</span>
        </p>
        <p>
          Blockchain Explorer URL <span>Https://Polygonscan.Com/</span>
        </p>
        <p>
          Server IP (For Nodejs Server) <span>Localhost</span>
        </p>
        <p>
          Port (For Nodejs Server) <span>81</span>
        </p>
      </div>
    </div>
    <div className="common__edit__proe__wrap mt-20">
      <div className="edit__profilfile__inner__top__blk">
        <div className="edit__profile__inner__title">
          <h5>Marketplace Contract Information</h5>
        </div>
        {/* <div className="update__btn">
          <a href="#" className="common__btn">
            Update
          </a>
        </div> */}
      </div>
      <div className="network__text__area">
        <p>
          Marketplace Contract Address{" "}
          <span>{address}</span>
        </p>
        <p>
          Escrow Contract Address <span>--</span>
        </p>
        <p>
          Auction Contract Address <span>--</span>
        </p>
        <p>
          ERC/BEP-20 <span>--</span>
        </p>
        <p>
          ERC1155 <span>--</span>
        </p>
      </div>
    </div>
    <div className="common__edit__proe__wrap mt-20">
      <div className="edit__profilfile__inner__top__blk">
        <div className="edit__profile__inner__title">
          <h5>Infura</h5>
        </div>
        {/* <div className="update__btn">
          <a href="#" className="common__btn">
            Update
          </a>
        </div> */}
      </div>
      <div className="network__text__area">
        <p>
          Infura Project ID <span>2DLvnnpRA94jHWViVIhxFuhehva</span>
        </p>
        <p>
          Infura Project Secret <span>ca862a81944280af8bce6e2dc8763148</span>
        </p>
      </div>
    </div>
    {/* <div className="edit__profile__bottom__btn half__width__btn">
      <a href="#" className="cancel">
        Discard
      </a>
      <a href="#">
        Next{" "}
        <span>
          <img src="assets/img/arrow_ico.svg" alt="" />
        </span>
      </a>
    </div> */}
  </section>
  
}

export default Networks