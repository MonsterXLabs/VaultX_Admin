import { useEffect, useState } from "react";
import { CreateCurationServices } from "../../services/curationServices";
import Dropdown from "../Dropdown/Dropdown";
import Pagination from "../Pagination/Pagination";
import Header from "../Header/Header";
import { trimString } from "../../utils/helpers";

const curationList = {
  "Recently listed": { createdAt: -1 },
  Blind: { active: true },
};

function Curation(props) {
  const list = ["Recently listed", "Blind"];
  const curationServices = new CreateCurationServices();
  const [curation, setCuration] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selected, setSelected] = useState({});
  const [count, setCount] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(5);
  const [value, setValue] = useState("");

  const getAllCurations = async () => {
    const { data: { curations = [{}], curationCount = 0 } = {} } =
      await curationServices.getAllCollections({
        searchInput,
        skip,
        limit,
        filter: curationList[value],
      });
    setCount(curationCount);
    setCuration(curations);
  };

  const handlePagination = async ({ recordsToSkip, recordsToGet }) => {
    console.log(recordsToSkip, recordsToGet);
    setSkip(recordsToSkip);
    setLimit(recordsToGet);
  };

  const handleChageBlind = async (isActive, curationId) => {
    console.log({ curationId });
    try {
      await curationServices.handleCuration({ curationId, !isActive });
    await getAllCurations();
  } catch (error) {
    console.log({ error });
    await getAllCurations();
  }
};

const handleDelete = async () => {
  if (!selected || !selected._id)
    return;
  await curationServices.handleDeleteAdmin({
    curationId: selected?._id,
  });
  getAllCurations();
}

useEffect(() => {
  getAllCurations();
}, [count, skip, limit, searchInput, value]);

return (
  <section className="dashboard__area">
    {props.render}
    <Header />
    <div className="dashboard__admin__area">
      <div className="admin__inner__blk">
        <div className="admin__content">
          <h4>Curation Management 1</h4>
        </div>
      </div>
    </div>
    <div className="search__area">
      <form action="#">
        <button type="button" className="search_btn">
          <i className="far fa-search" />
        </button>
        <input
          type="text"
          placeholder="Search by name or trait... "
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </form>
    </div>
    <div className="price__filter__blk">
      <div className="price__filter__select">
        <div className="categorie__select select_black_bg">
          <Dropdown data={list} value={value} setValue={setValue} />
        </div>
      </div>
      <div className="user__price__code">
        <h4>{count} Curation</h4>
      </div>
    </div>
    <div className="dashboard__table__wrapper">
      <div className="dashboard__table mt-10">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Volume</th>
              {/* <th scope="col">Artwork</th> */}
              <th scope="col">Artist</th>
              <th scope="col">Chain</th>
              <th scope="col">Network</th>
              <th scope="col">Blind</th>
              <th className="text-center" scope="col">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {curation.map((value, index) => {
              return (
                <tr>
                  <td>
                    <div className="table_cart_ico">
                      <img src="assets/img/cart_ico_2.png" alt="" />
                      <span>{value?.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="share_table">
                      <span>
                        <img src="assets/img/compas.svg" alt="" />
                      </span>{" "}
                      {value?.volume}
                    </div>
                  </td>
                  {/* <td>
                  <span>{}</span>
                </td> */}
                  <td>
                    <span>
                      {value?.owner?.username
                        ? value?.owner?.username
                        : trimString(value?.owner?.wallet)}
                    </span>
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
                          defaultChecked={!value?.active}
                          checked={!value?.active}
                          value={!value?.active}
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
                    <a
                      data-bs-toggle="modal"
                      href="#exampleModalToggl5"
                      type="button"
                      onClick={() => { setSelected(value) }}
                    >
                      Delete
                    </a>
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
                  Are you sure to delete current Curation?
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

export default Curation;
