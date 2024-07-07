import React, { useRef, useState } from 'react'
import { trimString } from '../../utils/helpers'
import { network } from '../../utils/config'
import UploadImage from '../helpers/UploadImage'
import { CreateNftServices } from '../../services/userNftService'
import * as bootstrap from "bootstrap";
import { strDoesExist } from '../../utils/checkUrl'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Info from './sub/Info'
import _ from 'lodash'
import { getContactsInfo, getSellerInfo, getProperties } from '../../services/services'

const style = {
    borderRadius: '10px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "37rem",
    height: "60vh",
    bgcolor: '#121211',
    border: '2px solid #000',
    boxShadow: 24,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
};

const defaultAttributes = [
    {
        type: 'Type',
        value: 'Write it here'
    },
    {
        type: 'Medium',
        value: 'Write it here'
    },
    {
        type: 'Support',
        value: 'Write it here'
    },
    {
        type: 'Dimensions (cm)',
        value: 'Write it here'
    },
    {
        type: 'Signature',
        value: 'Write it here'
    },
    {
        type: 'Authentication',
        value: 'Write it here'
    }
]

export default function Create() {
    const [step, setStep] = useState(3)
    const address = '0x1234567890123456789012345678901234567890'
    const [selectedType, setSelectedType] = useState("createNFT")
    const [createNftStep1, setCreateNftStep1] = useState({});
    const [createNftStep1File, setCreateNftStep1File] = useState();
    const [createNftStep1Attachments, setCreateNftStep1Attachments] = useState(
        []
    );
    const [numberOfInputs1, setNumberOfInputs1] = useState(1);
    const [createNftStep2Conditions, setCreateNftStep2Conditions] = useState({
        freeMint: false,
        royalties: false,
        unlockable: false,
        category: false,
        split: false,
    });
    const [createNftStep2, setCreateNftStep2] = useState({});
    const imgRef = useRef(null);
    const [discriptionImage1, setDiscriptionImage1] = useState([]);
    const [categories, setCategories] = useState([]);
    const [createNftStep2PropertiesInput, setCreateNftStep2PropertiesInput] =
        useState({
            type: "",
            value: "",
        });
    const [createNftStep2SplitInput, setCreateNftStep2SplitInput] = useState({
        address: "",
        percent: "",
    });

    const handleUpdateValuesStep2 = (e) => {
        const { name, value } = e.target;
        setCreateNftStep2({
            ...createNftStep2,
            [name]: value,
        });
    };
    const [sellerInfo, setSellerInfo] = useState({
        lengths: "",
        width: "",
        height: "",
        weight: "",
        contactInfo: "",
        consent: "",
      });
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [selectedContact, setSelectedContact] = useState(null);
    const [createNftStep2Split, setCreateNftStep2Split] = useState([]);
    const [createNftStep2Properties, setCreateNftStep2Properties] = useState([]);
    const [errorCuration, setErrorCuration] = useState([]);
    const [fee, setFee] = useState(0);
    const [userCollection, setUserCollection] = useState([]);
    const step1AttachmentRef = useRef(null);
    const [popUp2, setPopUp2] = useState({ active: false, type: null, data: null });
    const [exitPopup, setExitPopup] = useState(false);
    const [sellers, setSellers] = useState([])
    const [contacts, setContacts] = useState([])
    const [seller, setSeller] = useState(null)
    const [contact, setContact] = useState(null)
    const [properties, setProperties] = useState([]);
    const [message, setMessage] = useState();

    const handleUpdateValuesStep2Split = (e) => {
        const { name, value } = e.target;
        setCreateNftStep2SplitInput({
            ...createNftStep2SplitInput,
            [name]: value,
        });
    };

    const handleDataFromChild = async (data) => {
        setInfoData(data)

        if (data) {
            setPopUp2({
                active: false,
                type: null,
                data: null
            })
            const response = await getProperties()
            if (response) {
                setProperties(response)
            }
        }
    }

    const discardData = async () => {
        const nftService = new CreateNftServices();
        try {
          nftId && (await nftService.removeFromDb({ nftId }));
          window.location.reload();
        } catch (error) {
          console.log(error);
        }
      };
    

    const onCancel = () => {
        setPopUp2({
            active: false,
            type: null,
            data: null
        })
    }

    const nftService = new CreateNftServices();

    const handleUpdateValues = (e) => {
        const { name, value } = e.target;
        setCreateNftStep1({
            ...createNftStep1,
            [name]: value,
        });
    };

    const viewNft = () => {
        const element = new bootstrap.Modal(
          document.getElementById("exampleModalToggle3")
        );
        element.hide();
        props?.render?.props?.onClickMenuButton("myProfile");
        props.setProfileTab("Created");
      };

    const [defaultBasicTemplate, setDefaultBasicTemplate] = useState([
        {
            type: 'Type',
            value: 'Write it here'
        },
        {
            type: 'Medium',
            value: 'Write it here'
        },
        {
            type: 'Support',
            value: 'Write it here'
        },
        {
            type: 'Dimensions (cm)',
            value: 'Write it here'
        },
        {
            type: 'Signature',
            value: 'Write it here'
        },
        {
            type: 'Authentication',
            value: 'Write it here'
        }
    ])

    const [propMod, setPropMod] = useState({
        by: null,
        index: null,
        type: false,
        value: false,
    })

    const handleUpdateSeller = (e) => {
        const { name, value } = e.target;
        if (name === "country") {
          const parsedVal = JSON.parse(value);
          const countryStates = State.getStatesOfCountry(parsedVal.isoCode);
          setStates(countryStates);
          setCountryCode(parsedVal.isoCode);
        } else if (name === "state") {
          const parsedVal = JSON.parse(value);
          const stateCities = City.getCitiesOfState(countryCode, parsedVal.isoCode);
          setCities(stateCities);
        }
        setSellerInfo({
          ...sellerInfo,
          [name]: value,
        });
      };

      const validateCreateSellerDetails = () => {
        const arr = [];
        if (!selectedSeller) {
          arr.push("Seller is needed");
          setErrorCuration([...arr]);
          return false;
        }
        if (!selectedContact) {
          arr.push("Contact is needed");
          setErrorCuration([...arr]);
          return false;
        }
        strDoesExist("Name", selectedSeller.name, arr);
        validateEmail("Email", selectedSeller.email, arr);
        strDoesExist("Country", selectedSeller.country, arr);
        strDoesExist("Address Line 1", selectedSeller.address ? selectedSeller.address.line1 : "", arr);
        strDoesExist("city", selectedSeller.address ? selectedSeller.address.city : "", arr);
        strDoesExist("state", selectedSeller.address ? selectedSeller.address.state : "", arr);
        setErrorCuration([...arr]);
        if (arr.length > 0) return false;
        return true;
      };

      const createSellerInfo = async () => {
        setErrorCuration([]);
        const valid = validateCreateSellerDetails();
        const errElem = new bootstrap.Modal(
          document.getElementById("errorCreatingCurationModal")
        );
        if (!valid) return errElem.show();
        const element1 = new bootstrap.Modal(
          document.getElementById("exampleModalToggle1")
        );
        const element = new bootstrap.Modal(
          document.getElementById("exampleModalToggle3")
        );
        element1.show();
        let splitPayments = [];
        if (createNftStep2Conditions.split) {
          const newArr = createNftStep2Split.map((item) => ({
            address: item.address,
            percentage: item.percent,
          }));
          splitPayments = newArr;
        }
        const data = {
          name: selectedSeller.name,
          email: selectedSeller.email,
          country: selectedSeller.country,
          address: {
            line1: selectedSeller.address.line1,
            line2: selectedSeller.address.line2,
            city: selectedSeller.address.city,
            state: selectedSeller.address.state,
            postalCode: selectedSeller.address.postalCode,
          },
          phoneNumber: selectedSeller.phoneNumber,
          shippingInformation: {
            lengths: sellerInfo.lengths,
            width: sellerInfo.width,
            height: sellerInfo.height,
            weight: sellerInfo.weight,
          },
          splitPayments,
          nftId,
        };
    
        let nftUri = "";
        try {
          const nftId = await createBasicDetails(true);
          await createAdvancedDetails(true, nftId);
          data.nftId = nftId;
          setNftId(nftId)
    
          const {
            data: { uri },
          } = await nftService.createSellerDetails(data);
          setUri(uri);
          nftUri = uri;
          if (!createNftStep2Conditions?.freeMint) {
            await handleMint(uri);
          } else {
            setTimeout(() => {
              element1.hide();
            }, 100);
            element.show();
            setTimeout(() => window.location.reload(), 3000);
          }
        } catch (error) {
          console.log(error);
          if (
            error?.response?.data?.message?.includes(
              "Advance details not found or already minted"
            )
          ) {
            if (!createNftStep2Conditions?.freeMint) {
              await handleMint(nftUri);
            } else element1.hide();
          } else element1.hide();
        }
      };

    const removeProp = (index) => {
        setPropMod({
            by: null,
            index: null,
            type: false,
            value: false,
        })
        if (selectedProperty === null) {
            const newArr = defaultBasicTemplate.filter((item, idx) => idx !== index)
            setDefaultBasicTemplate(newArr)
        } else {
            const newArr = selectedProperty.attributes.filter((item, idx) => idx !== index)
            setSelectedProperty({
                ...selectedProperty,
                attributes: newArr
            })
        }
    }

    const modifyProp = (index, forType, value) => {
        if (selectedProperty === null) {
            const newArr = defaultBasicTemplate.map((item, idx) => {
                if (idx === index) {
                    item[`${forType}`] = value
                    return item
                }
                return item
            })
            setDefaultBasicTemplate(newArr)
        } else {
            const newArr = selectedProperty.attributes.map((item, idx) => {
                if (idx === index) {
                    item[`${forType}`] = value
                    return item
                }
                return item
            })
            setSelectedProperty({
                ...selectedProperty,
                attributes: newArr
            })
        }
    }

    const addNewProp = () => {
        setPropMod({
            by: null,
            index: null,
            type: false,
            value: false,
        })
        const newProp = {
            type: 'Title Here',
            value: 'Write it here'
        }

        if (selectedProperty === null) {
            setDefaultBasicTemplate([...defaultBasicTemplate, newProp])
        } else {
            setSelectedProperty({
                ...selectedProperty,
                attributes: [...selectedProperty.attributes, newProp]
            })
        }
    }


    const validateCreateBasicDetails = () => {
        const arr = [];
        strDoesExist("Name", createNftStep1.productName, arr);
        strDoesExist("Description", createNftStep1.productDescription, arr);
        strDoesExist("Artist", createNftStep1.artistName, arr);
        strDoesExist("Price", createNftStep1.price, arr);
        strDoesExist("curation", createNftStep1.curation, arr);
        strDoesExist("File", createNftStep1File, arr, "is empty");
        setErrorCuration([...arr]);
        if (arr.length > 0) return false;
        return true;
    };

    const createBasicDetails = async (save) => {
        const errElem = new bootstrap.Modal(
            document.getElementById("errorCreatingCurationModal")
        );
        if (!save) {
            setErrorCuration([]);
            const valid = validateCreateBasicDetails();
            if (!valid) return errElem.show();
            setStep(2)
        } else {
            const formData = new FormData();
            formData.append("name", createNftStep1.productName);
            formData.append("description", createNftStep1.productDescription);
            formData.append("artist", createNftStep1.artistName);
            formData.append("price", createNftStep1.price);
            formData.append("curation", createNftStep1.curation);
            // createNftStep1Attachments.length > 0 &&
            const allFiles = [createNftStep1File, ...createNftStep1Attachments];
            for (const file of allFiles) {
                formData.append("files", file);
            }

            try {
                await getStoredInfo()
                const res = await nftService.createBasicDetails(formData);
                return res.data.data._id;
            } catch (error) {
                if (
                    error?.response?.status ==
                    400
                ) {
                    console.log("herer in modal")
                    const element5 = new bootstrap.Modal(
                        document.getElementById("exampleModalToggl5")
                    );
                    element5.show();
                } else {
                    errElem.show();
                }
            }
        }
    };

    return (
        <div>
            <Modal
                open={popUp2.active}
                onClose={() => setPopUp2({ active: false, type: null, data: null })}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{
                    width: "75%",
                    backgroundColor: "#232323",
                    margin: "auto",
                    padding: "2rem",
                    overflowY: "scroll",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Info
                    type={popUp2.type}
                    data={popUp2.data}
                    onSave={handleDataFromChild}
                    onCancel={onCancel}
                    onSaveSeller={async () => {
                        const response = await getSellerInfo()
                        setSellers(response)

                        if (response) {
                            setPopUp2({
                                active: false,
                                type: null,
                                data: null
                            })
                        }
                    }}
                    onSaveContact={async () => {
                        const response = await getContactsInfo()
                        setContacts(response)

                        if (response) {
                            setPopUp2({
                                active: false,
                                type: null,
                                data: null
                            })
                        }
                    }}
                />
            </Modal>
            <Modal
                open={exitPopup}
                onClose={() => setExitPopup(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    ...style,
                    height: "500px",
                }}>
                    <div style={{
                        position: "absolute",
                        top: "20px",
                        right: "20px",
                        backgroundColor: "white",
                        padding: "10px",
                        cursor: "pointer",
                        borderRadius: "100%",
                        zIndex: 100
                    }}
                        onClick={() => setExitPopup(false)}
                    >
                        <img src="../../assets/img/delete_icon.svg" alt="" className="close__icon" />
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <div className="modal-image">
                            <img
                                src="/assets/img/exclamation.svg"
                                alt="Error"
                                className="mx-auto mt-4"
                                style={{ width: "100px", height: "100px" }}
                            />
                        </div>
                        <div className="text-white p-4 rounded-t-lg text-center justify-center">
                            <h5 className="text-white font-bold px-5 text-lg">
                                If You Exit This Page, The Minting Information Progress Will Be Lost. Do You Still Want To Cancel?
                            </h5>
                        </div>
                        <div className="edit__profile__bottom__btn half__width__btn" style={{
                                    margin: '0px',
                                    maxWidth: 'none'
                                }}>
                            <a
                                onClick={() => setExitPopup(false)}
                                className="cancel"
                            >
                                No
                            </a>
                            <a
                                onClick={() => {
                                    setStep(0);
                                    setExitPopup(false);
                                }}
                            >
                                Yes
                            </a>
                        </div>
                    </div>
                </Box>
            </Modal>
            <h1 className='text-white font-medium'>Create New NFT</h1>
            <div className="create__step__blk">
                <a href="#" className="single__create__step active">
                    <small>1</small> Basic Details
                </a>
                <span>
                    <img src='assets/img/right-arrow.svg' />
                </span>
                <a
                    href="#"
                    className={
                        step > 1
                            ? "single__create__step active"
                            : "single__create__step"
                    }
                >
                    <small>2</small> Advanced Details
                </a>
                <span>
                    <img src='assets/img/right-arrow.svg' />
                </span>
                <a
                    href="#"
                    className={
                        step > 2
                            ? "single__create__step active"
                            : "single__create__step"
                    }
                >
                    <small>3</small> Seller Information
                </a>
            </div>

            {
                step === 1 ?
                    <>
                        <div className={step === 1 ? "connected__top__blk mb-35" : "d-none"}>
                            <div className="connected__left__blk">
                                <div className="connected_compas">
                                    <span>
                                        <img src="assets/img/colormatic.svg" alt="" />
                                    </span>
                                    <div className="connected_left_text">
                                        <h5>{trimString(address)}</h5>
                                        <span>{network} Network</span>
                                    </div>
                                </div>
                            </div>
                            <div className="connected__right__blk">
                                <a href="#">Connected</a>
                            </div>
                        </div>

                        < div className={step === 1 ? "connected__form" : "d-none"}>
                            <form action="#">
                                <div className="row g-4">
                                    <div className="col-md-5 mt-35">

                                        {selectedType === "createNFT" && (
                                            <UploadImage
                                                uploadfile={createNftStep1File}
                                                setUploadfile={setCreateNftStep1File}
                                            />
                                        )}
                                    </div>
                                    <div className="col-md-7">
                                        <div className="connected__top__form">
                                            <div className="row gx-3 gy-4">
                                                <div className="col-md-12">
                                                    <div className="single__edit__profile__step">
                                                        <label htmlFor="#">Product name * </label>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter Product Name"
                                                            name="productName"
                                                            value={createNftStep1.productName}
                                                            onChange={handleUpdateValues}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="single__edit__profile__step">
                                                        <label htmlFor="#">Description *</label>
                                                        <textarea
                                                            placeholder="Please describe your artwork*"
                                                            id=""
                                                            cols={30}
                                                            rows={10}
                                                            name="productDescription"
                                                            value={createNftStep1.productDescription}
                                                            onChange={handleUpdateValues}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="single__edit__profile__step">
                                                        <label htmlFor="#">Price(USD) *</label>
                                                        <input
                                                            type="text"
                                                            placeholder={0}
                                                            name="price"
                                                            value={createNftStep1.price}
                                                            onChange={(e) =>
                                                                Number(e.target.value) >= 0
                                                                    ? handleUpdateValues(e)
                                                                    : setCreateNftStep1({
                                                                        ...createNftStep1,
                                                                        price: "",
                                                                    })
                                                            }
                                                        />
                                                        <button className="eth" type="button">
                                                            $
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="listing__fee__blk">
                                                        <p>
                                                            Plateform Fee <span>{fee}%</span>
                                                        </p>
                                                        <p>
                                                            You will recieve{" "}
                                                            <span>
                                                                $
                                                                {createNftStep1.price
                                                                    ? createNftStep1.price -
                                                                    (fee * createNftStep1.price) / 100
                                                                    : 0}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="single__edit__profile__step">
                                                        <label htmlFor="#">Artist Name *</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter Artist Name"
                                                            name="artistName"
                                                            value={createNftStep1.artistName}
                                                            onChange={handleUpdateValues}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="single__edit__profile__step">
                                                        <label htmlFor="#">Curation *</label>
                                                        <select
                                                            class="form-select"
                                                            aria-label="select curation"
                                                            name="curation"
                                                            value={createNftStep1.curation}
                                                            onChange={handleUpdateValues}
                                                        >
                                                            <option value="">Select Curation</option>
                                                            {userCollection.map((item) => {
                                                                return (
                                                                    <option key={item._id} value={item._id}>
                                                                        {item.name}
                                                                    </option>
                                                                );
                                                            })}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="common__edit__proe__wrap mt-4">
                                            <div className="edit__profilfile__inner__top__blk">
                                                <div className="edit__profile__inner__title">
                                                    <h5>Attachment</h5>
                                                </div>
                                                <div className="edit__profile__angle__ico">
                                                    <span>
                                                        <img src="assets/img/angle_up.svg" alt="" />
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="attachment__card__blk">
                                                <div className="row gx-5 gy-4">
                                                    {createNftStep1Attachments.map((file, i) => (
                                                        <div
                                                            key={i}
                                                            className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-6"
                                                        >
                                                            <div className="single__attachment__cird__blk">
                                                                <div className="attachment__thumb">
                                                                    <img src={URL.createObjectURL(file)} alt="" />
                                                                </div>
                                                                <div className="attachment__content">
                                                                    <a
                                                                        style={{ color: "#ddf247" }}
                                                                        onClick={() => handleChangeStep1Attachment(i)}
                                                                    >
                                                                        Change{" "}
                                                                        <span>
                                                                            <img src="assets/img/Trash.svg" alt="" />
                                                                        </span>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {createNftStep1Attachments.length > 4 ? (
                                                        ""
                                                    ) : (
                                                        <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-6">
                                                            <div className="single__attachment__cird__blk">
                                                                <div className="attachment_upload_thumb">
                                                                    <div className="imageWrapper">
                                                                        <img
                                                                            className="image-2"
                                                                            src="https://i.ibb.co/c8FMdw1/attachment-link.png"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <button className="file-upload" style={{
                                                                    margin: '10px 0px'
                                                                }}>
                                                                    <input
                                                                        type="file"
                                                                        className="file-input-2"
                                                                        ref={step1AttachmentRef}
                                                                        onChange={(e) =>
                                                                            setCreateNftStep1Attachments([
                                                                                ...createNftStep1Attachments,
                                                                                e.target.files[0],
                                                                            ])
                                                                        }
                                                                    />
                                                                    <span>
                                                                        Upload{" "}
                                                                        <small>
                                                                            <img src="assets/img/Upload.svg" alt="" />
                                                                        </small>
                                                                    </span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="edit__profile__bottom__btn half__width__btn" style={{
                                    margin: '0px',
                                    maxWidth: 'none'
                                }}>
                                        <a
                                            onClick={() => {
                                                setExitPopup(true)
                                            }}
                                            className="cancel"
                                        >
                                            Cancel
                                        </a>
                                        <a href="#" onClick={async () => await createBasicDetails(false)}>
                                            Next{" "}
                                            <span>
                                                <img src="assets/img/arrow_ico.svg" alt="" />
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            </form>
                        </div> </> : null
            }

            {
                step === 2 ?
                    <>
                        <div className={step === 2 ? "connected__form" : "d-none"}>
                            <form action="#">
                                <div className="nft__switch__blk">
                                    <div className="row g-3">
                                        <div className="col-lg-4 col-md-6">
                                            <div className="nft__single__switch__box">
                                                <div className="nft__switch__text">
                                                    <h6>Free Minting</h6>
                                                    <p>Free mint your nft. You don’t eed any gas fee.</p>
                                                </div>
                                                <div className="nft__switch">
                                                    <div className="form-check form-switch">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="flexSwitchCheckChecked"
                                                            checked={createNftStep2Conditions.freeMint}
                                                            onChange={(e) => {
                                                                setCreateNftStep2Conditions({
                                                                    ...createNftStep2Conditions,
                                                                    freeMint: !createNftStep2Conditions.freeMint,
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6">
                                            <div className="nft__single__switch__box">
                                                <div className="nft__switch__text">
                                                    <h6>Royalties</h6>
                                                    <p>Earn a % on secondary sales</p>
                                                </div>
                                                <div className="nft__switch">
                                                    <div className="form-check form-switch">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="flexSwitchCheckChecked"
                                                            checked={createNftStep2Conditions.royalties}
                                                            onChange={(e) => {
                                                                setCreateNftStep2Conditions({
                                                                    ...createNftStep2Conditions,
                                                                    royalties: !createNftStep2Conditions.royalties,
                                                                });
                                                                setCreateNftStep2({
                                                                    ...createNftStep2,
                                                                    royalty: 0,
                                                                });
                                                            }
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-4 col-md-6">
                                            <div className="nft__single__switch__box">
                                                <div className="nft__switch__text">
                                                    <h6>Unlockable Content</h6>
                                                    <p>Only Owner can view this content</p>
                                                </div>
                                                <div className="nft__switch">
                                                    <div className="form-check form-switch">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="flexSwitchCheckChecked"
                                                            checked={createNftStep2Conditions.unlockable}
                                                            onChange={(e) =>
                                                                setCreateNftStep2Conditions({
                                                                    ...createNftStep2Conditions,
                                                                    unlockable:
                                                                        !createNftStep2Conditions.unlockable,
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6">
                                            <div className="nft__single__switch__box">
                                                <div className="nft__switch__text">
                                                    <h6>Category</h6>
                                                    <p>Put this item into a Category</p>
                                                </div>
                                                <div className="nft__switch">
                                                    <div className="form-check form-switch">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="flexSwitchCheckChecked"
                                                            checked={createNftStep2Conditions.category}
                                                            onChange={(e) =>
                                                                setCreateNftStep2Conditions({
                                                                    ...createNftStep2Conditions,
                                                                    category: !createNftStep2Conditions.category,
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6">
                                            <div className="nft__single__switch__box">
                                                <div className="nft__switch__text">
                                                    <h6>Split Payments</h6>
                                                    <p>Add multiple address to recieve payments. </p>
                                                </div>
                                                <div className="nft__switch">
                                                    <div className="form-check form-switch">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="flexSwitchCheckChecked"
                                                            checked={createNftStep2Conditions.split}
                                                            onChange={(e) =>
                                                                setCreateNftStep2Conditions({
                                                                    ...createNftStep2Conditions,
                                                                    split: !createNftStep2Conditions.split,
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="connected__top__form">
                                    <div className="row gx-3 gy-4">
                                        {createNftStep2Conditions.royalties && (
                                            <div className="col-md-12">
                                                <div className="single__edit__profile__step">
                                                    <label htmlFor="#">Royalties (%)</label>
                                                    <div style={{
                                                        display: 'flex',
                                                        gap: '20px',
                                                        alignItems: 'center'

                                                    }}>
                                                        <input
                                                            type="text"
                                                            placeholder="Address"
                                                            name="address"
                                                            style={{
                                                                width: '430px'
                                                            }}
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="%"
                                                            name="royalty"
                                                            style={{
                                                                width: '100px'
                                                            }}
                                                            value={createNftStep2.royalty}
                                                            onChange={handleUpdateValuesStep2}
                                                        />
                                                        <div className="input__add__btn">
                                                            <a
                                                                className="add_input_btn"
                                                                href="#"
                                                                onClick={() => {
                                                                    setCreateNftStep2Split([
                                                                        ...createNftStep2Split,
                                                                        createNftStep2SplitInput,
                                                                    ]);
                                                                    setCreateNftStep2SplitInput({
                                                                        address: "",
                                                                        percent: "",
                                                                    });
                                                                }}
                                                            >
                                                                <span>
                                                                    <img src="assets/img/Plus_circle.svg" alt="" />
                                                                </span>{" "}
                                                                Add
                                                            </a>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        )}
                                        {createNftStep2Conditions.unlockable && (
                                            <>
                                                <div className="col-md-12">
                                                    <div className="single__edit__profile__step">
                                                        <label htmlFor="#">Unlockable Content</label>
                                                        <textarea
                                                            style={{ height: 119 }}
                                                            name="unlockable"
                                                            value={createNftStep2.unlockable}
                                                            onChange={handleUpdateValuesStep2}
                                                            placeholder="Only the artwork owner can view this content and file. You may also attach a certificate of authenticity issued by a third party and a special image just for the buyer."
                                                            id=""
                                                            cols={30}
                                                            rows={10}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    {_.times(numberOfInputs1).map((value, index) => (
                                                        <div
                                                            className="nft__file__upload upload__file__padding__bottom"
                                                            key={index}
                                                        >
                                                            <div className="upload__file__with__name">
                                                                {index === 0 && (
                                                                    <input
                                                                        type="file"
                                                                        multiple
                                                                        onChange={(e) =>
                                                                            setDiscriptionImage1([
                                                                                ...discriptionImage1,
                                                                                e.target.files[0],
                                                                            ])
                                                                        }
                                                                        ref={imgRef}
                                                                        id="real-file"
                                                                        hidden="hidden"
                                                                    />
                                                                )}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => imgRef.current.click()}
                                                                    id="custom-button"
                                                                >
                                                                    Upload{" "}
                                                                    <span>
                                                                        <img src="assets/img/Upload_ico.svg" alt="" />
                                                                    </span>
                                                                </button>
                                                                <span id="custom-text">
                                                                    {discriptionImage1[index]
                                                                        ? `${discriptionImage1[index].name} file selected.`
                                                                        : "Choose File"}
                                                                </span>
                                                            </div>
                                                            <div className="add_new">
                                                                {index === 0 ? (
                                                                    <a
                                                                        href="#"
                                                                        onClick={() =>
                                                                            setNumberOfInputs1(numberOfInputs1 + 1)
                                                                        }
                                                                    >
                                                                        <span>
                                                                            <img
                                                                                src="assets/img/Plus_circle.svg"
                                                                                alt=""
                                                                            />
                                                                        </span>{" "}
                                                                        Add New
                                                                    </a>
                                                                ) : (
                                                                    <img
                                                                        src="assets/img/Trash.svg"
                                                                        alt=""
                                                                        onClick={() =>
                                                                            setNumberOfInputs1(numberOfInputs1 - 1)
                                                                        }
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                        {createNftStep2Conditions.category && (
                                            <div className="col-md-12">
                                                <div className="single__edit__profile__step">
                                                    <label htmlFor="#">Category</label>
                                                    <select
                                                        class="form-select"
                                                        aria-label="select curation"
                                                        name="category"
                                                        value={createNftStep2.category}
                                                        onChange={handleUpdateValuesStep2}
                                                    >
                                                        <option value="">Select Category</option>
                                                        {categories?.map((value, index) => {
                                                            return (
                                                                <option key={index} value={value._id}>
                                                                    {value.name}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                        <div className="col-md-12">
                                            {createNftStep2Conditions.split && (
                                                <div className="ntf__flex__input__wrap">
                                                    <div className="single__edit__profile__step width_430">
                                                        <label htmlFor="#">Split Payments (%)</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Address"
                                                            name="address"
                                                            value={createNftStep2SplitInput.address}
                                                            onChange={handleUpdateValuesStep2Split}
                                                        />
                                                    </div>
                                                    <div
                                                        className="single__edit__profile__step"
                                                        style={{ width: 95 }}
                                                    >
                                                        <input
                                                            type="text"
                                                            placeholder="%"
                                                            name="percent"
                                                            value={createNftStep2SplitInput.percent}
                                                            onChange={handleUpdateValuesStep2Split}
                                                        />
                                                    </div>

                                                    <div className="input__add__btn">
                                                        <a
                                                            className="add_input_btn"
                                                            href="#"
                                                            onClick={() => {
                                                                setCreateNftStep2Split([
                                                                    ...createNftStep2Split,
                                                                    createNftStep2SplitInput,
                                                                ]);
                                                                setCreateNftStep2SplitInput({
                                                                    address: "",
                                                                    percent: "",
                                                                });
                                                            }}
                                                        >
                                                            <span>
                                                                <img src="assets/img/Plus_circle.svg" alt="" />
                                                            </span>{" "}
                                                            Add
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                            {createNftStep2Split.map((item, i) => (
                                                <div className="ntf__flex__input__wrap" key={i}>
                                                    <div className="single__edit__profile__step_custom width_430">
                                                        {item.address}
                                                    </div>
                                                    <div
                                                        className="single__edit__profile__step_custom"
                                                        style={{ width: 95 }}
                                                    >
                                                        {item.percent}%
                                                    </div>
                                                    <div className="input__add__btn">
                                                        <a
                                                            onClick={() => {
                                                                const tempArr = [...createNftStep2Split];
                                                                tempArr.splice(i, 1);
                                                                setCreateNftStep2Split([...tempArr]);
                                                            }}
                                                        >
                                                            <img src="assets/img/Trash.svg" alt="" />
                                                        </a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="col-md-12" style={{
                                            fontFamily: 'Manrope'
                                        }}>
                                            <div className="propatis__area">
                                                <div className="propertis__content">
                                                    <h4>Properties</h4>
                                                    <p>Textual Traits that show up as rectangle.</p>
                                                </div>
                                                <div className="flex flex-col gap-y-2 text-white my-10 cursor-pointer">
                                                    <h2 className="text-white font-medium text-lg">Select Properties Template</h2>
                                                </div>
                                                <div className="flex flex-wrap gap-5">
                                                    <div onClick={() => {
                                                        setPropMod({
                                                            by: 'default',
                                                            type: false,
                                                            index: null,
                                                            value: false
                                                        })
                                                        setSelectedProperty(null)
                                                    }} className="w-[18rem] prop-box h-[15rem] bg-[#232323] flex justify-center items-center rounded-md relative"
                                                        style={{
                                                            border: selectedProperty === null ? '2px solid #DDF247' : 'none'
                                                        }}>
                                                        <p className="text-white">Basic Template</p>
                                                    </div>
                                                    {
                                                        properties.length > 0 ?
                                                            properties.map((property, index) => {
                                                                return (
                                                                    <div 
                                                                    className="w-[18rem] prop-box h-[15rem] bg-[#232323] flex justify-center items-center rounded-md relative"
                                                                        style={{
                                                                            width: '18rem',
                                                                            height: '15rem',
                                                                            backgroundColor: '#232323',
                                                                            borderRadius: '0.375rem',
                                                                            display: 'flex',
                                                                            justifyContent: 'center',
                                                                            alignItems: 'center',
                                                                            position: 'relative',
                                                                            border: selectedProperty === property ? '2px solid #DDF247' : 'none'
                                                                        }}
                                                                        onClick={async () => {
                                                                            await makeUpdates(property)
                                                                            setPropMod({
                                                                                by: 'default',
                                                                                type: false,
                                                                                index: null,
                                                                                value: false
                                                                            })
                                                                            setSelectedProperty(property)
                                                                        }}>
                                                                        <p className="text-white" style={{
                                                                            color: 'white'
                                                                        }}>{property.name}</p>
                                                                    </div>
                                                                )
                                                            }) : null
                                                    }
                                                    <div className="w-[18rem] prop-box h-[15rem] bg-[#232323] flex flex-col relative justify-center cursor-pointer items-center rounded-md" onClick={() => {
                                                        setPopUp2({
                                                            active: true,
                                                            type: "property",
                                                            data: null
                                                        })
                                                    }}>
                                                        <div className="flex flex-col items-center" style={{
                                                            gap: '12px'
                                                        }}>
                                                            <div className="w-16 h-16 rounded-full bg-[#111111] border-2 border-[#FFFFFF4D] flex justify-center items-center" style={{
                                                                width: '4rem',
                                                                height: '4rem',
                                                                borderRadius: '100%',
                                                                backgroundColor: '#111111',
                                                                border: '2px solid #FFFFFF4D'
                                                            }}>
                                                                <img src="../../assets/icons/plus.svg" className="w-5 h-5" />
                                                            </div>
                                                            <p className="text-[#828282]" style={{
                                                                color: '#828282'
                                                            }}>Add New Template</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-3 my-5">
                                                    {
                                                        selectedProperty === null ? (
                                                            defaultBasicTemplate.length > 0 ?
                                                                defaultBasicTemplate.map((item, index) => {
                                                                    return (
                                                                        <div className='prop-box-small flex justify-center relative py-3 gap-y-1 flex-col w-[10rem] border-2 border-white rounded-md'>
                                                                            {
                                                                                (propMod.type && propMod.index === index && propMod.by === 'default') ?
                                                                                    <input type="text"
                                                                                        style={{
                                                                                            color: 'white',
                                                                                            textAlign: 'center',
                                                                                            width: '65%',
                                                                                            borderRadius: '0.375rem',
                                                                                            backgroundColor: 'transparent',
                                                                                            margin: 'auto'
                                                                                        }}
                                                                                        className='text-white text-center w-[65%] rounded-md bg-transparent mx-auto' onChange={(e) => {
                                                                                            modifyProp(index, 'type', e.target.value)
                                                                                            e.target.value = e.target.value
                                                                                        }} />
                                                                                    :
                                                                                    <p className='text-white text-center text-sm' onClick={() => setPropMod({ ...propMod, type: true, index: index, by: 'default' })}>{item.type}</p>
                                                                            }
                                                                            {
                                                                                (propMod.value && propMod.index === index && propMod.by === 'default') ?
                                                                                    <input type="text"
                                                                                        style={{
                                                                                            color: 'white',
                                                                                            textAlign: 'center',
                                                                                            width: '65%',
                                                                                            borderRadius: '0.375rem',
                                                                                            backgroundColor: 'transparent',
                                                                                            margin: 'auto'
                                                                                        }}
                                                                                        className='text-white text-center w-[65%] rounded-md bg-transparent mx-auto' onChange={(e) => {
                                                                                            modifyProp(index, 'value', e.target.value)
                                                                                            e.target.value = e.target.value
                                                                                        }} />
                                                                                    :
                                                                                    <p className='text-gray-400 text-center' onClick={() => setPropMod({ ...propMod, value: true, index: index, by: 'default' })}>{item.value}</p>
                                                                            }
                                                                            <div className='prop-cancel absolute top-2 right-2 cursor-pointer' onClick={() => removeProp(index)}>
                                                                                <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                    <path d="M4 4L14 14" stroke="#DDF247" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                                    <path d="M14 4L4 14" stroke="#DDF247" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                                </svg>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }) : null
                                                        ) : (
                                                            selectedProperty ?
                                                                selectedProperty.attributes.length > 0 ?
                                                                    selectedProperty.attributes.map((item, index) => {
                                                                        return (
                                                                            <div className='prop-box-small flex justify-center relative py-3 gap-y-1 flex-col w-[10rem] border-2 border-white rounded-md'>
                                                                                {
                                                                                    (propMod.type && propMod.index === index && propMod.by === 'default') ?
                                                                                        <input type="text" className='text-white text-center w-[65%] rounded-md bg-transparent mx-auto' onChange={(e) => {
                                                                                            modifyProp(index, 'type', e.target.value)
                                                                                            e.target.value = e.target.value
                                                                                        }} />
                                                                                        :
                                                                                        <p className='text-white text-center text-sm' onClick={() => setPropMod({ ...propMod, type: true, index: index, by: 'default' })}>{item.type}</p>
                                                                                }
                                                                                {
                                                                                    (propMod.value && propMod.index === index && propMod.by === 'default') ?
                                                                                        <input type="text" className='text-white text-center w-[65%] rounded-md bg-transparent mx-auto' onChange={(e) => {
                                                                                            modifyProp(index, 'value', e.target.value)
                                                                                            e.target.value = e.target.value
                                                                                        }} />
                                                                                        :
                                                                                        <p className='text-gray-400 text-center' onClick={() => setPropMod({ ...propMod, value: true, index: index, by: 'default' })}>{item.value}</p>
                                                                                }

                                                                                <div className='prop-cancel absolute top-2 right-2 cursor-pointer' onClick={() => removeProp(index)}>
                                                                                    <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                        <path d="M4 4L14 14" stroke="#DDF247" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                                                        <path d="M14 4L4 14" stroke="#DDF247" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                                                    </svg>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    }) : null : null
                                                        )
                                                    }
                                                    <div className='prop-add flex cursor-pointer justify-center relative py-3 gap-y-1 items-center w-[10rem] border-2 border-[#DDF247] rounded-md' onClick={addNewProp}>
                                                        <img src="../../assets/icons/add-new.svg" className="w-10 h-10" />
                                                        <p className='text-center text-sm text-[#DDF247]' style={{
                                                            marginBottom: '0px'
                                                        }}>Add New</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-x-3 item-center">
                                                    <img src="../../assets/icons/dot.svg" className="w-5 h-5" />
                                                    <span style={{
                                                        color: 'white',
                                                        paddingLeft: '10px'
                                                    }}>You can freely change properties values ​​by clicking on the title and content.</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="edit__profile__bottom__btn half__width__btn" style={{
                                            padding: '20px',
                                            width: '100%',
                                            maxWidth: 'none'
                                        }}>
                                            <a
                                                onClick={() => setStep(1)}
                                                className="cancel"
                                            >
                                                Previous
                                            </a>
                                            <a href="#" onClick={async () => {
                                                await makeUpdates(null)
                                                await createAdvancedDetails(false, null)
                                            }}>
                                                Next{" "}
                                                <span>
                                                    <img src="assets/img/arrow_ico.svg" alt="" />
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </> : null
            }

            {
                step === 3 ?
                    <>
                        <div className={step === 3 ? "connected__form" : "d-none"}>
                            <form action="#" style={{
                                fontFamily: 'Manrope'
                            }}>
                                <div className="flex flex-col gap-y-2 text-white my-10 cursor-pointer">
                                    <h4 className="text-white font-medium text-lg">Shipping Information</h4>
                                    <div className="flex flex-wrap gap-5">
                                        {
                                            sellers.length > 0 ?
                                                sellers.map((seller, index) => {
                                                    return (
                                                        <div className="w-[18rem] h-[15rem] bg-[#232323] flex flex-col justify-between p-4 rounded-md"
                                                            style={{
                                                                width: '18rem',
                                                                height: '15rem',
                                                                backgroundColor: '#232323',
                                                                borderRadius: '0.375rem',
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                                padding: '1rem',
                                                                border: selectedSeller === seller ? '2px solid #DDF247' : 'none'
                                                            }}
                                                            onClick={() => {
                                                                setSelectedSeller(seller)
                                                            }}
                                                        >
                                                            <div className="flex justify-between" style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between'
                                                            }}>
                                                                <div className="flex flex-col gap-y-2" style={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    gap: '0.5rem'
                                                                }}>
                                                                    <span>{seller.name}</span>
                                                                    <span className="text-[#A6A6A6]" style={{
                                                                        color: '#A6A6A6'
                                                                    }}>{seller.phoneNumber}</span>
                                                                </div>
                                                                <div className="text-[#A6A6A6]" style={{
                                                                    color: '#A6A6A6'
                                                                }}>{seller.shippingAddr}</div>
                                                            </div>
                                                            <div>
                                                                <p className="text-[#A6A6A6]" style={{
                                                                    color: '#A6A6A6'
                                                                }}>{`${seller.address.line1 + seller.address.line2 + seller.address.state + seller.address.city + seller.country}`.length > 150 ?
                                                                    `${seller.address.line1 + " " + seller.address.line2 + " " + seller.address.state + seller.address.city + " " + seller.country}`.slice(0, 150) + "..." :
                                                                    `${seller.address.line1 + " " + seller.address.line2 + " " + seller.address.state + " " + seller.address.city + " " + seller.country}`
                                                                } </p>
                                                            </div>
                                                            <div className="flex justify-end"
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent: 'flex-end'
                                                            }}
                                                            onClick={() => {
                                                                setPopUp2({
                                                                    active: true,
                                                                    type: "seller",
                                                                    data: {
                                                                        ...seller
                                                                    }
                                                                })
                                                            }}>
                                                                <span style={{
                                                                    color: '#DDF247',
                                                                    padding: '0.5rem 1rem',
                                                                    borderRadius: '0.375rem',
                                                                    border: '2px solid #9ca3af'
                                                                }} className="text-[#DDF247] px-2 py-1 rounded-md border-2 border-gray-400">Edit</span>
                                                            </div>
                                                        </div>
                                                    )
                                                }) : null
                                        }
                                        <div 
                                        style={{
                                            width: '18rem',
                                            height: '15rem',
                                            backgroundColor: '#232323',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: '0.375rem',
                                            cursor: 'pointer'
                                        }}
                                        className="w-[18rem] h-[15rem] bg-[#232323] flex flex-col relative justify-center cursor-pointer items-center rounded-md" onClick={() => {
                                            setPopUp2({
                                                active: true,
                                                type: "seller",
                                                data: null
                                            })
                                        }}>
                                            <div className="flex flex-col gap-y-6 items-center">
                                                <div 
                                                style={{
                                                    width: '4rem',
                                                    height: '4rem',
                                                    borderRadius: '100%',
                                                    backgroundColor: '#111111',
                                                    border: '2px solid #FFFFFF4D',
                                                    marginBottom: '0.85rem'
                                                }}
                                                className="w-16 h-16 rounded-full bg-[#111111] border-2 border-[#FFFFFF4D] flex justify-center items-center">
                                                    <img src="../../assets/icons/plus.svg" className="w-5 h-5" />
                                                </div>
                                                <p className="text-[#828282]">Add New Address</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-y-2 text-white my-10 cursor-pointer">
                                    <h4 className="text-white font-medium text-lg">Contact Information</h4>
                                    <div className="flex flex-wrap gap-5">
                                        {
                                            contacts.length > 0 ?
                                                contacts.map((contact, index) => {
                                                    return (
                                                        <div className="w-[18rem] h-[15rem] bg-[#232323] flex flex-col justify-between p-4 rounded-md"
                                                            style={{
                                                                width: '18rem',
                                                                height: '15rem',
                                                                backgroundColor: '#232323',
                                                                borderRadius: '0.375rem',
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                                padding: '1rem',
                                                                border: selectedContact === contact ? '2px solid #DDF247' : 'none'
                                                            }}
                                                            onClick={() => {
                                                                setSelectedContact(contact)
                                                            }}
                                                        >
                                                            <div className="flex justify-between" style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between'
                                                            }}>
                                                                <div className="flex flex-col gap-y-2" style={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    gap: '0.5rem'
                                                                }}>
                                                                    <span>{contact.name ? contact.name : `#${index + 1}`}</span>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p className="text-[#A6A6A6] py-1" style={{
                                                                    color: '#A6A6A6',
                                                                    padding: '0.5rem 0rem'
                                                                }}>{contact.contactInfo.length > 150 ? `${contact.contactInfo.slice(0, 150)}...` : contact.contactInfo}...</p>
                                                            </div>
                                                            <div className="flex justify-end" style={{
                                                                display: 'flex',
                                                                justifyContent: 'flex-end'
                                                            }} onClick={() => {
                                                                setPopUp2({
                                                                    active: true,
                                                                    type: 'contact',
                                                                    data: {
                                                                        ...contact
                                                                    }
                                                                })
                                                            }}>
                                                                <span style={{
                                                                    color: '#DDF247',
                                                                    padding: '0.5rem 1rem',
                                                                    borderRadius: '0.375rem',
                                                                    border: '2px solid #9ca3af'
                                                                }} className="text-[#DDF247] px-2 py-1 rounded-md border-2 border-gray-400 text-sm">Edit</span>
                                                            </div>
                                                        </div>
                                                    )
                                                }) : null
                                        }
                                        <div 
                                        style={{
                                            width: '18rem',
                                            height: '15rem',
                                            backgroundColor: '#232323',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: '0.375rem',
                                            cursor: 'pointer'
                                        }}
                                        className="w-[18rem] h-[15rem] bg-[#232323] flex flex-col relative justify-center cursor-pointer items-center rounded-md" onClick={() => {
                                            setPopUp2({
                                                active: true,
                                                type: "contact",
                                                data: null
                                            })
                                        }}>
                                            <div className="flex flex-col gap-y-6 items-center">
                                                <div 
                                                style={{
                                                    width: '4rem',
                                                    height: '4rem',
                                                    borderRadius: '100%',
                                                    backgroundColor: '#111111',
                                                    border: '2px solid #FFFFFF4D',
                                                    marginBottom: '0.85rem'
                                                }}
                                                className="w-16 h-16 rounded-full bg-[#111111] border-2 border-[#FFFFFF4D] flex justify-center items-center">
                                                    <img src="../../assets/icons/plus.svg" className="w-5 h-5" />
                                                </div>
                                                <p className="text-[#828282]">Add New Information</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="common__edit__proe__wrap mt-4">
                                    <div className="edit__profilfile__inner__top__blk">
                                        <div className="edit__profile__inner__title">
                                            <h5>Shipment Information</h5>
                                        </div>
                                        <div className="edit_profile_inner_top_right">
                                            <div className="edit__profile__angle__ico">
                                                <span>
                                                    <img src="assets/img/angle_up.svg" alt="" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="edit__profile__form">
                                        <div className="row gy-4 gx-3">
                                            <div className="col-xl-3 col-lg-4 col-md-6">
                                                <div className="single__edit__profile__step">
                                                    <label htmlFor="#">Length (cm)</label>
                                                    <input
                                                        type="text"
                                                        placeholder="--"
                                                        name="lengths"
                                                        value={sellerInfo.lengths}
                                                        onChange={handleUpdateSeller}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-xl-3 col-lg-4 col-md-6">
                                                <div className="single__edit__profile__step">
                                                    <label htmlFor="#">Width (cm)</label>
                                                    <input
                                                        type="text"
                                                        placeholder="--"
                                                        name="width"
                                                        value={sellerInfo.width}
                                                        onChange={handleUpdateSeller}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-xl-3 col-lg-4 col-md-6">
                                                <div className="single__edit__profile__step">
                                                    <label htmlFor="#">Height (cm)</label>
                                                    <input
                                                        type="text"
                                                        placeholder="--"
                                                        name="height"
                                                        value={sellerInfo.height}
                                                        onChange={handleUpdateSeller}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-xl-3 col-lg-4 col-md-6">
                                                <div className="single__edit__profile__step">
                                                    <label htmlFor="#">Weight (kg)</label>
                                                    <input
                                                        type="text"
                                                        placeholder="--"
                                                        name="weight"
                                                        value={sellerInfo.weight}
                                                        onChange={handleUpdateSeller}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="common__edit__proe__wrap mt-4">
                                    <div className="edit__profilfile__inner__top__blk">
                                        <div className="edit__profile__inner__title">
                                            <h5>
                                                Consent for collection and Usage of Personal Information
                                            </h5>
                                            <p style={{
                                                color: 'white',
                                                margin: '20px 0px 0px 0px'
                                            }}>
                                                Please read the following and check the appropriate boxes
                                                to indicate your consent:
                                            </p>
                                        </div>
                                        <div className="edit_profile_inner_top_right">
                                            <div className="edit__profile__angle__ico">
                                                <span>
                                                    <img src="assets/img/angle_up.svg" alt="" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="edit__profile__form">
                                        <div className="row gy-4 gx-3">
                                            <div className="col-xl-12">
                                                <div className="single__edit__profile__step">
                                                    <textarea
                                                        placeholder="faucibus id malesuada aliquam. Tempus morbi turpis nulla viverra tellus mauris cum. Est consectetur commodo turpis habitasse sed. Nibh tincidunt quis nunc placerat arcu sagittis. In vitae fames nunc consectetur. Magna faucibus sit risus sed tortor malesuada purus. Donec fringilla orci lobortis quis id blandit rhoncus. "
                                                        id=""
                                                        disabled={true}
                                                        cols={30}
                                                        rows={10}
                                                        name="consent"
                                                        value={sellerInfo.consent}
                                                        onChange={handleUpdateSeller}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="agree__radio__btn">
                                    <div className="codeplay-ck">
                                        <label className="container-ck" style={{
                                            margin: '20px 0px'
                                        }}>
                                            <p style={{
                                                color: 'white'
                                            }}>I agree to all Term, Privacy Polic and fees</p>
                                            <input type="checkbox" defaultChecked="checked" />
                                            <span className="checkmark" />
                                        </label>
                                    </div>
                                </div>
                                <div className="edit__profile__bottom__btn half__width__btn" style={{
                                    margin: '0px',
                                    maxWidth: 'none'
                                }}>
                                    <a
                                        onClick={() => setStep(2)}
                                        className="cancel"
                                    >
                                        Previous
                                    </a>
                                    <a
                                        // data-bs-toggle="modal"
                                        href="#exampleModalToggle"
                                        role="button"
                                        onClick={createSellerInfo}
                                    >
                                        Proceed to Create NFT{" "}
                                        <span>
                                            <img src="assets/img/arrow_ico.svg" alt="" />
                                        </span>
                                    </a>
                                </div>
                            </form>
                        </div>
                    </> : null
            }

            <div
                className="modal fade common__popup__blk"
                id="discardPopup"
                aria-hidden="true"
                aria-labelledby="discardPopupLabel"
                tabIndex={-1}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body similar__site__popup">
                            <div className="popup__inner__blk text-center">
                                <span className="close_modal" data-bs-dismiss="modal">
                                    <i className="fa fa-times" />
                                </span>
                                <div className="congrats__img">
                                    <img
                                        src="assets/img/exclamation.svg"
                                        className="mx-auto w-fit"
                                        alt=""
                                    />
                                </div>
                                <div className="popup__common__title mt-20 text-center">
                                    <h5>
                                        If You Exit This page, the minting information Progress will
                                        be lost. Do you still want to proceed?
                                    </h5>
                                    <div className="flex gap-8 items-center justify-center">
                                        <button
                                            className="font-manrope font-semibold rounded h-12 w-20 bg-white/5 text-white"
                                            data-bs-dismiss="modal"
                                        >
                                            No
                                        </button>
                                        <button
                                            data-bs-dismiss="modal"
                                            className="font-manrope font-semibold rounded h-12 w-20 bg-[#DDF247]"
                                            onClick={discardData}
                                        >
                                            Yes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="modal fade common__popup__blk"
                id="exampleModalToggle"
                aria-hidden="true"
                aria-labelledby="exampleModalToggleLabel"
                tabIndex={-1}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body similar__site__popup">
                            <div className="popup__inner__blk text-center">
                                <span className="close_modal" data-bs-dismiss="modal">
                                    <i className="fa fa-times" />
                                </span>
                                <div className="congrats__img">
                                    <img
                                        src="assets/img/exclamation.svg"
                                        className="mx-auto w-fit"
                                        alt=""
                                    />
                                </div>
                                <div className="popup__common__title mt-20 text-center">
                                    <h5>
                                        {!createNftStep1.curation ? (
                                            <>
                                                “You must select curation for NFT creation. Permission
                                                is required to create curation. Click Learn More or
                                                contact administrator.”
                                            </>
                                        ) : (
                                            <>“Please Check if the Fields are Valid”</>
                                        )}
                                    </h5>
                                    <div
                                        className="popup__inner__button edit__profile__bottom__btn pt-20 pb-0"
                                        style={{ maxWidth: 320, margin: "auto" }}
                                    >
                                        <a href="#" className="no_btn">
                                            No
                                        </a>
                                        <a
                                            data-bs-target="#exampleModalToggle2"
                                            data-bs-toggle="modal"
                                            data-bs-dismiss="modal"
                                            href="#"
                                        >
                                            Yes
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="modal  common__popup__blk"
                id="exampleModalToggle1"
                aria-hidden="true"
                aria-labelledby="exampleModalToggleLabel"
                tabIndex={-1}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body similar__site__popup">
                            <div className="popup__inner__blk">
                                <div className="popup__common__title mt-20">
                                    <h5>NFT Creation is in Progress</h5>
                                    <p>Transfer this token from your wallet to other wallet.</p>
                                </div>
                            </div>
                            <div className="popup__progress__list">
                                <div
                                    className={
                                        message >= 1
                                            ? "single__popup__progress__list"
                                            : "single__popup__progress__list disable_item"
                                    }
                                >
                                    <a href="#">
                                        <div className="popup__progress__ico">
                                            <img src="assets/img/refresh_ico_1.svg" alt="" />
                                        </div>
                                        <div className="popup__progress__text">
                                            <h5>Upload NFTs</h5>
                                            <p>Uploading of all media assets and metadata to IPFS</p>
                                        </div>
                                    </a>
                                </div>
                                <div
                                    className={
                                        message >= 2
                                            ? "single__popup__progress__list"
                                            : "single__popup__progress__list disable_item"
                                    }
                                >
                                    <a href="#">
                                        <div className="popup__progress__ico">
                                            <img src="assets/img/refresh_ico_1.svg" alt="" />
                                        </div>
                                        <div className="popup__progress__text">
                                            <h5>Mint</h5>
                                            <p>Send transaction to create your NFT</p>
                                        </div>
                                    </a>
                                </div>
                                <div
                                    className={
                                        message === 3
                                            ? "single__popup__progress__list"
                                            : "single__popup__progress__list disable_item"
                                    }
                                >
                                    <a href="#">
                                        <div className="popup__progress__ico">
                                            <img src="assets/img/list_gray_refresh.svg" alt="" />
                                        </div>
                                        <div className="popup__progress__text">
                                            <h5>Listing for sale</h5>
                                            <p>Send transaction to list your NFT</p>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="modal fade common__popup__blk"
                id="exampleModalToggle2"
                aria-hidden="true"
                aria-labelledby="exampleModalToggleLabel2"
                tabIndex={-1}
            >
                <div
                    className="modal-dialog modal-dialog-centered"
                    style={{ maxWidth: 780 }}
                >
                    <div className="modal-content">
                        <div className="modal-body similar__site__popup">
                            <div className="popup__inner__blk">
                                <div className="popup__common__title">
                                    <h5>
                                        <span>
                                            <img src="assets/img/information_icon_1.svg" alt="" />
                                        </span>{" "}
                                        Caution
                                    </h5>
                                </div>
                                <div className="popup__information__content">
                                    <h6>
                                        Do not disclose buyer shipping information to third parties!
                                    </h6>
                                    <p>
                                        To maintain the confidentiality of buyer information and
                                        ensure smooth transactions, please pay close attention to
                                        the following points:
                                    </p>
                                    <p>
                                        <span>1.</span> Confidentiality of Shipping Information:
                                        Buyer shipping information should remain confidential to
                                        sellers. Be cautious to prevent any external disclosures.
                                    </p>
                                    <p>
                                        <span>2.</span> Tips for Safe Transactions: Handle buyer
                                        shipping information securely to sustain safe and
                                        transparent transactions.
                                    </p>
                                    <p>
                                        <span>3.</span> Protection of Personal Information: As a
                                        seller, it is imperative to treat buyer personal information
                                        with utmost care. Avoid disclosing it to third parties.We
                                        kindly request your strict adherence to these guidelines to
                                        uphold transparency and trust in your transactions. Ensuring
                                        a secure transaction environment benefits everyone involved.
                                    </p>
                                    <h5>Thank You</h5>
                                </div>
                                <div
                                    className="popup__inner__button edit__profile__bottom__btn pt-20 pb-0"
                                    style={{ maxWidth: 210, margin: "auto" }}
                                >
                                    <a
                                        data-bs-dismiss="modal"
                                        href="#"
                                        onClick={() => {
                                            const elem = new bootstrap.Modal(
                                                document.getElementById("exampleModalToggle3")
                                            );
                                            elem.show();
                                            setAgree(true);
                                        }}
                                    >
                                        I Agree
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="modal fade common__popup__blk"
                id="exampleModalToggle3"
                aria-hidden="true"
                aria-labelledby="exampleModalToggleLabel3"
                tabIndex={-1}
            >
                <div
                    className="modal-dialog modal-dialog-centered"
                    style={{ maxWidth: 420 }}
                >
                    <div className="modal-content">
                        <div className="modal-body similar__site__popup">
                            <div className="popup__inner__blk">
                                <div className="popup__common__title">
                                    <h5 className="yellow_color mb-10">Congratulations!</h5>
                                    <p className="white">Your NFT is Published.</p>
                                </div>
                                <div className="congrats__social__ico">
                                    <div className="profile__social__ico">
                                        <a href="#">
                                            <i className="fab fa-twitter" />
                                        </a>
                                        <a href="#">
                                            <i className="fas fa-paper-plane" />
                                        </a>
                                        <a href="#">
                                            <i className="fab fa-discord" />
                                        </a>
                                    </div>
                                </div>
                                <div className="popup__inner__button half__width__btn edit__profile__bottom__btn pt-20 pb-0">
                                    <a href="#" onClick={viewNft}>
                                        View NFT
                                    </a>
                                    <a href="#" className="cancel" data-bs-dismiss="modal">
                                        Close
                                    </a>
                                </div>
                                <div className="congrats__copy__text">
                                    <div className="breadcrumb__inner__blk">
                                        <div className="copy-text">
                                            <input
                                                type="text"
                                                className="text"
                                                defaultValue="https://playground.wpsmartnft.com/token/dark-theme-web-design/https://playground.wpsmartnft.com/token/dark-theme-web-design/"
                                            />
                                            <button>
                                                <img src="assets/img/Document_ico.svg" alt="" />
                                            </button>
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
                id="exampleModalToggle4"
                aria-hidden="true"
                aria-labelledby="exampleModalToggleLabel"
                tabIndex={-1}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body similar__site__popup">
                            <div className="popup__inner__blk text-center">
                                <div className="congrats__img w-fit mx-auto">
                                    <img src="assets/img/refresh_ico_1.svg" alt="" />
                                </div>
                                <div className="popup__common__title mt-20">
                                    <h4>
                                        {message ? message : "In Progress Please Wait ssss ..."}
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="modal fade common__popup__blk"
                id="exampleModalToggl1"
                aria-hidden="true"
                aria-labelledby="exampleModalToggleLabel"
                tabIndex={-1}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body similar__site__popup">
                            <div className="popup__inner__blk text-center">
                                <div className="congrats__img flex items-center justify-center">
                                    <img src="assets/img/Check_circle.svg" alt="" />
                                </div>
                                <div className="popup__common__title mt-20">
                                    <h4>Your Collection is Created.</h4>
                                </div>
                            </div>
                        </div>
                    </div>
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
                            <div className="popup__inner__blk text-center">
                                <div className="congrats__img">
                                    <img src="assets/img/request_popup.svg" alt="" />
                                </div>
                                <div className="popup__common__title mt-20 text-center">
                                    <h5>
                                        You don&apos;t have permission to Create Curation. Click
                                        Learn More or Contact the Administrator
                                    </h5>
                                    <div className="learn_more_popup">
                                        <a href="#">Learn More</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="modal fade common__popup__blk"
                id="errorCreatingCurationModal"
                aria-hidden="true"
                aria-labelledby="errorCreatingCurationLabel"
                tabIndex={-1}
            >
                <div
                    className="modal-dialog modal-dialog-centered"
                    style={{ maxWidth: 780 }}
                >
                    <div className="modal-content">
                        <div className="modal-body similar__site__popup">
                            <div className="popup__inner__blk">
                                <div className="popup__common__title">
                                    <h5 className="flex items-center gap-2">
                                        <span>
                                            <img src="assets/img/information_icon_1.svg" alt="" />
                                        </span>{" "}
                                        Error in Creating Caution is find
                                    </h5>
                                </div>
                                <div className="popup__information__content">
                                    {errorCuration ? errorCuration.map((err, i) => (
                                        <p key={i}>
                                            <span>{i + 1}.</span> {err}
                                        </p>
                                    )) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}