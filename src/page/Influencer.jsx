import React, { useState, useRef, useEffect, useContext } from 'react'
import Layout from '../layout/Layout'
import { Button, Col, Row } from 'react-bootstrap'
import { CartContext } from '../context/CartContext'
import SucessSnackBar from "./SnackBar/SnackBar";
import ErrorSnackBar from "./SnackBar/SnackBar";
import { validate } from './influencerSchima';
import Select from 'react-select';
import { Is_Login } from '../helper/IsLogin'
import api from '../helper/api';
import { getServerURL } from '../helper/envConfig'

const Influencer = () => {

    const { getcartcount, setMainLoder, couponId, itemShow, setItemShow, add_wished_Called, getCartData, cartList, profileOption, setProfileOption, userProductList, wishProductUrl, category, currentUser,
        productList, trendingProductList, getProducts, getWishList, wishlist, addWishList } = useContext(CartContext);

    const initialValues = {
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        country_id: "",
        state_id: "",
        tiktok_followers: "",
        youtub_followers: "",
        instagram_followers: "",
        tiktok_account: "",
        youtub_account: "",
        instagram_account: "",
        intrest: ""

    };

    const serverURL = getServerURL();
    const isLoggedIn = Is_Login();
    const [showPass, setShowPass] = useState(true)
    const [otpShow, SetOtpShow] = useState(false)
    const [show, setShow] = useState(false);
    const [values, setValues] = useState(initialValues);
    const [submitCount, setSubmitCount] = useState(0);
    const [sucessSnackBarOpen, setSucessSnackBarOpen] = useState(false);
    const [warningSnackBarOpen, setWarningSnackBarOpen] = useState(false);
    const [stateList, setStateList] = useState([]);
    const [countryList, setCountryList] = useState([]);

    const [errors, setErrors] = useState({});
    const [Mymessage, setMyMessage] = useState("");


    const handleChange = (e) => {

        const { name, value, checked, type } = e.target;
        let newValue = type === "checkbox" ? checked : value;

        // if (name === "state_id") {
        //     const selectedState = stateList.find((state) => state.name === newValue);
        //     newValue = selectedState ? selectedState._id : "";
        // }

        if (name === "country_id") {

            setValues((prevValues) => ({
                ...prevValues,
                ["state_id"]: "",
            }));
        }

        if (submitCount > 0) {
            const validationErrors = validate({ ...values, [name]: newValue });
            setErrors(validationErrors);

            // Remove error message for the specific field if it is valid
            if (Object.keys(validationErrors).length === 0) {
                delete errors[name];
            }
        }

        setValues((prevValues) => ({
            ...prevValues,
            [name]: newValue,
        }));
    };


    // select usa as a default id
    useEffect(() => {
        const fetchData = async () => {
            try {
                const request1 = api.get(`${serverURL + "/country-list"}`);
                const request2 = api.get(`${serverURL + "/state-list"}`);
                const responses = await Promise.all([request1, request2]);

                setCountryList(responses[0].data.data.country);

                // Find United States country from list and set it
                // const USCountry = responses[0].data.data.country.find(country => country.name === 'United States');
                // if (USCountry) {
                //     setValues(prevValues => ({
                //         ...prevValues,
                //         country_id: USCountry._id
                //     }))
                // }

            } catch (error) {
                console.error(error);
            }
        };


        fetchData();
    }, [isLoggedIn]);

    const checkforcounty = async () => {
        try {
            if (values.country_id && errors.country_id == undefined) {
                const request1 = api.get(`${serverURL + "/country-list"}`);
                var id = countryList.find((e => e?._id == values.country_id))
                const request2 = api.get(`${serverURL + `/state-list?country_id=${id.id}`}`);
                const responses = await Promise.all([request1, request2]);
                setStateList(responses[1].data.data.states)
            } else {
                // setMymessageProfileProfile("Country is required");
                // setwarningSnackBarOpenProfile(!warningSnackBarOpenProfile);
            }
        } catch (error) {
            console.error(error);
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedValues = { ...values };

        const validationErrors = validate(updatedValues);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            try {

                setMainLoder(true)
                setMyMessage("Your influencer details have been successfully submitted.");
                setSucessSnackBarOpen(!sucessSnackBarOpen);
                // api.post(`${serverURL}login`, updatedValues)
                //   .then((res) => {
                //     if (res.data.success === true) {
                //       if (res.data.data.user) {
                //         setMyMessage(res.data.message);
                //         setSucessSnackBarOpen(!sucessSnackBarOpen);
                //         login(res.data.data.user);
                //         setTimeout(() => {
                //           setValues(initialValues);
                //           setMainLoder(false)
                //           if ((!localStorage.getItem("lastVisitedPath")) || localStorage.getItem("lastVisitedPath") === "https://clubmall.com/login" || localStorage.getItem("lastVisitedPath") === "http://localhost:3000/login") {
                //             window.location.href = "/"
                //           } else {
                //             window.location.href = localStorage.getItem("lastVisitedPath") || document.referrer
                //           }
                //           // navigate("");
                //         }, 1000);
                //       } else {
                //         SetOtpShow(true)
                //         SetEmail(updatedValues.email);
                //         setMyMessage(res.data.message);
                //         setSucessSnackBarOpen(!sucessSnackBarOpen);
                //       }
                //     } else if (res.data.success === false) {
                //       setMyMessage(res.data.message);
                //       setWarningSnackBarOpen(!warningSnackBarOpen);
                //     }
                //     setMainLoder(false)
                //   });
                setValues(initialValues);
                setMainLoder(false)
            } catch (error) {
                // setWarningSnackBarOpen(!warningSnackBarOpen);
                console.error(error);
            }
        }
    };

    useEffect(() => {
        checkforcounty();
    }, [values.country_id]);

    // console.log(errors,"errors");

    return (
        <>
            <h1 className='d-none'></h1>
            <SucessSnackBar
                open={sucessSnackBarOpen}
                setOpen={setSucessSnackBarOpen}
                text={Mymessage}
                type="success"
            />

            <ErrorSnackBar
                open={warningSnackBarOpen}
                setOpen={setWarningSnackBarOpen}
                text={Mymessage}
                type="error"
            />
            <div className='influencer pb-5'>
                <div className='container-cos'>
                    <div className='contact-title text-center'>
                        <h1>Influencers</h1>
                        <p>Please complete this form for collaboration with</p>
                        <p> CLUBMALL</p>
                    </div>
                    <div className='contact mt-4'>
                        <form onSubmit={handleSubmit}>
                            <Row>
                                <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>First Name</label>
                                        <input placeholder='Enter first name'
                                            name='first_name'
                                            onChange={handleChange}
                                            type='text'
                                            value={values.first_name}
                                        />
                                        <div className='error' >{errors?.first_name}</div>
                                    </div>
                                </Col>
                                <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>Last Name</label>
                                        <input placeholder='Enter last name'
                                            name='last_name'
                                            onChange={handleChange}
                                            type='text'
                                            value={values.last_name}
                                        />
                                        <div className='error' >{errors?.last_name}</div>
                                    </div>
                                </Col>
                                <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>Email Contact</label>
                                        <input placeholder='Enter email contact'
                                            name='email'
                                            onChange={handleChange}
                                            value={values.email}

                                            type='text'
                                        />
                                        <div className='error' >{errors?.email}</div>
                                    </div>
                                </Col>
                                <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>Phone Number</label>
                                        <input placeholder='Enter phone number'
                                            name='phone_number'
                                            onChange={handleChange}
                                            value={values.phone_number}
                                            type='number'
                                        />
                                        <div className='error' >{errors?.phone_number}</div>
                                    </div>
                                </Col>
                                <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>Country</label>
                                        <Select
                                            name='country_id'
                                            className='rect-select-cos'
                                            value={countryList.find(option => option.value === values.country_id)} // sets the selected value
                                            onChange={option => {
                                                handleChange({
                                                    target: {
                                                        name: 'country_id',
                                                        value: option.value,
                                                    },
                                                })
                                            }} // set selected value
                                            options={countryList.map(country => ({ value: country._id, label: country.name }))}
                                        />
                                        <div className='error'>{errors?.country_id}</div>
                                    </div>
                                </Col>
                                <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>State</label>
                                        <Select
                                            name='state_id'
                                            className='rect-select-cos'
                                            value={values.state_id ? stateList.find(option => option.value === values.state_id) : null}
                                            onChange={option => {
                                                handleChange({
                                                    target: {
                                                        name: 'state_id',
                                                        value: option ? option.value : "",
                                                    },
                                                })
                                            }} // set selected value
                                            options={
                                                values.country_id
                                                    ? stateList.map(state => ({ value: state._id, label: state.name }))
                                                    : [{ value: '', label: 'Please select a country first' }]
                                            }
                                        />
                                        <div className='error'>{errors?.state_id}</div>
                                    </div>
                                </Col>
                                <Col lg={4} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>TikTok Followers:</label>
                                        <input placeholder='TikTok'
                                            name='tiktok_followers'
                                            value={values.tiktok_followers}
                                            onChange={handleChange}
                                            type='number'
                                        />
                                        <div className='error' >{errors?.tiktok_followers}</div>
                                    </div>
                                </Col>
                                <Col lg={4} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>YouTube Followers:</label>
                                        <input placeholder='YouTube'
                                            name='youtub_followers'
                                            onChange={handleChange}
                                            value={values.youtub_followers}
                                            type='number'
                                        />
                                        <div className='error' >{errors?.youtub_followers}</div>
                                    </div>
                                </Col>
                                <Col lg={4} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>Instagram Followers:</label>
                                        <input placeholder='Instagram'
                                            name='instagram_followers'
                                            onChange={handleChange}
                                            value={values.instagram_followers}
                                            type='number'
                                        />
                                        <div className='error' >{errors?.instagram_followers}</div>
                                    </div>
                                </Col>
                                <Col lg={4} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>TikTok Account Link:</label>
                                        <input placeholder='TikTok account'
                                            name='tiktok_account'
                                            onChange={handleChange}
                                            value={values.tiktok_account}
                                            type='text'
                                        />
                                        <div className='error' >{errors?.tiktok_account}</div>
                                    </div>
                                </Col>
                                <Col lg={4} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>YouTube Account Link:</label>
                                        <input placeholder='YouTube account'
                                            name='youtub_account'
                                            onChange={handleChange}
                                            value={values.youtub_account}
                                            type='text'
                                        />
                                        <div className='error' >{errors?.youtub_account}</div>
                                    </div>
                                </Col>
                                <Col lg={4} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>Instagram Account Link:</label>
                                        <input placeholder='Instagram account'
                                            name='instagram_account'
                                            value={values.instagram_account}
                                            onChange={handleChange}
                                            type='text'
                                        />
                                        <div className='error' >{errors?.instagram_account}</div>
                                    </div>
                                </Col>
                                <Col lg={12} md={12} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>Interested In</label>
                                        <textarea
                                            name='intrest'
                                            value={values.intrest}
                                            onChange={handleChange} placeholder='Tell us about yourself and the products you are interested in' rows={6}></textarea>

                                    </div>
                                        <div className='error' >{errors?.intrest}</div>
                                </Col>
                            </Row>
                            <div className='d-flex justify-content-center w-100 mt-3'>
                                <Button onClick={() => setSubmitCount(1)} type='submit' className='submit-btn w-100 mt-0'>Send</Button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Influencer
