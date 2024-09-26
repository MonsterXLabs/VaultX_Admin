import { useEffect, useState } from "react";
import { DisputeServices } from "../../services/disputeServices";
import Header from "../Header/Header";
import Search from "../Search/Seach";
import useDebounce from "../../customHooks/useDebounce";
import Pagination from "../Pagination/Pagination";
import { exitEscrow, releaseEscrow, trimString } from "../../utils/helpers";
import { useActiveAccount } from "thirdweb/react";
import { NftCategoryServices } from "../../services/nftServices";
import { formatEther } from "viem";

const DisputeType = {
  CancelRequest: 1,
  ReleaseRequest: 2,
};

const DisputeStatus = {
  Pending: 1,
  Accepted: 2,
  Rejected: 3,
}

export function Abitration(props) {
  const activeAccount = useActiveAccount();

  const [status, setStatus] = useState(DisputeStatus.Pending);
  const [disputes, setDisputes] = useState([]);
  const [count, setCount] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(5);
  const [searchInput, setSearchInput] = useState("");

  const [dispute, setDispute] = useState({});
  const [solveStatus, setSoloveStatus] = useState(DisputeStatus.Pending);
  const [modalView, setModalView] = useState(false);
  const disputeServices = new DisputeServices();
  const nftServices = new NftCategoryServices();

  const getAllDispute = async () => {
    const {
      data: { disputes = [{}], metadata = {} },
    } = await disputeServices.getAllDisputes({
      skip,
      limit,
      searchInput,
      filter: nftList[value],
    });
    console.log('nft', nfts);
    setCount(metadata.total);
    setDisputes(disputes);
  }

  const handlePagination = async ({ recordsToSkip, recordsToGet }) => {
    setSkip(recordsToSkip);
    setLimit(recordsToGet);
  };

  const handelSearchResult = async ({ debounceSearchInput }) => {
    setSearchInput(debounceSearchInput);
  };

  const handleSolveModal = async (disputeObj, modalView) => {
    try {
      const {
        data: {
          dispute,
        }
      } = await disputeServices.getDisputeById(disputeObj._id);
      setDispute(dispute);
      const requestModal = new bootstrap.Modal(
        document.getElementById("requestModal")
      );
      setModalView(modalView);
      requestModal.show();
    } catch (error) {
      console.log(error);
    }
  }

  const handleConfirmModal = async (solveStatus) => {
    setSoloveStatus(solveStatus);
    const confirmModal = new bootstrap.Modal(
      document.getElementById("confirmModal")
    );
    confirmModal.show();
  }


  const handleAccept = async () => {
    try {
      if (dispute.type == DisputeType.CancelRequest) {
        await handleExitEsscrow();
      } else {
        await handleRelease();
      }
      const feedbackModal = new bootstrap.Modal(
        document.getElementById("feedbackModal")
      );
      feedbackModal.show();
    } catch (error) {
      console.log(error);
    }
  }

  const handleRelease = async () => {
    const { nft: {
      tokenId
    } } = dispute;
    const { transactionHash, events } = await releaseEscrow(
      tokenId,
      activeAccount,
    );
    let states = [];

    events.forEach((event) => {
      if (event.eventName === 'ProtocolFee') {
        const feeState = {
          nftId: dispute?.nft._id,
          state: 'Fee',
          from: dispute?.sale?.sellerId,
          toWallet: contract.address,
          date: new Date(),
          actionHash: transactionHash,
          price: formatEther(event.args.amount),
          currency: 'ETH',
        };
        states.push(feeState);
      } else if (event.eventName === 'RoyaltyPurchased') {
        const royaltyState = {
          nftId: dispute?.nft._id,
          state: 'Royalties',
          from: dispute?.sale?.sellerId,
          toWallet: event.args.user,
          date: new Date(),
          actionHash: transactionHash,
          price: formatEther(event.args.amount),
          currency: 'ETH',
        };
        states.push(royaltyState);
      } else if (event.eventName === 'PaymentSplited') {
        const splitState = {
          nftId: dispute?.nft._id,
          state: 'Split Payments',
          from: dispute?.sale?.sellerId,
          toWallet: event.args.user,
          date: new Date(),
          actionHash: transactionHash,
          price: formatEther(event.args.amount),
          currency: 'ETH',
        };
        states.push(splitState);
      } else if (event.eventName === 'EscrowReleased') {
        const releaseState = {
          nftId: dispute?.nft._id,
          state: 'Release escrow',
          from: disput?.sale?.sellerId,
          to: dispute?.sale?.saleWinner,
          date: new Date(),
          actionHash: transactionHash,
          price: dispute?.nft?.price,
        };
        states.push(releaseState);
      }
    });

    const data = {
      disputeId: dispute._id,
      disputeStatus: DisputeStatus.Accepted,
      transactionHash: transactionHash,
      states,
    };
    await nftService.releaseOrder(data);
  }

  const handleExitEsscrow = async () => {
    const { nft: {
      tokenId
    } } = dispute;
    const { transactionHash } = await exitEscrow(tokenId, activeAccount);

    const data = {
      disputeId: dispute._id,
      disputeStatus: DisputeStatus.Accepted,
      transactionHash,
    }

    await nftServices.cancelOrder(data);
  }

  const handleRejct = async () => {
    try {
      const res = await disputeServices.rejectDispute(dispute._id);
      const feedbackModal = new bootstrap.Modal(
        document.getElementById("feedbackModal")
      );
      feedbackModal.show();
    } catch (error) {
      console.log(error);
    }
  }



  const debounce = useDebounce(getAllDispute, 1000)
  useEffect(() => {
    console.log({ searchInput });
    debounce();
  }, [count, skip, limit, searchInput]);

  return (
    <>
      <section className="dashboard__area">
        {props.render}
        <Header />
        <div className="dashboard__admin__area">
          <div className="admin__inner__blk">
            <div className="admin__content">
              <h4>Arbitration</h4>
            </div>
          </div>
        </div>

        <div className="categorie__btn mt-20">
          <a className={status === 1 ? "active" : ""} value={1} onClick={() => setStatus(1)}>
            Unresolved
          </a>
          <a className={status === 2 ? "active" : ""} value={2} onClick={() => setStatus(2)}>Solved</a>
          <a className={status === 3 ? "active" : ""} value={3} onClick={() => setStatus(3)}>Reject</a>
        </div>
        <Search
          handelSearchResult={handelSearchResult}
          placeholder={"Search by nft name or trait ..."}
        />
        <div className="dashboard__table__wrapper">
          <a
            data-bs-toggle="modal"
            href="#requestModal"
            id="requestModalTrigger"
            type="button"
          >
            Go to solve
          </a>
          <div className="dashboard__table mt-10">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Type</th>
                  <th scope="col">Title</th>
                  <th scope="col">Escrow No</th>
                  <th scope="col">Request Date</th>
                  <th scope="col">Transaction Date</th>
                  {status !== 1 && (
                    <th scope="col">Contents</th>
                  )}
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  disputes.map((dispute, index) => {
                    return (
                      <tr>
                        <td>
                          <span>{dispute.type === DisputeType.CancelRequest ? 'Order Cancellation' : 'Release Escrow'}</span>
                        </td>
                        <td>
                          <span>{dispute.nft?.name}</span>
                        </td>
                        <td>
                          <span>{dispute.sale?._id}</span>
                        </td>
                        <td>
                          <span>{dispute?.createdAt
                            ? new Date(dispute?.createdAt)
                              .toLocaleString()
                              .slice(0, 10)
                            : "-/-"}</span>
                        </td>
                        <td>
                          <span>{dispute?.sale?.ItemPurchasedOn
                            ? new Date(dispute?.sale?.ItemPurchasedOn)
                              .toLocaleString()
                              .slice(0, 10)
                            : "-/-"}</span>
                        </td>
                        {
                          status !== DisputeStatus.Pending && (
                            <td>
                              <span className="btn-outline-light underline leading-snug text-[#ddf247]" onClick={handleView(dispute)}>
                                View
                              </span>
                            </td>
                          )
                        }
                        <td>
                          {
                            status == 1 && (
                              <a
                                data-bs-toggle="modal"
                                href="#requestModal"
                                id="requestModal"
                                type="button"
                                onClick={() => { handleSolveModal(dispute) }}
                              >
                                Go to solve
                              </a>
                            )
                          }
                          {
                            status == 2 && (
                              <span className="btn-outline-light text-[#ddf247]">Solved</span>
                            )
                          }
                          {
                            status == 3 && (
                              <span className="btn-outline-light text-[#ddf247]">Rejected</span>
                            )
                          }
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        </div>

        <Pagination totalRecords={count} queryPagination={handlePagination} limit={limit} />
      </section>
      <div
        className="modal fade common__popup__blk"
        id="requestModal"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex={-1}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ maxWidth: 1180 }}
        >
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <span
                className="close_modal close_center"
                data-bs-dismiss="modal"
              >
                <i className="fa-solid fa-xmark" />
              </span>
              <div className="popup__inner__blk">
                <div className="popup__common__title mt-20">
                  <h4>
                    <span>
                      <img src="../../assets/img/Receipt-ico.svg" alt="" />
                    </span>{" "}
                    Order Cancellation Request
                  </h4>
                </div>
                <div className="w-full py-4 bg-[#161616] rounded-3xl flex" style={{ color: 'RGB(122, 122,122)' }}>
                  <p className="!text-white/50 text-base font-normal leading-relaxed">
                    We are sad to see your cancellation request! However, please be informed that cancellations due to a change of mind are not in our terms and conditions. But if you have other reasons like shipping delays, product defects, and more, your cancellation request may be approved.
                    <br />
                    <br />
                    Kindly explain the reasons for your cancellation in the field down below. After careful review, we will contact you with further details through the email and messenger ID that you provided. We value your feedback as it helps us deliver the best possible service. Thank You!
                  </p>
                </div>
                {/* Email Input */}
                <div className="common__edit__proe__wrap mt-20">
                  <div className="edit__profilfile__inner__top__blk">
                    <div className="edit__profile__inner__title">
                      <h5>E-mail*</h5>
                    </div>
                  </div>
                  <span className="text-white text-sm">{dispute?.email}</span>
                </div>
                <div className="common__edit__proe__wrap mt-20">
                  <div className="edit__profilfile__inner__top__blk">
                    <div className="edit__profile__inner__title">
                      <h5>Phone Number*</h5>
                    </div>
                  </div>
                  <span className="text-white text-sm">{dispute?.phoneNumber}</span>
                </div>

                <div className="common__edit__proe__wrap mt-20">
                  <div className="edit__profilfile__inner__top__blk">
                    <div className="edit__profile__inner__title">
                      <h5>Describe*</h5>
                    </div>
                  </div>
                  <div className="edit__profile__form">
                    <div className="row gy-4 gx-3">
                      <div className="col-xl-12">
                        <div className="single__edit__profile__step">
                          <textarea
                            name="#"
                            placeholder="Please describe your product*"
                            id=""
                            cols={30}
                            rows={10}
                            defaultValue={""}
                            value={dispute?.disputeRequest}
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="common__edit__proe__wrap mt-4">
                  <div className="edit__profilfile__inner__top__blk">
                    <div className="edit__profile__inner__title">
                      <h5>Attachment</h5>
                    </div>
                    <div className="edit_profile_inner_top_right">

                      <div className="edit__profile__angle__ico">
                        <span>
                          <img src="../../assets/img/angle_up.svg" alt="" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="file__formate">
                    <ul>
                      {
                        dispute.disputeAttachments.map((attach, index) => (
                          <li className="" key={index}>
                            <a href={attach} target="_blank" rel="noopener noreferrer">
                              {attach}
                            </a>
                          </li>
                        ))
                      }
                    </ul>
                  </div>

                </div>
                <div className="popup__inner__button half__width__btn edit__profile__bottom__btn pt-20 pb-0">
                  <a href="#" className="cancel">
                    Close
                  </a>
                  <a
                    data-bs-dismiss="modal"
                    role="button"
                    onClick={() => { }}
                    style={{ backgroundColor: "#88a9ff" }}
                  >
                    Reject
                  </a>
                  <a
                    data-bs-dismiss="modal"
                    role="button"
                    onClick={() => { }}
                  >
                    Approval
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal  common__popup__blk"
        id="confirmModal"
        aria-hidden="true"
        aria-labelledby="confirmModalLabel"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <div className="popup__inner__blk">
                <div className="popup__common__title text-center">
                  <h4>
                    {
                      dispute?.type == DisputeType.CancelRequest && (
                        solveStatus == DisputeStatus.Accepted ?
                          "Are you sure you want to Cancel the Transaction?" :
                          "Are you sure you want to reject the canellation request?"
                      )
                    }
                    {
                      dispute?.type == DisputeType.ReleaseRequest && (
                        solveStatus == DisputeStatus.Accepted ?
                          "Are you sure you want to release escrow?" :
                          "Are you sure you want to reject the releasing escrow request?"
                      )
                    }
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
                        type="button"
                      >
                        Cancel
                      </a>
                      <a
                        // data-bs-target="#exampleModalToggle2"
                        // data-bs-toggle="modal"
                        // data-bs-dismiss="modal"
                        href="#"
                        onClick={() => {
                          if (solveStatus == DisputeStatus.Accepted) {
                            handleAccept();
                          } else {
                            handleRejct();
                          }
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
      <div
        className="modal  common__popup__blk"
        id="confirmModal"
        aria-hidden="true"
        aria-labelledby="feedbackModal"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <div className="popup__inner__blk">
                <div className="popup__common__title text-center">
                  <h4>
                    {
                      dispute?.type == DisputeType.CancelRequest && (
                        solveStatus == DisputeStatus.Accepted ?
                          "Cancel request has been sompleted successfully" :
                          "We reject the cancellation reuest"
                      )
                    }
                    {
                      dispute?.type == DisputeType.ReleaseRequest && (
                        solveStatus == DisputeStatus.Accepted ?
                          "Release escrow has been completed successfully" :
                          "We reject release escrow request"
                      )
                    }
                  </h4>
                </div>
                <div className="popup__similar__form">
                  <div className="popup__similar__btn">
                    <div className="edit__profile__bottom__btn">
                      <a
                        className="cancel"
                        href="#feedbackModal"
                        data-bs-toggle="modal"
                        type="button"
                      >
                        Close
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}