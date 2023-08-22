import React, { useRef, Fragment, useState, useEffect, useContext } from 'react'
import { Accordion, Button, Card, Col, Dropdown, Modal, NavLink, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { MdOutlineKeyboardArrowDown, MdOutlineClose } from "react-icons/md"
import { HiOutlineMenuAlt1 } from 'react-icons/hi'
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import { product_data } from '../helper/constants'
import { Is_Login } from '../helper/IsLogin'
import api from "../helper/api";
import { getServerURL } from '../helper/envConfig';
import { PRODUCTCATEGORY } from "../helper/endpoints";
import Loader from '../components/Loader';
import { handelCategorydata } from '../helper/constants';
import { CartContext } from '../context/CartContext'
import SucessSnackBar from "../components/SnackBar";
import ErrorSnackBar from "../components/SnackBar";
import { logout } from '../helper/auth'
import { useNavigate } from 'react-router-dom';
import { BiSearch } from 'react-icons/bi'



const Header = (props) => {

    const navigate = useNavigate();
    const { getcartcount, getwishlistcount, setMainLoder, itemShow, setItemShow, getCartData, searchKeyWord, setSearchKeyWord, getSearchedProduct, handelSearch, profileOption, setProfileOption, wishlistCount, cart, setCart } = useContext(CartContext);
    const isLoggedIn = Is_Login();

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [category, setcategory] = useState([]);
    const UserName = localStorage.getItem("name") ? localStorage.getItem("name") : "undefail"
    const defaultProfile = `../img/for_you/defaultuser.png`
    const Userprofile = localStorage.getItem("profile_image") ? localStorage.getItem("profile_image") : defaultProfile
    const [Mymessage, setMyMessage] = useState("");
    const [sucessSnackBarOpen, setSucessSnackBarOpen] = useState(false);
    const [warningSnackBarOpen, setWarningSnackBarOpen] = useState(false);
    const [subCategory, setSubCategory] = useState([]);
    const [Url, setUrl] = useState("");
    const serverURL = getServerURL();
    const [loading, setLoading] = useState(true);
    const player = useRef();

    const startAnimation = () => {
        if (player.current) {
            player.current.play(); // Check if player.current is not null before accessing play()
        }
    };

    const stopAnimation = () => {
        setLoading(false);
    };

    const [newIn, setNewIn] = useState(false);
    const handleNewInClose = () => setNewIn(false);
    const handleNewInShow = () => setNewIn(true);
    const [CateData, setCateData] = useState(product_data.FeaturedData);

    const HandelShowData = (name, e) => {
        setSubCategory(e.child)
        setCateData(product_data[name])
    }

    const handleKeyUp = () => {

        if (!searchKeyWord) {
            setMyMessage("Please enter a keyword for the search");
            setWarningSnackBarOpen(!warningSnackBarOpen);
        } else {
            handelSearch(searchKeyWord)
            navigate("/search")
            getSearchedProduct()
        }

    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleKeyUp();
        }
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchKeyWord(value);
    };

    function CustomToggle({ children, eventKey }) {
        const decoratedOnClick = useAccordionButton(eventKey, () =>
            console.log('totally custom!'),
        );
        return (
            <button
                type="button"
                onClick={decoratedOnClick}
                className='show-menu'
            >
                {children}
            </button>
        );
    }

    const handleLogout = () => {

        setMainLoder(true)
        try {
            api.postWithToken(`${serverURL}logout`)
                .then((res) => {
                    if (res.data.success === true) {
                        setSucessSnackBarOpen(!sucessSnackBarOpen);
                        setMyMessage(res.data.message);
                        setTimeout(() => {
                            setMainLoder(false)
                            logout();
                            // navigate("/login");
                        }, 1000);
                    } else if (res.data.success === false) {
                        setMyMessage(res.data.message);
                        setWarningSnackBarOpen(!warningSnackBarOpen);
                    }
                    setMainLoder(false)
                });
        } catch (error) {
            setMainLoder(false)
            console.error(error);
        }
    };

    const getCategory = async () => {
        startAnimation()
        try {

            const categoryResponse = await api.post(`${serverURL + PRODUCTCATEGORY}`, { action: "sub-category" })
            const categoryData = categoryResponse.data.data;
            setUrl(categoryResponse.data.data.productImagePath)
            setSubCategory(categoryResponse.data.data?.productsCategoryList[0]?.child)
            setcategory(categoryData);
            stopAnimation()
            // const cartListresponse = await api.postWithToken(`${serverURL + ADDTOCART}`, { "action": "cart-list" })
            // const cartCountData = cartListresponse.data.data.list
            // setCart(cartCountData?.length)
        } catch (error) {
            console.log(error);
            // errorResponse(error, setMyMessage);
        }
    };

    const handelSubCat = (Id) => {
        localStorage.setItem("selectedSubcategories", Id);
        window.location.href = "/categories";
    };

    const handelProfile = (page) => {
        setProfileOption(page)
        navigate("/profile")
    };


    useEffect(() => {
        // getCategory();
        getCartData();
    }, []);


    const [animation, setAnimation] = useState('');
    const texts = ['Women Apparel', 'Underwear & Sleepwear', 'Kids', 'Sports & Outdoor', 'Men Clothing', 'Beauty & Health'];
    const intervalTime = 7000;

    useEffect(() => {
        const changeAnimation = () => {
            const randomIndex = Math.floor(Math.random() * texts.length);
            setAnimation(texts[randomIndex]);
        };

        const intervalId = setInterval(changeAnimation, intervalTime);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            getcartcount()
            getwishlistcount()
        }
    }, [isLoggedIn]);

    const today = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const dateList = Array.from({ length: 8 }, (_, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() + index);
        return date.toLocaleDateString('en-US', options);
    });

    return (
        <Fragment>

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
            <div className='header-main'>
                <div className='header d-flex align-items-center gap-5 position-relative'>
                    <div className='logo'>
                        <Link to="/home" className='py-0'><img src='../img/logo.svg' alt='' /></Link>
                    </div>
                    <div className='menu-box h-100'>
                        <ul className='h-100'>
                            <li>
                                <Link to="/" className={`${props.active === "/" ? "active" : ""} `} onClick={() => props.setActive("/")}>For You</Link>
                            </li>

                            <li>
                                <Link to="/home" className={`${props.active === "/home" ? "active" : ""} `} onClick={() => props.setActive("/home")}>Home</Link>
                            </li>

                            <li>
                                <Button onClick={handleNewInShow}>New In</Button>
                            </li>

                            <li>
                                <Link to="/fashion" className={`${props.active === "/fashion" ? "active" : ""} `} onClick={() => props.setActive("/fashion")}>Fashion</Link>
                            </li>
                            <li>
                                <Link to="/selling" className={`${props.active === "/selling" ? "active" : ""} `} onClick={() => props.setActive("/selling")}>Hot Selling</Link>
                            </li>
                            <li>
                                <Link to="/trending" className={`${props.active === "/trending" ? "active" : ""} `} onClick={() => props.setActive("/trending")}>Trending</Link>
                            </li>
                            <li>
                                <Link onMouseEnter={getCategory} className={`${props.active === "/categories" ? "active" : ""} `} >Categories <MdOutlineKeyboardArrowDown /></Link>
                                {/* names of the main categorys */}
                                <div className='mega-menu'>

                                    <Row>
                                        <Col lg={3} md={6}>
                                            <div className='border-right-cos pe-4 mega-menu-list'>
                                                <ul>
                                                    {category && category?.productsCategoryList?.map((e, i) => {
                                                        return (
                                                            <li key={i} onMouseOver={() => HandelShowData(e.name, e)}>
                                                                <p onClick={() => (handelCategorydata(e._id), localStorage.removeItem("selectedSubcategories"))} >{e.name}</p>
                                                                <img src='../img/header/mega-menu-arrow.png' alt='' />
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        </Col>
                                        {
                                            loading ? <Loader startAnimation={startAnimation} stopAnimation={stopAnimation} player={player} /> : (
                                                <>
                                                    <Col lg={9} md={6}>
                                                        <div className='mega-product mega-menu-list'>
                                                            {subCategory && subCategory?.map((e, i) => {
                                                                return (
                                                                    <div className='product_image pointer' onClick={() => (handelSubCat(e._id), handelCategorydata(e.parent_id))} key={i}>

                                                                        <div className='product-box'>

                                                                            <img width="100%" src={Url + e.product_icon} alt='' />
                                                                        </div>
                                                                        <h6>{e.name}</h6>
                                                                    </div>
                                                                )
                                                            })
                                                            }
                                                        </div>
                                                    </Col>
                                                </>
                                            )}
                                    </Row>

                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className='search-main d-flex align-items-center gap-5 w-100'>
                        <NavLink>
                            <Button className='pre-label-btn'>
                                <div className='d-flex align-items-center gap-2'>
                                    <img src='../img//header/pri-label.png' alt='' />
                                    <div className='price-text text-start'>
                                        <h6>Price Adjustment</h6>
                                        <span>Within a 30 days</span>
                                    </div>
                                </div>
                            </Button>
                        </NavLink>
                        <NavLink>
                            <Button className='pre-label-btn'>
                                <div className='d-flex align-items-center gap-2'>
                                    <img src='../img/header/free.png' alt='' />
                                    <div className='price-text text-start'>
                                        <h6>Free Return</h6>
                                        <span>Within a 20 days</span>
                                    </div>
                                </div>
                            </Button>
                        </NavLink>
                        {/* {
                            isLoggedIn && */}
                        <div className='search-filed d-flex align-items-center gap-2'>
                            <input type="text" onKeyDown={handleKeyPress} placeholder={animation} className='w-100' onChange={handleChange} value={searchKeyWord} />
                            <Button onClick={handleKeyUp} type='button' className='search-icon-btn'><BiSearch /></Button>
                        </div>
                        {/* // } */}
                    </div>
                    <div className='account d-flex align-items-center gap-3 gap-sm-4'>
                        {
                            isLoggedIn ?
                                <>


                                    <Dropdown className='order-lg-1 order-4'>
                                        <Dropdown.Toggle id="dropdown-basic" className='p-0'>
                                            <NavLink className='py-0'>
                                                <Button className='pre-label-btn user-account' >
                                                    <div className='d-flex align-items-center gap-2'>
                                                        <img className='myprofile' src={Userprofile}
                                                            onError={(e) => { e.target.onerror = null; e.target.src = defaultProfile }}
                                                            alt='' />
                                                        <div className='price-text text-start'>
                                                            <h6>Hello, {UserName}</h6>
                                                            <span>Orders & Account</span>
                                                        </div>
                                                    </div>
                                                </Button>
                                            </NavLink>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <div className='drop-items'>
                                                <div className='d-flex align-items-center gap-2 border-bot-cos pb-2'>
                                                    <img className='myprofile' src={Userprofile}
                                                        onError={(e) => { e.target.onerror = null; e.target.src = defaultProfile }}
                                                        alt='' />
                                                    <h6>Hello, {UserName}</h6>
                                                </div>
                                            </div>
                                            <Dropdown.Divider />
                                            <Dropdown.Item onClick={() => (handelProfile("list"), setItemShow(true), props.setActive(false))} >
                                                <Link to="/profile" className='p-0 w-100'>
                                                    <img src='../img/header/list.png' alt='' />
                                                    My orders
                                                </Link>
                                            </Dropdown.Item>

                                            <Dropdown.Item onClick={() => (handelProfile("user"), setItemShow(false), props.setActive(false))}>
                                                <Link to="/profile" className='p-0 w-100'>
                                                    <img src='../img/header/user.png' alt='' />
                                                    Your profile
                                                </Link>
                                            </Dropdown.Item>

                                            <Dropdown.Item onClick={() => (handelProfile("location"), setItemShow(false), props.setActive(false))}>
                                                <Link to="/profile" className='p-0 w-100'>
                                                    <img src='../img/header/location.png' alt='' />
                                                    Addresses
                                                </Link>
                                            </Dropdown.Item>

                                            <Dropdown.Item className='pb-3' onClick={() => (handelProfile("notification"), setItemShow(false), props.setActive(false))}>
                                                <Link to="/profile" className='p-0 w-100'>
                                                    <img src='../img/header/notification.png' alt='' />
                                                    Notifications
                                                </Link>
                                            </Dropdown.Item>
                                            <Dropdown.Divider />

                                            <Dropdown.Item onClick={handleLogout} className='w-100'>
                                                <img src='../img/header/logout.png' alt='' />
                                                Sign out
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>

                                    <Link to="/wishlist" className='cart position-relative flag-selector order-2' onClick={() => props.setActive(false)}>
                                        <img src='../img/header/wishlist.png' className='header-icon' alt='' width="25px" />
                                        <span className='cart-items-count'>{wishlistCount}</span>
                                    </Link>

                                    <Link to="/cart" className='cart position-relative flag-selector order-3' onClick={() => props.setActive(false)}>
                                        <img src='../img/header/cart.png' className='header-icon' alt='' width="25px" />
                                        <span className='cart-items-count'>{cart && cart}</span>
                                    </Link>

                                </>
                                : <Link to="/login" className='login-btn'>Login</Link>
                        }
                        <Button className='toggle px-0 order-4' onClick={handleShow}>
                            <HiOutlineMenuAlt1 />
                        </Button>
                    </div>
                </div>
            </div>

            <Modal show={show} onHide={handleClose} className='mobile-menu'>
                <Modal.Body>
                    <div className='mobile-menu-body position-relative'>
                        <Button className='close-modal-btn' onClick={handleClose}>
                            <MdOutlineClose />
                        </Button>
                        <div className='menu-main'>
                            <ul className='h-100'>
                                <li>
                                    <Link to="/" className={`${props.active === "/" ? "active" : ""} `} onClick={() => { props.setActive("/"); handleClose() }}>For You</Link>
                                </li>
                                <li>
                                    <Link to="/home" className={`${props.active === "/home" ? "active" : ""} `} onClick={() => { props.setActive("/home"); handleClose() }}>Home</Link>
                                </li>
                                <li>
                                    <Button onClick={() => {
                                        handleClose();
                                        handleNewInShow();
                                    }} className='new-in-btn'>New In</Button>
                                </li>
                                <li>
                                    <Link to="/fashion" className={`${props.active === "/fashion" ? "active" : ""} `} onClick={() => { props.setActive("/fashion"); handleClose() }}>Fashion</Link>
                                </li>
                                <li>
                                    <Link to="/selling" className={`${props.active === "/selling" ? "active" : ""} `} onClick={() => { props.setActive("/selling"); handleClose() }}>Hot Selling</Link>
                                </li>
                                <li>
                                    <Link to="/trending" className={`${props.active === "/trending" ? "active" : ""} `} onClick={() => { props.setActive("/trending"); handleClose() }}>Trending</Link>
                                </li>
                                <li className='position-relative show-body-menu'>
                                    <Accordion defaultActiveKey="0">
                                        <Accordion.Item eventKey="1">
                                            <Accordion.Header>
                                                <Link onMouseEnter={getCategory} className={`${props.active === "/categories" ? "active" : ""} `}>
                                                    Categories
                                                </Link>
                                                <MdOutlineKeyboardArrowDown />
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <div className='h-100 sub-catagories'>
                                                    <Accordion defaultActiveKey="0">

                                                        {
                                                            loading ?
                                                                <Loader startAnimation={startAnimation} stopAnimation={stopAnimation} player={player} />
                                                                :
                                                                category && category?.productsCategoryList?.map((e, i) => (
                                                                    <Accordion.Item eventKey={i}>
                                                                        <Accordion.Header>
                                                                            <li onClick={() => HandelShowData(e.name, e)}>
                                                                                <p>{e.name}</p>
                                                                                <img src='../img/header/mega-menu-arrow.png' alt='' />
                                                                            </li>
                                                                        </Accordion.Header>

                                                                        <Accordion.Body>
                                                                            <div className='mobile-menu-cat-box d-flex align-items-center justify-content-center gap-3 flex-wrap'>
                                                                                {
                                                                                    subCategory && subCategory?.map((e, i) => (
                                                                                        <div key={i} className='cate-box text-center pointer' onClick={() => (handelSubCat(e._id), handelCategorydata(e.parent_id))}>
                                                                                            <div className='cat-img-round'>
                                                                                                <img src={Url + e.product_icon} alt='' width="100%" />
                                                                                            </div>
                                                                                            <h5 className='mt-3'>{e.name}</h5>
                                                                                        </div>
                                                                                    ))
                                                                                }
                                                                            </div>
                                                                        </Accordion.Body>
                                                                    </Accordion.Item>
                                                                ))}
                                                    </Accordion>
                                                </div>
                                            </Accordion.Body>
                                        </Accordion.Item>

                                    </Accordion>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal show={newIn} onHide={handleNewInClose} className='mobile-menu new_in_model ps-0'>
                <Modal.Body>
                    <div className='new-in-main position-relative pt-3'>
                        <Button className='close-modal-btn' onClick={handleNewInClose} style={{
                            top: " -4px",
                            right: "-21px"
                        }}>
                            <MdOutlineClose />
                        </Button>

                        <Row>
                            <Col lg={4} md={6} sm={12}>
                                <div className='new-in-box2'>
                                    <h5>NEW IN TODAY</h5>
                                    <ul>
                                        {dateList.map((date, index) => (
                                            <li key={index}>{date}</li>
                                        ))}
                                    </ul>
                                </div>
                            </Col>
                            <Col lg={6} md={6} sm={12} className='mt-3 mt-md-0'>
                                <div className='coming-soon h-100 w-100 d-flex align-items-center justify-content-center'>
                                    <h4>Coming soon</h4>
                                </div>
                            </Col>

                        </Row>
                    </div>
                </Modal.Body>
            </Modal>

        </Fragment>
    )
}

export default Header
