import {useEffect, useRef, useState} from "react"
import { HomepageServices } from "../../services/homepageService"

function Banner() {
  const [data, setData] = useState({
    authority: [
      {
        image: null,
        link: "",
      },
    ],
    bottom: [
      {
        image: null,
        link: "",
      },
    ],
    appriciate: [
      {
        image: null,
        link: "",
      },
    ],
    curation: [
      {
        image: null,
        link: "",
      },
    ],
    minting: [
      {
        image: null,
        link: "",
      },
    ],
  })

  /**
   *
   * @param {string} section
   */
  const handleAdd = section => {
    const customData = [...data[section]]
    customData.push({image: null, link: ""})
    setData({...data, [section]: customData})
  }

  /**
   * @param {import("react").ChangeEvent<HTMLInputElement>} e
   * @param {number} idx
   * @param {string} section
   * @param {boolean} file
   *
   * @returns {void}
   */
  const handleChange = (e, idx, section, file) => {
    const {value, files} = e.target
    const customData = [...data[section]]
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const byteArray = reader.result;
        customData[idx] = {
          ...customData[idx],
          image: byteArray,
        };
        setData({ ...data, [section]: customData });
      };
      reader.readAsDataURL(files[0]);
    } else {
      customData[idx] = {
        ...customData[idx],
        link: value,
      };
      setData({ ...data, [section]: customData });
    }
  }

  useEffect(()=>{
    console.log({data})
  },[data])

  const cancel = () => {
    setData({
      authority: [
        {
          image: null,
          link: "",
        },
      ],
      bottom: [
        {
          image: null,
          link: "",
        },
      ],
      appriciate: [
        {
          image: null,
          link: "",
        },
      ],
      curation: [
        {
          image: null,
          link: "",
        },
      ],
      minting: [
        {
          image: null,
          link: "",
        },
      ],
    })
  }

  const saveData = async() => {
    try {
      const homepageService = new HomepageServices()
      await homepageService.addMediaBanner(data)
    } catch (error) {
      console.log(error)
    }
  }

  const topImagesRef = useRef(null)
  const bottomImagesRef = useRef(null)
  const appreciateImagesRef = useRef(null)
  const curationImagesRef = useRef(null)
  const mintingImagesRef = useRef(null)

  return (
    <>
      <div className="hmepage__title">
        <h5>Homepage</h5>
      </div>
      <div className="common__edit__proe__wrap mt-20">
        <div className="edit__profilfile__inner__top__blk">
          <div className="edit__profile__inner__title">
            <h5>Authority</h5>
          </div>
          <div className="add_new">
            <a onClick={() => handleAdd("authority")} href="#">
              <span>
                <img src="assets/img/Plus_circle.svg" alt="" />
              </span>{" "}
              Add New
            </a>
          </div>
        </div>
        <div className="row gy-4 gx-3">
          {data.authority.map((item, idx) => (
            <>
              <div className="col-xl-6">
                <div className="single__edit__profile__step">
                  <label htmlFor="#">Upload Image</label>
                </div>
                <div className="upload__file__with__name">
                  <input
                    type="file"
                    className="real-file"
                    hidden="hidden"
                    ref={topImagesRef}
                    onChange={e => handleChange(e, idx, "authority", true)}
                  />
                  <button type="button" className="custom-button" onClick={()=>topImagesRef.current.click()}>
                    <span>
                      <img src="assets/img/image_ico.svg" alt="" />
                    </span>{" "}
                    Upload
                  </button>
                  <span className="custom-text">{item.image? "File Uploaded" :"No files selected"}</span>
                </div>
                <div className="file__formate">
                  <p>PNG, GIF, WEBP, MP4 or MP3.Max 1Gb.</p>
                </div>
              </div>
              <div className="col-xl-6">
                <div className="single__edit__profile__step link__input">
                  <label htmlFor="#">Link</label>
                  <input
                    type="text"
                    placeholder="Please write the link"
                    name="link"
                    value={item.link}
                    onChange={e => handleChange(e, idx, "authority", false)}
                  />
                  <button className="link_ico" type="button">
                    <img src="assets/img/link_ico.svg" alt="" />
                  </button>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
      <div className="common__edit__proe__wrap mt-20">
        <div className="edit__profilfile__inner__top__blk">
          <div className="edit__profile__inner__title">
            <h5>Bottom Banner</h5>
          </div>
        </div>
        <div className="row gy-4 gx-3">
          {data.bottom.map((item, idx) => (
            <>
              <div className="col-xl-6">
                <div className="single__edit__profile__step">
                  <label htmlFor="#">Upload Image</label>
                </div>
                <div className="upload__file__with__name">
                  <input
                    type="file"
                    className="real-file"
                    hidden="hidden"
                    ref={bottomImagesRef}
                    onChange={e => handleChange(e, idx, "bottom", true)}
                  />
                  <button type="button" className="custom-button" onClick={() => bottomImagesRef.current.click()}>
                    <span>
                      <img src="assets/img/image_ico.svg" alt="" />
                    </span>{" "}
                    Upload
                  </button>
                  <span className="custom-text">{item.image? "File Uploaded" :"No files selected"}</span>
                </div>
                <div className="file__formate">
                  <p>PNG, GIF, WEBP, MP4 or MP3.Max 1Gb.</p>
                </div>
              </div>
              <div className="col-xl-6">
                <div className="single__edit__profile__step link__input">
                  <label htmlFor="#">Link</label>
                  <input
                    type="text"
                    placeholder="Please write the link"
                    name="link"
                    value={item.link}
                    onChange={e => handleChange(e, idx, "bottom", false)}
                  />
                  <button className="link_ico" type="button">
                    <img src="assets/img/link_ico.svg" alt="" />
                  </button>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
      <div className="hmepage__title">
        <h5>Appreciate Top Banner</h5>
      </div>
      <div className="common__edit__proe__wrap mt-20">
        <div className="edit__profilfile__inner__top__blk">
          <div className="edit__profile__inner__title">
            <h5>Top Banner</h5>
          </div>
        </div>
        <div className="row gy-4 gx-3">
          {data.appriciate.map((item, idx) => (
            <>
              <div className="col-xl-6">
                <div className="single__edit__profile__step">
                  <label htmlFor="#">Upload Image</label>
                </div>
                <div className="upload__file__with__name">
                  <input
                    type="file"
                    className="real-file"
                    hidden="hidden"
                    ref={appreciateImagesRef}
                    onChange={e => handleChange(e, idx, "appriciate", true)}
                  />
                  <button type="button" className="custom-button" onClick={()=>appreciateImagesRef.current.click()}>
                    <span>
                      <img src="assets/img/image_ico.svg" alt="" />
                    </span>{" "}
                    Upload
                  </button>
                  <span className="custom-text">{item.image? "File Uploaded" :"No files selected"}</span>
                </div>
                <div className="file__formate">
                  <p>PNG, GIF, WEBP, MP4 or MP3.Max 1Gb.</p>
                </div>
              </div>
              <div className="col-xl-6">
                <div className="single__edit__profile__step link__input">
                  <label htmlFor="#">Link</label>
                  <input
                    type="text"
                    placeholder="Please write the link"
                    name="link"
                    value={item.link}
                    onChange={e => handleChange(e, idx, "appriciate", false)}
                  />
                  <button className="link_ico" type="button">
                    <img src="assets/img/link_ico.svg" alt="" />
                  </button>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
      <div className="hmepage__title">
        <h5>Curation Top Banner</h5>
      </div>
      <div className="common__edit__proe__wrap mt-20">
        <div className="edit__profilfile__inner__top__blk">
          <div className="edit__profile__inner__title">
            <h5>Top Banner</h5>
          </div>
        </div>
        <div className="row gy-4 gx-3">
          {data.curation.map((item, idx) => (
            <>
              <div className="col-xl-6">
                <div className="single__edit__profile__step">
                  <label htmlFor="#">Upload Image</label>
                </div>
                <div className="upload__file__with__name">
                  <input
                    type="file"
                    className="real-file"
                    hidden="hidden"
                    ref={curationImagesRef}
                    onChange={e => handleChange(e, idx, "curation", true)}
                  />
                  <button type="button" className="custom-button" onClick={()=>curationImagesRef.current.click()}>
                    <span>
                      <img src="assets/img/image_ico.svg" alt="" />
                    </span>{" "}
                    Upload
                  </button>
                  <span className="custom-text">{item.image? "File Uploaded" :"No files selected"}</span>
                </div>
                <div className="file__formate">
                  <p>PNG, GIF, WEBP, MP4 or MP3.Max 1Gb.</p>
                </div>
              </div>
              <div className="col-xl-6">
                <div className="single__edit__profile__step link__input">
                  <label htmlFor="#">Link</label>
                  <input
                    type="text"
                    placeholder="Please write the link"
                    name="link"
                    value={item.link}
                    onChange={e => handleChange(e, idx, "curation", false)}
                  />
                  <button className="link_ico" type="button">
                    <img src="assets/img/link_ico.svg" alt="" />
                  </button>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
      <div className="hmepage__title">
        <h5>Minting Banner</h5>
      </div>
      <div className="common__edit__proe__wrap mt-20">
        <div className="edit__profilfile__inner__top__blk">
          <div className="edit__profile__inner__title">
            <h5>Top Banner</h5>
          </div>
        </div>
        <div className="row gy-4 gx-3">
          {data.minting.map((item, idx) => (
            <>
              <div className="col-xl-6">
                <div className="single__edit__profile__step">
                  <label htmlFor="#">Upload Image</label>
                </div>
                <div className="upload__file__with__name">
                  <input
                    type="file"
                    className="real-file"
                    hidden="hidden"
                    ref={mintingImagesRef}
                    onChange={e => handleChange(e, idx, "minting", true)}
                  />
                  <button type="button" className="custom-button" onClick={()=> mintingImagesRef.current.click()}>
                    <span>
                      <img src="assets/img/image_ico.svg" alt="" />
                    </span>{" "}
                    Upload
                  </button>
                  <span className="custom-text">{item.image? "File Uploaded" :"No files selected"}</span>
                </div>
                <div className="file__formate">
                  <p>PNG, GIF, WEBP, MP4 or MP3.Max 1Gb.</p>
                </div>
              </div>
              <div className="col-xl-6">
                <div className="single__edit__profile__step link__input">
                  <label htmlFor="#">Link</label>
                  <input
                    type="text"
                    placeholder="Please write the link"
                    name="link"
                    value={item.link}
                    onChange={e => handleChange(e, idx, "minting", false)}
                  />
                  <button className="link_ico" type="button">
                    <img src="assets/img/link_ico.svg" alt="" />
                  </button>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
      <div className="edit__profile__bottom__btn half__width__btn">
        <a href="#" className="cancel" onClick={cancel}>
          Discard
        </a>
        <a href="#" onClick={saveData}>
          Next{" "}
          <span>
            <img src="assets/img/arrow_ico.svg" alt="" />
          </span>
        </a>
      </div>
    </>
  )
}

export default Banner
