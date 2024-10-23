import { useEffect, useState } from "react";
import { NftCategoryServices } from "../../services/nftServices";
import Dropdown from "../Dropdown/Dropdown";
import Search from "../Search/Seach";
import Pagination from "../Pagination/Pagination";
import Header from "../Header/Header";
import useDebounce from "../../customHooks/useDebounce";
import { CreateNftServices } from "@/services/userNftService";

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
  const [selected, setSelected] = useState({});
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
    console.log('nft', nfts);
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

  const handleDelete = async () => {
    if (!selected || !selected._id)
      return;
    await nftServices.removeAdminFromDb({
      nftId: selected?._id,
    });
    getAllNft();
  }

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
  const debounce = useDebounce(getAllNft, 1000)
  useEffect(() => {
    console.log({ searchInput });
    debounce();
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
                <th scope="col">Minted</th>
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
                      <span>{value?.curationInfo[0]?.name}</span>
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
                      <span>{value?.ownerInfo[0]?.username}</span>
                    </td>
                    <td>
                      <span>{value?.minted ? "YES" : "NO"}</span>
                    </td>
                    <td>
                      <span>Base</span>
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
                            checked={value?.active}
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
                        <span
                          className="table_edit_dropdown"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <img src="assets/img/menu_ico_1.svg" alt="" />
                        </span>
                        <ul className="dropdown-menu dropdown-menu-end similar__dropdown">
                          <li>
                            <a
                              className="dropdown-item"
                              data-bs-toggle="modal"
                              href="#exampleModalToggle4"
                              type="button"
                              onClick={() => { }}
                            >
                              View Message
                            </a>
                          </li>
                          <a
                            data-bs-toggle="modal"
                            href="#exampleModalToggle4"
                            id="exampleModalToggle41"
                            type="button"
                            onClick={() => { setSelected(value) }}
                          >
                            Delete
                          </a>
                        </ul>
                        <a
                          data-bs-toggle="modal"
                          href="#exampleModalToggl5"
                          type="button"
                          onClick={() => { setSelected(value) }}
                        >
                          Delete
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div
        className="modal fade common__popup__blk"
        id="exampleModalToggl5"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <div className="popup__inner__blk">
                <div className="popup__common__title text-center">
                  <h4>
                    Are you sure to delete current RWA?
                  </h4>
                  <p>
                    This decision is irreversible.<br />Would you like to proceed anyway?
                  </p>
                </div>
                <div className="popup__similar__form">
                  <div className="popup__similar__btn">
                    <div className="edit__profile__bottom__btn">
                      <a
                        className="cancel"
                        href="#confirmModal"
                        data-bs-toggle="modal"
                        data-bs-dismiss="modal"
                        type="button"
                      >
                        Cancel
                      </a>
                      <a
                        data-bs-target="#exampleModalToggl5"
                        data-bs-toggle="modal"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete();
                        }}
                      >
                        Proceed
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Pagination totalRecords={count} queryPagination={handlePagination} limit={limit} />
    </section>
  );
}

export default NFTs;
