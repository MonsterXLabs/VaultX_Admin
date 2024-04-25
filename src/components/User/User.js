import { useEffect, useState } from "react";
import Dropdown from "../Dropdown/Dropdown";
import { UserCategoryServices } from "../../services/userServices";
import Pagination from "../Pagination/Pagination";
import Search from "../Search/Seach";
import Header from "../Header/Header";
import { handleCurator } from "../../utils/helpers";
import { useAccount } from "wagmi";

const userList = {
  "Latest Registered": { created: -1 },
  Curator: { isCurator: true },
  Blind: { active: true },
};

function User(props) {
  const [users, setUser] = useState([]);
  const [count, setCount] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(5);
  const [searchInput, setSearchInput] = useState("");
  const { address } = useAccount();
  const [value, setValue] = useState("");

  const userServices = new UserCategoryServices();
  const list = ["Latest Registered", "Curator", "Blind"];

  const getAllUsers = async () => {
    const {
      data: { user = [{}], userMeta = 0 },
    } = await userServices.getAllUsers({
      skip,
      limit,
      searchInput,
      filter: userList[value],
    });
    setCount(userMeta);
    console.log('userrr',user)
    setUser(user);
  };

  const handleChangeCurator = async (curator, isCurator, userId) => {
    try {
      await handleCurator(curator, isCurator, address);
      await userServices.handleCurator({ userId, isCurator });
      await getAllUsers();
    } catch (error) {
      console.log({ error });
      await getAllUsers();
    }
  };

  const handleChageBlind = async (isActive, userId) => {
    try {
      await userServices.handleUser({ userId, isActive });
      await getAllUsers();
    } catch (error) {
      console.log({ error });
      await getAllUsers();
    }
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

  useEffect(() => {
    console.log({ value });
    getAllUsers();
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
                      <span>{value?.createdAt}</span>
                    </td>
                    <td>
                      <span>1</span>
                    </td>
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

export default User;
