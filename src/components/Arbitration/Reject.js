import React from "react";
import { trimString } from "../../utils/helpers";
import Search from "../Search/Seach";

const Reject = () => {
  const [arbData, setArbData] = React.useState([]);
  const handleSearch = (value) => {
    console.log({ value });
  };
  return (
    <div>
      <Search
        handelSearchResult={handleSearch}
        placeholder="Search by name or trait ..."
      />
      <div className="dashboard__table__wrapper">
        <div className="dashboard__table mt-10">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Type</th>
                <th scope="col">Title</th>
                <th scope="col">Escrow No</th>
                <th scope="col">Application No </th>
                <th scope="col">RequestDate</th>
                <th scope="col">Transaction Date</th>
                <th scope="col">Contents</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {arbData.length > 0 &&
                arbData.map((value, index) => {
                  console.log({ value });
                  return (
                    <tr>
                      <td>
                        <div className="table_cart_ico">
                          <img src={value?.nftId?.cloudinaryUrl} alt="" />
                          <span>{value?.nftId?.name}</span>
                        </div>
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
                        <div className="share_table">
                          <span>
                            <img src="assets/img/compas.svg" alt="" />
                          </span>{" "}
                          {value?.nftId?.price}
                        </div>
                      </td>
                      <td>
                        <span>
                          {" "}
                          {value?.from?.username
                            ? value.from.username
                            : value?.from?.wallet
                            ? trimString(value.from.wallet)
                            : value?.fromWallet
                            ? trimString(value?.fromWallet)
                            : "-/-"}
                        </span>
                      </td>
                      <td>
                        <span>
                          {value?.to?.username
                            ? value?.to?.username
                            : value?.to?.wallet
                            ? trimString(value.to.wallet)
                            : value?.toWallet
                            ? trimString(value?.toWallet)
                            : "-/-"}
                        </span>
                      </td>
                      <td>
                        {value?.createdAt
                          ? new Date(value?.createdAt)
                              .toLocaleString()
                              .slice(0, 10)
                          : "-/-"}
                      </td>
                      <td>
                        <span>
                          {value?.createdAt
                            ? new Date(value.createdAt).toLocaleTimeString()
                            : "-/-"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reject;
