import React, { useState, useRef, useEffect, useContext } from 'react'
import { Button, Col, Form, NavLink, Row, Modal } from 'react-bootstrap'
import "react-phone-input-2/lib/bootstrap.css";
import PhoneInput from 'react-phone-input-2'
import { Link } from 'react-router-dom';
import api from '../../helper/api';
import { getServerURL } from '../../helper/envConfig';
import { validate } from './RegisterSchema';
import SucessSnackBar from "../SnackBar/SnackBar";
import ErrorSnackBar from "../SnackBar/SnackBar";
import { useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from '@greatsumini/react-facebook-login';
import { MdOutlineClose } from "react-icons/md"
import axios from 'axios';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import AppleLogin from 'react-apple-login';
import { BsApple } from 'react-icons/bs'
import { SOCIALLOGIN } from '../../helper/endpoints';
import { login } from '../../helper/auth';
import { ADDTOCART } from '../../helper/endpoints';
import { CartContext } from '../../context/CartContext'

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpVXFxJNgroKuqrxL-AJOsZEfbcu9yMoE",
  authDomain: "clubmall.firebaseapp.com",
  projectId: "clubmall",
  storageBucket: "clubmall.appspot.com",
  messagingSenderId: "402818709804",
  appId: "1:402818709804:web:ead869f51cd13ff2219489",
};

if (!firebase.apps.length) {
firebase.initializeApp(firebaseConfig);
}


function Register() {

    const { localCartPostData, localCart, setMainLoder } = useContext(CartContext);

    const navigate = useNavigate();

    const initialValues = {
        // first_name: "",
        // last_name: "",
        // username: "",
        email: "",
        // contact_no: "",
        // phone_code: "",
        // country_id: "",
        // state_id: "",
        password: "",
        terms_and_condition: "",
    };

    const [showPass, setShowPass] = useState(true)
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [Mymessage, setMyMessage] = useState("");
    const [stateList, setStateList] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [submitCount, setSubmitCount] = useState(0);
    const serverURL = getServerURL();
    const [sucessSnackBarOpen, setSucessSnackBarOpen] = useState(false);
    const [warningSnackBarOpen, setWarningSnackBarOpen] = useState(false);
    const [otpShow, SetOtpShow] = useState(false)
    const [otpEmail, SetEmail] = useState("")
    const inputRefs = useRef([]);


    const handleClose = () => {
        SetOtpShow(false)
    };

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        let newValue = type === "checkbox" ? checked : value;

        if (name === "state_id") {
            const selectedState = stateList.find((state) => state.name === newValue);
            newValue = selectedState ? selectedState._id : "";
        }


        if (name === "country_id") {
            const selectedState = countryList.find((state) => state.name === newValue);
            newValue = selectedState ? selectedState._id : "";
        }

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

    const getCartData = async () => {
        try {

            const [productResponse] = await Promise.all([
                api.postWithToken(`${serverURL + ADDTOCART}`, { "action": "cart-list" }),
            ]);
            const productData = productResponse.data.data;
            // setMainLoder(false)
            return productData; // Return the cartList directly.

        } catch (error) {
            console.log(error);

        };

    }


    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedValues = { ...values }; // Create a copy of the values object

        const validationErrors = validate(updatedValues);
        setErrors(validationErrors);

        if (updatedValues.phone_code) {
            updatedValues.phone_code = "+" + updatedValues.phone_code;
        }

        if (updatedValues.first_name && updatedValues.last_name) {
            updatedValues.name = updatedValues.first_name + " " + updatedValues.last_name;
        }

        if (Object.keys(validationErrors).length === 0) {
            updatedValues.user_type = "4";
            try {
                api.post(`${serverURL}signup`, updatedValues)
                    .then((res) => {
                        if (res.data.status === 1) {
                            updatedValues.login_type = "4"
                            setMainLoder(true)

                            api.post(`${serverURL}login`, updatedValues)
                                .then(async (res) => {
                                    if (res.data.success === true) {
                                        if (res.data.data.user) {
                                            login(res.data.data.user);
                                            // Checking local storage for products
                                            if (localCartPostData && localCartPostData.length > 0 && localCart.items && localCart.items.length > 0) {
                                                // Adding each product in the cart
                                                var cartList
                                                for (let item of localCartPostData) {
                                                    try {
                                                        const res = await api.postWithToken(`${serverURL}${ADDTOCART}`, item);

                                                    } catch (error) {
                                                        // catch specific '400 BAD REQUEST' error and handle it
                                                        if (error.response && error.response.status === 400) {
                                                            if (error.response.data.flag === "ALREADY_IN_CART") {
                                                                console.log("Product is already in cart, skipping...");
                                                                continue; // skips the rest of the loop for this item and moves to the next item
                                                            } else {
                                                                console.error("Unhandled 400 error", error.response.data);
                                                            }
                                                        } else {
                                                            // re-throw the error if it's not the one we are expecting
                                                            throw error;
                                                        }
                                                    }
                                                }
                                                // Sleep for 2 seconds to wait for the cart data to update
                                                await new Promise(resolve => setTimeout(resolve, 2000));

                                                cartList = await getCartData(); // Fetch and store the data
                                                var data = { "action": "update-to-cart-qty" };
                                                for (let item of localCart.items) {
                                                    if (!item.product_id || !item.qty) {
                                                        console.error("Invalid item data: ", item);
                                                        continue;
                                                    }

                                                    // Find the matching cart item from cartList
                                                    const cartItem = cartList.list?.find(cart => cart.product_id === item.product_id);

                                                    if (!cartItem || !cartItem._id) {
                                                        console.error("Could not find matching cart item for product: ", item.product_id);
                                                        continue;
                                                    }

                                                    data.qty = item.qty;
                                                    data._id = cartItem._id; // Use cart_id instead of product_id

                                                    try {
                                                        const res = await api.postWithToken(`${serverURL}${ADDTOCART}`, data);
                                                    } catch (error) {
                                                        // Handle '400 BAD REQUEST' error
                                                        if (error.response && error.response.status === 400) {
                                                            if (error.response.data.flag === "ALREADY_IN_CART") {
                                                                console.log("Product is already in cart, skipping...");
                                                                continue;
                                                            } else {
                                                                console.error("Unhandled 400 error", error.response.data);
                                                            }
                                                        } else {
                                                            throw error;
                                                        }
                                                    }
                                                }

                                                // window.location.href = "/cart";
                                                localStorage.removeItem('cartPostData');
                                                localStorage.removeItem('productDetails');
                                            }
                                            setTimeout(() => {
                                                setValues(initialValues);
                                                setMainLoder(false)
                                                if ((!localStorage.getItem("lastVisitedPath")) || localStorage.getItem("lastVisitedPath") === "https://clubmall.com/login" || localStorage.getItem("lastVisitedPath") === "http://localhost:3000/login") {
                                                    window.location.href = "/"
                                                } else {
                                                    window.location.href = localStorage.getItem("lastVisitedPath") || document.referrer
                                                }
                                                // navigate("");
                                            }, 1000);

                                            setMyMessage(res.data.message);
                                            setSucessSnackBarOpen(!sucessSnackBarOpen);

                                        } else {
                                            SetOtpShow(true)
                                            SetEmail(updatedValues.email);
                                            setMyMessage(res.data.message);
                                            setSucessSnackBarOpen(!sucessSnackBarOpen);
                                        }
                                    } else if (res.data.success === false) {
                                        setMyMessage(res.data.message);
                                        setWarningSnackBarOpen(!warningSnackBarOpen);
                                    }
                                    setMainLoder(false)

                                });

                            // setMyMessage(res.data.message);
                            // setSucessSnackBarOpen(!sucessSnackBarOpen);
                            // setValues(initialValues);
                            // SetOtpShow(true)
                            // navigate("/login");
                            // SetEmail(updatedValues.email)
                            // console.log(updatedValues.email,"updatedValues");
                        } else {
                            if (res.data.message === "Duplicate field value entered") {
                                setMyMessage("Your email and username is already registered.Please login.");
                            } else {
                                setMyMessage(res.data.message);
                            }
                            setWarningSnackBarOpen(!warningSnackBarOpen);
                        }
                    });
            } catch (error) {
                setWarningSnackBarOpen(!warningSnackBarOpen);
                console.error(error);
            }
        }
    };

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const request1 = api.get(`${serverURL + "/country-list"}`);
    //             const request2 = api.get(`${serverURL + "/state-list"}`);
    //             const responses = await Promise.all([request1, request2]);
    //             setCountryList(responses[0].data.data.country);
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     };

    //     fetchData();
    // }, []);

    // select usa as a default id
    useEffect(() => {
        const fetchData = async () => {
            try {
                const request1 = api.get(`${serverURL + "/country-list"}`);
                const request2 = api.get(`${serverURL + "/state-list"}`);
                const responses = await Promise.all([request1, request2]);

                setCountryList(responses[0].data.data.country);

                // Find United States country from list and set it
                const USCountry = responses[0].data.data.country.find(country => country.name === 'United States');
                if (USCountry) {
                    setValues(prevValues => ({
                        ...prevValues,
                        country_id: USCountry._id
                    }))
                }

            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);


    const checkforcounty = async () => {

        try {
            if (values.country_id && errors.country_id == undefined) {
                const request1 = api.get(`${serverURL + "/country-list"}`);
                var id = countryList.find((e => e._id == values.country_id))
                const request2 = api.get(`${serverURL + `/state-list?country_id=${id.id}`}`);
                const responses = await Promise.all([request1, request2]);
                setStateList(responses[1].data.data.states)
            } else {
                setMyMessage("Country is required");
                setWarningSnackBarOpen(!warningSnackBarOpen);
            }
        } catch (error) {
            console.error(error);
        }

    };

    const handleChangeotp = (index, event) => {
        const { value } = event.target;
        let newValue = value;

        // Restrict input to a single digit
        if (value.length > 1) {
            newValue = value.slice(0, 1);
        }

        // Validate input as a number
        if (!isNaN(newValue)) {
            setValues((prevValues) => ({
                ...prevValues,
                [`otp${index}`]: newValue,
            }));

            // Auto focus on the next input field
            if (newValue !== '') {
                const nextIndex = index + 1;
                if (nextIndex < 7) {
                    inputRefs.current[nextIndex].focus();
                }
            }
        }
    };

    const handleKeyDown = (index, event) => {
        if (event.key === 'Backspace' && values[`otp${index}`] === '') {
            if (index > 1) {
                const prevIndex = index - 1;
                inputRefs.current[prevIndex].focus();
            }
        }
    };

    const SubmitOTP = (e) => {

        e.preventDefault();

        var myotp = values.otp1 + values.otp2 + values.otp3 + values.otp4 + values.otp5 + values.otp6

        if (myotp.length === 6) {
            try {
                api.post(`${serverURL}verify-email`, {
                    email: otpEmail,
                    verification_code: myotp
                })
                    .then((res) => {
                        if (res.data.success == true) {
                            setValues(initialValues);
                            setMyMessage(res.data.message);
                            setSucessSnackBarOpen(!sucessSnackBarOpen);
                            SetOtpShow(true)
                            setTimeout(() => {
                                navigate("/login");
                            }, 1000);

                        } else {
                            setMyMessage(res.data.message);
                            setWarningSnackBarOpen(!warningSnackBarOpen);
                        }
                    });
            } catch (error) {
                setWarningSnackBarOpen(!warningSnackBarOpen);
                console.error(error);
            }
        } else {
            setMyMessage("Enter a valid otp");
            setWarningSnackBarOpen(!warningSnackBarOpen);
        }
    };

    const googlelogin = useGoogleLogin({

        onSuccess: async (respose) => {
            try {
                const res = await axios.get(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    {
                        headers: {
                            Authorization: `Bearer ${respose.access_token}`,
                        },
                    }
                );
                var updatedValues = res.data.email
                api.post(`${serverURL + SOCIALLOGIN}`, {
                    email: res.data.email,
                    social_login_type: 2,
                    social_login_id: res.data.sub,
                    login_type: 4,
                    name: res.data.name,
                    username: res.data.given_name
                })
                .then(async (res) => {
                    if (res.data.success === true) {
                      if (res.data.data.user) {
                        login(res.data.data.user);
                        setMainLoder(true)
                        // Checking local storage for products
                        if (localCartPostData && localCartPostData.length > 0 && localCart.items && localCart.items.length > 0) {
                          // Adding each product in the cart
                          var cartList
                          for (let item of localCartPostData) {
                            try {
                              const res = await api.postWithToken(`${serverURL}${ADDTOCART}`, item);
        
                            } catch (error) {
                              // catch specific '400 BAD REQUEST' error and handle it
                              if (error.response && error.response.status === 400) {
                                if (error.response.data.flag === "ALREADY_IN_CART") {
                                  console.log("Product is already in cart, skipping...");
                                  continue; // skips the rest of the loop for this item and moves to the next item
                                } else {
                                  console.error("Unhandled 400 error", error.response.data);
                                }
                              } else {
                                // re-throw the error if it's not the one we are expecting
                                throw error;
                              }
                            }
                          }
                          // Sleep for 2 seconds to wait for the cart data to update
                          await new Promise(resolve => setTimeout(resolve, 2000));
        
                          cartList = await getCartData(); // Fetch and store the data
                          var data = { "action": "update-to-cart-qty" };
                          for (let item of localCart.items) {
                            if (!item.product_id || !item.qty) {
                              console.error("Invalid item data: ", item);
                              continue;
                            }
        
                            // Find the matching cart item from cartList
                            const cartItem = cartList.list?.find(cart => cart.product_id === item.product_id);
        
                            if (!cartItem || !cartItem._id) {
                              console.error("Could not find matching cart item for product: ", item.product_id);
                              continue;
                            }
        
                            data.qty = item.qty;
                            data._id = cartItem._id; // Use cart_id instead of product_id
        
                            try {
                              const res = await api.postWithToken(`${serverURL}${ADDTOCART}`, data);
                            } catch (error) {
                              // Handle '400 BAD REQUEST' error
                              if (error.response && error.response.status === 400) {
                                if (error.response.data.flag === "ALREADY_IN_CART") {
                                  console.log("Product is already in cart, skipping...");
                                  continue;
                                } else {
                                  console.error("Unhandled 400 error", error.response.data);
                                }
                              } else {
                                throw error;
                              }
                            }
                          }
        
                          // window.location.href = "/cart";
                          localStorage.removeItem('cartPostData');
                          localStorage.removeItem('productDetails');
                        }
                        setTimeout(() => {
                          setValues(initialValues);
                          setMainLoder(false)
                          if ((!localStorage.getItem("lastVisitedPath")) || localStorage.getItem("lastVisitedPath") === "https://clubmall.com/login" || localStorage.getItem("lastVisitedPath") === "http://localhost:3000/login") {
                            window.location.href = "/"
                          } else {
                            window.location.href = localStorage.getItem("lastVisitedPath") || document.referrer
                          }
                          // navigate("");
                        }, 1000);
        
                        setMyMessage(res.data.message);
                        setSucessSnackBarOpen(!sucessSnackBarOpen);
        
                      } else {
                        SetOtpShow(true)
                        SetEmail(updatedValues);
                        setMyMessage(res.data.message);
                        setSucessSnackBarOpen(!sucessSnackBarOpen);
                      }
                    } else if (res.data.success === false) {
                      setMyMessage(res.data.message);
                      setWarningSnackBarOpen(!warningSnackBarOpen);
                    }
                    setMainLoder(false)
        
                  });
            } catch (err) {
                console.log(err);
            }
        },
    });

    const handleAppleSignIn = async () => {

        try{
          const provider = new firebase.auth.OAuthProvider('apple.com');
          provider.addScope('email');
          provider.addScope('name');

         
          let result = await firebase.auth().getRedirectResult();
          
          // Apple credential info
          if (result) {
            
            const credential = result.credential;
            const sub = credential.accessToken;
            const userEmail = result?.user?.email || "";
            const userName = result?.user?.displayName || "";
    
            var updatedValues = userEmail
            api.post(`${serverURL + SOCIALLOGIN}`, {
              email: userEmail,
              social_login_type: 3,
              social_login_id: sub,
              login_type: 4,
              name: "",
              username: userName
            })
              .then(async (res) => {
                if (res.data.success === true) {
                  if (res.data.data.user) {
                    login(res.data.data.user);
                    setMainLoder(true)
                    // Checking local storage for products
                    if (localCartPostData && localCartPostData.length > 0 && localCart.items && localCart.items.length > 0) {
                      // Adding each product in the cart
                      var cartList
                      for (let item of localCartPostData) {
                        try {
                          const res = await api.postWithToken(`${serverURL}${ADDTOCART}`, item);
    
                        } catch (error) {
                          // catch specific '400 BAD REQUEST' error and handle it
                          if (error.response && error.response.status === 400) {
                            if (error.response.data.flag === "ALREADY_IN_CART") {
                              console.log("Product is already in cart, skipping...");
                              continue; // skips the rest of the loop for this item and moves to the next item
                            } else {
                              console.error("Unhandled 400 error", error.response.data);
                            }
                          } else {
                            // re-throw the error if it's not the one we are expecting
                            throw error;
                          }
                        }
                      }
                      // Sleep for 2 seconds to wait for the cart data to update
                      await new Promise(resolve => setTimeout(resolve, 2000));
    
                      cartList = await getCartData(); // Fetch and store the data
                      var data = { "action": "update-to-cart-qty" };
                      for (let item of localCart.items) {
                        if (!item.product_id || !item.qty) {
                          console.error("Invalid item data: ", item);
                          continue;
                        }
    
                        // Find the matching cart item from cartList
                        const cartItem = cartList.list?.find(cart => cart.product_id === item.product_id);
    
                        if (!cartItem || !cartItem._id) {
                          console.error("Could not find matching cart item for product: ", item.product_id);
                          continue;
                        }
    
                        data.qty = item.qty;
                        data._id = cartItem._id; // Use cart_id instead of product_id
    
                        try {
                          const res = await api.postWithToken(`${serverURL}${ADDTOCART}`, data);
                        } catch (error) {
                          // Handle '400 BAD REQUEST' error
                          if (error.response && error.response.status === 400) {
                            if (error.response.data.flag === "ALREADY_IN_CART") {
                              console.log("Product is already in cart, skipping...");
                              continue;
                            } else {
                              console.error("Unhandled 400 error", error.response.data);
                            }
                          } else {
                            throw error;
                          }
                        }
                      }
    
                      // window.location.href = "/cart";
                      localStorage.removeItem('cartPostData');
                      localStorage.removeItem('productDetails');
                    }
                    setTimeout(() => {
                      setValues(initialValues);
                      setMainLoder(false)
                      if ((!localStorage.getItem("lastVisitedPath")) || localStorage.getItem("lastVisitedPath") === "https://clubmall.com/login" || localStorage.getItem("lastVisitedPath") === "http://localhost:3000/login") {
                        window.location.href = "/"
                      } else {
                        window.location.href = localStorage.getItem("lastVisitedPath") || document.referrer
                      }
                      // navigate("");
                    }, 1000);
    
                    setMyMessage(res.data.message);
                    setSucessSnackBarOpen(!sucessSnackBarOpen);
    
                  } else {
                    SetOtpShow(true)
                    SetEmail(updatedValues);
                    setMyMessage(res.data.message);
                    setSucessSnackBarOpen(!sucessSnackBarOpen);
                  }
                } else if (res.data.success === false) {
                  setMyMessage(res.data.message);
                  setWarningSnackBarOpen(!warningSnackBarOpen);
                }
                setMainLoder(false)
              });
          }
          else{
            setWarningSnackBarOpen(!sucessSnackBarOpen);
            setMyMessage("Something went wrong");
          }
    
        }catch (err) {
          console.log(err);
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

            <div className='register-main spacing-cos'>
                <div className='register-box text-center'>
                    <h3>Register</h3>
                    <Form onSubmit={handleSubmit}
                        className='mt-4'>
                        <Row>
                            {/* <Col lg={6} md={6} sm={12} className='mb-3'>
                                <div className='login-input text-start'>
                                    <label>First Name</label>
                                    <input placeholder='Enter your first name'
                                        type='text'
                                        name="first_name"
                                        onChange={handleChange}
                                        value={values.first_name}
                                    />
                                    <div className='error' >{errors?.first_name}</div>
                                </div>
                            </Col>
                            <Col lg={6} md={6} sm={12} className='mb-3'>
                                <div className='login-input text-start'>
                                    <label>Last Name</label>
                                    <input placeholder='Enter last name'
                                        type='text'
                                        name="last_name"
                                        onChange={handleChange}
                                        value={values.last_name}
                                    />
                                    <div className='error' >{errors?.last_name}</div>

                                </div>
                            </Col>
                            <Col lg={6} md={6} sm={12} className='mb-3'>
                                <div className='login-input text-start'>
                                    <label>User Name</label>
                                    <input placeholder='Enter user name' type='text'
                                        name="username"
                                        onChange={handleChange}
                                        value={values.username}
                                    />
                                    <div className='error' >{errors?.username}</div>
                                </div>
                            </Col>
                            <Col lg={6} md={6} sm={12} className='mb-3'>
                                <div className='login-input text-start'>
                                    <label>Contact number</label>
                                    <PhoneInput
                                        country={"eg"}
                                        enableSearch={true}
                                        name="contact_no"
                                        value={values?.phone_code + values?.contact_no}
                                        onChange={(value, data) => {
                                            const { dialCode } = data;
                                            const contactNumber = value.substring(dialCode.length);
                                            handleChange({ target: { name: "contact_no", value: contactNumber } });
                                            handleChange({ target: { name: "phone_code", value: dialCode } });
                                        }}
                                    // onChange={(value) => handleChange({ target: { name: "contact_no", value } })}
                                    />
                                    <div className='error' >{errors?.contact_no}</div>

                                </div>
                            </Col>
                            <Col lg={6} md={6} sm={12} className='mb-3'>
                                <div className='login-input text-start'>
                                    <label>Country/Region</label>
                                    <select name='country_id'
                                        value={values.country}
                                        onChange={handleChange}
                                        className='select-arrow'>
                                        <option value="United States">United States</option>
                                        {(countryList.length <= 0) && <option
                                        >loding....</option>}
                                        {
                                            countryList.map((e, i) =>
                                            (
                                                <option key={i} value={e.name}
                                                >{e.name}</option>

                                            ))
                                        }
                                    </select>
                                    <div className='error' >{errors?.country_id}</div>
                                </div>
                            </Col>
                            <Col lg={6} md={6} sm={12} className='mb-3'>
                                <div className='login-input text-start'>
                                    <label>State</label>
                                    <select
                                        onClick={checkforcounty} onChange={handleChange}
                                        value={!values.state_id ? "" : values.state}
                                        name='state_id' className='select-arrow'>
                                        <option>Select State</option>
                                        {errors.country_id == undefined && (
                                            <>

                                                {
                                                    stateList.map((e, i) =>
                                                    (
                                                        <option key={i}   >{e.name}</option>
                                                    ))
                                                }
                                                )
                                            </>
                                        )}


                                    </select>
                                    <div className='error' >{errors?.state_id}</div>
                                </div>
                            </Col> */}
                            <Col lg={12} md={12} sm={12} className='mb-3'>
                                <div className='login-input text-start'>
                                    <label>Email Address</label>
                                    <input placeholder='Enter your email'
                                        name="email"
                                        onChange={handleChange}
                                        value={values.email}
                                        type='text' />
                                    <div className='error' >{errors?.email}</div>
                                </div>
                            </Col>
                            <Col lg={12} md={12} sm={12}>
                                <div className='login-input text-start '>
                                    <label>Password</label>
                                    <div className='position-relative'>
                                        <input placeholder='Enter your Password' onChange={handleChange} name='password' value={values.password} type={showPass ? "password" : "text"} />
                                        <Button className='show-hide-pass' onClick={() => setShowPass(!showPass)}>
                                            {showPass ? <AiFillEyeInvisible /> : <AiFillEye />}
                                        </Button>
                                    </div>
                                    <div className='error' >{errors?.password}</div>
                                </div>
                            </Col>
                        </Row>
                        <div className='d-flex align-items-start check-terms gap-2 mt-3'>
                            <Form.Check
                                onChange={handleChange}
                                type="checkbox"
                                id="check_terms"
                                name="terms_and_condition"
                                checked={values.terms_and_condition}
                            />

                            <label htmlFor='check_terms' className='pointer'>I accept to the <Link to="/privacy-policy">Privacy Policy</Link> & <Link to="/terms-use">Terms & Condition</Link></label>

                        </div>
                        <div className='error d-flex align-items-start check-terms gap-2' >{errors?.terms_and_condition}</div>
                        <Button
                            type="submit"
                            onClick={() => setSubmitCount(1)}
                            className='w-100 submit-btn'>Register </Button>
                    </Form>

                    <div className='footer-sec mt-4'>
                        <span className='register-link d-flex align-items-center gap-2 justify-content-center mt-3'>Already a user? <Link to='/login'> Login</Link></span>
                        <div className='or-sec d-flex align-items-center gap-2 my-2'>
                            <div className='line'></div>
                            <span>Or</span>
                            <div className='line'></div>
                        </div>
                        <div className='d-flex align-items-center justify-content-center gap-4 mt-2'>

                            <div className='google-login'>

                            </div>
                            <NavLink>
                                <img onClick={googlelogin} src='./img/login/google.svg' alt='' />
                            </NavLink>
                            {/* <FacebookLogin
                                appId={process.env.REACT_APP_APP_ID}
                                style={{
                                    backgroundColor: '#fff',
                                    padding: "0px",
                                    border: "none",
                                }}
                                onSuccess={(response) => {
                                    console.log('Login Success!', response);
                                }}
                                onFail={(error) => {
                                    console.log('Login Failed!', error);
                                }}
                                onProfileSuccess={(response) => {
                                    console.log('Get Profile Success!', response);
                                }}
                            ><img src='./img/login/facebook.svg' alt='' /></FacebookLogin> */}

                            <button
                                onClick={handleAppleSignIn}
                                style={{
                                    backgroundColor: "white",
                                    border: "none",
                                    fontSize: "35px",
                                    padding: "0px",
                                    display: "flex",
                                }}
                                >
                                <BsApple />
                            </button>
                            
                        </div>
                    </div>
                </div>

            </div>

            <Modal
                show={otpShow} onHide={handleClose}
                centered className='forgot-pass'>
                <Modal.Body>
                    <div className='pass-body position-relative p-3'>
                        <Button className='close-modal-btn forgot-pass-close'
                            onClick={handleClose}
                        >
                            <MdOutlineClose />
                        </Button>
                        <div className='pass-model-title text-center'>
                            <h3>Verify Email </h3>
                            <p>Enter verification code to verify your email</p>
                        </div>

                        <Form onSubmit={handleSubmit}>
                            <div className='otp d-flex align-items-center justify-content-center mt-4 mb-1 gap-3 w-100'>
                                {[1, 2, 3, 4, 5, 6].map((index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        value={values[`otp${index}`]}
                                        type="number"
                                        name={`otp${index}`}
                                        onChange={(event) => handleChangeotp(index, event)}
                                        onKeyDown={(event) => handleKeyDown(index, event)}
                                        maxLength={1}
                                        min={0}
                                        max={9}
                                        autoComplete="off"

                                    />
                                ))}
                            </div>
                            <Button type='button' className='w-100 mt-4 submit-btn' onClick={SubmitOTP}>Submit</Button>
                        </Form>


                    </div>
                </Modal.Body>
            </Modal>

        </>
    )
}

export default Register
