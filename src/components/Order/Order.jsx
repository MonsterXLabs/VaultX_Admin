import { useEffect, useState } from "react";
import Dropdown from "../Dropdown/Dropdown";
import { NftCategoryServices } from "../../services/nftServices";
import Header from "../Header/Header";
import { getEventArray, releaseEscrowAdmin } from "../../utils/helpers";
// import * as bootstrap from "bootstrap";
import Pagination from "../Pagination/Pagination";
// import * as bootstrap from "bootstrap"
import { useActiveAccount } from "thirdweb/react";

const listOption = {
  "Price : Low to high": { price: 1 },
  "Price : High to low": { price: -1 },
  "Ordered Latest": { createdAt: -1 },
};

function Order(props) {
  const list = ["Price : Low to high", "Price : High to low", "Ordered Latest"];
  const [search, setSearch] = useState("");
  const [value, setValue] = useState("");
  const [limitPastOrders, setLimitPastOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [days, setDays] = useState("");
  const [count, setCount] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(5);
  const [viewOrder, setViewOrder] = useState("");
  const [messageSliceBuyer, setMessageSliceBuyer] = useState(true);
  const [messageSliceSeller, setMessageSliceSeller] = useState(true);
  const activeAccount = useActiveAccount();

  const getAllOrders = async () => {
    try {
      const nftService = new NftCategoryServices();
      const {
        data: { nfts, count },
      } = await nftService.getAllOrders({
        skip, limit,
        searchInput: search,
        filter: listOption[value],
      });
      console.log({ nfts });
      setOrders(nfts);
      setCount(count)
    } catch (error) {
      console.log(error);
    }
  };

  const handlePagination = async ({ recordsToSkip, recordsToGet }) => {
    setSkip(recordsToSkip);
    setLimit(recordsToGet);
  };

  const getOrderPastLimit = async () => {
    try {
      const nftService = new NftCategoryServices();
      const {
        data: { nfts },
      } = await nftService.getAllOrders({ days });
      console.log({ nfts });
      setLimitPastOrders(nfts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, [search, value]);

  useEffect(() => {
    getOrderPastLimit();
  }, [days]);

  const handleMessageBuyer = () => {
    setMessageSliceBuyer(!messageSliceBuyer);
  };

  const handleMessageSeller = () => {
    setMessageSliceSeller(!messageSliceSeller);
  };

  const releaseEscorw = async () => {
    console.log({ viewOrder });
    try {
      const { logs, transactionHash } = await releaseEscrowAdmin(
        viewOrder?.tokenId,
        true,
        viewOrder?.saleId?.requestEscrowId?.reason
          ? viewOrder?.saleId?.requestEscrowId?.reason
          : "",
        activeAccount,
      );
      let eventRoyaltyReceived = getEventArray(logs, "RoyaltyReceived");
      let eventPaymentSplitReceived = getEventArray(
        logs,
        "PaymentSplitReceived",
      );
      let escrowReleasedReceived = getEventArray(logs, "EscrowReleased");
      let feeReceived = getEventArray(logs, "FeeReceived");
      const newArr = [
        ...eventRoyaltyReceived,
        ...eventPaymentSplitReceived,
        ...escrowReleasedReceived,
        ...feeReceived,
      ];
      let states = [];
      for (const arr of newArr) {
        if (
          arr.eventName === "RoyaltyReceived" &&
          Number(arr?.args?.royaltyAmount) !== 0
        ) {
          const data = {
            nftId: viewOrder?._id,
            state: "Royalty Received",
            from: viewOrder?.saleId?.saleWinner,
            toWallet: arr?.args?.wallet,
            date: new Date(),
            actionHash: transactionHash,
            price: Number(arr?.args?.royaltyAmount) / Math.pow(10, 18),
          };
          states.push(data);
        }
        if (
          arr.eventName === "PaymentSplitReceived" &&
          Number(arr?.args?.feeAmount) !== 0
        ) {
          const data = {
            nftId: viewOrder?._id,
            state: "Payment Received",
            from: viewOrder?.saleId?.saleWinner,
            toWallet: arr?.args?.wallet,
            date: new Date(),
            actionHash: transactionHash,
            price: Number(arr?.args?.feeAmount) / Math.pow(10, 18),
          };
          states.push(data);
        }
        if (
          arr.eventName === "EscrowReleased" &&
          Number(arr?.args?.feeAmount) !== 0
        ) {
          const data = {
            nftId: viewOrder?._id,
            state: "Escrow Payment Received",
            from: viewOrder?.saleId?.saleWinner,
            toWallet: arr?.args?.seller,
            date: new Date(),
            to: viewOrder?.owner,
            actionHash: transactionHash,
            price: Number(arr?.args?.amount) / Math.pow(10, 18),
          };
          states.push(data);
        }
        if (
          arr.eventName === "FeeReceived" &&
          Number(arr?.args?.feeAmount) !== 0
        ) {
          const data = {
            nftId: viewOrder?._id,
            state: "Fee Received",
            from: viewOrder?.saleId?.saleWinner,
            toWallet: arr?.args?.buyer,
            date: new Date(),
            actionHash: transactionHash,
            price: Number(arr?.args?.feeAmount) / Math.pow(10, 18),
          };
          states.push(data);
        }
      }
      const nftService = new NftCategoryServices();
      const data = {
        nftId: viewOrder?._id,
        transactionHash: transactionHash,
        states,
      };
      await nftService.releaseOrder(data);
    } catch (error) {
      console.log(error);
    }
  };

  const cancelEscorw = async () => {
    try {
      console.log("here in cancel escrow")
      const { transactionHash } = await releaseEscrowAdmin(
        viewOrder?.tokenId,
        false,
        viewOrder?.saleId?.requestEscrowId?.reason
          ? viewOrder?.saleId?.requestEscrowId?.reason
          : "",
        activeAccount,
      );
      const nftService = new NftCategoryServices();
      const data = {
        nftId: viewOrder?._id,
        transactionHash: transactionHash,
      };
      await nftService.releaseOrder(data);
    } catch (error) {
      console.log(document.getElementById('exampleModalToggle'))
      // document.getElementById('exampleModalToggle').classList.remove('show');
      // document.getElementById('exampleModalToggle').style.display = "none"
      
      // document.getElementById('exampleModalToggle2').classList.remove('show');
      // document.getElementById('exampleModalToggle2').style.display = "none"
      // document.getElementsByClassName("modal-backdrop").classList.remove("show");
      console.log(error);
      //  errElem.hide();
    }
  };

  return (
    <>
      <section className="dashboard__area">
        {props.render}
        <Header />
        <div className="dashboard__admin__area">
          <div className="admin__inner__blk">
            <div className="admin__content mb-30">
              <h4>Order Needing Management</h4>
              <p>
                You will see a list of transactions that have exceeded the
                escrow period specified in the below field.{" "}
              </p>
            </div>
            <div className="exceeding__area">
              <div className="exceeding__text">
                <h4>List of transactions exceeding</h4>
              </div>
              <div className="exceeding__form">
                <input
                  type="text"
                  placeholder={0}
                  value={days}
                  onChange={(e) =>
                    setDays(Number(e.target.value) >= 0 ? e.target.value : "")
                  }
                />
                <button
                  data-bs-toggle="modal"
                  href="#"
                  type="button"
                  className="common__btn"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard__table__wrapper">
          <div className="dashboard__table mt-10">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Title</th>
                  <th scope="col">Payment Date</th>
                  <th scope="col">Escrow Period</th>
                  <th scope="col">Status</th>
                  <th className="text-center" scope="col">
                    Message
                  </th>
                </tr>
              </thead>
              <tbody>
                {limitPastOrders?.map((order, index) => {
                  const day =
                    new Date().getTime() -
                    new Date(order?.saleId?.ItemPurchasedOn).getTime();
                  return (
                    <tr>
                      <td>
                        <div className="table__inner__dropdown__area">
                          <span>#{order?._id}</span>
                        </div>
                      </td>
                      <td>
                        <div className="table_cart_ico">
                          <img src={order?.cloudinaryUrl} alt="" />
                          <span>{order?.name}</span>
                        </div>
                      </td>
                      <td>
                        {" "}
                        {order?.saleId?.ItemPurchasedOn
                          ? new Date(order?.saleId?.ItemPurchasedOn)
                            .toLocaleString()
                            .slice(0, 10)
                          : "-/-"}
                      </td>
                      <td>
                        <span>Day {Math.round(day / (1000 * 3600 * 24))}</span>
                      </td>
                      <td>
                        <span>In Escrow</span>
                      </td>
                      <td>
                        <div className="table__dot__ico">
                          <a
                            data-bs-toggle="modal"
                            href="#exampleModalToggle4"
                            id="exampleModalToggle41"
                            type="button"
                            onClick={() => setViewOrder(order)}
                          >
                            View
                          </a>
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
                                onClick={() => setViewOrder(order)}
                              >
                                View Message
                              </a>
                            </li>
                            <li>
                              <a
                                className="dropdown-item"
                                href="#exampleModalToggle"
                                data-bs-toggle="modal"
                                type="button"
                                onClick={() => setViewOrder(order)}
                              >
                                Release Escrow
                              </a>
                            </li>
                            <li>
                              <a
                                className="dropdown-item"
                                href="#exampleModalToggle2"
                                data-bs-toggle="modal"
                                type="button"
                                onClick={() => setViewOrder(order)}
                              >
                                Cancel Transaction
                              </a>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="dashboard__admin__area pt-70">
          <div className="admin__inner__blk">
            <div className="admin__content">
              <h5>All Orders</h5>
            </div>
          </div>
        </div>
        <div className="search__area flex__all_order">
          <form action="#">
            <button type="button" className="search_btn">
              <i className="far fa-search" />
            </button>
            <input
              type="text"
              placeholder="Search by name or trait... "
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <div className="price__filter__select">
            <div className="categorie__select select_black_bg">
              <Dropdown data={list} value={value} setValue={setValue} />
            </div>
          </div>
        </div>
        <div className="dashboard__table__wrapper">
          <div className="dashboard__table mt-10">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Title</th>
                  <th scope="col">Payment Date</th>
                  <th scope="col">Escrow Period</th>
                  <th scope="col">Status</th>
                  <th className="text-center" scope="col">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((order, index) => {
                  const day =
                    new Date().getTime() -
                    new Date(order?.saleId?.ItemPurchasedOn).getTime();
                  return (
                    <tr>
                      <td>
                        <div className="table__inner__dropdown__area">
                          <span>#{order?._id}</span>
                        </div>
                      </td>
                      <td>
                        <div className="table_cart_ico">
                          <img src={order?.cloudinaryUrl} alt="" />
                          <span>{order?.name}</span>
                        </div>
                      </td>
                      <td>
                        {" "}
                        {order?.saleId?.ItemPurchasedOn
                          ? new Date(order?.saleId?.ItemPurchasedOn)
                            .toLocaleString()
                            .slice(0, 10)
                          : "-/-"}
                      </td>
                      <td>
                        <span>Day {Math.round(day / (1000 * 3600 * 24))}</span>
                      </td>
                      <td>
                        <span>In Escrow</span>
                      </td>
                      <td>
                        <div className="table__dot__ico">
                          <a
                            data-bs-toggle="modal"
                            href="#exampleModalToggle4"
                            type="button"
                            onClick={() => setViewOrder(order)}
                          >
                            View
                          </a>
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
                                onClick={() => setViewOrder(order)}
                              >
                                View Message
                              </a>
                            </li>
                            <li>
                              <a
                                className="dropdown-item"
                                href="#exampleModalToggle"
                                data-bs-toggle="modal"
                                type="button"
                                onClick={() => setViewOrder(order)}
                              >
                                Release Escrow
                              </a>
                            </li>
                            <li>
                              <a
                                className="dropdown-item"
                                href="#exampleModalToggle2"
                                data-bs-toggle="modal"
                                type="button"
                                onClick={() => setViewOrder(order)}
                              >
                                Cancel Transaction
                              </a>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination totalRecords={count} queryPagination={handlePagination} limit={limit} />
        </div>

      </section>
      {/* =================== DASHBOARD BODY AREA END ===================== */}
      <div
        className="modal  common__popup__blk"
        id="exampleModalToggle"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <div className="popup__inner__blk">
                <div className="popup__common__title text-center">
                  <h4>Are you sure you want to release escrow?</h4>
                  <p>
                    Consectetur a facilisis sed massa nisi. Diam luctus montes
                    sed pharetra enim leo magna.
                  </p>
                </div>
                <div className="popup__similar__form">
                  <div className="popup__similar__btn">
                    <div className="edit__profile__bottom__btn">
                      <a
                        href="#exampleModalToggle"
                        className="cancel"
                        data-bs-toggle="modal"
                      >
                        Cancel
                      </a>
                      <a
                        // data-bs-target="#exampleModalToggle2"
                        // data-bs-toggle="modal"
                        // data-bs-dismiss="modal"
                        href="#"
                        onClick={() => releaseEscorw()}
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
      <div
        className="modal  common__popup__blk"
        id="exampleModalToggle2"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <div className="popup__inner__blk">
                <div className="popup__common__title text-center">
                  <h4>Are you sure you want to Cancel the Transaction?</h4>
                  <p>
                    Consectetur a facilisis sed massa nisi. Diam luctus montes
                    sed pharetra enim leo magna.
                  </p>
                </div>
                <div className="popup__similar__form">
                  <div className="popup__similar__btn">
                    <div className="edit__profile__bottom__btn">
                      <a
                        className="cancel"
                        href="#exampleModalToggle2"
                        data-bs-toggle="modal"
                        type="button"
                      >
                        Cancel
                      </a>
                      <a
                        // data-bs-target="#exampleModalToggle2"
                        // data-bs-toggle="modal"
                        // data-bs-dismiss="modal"
                        href="#"
                        onClick={() => cancelEscorw()}
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
      <div
        className="modal fade common__popup__blk"
        id="exampleModalToggle4"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <div className="popup__inner__blk">
                <div className="buyer__info__area">
                  <div className="buyer__title">
                    <h4>
                      <span>
                        <img src="assets/img/byer_ico.svg" alt="" />
                      </span>{" "}
                      Buyer Information
                    </h4>
                  </div>
                  <div className="buyer__content">
                    <p>
                      Name{" "}
                      <span className="yellow_color">
                        {viewOrder?.saleId?.buyerShippingId?.name}
                      </span>
                    </p>
                    <p>
                      Email{" "}
                      <span className="yellow_color">
                        {viewOrder?.saleId?.buyerShippingId?.email}
                      </span>
                    </p>
                    <p>
                      Phone{" "}
                      <span>
                        {viewOrder?.saleId?.buyerShippingId?.phoneNumber}
                      </span>
                    </p>
                    <p>
                      Street Address{" "}
                      <span>
                        {viewOrder?.saleId?.buyerShippingId?.address?.line1}{" "}
                        {viewOrder?.saleId?.buyerShippingId?.address?.line2}
                      </span>
                    </p>
                    <p>
                      Postal Address{" "}
                      <span>
                        {
                          viewOrder?.saleId?.buyerShippingId?.address
                            ?.postalCode
                        }
                      </span>
                    </p>
                    <p>
                      City{" "}
                      <span>
                        {viewOrder?.saleId?.buyerShippingId?.address?.city}
                      </span>
                    </p>
                    <p>
                      State{" "}
                      <span>
                        {viewOrder?.saleId?.buyerShippingId?.address?.state}
                      </span>
                    </p>
                    <p>
                      Country{" "}
                      <span>{viewOrder?.saleId?.buyerShippingId?.country}</span>
                    </p>
                  </div>
                  <div className="byer_massage mb-35">
                    <h4>Buyer’s message</h4>
                    <p>
                      {messageSliceBuyer
                        ? viewOrder?.saleId?.buyerShippingId?.contactInformation
                          ?.length > 200
                          ? viewOrder?.saleId?.buyerShippingId?.contactInformation?.slice(
                            0,
                            200,
                          )
                          : viewOrder?.saleId?.buyerShippingId
                            ?.contactInformation
                        : viewOrder?.saleId?.buyerShippingId
                          ?.contactInformation}{" "}
                      <a href="#" onClick={handleMessageBuyer}>
                        ... {messageSliceBuyer ? "see less" : "see more"}
                      </a>
                    </p>
                  </div>
                  <div className="buyer__title mb-0 border-0">
                    <h4>
                      <span>
                        <img src="assets/img/byer_ico.svg" alt="" />
                      </span>{" "}
                      Seller Information
                    </h4>
                  </div>
                  <div className="buyer__content mb-0 border-0">
                    <p>
                      Name{" "}
                      <span className="yellow_color">
                        {viewOrder?.saleId?.sellerShippingId?.name}
                      </span>
                    </p>
                    <p>
                      Email{" "}
                      <span className="yellow_color">
                        {viewOrder?.saleId?.sellerShippingId?.email}
                      </span>
                    </p>
                    <p>
                      Phone{" "}
                      <span>
                        {viewOrder?.saleId?.sellerShippingId?.phoneNumber}
                      </span>
                    </p>
                    <p>
                      Street Address{" "}
                      <span>
                        {viewOrder?.saleId?.sellerShippingId?.address?.line1}{" "}
                        {viewOrder?.saleId?.sellerShippingId?.address?.line2}
                      </span>
                    </p>
                    <p>
                      Postal Address{" "}
                      <span>
                        {
                          viewOrder?.saleId?.sellerShippingId?.address
                            ?.postalCode
                        }
                      </span>
                    </p>
                    <p>
                      City{" "}
                      <span>
                        {viewOrder?.saleId?.sellerShippingId?.address?.city}
                      </span>
                    </p>
                    <p>
                      State{" "}
                      <span>
                        {viewOrder?.saleId?.sellerShippingId?.address?.state}
                      </span>
                    </p>
                    <p>
                      Country{" "}
                      <span>
                        {viewOrder?.saleId?.sellerShippingId?.country}
                      </span>
                    </p>
                  </div>
                  <div className="byer_massage mb-35">
                    <h4>Seller’s message</h4>
                    <p>
                      {messageSliceSeller
                        ? viewOrder?.saleId?.sellerShippingId
                          ?.contactInformation?.length > 200
                          ? viewOrder?.saleId?.sellerShippingId?.contactInformation?.slice(
                            0,
                            200,
                          )
                          : viewOrder?.saleId?.sellerShippingId
                            ?.contactInformation
                        : viewOrder?.saleId?.sellerShippingId
                          ?.contactInformation}{" "}
                      <a href="#" onClick={handleMessageSeller}>
                        ... {messageSliceSeller ? "see less" : "see more"}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Order;
