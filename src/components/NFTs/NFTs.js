import { useEffect, useState } from "react";
import { NftCategoryServices } from "../../services/nftServices";
import Dropdown from "../Dropdown/Dropdown";
import Search from "../Search/Seach";
import Pagination from "../Pagination/Pagination";
import Header from "../Header/Header";

const nftList = {
  "Price : Low to high": { price: 1 },
  "Price : High to low": { price: -1 },
  "Recently listed": { createdAt: -1 },
  "Recently Minted": { mintingTime: -1 },
  Blind: { active: true },
};

function NFTs(props) {
  const nftServices = new NftCategoryServices();
  const [nft, setNft] = useState([]);
  const [count, setCount] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(5);
  const [searchInput, setSearchInput] = useState("");
  const [value, setValue] = useState("");
  const list = [
    "Price : Low to high",
    "Price : High to low",
    "Recently listed",
    "Recently Minted",
    "Blind",
  ];

  const getAllNft = async () => {
    const {
      data: { nfts = [{}], metadata = {} },
    } = await nftServices.getAllNft({
      skip,
      limit,
      searchInput,
      filter: nftList[value],
    });
    console.log('nft',nfts);
    setCount(metadata.total);
    setNft(nfts);
  };

  const handlePagination = async ({ recordsToSkip, recordsToGet }) => {
    setSkip(recordsToSkip);
    setLimit(recordsToGet);
  };

  const handelSearchResult = async ({ debounceSearchInput }) => {
    setSearchInput(debounceSearchInput);
  };

  const handleChageBlind = async (isActive, nftId) => {
    try {
      console.log({ nftId });
      await nftServices.handleNft({ nftId, isActive });
      await getAllNft();
    } catch (error) {
      console.log({ error });
      await getAllNft();
    }
  };

  useEffect(() => {
    console.log({ searchInput });
    getAllNft();
  }, [count, skip, limit, searchInput, value]);

  return (
    <section className="dashboard__area">
      {props.render}
      <Header />
      <div className="dashboard__admin__area">
        <div className="admin__inner__blk">
          <div className="admin__content">
            <h4>NFTs Management</h4>
          </div>
        </div>
      </div>

      <Search
        handelSearchResult={handelSearchResult}
        placeholder={"Search by nft name or trait ..."}
      />
      <div className="price__filter__blk">
        <div className="price__filter__select">
          <div className="categorie__select select_black_bg">
            <Dropdown data={list} value={value} setValue={setValue} />
          </div>
        </div>
        <div className="user__price__code">
          <h4>{count} NFTs</h4>
        </div>
      </div>
      <div className="dashboard__table__wrapper">
        <div className="dashboard__table mt-10">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Icon</th>
                <th scope="col">Title</th>
                <th scope="col">Artist</th>
                <th scope="col">Curation</th>
                <th scope="col">Price</th>
                <th scope="col">Owner</th>
                <th scope="col">Chain</th>
                <th scope="col">Standard</th>
                <th scope="col">Blind</th>
                <th className="text-center" scope="col">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {nft[0]?.data?.map((value, key) => {
                return (
                  <tr>
                    <td>
                      <div className="table_cart_ico">
                        <img src={value?.cloudinaryUrl} alt="" />
                      </div>
                    </td>
                    <td>
                      <span>{value?.name}</span>
                    </td>
                    <td>
                      <span>{value?.artist}</span>
                    </td>
                    <td>
                      <span>{value?.curation?.name}</span>
                    </td>
                    <td>
                      <div className="share_table">
                        <span>
                          <img src="assets/img/compas.svg" alt="" />
                        </span>{" "}
                        {value?.price}
                      </div>
                    </td>
                    <td>
                      <span>{value?.owner?.username}</span>
                    </td>
                    <td>
                      <span>Polygon</span>
                    </td>
                    <td>
                      <span>ERC721</span>
                    </td>
                    <td>
                      <div className="table_switch">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="flexSwitchCheckChecked"
                            defaultChecked={value?.active}
                            value={value?.active}
                            onChange={(e) =>
                              handleChageBlind(e.target.checked, value?._id)
                            }
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="table__dot__ico">
                        <span>
                          <img src="assets/img/menu_ico_1.svg" alt="" />
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination totalRecords={count} queryPagination={handlePagination} />
    </section>
  );
}

export default NFTs;
