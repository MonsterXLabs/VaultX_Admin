import { useEffect, useState } from "react";
import { CreateAdministratorServices } from "../../services/services";
import _ from "lodash";
import Pagination from "../Pagination/Pagination";

const getArray = (total) => {
  const items = [];
  for (let i = 1; i <= total; i++) {
    items.push(i);
  }
  return items;
};

function List({ handelEditAdnim }) {
  const [data, setData] = useState([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(5);
  const [count, setCount] = useState(0);

  const getAdmins = async () => {
    const administratorService = new CreateAdministratorServices();
    const { data: { administrators = [{}], total = 0 } = {} } =
      await administratorService.getAllAdmins({ skip, limit });
    setData(administrators);
    setCount(total);
  };

  const handlePagination = async ({ recordsToSkip, recordsToGet }) => {
    setSkip(recordsToSkip);
    setLimit(recordsToGet);
  };

  useEffect(() => {
    getAdmins();
  }, [skip, limit, count]);
  return (
    <>
      <div className="dashboard__table__wrapper regular_td">
        <div className="dashboard__table mt-10">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">No.</th>
                <th scope="col">Authority</th>
                <th scope="col">Permission Count</th>
                <th scope="col">Name</th>
                <th scope="col">Team</th>
                <th scope="col">ID</th>
                <th scope="col">Last Sign In</th>
                <th scope="col">Last Sign Out</th>
                <th scope="col">IP</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.length > 0 &&
                data?.map((value, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <span>{index + 1}</span>
                      </td>
                      <td>
                        <span>{_.capitalize(value?.role)}</span>
                      </td>
                      <td>
                        <span>{value?.access?.length}</span>
                      </td>
                      <td>
                        <span>{value?.name}</span>
                      </td>
                      <td>
                        <span>{value?.team}</span>
                      </td>
                      <td>
                        <span>{value?.id}</span>
                      </td>
                      <td>
                        <span>
                          {value?.lastSignIn &&
                            new Date(value?.lastSignIn).toLocaleString(
                              "en-IN",
                              {
                                hour12: false,
                              }
                            )}
                        </span>
                      </td>
                      <td>
                        <span>
                          {value?.lastSignOut &&
                            new Date(value?.lastSignOut).toLocaleString(
                              "en-IN",
                              {
                                hour12: false,
                              }
                            )}
                        </span>
                      </td>
                      <td>
                        <span>{value?.ip}</span>
                      </td>
                      <td>
                        <div className="table_edit_ico">
                          <a href="#" onClick={() => handelEditAdnim(value)}>
                            <img src="assets/img/pencil_alt.svg" alt="" />
                          </a>
                          <a href="#">
                            <img src="assets/img/trash.svg" alt="" />
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

      <Pagination totalRecords={count} queryPagination={handlePagination} />
    </>
  );
}

export default List;
