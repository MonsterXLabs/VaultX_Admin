import { useEffect, useState } from "react";
import Dropdown from "../Dropdown/Dropdown";
import { NftCategoryServices } from "../../services/nftServices";
import { handleCopyClick, trimString, withdrawFunds } from "../../utils/helpers";
import { address } from "../../utils/contract";
import { useAccount } from "wagmi";
const ADMIN_ACCOUNT = "0x0dAb7232D6e7eF4c700A7F9D88f7612033061A15" //TODO: temporary fetch from chain

function FeeHistory() {
  const [feeHistory, setFeeHistory] = useState([]);
  const [totalPrice, setTotalPrice] = useState();
  const wallet = useAccount()

  const getFeeHistory = async () => {
    try {
      const nftService = new NftCategoryServices();
      const {
        data: { fees, totalPrice },
      } = await nftService.getFee({});
      console.log({ fees });
      setFeeHistory(fees);
      setTotalPrice(totalPrice);
    } catch (error) {
      console.log(error);
    }
  };
  const handleWithdrawFee = async () =>{
    if(ADMIN_ACCOUNT!=wallet.address){
      alert("you are not connected with admin wallet")
      return
    }
    await withdrawFunds(
        wallet.address
    )
    alert("Fees Withdrawn")
  }

  useEffect(() => {
    getFeeHistory();
  }, []);

  return (
    <>
      {" "}
      <div className="balance__area">
        <div className="single__balance__blk">
          <div className="balance__content">
            <h5>Fee Balance</h5>
            <div className="balance__text">
              <h5>
                <span>
                  <img src="assets/img/yellow_compas.svg" alt="" />
                </span>{" "}
                {totalPrice}
              </h5>
              <a href="#">
                <img src="assets/img/Refresh.svg" alt="" />
              </a>
            </div>
          </div>
        </div>
        <div className="single__balance__blk">
          <div className="balance__content">
            <h5>Accumulated Fees</h5>
            <div className="balance__text">
              <h5>
                <span>
                  <img src="assets/img/yellow_compas.svg" alt="" />
                </span>{" "}
                {totalPrice}
              </h5>
            </div>
          </div>
        </div>
      </div>
      <div className="categorie__btn mt-20">
          <a className="active" onClick={handleWithdrawFee}>
            Withdraw Fee
          </a>
          {/* <a href="#">Ethereum</a> */}
        </div>
      <div className="wallet__address">
        <h4>Admin wallet address:</h4>
        <div className="copy__text__area wallet__address__copy">
          <div className="copy-text">
            <input
              type="text"
              className="text"
              defaultValue={ADMIN_ACCOUNT}
              onClick={() => handleCopyClick(address)}
            />
            <button onClick={() => handleCopyClick(address)}>
              <img src="assets/img/copy-ico.svg" alt="" />
            </button>
          </div>
          {/* <a href="#" className="wallet__edit">
            <img src="assets/img/pencil_alt.svg" alt="" />
          </a> */}
        </div>
      </div>
      <div className="fee__list">
        <h4>Fee List</h4>
      </div>
      <div className="dashboard__table__wrapper">
        <div className="dashboard__table mt-10">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Artworks</th>
                <th scope="col">Fee</th>
                <th scope="col">Price</th>
                <th scope="col">From </th>
                <th scope="col">To</th>
                <th scope="col">Date</th>
                <th scope="col">Time</th>
              </tr>
            </thead>
            <tbody>
              {feeHistory.length > 0 &&
                feeHistory.map((value, index) => {
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
      {/* <div className="table__bottom__area">
        <div className="table__bottom__select">
          <p>Showing</p>
          <div className="categorie__select select_black_bg">
            <Dropdown data={[1, 2, 3, 4]} />
          </div>
          <p>of 50</p>
        </div>
        <div className="table__pagination">
          <ul>
            <li>
              <a href="#">
                <img src="assets/img/double_angle_left.svg" alt="" />
              </a>
            </li>
            <li>
              <a href="#">
                <img src="assets/img/angle_left.svg" alt="" />
              </a>
            </li>
            <li className="active">
              <a href="#">1</a>
            </li>
            <li>
              <a href="#">2</a>
            </li>
            <li>
              <a href="#">3</a>
            </li>
            <li className="border-none">
              <a href="#">...</a>
            </li>
            <li>
              <a href="#">10</a>
            </li>
            <li>
              <a href="#">
                <img src="assets/img/angle_right.svg" alt="" />
              </a>
            </li>
            <li>
              <a href="#">
                <img src="assets/img/double_angle_right.svg" alt="" />
              </a>
            </li>
          </ul>
        </div>
      </div> */}
    </>
  );
}

export default FeeHistory;
