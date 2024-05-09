import { useEffect, useState } from "react"
import OwlCarousel from "react-owl-carousel"
import { NftCategoryServices } from "../../services/nftServices"
import { HomepageServices } from "../../services/homepageService"

/**
 *
 * @param {number} arrLen
 */
export const createArr = arrLen => {
  return new Array(arrLen).fill("")
}

function SecondSection(props) {
  const [main, setMain] = useState({
    title: "",
    description: "",
  })
  const [active, setActive] = useState(4)
  const [dataArr, setDataArr] = useState([])
  const [nfts, setNfts] = useState([])
  const [updated, setUpdated] = useState(true)
  const options = {
    loop: true,
    margin: 10,
    nav: false,
    dot: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      },
    },
  }

  /**
   * @param {import("react").ChangeEvent<HTMLInputElement>} e
   *
   * @returns {void}
   */
  const handleChange = e => {
    const { name, value } = e.target
    setMain({ ...main, [name]: value })
  }

  /**
   * @param {import("react").ChangeEvent<HTMLInputElement>} e
   * @param {number} idx
   *
   * @returns {void}
   */
  const handleChangeData = async (e, idx) => {
    try {
      const { value } = e.target
      const tempArr = [...dataArr]
      tempArr[idx] = value
      setDataArr([...tempArr])
      const nftService = new NftCategoryServices()
      const {
        data: { nft },
      } = await nftService.getNftById(value.split("/")[5])
      const tempNfts = [...nfts]
      tempNfts[idx] = nft
      setNfts([...tempNfts])
      setUpdated(!updated)
    } catch (error) {
      console.log({ error })
    }
  }

  useEffect(() => {
    console.log(nfts)
  }, [nfts])

  const cancel = () => {
    setMain({
      title: "",
      description: "",
    })
    setDataArr([])
  }

  const saveData = async () => {
    try {
      const homepageService = new HomepageServices()
      const data = {
        title: main.title,
        description: main.description,
        numberOfBox: active,
        box: dataArr,
      }
      await homepageService.addSection2(data)
    } catch (error) {
      console.log({ error })
    }
  }

  useEffect(() => {
    let tempArr=[...dataArr]
    if(tempArr.length==4){
      let arr = createArr(4)
      setDataArr([...tempArr,...arr])
    }
    else{
      setDataArr(tempArr.slice(0,tempArr.length-4))
    }
  }, [active])

  useEffect(() => {
    setMain({
      title: props.data.section2?.title,
      description: props.data.section2?.description
    })
    let tempBox = [...props.data.section2?.box]
    console.log('tmpbx', tempBox)
    setDataArr([...tempBox])
    const tempNfts = [...nfts]
    const nftService = new NftCategoryServices()

    // for (let i = 0; i < tempBox.length; i++) {
    //   // console.log('item', tempBox[i])
    //   nftService.getNftById(tempBox[i].split("/")[5]).then(res => {
    //     // console.log('item-nft'+i, res.data.nft)
    //     tempNfts[i]=res.data.nft
    //   })
    // }
    Promise.all(tempBox.map(async (item) => {
      const {
        data: { nft },
      } = await nftService.getNftById(item.split("/")[5])
      return nft
  })).then((resolvedNfts) => {
      console.log('Resolved NFTs', resolvedNfts)
      setNfts(resolvedNfts)
      setUpdated(!updated)
  }).catch((error) => {
      console.error('Error fetching NFTs', error)
  })
    
    console.log('nnnn',tempNfts)
    setUpdated(!updated)
  }, [props])
  return (
    <>
      <div className="number_of_box_blk">
        <h4>Number of Boxes:</h4>
        <div className="number_of_box">
          <a
            className={active === 4 && "active"}
            onClick={() => setActive(4)}
            href="#"
          >
            4
          </a>
          <a
            className={active === 8 && "active"}
            onClick={() => setActive(8)}
            href="#"
          >
            8
          </a>
        </div>
      </div>
      <div className="bg_less__form mt-20">
        <div className="row gy-4 gx-3">
          <div className="col-xl-6">
            <div className="single__edit__profile__step link__input">
              <label htmlFor="#">Section Main Title</label>
              <input
                className="border-0"
                type="text"
                placeholder="Please write the title..."
                name="title"
                value={main.title}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-xl-12">
            <div className="single__edit__profile__step link__input">
              <label htmlFor="#">Section Main Description </label>
              <textarea
                placeholder="Please write the description..."
                id=""
                cols={30}
                rows={10}
                defaultValue={""}
                name="description"
                value={main.description}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="hmepage__title">
        <h5>Section 2 Box Content</h5>
      </div>
      <div className="common__edit__blks">
        <div className="row g-4">
          {dataArr.map((item, idx) => (
            <div key={idx} className="col-lg-6">
              <div className="common__edit__proe__wrap">
                <div className="edit__profilfile__inner__top__blk">
                  <div className="edit__profile__inner__title">
                    <h5>Box {idx + 1}</h5>
                  </div>
                </div>
                <div className="single__edit__profile__step link__input">
                  <label htmlFor="#">Link</label>
                  <input
                    type="text"
                    placeholder="Please write the link"
                    value={item}
                    onChange={e => handleChangeData(e, idx)}
                  />
                  <button className="link_ico" type="button">
                    <img src="assets/img/link_ico.svg" alt="" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="selection__area">
        <div className="selection__content">
          <h5>
            Section 2 Box Contents (Automatic Selection){" "}
            <span>
              *When using this function, the above manual input is not applied
            </span>
          </h5>
          <div className="nft__single__switch__box">
            <div className="nft__switch__text">
              <h3>Would you like to autoselect?</h3>
            </div>
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
          <div className="selection__checkbox">
            <div className="single__selection__checkbox">
              <p>Highest Views of the week</p>
              <div className="codeplay-ck">
                <label className="container-ck">
                  <input type="checkbox" defaultChecked="checked" />
                  <span className="checkmark" />
                </label>
              </div>
            </div>
            <div className="single__selection__checkbox">
              <p>Best likes of the week</p>
              <div className="codeplay-ck">
                <label className="container-ck">
                  <input type="checkbox" defaultChecked="checked" />
                  <span className="checkmark" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="edit__profile__bottom__btn half__width__btn">
        <a href="#" className="cancel" onClick={cancel}>
          Discard
        </a>
        <a
          data-bs-toggle="modal"
          href="#exampleModalToggle"
          role="button"
          onClick={saveData}
        >
          Next
        </a>
      </div>
      {/* =================== DASHBOARD BODY AREA END ===================== */}
      <div
        className="modal fade common__popup__blk"
        id="exampleModalToggle"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex={-1}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ maxWidth: 1446 }}
        >
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <span
                className="close_modal close_center"
                data-bs-dismiss="modal"
              >
                <i className="far fa-times" />
              </span>
              <div className="sport__area">
                <div className="container">
                  <div className="sport__title">
                    <div className="section__title m-0">
                      <h3 className="m-0">
                        Spotlight in <span>{main?.title}</span>
                      </h3>
                    </div>
                    <div className="discover__btn">
                      <a href="#">
                        Discover more{" "}
                        <span>
                          <i className="far fa-long-arrow-right" />
                        </span>
                      </a>
                    </div>
                  </div>
                  <div className="nft_carousel">
                    <div className="nft_carousel_conatiner">

                      {nfts.map((value, index) => (
                        
                        <div
                          key={index}
                          data-index={index}
                          className="single__sport__blk carousel_card"
                        >
                          <div className="sport__thumb">
                            <img
                              className="nft_image_custom"
                              src={
                                value?.cloudinaryUrl
                                  ? value?.cloudinaryUrl
                                  : "assets/img/spot_thumb_1.png"
                              }
                              alt=""
                            />
                          </div>
                          <div className="sport__content">
                            <h5>{value?.name}</h5>
                            <p>
                              Created by: <span>{value?.owner?.username}</span>
                            </p>
                            <p>
                              {value?.curation?.name} <span />
                            </p>
                            <h4>
                              Price{" "}
                              <span>
                                <img src="assets/img/compas.svg" alt="" />{" "}
                                {value?.price}
                                MATIC
                              </span>
                            </h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="sport__dts__ico">
                  <img src="assets/img/Dots.svg" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SecondSection
