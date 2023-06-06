import React, { Fragment, useState, useEffect } from 'react'
import { Accordion, Button, Card, Col, Dropdown, Modal, NavLink, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { MdOutlineKeyboardArrowDown, MdOutlineClose } from "react-icons/md"
import { HiOutlineMenuAlt1 } from 'react-icons/hi'
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import { product_data } from '../helper/constants'
import { Is_Login } from '../helper/IsLogin'
const countryData = [
    {
        id: "india",
        name: "india",
        flag: "./img/header/ind.svg"
    },
    {
        id: "Canada",
        name: "Canada",
        flag: "./img/header/knd.svg"
    },
    {
        id: "NewZealand",
        name: "New Zealand",
        flag: "./img/header/nz.svg"
    },
    {
        id: "UnitedStates",
        name: "United States",
        flag: "./img/header/us.svg"
    },
]

const Header = () => {
    const isLoggedIn = Is_Login();
    const [selectedFlag, setSelectedFlag] = useState("./img/header/ind.svg");
    const [active, setActive] = useState(window.location.pathname);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [newIn, setNewIn] = useState(false);
    const handleNewInClose = () => setNewIn(false);
    const handleNewInShow = () => setNewIn(true);


    const [CateData, setCateData] = useState(product_data.FeaturedData);

    const HandelShowData = (name) => {
        setCateData(product_data[name])
    }

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


    return (
        <Fragment>
            <div className='header-main'>
                <div className='header d-flex align-items-center gap-5 position-relative'>
                    <div className='logo'>
                        <Link to="/home"><img src='./img/logo.png' alt='' /></Link>
                    </div>
                    <div className='menu-box h-100'>
                        <ul className='h-100'>
                            <li>
                                <Link to="/" className={`${active === "/" ? "active" : ""} `} onClick={() => setActive("/for-you")}>For You</Link>
                            </li>

                            <li>
                                <Link to="/home" className={`${active === "/home" ? "active" : ""} `} onClick={() => setActive("/home")}>Home</Link>
                            </li>

                            <li>
                                <Button onClick={handleNewInShow}>New In</Button>
                            </li>

                            <li>
                                <Link to="/fashion" className={`${active === "/fashion" ? "active" : ""} `} onClick={() => setActive("/")}>Fashion</Link>
                            </li>
                            <li>
                                <Link to="/selling" className={`${active === "/selling" ? "active" : ""} `} onClick={() => setActive("/selling")}>Hot Selling</Link>
                            </li>
                            <li>
                                <Link to="/trending" className={`${active === "/trending" ? "active" : ""} `} onClick={() => setActive("/trending")}>Trending</Link>
                            </li>
                            <li>
                                <Link to="/categories" className={`${active === "/categories" ? "active" : ""} `} onClick={() => setActive("/categories")}>Categories <MdOutlineKeyboardArrowDown /></Link>
                                <div className='mega-menu'>
                                    <Row>
                                        <Col lg={3} md={6}>
                                            <div className='border-right-cos pe-4 h-100'>
                                                <ul>
                                                    <li onMouseOver={() => HandelShowData("FeaturedData")}>
                                                        <p>Featured</p>
                                                        <img src='./img/header/mega-menu-arrow.png' alt='' />
                                                    </li>
                                                    <li onMouseOver={() => HandelShowData("WomenData")}>
                                                        <p>Women’s Clothing</p>
                                                        <img src='./img/header/mega-menu-arrow.png' alt='' />
                                                    </li>
                                                    <li onMouseOver={() => HandelShowData("HomeKitchen")}>
                                                        <p>Home & Kitchen</p>
                                                        <img src='./img/header/mega-menu-arrow.png' alt='' />
                                                    </li>
                                                    <li onMouseOver={() => HandelShowData("WomenCurve")}>
                                                        <p>Women’s Curve + Plus</p>
                                                        <img src='./img/header/mega-menu-arrow.png' alt='' />
                                                    </li>
                                                    <li onMouseOver={() => HandelShowData("KidFashion")}>
                                                        <p>Kid’s Fashion</p>
                                                        <img src='./img/header/mega-menu-arrow.png' alt='' />
                                                    </li>
                                                    <li onMouseOver={() => HandelShowData("MenClothing")}>
                                                        <p>Men’s Clothing</p>
                                                        <img src='./img/header/mega-menu-arrow.png' alt='' />
                                                    </li>
                                                    <li onMouseOver={() => HandelShowData("BeautyHealth")}>
                                                        <p>Beauty & Health</p>
                                                        <img src='./img/header/mega-menu-arrow.png' alt='' />
                                                    </li>
                                                    <li onMouseOver={() => HandelShowData("WomenShoes")}>
                                                        <p>Women’s Shoes</p>
                                                        <img src='./img/header/mega-menu-arrow.png' alt='' />
                                                    </li>
                                                    <li onMouseOver={() => HandelShowData("JewelaryAccessories")}>
                                                        <p>Jewelary & Accessories</p>
                                                        <img src='./img/header/mega-menu-arrow.png' alt='' />
                                                    </li>
                                                    <li onMouseOver={() => HandelShowData("ToysGames")}>
                                                        <p>Toys & Games</p>
                                                        <img src='./img/header/mega-menu-arrow.png' alt='' />
                                                    </li>
                                                    <li onMouseOver={() => HandelShowData("Electronics")}>
                                                        <p>Electronics</p>
                                                        <img src='./img/header/mega-menu-arrow.png' alt='' />
                                                    </li>
                                                    <li onMouseOver={() => HandelShowData("ArtsCraftsSewing")}>
                                                        <p>Arts, Crafts & Sewing</p>
                                                        <img src='./img/header/mega-menu-arrow.png' alt='' />
                                                    </li>
                                                    <li onMouseOver={() => HandelShowData("PatioLawnGarden")}>
                                                        <p>Patio, Lawn & Garden</p>
                                                        <img src='./img/header/mega-menu-arrow.png' alt='' />
                                                    </li>
                                                    <li onMouseOver={() => HandelShowData("Automotive")}>
                                                        <p>Automotive</p>
                                                        <img src='./img/header/mega-menu-arrow.png' alt='' />
                                                    </li>
                                                    <li onMouseOver={() => HandelShowData("BagsLuggage")}>
                                                        <p>Bags & Luggage</p>
                                                        <img src='./img/header/mega-menu-arrow.png' alt='' />
                                                    </li>
                                                    <li onMouseOver={() => HandelShowData("WomenUnderwearSleep")}>
                                                        <p>
                                                            Women’s Underwear & Sleep
                                                        </p>
                                                        <img src='./img/header/mega-menu-arrow.png' alt='' />
                                                    </li>
                                                </ul>
                                            </div>
                                        </Col>
                                        <Col lg={9} md={6}>
                                            <div className='mega-product'>
                                                {
                                                    CateData?.map((e, i) => {
                                                        return (
                                                            <div className='product-box' key={i}>
                                                                <img src={e.img} alt='' />
                                                                <h6>{e.name}</h6>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </Col>
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
                        <div className='search-filed d-flex align-items-center gap-2'>
                            <img src='./img/header/search-icone.png' alt='' />
                            <input type='text' placeholder='Search Product' className='w-100' />
                        </div>
                    </div>
                    <div className='account d-flex align-items-center gap-2'>

                        {
                            isLoggedIn ?
                                <>
                                    <Dropdown>
                                        <Dropdown.Toggle id="dropdown-basic">
                                            <NavLink>
                                                <Button className='pre-label-btn user-account'>
                                                    <div className='d-flex align-items-center gap-2'>
                                                        <img src='./img/header/user-pic.png' alt='' />
                                                        <div className='price-text text-start'>
                                                            <h6>Hello, Ali</h6>
                                                            <span>Orders & Account</span>
                                                        </div>
                                                    </div>
                                                </Button>
                                            </NavLink>
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <div className='drop-items'>
                                                <div className='d-flex align-items-center gap-2 border-bot-cos pb-2'>
                                                    <img src='./img/header/user-pic.png' alt='' />
                                                    <h6>Hello, Ali....</h6>
                                                </div>
                                            </div>
                                            <Dropdown.Divider />
                                            <Dropdown.Item href="#/action-1">
                                                <img src='./img/header/list.png' alt='' />
                                                Your orders
                                            </Dropdown.Item>
                                            <Dropdown.Item href="#/action-1">
                                                <img src='./img/header/review.png' alt='' />
                                                Your reviews
                                            </Dropdown.Item>
                                            <Dropdown.Item href="#/action-1">
                                                <Link to="/profile" className='p-0'>
                                                    <img src='./img/header/user.png' alt='' />
                                                    Your profile
                                                </Link>
                                            </Dropdown.Item>
                                            <Dropdown.Item href="#/action-1">
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
                                            </Dropdown.Item>
                                            <Dropdown.Item href="#/action-1">
                                                <img src='./img/header/location.png' alt='' />
                                                Addresses
                                            </Dropdown.Item>
                                            <Dropdown.Item href="#/action-1">
                                                <img src='./img/header/security.png' alt='' />
                                                Account security
                                            </Dropdown.Item>
                                            <Dropdown.Item href="#/action-1" className='pb-3'>
                                                <img src='./img/header/notification.png' alt='' />
                                                Notifications
                                            </Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item href="#/action-1">
                                                <img src='./img/header/switch.png' alt='' />
                                                Switch accounts
                                            </Dropdown.Item>
                                            <Dropdown.Item href="#/action-1">
                                                <img src='./img/header/logout.png' alt='' />
                                                Sign out
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>

                                    <Dropdown>
                                        {/* <Dropdown.Toggle id="dropdown-basic">
                                            <NavLink className='flag-selector'>
                                                <Button className='pre-label-btn user-account p-0 '>
                                                    <img src={selectedFlag} alt='' width="26px" height="26px" />
                                                </Button>
                                            </NavLink>
                                        </Dropdown.Toggle> */}

                                        {/* <Dropdown.Menu className='select-country'>
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
                                        </Dropdown.Menu> */}
                                    </Dropdown>

                                    <Link to="/cart" className='cart flag-selector' >
                                        <img src='./img/header/cart.png' alt='' />
                                    </Link>
                                    <Button className='toggle ' onClick={handleShow}>
                                        <HiOutlineMenuAlt1 />
                                    </Button>
                                </>
                                : <Link to="/login" className='login-btn'>Login</Link>
                        }


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
                                    <Link to="/" className={`${active === "/" ? "active" : ""} `} onClick={() => setActive("/for-you")}>For You</Link>
                                </li>
                                <li>
                                    <Button onClick={() => {
                                        handleClose();
                                        handleNewInShow();
                                    }} className='new-in-btn'>New In</Button>
                                </li>
                                <li>
                                    <Link to="/home" className={`${active === "/home" ? "active" : ""} `} onClick={() => setActive("/home")}>Home</Link>
                                </li>
                                <li>
                                    <Link to="/fashion" className={`${active === "/fashion" ? "active" : ""} `} onClick={() => setActive("/")}>Fashion</Link>
                                </li>
                                <li>
                                    <Link to="/selling" className={`${active === "/selling" ? "active" : ""} `} onClick={() => setActive("/selling")}>Hot Selling</Link>
                                </li>
                                <li>
                                    <Link to="/trending" className={`${active === "/trending" ? "active" : ""} `} onClick={() => setActive("/trending")}>Trending</Link>
                                </li>
                                <li className='position-relative show-body-menu'>
                                    <Link to="/categories" className={`${active === "/categories" ? "active" : ""} `} onClick={() => setActive("/categories")}>
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

            <Modal show={newIn} onHide={handleNewInClose} className='mobile-menu new_in_model'>
                <Modal.Body>
                    <div className='new-in-main position-relative pt-3'>
                        <Button className='close-modal-btn' onClick={handleNewInClose} style={{
                            top: " -4px",
                            right: "-21px"
                        }}>
                            <MdOutlineClose />
                        </Button>
                        <div className='new-in-box1'>
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
                        </div>
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

                            <div className='mt-4'>
                                <h5>OUTFIT INSPO</h5>
                                <NavLink>#sayodoinCLUBAMLL</NavLink>
                                <NavLink>#MakeHerDay</NavLink>
                            </div>
                        </div>
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
                        <div className='new-in-box5'>
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

                        </div>
                    </div>
                </Modal.Body>
            </Modal>

        </Fragment>
    )
}

export default Header
