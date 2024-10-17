import { useEffect, useState } from "react"
import { HomepageServices } from "../../services/homepageServices"

function FourthSection(props) {
  const [main, setMain] = useState({
    color: [],
    title: "",
    description: "",
  })
  const [word, setWord] = useState(1)
  const [activeColor, setActiveColor] = useState("")
  const [section, setSection] = useState([
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
    const { name, value } = e.target
    setMain({ ...main, [name]: value })
  }

  /**
   * @param {import("react").ChangeEvent<HTMLInputElement>} e
   * @param {number} idx
   *
   * @returns {void}
   */
  const handleChangeSec = (e, idx) => {
    const { name, value } = e.target
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
    const { files } = e.target
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
      const colorArr = main.color;
      for (let i = 1; i <= main.title.split(" ").length; i++) {
        const wordExists = main.color.find((item) => item.word === i);
        if (!wordExists) {
          colorArr.push({
            word: i,
            color: props?.data.section4?.color[i]?.color
              ? props?.data.section4?.color[i]?.color
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
        section,
      };
      console.log(data)
      await homepageService.addSection4(data);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (word && activeColor) {
      const wordExists = main.color.find((item) => item.word === word);
      if (wordExists) {
        const tempArr = main.color.filter((item) => item.word !== word);
        tempArr.push({ word, color: activeColor });
        setMain({ ...main, color: tempArr });
      } else {
        setMain({
          ...main,
          color: [...main.color, { word, color: activeColor }],
        });
      }
    }
  }, [word, activeColor]);

  useEffect(() => {
    console.log(section)
  }, [section])

  const fetchActon = () => {
    try {
      console.log({ section })
      setMain({
        color: props?.data.section4?.color,
        title: props?.data.section4?.title,
        description: props.data.section4?.description,
      })
      setSection([
        {
          image: null,
          title: props.data.section4?.box[0]?.title,
          subtitle1: props.data.section4?.box[0]?.subtitle1,
          subtitle2: props.data.section4?.box[0]?.subtitle2,
        },
        {
          image: null,
          title: props.data.section4?.box[1]?.title,
          subtitle1: props.data.section4?.box[1]?.subtitle1,
          subtitle2: props.data.section4?.box[1]?.subtitle2,
        },
        {
          image: null,
          title: props.data.section4?.box[2]?.title,
          subtitle1: props.data.section4?.box[2]?.subtitle1,
          subtitle2: props.data.section4?.box[2]?.subtitle2,
        },
        {
          image: null,
          title: props.data.section4?.box[3]?.title,
          subtitle1: props.data.section4?.box[3]?.subtitle1,
          subtitle2: props.data.section4?.box[3]?.subtitle2,
        },
        {
          image: null,
          title: props.data.section4?.box[4]?.title,
          subtitle1: props.data.section4?.box[4]?.subtitle1,
          subtitle2: props.data.section4?.box[4]?.subtitle2,
        },
        {
          image: null,
          title: props.data.section4?.box[5]?.title,
          subtitle1: props.data.section4?.box[5]?.subtitle1,
          subtitle2: props.data.section4?.box[5]?.subtitle2,
        },
        {
          image: null,
          title: props.data.section4?.box[5]?.title,
          subtitle1: props.data.section4?.box[5]?.subtitle1,
          subtitle2: props.data.section4?.box[5]?.subtitle2,
        },
      ])
      setActiveColor(
        props?.data.section4?.color
          ? props?.data.section4?.color[0]?.color
          : props?.data.section4?.color
      );
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    if (props)
      fetchActon();
  }, [props])

  return (
    <>
      <div className="bg_less__form mt-50">
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
                  const numberSelected = parseInt(e.target.value);
                  if (numberSelected <= 0) {
                    setActiveColor(
                      props?.data.section4?.color
                        ? props?.data.section4?.color[1]?.color
                        : "#DDF247"
                    );
                    setWord(1);
                  } else if (numberSelected > main.title.split(" ").length) {
                    setWord(main.title.split(" ").length);
                    setActiveColor(
                      props?.data.section4?.color
                        ? props?.data.section4?.color[
                          main.title.split(" ").length - 1
                        ]?.color
                        : "#DDF247"
                    );
                  } else {
                    setWord(numberSelected);
                    setActiveColor(
                      props?.data.section4?.color
                        ? props?.data.section4?.color[numberSelected - 1]?.color
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
      <div className="hmepage__title">
        <h5>Section 1 Box Content</h5>
      </div>
      {section.map((sec, idx) => (
        <div key={idx} className="common__edit__proe__wrap mt-20">
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
                className="upload__file__with__name"
                style={{ maxWidth: 400 }}
              >
                <input
                  htmlFor={idx + "inputRef"}
                  type="file"
                  className="real-file"
                  hidden="hidden"
                  onChange={e => handleChangeImage(e, idx)}
                />
                <div className="custom-button">
                  <span>
                    <img src="assets/img/image_ico.svg" alt="" />
                  </span>{" "}
                  Upload
                </div>
                <span className="custom-text">{sec.image ? "File Uploaded" : "No files selected"}</span>
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
                <label htmlFor="#">Link</label>
                <input
                  type="text"
                  placeholder="Please enter the link... "
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
          Discard
        </a>
        <a data-bs-toggle="modal" href="#exampleModalToggle" role="button" onClick={saveData}>
          Next{" "}
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
              <div className="event__area">
                <div className="container">
                  <div className="section__title text-center">
                    <h3>
                      {
                        main.title ? (main.title.length > 0 ?
                          main.title.split(" ").map((word, idx) => {
                            const color = main.color.find(item => item.word === idx + 1)
                            return <span style={{ color: color?.color ? color.color : "#DDF247" }}>{word}&nbsp;</span>
                          })
                          : null) : null
                      }
                    </h3>
                    <p>{main.description}</p>
                  </div>
                  <div className="row g-4">
                    <div className="col-xl-7">
                      <div className="event__left__thumb">
                        <img src={section[0].image} alt="" />
                      </div>
                    </div>
                    <div className="col-xl-5">
                      <div className="news__thumb__blk">
                        <div className="news__thumb">
                          <img src={section[1].image} alt="" />
                          <p>{section[1].title}</p>
                        </div>
                        <div className="news__thumb">
                          <img src={section[2].image} alt="" />
                          <p>{section[2].title}</p>
                        </div>
                        <div className="news__thumb">
                          <img src={section[3].image} alt="" />
                          <p>{section[3].title}</p>
                        </div>
                        <div className="news__thumb">
                          <img src={section[4].image} alt="" />
                          <p>{section[4].title}</p>
                        </div>
                        <div className="news__thumb">
                          <img src={section[5].image} alt="" />
                          <p>{section[5].title}</p>
                        </div>
                        <div className="news__thumb">
                          <img src={section[6].image} alt="" />
                          <p>{section[6].title}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="event__shape__1">
                  <img src="assets/img/event__shape_1.png" alt="" />
                </div>
                <div className="event__shape__2">
                  <img src="assets/img/event__shape_2.png" alt="" />
                </div>
                <div className="event__shape__3">
                  <img src="assets/img/event__shape_3.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default FourthSection
