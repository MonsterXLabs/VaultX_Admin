import * as XLSX from 'xlsx';
import { useEffect, useState } from "react";
import Dropdown from "../Dropdown/Dropdown";
import { UserCategoryServices } from "../../services/userServices";
import Pagination from "../Pagination/Pagination";
import Search from "../Search/Seach";
import Header from "../Header/Header";
import { handleCurator, handleAdmin } from "../../utils/helpers";
import useDebounce from "../../customHooks/useDebounce";
import { useActiveAccount } from "thirdweb/react";

const userList = {
  "Joinday: low to high": { createdAt: 1 },
  "Joinday: high to low": { createdAt: -1 },
  "Txn count: high to low": { txnCount: -1 },
  Curator: { isCurator: true },
  Blind: { active: false },
};

function User(props) {
  const [users, setUser] = useState([]);
  const [count, setCount] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(5);
  const [searchInput, setSearchInput] = useState("");
  const [value, setValue] = useState("");
  const activeAccount = useActiveAccount();
  const [selectedId, setSelectedId] = useState("");

  const userServices = new UserCategoryServices();
  const list = ["Joinday: low to high", "Joinday: high to low", "Txn count: high to low", "Curator", "Blind"];

  // const GenerateExcelOfData = () => {
  //   const worksheet = XLSX.utils.json_to_sheet(users);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
  //   XLSX.writeFile(workbook, 'users.xlsx');
  // }

  const getAllUsers = async () => {
    const {
      data: { totalData = [], totalCount },
    } = await userServices.getAllUsers({
      skip,
      limit,
      searchInput,
      filter: userList[value],
    });
    setCount(totalCount?.[0]?.count);
    setUser(totalData);
  };

  const handleChangeCurator = async (curator, isCurator, userId) => {
    try {
      // await handleCurator(curator, isCurator, activeAccount);
      await userServices.handleCurator({ userId, isCurator });
      await getAllUsers();
    } catch (error) {
      console.log({ error });
      await getAllUsers();
    }
  };

  const handleChangeAdmin = async (admin, isAdmin, userId) => {
    try {
      await handleAdmin(admin, isAdmin, activeAccount);
      await userServices.handleAdmin({ userId, isAdmin });
      await getAllUsers();
    } catch (error) {
      console.log({ error });
      await getAllUsers();
    }
  }

  const handleChageBlind = async (isActive, userId) => {
    try {
      await userServices.handleUser({ userId, isActive });
      await getAllUsers();
    } catch (error) {
      console.log({ error });
      await getAllUsers();
    }
  };

  const handleDelete = async () => {
    try {
      await userServices.handleDelete(selectedId ?? "");
      await getAllUsers();
    } catch (error) {
      console.log({ error });
      await getAllUsers();
    }
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handlePagination = async ({ recordsToSkip, recordsToGet }) => {
    setSkip(recordsToSkip);
    setLimit(recordsToGet);
  };

  const handelSearchResult = async ({ debounceSearchInput }) => {
    // if (debounceSearchInput.length > 0) {
    setSearchInput(debounceSearchInput);
    // }
  };

  const debounceSearch = useDebounce(getAllUsers, 1000)
  useEffect(() => {
    // console.log({ value });
    debounceSearch();
  }, [count, skip, limit, searchInput, value]);

  return (
    <section className="dashboard__area">
      {props.render}
      <Header />
      <div className="dashboard__admin__area">
        <div className="admin__inner__blk">
          <div className="admin__content">
            <h4>User Management</h4>
          </div>
        </div>
        {/* <button onClick={GenerateExcelOfData}>Download Excel</button> */}
      </div>

      <Search
        handelSearchResult={handelSearchResult}
        placeholder={"hi there "}
      />
      <div className="price__filter__blk">
        <div className="price__filter__select">
          <div className="categorie__select select_black_bg">
            <Dropdown data={list} value={value} setValue={setValue} />
          </div>
        </div>
        <div className="user__price__code">
          <h4>{count} Users</h4>
        </div>
      </div>
      <div className="dashboard__table__wrapper">
        <div className="dashboard__table mt-10">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Icon</th>
                <th scope="col">Nickname</th>
                <th scope="col">E-mail</th>
                <th scope="col">Join Day </th>
                <th scope="col">Txn Count</th>
                {/* <th scope="col">Admin</th> */}
                <th scope="col">Curator</th>
                <th scope="col">Blind</th>
                <th className="text-center" scope="col">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((value, key) => {
                return (
                  <tr>
                    <td>
                      <div className="table_cart_ico">
                        <img src="assets/img/cart_ico_1.png" alt="" />
                      </div>
                    </td>
                    <td>
                      <span>{value?.username}</span>
                    </td>
                    <td>
                      <span>{value?.email}</span>
                    </td>
                    <td>
                      <span>{formatDate(value?.createdAt)}</span>
                    </td>
                    <td>
                      <span>{value?.txnCount}</span>
                    </td>
                    {/* <td>
                      <div className="table_switch">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="flexSwitchCheckChecked"
                            defaultChecked={value?.isAdmin}
                            checked={value?.isAdmin}
                            onChange={(e) =>
                              handleChangeAdmin(
                                value?.wallet,
                                e.target.checked,
                                value?._id,
                              )
                              // console.log(e.target.checked)
                            }
                          />
                        </div>
                      </div>
                    </td> */}
                    <td>
                      <div className="table_switch">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="flexSwitchCheckChecked"
                            defaultChecked={value?.isCurator}
                            checked={value?.isCurator}
                            onChange={(e) =>
                              handleChangeCurator(
                                value?.wallet,
                                e.target.checked,
                                value?._id,
                              )
                              // console.log(e.target.checked)
                            }
                          />
                        </div>
                      </div>
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
                              handleChageBlind(!e.target.checked, value?._id)
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
                        <a
                          data-bs-toggle="modal"
                          href="#exampleModalToggl5"
                          type="button"
                          onClick={() => { setSelectedId(value?._id) }}
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
                    Are you sure to delete current user?
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

export default User;
