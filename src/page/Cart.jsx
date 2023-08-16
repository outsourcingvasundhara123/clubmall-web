import React, { useRef, useState, useEffect, useContext } from 'react'
import { Button, Col, Form, Modal, NavLink, Row } from 'react-bootstrap'
import { MdOutlineClose, MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { FiChevronLeft } from 'react-icons/fi'
import Loader from '../components/Loader'
import { CartContext } from '../context/CartContext';
import { Is_Login } from '../helper/IsLogin'
import api from '../helper/api';
import { getServerURL } from '../helper/envConfig'
import { validate } from './AddressSchima';
import { ADDTOCART } from "../helper/endpoints";
import { errorResponse } from '../helper/constants'
import SucessSnackBar from "../components/SnackBar";
import ErrorSnackBar from "../components/SnackBar";
import { useNavigate } from 'react-router-dom'
import { CardElement, Elements, ElementsConsumer } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { handelProductDetail } from '../helper/constants';
import { MdRemove, MdAdd } from 'react-icons/md'
import { MdDelete } from 'react-icons/md'
import { AiFillCloseCircle } from 'react-icons/ai'
import placeOrder from './gtagFunctions'
import Select from 'react-select';

// Your public Stripe key
const stripePromise = loadStripe(process.env.REACT_APP_PUBLISHABLE_KEY_LOCAL);


const WrappedCart = () => {

    // const [show, setShow] = useState(false);

    // const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);

    const [step, setStep] = useState(1);

    const { getcartcount, setMainLoder, couponId,  getCartData, cartList, Mymessage, setSucessSnackBarOpen, sucessSnackBarOpen, warningSnackBarOpen, setWarningSnackBarOpen,  setProfileOption } = useContext(CartContext);

    const initialValues = {
        country_id: "",
        state_id: "",
        fullname: "",
        contact_no: "",
        address: "",
        city: "",
        zipcode: "",
    };


    const stripe = useStripe();
    const elements = useElements();

    
    const isLoggedIn = Is_Login();

    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [MymessageProfile, setMymessageProfileProfile] = useState("");
    const [sucessSnackBarOpenProfile, setsucessSnackBarOpenProfile] = useState(false);
    const [warningSnackBarOpenProfile, setwarningSnackBarOpenProfile] = useState(false);
    const [stateList, setStateList] = useState([]);
    const [countryList, setCountryList] = useState([]);
   
    const [submitCount, setSubmitCount] = useState(0);
    const serverURL = getServerURL();
    const [modelMood, setIModelMood] = useState("add");
    const [adId, setAdId] = useState("");
    const player = useRef();

    const [isOpen, setIsOpen] = useState(false);

    const [show, setShow] = useState(false);
    const [sucessSnackBarOpenCart, setSucessSnackBarOpenCart] = useState(false);
    const [warningSnackBarOpenCart, setWarningSnackBarOpenCart] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [MymessageCart, setMyMessageCart] = useState("");
    const [loading, setLoading] = useState(true);
    const [is_Wait, setIs_Wait] = useState(false);
    const [myAddress, setMyAddess] = useState([]);
    const [correntAddess, setCorrentAddess] = useState({});

    // for steps manage 

    const nextStep = () => {
        if (step < 3 && correntAddess) {
            if (cartList.list?.length <= 0) {
                setMyMessageCart("You don't have any product in a cart")
                setWarningSnackBarOpenCart(!warningSnackBarOpenCart);
            } else {
                setStep(step + 1);
            }
        } else {
            setMyMessageCart("select or add a new address !");
            setWarningSnackBarOpenCart(!warningSnackBarOpenCart);
        }
    }

    const prevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    }

    const navigate = useNavigate();

    const handleClose = () => {
        setErrors({})
        setShow(false);
        setValues(initialValues)
        setSubmitCount(0)
        setAdId("")
    }

    const startAnimation = () => {
        if (player.current) {
            player.current.play(); // Check if player.current is not null before accessing play()
        }
    };
    const stopAnimation = () => {
        setLoading(false);
    };

    // for address
    const getMyAddress = async () => {
        startAnimation()
        try {
            const res = await api.postWithToken(`${serverURL + "shipping-address-manage"}`, { "action": "shipping-address-list" })
            setMyAddess(res.data.data.userData)
            let data = res.data.data?.userData.filter((e) => e.is_default == 1)
            if (data.length !== 0) {
                const res2 = await api.postWithToken(`${serverURL + "shipping-method-manage"}`, {
                    "action": "list",
                    "country_id": data[0].country_id._id
                })
                setCorrentAddess({ data: data, shipping_method_id: res2.data.data?.list[0]?._id })
            } else {
                setCorrentAddess("")
            }

            stopAnimation()
        } catch (error) {
            // errorResponse(error, setMyMessage);
            // setWarningSnackBarOpen(!warningSnackBarOpen);
        }
    };

    const handleShow = (mood) => {
        setIModelMood(mood)
        setShow(true);
    }

    const findAddress = (id) => {
        setAdId(id)
        let data = myAddress.find((e) => e?._id === id)

        setValues({
            country_id: data.country_id?._id,
            state_id: data.state_id?._id,
            fullname: data.fullname,
            contact_no: data.contact_no,
            address: data.address,
            city: data.city,
            zipcode: data.zipcode,
        })

        // console.log(values,"values");
        // console.log(myAddress.find((e) => e._id === id),"myAddress");
        // setIModelMood(mood)
        // setShow(true);
    }

    const handleSubmit = (mood) => {
        // e.preventDefault();

        setSubmitCount(submitCount + 1)

        const updatedValues = { ...values }; // Create a copy of the values object

        const validationErrors = validate(updatedValues);
        setErrors(validationErrors);

        // if (updatedValues.contact_no) {
        //     updatedValues.contact_no = "+" + updatedValues.contact_no;
        // }

        if (updatedValues.first_name && updatedValues.last_name) {
            updatedValues.name = updatedValues.first_name + " " + updatedValues.last_name;
        }

        if (Object.keys(validationErrors).length === 0) {


            try {

                let type = mood == "add" ? "shipping-address-create" : "shipping-address-manage"
                if (mood == "edit") {
                    updatedValues.action = "shipping-address-update"
                    updatedValues.shipping_address_id = adId
                }
                setMainLoder(true)
                api.postWithToken(`${serverURL}${type}`, updatedValues)
                    .then((res) => {

                        let check = mood == "edit" ? res.data.success === true : res.data.status === 1

                        if (check) {
                            setMymessageProfileProfile(res.data.message);
                            setsucessSnackBarOpenProfile(!sucessSnackBarOpenProfile);
                            getMyAddress()
                            setTimeout(() => {
                                setValues(initialValues);
                                handleClose()
                                setMainLoder(false)
                            }, 1000);
                            // navigate("/login");
                            // console.log(updatedValues.email,"updatedValues");
                        } else {
                            setMainLoder(false)
                            setMymessageProfileProfile(res.data.message);
                            setwarningSnackBarOpenProfile(!warningSnackBarOpenProfile);
                        }
                    });
            } catch (error) {
                setMainLoder(false)
                setwarningSnackBarOpenProfile(!warningSnackBarOpenProfile);
                console.error(error);
            }
        }
    };


    const deleteAddress = (id) => {
        setMainLoder(true)
        try {

            let data = {
                action: "shipping-address-delete",
                shipping_address_id: id
            }
            api.postWithToken(`${serverURL}shipping-address-manage`, data)
                .then((res) => {
                    if (res.data.success === true) {
                        setMymessageProfileProfile(res.data.message);
                        setsucessSnackBarOpenProfile(!sucessSnackBarOpenProfile);
                        getMyAddress()
                        setTimeout(() => {
                            setValues(initialValues);
                            handleClose()
                            setMainLoder(false)
                        }, 1000);
                        // navigate("/login");
                        // console.log(updatedValues.email,"updatedValues");
                    } else {
                        setMainLoder(false)
                        setMymessageProfileProfile(res.data.message);
                        setwarningSnackBarOpenProfile(!warningSnackBarOpenProfile);
                    }
                });
        } catch (error) {
            setMainLoder(false)
            setwarningSnackBarOpenProfile(!warningSnackBarOpenProfile);
            console.error(error);
        }

    };

    const selectAddress = (id) => {
        setMainLoder(true)
        try {
            let data = {
                action: "shipping-address-default-active",
                shipping_address_id: id
            }
            api.postWithToken(`${serverURL}shipping-address-manage`, data)
                .then((res) => {
                    if (res.data.success === true) {
                        setMymessageProfileProfile(res.data.message);
                        setsucessSnackBarOpenProfile(!sucessSnackBarOpenProfile);
                        getMyAddress()
                        setTimeout(() => {
                            setValues(initialValues);
                            handleClose()
                            setMainLoder(false)
                        }, 1000);
                        // navigate("/login");
                        // console.log(updatedValues.email,"updatedValues");
                    } else {
                        setMainLoder(false)
                        setMymessageProfileProfile(res.data.message);
                        setwarningSnackBarOpenProfile(!warningSnackBarOpenProfile);
                    }
                });
        } catch (error) {
            setMainLoder(false)
            setwarningSnackBarOpenProfile(!warningSnackBarOpenProfile);
            console.error(error);
        }

    };

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const request1 = api.get(`${serverURL + "/country-list"}`);
    //             const request2 = api.get(`${serverURL + "/state-list"}`);
    //             const responses = await Promise.all([request1, request2]);
    //             setCountryList(responses[0].data.data.country);
    //             // setStateList(responses[1].data.data.states);
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     };

    //     getCartData();
    //     fetchData();
    //     getMyAddress()
    // }, [isLoggedIn]);

    // const handleChange = (e) => {

    //     const { name, value, checked, type } = e.target;
    //     let newValue = type === "checkbox" ? checked : value;

    //     // if (name === "state_id") {
    //     //     const selectedState = stateList.find((state) => state.name === newValue);
    //     //     newValue = selectedState ? selectedState._id : "";
    //     // }

    //     if (name === "country_id") {
    //         setValues((prevValues) => ({
    //             ...prevValues,
    //             ["state_id"]: "",
    //         }));
    //     }

    //     if (submitCount > 0) {
    //         const validationErrors = validate({ ...values, [name]: newValue });
    //         setErrors(validationErrors);

    //         // Remove error message for the specific field if it is valid
    //         if (Object.keys(validationErrors).length === 0) {
    //             delete errors[name];
    //         }
    //     }

    //     setValues((prevValues) => ({
    //         ...prevValues,
    //         [name]: newValue,
    //     }));

    //     checkforcounty();

    // };


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

        getCartData();
        fetchData();
        getMyAddress()
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

    // for cart
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 2);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 14);
    

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        });
    };

    const getimagename = (list, id) => {
        let data = list.filter(detail => detail.skuid.toString() == id);
        return data[0]?.file_name
    }

    const handleCoupon = async (action, coupon) => {
        setMainLoder(true)
        try {
            var data = {
                action: action,
                cart_id: couponId,
                coupon_title: coupon ? coupon : couponCode
            }

            const res = await api.postWithToken(`${serverURL + "coupon-code-manage"}`, data)

            if (res.data.success === true) {
                getCartData()
                setMyMessageCart(res.data.message);
                setSucessSnackBarOpenCart(!sucessSnackBarOpenCart);
                setCouponCode("")
            } else if (res.data.success === false) {
                setMyMessageCart(res.data.message);
                setWarningSnackBarOpenCart(!warningSnackBarOpenCart);
            }
            setTimeout(() => {
                setMainLoder(false)
            }, 1000);
        } catch (error) {
            console.log(error, "error");
        }
    };

    // create order with payment
    const handleCheckout = async (event) => {

        try {
            setIsOpen(!isOpen);

            if (Object.keys(correntAddess)?.length === 0) {
                setMyMessageCart("Add  or select  Address")
                setWarningSnackBarOpenCart(!warningSnackBarOpenCart);
            } else {
                if (cartList.list?.length === 0) {
                    setMyMessageCart("You don't have any product in a cart")
                    setWarningSnackBarOpenCart(!warningSnackBarOpenCart);
                } else {

                    if (correntAddess?.data?.length !== 0) {
                        const amountInCents = Math.round(cartList?.cartAmountDetails?.net_amount * 100);
                        const data = {
                            order_items: cartList.list,
                            shipping_address_id: correntAddess.data[0]._id,
                            shipping_method_id: correntAddess.shipping_method_id
                        }
                        //validation for card detail
                        const cardElement = elements.getElement(CardElement);

                        if (cardElement) {
                            const cardElementState = cardElement._empty;

                            if (cardElementState) {
                                setMyMessageCart('Please enter your card details');
                                setWarningSnackBarOpenCart(!warningSnackBarOpenCart);
                                return;
                            }
                        }

                        const order = await api.postWithToken(`${serverURL + "order-create"}`, data)

                        if (order.data.success == true) {
                            setIs_Wait(true)
                            setMainLoder(true)
                            // create payment intent and get client_secret
                            const paymentIntentResponse = await api.post(`${serverURL + "create-payment-intent"}`, {
                                amount: amountInCents,
                                order_id: order.data.data?.orderObj?._id
                            });

                            const clientSecret = paymentIntentResponse.data.clientSecret;
                            if (!stripe || !elements) {
                                return;
                            }
                            const cardElement = elements.getElement(CardElement);

                            if (!cardElement) {
                                console.log("CardElement not loaded");
                                return;
                            }

                            const payment = await stripe.confirmCardPayment(clientSecret, {
                                payment_method: {
                                    card: cardElement,
                                    billing_details: {
                                    },
                                },
                            });

                            const paymentStatus = await api.post(`${serverURL + "order-payment-status"}`, { order_id: order.data.data?.orderObj?._id })
                            if (payment.error) {
                                setMyMessageCart(payment.error.message);
                                setWarningSnackBarOpenCart(!warningSnackBarOpenCart);
                            } else {
                                setMyMessageCart(paymentStatus.data.message);
                                setSucessSnackBarOpenCart(!sucessSnackBarOpenCart);

                                //run  order js 
                                placeOrder(cartList?.cartAmountDetails?.net_amount, "USD", payment.paymentIntent.id);

                                setTimeout(() => {
                                    setProfileOption("list")
                                    navigate("/thankyou")
                                }, 1000);
                                // Continue with the rest of your checkout flow here.
                            }
                            setIs_Wait(false)
                            setMainLoder(false)
                            getCartData()
                        } else {
                            setMyMessageCart(order.data.message);
                            setWarningSnackBarOpenCart(!warningSnackBarOpenCart);
                        }

                    } else {
                        setMyMessageCart("Add shipping address")
                        setWarningSnackBarOpen(!warningSnackBarOpenCart);
                    }
                }
            }
        } catch (error) {
            console.log(error);
            errorResponse(error, setMyMessageCart);
            setWarningSnackBarOpenCart(!warningSnackBarOpenCart);
        }
    };

    const removeCartData = async (id, action, qty) => {
        try {
            setMainLoder(true)
            var data = {
                action: action,
                _id: id
            }
            if (action !== "remove-to-cart-product") {
                data.qty = qty
            }
            const res = await api.postWithToken(`${serverURL + ADDTOCART}`, data)
            if (res.data.success === true) {
                getCartData()
                getcartcount()
                setMyMessageCart(res.data.message);
                setSucessSnackBarOpenCart(!sucessSnackBarOpenCart);
            } else {
                setMyMessageCart(res.data.message);
                setWarningSnackBarOpenCart(!warningSnackBarOpenCart);
            }
            setTimeout(() => {
                setMainLoder(false)
            }, 1000);


        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        checkforcounty();
    }, [values.country_id]);

    const defaultCountry = countryList.find(country => country._id === values.country_id);
    const defaultState = stateList.find(state => state._id === values.state_id);


    return (
        <>
            <div className='cart-main pb-5'>

                <SucessSnackBar
                    open={sucessSnackBarOpenCart}
                    setOpen={setSucessSnackBarOpenCart}
                    text={MymessageCart}
                    type="success"
                />

                <ErrorSnackBar
                    open={warningSnackBarOpenCart}
                    setOpen={setWarningSnackBarOpenCart}
                    text={MymessageCart}
                    type="error"
                />

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

                {
                    loading ? <Loader startAnimation={startAnimation} stopAnimation={stopAnimation} player={player} /> : (
                        <>

                            <div className='container-cos'>

                                <div className='page-path d-flex align-items-center gap-1'>
                                    <div className='d-flex align-items-center gap-1 flex-wrap'>
                                        <div className='d-flex align-items-center gap-1'>
                                            <NavLink >Cart</NavLink>
                                            <MdOutlineKeyboardArrowRight />
                                        </div>
                                        <div className='d-flex align-items-center gap-1'>
                                            <NavLink
                                                // onClick={() => setStep(1)}
                                                className={step === 1 ? 'active' : ''}>Information</NavLink>
                                            <MdOutlineKeyboardArrowRight />
                                        </div>
                                        <div className='d-flex align-items-center gap-1'>
                                            <NavLink
                                                // onClick={() => setStep(2)} 
                                                className={step === 2 ? 'active' : ''}>Shipping</NavLink>
                                            <MdOutlineKeyboardArrowRight />
                                        </div>
                                        <div className='d-flex align-items-center gap-1'>
                                            <NavLink
                                                // onClick={() => setStep(3)}
                                                className={step === 3 ? 'active' : ''}>Payment</NavLink>
                                            <MdOutlineKeyboardArrowRight />
                                        </div>
                                    </div>
                                </div>
                                <Row className='mt-4'>
                                    <Col lg={6} md={12}>

                                        {step === 1 &&

                                            <div>
                                                {/* <div>
                                        <div className='login-input text-start'>
                                            <label>Contact</label>
                                            <input placeholder='Email or mobile number'
                                                type='number'
                                            />
                                        </div>
                                        <div className='d-flex align-items-start check-terms gap-2 mt-1'>
                                            <Form.Check
                                                type="checkbox"
                                                id="check_terms"
                                                name="terms_and_condition"
                                            />
                                            <label htmlFor='check_terms' className='pointer'>Email me with news and offers</label>
                                        </div>
                                    </div> */}


                                                <div className='location-main'>

                                                    {myAddress?.length !== 0 &&
                                                        <Button onClick={() => handleShow("add")}>+ Add a new address</Button>
                                                    }

                                                    {myAddress && myAddress.map((e, i) => {
                                                        return (
                                                            <div className='address-box mt-3'>
                                                                <h5> {e.fullname}</h5>
                                                                <p className='my-2'>{e.zipcode} , {e.address} <br />{e.state_id?.name},{e.country_id?.name},{e.contact_no} </p>
                                                                <div className='d-flex align-items-center justify-content-between'>
                                                                    <div className='d-flex align-items-center check-options' onClick={() => selectAddress(e?._id)}   >
                                                                        <input type='checkbox' id='add-select' checked={e.is_default == 1} />
                                                                        <label htmlFor='add-select'>Default</label>
                                                                    </div>
                                                                    <div className='copy-main'>
                                                                        {/* <Button>Copy</Button> */}
                                                                        {/* <span>I</span> */}
                                                                        <Button onClick={() => (handleShow("edit"), findAddress(e?._id))} >Edit</Button>
                                                                        <span>I</span>
                                                                        <Button onClick={() => deleteAddress(e?._id)} >Delete</Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}

                                                </div>

                                                {myAddress?.length === 0 &&
                                                    <div className='d-flex align-items-center justify-content-center h-100 '>
                                                        <div className='text-center found'>
                                                            <img src='../img/not-found.png' alt='' className='my-20 ' />
                                                            <p className='mt-3'>No addresses available. Please add a new address.</p>
                                                            <Button className='mt-3 submit-btn' type='button' onClick={() => handleShow("add")}  >Add address</Button>
                                                        </div>
                                                    </div>
                                                }
                                                {myAddress?.length !== 0 &&
                                                    <Button className='submit-btn w-100' onClick={nextStep}>Continue to shipping</Button>
                                                }

                                            </div>
                                        }


                                        {step === 2 &&
                                            <div className='shipping'>

                                                <Button className='p-0 back-btn' onClick={prevStep}>
                                                    <FiChevronLeft />
                                                    Return to information
                                                </Button>


                                                {correntAddess.data && correntAddess.data.map((e, i) => {
                                                    return (
                                                        <>
                                                            <div className='contact-details mt-3'>
                                                                <div className='d-flex align-items-start gap-3'>
                                                                    <label>Contact:</label>
                                                                    <p>{e.contact_no}</p>
                                                                </div>
                                                                <div className='d-flex align-items-start gap-3 mt-3'>
                                                                    <label>Ship to:</label>
                                                                    <p >{e.zipcode} , {e.address} ,{e.state_id?.name},{e.country_id?.name},{e.contact_no} </p>
                                                                </div>
                                                            </div>


                                                        </>
                                                    )

                                                })}


                                                <div className='login-input text-start mt-4'>
                                                    <label>Shipping method</label>
                                                    <div className='contact-details mt-2 p-3'>
                                                        {
                                                            cartList.cartAmountDetails?.shipping_charge
                                                                ? <p>$ {cartList.cartAmountDetails?.shipping_charge} (shipping charge)</p>
                                                                :
                                                                <p>Free Shipping</p>
                                                        }

                                                    </div>
                                                </div>


                                                <Button className='submit-btn w-100' onClick={nextStep}>Continue to payment</Button>
                                            </div>

                                        }

                                        {step === 3 &&
                                            <div className='shipping'>

                                                <Button className='p-0 back-btn' onClick={prevStep}>
                                                    <FiChevronLeft />
                                                    Return to  shipping
                                                </Button>

                                                {correntAddess.data && correntAddess.data.map((e, i) => {
                                                    return (
                                                        <>
                                                            <div className='contact-details mt-3'>
                                                                <div className='d-flex align-items-start gap-3'>
                                                                    <label>Contact:</label>
                                                                    <p>{e.contact_no}</p>
                                                                </div>
                                                                <div className='d-flex align-items-start gap-3 mt-3'>
                                                                    <label>Ship to:</label>
                                                                    <p >{e.zipcode} , {e.address} ,{e.state_id?.name},{e.country_id?.name},{e.contact_no} </p>
                                                                </div>
                                                                <div className='d-flex align-items-start gap-3 mt-3'>
                                                                    <label>Method:</label>

                                                                    {
                                                                        cartList.cartAmountDetails?.shipping_charge
                                                                            ? <p>$ {cartList.cartAmountDetails?.shipping_charge} (shipping charge)</p>
                                                                            :
                                                                            <p>Free Shipping |  Free
                                                                            </p>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </>
                                                    )

                                                })}


                                                <div className='payment mt-4'>
                                                    <h5 className='sub-all-title'>Payment</h5>
                                                    <p>All transactions are secure and encrypted.</p>

                                                    <div className='card-main mt-3'>
                                                        <div className='card-title p-3'>
                                                            <h5>Card</h5>
                                                            <div className='d-flex gap-2 align-items-center'>
                                                                <svg className="SVGInline-svg SVGInline--cleaned-svg SVG-svg BrandIcon-svg BrandIcon--size--20-svg" height="20" width="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><path d="M0 0h32v32H0z" fill="#00579f"></path><g fill="#fff" fillRule="nonzero"><path d="M13.823 19.876H11.8l1.265-7.736h2.023zm7.334-7.546a5.036 5.036 0 0 0-1.814-.33c-1.998 0-3.405 1.053-3.414 2.56-.016 1.11 1.007 1.728 1.773 2.098.783.379 1.05.626 1.05.963-.009.518-.633.757-1.216.757-.808 0-1.24-.123-1.898-.411l-.267-.124-.283 1.737c.475.213 1.349.403 2.257.411 2.123 0 3.505-1.037 3.521-2.641.008-.881-.532-1.556-1.698-2.107-.708-.354-1.141-.593-1.141-.955.008-.33.366-.667 1.165-.667a3.471 3.471 0 0 1 1.507.297l.183.082zm2.69 4.806.807-2.165c-.008.017.167-.452.266-.74l.142.666s.383 1.852.466 2.239h-1.682zm2.497-4.996h-1.565c-.483 0-.85.14-1.058.642l-3.005 7.094h2.123l.425-1.16h2.597c.059.271.242 1.16.242 1.16h1.873zm-16.234 0-1.982 5.275-.216-1.07c-.366-1.234-1.515-2.575-2.797-3.242l1.815 6.765h2.14l3.18-7.728z"></path><path d="M6.289 12.14H3.033L3 12.297c2.54.641 4.221 2.189 4.912 4.049l-.708-3.556c-.116-.494-.474-.633-.915-.65z"></path></g></g></svg>

                                                                <svg className="SVGInline-svg SVGInline--cleaned-svg SVG-svg BrandIcon-svg BrandIcon--size--20-svg" height="20" width="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><path d="M0 0h32v32H0z" fill="#000"></path><g fillRule="nonzero"><path d="M13.02 10.505h5.923v10.857H13.02z" fill="#ff5f00"></path><path d="M13.396 15.935a6.944 6.944 0 0 1 2.585-5.43c-2.775-2.224-6.76-1.9-9.156.745s-2.395 6.723 0 9.368 6.38 2.969 9.156.744a6.944 6.944 0 0 1-2.585-5.427z" fill="#eb001b"></path><path d="M26.934 15.935c0 2.643-1.48 5.054-3.81 6.21s-5.105.851-7.143-.783a6.955 6.955 0 0 0 2.587-5.428c0-2.118-.954-4.12-2.587-5.429 2.038-1.633 4.81-1.937 7.142-.782s3.811 3.566 3.811 6.21z" fill="#f79e1b"></path></g></g></svg>

                                                                <svg className="SVGInline-svg SVGInline--cleaned-svg SVG-svg BrandIcon-svg BrandIcon--size--20-svg" height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g fill="none" fillRule="evenodd"><path fill="#0193CE" d="M0 0h32v32H0z"></path><path d="M17.79 18.183h4.29l1.31-1.51 1.44 1.51h1.52l-2.2-2.1 2.21-2.27h-1.52l-1.44 1.51-1.26-1.5H17.8v-.85h4.68l.92 1.18 1.09-1.18h4.05l-3.04 3.11 3.04 2.94h-4.05l-1.1-1.17-.92 1.17h-4.68v-.84zm3.67-.84h-2.53v-.84h2.36v-.83h-2.36v-.84h2.7l1.01 1.26-1.18 1.25zm-14.5 1.68h-3.5l2.97-6.05h2.8l.35.67v-.67h3.5l.7 1.68.7-1.68h3.31v6.05h-2.63v-.84l-.34.84h-2.1l-.35-.84v.84H8.53l-.35-1h-.87l-.35 1zm9.96-.84v-4.37h-1.74l-1.4 3.03-1.41-3.03h-1.74v4.04l-2.1-4.04h-1.4l-2.1 4.37h1.23l.35-1h2.27l.35 1h2.43v-3.36l1.6 3.36h1.05l1.57-3.36v3.36h1.04zm-8.39-1.85-.7-1.85-.87 1.85h1.57z" fill="#FFF"></path></g></svg>

                                                                <svg className="SVGInline-svg SVGInline--cleaned-svg SVG-svg BrandIcon-svg BrandIcon--size--20-svg" height="20" width="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><path d="M0 0h32v32H0z" fill="#ebf1f8"></path><path d="M0 0h32v32H0z" fill="#fff"></path><g fillRule="nonzero"><path d="M13.319 8.021V8h5.263v.021C22.707 8.327 25.9 11.808 25.9 16s-3.193 7.673-7.318 7.979V24h-5.263v-.021C9.193 23.673 6 20.192 6 16s3.193-7.673 7.319-7.979z" fill="#0165ac"></path><path d="M15.474 20.523c1.888-.68 3.15-2.492 3.15-4.523s-1.262-3.842-3.15-4.523zm-3.158-9.046c-1.889.68-3.15 2.492-3.15 4.523s1.261 3.842 3.15 4.523zm1.579 11.456c-3.78 0-6.842-3.104-6.842-6.933 0-3.83 3.063-6.933 6.842-6.933 3.779 0 6.842 3.104 6.842 6.933 0 3.83-3.063 6.933-6.842 6.933z" fill="#fff"></path></g></g></svg>

                                                                <svg className="SVGInline-svg SVGInline--cleaned-svg SVG-svg BrandIcon-svg BrandIcon--size--20-svg" height="20" width="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient x1="84.571%" y1="-2.163%" x2="20.485%" y2="100%" id="bi_cartesbancaires__a"><stop stopColor="#002253" offset="0%"></stop><stop stopColor="#0082B1" offset="54.255%"></stop><stop stopColor="#0E9641" offset="100%"></stop></linearGradient></defs><g fill="none" fillRule="evenodd"><path fill="url(#bi_cartesbancaires__a)" d="M0 0h32v32H0z"></path><path d="M17.657 10.009v6.008h9.591a3.004 3.004 0 0 0 0-6.008h-9.59zm-.818 6.008c-.054-1.182-.35-2.242-.846-3.142a5.963 5.963 0 0 0-2.358-2.357c-1.001-.553-2.2-.856-3.546-.856H8.818c-1.345 0-2.545.303-3.546.856a5.963 5.963 0 0 0-2.358 2.357c-.553 1.002-.856 2.201-.856 3.547 0 1.345.303 2.544.856 3.546a5.963 5.963 0 0 0 2.358 2.358c1.001.553 2.2.855 3.546.855h1.27c1.346 0 2.546-.302 3.547-.855a5.963 5.963 0 0 0 2.358-2.358c.497-.9.792-1.96.846-3.142H9.684v-.809h7.155zm.818.809v6.009h9.591a3.004 3.004 0 0 0 0-6.009h-9.59z" fill="#FFF"></path></g></svg>

                                                                <svg className="SVGInline-svg SVGInline--cleaned-svg SVG-svg BrandIcon-svg BrandIcon--size--20-svg" height="20" width="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><path d="M0 0h32v32H0z" fill="#ebf1f8"></path><path d="M0 0h32v32H0z" fill="#fff"></path><g fillRule="nonzero"><path d="M5 24h4.4c1.001 0 2.2-1.195 2.2-2.133V8H7.2C6.199 8 5 9.195 5 11.2z" fill="#047ab1"></path><path d="M7.497 18.816A9.283 9.283 0 0 1 5 18.475V17.3c.63.378 1.35.591 2.09.619.847 0 1.32-.576 1.32-1.365v-3.222h2.09v3.222c0 1.258-.682 2.261-3.003 2.261z" fill="#fff"></path><path d="M12.7 24h4.4c1.001 0 2.2-1.195 2.2-2.133V8h-4.4c-1.001 0-2.2 1.195-2.2 3.2z" fill="#d42d06"></path><path d="M12.7 14.08c.638-.597 1.738-.97 3.52-.885.968.042 1.98.32 1.98.32v1.184a4.574 4.574 0 0 0-1.903-.608c-1.353-.118-2.178.618-2.178 1.909s.825 2.027 2.178 1.92a4.64 4.64 0 0 0 1.903-.619v1.174s-1.012.288-1.98.33c-1.782.086-2.882-.288-3.52-.885z" fill="#fff"></path><path d="M20.4 24h4.4c1.001 0 2.2-1.195 2.2-2.133V8h-4.4c-1.001 0-2.2 1.195-2.2 3.2z" fill="#67b637"></path><path d="M25.9 17.28c0 .853-.682 1.387-1.595 1.387H20.4v-5.334h3.553l.253.011c.803.043 1.397.501 1.397 1.29 0 .62-.407 1.153-1.144 1.28v.033c.814.053 1.441.554 1.441 1.333zm-2.805-3.104a1.032 1.032 0 0 0-.143-.01h-1.32v1.343h1.463c.275-.064.506-.309.506-.672 0-.362-.231-.608-.506-.661zm.165 2.176a.975.975 0 0 0-.176-.01h-1.452v1.46h1.452l.176-.02c.275-.065.506-.342.506-.715 0-.374-.22-.64-.506-.715z" fill="#fff"></path></g></g></svg>

                                                                <svg className="SVGInline-svg SVGInline--cleaned-svg SVG-svg BrandIcon-svg BrandIcon--size--20-svg" height="20" width="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><path d="M0 0h32v32H0z" fill="#fff"></path><g fillRule="nonzero"><path d="M8.082 7h6.478c.904 0 1.466.816 1.256 1.821L12.8 23.163c-.213 1.002-1.118 1.819-2.023 1.819H4.3c-.903 0-1.467-.817-1.256-1.819L6.061 8.821c.211-1.005 1.116-1.82 2.021-1.82" fill="#dd2423"></path><path d="M14.02 7h7.45c.904 0 .496.816.284 1.821l-3.016 14.342c-.211 1.002-.145 1.819-1.051 1.819h-7.45c-.905 0-1.466-.817-1.253-1.819L12 8.821c.214-1.005 1.117-1.82 2.022-1.82" fill="#16315e"></path><path d="M21.174 7h6.478c.905 0 1.468.816 1.255 1.821l-3.015 14.342c-.213 1.002-1.119 1.819-2.024 1.819h-6.475c-.906 0-1.468-.817-1.255-1.819l3.015-14.342c.211-1.005 1.115-1.82 2.021-1.82" fill="#036862"></path><path d="M9.774 11.596c-.666.008-.863 0-.926-.016-.024.127-.473 2.424-.475 2.426-.096.464-.167.796-.406 1.01a.682.682 0 0 1-.478.184c-.295 0-.468-.163-.496-.47l-.006-.107.09-.625s.472-2.094.556-2.37a.22.22 0 0 0 .007-.032c-.918.01-1.08 0-1.092-.016a4.287 4.287 0 0 0-.029.152l-.482 2.36-.041.2-.08.654c0 .194.034.352.103.486.22.425.845.489 1.2.489.456 0 .884-.108 1.173-.304.502-.328.633-.842.75-1.298l.055-.235s.486-2.173.568-2.456c.004-.016.005-.024.009-.032zm1.654 1.754a1.18 1.18 0 0 0-.524.136c-.07.04-.136.085-.205.131l.062-.251-.034-.043c-.408.092-.5.104-.876.163l-.031.023a13.64 13.64 0 0 1-.245 1.493c-.062.291-.126.585-.19.876l.017.037a8.46 8.46 0 0 1 .839-.017l.027-.033c.043-.241.048-.298.143-.788.044-.232.136-.743.182-.924a.583.583 0 0 1 .246-.086c.188 0 .165.182.157.254a9.978 9.978 0 0 1-.146.86l-.047.22c-.033.162-.069.32-.101.481l.014.033c.38-.023.496-.023.821-.017l.038-.033c.06-.377.076-.478.18-1.028l.053-.253c.102-.495.153-.746.076-.95-.082-.229-.277-.284-.456-.284zm1.847.518c-.203.043-.332.072-.46.09-.127.023-.25.043-.446.073l-.016.016-.014.012c-.02.161-.035.3-.062.465-.022.17-.058.362-.115.638a2.718 2.718 0 0 1-.092.36c-.025.075-.052.147-.102.356l.012.019.01.018c.182-.01.301-.017.424-.018.123-.005.25 0 .447.001l.017-.016.019-.017c.028-.187.032-.238.05-.33.017-.098.046-.234.12-.597.034-.171.072-.341.108-.515.037-.174.076-.345.113-.515l-.006-.021zm.004-.698c-.184-.12-.506-.082-.723.084-.217.162-.242.393-.058.515.18.117.504.082.72-.086.215-.166.242-.394.061-.513zm1.111 2.782c.372 0 .753-.113 1.04-.45.22-.273.322-.68.357-.847.114-.555.025-.814-.086-.972-.17-.24-.47-.317-.78-.317-.187 0-.632.02-.98.375-.25.257-.365.604-.435.938-.07.34-.151.95.356 1.178.157.075.383.095.528.095zm-.029-1.248c.086-.42.187-.773.446-.773.202 0 .217.263.127.684-.016.094-.09.442-.19.59-.07.109-.153.175-.244.175-.027 0-.189 0-.191-.265a1.992 1.992 0 0 1 .052-.411zm2.356 1.194.029-.033c.04-.241.048-.298.139-.788.046-.232.14-.743.184-.924.084-.043.166-.086.247-.086.187 0 .164.182.157.254a9.065 9.065 0 0 1-.147.86l-.044.22c-.034.162-.071.32-.104.481l.014.033a8.12 8.12 0 0 1 .82-.017l.04-.033c.057-.377.073-.479.18-1.028l.051-.253c.102-.495.154-.746.078-.95-.083-.229-.28-.284-.457-.284a1.17 1.17 0 0 0-.524.136c-.068.04-.137.085-.204.131l.059-.251-.032-.043c-.407.092-.5.104-.877.163l-.029.023c-.045.402-.082.704-.245 1.494-.061.29-.125.584-.19.875l.018.037c.386-.023.502-.023.837-.017zm2.805.016.167-.898s.122-.565.13-.585c0 0 .037-.059.076-.082h.056c.53 0 1.129 0 1.598-.383.32-.262.538-.65.636-1.12.025-.116.043-.253.043-.39a.885.885 0 0 0-.127-.498c-.239-.371-.716-.378-1.266-.38l-.271.002c-.704.01-.987.007-1.103-.009l-.028.158-.252 1.297-.633 2.884c.615-.008.867-.008.974.004zm.467-2.3.267-1.288.009-.066.003-.05.108.011.566.054c.218.094.308.335.245.65-.057.288-.225.53-.442.646-.178.1-.396.108-.621.108h-.146zm1.67 1.114c-.07.335-.152.946.353 1.164a.902.902 0 0 0 .452.09c.155-.009.298-.095.431-.219l-.036.153.023.033c.363-.017.476-.017.87-.014l.035-.03c.058-.374.112-.738.261-1.454l.22-1.024-.011-.037c-.407.083-.515.1-.906.162l-.03.027-.012.102a.577.577 0 0 0-.284-.26c-.174-.076-.583.022-.934.376-.246.253-.365.599-.432.93zm.854.02c.087-.412.187-.761.446-.761.163 0 .25.167.232.453l-.047.23c-.026.123-.054.245-.081.366a.928.928 0 0 1-.096.214.432.432 0 0 1-.316.17c-.026 0-.186 0-.191-.261-.002-.13.023-.264.053-.41zm4.457-1.362-.032-.04c-.402.09-.474.105-.844.16l-.027.03-.004.02-.002-.007c-.275.703-.267.551-.49 1.104l-.003-.067-.056-1.2-.035-.04c-.421.09-.431.105-.82.16l-.03.03c-.005.015-.005.03-.008.048l.003.006c.049.275.037.214.086.648.022.213.053.428.075.638.039.353.06.526.107 1.064-.263.48-.325.662-.578 1.083l.002.005-.178.312c-.02.032-.039.055-.065.065a.245.245 0 0 1-.116.018h-.1l-.146.54.503.01a.613.613 0 0 0 .581-.36l.317-.6h-.005l.033-.043c.213-.508 1.832-3.584 1.832-3.584zm-5.31 7.098h-.214l.79-2.895h.262l.083-.298.008.331c-.01.205.136.387.518.357h.443l.152-.557h-.167c-.095 0-.14-.027-.134-.085L23.393 17h-.82v.002c-.264.006-1.055.028-1.215.075a1.386 1.386 0 0 0-.398.218l.08-.298h-.765l-.16.592-.8 2.939h-.156l-.152.553h1.525l-.05.185h.751l.05-.185h.21zm-.627-2.307a3.234 3.234 0 0 0-.35.152l.202-.74h.609l-.147.539s-.188.012-.314.05zm.012 1.057s-.191.027-.317.058a2.959 2.959 0 0 0-.357.173l.21-.77h.612zm-.341 1.256h-.61l.176-.65h.609zm1.47-1.795h.88l-.126.454h-.892l-.134.496h.78l-.59.921a.25.25 0 0 1-.12.11.326.326 0 0 1-.159.051h-.216l-.149.544h.566c.295 0 .468-.149.597-.343l.405-.615.087.624a.29.29 0 0 0 .146.212c.056.031.115.085.198.093.088.005.152.008.195.008h.278l.167-.608h-.11c-.063 0-.171-.012-.19-.034-.018-.026-.018-.067-.028-.13l-.088-.624h-.362l.159-.21h.89l.137-.495h-.824l.128-.454h.822l.152-.56h-2.449zm-7.433 1.922.206-.757h.844l.154-.563H15.1l.13-.466h.825l.153-.545h-2.066l-.15.545h.47l-.126.466h-.47l-.157.572h.47l-.274 1.002c-.037.132.017.183.052.244.035.06.07.1.15.123.084.02.14.032.217.032h.952l.17-.623-.422.064c-.082 0-.307-.01-.283-.094zm.097-3.624-.214.429a.492.492 0 0 1-.124.178c-.033.022-.097.032-.191.032h-.112l-.149.548h.37a.779.779 0 0 0 .381-.109c.07-.041.089-.018.143-.076l.125-.12h1.158l.154-.57h-.848l.148-.312zm1.71 3.635c-.02-.032-.006-.087.024-.203l.316-1.16h1.126c.164-.002.282-.004.36-.01a.688.688 0 0 0 .27-.102.532.532 0 0 0 .197-.2c.048-.075.127-.238.194-.488l.398-1.468-1.168.007s-.36.059-.518.124c-.16.072-.388.274-.388.274l.105-.402h-.721l-1.01 3.71a2.5 2.5 0 0 0-.066.312c-.002.068.077.135.128.186.06.05.15.042.236.05.09.008.218.012.395.012h.555l.17-.636-.497.052a.127.127 0 0 1-.107-.058zm.544-2.146h1.182l-.075.26c-.01.007-.036-.012-.156.004H17.02zm.237-.875h1.192l-.085.314s-.562-.006-.652.012c-.396.076-.628.31-.628.31zm.897 2.01a.142.142 0 0 1-.047.08c-.024.017-.063.023-.12.023h-.17l.01-.317h-.7l-.029 1.553c0 .112.01.177.083.23.074.064.302.072.61.072h.439l.158-.581-.382.023-.127.008a.147.147 0 0 1-.053-.036c-.016-.018-.043-.007-.039-.119l.003-.398.401-.019a.493.493 0 0 0 .388-.152c.076-.071.1-.153.129-.264l.067-.352h-.551z" fill="#fefefe"></path></g></g></svg>
                                                            </div>
                                                        </div>
                                                        <div className='card-info p-3'>
                                                            {/* <div className='login-input text-start'>
                                                    <input placeholder='Card number'
                                                        type='number'
                                                        className='lock'
                                                    />
                                                </div>
                                                <div className='login-input text-start mt-2'>
                                                    <input placeholder='Name on card'
                                                        type='text'
                                                    />
                                                </div>
                                                <Row>
                                                    <Col lg={6} md={12}>
                                                        <div className='login-input text-start mt-2'>
                                                            <input placeholder='Expiration date (MM/YY)'
                                                                type='text'
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col lg={6} md={12}>
                                                        <div className='login-input text-start mt-2'>
                                                            <input placeholder='Security code'
                                                                type='text'
                                                                className='alert'
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row> */}
                                                            <div className='address-shipped mt-3'>
                                                                <CardElement />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {stripe ? (
                                                    <ElementsConsumer>
                                                        {({ elements, stripe }) => (
                                                            <div>
                                                                <Button className='checkout mt-3' disabled={!stripe} onClick={() => handleCheckout()}>  {is_Wait ? "Loading..." : "Make payment"} </Button>
                                                            </div>
                                                        )}
                                                    </ElementsConsumer>
                                                ) : (
                                                    <div>Loading...</div>
                                                )
                                                }

                                                {/* <Button className='submit-btn w-100' onClick={nextStep}>Continue to payment</Button> */}
                                            </div>
                                        }

                                    </Col>
                                    <Col lg={6} md={12} className='mt-4 mt-lg-0'>

                                        {/* <div className='cart-pricing-main '> */}
                                        {/* <div className='cart-product border-bottom-cos pb-3'>
                                    <div className='cart-product-box d-flex align-items-center justify-content-between'>
                                        <div className='d-flex align-items-center gap-3 gap-sm-4'>
                                            <div className='cart-product-img position-relative'>
                                                <img src='./img/cart.png' />
                                                <span>6</span>
                                            </div>
                                            <div className='cart-items-def '>
                                                <h5>Amazing earrings</h5>
                                                <span>8-3 silver white / 6.5</span>
                                            </div>
                                        </div>
                                        <div className='items-per'>
                                            <h5>$299,43</h5>
                                        </div>
                                    </div>
                                </div> */}
                                        {/* <div className='cart-product mt-3'>
                                    <div className='cart-product-box d-flex align-items-center justify-content-between'>
                                        <div className='d-flex align-items-center gap-3 gap-sm-4'>
                                            <div className='cart-product-img position-relative'>
                                                <img src='./img/cart.png' />
                                                <span>6</span>
                                            </div>
                                            <div className='cart-items-def '>
                                                <h5>Amazing earrings</h5>
                                                <span>8-3 silver white / 6.5</span>
                                            </div>
                                        </div>
                                        <div className='items-per'>
                                            <h5>$299,43</h5>
                                        </div>
                                    </div>
                                </div>
                            </div> */}



                                        <div className='mt-3'>

                                            {cartList.list?.length <= 0 &&
                                                <div className='d-flex align-items-center justify-content-center h-100'>
                                                    <div className='text-center found'>
                                                        <img src='./img/not-found.png' alt='' />
                                                        <p className='mt-3'>The cart is empty</p>
                                                        <Button className='mt-3 submit-btn' type='button' onClick={() => navigate("/trending")}  >Shop Now</Button>
                                                    </div>
                                                </div>
                                            }

                                            {
                                                cartList.list && cartList.list?.map((e, i) => {
                                                    return (

                                                        <div className='cart-items pb-3' key={i} >

                                                            <div onClick={() => handelProductDetail(e.product_details._id)} className='pointer items-img select-all d-flex align-items-center'>
                                                                {/* <input
id='select-all'
type='checkbox'
checked={checkboxes.checkbox1}
onChange={event =>
setCheckboxes(prevState => ({
...prevState,
checkbox1: event.target.checked,
}))
}
/> */}

                                                                <img src={cartList.productImagePath + e.product_id + "/" + getimagename(e.sku_details, e.skuid)} alt='' width="150px" />
                                                            </div>
                                                            <div className='cart-items-def w-100'>
                                                                <h5>{e.product_name}</h5>
                                                                <span className='d-flex align-items-center'>
                                                                    {formatDate(startDate)} - {formatDate(endDate)}
                                                                </span>
                                                                <span className='d-flex align-items-center'>By {e.seller_name}</span>
                                                                <div className='d-flex align-items-center gap-2 cart-color w-100'>
                                                                    <h6>Color : </h6>
                                                                    <span>{e.sku_data?.color}</span>
                                                                </div>

                                                                {e.sku_data?.size &&
                                                                    <div className='d-flex align-items-center gap-2 cart-color w-100'>
                                                                        <h6>Size : </h6>
                                                                        <span>{e.sku_data?.size}</span>
                                                                    </div>
                                                                }

                                                                <div className='wrap-cos d-flex align-items-center justify-content-between'>
                                                                    <div className='items-per d-flex align-items-center gap-2 mt-2'>
                                                                        <h5>${e.total_price}</h5>
                                                                        {/* <del>${e.product_details.group_price}</del> */}
                                                                        {/* <span>{Math.round(e.product_details.group_price * 100 / e.product_details.individual_price)}% Off</span> */}
                                                                    </div>

                                                                    <div className='product-info d-flex align-items-center gap-3 marg-cos'>
                                                                        <div className='qty d-flex align-items-center gap-3'>
                                                                            <h5>Qty:</h5>
                                                                            <div className='count-product'>
                                                                                <Button onClick={(d) => (removeCartData(e._id, "update-to-cart-qty", e.qty - 1))} > <MdRemove /></Button>
                                                                                <span>{e.qty}</span>
                                                                                <Button onClick={(d) => (removeCartData(e._id, "update-to-cart-qty", e.qty + 1))}><MdAdd /></Button>
                                                                            </div>
                                                                        </div>
                                                                        <Button onClick={() => removeCartData(e._id, "remove-to-cart-product")} className='submit-btn delete-comment delete-product'>
                                                                            <MdDelete />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }

                                        </div>

                                        {/* <div className='login-input text-start mt-4'>
                                <div className='d-flex align-items-center gap-2'>
                                    <input className='mt-0' placeholder='Discount code' type='text' />
                                    <Button className='checkout px-4' style={{ width: "auto", whiteSpace: "nowrap" }}>Apply</Button>
                                </div>
                            </div> */}

                                        {
                                            cartList.list?.length > 0 &&
                                            <>
                                                <div className='mb-3 mt-3'>
                                                    <div className='login-input text-start'>
                                                        <label>Coupon Code</label>

                                                        {cartList.cartDiscount?.coupon_id?.coupon_title ?
                                                            <div>
                                                                <div className='coupne-code d-flex align-items-center gap-2 mt-2'>
                                                                    <span>{cartList.cartDiscount.coupon_id?.coupon_title}</span>
                                                                    <Button onClick={() => handleCoupon("remove", cartList?.cartDiscount.coupon_id?.coupon_title)} ><AiFillCloseCircle /></Button>
                                                                </div>
                                                                <p>{cartList.cartDiscount?.coupon_id?.coupon_description}</p>
                                                            </div> :
                                                            <div className='d-flex align-items-center gap-2 mt-1'>
                                                                <input className='mt-0' placeholder='Enter coupon code ' value={couponCode} onChange={(e) => setCouponCode(e.target.value)} type='text' />
                                                                <Button className='checkout px-4 '
                                                                    onClick={() => handleCoupon("apply")}
                                                                    style={{ width: "auto", whiteSpace: "nowrap" }} >Apply</Button>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>

                                                <div className='total-list mt-3'>
                                                    <div className='d-flex align-items-center justify-content-between'>
                                                        <label>SUBTOTAL</label>
                                                        <h5>${cartList.cartAmountDetails?.total_amount ? cartList.cartAmountDetails?.total_amount : 0}</h5>
                                                    </div>

                                                    <div className='d-flex align-items-center justify-content-between mt-2'>
                                                        <label>SHIPPING CHARGE </label>
                                                        {/* {console.log(cartList.cartAmountDetails?.shipping_charge,"cartList.cartAmountDetails?.shipping_charge")} */}
                                                        {
                                                            cartList.cartAmountDetails?.shipping_charge
                                                                ? <h5>$ {cartList.cartAmountDetails?.shipping_charge}</h5>
                                                                : <div className='d-flex align-items-center gap-2'>
                                                                    <del> $5.00 </del>
                                                                    <h5>(FREE)</h5>
                                                                </div>
                                                        }

                                                    </div>

                                                    <div className='d-flex align-items-center justify-content-between mt-2'>
                                                        <label>SALES TAX</label>
                                                        <h5>${cartList.cartAmountDetails?.sales_tax ? cartList.cartAmountDetails?.sales_tax : 0}</h5>
                                                    </div>

                                                    <div className='d-flex align-items-center justify-content-between mt-2'>
                                                        <span>DISCOUNT </span>
                                                        <span>{cartList.cartAmountDetails?.discount_amount ? "-$" + cartList.cartAmountDetails?.discount_amount : "$0"}</span>
                                                    </div>

                                                </div>

                                                <div className='total mt-3'>
                                                    <div className='d-flex align-items-center justify-content-between'>
                                                        <h5>TOTAL</h5>
                                                        <h5>${cartList.cartAmountDetails?.net_amount ? cartList.cartAmountDetails?.net_amount : 0}</h5>
                                                    </div>
                                                    {/* <p>Taxes and delivery fees are calculated on the next page.</p> */}
                                                </div>


                                            </>


                                        }


                                        {/* <div className='total-list mt-4'>
                                <div className='d-flex align-items-center justify-content-between'>
                                    <label>Subtotal</label>
                                    <h5>$299,43</h5>
                                </div>
                                <div className='d-flex align-items-center justify-content-between mt-3'>
                                    <label>Shipping</label>
                                    <h5>Free</h5>
                                </div>
                                <div className='d-flex align-items-center justify-content-between mt-3 all-total'>
                                    <label>Total</label>
                                    <h5>USD <span>$299,43</span></h5>
                                </div>
                            </div> */}


                                    </Col>
                                </Row>


                            </div>
                        </>)}
            </div>

            {/* add addresh */}
            <Modal show={show} onHide={handleClose} className='add-address' centered>
                <Modal.Body>
                    <div className='position-relative'>
                        <Button className='close-modal-btn forgot-pass-close' onClick={handleClose}>
                            <MdOutlineClose />
                        </Button>
                        <h5>Shipping address</h5>
                        <Form>
                            <Row className='mt-2'>
                                {/* <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>Ship to Address</label>
                                        <select name='country_id'
                                            value={values.country_id}
                                            onChange={handleChange}
                                            className='select-arrow'>
                                            <option value="" >Select country</option>
                                            {(countryList.length <= 0) && <option
                                            >loding....</option>}
                                            {
                                                countryList.map((e, i) =>
                                                (
                                                    <option key={i} value={e?._id}  >{e?.name}</option>
                                                ))
                                            }
                                        </select>
                                        <div className='error' >{errors?.country_id}</div>
                                    </div>
                                </Col> */}
                                <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>Ship to Address</label>
                                        <Select
                                            name='country_id'
                                            className='rect-select-cos'
                                            value={defaultCountry && { value: defaultCountry._id, label: defaultCountry.name }} 
                                            // value={countryList.find(option => option.value === values.country_id)} // sets the selected value
                                            onChange={option => {
                                                handleChange({
                                                    target: {
                                                        name: 'country_id',
                                                        value: option.value,
                                                    },
                                                })
                                            }} //set selected value
                                            options={countryList.map(country => ({ value: country._id, label: country.name }))} 
                                            />
                                        <div className='error'>{errors?.country_id}</div>
                                    </div>
                                </Col>
                                <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>Full Name</label>
                                        <input placeholder='Full Name'
                                            type='text'
                                            name='fullname'
                                            onChange={handleChange}
                                            value={values.fullname}
                                        />
                                        <div className='error' >{errors?.fullname}</div>

                                    </div>
                                </Col>
                                <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>Phone Number</label>
                                        <input placeholder='Phone Number'
                                            type='number'
                                            name="contact_no"
                                            value={values.contact_no}
                                            onChange={handleChange}
                                        />
                                        <div className='error' >{errors?.contact_no}</div>
                                    </div>
                                </Col>
                                <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>City</label>
                                        <input placeholder='City'
                                            type='text'
                                            name='city'
                                            onChange={handleChange}
                                            value={values.city}
                                        />
                                        <div className='error' >{errors?.city}</div>
                                    </div>
                                </Col>
                                {/* <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>State</label>
                                        <select
                                            onClick={checkforcounty} onChange={handleChange}
                                            value={values.state_id}
                                            name='state_id' className='select-arrow'>
                                            <option value="" >Select State</option>
                                            {errors.country_id == undefined && (
                                                <>
                                                    {
                                                        stateList.map((e, i) =>
                                                        (
                                                            <option key={i} value={e?._id}  >{e?.name}</option>
                                                        ))
                                                    }
                                                    )
                                                </>
                                            )}

                                        </select>
                                        <div className='error' >{errors?.state_id}</div>
                                    </div>
                                </Col> */}
                                <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>State</label>
                                        <Select
                                            name='state_id'
                                            className='rect-select-cos'
                                            // value={ values.state_id ? stateList.find(option => option.value === values.state_id) : null}
                                            value={ defaultState && { value: defaultState._id , label: defaultState.name }}
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

                                <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>Zip Code</label>
                                        <input placeholder='Zip Code'
                                            type='number'
                                            onChange={handleChange}
                                            value={values.zipcode}
                                            name='zipcode'
                                        />
                                        <div className='error' >{errors?.zipcode}</div>
                                    </div>
                                </Col>
                                <Col lg={12} md={12} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>Address</label>
                                        <textarea className='w-100'
                                            onChange={handleChange}
                                            name='address'
                                            value={values.address} placeholder='Enter Address'
                                            rows={5}></textarea>
                                        <div className='error' >{errors?.address}</div>
                                    </div>
                                </Col>
                            </Row>
                            {/* <div className='d-flex align-items-start check-terms gap-3 mt-3'>
                                <Form.Check
                                    type="checkbox"
                                    id='check_terms'
                                />
                                <label htmlFor='check_terms' className='pointer'>Make this my default address</label>
                            </div> */}
                            {modelMood == "edit" && <button className='submit-btn w-100 mt-3' type='button' onClick={() => handleSubmit("edit")} >Edit Address</button>}
                            {modelMood == "add" && <button className='submit-btn w-100 mt-3' type='button' onClick={() => handleSubmit("add")} >Add Address</button>}
                        </Form>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

// Wrap your Cart component with Elements component
const Cart = () => (
    <Elements stripe={stripePromise}>
        <WrappedCart />
    </Elements>
);


export default Cart
