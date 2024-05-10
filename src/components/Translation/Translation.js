import Header from "../Header/Header";

function Translation (props) {
    return <>
    <section className="dashboard__sidebar desk__sidebar pt-30">
        {props.render}
      <div className="dashboard__menu">
        <nav>
          <ul>
            <li>
              <a href="#">
                <span>
                  <img src="assets/img/sidebar_ico_1.svg" alt="" />
                </span>
                Dashboard
              </a>
            </li>
            <li>
              <a href="#">
                <span>
                  <img src="assets/img/sidebar_ico_2.svg" alt="" />
                </span>{" "}
                Homepage
              </a>
            </li>
            <li className="bottom__border">
              <a href="#">
                <span>
                  <img src="assets/img/sidebar_ico_3.svg" alt="" />
                </span>
                Banner
              </a>
            </li>
            <li>
              <a href="#">
                <span>
                  <img src="assets/img/sidebar_ico_4.svg" alt="" />
                </span>{" "}
                Order
              </a>
            </li>
            <li>
              <a href="#">
                <span>
                  <img src="assets/img/sidebar_ico_5.svg" alt="" />
                </span>{" "}
                User
              </a>
            </li>
            <li>
              <a href="#">
                <span>
                  <img src="assets/img/sidebar_ico_6.svg" alt="" />
                </span>{" "}
                NFTs
              </a>
            </li>
            <li>
              <a href="#">
                <span>
                  <img src="assets/img/sidebar_ico_7.svg" alt="" />
                </span>{" "}
                Curation
              </a>
            </li>
            <li className="bottom__border">
              <a href="#">
                <span>
                  <img src="assets/img/sidebar_ico_8.svg" alt="" />
                </span>
                Category
              </a>
            </li>
            <li>
              <a href="#">
                <span>
                  <img src="assets/img/sidebar_ico_9.svg" alt="" />
                </span>{" "}
                Fee
              </a>
            </li>
            <li>
              <a href="#">
                <span>
                  <img src="assets/img/sidebar_ico_10.svg" alt="" />
                </span>{" "}
                Tool Tip
              </a>
            </li>
            <li className="active">
              <a href="#">
                <span>
                  <img src="assets/img/sidebar_ico_11.svg" alt="" />
                </span>{" "}
                Translation
              </a>
            </li>
            <li>
              <a href="#">
                <span>
                  <img src="assets/img/sidebar_ico_12.svg" alt="" />
                </span>{" "}
                Network
              </a>
            </li>
            <li className="bottom__border">
              <a href="#">
                <span>
                  <img src="assets/img/sidebar_ico_13.svg" alt="" />
                </span>
                Administrator
              </a>
            </li>
            <li>
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
    {/* =================== DASHBOARD BODY AREA START ===================== */}
    <section className="dashboard__area">
    <Header />
      <div className="dashboard__admin__area">
        <div className="admin__inner__blk">
          <div className="admin__content flex_admin_content">
            <h4>Translation</h4>
            <a
              data-bs-toggle="modal"
              href="#exampleModalToggle"
              role="button"
              className="common__btn"
            >
              New Language
            </a>
          </div>
        </div>
      </div>
      <div className="categorie__btn mt-20">
        <a className="active" href="#">
          English
        </a>
        <a href="#">Korean</a>
      </div>
      <div className="translation__filter__wrapper">
        <form action="#">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="translation__single__blk">
                <label htmlFor="#">Filter</label>
                <input type="text" placeholder="Filter" />
              </div>
              <div className="translation__single__blk">
                <label htmlFor="#">Clear All</label>
                <input type="text" placeholder="Clear All" />
              </div>
              <div className="translation__single__blk">
                <label htmlFor="#">Select An Option</label>
                <input type="text" placeholder="Select  An Option" />
              </div>
              <div className="translation__single__blk">
                <label htmlFor="#">Price Low to High</label>
                <input type="text" placeholder="Price Low to High" />
              </div>
              <div className="translation__single__blk">
                <label htmlFor="#">Floor</label>
                <input type="text" placeholder="Floor" />
              </div>
              <div className="translation__single__blk">
                <label htmlFor="#">Floor Change</label>
                <input type="text" placeholder="Floor Change" />
              </div>
              <div className="translation__single__blk">
                <label htmlFor="#">Total Volume</label>
                <input type="text" placeholder="Total Volume" />
              </div>
              <div className="translation__single__blk">
                <label htmlFor="#">Blockchain</label>
                <input type="text" placeholder="Blockchain" />
              </div>
              <div className="translation__single__blk">
                <label htmlFor="#">Choose Contract Standard</label>
                <input type="text" placeholder="Choose Contract Standard" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="translation__single__blk">
                <label htmlFor="#">Reset Filter</label>
                <input type="text" placeholder="Reset Filter" />
              </div>
              <div className="translation__single__blk">
                <label htmlFor="#">Search by NFTs</label>
                <input type="text" placeholder="Search by NFTs" />
              </div>
              <div className="translation__single__blk">
                <label htmlFor="#">Price Hight to Low</label>
                <input type="text" placeholder="Price Hight to Low" />
              </div>
              <div className="translation__single__blk">
                <label htmlFor="#">Chains</label>
                <input type="text" placeholder="Chains" />
              </div>
              <div className="translation__single__blk">
                <label htmlFor="#">Floor Price</label>
                <input type="text" placeholder="Floor Price" />
              </div>
              <div className="translation__single__blk">
                <label htmlFor="#">Volume</label>
                <input type="text" placeholder="Volume" />
              </div>
              <div className="translation__single__blk">
                <label htmlFor="#">Volume Change</label>
                <input type="text" placeholder="Volume Change" />
              </div>
              <div className="translation__single__blk">
                <label htmlFor="#">Choose blockchain</label>
                <input type="text" placeholder="Choose blockchain" />
              </div>
              <div className="translation__single__blk">
                <label htmlFor="#">Address</label>
                <input type="text" placeholder="Address" />
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
    {/* =================== DASHBOARD BODY AREA END ===================== */}
    <div
      className="modal fade common__popup__blk"
      id="exampleModalToggle"
      aria-hidden="true"
      aria-labelledby="exampleModalToggleLabel"
      tabIndex={-1}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body similar__site__popup">
            <div className="popup__inner__blk">
              <div className="popup__common__title add_border_title">
                <h4>Add Langauge</h4>
              </div>
              <div className="popup__similar__form">
                <div className="single__popup__input">
                  <label htmlFor="#">Language*</label>
                  <input type="text" placeholder="English" />
                </div>
                <div className="popup__similar__btn">
                  <div className="edit__profile__bottom__btn">
                    <a href="#">Confirm</a>
                    <a href="#" className="cancel">
                      Cancel
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  
}

export default Translation;