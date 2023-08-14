import React, { useRef, useState, useEffect, useContext } from 'react'
import Layout from '../layout/Layout'
import { Badge, Button, Col, Form, Modal, Nav, NavLink, Row, Tab, Table, Tabs, } from 'react-bootstrap'
import {
    MdOutlineKeyboardArrowRight,
    MdKeyboardDoubleArrowRight,
    MdKeyboardArrowRight,
    MdDelete,
} from "react-icons/md"
import ProCard from '../components/ProCard'
import { data } from "../page/Data"
import { handelCategorydata } from '../helper/constants'
import { MdOutlineClose } from 'react-icons/md'
import api from '../helper/api';
import { getServerURL } from '../helper/envConfig'
import { validate } from './AddressSchima';
import SucessSnackBar from "../components/SnackBar";
import ErrorSnackBar from "../components/SnackBar";
import { useNavigate } from 'react-router-dom'
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from '@greatsumini/react-facebook-login';
import axios from 'axios';
import Loader from '../components/Loader'
import { CartContext } from '../context/CartContext';
import { login } from '../helper/auth'
import { Is_Login } from '../helper/IsLogin'
import { handelProductDetail } from '../helper/constants'
import Select from 'react-select';

const Profile = () => {

    const { setMainLoder, itemShow, setItemShow, sucessSnackBarOpenCart, setwarningSnackBarOpen, setsucessSnackBarOpen, add_wished_Called, Mymessage, setSucessSnackBarOpen, sucessSnackBarOpen, warningSnackBarOpen, setWarningSnackBarOpen, profileOption, setProfileOption, myAddress, getMyAddress, userProductList, wishProductUrl, category, currentUser,
        productList, trendingProductList, getProducts, getWishList, wishlist, addWishList } = useContext(CartContext);

    const initialValues = {
        country_id: "",
        state_id: "",
        fullname: "",
        contact_no: "",
        address: "",
        city: "",
        zipcode: "",
    };

    const initialValue_2 = {
        bio: "",
        first_name: "",
        last_name: "",
        gender: "",
        profile_image: ""
    };
    const defaultProfile = `../img/for_you/defaultuser.png`
    const Userprofile = defaultProfile
    const isLoggedIn = Is_Login();
    const [showPass, setShowPass] = useState(true)
    const [showloderUrl, setShowloderUrl] = useState(false)
    const [values, setValues] = useState(initialValues);
    const [values_2, setValues_2] = useState(initialValue_2);
    const [errors, setErrors] = useState({});
    const [MymessageProfile, setMymessageProfileProfile] = useState("");
    const [sucessSnackBarOpenProfile, setsucessSnackBarOpenProfile] = useState(false);
    const [warningSnackBarOpenProfile, setwarningSnackBarOpenProfile] = useState(false);
    const [stateList, setStateList] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [orderList, setOrderList] = useState([]);
    const [notificationList, setNotificationList] = useState([]);
    const [submitCount, setSubmitCount] = useState(0);
    const serverURL = getServerURL();
    const [orderUrl, setOrderUrl] = useState(false);
    const [page, setPage] = useState(1);
    const [pageNotification, setPageNotification] = useState(1);
    const [viewMoreLodr, setViewmoreLoder] = useState(false);
    const [modelMood, setIModelMood] = useState("add");
    const [show, setShow] = useState(false);
    const [adId, setAdId] = useState("");
    const player = useRef();
    const [loading, setLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);
    const [is_lastItem, setIs_lastItem] = useState();
    const [displayedOrders, setDisplayedOrders] = useState([]);
    // const [page, setPage] = useState(1);
    const itemsPerPage = 5; // Set the number of items you want to show on one page
    const navigate = useNavigate();
    const inputFileRef = useRef(null);

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
        setLoading(true)
    };

    const stopAnimation = () => {
        setLoading(false);
    };

    const getOrderList = async () => {

        startAnimation()

        try {
            const res = await api.postWithToken(`${serverURL + "order-manage"}`, { "action": "my-orders-list" })
            setOrderList(res.data.data)
            setIs_lastItem(res.data.data?.userOrderItems.length)
            stopAnimation()
        } catch (error) {
            console.log(error);
        }
    };

    const getUserProfile = async () => {

        startAnimation()

        try {
            const res = await api.postWithToken(`${serverURL + "profile-view"}`)
            setValues_2(res.data.data.user)
            stopAnimation()
        } catch (error) {
            console.log(error);
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

    const handleChange_2 = (e) => {

        const { name, value, checked, type } = e.target;
        setValues_2((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };


    const handlePhoto = (e) => {

        const file = e.target.files[0];
        setValues_2({ ...values_2, [e.target.name]: e.target.files[0] });

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
            setLoading(false);
        };
        reader.readAsDataURL(file);

    };

    const handleImageClick = () => {
        inputFileRef.current.click();
    }

    const submitProfile = async (e) => {
        e.preventDefault();

        try {

            if (values_2.bio && values_2.first_name && values_2.last_name && values_2.gender && values_2.profile_image) {
                setMainLoder(true)
                const formData = new FormData();
                formData.append('bio', values_2.bio);
                formData.append('first_name', values_2.first_name);
                formData.append('last_name', values_2.last_name);
                formData.append('gender', values_2.gender);
                formData.append('profile_image', values_2.profile_image);
                // formData.append('phone_code_country', "636c8e4cce909ce9bf2510f2");
                // formData.append('contact_no', 9998801748);
                // formData.append('phone_code', +1);
                const response = await Promise.all([
                    api.postWithToken(`${serverURL}profile-update`, formData)
                ]);
                login(response[0]?.data.data?.user)
                setMymessageProfileProfile(response[0].data.message);
                setsucessSnackBarOpenProfile(!sucessSnackBarOpenProfile);
                setMainLoder(false)
                window.location.reload()
            } else {
                setMainLoder(false)
                setMymessageProfileProfile("please fill out all required fields with user profile");
                setwarningSnackBarOpenProfile(!warningSnackBarOpenProfile);
            }

            // Additional actions after successful submission
        } catch (error) {
            setMainLoder(false)
            console.error('Error posting profile data:', error);
            // Handle error scenario
        }
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

    const getNotificationList = async () => {

        startAnimation()
        try {
            const res = await api.postWithToken(`${serverURL + "notification-manage"}`, {
                "action": "list",
                page: pageNotification
            })
            const updatedList = [...notificationList, ...res.data.data?.list].filter((product, index, self) => self.findIndex(p => p.id === product.id) === index);
            setNotificationList(updatedList)
            stopAnimation()
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const request1 = api.get(`${serverURL + "/country-list"}`);
                const request2 = api.get(`${serverURL + "/state-list"}`);
                const responses = await Promise.all([request1, request2]);
                setCountryList(responses[0].data.data.country);
                // setStateList(responses[1].data.data.states);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
        getMyAddress()
        getUserProfile()
        getOrderList()
        // getWishList()
    }, [isLoggedIn]);


    useEffect(() => {
        startAnimation()
        const start = 0; // Always start from the beginning
        const end = page * itemsPerPage; // End at the last item of current page
        setDisplayedOrders(orderList.userOrderItems?.slice(start, end));
        stopAnimation()

    }, [page, orderList]);

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

    useEffect(() => {
        getNotificationList()
    }, [pageNotification]);


    useEffect(() => {
        checkforcounty();
    }, [values.country_id]);


    const defaultCountry = countryList.find(country => country._id === values.country_id);
    const defaultState = stateList.find(state => state._id === values.state_id);

    return (
        <>
            <h1 className='d-none'></h1>
            <SucessSnackBar
                open={sucessSnackBarOpenProfile}
                setOpen={setsucessSnackBarOpenProfile}
                text={MymessageProfile}
                type="success"
            />

            <ErrorSnackBar
                open={warningSnackBarOpenProfile}
                setOpen={setwarningSnackBarOpenProfile}
                text={MymessageProfile}
                type="error"
            />

            {/* <SucessSnackBar
                open={sucessSnackBarOpen &&  sucessSnackBarOpen}
                setOpen={setsucessSnackBarOpen && setsucessSnackBarOpen}
                text={Mymessage && Mymessage}
                type="success"
            />

            <ErrorSnackBar
                open={warningSnackBarOpen && warningSnackBarOpen}
                setOpen={setwarningSnackBarOpen && setwarningSnackBarOpen}
                text={ Mymessage && Mymessage}
                type="error"
            /> */}
            
            <div className='profile pb-5'>

                <div className='container-cos'>
                    <div className='page-path d-flex align-items-center gap-1'>
                        <div className='d-flex align-items-center gap-1'>
                            <NavLink>Home</NavLink>
                            <MdOutlineKeyboardArrowRight />
                        </div>
                        <NavLink className='active'>Profile</NavLink>
                    </div>

                    <div className='mt-4 profile-tabs'>
                        <Tab.Container id="left-tabs-example" activeKey={profileOption || "user"} onSelect={key => setProfileOption(key)}>

                            <Row>
                                <Col xl={3} lg={4} md={6}>
                                    <Nav variant="pills" className="flex-column sticky-filter">
                                        <Nav.Item>
                                            <Nav.Link eventKey="list" onClick={() => setItemShow(true)}>
                                                <img src='./img/header/list.png' alt='' />
                                                My orders
                                            </Nav.Link>
                                        </Nav.Item>
                                        {/* <Nav.Item>
                                            <Nav.Link eventKey="review" onClick={() => setItemShow(false)}>
                                                <img src='./img/header/review.png' alt='' />
                                                Your reviews
                                            </Nav.Link>
                                        </Nav.Item> */}
                                        <Nav.Item>
                                            <Nav.Link eventKey="user" onClick={() => setItemShow(false)}>
                                                <img src='./img/header/user.png' alt='' />
                                                Your profile
                                            </Nav.Link>
                                        </Nav.Item>
                                        {/* <Nav.Item>
                                            <Nav.Link eventKey="offer" onClick={() => setItemShow(false)}>
                                                <img src='./img/header/offer.png' alt='' />
                                                Coupon & offers
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="balance" onClick={() => setItemShow(true)}>
                                                <img src='./img/header/balance.png' alt='' />
                                                Credit balance
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="shop" onClick={() => setItemShow(true)}>
                                                <img src='./img/header/shop.png' alt='' />
                                                Followed shops
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="time" onClick={() => setItemShow(false)}>
                                                <img src='./img/header/time.png' alt='' />
                                                Browsing history
                                            </Nav.Link>
                                        </Nav.Item> */}
                                        <Nav.Item>
                                            <Nav.Link eventKey="location" onClick={() => setItemShow(false)}>
                                                <img src='./img/header/location.png' alt='' />
                                                Addresses
                                            </Nav.Link>
                                        </Nav.Item>
                                        {/* <Nav.Item>
                                            <Nav.Link eventKey="network" onClick={() => setItemShow(false)}>
                                                <img src='./img/header/network.png' alt='' />
                                                Country/Region & Language
                                            </Nav.Link>
                                        </Nav.Item> */}
                                        {/* <Nav.Item>
                                            <Nav.Link eventKey="wallet" onClick={() => setItemShow(false)}>
                                                <img src='./img/header/wallet.png' alt='' />
                                                Your payment methods
                                            </Nav.Link>
                                        </Nav.Item> */}
                                        {/* <Nav.Item>
                                            <Nav.Link eventKey="security" onClick={() => setItemShow(false)}>
                                                <img src='./img/header/security.png' alt='' />
                                                Account security
                                            </Nav.Link>
                                        </Nav.Item> */}
                                        <Nav.Item>
                                            <Nav.Link eventKey="notification" onClick={() => setItemShow(false)}>
                                                <img src='./img/header/notification.png' alt='' />
                                                Notifications
                                            </Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Col>
                                {
                                    loading ? <Loader startAnimation={startAnimation} stopAnimation={stopAnimation} player={player} /> : (
                                        <>
                                            <Col xl={9} lg={8} md={6} className='mt-5 mt-md-0'>
                                                <Tab.Content>
                                                    <Tab.Pane eventKey="list">
                                                        <div className='order-list position-relative'>

                                                            {/* <div className='search-order d-flex align-items-center gap-2'>
                                                    <img src='./img/header/search-icone.png' alt='' />
                                                    <input type="text" placeholder="Item name / Order ID / Tracking No." class="w-100" spellcheck="false" data-ms-editor="true" />
                                                </div> */}

                                                            <div className='order-table'>
                                                                <Table bordered responsive>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Products</th>
                                                                            <th>Quantity</th>
                                                                            <th>Amount</th>
                                                                            <th>Shipping To</th>
                                                                            <th>Status</th>
                                                                            <th>Action</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>



                                                                        {displayedOrders && displayedOrders.map((e, i) => {
                                                                            return (

                                                                                <>
                                                                                    {e.product_id &&
                                                                                        <tr className=' pointer' onClick={() => handelProductDetail(e.product_id?._id)}>
                                                                                            <td width={400}>
                                                                                                <div className='d-flex align-items-start gap-2'>
                                                                                                    <img src={orderList.productImagePath + e.product_id?._id + "/" + e.product_id?.product_images[0]?.file_name}
                                                                                                        width="80px" />
                                                                                                    <div className='pro-text'>
                                                                                                        <h6>{e.product_id?.name} </h6>
                                                                                                        <span>ID: # {e.order_id.order_display_id}</span>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </td>
                                                                                            <td><p>{e.qty}</p></td>
                                                                                            <td><p>${e.product_total_price}</p></td>
                                                                                            <td>
                                                                                                <p> {e.order_id.shipping_address_object.address},{e.order_id.shipping_address_object.city},{e.order_id.shipping_address_object.zipcode}</p>
                                                                                                <p>{e.order_id.shipping_address_object.contact_no}</p>
                                                                                            </td>
                                                                                            <td>
                                                                                                {(e.order_status == 0) && <Badge bg="danger">Incomplete</Badge>}
                                                                                                {(e.order_status == 1) && <Badge bg="success"> Success</Badge>}
                                                                                                {(e.order_status == 2) && <Badge bg="info"> Shipping</Badge>}
                                                                                                {(e.order_status == 3) && <Badge bg="success"> Delivered</Badge>}
                                                                                                {(e.order_status == 4) && <Badge bg="danger"> Cancelled</Badge>}
                                                                                            </td>
                                                                                            <td>
                                                                                                <Button className='submit-btn mt-0 d-flex align-items-center mx-auto' style={{
                                                                                                    fontSize: "15px",
                                                                                                    padding: "10px"
                                                                                                }}>cancel</Button>
                                                                                            </td>
                                                                                        </tr >
                                                                                    }
                                                                                </>
                                                                            )
                                                                        })}

                                                                        {displayedOrders?.length === 0 &&
                                                                            <tr>
                                                                                <td colSpan="5">
                                                                                    {/* <div className='d-flex align-items-center justify-content-center h-100 '> */}
                                                                                    <div className='text-center found'>
                                                                                        {/* <img src='../img/not-found.png' alt='' className='my-20 ' /> */}
                                                                                        <p className='my-2' style={{ color: "#E02E24" }}>No orders available. Make your first order now</p>
                                                                                        {/* <Button className='mt-3 submit-btn' type='button' onClick={() => navigate("/trending")}  >Shop Now</Button> */}
                                                                                    </div>
                                                                                    {/* </div> */}
                                                                                </td>
                                                                            </tr>

                                                                        }

                                                                    </tbody>

                                                                </Table>
                                                                {displayedOrders?.length > 0 && displayedOrders?.length !== is_lastItem &&
                                                                    <div className='w-100 d-flex justify-content-center'>
                                                                        <Button className='shop-btn btn-cos-mobile' onClick={() => (setPage(page + 1), setViewmoreLoder(true))} > View More <MdKeyboardDoubleArrowRight /></Button>
                                                                    </div>
                                                                }
                                                            </div>

                                                            {/* <div className='error'>
                                                    <div className='d-flex justify-content-center py-5'>
                                                        <div className='text-center found'>
                                                            <img src='./img/not-found.png' alt='' />
                                                            <p className='mt-3'>You don’t have any orders</p>
                                                        </div>
                                                    </div>

                                                    <div className='find-your-order'>
                                                        <Row className='align-items-end'>
                                                            <Col lg={6} md={6} sm={12}>
                                                                <label className='mb-1'>Can’t find your order?</label>
                                                                <div className='order-input d-flex align-items-center gap-2'>
                                                                    <input placeholder='Try signing in with another account' className='w-100' />
                                                                    <img src='./img/profile/gfa.png' className='me-2' alt='' />
                                                                </div>
                                                            </Col>
                                                            <Col lg={6} md={6} sm={12} className='mt-3 mt-md-0'>
                                                                <div className='order-input d-flex align-items-center gap-2'>
                                                                    <input placeholder='Self-service to find order' className='w-100' />
                                                                    <img src='./img/profile/right-arrow.png' className='me-2' alt='' />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </div> */}

                                                            {/* <Tabs
                                                    defaultActiveKey="all-orders"
                                                    id="uncontrolled-tab-example"
                                                    className="mb-3"
                                                >
                                                    <Tab eventKey="all-orders" title="All orders">



                                                       
                                                    </Tab>
                                                    <Tab eventKey="processing" title="Processing">
                                                        <div className='d-flex justify-content-center py-5'>
                                                            <div className='text-center found'>
                                                                <img src='./img/not-found.png' alt='' />
                                                                <p className='mt-3'>You don’t have any Processing</p>
                                                            </div>
                                                        </div>
                                                    </Tab>
                                                    <Tab eventKey="Shipped" title="Shipped">
                                                        <div className='d-flex justify-content-center py-5'>
                                                            <div className='text-center found'>
                                                                <img src='./img/not-found.png' alt='' />
                                                                <p className='mt-3'>You don’t have any Shipped</p>
                                                            </div>
                                                        </div>
                                                    </Tab>
                                                    <Tab eventKey="Delivered" title="Delivered">
                                                        <div className='d-flex justify-content-center py-5'>
                                                            <div className='text-center found'>
                                                                <img src='./img/not-found.png' alt='' />
                                                                <p className='mt-3'>You don’t have any Delivered</p>
                                                            </div>
                                                        </div>
                                                    </Tab>
                                                    <Tab eventKey="Returns" title="Returns">
                                                        <div className='d-flex justify-content-center py-5'>
                                                            <div className='text-center found'>
                                                                <img src='./img/not-found.png' alt='' />
                                                                <p className='mt-3'>You don’t have any Returns</p>
                                                            </div>
                                                        </div>
                                                    </Tab>
                                                </Tabs> */}

                                                        </div>

                                                    </Tab.Pane>

                                                    {/* <Tab.Pane eventKey="review">
                                            <div className='d-flex align-items-center justify-content-center w-100 h-400'>
                                                <div className='text-center found'>
                                                    <img src='./img/profile/review.png' alt='' />
                                                    <p className='mt-3'>Review is empty</p>
                                                    <span>You have no completed reviews or the reviews have been deleted</span>
                                                </div>
                                            </div>
                                        </Tab.Pane> */}


                                                    <Tab.Pane eventKey="user">
                                                        {/* {
                                                loading ? <Loader startAnimation={startAnimation} stopAnimation={stopAnimation} player={player} /> : (
                                                    <> */}
                                                        <div className='user-main'>
                                                            <Row>
                                                                <Col xl={4} lg={6} md={12}>
                                                                    <div className='select-img'>
                                                                        <div className='preview position-relative'>
                                                                            <img src={imagePreview || values_2.profile_image}
                                                                                onError={(e) => { e.target.onerror = null; e.target.src = defaultProfile }}
                                                                                alt='' className=' preview_profile ' onClick={handleImageClick} />
                                                                            <input ref={inputFileRef} type="file" name='profile_image' onChange={handlePhoto} id='file' style={{ display: "none" }} />
                                                                            <label htmlFor='file' className='file-label'>
                                                                                <img src='./img/profile/select-btn.png' alt='' />
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <Form>
                                                                        <div className='input-filed mt-4'>
                                                                            <label>First Name</label>
                                                                            <input type='text'
                                                                                name='first_name'
                                                                                value={values_2.first_name}
                                                                                onChange={handleChange_2}
                                                                            />
                                                                        </div>

                                                                        <div className='input-filed mt-4'>
                                                                            <label>Last Name</label>
                                                                            <input type='text'
                                                                                name='last_name'
                                                                                value={values_2.last_name}
                                                                                onChange={handleChange_2}
                                                                            />
                                                                        </div>

                                                                        <div className='input-filed mt-3'>
                                                                            <label>Bio</label>
                                                                            <textarea type='text' placeholder='Tell people a little about yourself'
                                                                                name='bio'
                                                                                value={values_2.bio}
                                                                                onChange={handleChange_2}
                                                                                rows={3} />
                                                                        </div>
                                                                        <div className='input-filed mt-3'>
                                                                            <label>Gender</label>
                                                                            <div className='d-flex align-items-center gap-4 w-fit mt-2 gap-mobile'>
                                                                                <div className='d-flex align-items-center gap-2 w-fit gender'>
                                                                                    <input type='radio'
                                                                                        name='gender'
                                                                                        checked={values_2.gender === 'Female'}
                                                                                        value="Female"
                                                                                        onChange={handleChange_2}
                                                                                        id='female' />
                                                                                    <label htmlFor='female'>Female</label>
                                                                                </div>
                                                                                <div className='d-flex align-items-center gap-2 w-fit gender'>
                                                                                    <input type='radio' id='male'
                                                                                        name='gender'
                                                                                        value="Male"
                                                                                        checked={values_2.gender === 'Male'}
                                                                                        onChange={handleChange_2}
                                                                                    />
                                                                                    <label htmlFor='male'>Male</label>
                                                                                </div>
                                                                                <div className='d-flex align-items-center gap-2 w-fit gender'>
                                                                                    <input type='radio' id='other'
                                                                                        name='gender'
                                                                                        value="Other"
                                                                                        checked={values_2.gender === 'Other'}
                                                                                        onChange={handleChange_2}
                                                                                    />
                                                                                    <label htmlFor='other'>Rather not say</label>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <Button type='button' onClick={submitProfile} className='save-btn'>Save</Button>
                                                                    </Form>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                        {/* </>
                                                )} */}
                                                    </Tab.Pane>

                                                    {/* <Tab.Pane eventKey="shop">
                                            <div className='d-flex align-items-center justify-content-center w-100 h-400'>
                                                <div className='text-center found'>
                                                    <img src='./img/not-found.png' alt='' />
                                                    <p className='mt-3'>No followed shops yet</p>
                                                    <span>You get better recommendations as you follow more shops.</span>
                                                </div>
                                            </div>
                                        </Tab.Pane>

                                        <Tab.Pane eventKey="offer">
                                            <div className='order-list position-relative p-0'>

                                                <Tabs
                                                    defaultActiveKey="Unused"
                                                    id="uncontrolled-tab-example"
                                                    className="mb-3"
                                                >
                                                    <Tab eventKey="Unused" title="Unused">
                                                        <div className='px-3'>
                                                            <div className='offer-input d-flex align-items-center gap-3'>
                                                                <input type="text" placeholder="Enter coupon code" className="w-100 input-style" spellcheck="false" data-ms-editor="true" />
                                                                <Button className='apply-btn'>Apply</Button>
                                                            </div>
                                                            <div className='d-flex align-items-center justify-content-center w-100 mt-5 py-4'>
                                                                <div className='text-center found'>
                                                                    <img src='./img/profile/review.png' alt='' />
                                                                    <p className='mt-3'>No other coupons & offers</p>
                                                                    <span>There are no other & offers available</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Tab>
                                                    <Tab eventKey="Used" title="Used">
                                                        <div className='px-3'>
                                                            not found
                                                        </div>
                                                    </Tab>
                                                    <Tab eventKey="Expired" title="Expired">
                                                        <div className='px-3'>
                                                            not found
                                                        </div>
                                                    </Tab>
                                                </Tabs>

                                            </div>
                                        </Tab.Pane>

                                        <Tab.Pane eventKey="balance">
                                            <div className='balance-main'>
                                                <h5>
                                                    Credit balance
                                                    <img src='./img/profile/alert.png' className='ms-2' alt='' />
                                                </h5>
                                                <div className='total-usd mt-3 pb-3'>
                                                    <label>Total (USD):</label>
                                                    <h3 className='mt-2'>$0.00</h3>
                                                </div>

                                                <div className='history-table mt-4'>
                                                    <p>History</p>
                                                    <Table responsive className='mt-2'>
                                                        <thead>
                                                            <tr>
                                                                <th>Date</th>
                                                                <th>Description</th>
                                                                <th>Amount</th>
                                                                <th>Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                        </tbody>
                                                    </Table>
                                                    <div className='d-flex justify-content-center py-5 mt-5'>
                                                        <div className='text-center found'>
                                                            <img src='./img/not-found.png' alt='' />
                                                            <p className='mt-3'>You don’t have any orders</p>
                                                        </div>
                                                    </div>
                                                    <div className='find-your-order'>
                                                        <Row className='align-items-end'>
                                                            <Col lg={6} md={6} sm={12}>
                                                                <label className='mb-1'>Can’t find your order?</label>
                                                                <div className='order-input d-flex align-items-center gap-2'>
                                                                    <input placeholder='Try signing in with another account' className='w-100' />
                                                                    <img src='./img/profile/gfa.png' className='me-2' alt='' />
                                                                </div>
                                                            </Col>
                                                            <Col lg={6} md={6} sm={12} className='mt-3 mt-md-0'>
                                                                <div className='order-input d-flex align-items-center gap-2'>
                                                                    <input placeholder='Self-service to find order' className='w-100' />
                                                                    <img src='./img/profile/right-arrow.png' className='me-2' alt='' />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </div>
                                            </div>
                                        </Tab.Pane> */}

                                                    <Tab.Pane eventKey="location">

                                                        {/* {
                                                loading ? <Loader startAnimation={startAnimation} stopAnimation={stopAnimation} player={player} /> : (
                                                    <> */}
                                                        <div className='location-main'>
                                                            <Button onClick={() => handleShow("add")}>+ Add a new address</Button>


                                                            {myAddress?.length === 0 &&
                                                                <div className='d-flex align-items-center justify-content-center h-100 '>
                                                                    <div className='text-center found'>
                                                                        <img src='../img/not-found.png' alt='' className='my-20 ' />
                                                                        <p className='mt-3'>No addresses available. Please add a new address.</p>
                                                                        {/* <Button className='mt-3 submit-btn' type='button' onClick={() => handleShow("add")}  >Add address</Button> */}
                                                                    </div>
                                                                </div>
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
                                                        {/* </>
                                                )} */}
                                                    </Tab.Pane>


                                                    <Tab.Pane eventKey="security">
                                                        <div className='security-main'>
                                                            <div className='d-flex align-items-center justify-content-between pb-4 total-usd'>
                                                                <h5>Mobile phone number</h5>
                                                                <Button>Add</Button>
                                                            </div>
                                                            <div className='d-flex align-items-center justify-content-between pb-4 total-usd mt-4'>
                                                                <div>
                                                                    <h5>Email</h5>
                                                                    <p>rohan.vasundhara19@gmail.com</p>
                                                                </div>
                                                                <Button>Edit</Button>
                                                            </div>
                                                            <div className='d-flex align-items-center justify-content-between pb-4 total-usd mt-4'>
                                                                <h5>Password</h5>
                                                                <Button>Add</Button>
                                                            </div>

                                                            <div className='third-party mt-5'>
                                                                <h4>Third-party accounts</h4>
                                                                <div className='d-flex align-items-center justify-content-between pb-4 total-usd' style={{ marginTop: "30px" }}>
                                                                    <div className='d-flex align-items-center gap-3'>
                                                                        <img src='./img/profile/google.png' alt='' />
                                                                        <h5>Password</h5>
                                                                    </div>
                                                                    <Button className='linked'>Linked</Button>
                                                                </div>
                                                                <div className='d-flex align-items-center justify-content-between pb-4 total-usd mt-4'>
                                                                    <div className='d-flex align-items-center gap-3'>
                                                                        <img src='./img/profile/facebook.png' alt='' />
                                                                        <h5>Facebook</h5>
                                                                    </div>
                                                                    <Button>Link</Button>
                                                                </div>
                                                                {/* <div className='d-flex align-items-center justify-content-between pb-4 total-usd mt-4'>
                                                        <div className='d-flex align-items-center gap-3'>
                                                            <img src='./img/profile/twitter.png' alt='' />
                                                            <h5>Twitter</h5>
                                                        </div>
                                                        <Button>Link</Button>
                                                    </div> */}
                                                                <div className='d-flex align-items-center justify-content-between pb-4 total-usd mt-4'>
                                                                    <div className='d-flex align-items-center gap-3'>
                                                                        <img src='./img/profile/apple.png' alt='' />
                                                                        <h5>Apple</h5>
                                                                    </div>
                                                                    <Button>Link</Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Button className='delete-account'>Delete your Clubmall account <MdKeyboardArrowRight /></Button>
                                                    </Tab.Pane>


                                                    {/* {
                                            loading ? <Loader startAnimation={startAnimation} stopAnimation={stopAnimation} player={player} /> : (
                                                <> */}


                                                    <Tab.Pane eventKey="notification">
                                                        <div className='security-main'>
                                                            <Row>
                                                                <Col xl={12} lg={12} md={12}>


                                                                    {/* {notificationList} */}

                                                                    {notificationList?.length === 0 &&
                                                                        <div className='d-flex align-items-center justify-content-center h-100 '>
                                                                            <div className='text-center found'>
                                                                                <img src='../img/not-found.png' alt='' className='my-20 ' />
                                                                                <p className='mt-3'>No notifications are available.</p>
                                                                                {/* <Button className='mt-3 submit-btn' type='button' onClick={() => handleShow("add")}  >Add address</Button> */}
                                                                            </div>
                                                                        </div>
                                                                    }



                                                                    {notificationList && notificationList.map((e, i) => {
                                                                        return (

                                                                            <div key={i} className='list-not d-flex align-items-center justify-content-between pb-3 total-usd mt-4'>
                                                                                <div>
                                                                                    <h5>{e.message_sent_to.name}</h5>
                                                                                    <p>{e.message}</p>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    })}

                                                                    {/* <div className='list-not d-flex align-items-center justify-content-between pb-3 total-usd mt-4'>
                                                            <div>
                                                                <h5>Your recommendations</h5>
                                                                <p>On: Email  I  off: SMS</p>
                                                            </div>
                                                        </div> */}
                                                                </Col>

                                                                {/* {notificationList.length > 0 &&
                                                  <div className='w-100 d-flex justify-content-center'>
                                                  <Button className='shop-btn btn-cos-mobile' onClick={() => (setPageNotification(pageNotification + 1), setViewmoreLoder(true))} > View More <MdKeyboardDoubleArrowRight /></Button>
                                                  </div>
                                                  }   */}



                                                                {/* {displayedOrders?.length > 0 && displayedOrders?.length !== is_lastItem &&
                                                                <div className='w-100 d-flex justify-content-center'>
                                                                    <Button className='shop-btn btn-cos-mobile' onClick={() => (setPage(page + 1), setViewmoreLoder(true))} > View More <MdKeyboardDoubleArrowRight /></Button>
                                                                </div>
                                                    } */}
                                                                {/* <Col xl={4} lg={6} md={12} className='mt-4 mt-lg-0'>
                                                        <div className='receive'>
                                                            <h5>Receive SMS notifications</h5>
                                                            <p className='mt-2'>Message and data rates may apply. Message frequency varies. Text STOP to opt out and HELP for help. <NavLink>Terms of Use</NavLink> and <NavLink>Privacy & Cookie Policy</NavLink>.</p>

                                                            <div className='number d-flex align-items-center mt-3'>
                                                                <select>
                                                                    <option>US +1</option>
                                                                    <option>US +2</option>
                                                                    <option>US +3</option>
                                                                    <option>US +4</option>
                                                                </select>
                                                                <input placeholder='Enter your phone number' />
                                                            </div>
                                                            <Button className='submit-btn-receive mt-4'>Submit</Button>
                                                        </div>
                                                    </Col> */}

                                                            </Row>
                                                        </div>
                                                    </Tab.Pane>
                                                    {/* </>)} */}
                                                </Tab.Content>
                                            </Col>
                                        </>
                                    )}
                            </Row>
                        </Tab.Container>
                    </div>

                    {
                        itemShow && trendingProductList.productListArrObj?.length > 0 ?
                            <div className='recent-view product-info mt-5'>
                                <h4>Based on your recently viewed</h4>
                                <div className='mb-0 explore-main'>
                                    {
                                        trendingProductList?.productListArrObj?.slice(0, 5).map((e) => {
                                            return (

                                                <ProCard
                                                    id={e?._id}
                                                    img={e.product_images[0]?.file_name}
                                                    name={e?.name}
                                                    group_price={e.group_price}
                                                    individual_price={e.individual_price}
                                                    sold={e.total_order}
                                                    secper={e.secper}
                                                    off={e.discount_percentage}
                                                    path={trendingProductList?.productImagePath && trendingProductList.productImagePath}
                                                    is_wishList={e.wishList && e.wishList}
                                                />
                                            )
                                        })
                                    }
                                    {/* <div className='w-100 d-flex justify-content-center'>
                                        <Button className='shop-btn rotate-img'  >View More <MdKeyboardDoubleArrowRight /></Button>
                                    </div> */}
                                </div>
                            </div> : ""}

                </div>
            </div >

            <Modal show={show} onHide={handleClose} className='add-address' centered>
                <Modal.Body>
                    <div className='position-relative'>
                        <Button className='close-modal-btn forgot-pass-close' onClick={handleClose}>
                            <MdOutlineClose />
                        </Button>
                        <h5>Shipping address</h5>
                        <Form>
                            <Row className='mt-2'>
                                <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>Ship to Address</label>
                                        {/* <select name='country_id'
                                            value={values.country_id}
                                            onChange={handleChange}
                                            className='select-arrow'>
                                            <option value="" >Select Country</option>
                                            {(countryList.length <= 0) && <option
                                            >loding....</option>}
                                            {
                                                countryList.map((e, i) =>
                                                (
                                                    <option key={i} value={e?._id}  >{e?.name}</option>
                                                ))
                                            }
                                        </select> */}
                                        <Select
                                            name='country_id'
                                            className='rect-select-cos'
                                            value={defaultCountry && { value: defaultCountry._id, label: defaultCountry.name }}
                                            onChange={option => {
                                                handleChange({
                                                    target: {
                                                        name: 'country_id',
                                                        value: option.value,
                                                    },
                                                })
                                            }} // set selected value
                                            options={countryList?.map(country => ({ value: country._id, label: country.name }))}
                                        />
                                        <div className='error' >{errors?.country_id}</div>
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
                                <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>State</label>
                                        {/* <select
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

                                        </select> */}
                                        <Select
                                            className='rect-select-cos'
                                            name='state_id'
                                            value={defaultState && { value: defaultState._id, label: defaultState.name }}
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
                                        <div className='error' >{errors?.state_id}</div>
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

        </ >
    )
}

export default Profile