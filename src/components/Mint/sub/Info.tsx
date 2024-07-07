import React, { useEffect, useState } from 'react'
import PhoneInput from 'react-phone-input-2'
import { City, Country, State } from "country-state-city";
import { upsertContactInfo, upsertProperty, upsertSellerInfo } from '../../../services/services';

export default function Info(prop) {

    const [sellerInfo, setSellerInfo] = useState<any>({
        id: null,
        type: "",
        name: "",
        email: "",
        shippingAddr: "",
        country: "",
        address1: "",
        address2: "",
        state: "",
        city: "",
        postalCode: "",
        phoneNumber: "",
    });
    const [contact, setContact] = useState({
        id: null,
        name: "",
        contactInfo: "",
    });
    const [property, setProperty] = useState({
        id: null,
        name: "",
        attributes: [
            {
                type: 'Length',
                value: '150cm'
            },
            {
                type: 'Height',
                value: '5cm'
            },
            {
                type: 'Width',
                value: '150cm'
            },
            {
                type: 'Weight',
                value: '5kg'
            }
        ]
    })
    const [propMod, setPropMod] = useState({
        by: null,
        type: false,
        value: false,
        index: null
    })
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [countryCode, setCountryCode] = useState("");
    const countries = Country.getAllCountries();

    const removeProp = (index) => {
        if (property.attributes.length === 1) {
            return
        }

        setPropMod({
            by: null,
            index: null,
            type: false,
            value: false,
        })
        const newArr = property.attributes.filter((item, idx) => idx !== index)
        setProperty({
            ...property,
            attributes: newArr
        })
    }

    const modifyProp = (index, forType, value) => {
        const newArr = property.attributes.map((item, idx) => {
            if (idx === index) {
                item[`${forType}`] = value
                return item
            }
            return item
        })
        setProperty({
            ...property,
            attributes: newArr
        })
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

        setProperty({
            ...property,
            attributes: [...property.attributes, newProp]
        })
    }

    const saveSeller = async () => {
        const response = await upsertSellerInfo({
            id: sellerInfo.id,
            type: sellerInfo.type,
            name: sellerInfo.name,
            email: sellerInfo.email,
            country: (sellerInfo.country as any).name ? (sellerInfo.country as any).name : sellerInfo.country,
            shippingAddr: sellerInfo.shippingAddr,
            address: {
                line1: sellerInfo.address1,
                line2: sellerInfo.address2,
                state: (sellerInfo.state as any).name ? (sellerInfo.state as any).name : sellerInfo.state,
                city: (sellerInfo.city as any).name ? (sellerInfo.city as any).name : sellerInfo.city,
                postalCode: sellerInfo.postalCode,
            },
            phoneNumber: sellerInfo.phoneNumber,
        })

        if (response) {
            if (prop.onSaveSeller) {
                prop.onSaveSeller()
            }
        }
    }

    const saveContact = async () => {
        const response = await upsertContactInfo({
            id: contact.id,
            name: contact.name,
            contactInfo: contact.contactInfo,
        })

        if (response) {
            prop.onSaveContact()
        }
    }

    const resetInfo = () => {
        if (prop.type === 'seller') {
            setSellerInfo({
                type: "",
                name: "",
                email: "",
                country: "",
                shippingAddr: "",
                address: {
                    line1: "",
                    line2: "",
                    state: "",
                    city: "",
                    postalCode: "",
                },
                phone: "",
            })
        } else if (prop.type === 'contact') {
            setContact({
                ...contact,
                name: "",
                contactInfo: "",
            })
        } else {
            setProperty({
                ...property,
                name: "",
                attributes: []
            })
        }
    }

    const handleUpdateSeller = (e) => {
        const { name, value } = e.target;
        if (name === "country") {
            const parsedVal = JSON.parse(value);
            const countryStates = State.getStatesOfCountry(parsedVal.isoCode);
            setStates(countryStates);
            setCountryCode(parsedVal.isoCode);
            setSellerInfo({
                ...sellerInfo,
                [name]: parsedVal,
            })
            return null
        } else if (name === "state") {
            const parsedVal = JSON.parse(value);
            const stateCities = City.getCitiesOfState(countryCode, parsedVal.isoCode);
            setCities(stateCities);
            setSellerInfo({
                ...sellerInfo,
                [name]: parsedVal,
            })
            return null
        } else if (name === 'city') {
            const parsedVal = JSON.parse(value);
            setSellerInfo({
                ...sellerInfo,
                [name]: parsedVal,
            })
            return null
        }
        setSellerInfo({
            ...sellerInfo,
            [name]: value,
        });
    };

    const handleUpdateContact = (e) => {
        const { name, value } = e.target;
        setContact({
            ...contact,
            [name]: value,
        });
    }

    const [propAttr, setPropAttr] = useState([])

    const handleUpdateProperty = (e) => {
        const { name, value } = e.target;
        setProperty({
            ...property,
            [name]: value,
        });
    }

    const handlePhoneInput = (value) => {
        setSellerInfo({
            ...sellerInfo,
            phoneNumber: value,
        });
    };

    const removeAttr = (index) => {
        const filtered = property.attributes.filter((item) => item !== index)

        setProperty({
            ...property,
            attributes: filtered
        })
    }


    const [attr, setAttr] = useState({
        type: "",
        value: "",
    })

    const addAttribute = (data) => {
        if (attr.type === "" || attr.value === "") {
            return null
        }
        const newAttributes = [...property.attributes, { type: attr.type, value: attr.value }];

        setProperty({
            ...property,
            attributes: newAttributes
        })
    }

    const saveProperty = async () => {
        const response = await upsertProperty({
            id: property.id,
            name: property.name,
            attributes: property.attributes
        })

        if (response) {
            const data = {
                id: property.id,
                name: property.name,
                attributes: property.attributes
            }

            if (prop.onSave) {
                prop.onSave(data)
            }
        }
    }

    useEffect(() => {
        if (prop.data) {
            if (prop.type === 'seller') {
                const countryJSON = Country.getAllCountries().find((item) => item.name === prop.data.country)
                const stateJSON = State.getStatesOfCountry(countryJSON.isoCode).find((item) => item.name === prop.data.address.state)
                const cityJSON = City.getCitiesOfState(countryJSON.isoCode, stateJSON.isoCode).find((item) => item.name === prop.data.address.city)

                const states = State.getStatesOfCountry(countryJSON.isoCode);
                setStates(states);

                const cities = City.getCitiesOfState(countryJSON.isoCode, stateJSON.isoCode);
                setCities(cities);

                setSellerInfo({
                    id: prop.data._id,
                    type: prop.data.type,
                    name: prop.data.name,
                    email: prop.data.email,
                    country: countryJSON ? countryJSON : prop.data.country,
                    shippingAddr: prop.data.shippingAddr,
                    address1: prop.data.address ? prop.data.address.line1 : "",
                    address2: prop.data.address ? prop.data.address.line2 : "",
                    state: stateJSON ? stateJSON : "",
                    city: cityJSON ? cityJSON : "",
                    postalCode: prop.data.address ? prop.data.address.postalCode : "",
                    phoneNumber: prop.data.phoneNumber,
                })
            } else if (prop.type === 'contact') {
                setContact({
                    id: prop.data._id,
                    name: prop.data.name,
                    contactInfo: prop.data.contactInfo,
                })
            } else {
                setProperty({
                    id: prop.data._id,
                    name: prop.data.name,
                    attributes: prop.data.attributes
                })
            }
        }
    }, [])

    return (
        <div className='overflow-auto' style={{
            width: '100%',
            height: '95%'
        }}>
            {
                prop.type === 'seller' ?
                    <>
                        <div className="common__edit__proe__wrap mt-4">
                            <div className="edit__profilfile__inner__top__blk">
                                <div className="edit__profile__inner__title">
                                    <h5>Shipping Address Name</h5>
                                </div>
                                <div className="edit_profile_inner_top_right">
                                    <div className="edit__profile__angle__ico">
                                        <span>
                                            <img src="assets/img/angle_up.svg" alt="" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="single__edit__profile__step mb-3">
                                <input
                                    type="text"
                                    placeholder="Enter Shipping Address Name* (Home, gallery, studio, etc)"
                                    value={sellerInfo.shippingAddr}
                                    onChange={(e) => {
                                        setSellerInfo({
                                            ...sellerInfo,
                                            shippingAddr: e.target.value
                                        })
                                    }}
                                />
                            </div>
                            <div className="edit__profilfile__inner__top__blk">
                                <div className="edit__profile__inner__title">
                                    <h5>Seller Information</h5>
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
                                    <div className="col-lg-4 col-md-6">
                                        <div className="single__edit__profile__step">
                                            <label htmlFor="#">Name*</label>
                                            <input
                                                type="text"
                                                placeholder="Enter Name*"
                                                name="name"
                                                value={sellerInfo.name}
                                                onChange={handleUpdateSeller}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6">
                                        <div className="single__edit__profile__step">
                                            <label htmlFor="#">E-mail*</label>
                                            <input
                                                type="text"
                                                placeholder="Email address*"
                                                name="email"
                                                value={sellerInfo.email}
                                                onChange={handleUpdateSeller}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6">
                                        <div className="single__edit__profile__step_custom_2">
                                            <label htmlFor="#" style={{
                                                marginBottom: '5px',
                                                color: 'white'
                                            }}>Country*</label>
                                            <select
                                                className="form-select"
                                                aria-label="select curation"
                                                name="country"
                                                value={JSON.stringify(sellerInfo.country)}
                                                onChange={handleUpdateSeller}
                                                style={{
                                                    minHeight: '60px',
                                                    borderRadius: '10px'
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {countries.map((item) => (
                                                    <option
                                                        key={item.isoCode}
                                                        value={JSON.stringify(item)}
                                                    >
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="common__edit__proe__wrap mt-4">
                            <div className="edit__profilfile__inner__top__blk">
                                <div className="edit__profile__inner__title">
                                    <h5>Shipping Address</h5>
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
                                    <div className="col-md-6">
                                        <div className="single__edit__profile__step">
                                            <label htmlFor="#">Address 1*</label>
                                            <input
                                                type="text"
                                                placeholder="Enter Your Street Address*"
                                                name="address1"
                                                value={sellerInfo.address1}
                                                onChange={handleUpdateSeller}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="single__edit__profile__step">
                                            <label htmlFor="#">Address 2</label>
                                            <input
                                                type="text"
                                                placeholder="Enter Your Street Address*"
                                                name="address2"
                                                value={sellerInfo.address2}
                                                onChange={handleUpdateSeller}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-4">
                                        <div className="single__edit__profile__step_custom_2">
                                            <label htmlFor="#" style={{
                                                fontSize: '18px',
                                                marginBottom: '13px',
                                                color: 'white'
                                            }}>State*</label>
                                            <select
                                                className="form-select"
                                                aria-label="select curation"
                                                name="state"
                                                value={JSON.stringify(sellerInfo.state)}
                                                onChange={handleUpdateSeller}
                                                style={{
                                                    minHeight: '60px',
                                                    borderRadius: '10px'
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {states.map((item) => (
                                                    <option
                                                        key={item.isoCode}
                                                        value={JSON.stringify(item)}
                                                    >
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-4">
                                        <div className="single__edit__profile__step_custom_2">
                                            <label htmlFor="#" style={{
                                                fontSize: '18px',
                                                marginBottom: '13px',
                                                color: 'white'
                                            }}>City*</label>
                                            <select
                                                className="form-select"
                                                aria-label="select curation"
                                                name="city"
                                                value={sellerInfo.city ? JSON.stringify(sellerInfo.city) : ""}
                                                onChange={handleUpdateSeller}
                                                style={{
                                                    minHeight: '60px',
                                                    borderRadius: '10px'
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {cities.map((item) => (
                                                    <option key={item.isoCode} value={JSON.stringify(item)}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6">
                                        <div className="single__edit__profile__step">
                                            <label htmlFor="#" style={{
                                                fontSize: '16px',
                                                marginBottom: '18px',
                                            }}>Postal Code*</label>
                                            <input
                                                type="number"
                                                placeholder="Enter Postal Code"
                                                name="postalCode"
                                                value={sellerInfo.postalCode ? sellerInfo.postalCode : ""}
                                                onChange={handleUpdateSeller}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="single__edit__profile__step" style={{
                                            color: 'white'
                                        }}>
                                            <label htmlFor="#">Phone Number*</label>
                                            <PhoneInput
                                                enableLongNumbers={true}
                                                containerClass="phone-container"
                                                buttonClass="phone-dropdown"
                                                inputClass="phone-control"
                                                country={"us"}
                                                value={sellerInfo.phoneNumber}
                                                onChange={handlePhoneInput}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="edit__profile__bottom__btn half__width__btn" style={{
                            margin: '0px',
                            width: '100%',
                            maxWidth: 'none'
                        }}>
                            <a
                                role="button"
                                className="cancel"
                                onClick={() => {
                                    if (prop.onCancel) {
                                        prop.onCancel()
                                    }
                                }}
                            >
                                Cancel
                            </a>
                            <a
                                role="button"
                                onClick={saveSeller}
                            >
                                Save{" "}
                            </a>
                        </div>
                    </> : null
            }

            {
                prop.type === 'contact' ?
                    <>
                        <div className="common__edit__proe__wrap mt-4">
                            <div className="edit__profilfile__inner__top__blk">
                                <div className="edit__profile__inner__title">
                                    <h5>Contact Information Name</h5>
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
                                        <div className="single__edit__profile__step mb-3">
                                            <input
                                                type="text"
                                                placeholder="Enter Shipping Address Name* (Home, gallery, studio, etc)"
                                                name="name"
                                                value={contact.name}
                                                onChange={handleUpdateContact}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="common__edit__proe__wrap mt-4">
                            <div className="edit__profilfile__inner__top__blk">
                                <div className="edit__profile__inner__title">
                                    <h5>Contact Information For seller</h5>
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
                                                placeholder="Please describe your product*"
                                                id=""
                                                cols={30}
                                                rows={10}
                                                name="contactInfo"
                                                value={contact.contactInfo}
                                                onChange={handleUpdateContact}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="edit__profile__bottom__btn half__width__btn" style={{
                            margin: '0px',
                            width: '100%',
                            maxWidth: 'none'
                        }}>
                            <a
                                role="button"
                                className="cancel"
                                onClick={() => {
                                    if (prop.onCancel) {
                                        prop.onCancel()
                                    }
                                }}
                            >
                                Cancel
                            </a>
                            <a
                                role="button"
                                onClick={saveContact}
                            >
                                Save{" "}
                            </a>
                        </div>
                    </> : null
            }

            {
                prop.type === 'property' ?
                    <>
                        <div className="common__edit__proe__wrap mt-4">
                            <div className="edit__profilfile__inner__top__blk">
                                <div className="edit__profile__inner__title">
                                    <h5>Properties Template Name</h5>
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
                                        <div className="single__edit__profile__step mb-3">
                                            <input
                                                type="text"
                                                placeholder="Enter Your Properties Template Name"
                                                name="name"
                                                value={property.name}
                                                onChange={handleUpdateProperty}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-4 my-6" style={{
                            margin: '24px 0px',
                        }}>
                            <p className="text-xl font-medium text-white">Properties value</p>
                            <div className='flex gap-4 flex-wrap'>
                                {
                                    property ?
                                        property.attributes.length > 0 ?
                                            property.attributes.map((item, index) => {
                                                return (
                                                    <div 
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        position: 'relative',
                                                        padding: '0.75rem 0px',
                                                        gap: '0.25rem',
                                                        width: '10rem',
                                                        border: '2px solid white',
                                                        borderRadius: '0.375rem'
                                                    }}
                                                    className='flex justify-center relative py-3 gap-y-1 flex-col w-[10rem] border-2 border-white rounded-md'>
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

                                                        <div style={{
                                                            position: 'absolute',
                                                            top: '0.5rem',
                                                            right: '0.5rem',
                                                            cursor: 'pointer'
                                                        }} className='absolute top-2 right-2 cursor-pointer' onClick={() => removeProp(index)}>
                                                            <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M4 4L14 14" stroke="#DDF247" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                                <path d="M14 4L4 14" stroke="#DDF247" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                )
                                            }) : null : null
                                }
                                <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    padding: '0.75rem 0px',
                                    gap: '0.25rem',
                                    width: '10rem',
                                    border: '2px solid #DDF247',
                                    borderRadius: '0.375rem'
                                }}
                                className='flex cursor-pointer justify-center relative py-3 gap-y-1 items-center w-[10rem] border-2 border-[#DDF247] rounded-md' onClick={addNewProp}>
                                    <img src="../../assets/icons/add-new.svg" className="w-10 h-10" />
                                    <p className='text-center text-sm text-[#DDF247]' style={{
                                        color: '#DDF247',
                                        marginBottom: '0px'
                                    }}>Add New</p>
                                </div>
                            </div>
                        </div>
                        <div className="edit__profile__bottom__btn half__width__btn" style={{
                            margin: '0px',
                            width: '100%',
                            maxWidth: 'none'
                        }}>
                            <a
                                role="button"
                                className="cancel"
                                onClick={() => {
                                    if (prop.onCancel) {
                                        prop.onCancel()
                                    }
                                }}
                            >
                                Cancel
                            </a>
                            <a
                                role="button"
                                onClick={saveProperty}
                            >
                                Save{" "}
                            </a>
                        </div>
                    </> : null
            }

        </div>
    )
}
