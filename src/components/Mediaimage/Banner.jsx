import {useEffect, useRef, useState} from "react"
import { HomepageServices } from "../../services/homepageServices"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Banner() {
  const [data, setData] = useState({
    authority: [],
    bottom: {},
    appriciate: {},
    curation: {},
    minting: {},
  })

  /**
   *
   * @param {string} section
   */
  const [maxAuthority, setMaxAuthority] = useState(1)
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
    console.log(section,idx,file)
    const {value, files} = e.target

    // if idx is not null
    if (idx !== null) {
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
    } else {
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const byteArray = reader.result;
          setData({ ...data, [section]: { image: byteArray, link: data[section].link } });
        };
        reader.readAsDataURL(files[0]);
      } else {
        setData({ ...data, [section]: { image: data[section].image, link: value } });
      }
    }
  }

  const fetchMedia = async () => {
    const homepageService = new HomepageServices()
    const media = await homepageService.getMedia()
    console.log(media)

    const object = {}
    if (media.bottomBaner) {
      object.bottom = media.bottomBaner
    }
    if (media.appreciateTop) {
      object.appriciate = media.appreciateTop
    }
    if (media.curationTop) {
      object.curation = media.curationTop
    }
    if (media.mintingBanner) {
      object.minting = media.mintingBanner
    }
    if (media.homeAutority) {
      object.authority = media.homeAutority
    }
    setData(object)
  }
  useEffect(()=>{ 
    fetchMedia()
  },[])

  useEffect(()=>{
    console.log(data)
  }, [data])

  const cancel = async () => {
    await fetchMedia()
  }

  const uploadImagePr = async () => {
    try {
      const homepageService = new HomepageServices()
      await homepageService.addMediaBanner(data)
      return new Promise((resolve) => setTimeout((json) => resolve(json), 3000));
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  const saveData = async() => {
    try {
      const myPr = uploadImagePr()
      toast.promise(myPr, {
        pending: 'Uploading Media',
        success: 'File Uploaded',
        error: 'Error in uploading file',
      })
    } catch (error) {
      console.log(error)
    }
  }

  const urlCheck = /^https:\/\//

  const topImagesRef = useRef(null)
  const bottomImagesRef = useRef(null)
  const appreciateImagesRef = useRef(null)
  const curationImagesRef = useRef(null)
  const mintingImagesRef = useRef(null)

  return (
    <>
      <ToastContainer />
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
              <div className="col-xl-5">
                <div className="single__edit__profile__step">
                  <label htmlFor="#">Upload Image</label>
                </div>
                <div className="upload__file__with__name">
                  <input
                    type="file"
                    id={idx}
                    className="real-file"
                    hidden="hidden"
                    onChange={e => handleChange(e, idx, "authority", true)}
                  />
                  <button type="button" className="custom-button" onClick={()=> document?.getElementById(idx).click()}>
                    <span>
                      <img src="assets/img/image_ico.svg" alt="" />
                    </span>{" "}
                    Upload
                  </button>
                  <span className="custom-text">{item.image? "File Uploaded" :"No files selected"}</span>
                  {
                    item.image ? <span className="custom-text" style={{
                      textAlign: "right"
                    }}><a href={item.image} 
                    target="_blank"
                    style={{
                      color: "gray",
                      textDecoration: "none"
                    }}>View</a></span> : null
                  }
                </div>
                <div className="file__formate">
                  <p>PNG, GIF, WEBP, MP4 or MP3.Max 1Gb.</p>
                </div>
              </div>
              <div className="col-xl-5">
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
              <div className="col-xl-2">
                <img src="assets/img/delete-icon.svg" alt="delete-icon" style={{
                  marginTop: "40px",
                  marginLeft: "10%",
                  height: "35px",
                  width: "35px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (data.authority.length > 1) {
                    const oldAuthority = data.authority
                    const indexToBeDeleted = oldAuthority.findIndex((item, index) => item === idx)
                    oldAuthority.splice(indexToBeDeleted, 1)
                    setData({...data, authority: oldAuthority})
                  }
                }}
                />
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
          {data.bottom ? 
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
                    onChange={e => handleChange(e, null, "bottom", true)}
                  />
                  <button type="button" className="custom-button" onClick={() => bottomImagesRef.current.click()}>
                    <span>
                      <img src="assets/img/image_ico.svg" alt="" />
                    </span>{" "}
                    Upload
                  </button>
                  <span className="custom-text">{data.bottom.image? "File Uploaded" :"No files selected"}</span>
                  {
                    data.bottom.image ? <span className="custom-text" style={{
                      textAlign: "right"
                    }}><a href={data.bottom.image} 
                    target="_blank"
                    style={{
                      color: "gray",
                      textDecoration: "none"
                    }}>View</a></span> : null
                  }
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
                    value={data.bottom.link}
                    onChange={e => handleChange(e, null, "bottom", false)}
                  />
                  <button className="link_ico" type="button">
                    <img src="assets/img/link_ico.svg" alt="" />
                  </button>
                </div>
              </div>
            </>
          : null}
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
          {data.appriciate ?
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
                    onChange={e => handleChange(e, null, "appriciate", true)}
                  />
                  <button type="button" className="custom-button" onClick={()=>appreciateImagesRef.current.click()}>
                    <span>
                      <img src="assets/img/image_ico.svg" alt="" />
                    </span>{" "}
                    Upload
                  </button>
                  <span className="custom-text">{data.appriciate.image? "File Uploaded" :"No files selected"}</span>
                  {
                    data.appriciate.image ? <span className="custom-text" style={{
                      textAlign: "right"
                    }}><a href={data.appriciate.image} 
                    target="_blank"
                    style={{
                      color: "gray",
                      textDecoration: "none"
                    }}>View</a></span> : null
                  }
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
                    value={data.appriciate.link}
                    onChange={e => handleChange(e, null, "appriciate", false)}
                  />
                  <button className="link_ico" type="button">
                    <img src="assets/img/link_ico.svg" alt="" />
                  </button>
                </div>
              </div>
            </>
          : null}
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
          {data.curation ? 
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
                    onChange={e => handleChange(e, null, "curation", true)}
                  />
                  <button type="button" className="custom-button" onClick={()=>curationImagesRef.current.click()}>
                    <span>
                      <img src="assets/img/image_ico.svg" alt="" />
                    </span>{" "}
                    Upload
                  </button>
                  <span className="custom-text">{data.curation.image? "File Uploaded" :"No files selected"}</span>
                  {
                    data.curation.image ? <span className="custom-text" style={{
                      textAlign: "right"
                    }}><a href={data.curation.image} 
                    target="_blank"
                    style={{
                      color: "gray",
                      textDecoration: "none"
                    }}>View</a></span> : null
                  }
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
                    value={data.curation.link}
                    onChange={e => handleChange(e, null, "curation", false)}
                  />
                  <button className="link_ico" type="button">
                    <img src="assets/img/link_ico.svg" alt="" />
                  </button>
                </div>
              </div>
            </>
          : null}
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
          {data.minting ? 
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
                    onChange={e => handleChange(e, null, "minting", true)}
                  />
                  <button type="button" className="custom-button" onClick={()=> mintingImagesRef.current.click()}>
                    <span>
                      <img src="assets/img/image_ico.svg" alt="" />
                    </span>{" "}
                    Upload
                  </button>
                  <span className="custom-text">{data.minting.image? "File Uploaded" :"No files selected"}</span>
                  {
                    data.minting.image ? <span className="custom-text" style={{
                      textAlign: "right"
                    }}><a href={data.minting.image} 
                    target="_blank"
                    style={{
                      color: "gray",
                      textDecoration: "none"
                    }}>View</a></span> : null
                  }
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
                    value={data.minting.link}
                    onChange={e => handleChange(e, null, "minting", false)}
                  />
                  <button className="link_ico" type="button">
                    <img src="assets/img/link_ico.svg" alt="" />
                  </button>
                </div>
              </div>
            </>
          : null}
        </div>
      </div>
      <div className="edit__profile__bottom__btn half__width__btn">
        <a href="#" className="cancel" onClick={cancel}>
          Discard
        </a>
        <a onClick={saveData}>
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
