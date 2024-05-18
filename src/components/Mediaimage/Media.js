import { useEffect, useState } from "react"
import Dropdown from "../Dropdown/Dropdown"
import { HomepageServices } from "../../services/homepageService"

function Media() {
  const [value, setValue] = useState("")
  const [sizes, setSizes] = useState({
    collection: "",
    profile: "",
    nft: "",
  })

  const [media, setMedia] = useState({})

  /**
   * @param {import("react").ChangeEvent<HTMLInputElement>} e
   *
   * @returns {void}
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    setSizes({ ...sizes, [name]: value })
  }

  const cancel = () => {
    setSizes({
      collection: "",
      profile: "",
      nft: "",
    })
    setValue("")
  }

  const submitLimits = async() => {
    try {
      const data = {
        ...sizes,
        quality: value
      }
      const homepageService = new HomepageServices()
      await homepageService.addMediaLimits(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const homepageService = new HomepageServices()
        const media = await homepageService.getMedia()
        console.log(media)
        setMedia(media)
      } catch (error) {
        console.log(error)
      }
    }
    fetchMedia()
  }, [])

  const list = ["Medium - 300x300", "Hd - 720x702"]
  return (
    <>
      <div className="collection__wrapper">
        <div className="collection__single__blk">
          <div className="collection__content">
            <h4>Collection upload sizes</h4>
            <p>
              Input collection profile and cover upload sizes in MB (MegaBytes)
            </p>
          </div>
          <div className="collection__size__input">
            <input
              type="text"
              placeholder={media.collectionUploadSize}
              name="collection"
              value={sizes.collection}
              onChange={handleChange}
            />
            <button type="button">MB</button>
          </div>
        </div>
        <div className="collection__single__blk">
          <div className="collection__content">
            <h4>Profile Upload sizes</h4>
            <p>Input profile and cover upload sizes in MB (MegaBytes)</p>
          </div>
          <div className="collection__size__input">
            <input
              type="text"
              placeholder={media.profileUploadSize}
              name="profile"
              value={sizes.profile}
              onChange={handleChange}
            />
            <button type="button">MB</button>
          </div>
        </div>
        <div className="collection__single__blk">
          <div className="collection__content">
            <h4>NFTs Upload Sizes</h4>
            <p>Input NFTs upload sizes in MB (MegaBytes)</p>
          </div>
          <div className="collection__size__input">
            <input
              type="text"
              placeholder={media.nftUploadSize}
              name="nft"
              value={sizes.nft}
              onChange={handleChange}
            />
            <button type="button">MB</button>
          </div>
        </div>
        {/* <div className="collection__single__blk">
          <div className="collection__content">
            <h4>NFT thumbnail Quality</h4>
            <p>Select thumbnail image quality in ALL NFT pages</p>
          </div>
          <div className="collection__size__input">
            <div className="categorie__select select_black_bg">
              <Dropdown data={list} value={value} setValue={setValue} />
            </div>
          </div>
        </div> */}
      </div>
      <div className="edit__profile__bottom__btn half__width__btn">
        <a href="#" className="cancel" onClick={cancel}>
          Cancel
        </a>
        <a href="#" onClick={submitLimits}>Save</a>
      </div>
    </>
  )
}

export default Media
