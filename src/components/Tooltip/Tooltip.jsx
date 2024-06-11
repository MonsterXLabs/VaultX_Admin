import Header from "../Header/Header";

function Tooltip (props) {
    return <section className="dashboard__area">
        {props.render}
        <Header />
    <div className="dashboard__admin__area">
      <div className="admin__inner__blk">
        <div className="admin__content flex_admin_content">
          <h4>Tooltip</h4>
        </div>
      </div>
    </div>
    <div className="categorie__btn mt-20">
      <a className="active" href="#">
        English
      </a>
      <a href="#">Korean</a>
    </div>
    <div className="translation__filter__wrapper translation__filter__switch__area">
      <form action="#">
        <div className="row g-4">
          <div className="col-md-6">
            <div className="translation_switch_with_input">
              <div className="translation__single__blk">
                <label htmlFor="#">Filter</label>
                <div className="nft__switch">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="flexSwitchCheckChecked"
                      defaultChecked=""
                    />
                  </div>
                </div>
              </div>
              <div className="translation__single__blk mt-0 translation_different_input">
                <input type="text" placeholder="Filter" />
              </div>
            </div>
            <div className="translation__single__blk">
              <label htmlFor="#">Clear All</label>
              <div className="nft__switch">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckChecked"
                    defaultChecked=""
                  />
                </div>
              </div>
            </div>
            <div className="translation__single__blk">
              <label htmlFor="#">Select An Option</label>
              <div className="nft__switch">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckChecked"
                    defaultChecked=""
                  />
                </div>
              </div>
            </div>
            <div className="translation__single__blk">
              <label htmlFor="#">Price Low to High</label>
              <div className="nft__switch">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckChecked"
                    defaultChecked=""
                  />
                </div>
              </div>
            </div>
            <div className="translation__single__blk">
              <label htmlFor="#">Floor</label>
              <div className="nft__switch">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckChecked"
                    defaultChecked=""
                  />
                </div>
              </div>
            </div>
            <div className="translation__single__blk">
              <label htmlFor="#">Floor Change</label>
              <div className="nft__switch">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckChecked"
                    defaultChecked=""
                  />
                </div>
              </div>
            </div>
            <div className="translation__single__blk">
              <label htmlFor="#">Total Volume</label>
              <div className="nft__switch">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckChecked"
                    defaultChecked=""
                  />
                </div>
              </div>
            </div>
            <div className="translation__single__blk">
              <label htmlFor="#">Blockchain</label>
              <div className="nft__switch">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckChecked"
                    defaultChecked=""
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="translation__single__blk">
              <label htmlFor="#">Reset Filter</label>
              <div className="nft__switch">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckChecked"
                    defaultChecked=""
                  />
                </div>
              </div>
            </div>
            <div className="translation__single__blk">
              <label htmlFor="#">Search by NFTs</label>
              <div className="nft__switch">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckChecked"
                    defaultChecked=""
                  />
                </div>
              </div>
            </div>
            <div className="translation__single__blk">
              <label htmlFor="#">Price Hight to Low</label>
              <div className="nft__switch">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckChecked"
                    defaultChecked=""
                  />
                </div>
              </div>
            </div>
            <div className="translation__single__blk">
              <label htmlFor="#">Chains</label>
              <div className="nft__switch">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckChecked"
                    defaultChecked=""
                  />
                </div>
              </div>
            </div>
            <div className="translation__single__blk">
              <label htmlFor="#">Floor Price</label>
              <div className="nft__switch">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckChecked"
                    defaultChecked=""
                  />
                </div>
              </div>
            </div>
            <div className="translation__single__blk">
              <label htmlFor="#">Volume</label>
              <div className="nft__switch">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckChecked"
                    defaultChecked=""
                  />
                </div>
              </div>
            </div>
            <div className="translation__single__blk">
              <label htmlFor="#">Volume Change</label>
              <div className="nft__switch">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckChecked"
                    defaultChecked=""
                  />
                </div>
              </div>
            </div>
            <div className="translation__single__blk">
              <label htmlFor="#">Choose blockchain</label>
              <div className="nft__switch">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckChecked"
                    defaultChecked=""
                  />
                </div>
              </div>
            </div>
            <div className="translation__single__blk">
              <label htmlFor="#">Address</label>
              <div className="nft__switch">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckChecked"
                    defaultChecked=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </section>
  
}

export default Tooltip;