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
import { PRODUCTCATEGORY, ADDTOCART } from "../helper/endpoints";
import Loader from '../components/Loader';
import { handelCategorydata, errorResponse } from '../helper/constants';
import { CartContext } from '../context/CartContext'
import SucessSnackBar from "../components/SnackBar";
import ErrorSnackBar from "../components/SnackBar";
import { logout } from '../helper/auth'
import { useNavigate } from 'react-router-dom';

const Header = () => {

    const navigate = useNavigate();
    const { handelSearch, profileOption, setProfileOption, wishlistCount, cart, setCart } = useContext(CartContext);
    const isLoggedIn = Is_Login();
    const [selectedFlag, setSelectedFlag] = useState("./img/header/ind.svg");
    const [active, setActive] = useState(window.location.pathname);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [category, setcategory] = useState([]);
    const UserName = localStorage.getItem("name") ? localStorage.getItem("name") : "undefail"
    const defaultProfile = `./img/for_you/defaultuser.png`
    const Userprofile = localStorage.getItem("profile_image") ? localStorage.getItem("profile_image") : defaultProfile
    const [Mymessage, setMyMessage] = useState("");
    const [sucessSnackBarOpen, setSucessSnackBarOpen] = useState(false);
    const [warningSnackBarOpen, setWarningSnackBarOpen] = useState(false);
    const [search, setSearch] = useState("");

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
        // {console.log(e,"category list")}
        setCateData(product_data[name])
    }

    // // Update the cart count whenever the "cartCountData" changes
    // useEffect(() => {
    //     setcarteCount(catrecount);
    // }, [catrecount]);

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
        try {
            api.postWithToken(`${serverURL}logout`)
                .then((res) => {
                    if (res.data.success === true) {
                        console.log(res.data, "res.data");
                        setSucessSnackBarOpen(!sucessSnackBarOpen);
                        setMyMessage(res.data.message);
                        logout();
                        setTimeout(() => {
                            navigate("/login");
                        }, 1000);
                    } else if (res.data.success === false) {
                        setMyMessage(res.data.message);
                        setWarningSnackBarOpen(!warningSnackBarOpen);
                    }
                });
        } catch (error) {
            console.error(error);
        }
    };

    const getCategory = async () => {
        startAnimation()
        try {

            const categoryResponse = await api.post(`${serverURL + PRODUCTCATEGORY}`)
            const categoryData = categoryResponse.data.data;
            setcategory(categoryData);
            stopAnimation()

            const cartListresponse = await api.postWithToken(`${serverURL + ADDTOCART}`, { "action": "cart-list" })
            const cartCountData = cartListresponse.data.data.list
            setCart(cartCountData?.length)
        } catch (error) {
            console.log(error);
            errorResponse(error, setMyMessage);
        }
    };

    useEffect(() => {
        getCategory();
    }, []);

    // let handleKeyUp;

    // useEffect(() => {
    //     const delay = 100; // Adjust the delay (in milliseconds) as needed
    //     let timeoutId;

    //     handleKeyUp = () => {
    //         clearTimeout(timeoutId);
    //         timeoutId = setTimeout(() => {
    //             handelSearch(search);
    //             navigate("/search")
    //         }, delay);
    //     };

    //     return () => {
    //         clearTimeout(timeoutId);
    //     };
    // }, [search]);


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
                        <Link to="/home" className='py-0'><img src='./img/logo.png' alt='' /></Link>
                    </div>
                    <div className='menu-box h-100'>
                        <ul className='h-100'>
                            <li>
                                <Link to="/" className={`${active === "/" ? "active" : ""} `} onClick={() => setActive("/")}>For You</Link>
                            </li>

                            <li>
                                <Link to="/home" className={`${active === "/home" ? "active" : ""} `} onClick={() => setActive("/home")}>Home</Link>
                            </li>

                            <li>
                                <Button onClick={handleNewInShow}>New In</Button>
                            </li>

                            <li>
                                <Link to="/fashion" className={`${active === "/fashion" ? "active" : ""} `} onClick={() => setActive("/fashion")}>Fashion</Link>
                            </li>
                            <li>
                                <Link to="/selling" className={`${active === "/selling" ? "active" : ""} `} onClick={() => setActive("/selling")}>Hot Selling</Link>
                            </li>
                            <li>
                                <Link to="/trending" className={`${active === "/trending" ? "active" : ""} `} onClick={() => setActive("/trending")}>Trending</Link>
                            </li>
                            <li>
                                <Link className={`${active === "/categories" ? "active" : ""} `} >Categories <MdOutlineKeyboardArrowDown /></Link>
                                {/* names of the main categorys */}
                                <div className='mega-menu'>

                                    <Row>
                                        <Col lg={3} md={6}>
                                            <div className='border-right-cos pe-4 h-100'>
                                                <ul>

                                                    {category && category?.productsCategory?.map((e, i) => {
                                                        return (

                                                            <li key={i} onMouseOver={() => HandelShowData(e.name, e)}>

                                                                <p>{e.name}</p>
                                                                <img src='./img/header/mega-menu-arrow.png' alt='' />
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
                                                        <div className='mega-product'>
                                                            {category && category?.productsCategory?.map((e, i) => {
                                                                return (
                                                                    <div className='product_image pointer' onClick={() => handelCategorydata(e._id)} key={i}>

                                                                        <div className='product-box'>
                                                                            <img width="100%" src={category.productImagePath + e.product_icon} alt='' />
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
                                    <img src='./img//header/pri-label.png' alt='' />
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
                                    <img src='./img/header/free.png' alt='' />
                                    <div className='price-text text-start'>
                                        <h6>Free Return</h6>
                                        <span>Within a 20 days</span>
                                    </div>
                                </div>
                            </Button>
                        </NavLink>
                        {
                            isLoggedIn &&
                            <div className='search-filed d-flex align-items-center gap-2'>
                                <img src='./img/header/search-icone.png' alt='' />
                                <input type='text' onChange={(e) => setSearch(e.target.value)}
                                    // onKeyUp={handleKeyUp}
                                    placeholder='Search Product' className='w-100' />
                                {/* <Button className='shop-btn mt-0 mt-3' onClick={() => (handelSearch(search),navigate("/search"))}>Search</Button> */}
                            </div>
                        }
                    </div>
                    <div className='account d-flex align-items-center gap-3 gap-sm-4'>

                        {
                            isLoggedIn ?
                                <>
                                    {/* <Dropdown>
                                        <Dropdown.Toggle id="dropdown-basic">
                                            <NavLink className='flag-selector'>
                                                <Button className='pre-label-btn user-account p-0 '>
                                                    <img src={selectedFlag} alt='' width="26px" height="26px" />
                                                </Button>
                                            </NavLink>
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className='select-country'>
                                            <h5>Change country / region</h5>

                                            {
                                                countryData.map((event, i) => {
                                                    return (
                                                        <Dropdown.Item href="#/action-1" className='mt-2'>
                                                            <div className='d-flex align-items-center justify-content-between w-100'>
                                                                <label htmlFor={event.id} className='d-flex align-items-center gap-3' onClick={() => setSelectedFlag(event.flag)}>
                                                                    <img src={event.flag} alt='' width="20px" height="20px" />
                                                                    {event.name}</label>
                                                                <input type='radio' id={event.id} name='country' />
                                                            </div>
                                                        </Dropdown.Item>
                                                    )
                                                })
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown> */}

                                    <Dropdown className='order-lg-1 order-4'>
                                        <Dropdown.Toggle id="dropdown-basic" className='p-0'>
                                            <NavLink className='py-0'>
                                                <Button className='pre-label-btn user-account'>
                                                    <div className='d-flex align-items-center gap-2'>
                                                        <img className='myprofile' src={Userprofile} alt='' />
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
                                                    <img className='myprofile' src={Userprofile} alt='' />
                                                    <h6>Hello, {UserName}</h6>
                                                </div>
                                            </div>
                                            <Dropdown.Divider />
                                            <Dropdown.Item onClick={() => setProfileOption("list")} >
                                                <Link to="/profile" className='p-0'>
                                                    <img src='./img/header/list.png' alt='' />
                                                    My orders
                                                </Link>
                                            </Dropdown.Item>
                                            {/* <Dropdown.Item href="#/action-1">
                                                <img src='./img/header/review.png' alt='' />
                                                Your reviews
                                            </Dropdown.Item> */}
                                            <Dropdown.Item onClick={() => setProfileOption("user")}>
                                                <Link to="/profile" className='p-0'>
                                                    <img src='./img/header/user.png' alt='' />
                                                    Your profile
                                                </Link>
                                            </Dropdown.Item>
                                            {/* <Dropdown.Item href="#/action-1">
                                                <img src='./img/header/offer.png' alt='' />
                                                Coupon & offers
                                            </Dropdown.Item>
                                            <Dropdown.Item href="#/action-1">
                                                <img src='./img/header/balance.png' alt='' />
                                                Credit balance
                                            </Dropdown.Item>
                                            <Dropdown.Item href="#/action-1">
                                                <img src='./img/header/shop.png' alt='' />
                                                Followed shops
                                            </Dropdown.Item> */}
                                            <Dropdown.Item onClick={() => setProfileOption("location")}>
                                                <Link to="/profile" className='p-0'>
                                                    <img src='./img/header/location.png' alt='' />
                                                    Addresses
                                                </Link>
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => setProfileOption("security")}>
                                                <Link to="/profile" className='p-0'>
                                                    <img src='./img/header/security.png' alt='' />
                                                    Account security
                                                </Link>
                                            </Dropdown.Item>
                                            <Dropdown.Item className='pb-3' onClick={() => setProfileOption("notification")}>
                                                <Link to="/profile" className='p-0'>
                                                    <img src='./img/header/notification.png' alt='' />
                                                    Notifications
                                                </Link>
                                            </Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item >
                                                <img src='./img/header/switch.png' alt='' />
                                                Switch accounts
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={handleLogout} >
                                                <img src='./img/header/logout.png' alt='' />
                                                Sign out
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>

                                    <Link to="/wishlist" className='cart position-relative flag-selector order-2'>
                                        <img src='./img/header/wishlist.png' className='header-icon' alt='' width="25px" />
                                        <span className='cart-items-count'>{wishlistCount}</span>
                                    </Link>

                                    <Link to="/cart" className='cart position-relative flag-selector order-3'>
                                        <img src='./img/header/cart.png' className='header-icon' alt='' width="25px" />
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
                                    <Link to="/" className={`${active === "/" ? "active" : ""} `} onClick={() => setActive("/")}>For You</Link>
                                </li>
                                <li>
                                    <Link to="/home" className={`${active === "/home" ? "active" : ""} `} onClick={() => setActive("/home")}>Home</Link>
                                </li>
                                <li>
                                    <Button onClick={() => {
                                        handleClose();
                                        handleNewInShow();
                                    }} className='new-in-btn'>New In</Button>
                                </li>
                                <li>
                                    <Link to="/fashion" className={`${active === "/fashion" ? "active" : ""} `} onClick={() => setActive("/fashion")}>Fashion</Link>
                                </li>
                                <li>
                                    <Link to="/selling" className={`${active === "/selling" ? "active" : ""} `} onClick={() => setActive("/selling")}>Hot Selling</Link>
                                </li>
                                <li>
                                    <Link to="/trending" className={`${active === "/trending" ? "active" : ""} `} onClick={() => setActive("/trending")}>Trending</Link>
                                </li>
                                <li className='position-relative show-body-menu'>
                                    <Link className={`${active === "/categories" ? "active" : ""} `} >
                                        Categories
                                    </Link>
                                    <Accordion>
                                        <Card>
                                            <CustomToggle eventKey="0"><MdOutlineKeyboardArrowDown /></CustomToggle>
                                            <Accordion.Collapse eventKey="0">
                                                <Card.Body>
                                                    <div className='h-100'>
                                                        <ul>
                                                            <li>
                                                                <p>Featured</p>
                                                                <img src='./img/header/mega-menu-arrow.png' alt='' />
                                                            </li>
                                                            <li>
                                                                <p>Women’s Clothing</p>
                                                                <img src='./img/header/mega-menu-arrow.png' alt='' />
                                                            </li>
                                                            <li>
                                                                <p>Home & Kitchen</p>
                                                                <img src='./img/header/mega-menu-arrow.png' alt='' />
                                                            </li>
                                                            <li>
                                                                <p>Women’s Curve + Plus</p>
                                                                <img src='./img/header/mega-menu-arrow.png' alt='' />
                                                            </li>
                                                            <li>
                                                                <p>Kid’s Fashion</p>
                                                                <img src='./img/header/mega-menu-arrow.png' alt='' />
                                                            </li>
                                                            <li>
                                                                <p>Men’s Clothing</p>
                                                                <img src='./img/header/mega-menu-arrow.png' alt='' />
                                                            </li>
                                                            <li>
                                                                <p>Beauty & Health</p>
                                                                <img src='./img/header/mega-menu-arrow.png' alt='' />
                                                            </li>
                                                            <li>
                                                                <p>Women’s Shoes</p>
                                                                <img src='./img/header/mega-menu-arrow.png' alt='' />
                                                            </li>
                                                            <li>
                                                                <p>Jewelary & Accessories</p>
                                                                <img src='./img/header/mega-menu-arrow.png' alt='' />
                                                            </li>
                                                            <li>
                                                                <p>Toys & Games</p>
                                                                <img src='./img/header/mega-menu-arrow.png' alt='' />
                                                            </li>
                                                            <li>
                                                                <p>Electronics</p>
                                                                <img src='./img/header/mega-menu-arrow.png' alt='' />
                                                            </li>
                                                            <li>
                                                                <p>Arts, Crafts & Sewing</p>
                                                                <img src='./img/header/mega-menu-arrow.png' alt='' />
                                                            </li>
                                                            <li>
                                                                <p>Patio, Lawn & Garden</p>
                                                                <img src='./img/header/mega-menu-arrow.png' alt='' />
                                                            </li>
                                                            <li>
                                                                <p>Automotive</p>
                                                                <img src='./img/header/mega-menu-arrow.png' alt='' />
                                                            </li>
                                                            <li>
                                                                <p>Bags & Luggage</p>
                                                                <img src='./img/header/mega-menu-arrow.png' alt='' />
                                                            </li>
                                                            <li>
                                                                <p>
                                                                    Women’s Underwear & Sleep
                                                                </p>
                                                                <img src='./img/header/mega-menu-arrow.png' alt='' />
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
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
                        {/* <div className='new-in-box1'>
                            <div className='sky-box position-relative'>
                                <img src='./img/new_in/sky1.png' width="100%" alt='' />
                                <div className='sky-text'>
                                    <h5>SXY <br />
                                        <span>STYLE</span></h5>
                                    <Link to="/categories">Shop Now</Link>
                                </div>
                            </div>
                            <div className='sky-box position-relative mt-2'>
                                <img src='./img/new_in/sky2.png' width="100%" alt='' />
                                <div className='sky-text'>
                                    <h5>SXY <br />
                                        <span>STYLE</span></h5>
                                    <Link to="/categories">Shop Now</Link>
                                </div>
                            </div>
                        </div> */}

                        <Row>
                            <Col lg={4} md={6} sm={12}>
                                <div className='new-in-box2'>
                                    <h5>NEW IN TODAY</h5>
                                    <ul>
                                        <li className='mt-3'>04/18/2023</li>
                                        <li>04/18/2023</li>
                                        <li>04/18/2023</li>
                                        <li>04/18/2023</li>
                                        <li>04/18/2023</li>
                                        <li>04/18/2023</li>
                                        <li>04/18/2023</li>
                                        <li>04/18/2023</li>
                                    </ul>

                                    {/* <div className='mt-4'>
                                <h5>OUTFIT INSPO</h5>
                                <NavLink>#sayodoinCLUBAMLL</NavLink>
                                <NavLink>#MakeHerDay</NavLink>
                            </div> */}
                                </div>
                            </Col>
                            <Col lg={4} md={6} sm={12} className='mt-3 mt-md-0'>
                                <div className='new-in-box3'>
                                    <h5>NEW IN WOMEN’S CLOTHING</h5>
                                    <ul>
                                        <li className='mt-3'><NavLink>Dresses</NavLink></li>
                                        <li><NavLink>Top</NavLink></li>
                                        <li><NavLink>Blouses</NavLink></li>
                                        <li><NavLink>Bottoms</NavLink></li>
                                        <li><NavLink>Two-pieces</NavLink></li>
                                        <li><NavLink>Denim</NavLink></li>
                                        <li><NavLink>Jumpsuits & Bodysuits</NavLink></li>
                                        <li><NavLink>Blazer & Suits</NavLink></li>
                                        <li><NavLink>Linerie & Loungewear</NavLink></li>
                                        <li><NavLink>Sweaters & Sweatshirts</NavLink></li>
                                        <li><NavLink>Outerwear</NavLink></li>
                                    </ul>
                                </div>
                            </Col>
                            <Col lg={4} md={6} sm={12} className='mt-3 mt-lg-0'>
                                <div className='new-in-box4'>
                                    <h5 className='mt-0'><NavLink>NEW IN BEACHWEAR</NavLink></h5>
                                    <h5><NavLink>NEW IN MATERNITY</NavLink></h5>
                                    <h5><NavLink>NEW IN ACTIVERWEAR</NavLink></h5>
                                    <h5><NavLink>NEW IN WEDDING</NavLink></h5>
                                    <h5><NavLink>NEW IN HOME</NavLink></h5>
                                    <h5><NavLink>NEW IN ACCESSORIES</NavLink></h5>
                                    <h5><NavLink>NEW IN SHOES</NavLink></h5>
                                    <h5><NavLink>NEW IN BAGS</NavLink></h5>
                                    <h5><NavLink>NEW IN JEWELARY</NavLink></h5>
                                    <h5><NavLink>NEW IN STATIONARY</NavLink></h5>
                                    <h5><NavLink>NEW IN ELECTRONICS</NavLink></h5>
                                    <h5><NavLink>NEW IN PETS</NavLink></h5>
                                    <h5><NavLink>NEW IN BEAUTY</NavLink></h5>
                                </div>
                            </Col>
                        </Row>






                        {/* <div className='new-in-box5'>
                            <h5 className='mt-0 text-red'><NavLink>MOTF</NavLink></h5>
                            <h5 className='text-red'><NavLink>ROMWE</NavLink></h5>
                            <h5><NavLink>EMERY ROSE</NavLink></h5>
                            <h5 className='text-red'><NavLink>LUVLETTE</NavLink></h5>
                            <h5><NavLink>DAZY</NavLink></h5>
                            <h5 className='text-red'><NavLink>DAZY LESS</NavLink></h5>
                            <h5><NavLink>PETSIN</NavLink></h5>
                            <h5><NavLink>CUCCOO</NavLink></h5>
                            <h5><NavLink>GLOWMODE</NavLink></h5>
                            <h5><NavLink>JMMO</NavLink></h5>
                        </div>
                        <div className='new-in-box6'>
                            <div className='new-in-last'>
                                <div className='sky-box position-relative m-2 mt-0 ms-0'>
                                    <img src='./img/new_in/sky3.png' width="100%" alt='' />
                                    <div className='sky-text'>
                                        <h5 className='text-white'>SXY <br />
                                            <span>STYLE</span></h5>
                                        <Link to="/categories">Shop Now</Link>
                                    </div>
                                </div>
                                <div className='sky-box position-relative'>
                                    <img src='./img/new_in/sky4.png' width="100%" alt='' />
                                    <div className='sky-text'>
                                        <h5>SXY <br />
                                            <span>STYLE</span></h5>
                                        <Link to="/categories">Shop Now</Link>
                                    </div>
                                </div>
                                <div className='sky-box position-relative m-2 mt-0 ms-0 top-cos'>
                                    <img src='./img/new_in/sky5.png' width="100%" alt='' />
                                    <div className='sky-text'>
                                        <h5>SXY <br />
                                            <span>STYLE</span></h5>
                                        <Link to="/categories">Shop Now</Link>
                                    </div>
                                </div>
                                <div className='sky-box position-relative'>
                                    <img src='./img/new_in/sky2.png' width="100%" alt='' />
                                    <div className='sky-text'>
                                        <h5>SXY <br />
                                            <span>STYLE</span></h5>
                                        <Link to="/categories">Shop Now</Link>
                                    </div>
                                </div>
                            </div>

                        </div> */}
                    </div>
                </Modal.Body>
            </Modal>

        </Fragment >
    )
}

export default Header
