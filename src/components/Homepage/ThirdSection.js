import {useEffect, useState} from "react"
import {createArr} from "./SecondSection"
import {CreateCurationServices} from "../../services/curationServices"
import {HomepageServices} from "../../services/homepageService"

function ThirdSection(props) {
  const [active, setActive] = useState(2)
  const [dataArr, setDataArr] = useState([])
  const [curations, setCurations] = useState([])

  const [main, setMain] = useState({
    color: [],
    title: "",
    description: "",
  })
  const [word, setWord] = useState(1)
  const [activeColor, setActiveColor] = useState("")

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
      const {value} = e.target
      const tempArr = [...dataArr]
      tempArr[idx] = value
      setDataArr([...tempArr])
      const curationService = new CreateCurationServices()
      const {
        data: {collection},
      } = await curationService.getAllCollectionByID(value?.split("/")[5])
      const tempCurations = [...curations]
      tempCurations[idx] = collection
      setCurations([...tempCurations])
    } catch (error) {
      console.log(error)
    }
  }

  const cancel = () => {
    setActive(4)
    setDataArr([])
    setCurations([])
  }

  useEffect(() => {
    if (word && activeColor) {
      const wordExists = main.color.find((item) => item.word === word);
      if (wordExists) {
        const tempArr = main.color.map((item) => {
          if (item.word === word) {
            return {
              word,
              color: activeColor,
            };
          } else {
            return item;
          }
        });
        setMain({ ...main, color: tempArr });
      } else {
        setMain({
          ...main,
          color: [...main.color, { word, color: activeColor }],
        });
      }
    }
  }, [word, activeColor]);

  const saveData = async () => {
    try {
      const colorArr = main.color;
      for (let i = 1; i <= main.title.split(" ").length; i++) {
        const wordExists = main.color.find((item) => item.word === i);
        if (!wordExists) {
          colorArr.push({
            word: i,
            color: props?.data.section3?.color[i]?.color
              ? props?.data.section3?.color[i]?.color
              : "#DDF247",
          });
        }
      }
      setMain({ ...main, color: colorArr });
      const homepageService = new HomepageServices();
      const data = {
        color: colorArr,
        title: main.title,
        description: main.description,
        numberOfBox: active,
        box: dataArr,
      };
      await homepageService.addSection3(data);
    } catch (error) {
      console.log({error})
    }
  }

  // useEffect(() => {
  //   const arr = createArr(active)
  //   setDataArr(arr)
  // }, [active])

  useEffect(()=>{
    let tempArr =  props.data.section3.box
    setMain({
      color: props.data.section3.color,
      title: props.data.section3.title.trim(),
      description: props.data.section3.description
    })
    setDataArr(tempArr)
    setActiveColor(
      props?.data.section3?.color
        ? props?.data.section3?.color[0]?.color
        : props?.data.section3?.color
    );  },[])
  return (
    <>
      <div className="number_of_box_blk">
        <h4>Number of Boxes:</h4>
        <div className="number_of_box">
          <a className="active">2</a>
          {/* <a
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
          </a> */}
        </div>
        <div className="bg_less__form mt-20">
        <div className="row gy-4 gx-3">
          <div className="col-xl-3">
            <div className="color-picker-container">
              <label htmlFor="#">Color Picker</label>
              <input
                type="color"
                className="color-picker"
                value={activeColor ? activeColor : "#DDF247"}
                onChange={(e) => setActiveColor(e.target.value)}
              />
            </div>
            <div
              className="single__edit__profile__step link__input"
              style={{
                marginBottom: "20px",
              }}
            >
              <label htmlFor="#">Selected Word</label>
              <input
                className="border-0"
                type="number"
                placeholder={word}
                value={word}
                onChange={(e) => {
                  if (e.target.value <= 0) {
                    setActiveColor(
                      props?.data.section3?.color
                        ? props?.data.section3?.color[1]?.color
                        : "#DDF247"
                    );
                    setWord(1);
                  } else if (e.target.value > main.title.split(" ").length) {
                    setWord(main.title.split(" ").length);
                    setActiveColor(
                      props?.data.section3?.color
                        ? props?.data.section3?.color[
                            main.title.split(" ").length - 1
                          ]?.color
                        : "#DDF247"
                    );
                  } else {
                    setWord(e.target.value);
                    setActiveColor(
                      props?.data.section3?.color
                        ? props?.data.section3?.color[e.target.value]?.color
                        : "#DDF247"
                    );
                  }
                }}
              />
            </div>
          </div>
        </div>
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
      </div>
      <div className="hmepage__title">
        <h5>
          Section 3 Box Content{" "}
          <span>*The title will be entered automatically.</span>
        </h5>
      </div>
      <div className="common__edit__blks">
        <div className="row g-4 ">
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
            Section 3 Box Contents (Automatic Selection){" "}
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
          Cancel
        </a>
        <a data-bs-toggle="modal" href="#exampleModalToggle" role="button" onClick={saveData}>
          Save{" "}
          <span>
            <img src="assets/img/arrow_ico.svg" alt="" />
          </span>
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
          style={{maxWidth: 1446}}
        >
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <span
                className="close_modal close_center"
                data-bs-dismiss="modal"
              >
                <i className="far fa-times" />
              </span>
              <div className="exceptional__area">
                <div className="container">
                  <div className="section__title text-center">
                      <h3>
                        {
                          main.title ? (main.title.length > 0 ? 
                          main.title.split(" ").map((word, idx) => {
                            const color = main.color.find(item => item.word === idx + 1)
                            return <span style={{color: color?.color ? color.color : "#DDF247"}}>{word}&nbsp;</span>
                          })
                         : null) : null
                        }
                      </h3>
                    <p>{main.description}</p>
                  </div>
                  <div className="exceptional__shape">
                    <img src="assets/img/exceptional_shape.png" alt="" />
                  </div>
                  <div className="exceptional__card__blk custom_curation_Card">
                    {curations?.map((value, index) => (
                      <div className="row g-4">
                        <div className="col-lg-6">
                          <div className="single__exceptional__card">
                            <div className="exceptional__thumb">
                              <img
                                src={
                                  value?.logo
                                    ? value?.logo
                                    : "assets/img/exceptio_thumb_1.png"
                                }
                                alt=""
                              />
                            </div>
                            <div className="exceptional__content">
                              <h4>{value?.name}</h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="exceptional__shape_1">
                  <img src="assets/img/angle_shape_1.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ThirdSection
