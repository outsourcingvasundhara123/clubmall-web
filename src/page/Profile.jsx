import React, { useState, useEffect ,useContext} from 'react'
import Layout from '../layout/Layout'
import { Button, Col, Form, Modal, Nav, NavLink, Row, Tab, Table, Tabs, } from 'react-bootstrap'
import {
    MdOutlineKeyboardArrowRight,
    MdKeyboardDoubleArrowRight,
    MdKeyboardArrowRight,
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
import { CartContext } from '../context/CartContext';

const Profile = () => {

    const {myAddress, getMyAddress,userProductList, loading, setLoading, wishProductUrl, category, currentUser,
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
    const [itemShow, setItemShow] = useState(false);
    const [show, setShow] = useState(false);

    const handleClose = () =>{
        setErrors({})
        setShow(false);
        setValues(initialValues)
        setSubmitCount(0)
    } 
    const handleShow = () => setShow(true);

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

    const handleSubmit = (e) => {
        e.preventDefault();

        setSubmitCount(submitCount + 1)

        const updatedValues = { ...values }; // Create a copy of the values object

        const validationErrors = validate(updatedValues);
        setErrors(validationErrors);

        if (updatedValues.contact_no) {
            updatedValues.contact_no = "+" + updatedValues.contact_no;
        }

        if (updatedValues.first_name && updatedValues.last_name) {
            updatedValues.name = updatedValues.first_name + " " + updatedValues.last_name;
        }

        if (Object.keys(validationErrors).length === 0) {
            
            console.log(updatedValues, "updatedValues");

            try {
                api.postWithToken(`${serverURL}shipping-address-create`, updatedValues)
                    .then((res) => {
                        if (res.data.status === 1) {
                            setMyMessage(res.data.message);
                            setSucessSnackBarOpen(!sucessSnackBarOpen);
                            getMyAddress()
                            setTimeout(() => {
                                setValues(initialValues);
                                handleClose()
                            }, 1000);
                            // navigate("/login");
                            // console.log(updatedValues.email,"updatedValues");
                        } else {
                            setMyMessage(res.data.message);
                            setWarningSnackBarOpen(!warningSnackBarOpen);
                        }
                    });
            } catch (error) {
                setWarningSnackBarOpen(!warningSnackBarOpen);
                console.error(error);
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const request1 = api.get(`${serverURL + "/country-list"}`);
                const request2 = api.get(`${serverURL + "/state-list"}`);
                const responses = await Promise.all([request1, request2]);
                // console.log(responses[0].data.data.country, "responses[0].data.data.country");
                setCountryList(responses[0].data.data.country);
                // setStateList(responses[1].data.data.states);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
        getMyAddress()
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

    return (
        <Layout>
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
            <div className='profile pt-4 pb-5'>

                <div className='container-cos'>
                    <div className='page-path d-flex align-items-center gap-1'>
                        <div className='d-flex align-items-center gap-1'>
                            <NavLink>Home</NavLink>
                            <MdOutlineKeyboardArrowRight />
                        </div>
                        <NavLink className='active'>Profile</NavLink>
                    </div>


                    <div className='mt-4 profile-tabs'>
                        <Tab.Container id="left-tabs-example" defaultActiveKey="user">
                            <Row>
                                <Col xl={3} lg={4} md={6}>
                                    <Nav variant="pills" className="flex-column">
                                        <Nav.Item>
                                            <Nav.Link eventKey="list" onClick={() => setItemShow(true)}>
                                                <img src='./img/header/list.png' alt='' />
                                                Your orders
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
                                        <Nav.Item>
                                            <Nav.Link eventKey="security" onClick={() => setItemShow(false)}>
                                                <img src='./img/header/security.png' alt='' />
                                                Account security
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="notification" onClick={() => setItemShow(false)}>
                                                <img src='./img/header/notification.png' alt='' />
                                                Notifications
                                            </Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Col>

                                <Col xl={9} lg={8} md={6} className='mt-5 mt-md-0'>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="list">
                                            <div className='order-list position-relative'>
                                                <div className='search-order d-flex align-items-center gap-2'>
                                                    <img src='./img/header/search-icone.png' alt='' />
                                                    <input type="text" placeholder="Item name / Order ID / Tracking No." class="w-100" spellcheck="false" data-ms-editor="true" />
                                                </div>

                                                <Tabs
                                                    defaultActiveKey="all-orders"
                                                    id="uncontrolled-tab-example"
                                                    className="mb-3"
                                                >
                                                    <Tab eventKey="all-orders" title="All orders">
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
                                                </Tabs>

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
                                            <div className='user-main'>
                                                <Row>
                                                    <Col xl={4} lg={6} md={12}>
                                                        <div className='select-img'>
                                                            <div className='preview position-relative'>
                                                                <img src='./img/profile/selected-img.png' alt='' width="80px" />
                                                                <input type="file" id='file' />
                                                                <label htmlFor='file' className='file-label'>
                                                                    <img src='./img/profile/select-btn.png' alt='' />
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <Form>
                                                            <div className='input-filed mt-4'>
                                                                <label>Name</label>
                                                                <input type='text' />
                                                            </div>
                                                            <div className='input-filed mt-3'>
                                                                <label>Bio</label>
                                                                <textarea type='text' placeholder='Tell people a little about yourself' rows={3} />
                                                            </div>
                                                            <div className='input-filed mt-3'>
                                                                <label>Gender</label>
                                                                <div className='d-flex align-items-center gap-4 w-fit mt-2'>
                                                                    <div className='d-flex align-items-center gap-2 w-fit gender'>
                                                                        <input type='radio' name='gender' id='female' />
                                                                        <label htmlFor='female'>Female</label>
                                                                    </div>
                                                                    <div className='d-flex align-items-center gap-2 w-fit gender'>
                                                                        <input type='radio' name='gender' id='male' />
                                                                        <label htmlFor='male'>Male</label>
                                                                    </div>
                                                                    <div className='d-flex align-items-center gap-2 w-fit gender'>
                                                                        <input type='radio' name='gender' id='other' />
                                                                        <label htmlFor='other'>Rather not say</label>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <Button className='save-btn'>Save</Button>
                                                        </Form>
                                                    </Col>
                                                </Row>
                                            </div>
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
                                            <div className='location-main'>
                                                <Button onClick={handleShow}>+ Add a new address</Button>
                                             
                                                {myAddress &&  myAddress.map((e, i) => {
                                return (
                                    <div className='address-box mt-3'>
                                    <h5> {e.fullname}</h5>
                                    <p className='my-2'>{e.zipcode} , {e.address} <br />{e.state_id.name},{e.country_id.name},{e.contact_no} </p>
                                    <div className='d-flex align-items-center justify-content-between'>
                                        <div className='d-flex align-items-center check-options'>
                                            <input type='checkbox' id='add-select' checked={e.is_default == 1} />
                                            <label htmlFor='add-select'>Default</label>
                                        </div>
                                        <div className='copy-main'>
                                            {/* <Button>Copy</Button> */}
                                            {/* <span>I</span> */}
                                            <Button>Edit</Button>
                                            <span>I</span>
                                            <Button>Delete</Button>
                                        </div>
                                    </div>
                                </div>    
                                    )})} 
                                            
                                            </div>
                                               
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

                                        <Tab.Pane eventKey="notification">
                                            <div className='security-main'>
                                                <Row>
                                                    <Col xl={12} lg={12} md={12}>
                                                        <div className='list-not d-flex align-items-center justify-content-between pb-3 total-usd'>
                                                            <div>
                                                                <h5>Promotions</h5>
                                                                <p>On: Email  I  off: SMS</p>
                                                            </div>
                                                            {/* <Button>Edit</Button> */}
                                                        </div>
                                                        <div className='list-not d-flex align-items-center justify-content-between pb-3 total-usd mt-4'>
                                                            <div>
                                                                <h5>Order updates</h5>
                                                                <p>On: Email  I  off: SMS</p>
                                                            </div>
                                                            {/* <Button>Edit</Button> */}
                                                        </div>
                                                        <div className='list-not d-flex align-items-center justify-content-between pb-3 total-usd mt-4'>
                                                            <div>
                                                                <h5>Chat messages</h5>
                                                                <p>On: Email</p>
                                                            </div>
                                                            {/* <Button>Edit</Button> */}
                                                        </div>
                                                        <div className='list-not d-flex align-items-center justify-content-between pb-3 total-usd mt-4'>
                                                            <div>
                                                                <h5>Your recommendations</h5>
                                                                <p>On: Email  I  off: SMS</p>
                                                            </div>
                                                            {/* <Button>Edit</Button> */}
                                                        </div>
                                                    </Col>
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

                                    </Tab.Content>
                                </Col>
                            </Row>
                        </Tab.Container>
                    </div>

                    {
                        itemShow ?
                            <div className='recent-view product-info mt-5'>
                                <h4>Based on your recently viewed</h4>
                                <div className='mb-0 explore-main'>
                                    {
                                        data.slice(0, 10).map((e) => {
                                            return (
                                                <ProCard
                                                    img={e.img}
                                                    name={e.name}
                                                    per={e.per}
                                                    per2={e.per2}
                                                    sold={e.sold}
                                                    secper={e.secper}
                                                    off={e.off}
                                                />
                                            )
                                        })
                                    }
                                    <div className='w-100 d-flex justify-content-center'>
                                        <Button className='shop-btn rotate-img'  >View More <MdKeyboardDoubleArrowRight /></Button>
                                    </div>
                                </div>
                            </div> : <></>
                    }

                </div>
            </div>

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
                                            <select name='country_id'
                                            value={values.country}
                                            onChange={handleChange}
                                            className='select-arrow'>
                                            <option>Select Country</option>
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
                                        <select
                                            onClick={checkforcounty} onChange={handleChange}
                                            value={values.state}
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
                            <button className='submit-btn w-100 mt-3' type='button' onClick={handleSubmit} >Add Address</button>
                        </Form>
                    </div>
                </Modal.Body>
            </Modal>

        </Layout>
    )
}

export default Profile