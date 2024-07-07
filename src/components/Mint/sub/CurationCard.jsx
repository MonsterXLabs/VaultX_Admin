import {useEffect, useState} from "react"
import { getCollectionInfo } from "../../../services/services"

function CurationCard({item}) {
  const [info, setInfo] = useState()

  const getCollection = async () => {
    const {collection} = await getCollectionInfo(item?._id)
    setInfo(collection)
  }

  useEffect(() => {
    getCollection()
  }, [item])
  return (
    <div
      className="col-xxl-4 col-xl-6 col-lg-4 col-md-6"
    >
      <div className="curation__card__blk">
        <div className="curation__thumb flex justify-center items-center mt-4">
          <img className="w-full !aspect-square !object-cover" src={item.logo} alt="" />
          {/* <ion-icon name="heart" className="click_heart">
                  <div className="red-bg" />
                </ion-icon> */}
        </div>
        <div className="curation__content">
          <h5>{item.name}</h5>
          <div className="curation__card__bottom">
            <div className="single__curation__categorie" style={{
              width: "30%"
            }}>
              <p>Artworks</p>
              <h6>{info?.nftCount}</h6>
            </div>
            <div className="single__curation__categorie" style={{
              width: "30%"
            }}>
              <p>Artists</p>
              <h6>{info?.artistCount}</h6>
            </div>
            <div className="single__curation__categorie" style={{
              width: "40%"
            }}>
              <p>Volume</p>
              <h6 className="flex gap-x-2">
              ${Math.round(Number(info?.totalVolume))}
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CurationCard
