import React, { useState, useRef, useEffect, useContext } from 'react'
import { Col, Row, Button } from 'react-bootstrap'
import { CartContext } from '../context/CartContext'
import SucessSnackBar from "./SnackBar/SnackBar";
import ErrorSnackBar from "./SnackBar/SnackBar";
import { validate } from './contectSchima';

const ContactUs = () => {
    const { setMainLoder, itemShow, setItemShow, getCartData, searchKeyWord, setSearchKeyWord, getSearchedProduct, handelSearch, profileOption, setProfileOption, wishlistCount, cart, setCart } = useContext(CartContext);

    const initialValues = {
        email: "",
        first_name: "",
        phone_number: "",
        information: "",
    };

    const [showPass, setShowPass] = useState(true)
    const [otpShow, SetOtpShow] = useState(false)
    const [show, setShow] = useState(false);
    const [values, setValues] = useState(initialValues);
    const [submitCount, setSubmitCount] = useState(0);
    const [sucessSnackBarOpen, setSucessSnackBarOpen] = useState(false);
    const [warningSnackBarOpen, setWarningSnackBarOpen] = useState(false);

    const [errors, setErrors] = useState({});
    const [Mymessage, setMyMessage] = useState("");


    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        let newValue = type === "checkbox" ? checked : value;

        if (submitCount > 0) {
            const validationErrors = validate({ ...values, [name]: newValue });
            setErrors(validationErrors);

            if (Object.keys(validationErrors).length === 0) {
                delete errors[name];
            }
        }

        setValues((prevValues) => ({
            ...prevValues,
            [name]: newValue,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedValues = { ...values };

        const validationErrors = validate(updatedValues);
        setErrors(validationErrors);
        console.log(Object.keys(validationErrors),"validate");

        if (Object.keys(validationErrors).length === 0) {
            try {
        
                setMainLoder(true)
                setMyMessage("Your contact details have been successfully submitted.");
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
                        <h1>Contact Us</h1>
                    </div>
                    <div className='contact mt-4'>
                        <form onSubmit={handleSubmit}>
                            <Row>
                                <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>First Name</label>
                                        <input
                                            name="first_name"
                                            onChange={handleChange}
                                            value={values.first_name}

                                            placeholder='Enter first name'
                                            type='text'
                                        />
                                        <div className='error' >{errors?.first_name}</div>
                                    </div>
                                </Col>
                                <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>Email Contact</label>
                                        <input
                                            name="email"
                                            onChange={handleChange}
                                            value={values.email}
                                            placeholder='Enter email contact'
                                            type='text'
                                        />
                                        <div className='error' >{errors?.email}</div>

                                    </div>
                                </Col>
                                <Col lg={12} md={12} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>Phone Number</label>
                                        <input

                                            name="phone_number"
                                            onChange={handleChange}
                                            value={values.phone_number}
                                            placeholder='Enter phone number'
                                            type='number'
                                        />
                                        <div className='error' >{errors?.phone_number}</div>

                                    </div>
                                </Col>

                                <Col lg={12} md={12} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>Interested In</label>
                                        <textarea

                                            name="information"
                                            onChange={handleChange}
                                            value={values.information}
                                            placeholder='Tell us about yourself and the products you are interested in' rows={6}></textarea>
                                        <div className='error' >{errors?.information}</div>
                                    </div>
                                </Col>
                            </Row>
                            <div className='d-flex justify-content-center w-100 mt-3'>
                                <Button type="submit"
                                    onClick={() => setSubmitCount(1)} className='submit-btn w-100 mt-0'>Send</Button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </>
    )
}

export default ContactUs
