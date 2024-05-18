import {act, useEffect, useRef, useState} from "react"
import {HomepageServices} from "../../services/homepageService"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FirstSection(props) {
  const [main, setMain] = useState({
    color: [],
    title: "",
    description: "",
  })
  const [section, setSection] = useState([
    {
      image: null,
      title: '',
      subtitle1:"",
      subtitle2: "",
    },
    {
      image: null,
      title: "",
      subtitle1: "",
      subtitle2: "",
    },
    {
      image: null,
      title: "",
      subtitle1: "",
      subtitle2: "",
    },
  ])

  /**
   * @param {import("react").ChangeEvent<HTMLInputElement>} e
   *
   * @returns {void}
   */
  const handleChange = e => {
    const {name, value} = e.target
    setMain({...main, [name]: value})
  }

  /**
   * @param {import("react").ChangeEvent<HTMLInputElement>} e
   * @param {number} idx
   *
   * @returns {void}
   */
  const handleChangeSec = (e, idx) => {
    const {name, value} = e.target
    const tempArr = [...section]
    tempArr[idx] = {
      ...tempArr[idx],
      [name]: value,
    }
    setSection([...tempArr])
  }

  /**
   * @param {import("react").ChangeEvent<HTMLInputElement>} e
   * @param {number} idx
   *
   * @returns {void}
   */
  const handleChangeImage = (e, idx) => {
    console.log({idx})
    const {files} = e.target
    const tempArr = [...section]
    const reader = new FileReader()
    reader.onloadend = () => {
      const byteArray = reader.result
      tempArr[idx] = {
        ...tempArr[idx],
        image: byteArray,
      }
      setSection([...tempArr])
    }
    reader.readAsDataURL(files[0])
  }

  const cancel = () => {
    setMain({
      title: "",
      description: "",
    })
    setSection([
      {
        image: null,
        title: "",
        subtitle1: "",
        subtitle2: "",
      },
      {
        image: null,
        title: "",
        subtitle1: "",
        subtitle2: "",
      },
      {
        image: null,
        title: "",
        subtitle1: "",
        subtitle2: "",
      },
    ])
  }

  const saveData = async () => {
    try {
      const colorArr = main.color
      for (let i=1;i<=main.title.split(" ").length;i++) {
        const wordExists = main.color.find(item => item.word === i)
        if (!wordExists) {
          colorArr.push({word: i, color: props?.data.section1?.color[i]?.color ? props?.data.section1?.color[i]?.color : "#DDF247"})
        }
      }
      setMain({...main, color: colorArr})
      const homepageService = new HomepageServices()
      const data = {
        color: colorArr,
        title: main.title,
        description: main.description,
        section,
      }
      await homepageService.addSection1(data)
    } catch (error) {
      console.log(error)
    }
  }

  const [word, setWord] = useState(1)
  const [activeColor, setActiveColor] = useState("")

  useEffect(() => {
    if (word && activeColor) {
      const wordExists = main.color.find(item => item.word === word)
      if (wordExists) {
        const tempArr = main.color.map(item => {
          if (item.word === word) {
            return {
              word,
              color: activeColor,
            }
          } else {
            return item
          }
        })
        setMain({...main, color: tempArr})
      } else {
        setMain({
          ...main,
          color: [...main.color, {word, color: activeColor}],
        })
      }
    }
  }, [word, activeColor])

  useEffect(() => {
    setMain({
      color: props?.data.section1?.color,
      title: props?.data.section1?.title,
      description: props.data.section1?.description,
    })
    setSection([
      {
        image: null,
        title: props.data.section1?.box[0]?.title,
        subtitle1: props.data.section1?.box[0]?.subtitle1,
        subtitle2: props.data.section1?.box[0]?.subtitle2,
      },
      {
        image: null,
        title: props.data.section1?.box[1]?.title,
        subtitle1: props.data.section1?.box[1]?.subtitle1,
        subtitle2: props.data.section1?.box[1]?.subtitle2,
      },
      {
        image: null,
        title: props.data.section1?.box[2]?.title,
        subtitle1: props.data.section1?.box[2]?.subtitle1,
        subtitle2: props.data.section1?.box[2]?.subtitle2,
      },
    ])
    setActiveColor(props?.data.section1?.color ? props?.data.section1?.color[0]?.color : props?.data.section1?.color)
  }, [props])

  return (
    <>
      {" "}
      <ToastContainer />
      <div className="bg_less__form mt-20">
        <div className="row gy-4 gx-3">
          <div className="col-xl-3">
            <div className="color-picker-container">
              <label htmlFor="#">Color Picker</label>
              <input
                type="color"
                className="color-picker"
                value={activeColor ? activeColor : "#DDF247"}
                onChange={e => setActiveColor(e.target.value)}
              />
            </div>
            <div className="single__edit__profile__step link__input" style={{
              marginBottom: '20px'
            }}>
              <label htmlFor="#">Selected Word</label>
              <input
                className="border-0"
                type="number"
                placeholder={word}
                value={word}
                onChange={(e) => {
                  if (e.target.value <= 0) {
                    setWord(1)
                  } else if (e.target.value > main.title.split(" ").length) {
                    setWord(main.title.split(" ").length)
                  } else {
                    setWord(e.target.value)
                  }
                }}
              />
            </div>
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
        <h5>Section 1 Box Content</h5>
      </div>
      {section.map((sec, idx) => (
        <div
          key={idx}
          data-index={idx}
          className="common__edit__proe__wrap mt-20"
        >
          <div className="edit__profilfile__inner__top__blk">
            <div className="edit__profile__inner__title">
              <h5>Box {idx + 1}</h5>
            </div>
          </div>
          <div className="row gy-4 gx-3">
            <div className="col-xl-12">
              <div className="single__edit__profile__step">
                <label htmlFor="#">Upload Image</label>
              </div>
              <label
                htmlFor={idx + "inputRef"}
                className="upload__file__with__name"
                style={{maxWidth: 400}}
              >
                <input
                  id={idx + "inputRef"}
                  type="file"
                  className="real-file"
                  hidden="hidden"
                  // ref={boxRef}
                  onChange={e => handleChangeImage(e, idx)}
                />
                <div className="custom-button cursor-pointer">
                  <span>
                    <img src="assets/img/image_ico.svg" alt="" />
                  </span>{" "}
                  Upload
                </div>
                <span className="custom-text">{sec.image? "File Uploaded" :"No files selected"}</span>
              </label>
              <div className="file__formate">
                <p>PNG, GIF, WEBP, MP4 or MP3.Max 1Gb.</p>
              </div>
            </div>
            <div className="col-xxl-4 col-lg-6 col-md-6">
              <div className="single__edit__profile__step link__input">
                <label htmlFor="#">Title</label>
                <input
                  type="text"
                  placeholder="Please write the title..."
                  name="title"
                  value={section[idx].title}
                  onChange={e => handleChangeSec(e, idx)}
                />
              </div>
            </div>
            <div className="col-xxl-4 col-lg-6 col-md-6">
              <div className="single__edit__profile__step link__input">
                <label htmlFor="#">Subtitle 1</label>
                <input
                  type="text"
                  placeholder="Please write the Subtitle... "
                  name="subtitle1"
                  value={section[idx].subtitle1}
                  onChange={e => handleChangeSec(e, idx)}
                />
              </div>
            </div>
            <div className="col-xxl-4 col-lg-6 col-md-6">
              <div className="single__edit__profile__step link__input">
                <label htmlFor="#">Subtitle 2</label>
                <input
                  type="text"
                  placeholder="Please write the Subtitle... "
                  name="subtitle2"
                  value={section[idx].subtitle2}
                  onChange={e => handleChangeSec(e, idx)}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
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
      {/* Popup */}
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
              <div className="popup__inner__blk">
                <div className="inspir__area">
                  <div className="container">
                    <div className="section__title text-center">
                      <h3>
                        {
                          main.title ? (main.title.length > 0 ? 
                          main.title.split(" ").map((word, idx) => {
                            const color = main.color.find(item => item.word === idx + 1)
                            return <span style={{color: color?.color ? color.color : "#DDF247"}}>{word} </span>
                          })
                         : "") : ""
                        }
                      </h3>
                      <p>{main.description}</p>
                    </div>
                    <div className="row g-4">
                      <div className="col-lg-4 col-md-6">
                        <div className="single__inspir__card">
                          <div className="single__inspire__thumb">
                            <img src={section[0].image || props.data.section1?.box[0]?.image} alt="" />
                          </div>
                          <div className="inspire__content">
                            <h5>{section[0].title}</h5>
                            <p>{section[0].subtitle1}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="single__inspir__card">
                          <div className="single__inspire__thumb">
                            <img src={section[1].image || props.data.section1?.box[1]?.image} alt="" />
                          </div>
                          <div className="inspire__content">
                            <h5>{section[1].title}</h5>
                            <p>{section[1].subtitle1}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="single__inspir__card">
                          <div className="single__inspire__thumb">
                            <img src={section[2].image || props.data.section1?.box[2]?.image} alt="" />
                          </div>
                          <div className="inspire__content">
                            <h5>{section[2].title}</h5>
                            <p>{section[2].subtitle1}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="inspir__btn">
                      <a
                        href="https://artistvaultx.wpcomstaging.com/monster-artist/"
                        className="common__btn"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Discover Artist
                      </a>
                    </div>
                  </div>
                  <div className="inspir__shape__1">
                    <img src="assets/img/artist_shape_1.png" alt="" />
                  </div>
                  <div className="inspir__shape__2">
                    <img src="assets/img/circle_shape_ico_2.png" alt="" />
                  </div>
                  <div className="inspir__shape__3">
                    <img src="assets/img/circle_shape_1.png" alt="" />
                  </div>
                  <div className="inspir__shape__4">
                    <img src="assets/img/circle_shape_1.png" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default FirstSection
