import React, { useState } from 'react'
import Layout from '../layout/Layout'
import { Button, Col, Modal, NavLink, Offcanvas, Row } from 'react-bootstrap'
import {
    MdOutlineKeyboardArrowRight,
    MdOutlineKeyboardArrowDown,
    MdKeyboardDoubleArrowRight,
    MdOutlineClose
} from "react-icons/md"

import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import ProCard from '../components/ProCard';
import { data } from "../page/Data"
import ProductSlider from '../components/ProductSlider';
import { cartListData, colors } from '../helper/constants';


const ProductInfo = () => {

    const [perActive, setPerActive] = useState('Individual');

    const [drawer, setDrawer] = useState(false);
    const handleDrawerClose = () => setDrawer(false);
    const handleDrawerShow = () => setDrawer(true);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [sizeActive, setSizeActive] = useState()
    const [productColorActive, setProductColorActive] = useState()

    return (
        <Layout>
            <div className='product-info pt-4 pb-5'>
                <div className='container-cos'>

                    <div className='page-path d-flex align-items-center gap-1'>
                        <div className='d-flex align-items-center gap-1'>
                            <NavLink>Home</NavLink>
                            <MdOutlineKeyboardArrowRight />
                        </div>
                        <div className='d-flex align-items-center gap-1'>
                            <NavLink>Kid’s Fashion</NavLink>
                            <MdOutlineKeyboardArrowRight />
                        </div>
                        <div className='d-flex align-items-center gap-1'>
                            <NavLink>Kid’s Backspace</NavLink>
                            <MdOutlineKeyboardArrowRight />
                        </div>
                        <NavLink className='active'>A Student Backspace Casual Wear</NavLink>
                    </div>

                    <Row className='mt-4'>
                        <Col lg={6} md={12}>
                            <div>
                                <ProductSlider />
                            </div>
                            <div className='review shipping-def py-4 d-flex align-items-center justify-content-between'>
                                <div className='d-flex align-items-center gap-3'>
                                    <h5 className='info-title border-right-cos cos-title'>225 shop reviews</h5>
                                    <div className='rate d-flex align-items-center gap-2'>
                                        <span className='cos-title'>4.8</span>
                                        <div className='d-flex align-items-center gap-1'>
                                            <img src='./img/selling/black-star.png' alt='' />
                                            <img src='./img/selling/black-star.png' alt='' />
                                            <img src='./img/selling/black-star.png' alt='' />
                                            <img src='./img/selling/black-star.png' alt='' />
                                            <img src='./img/selling/black-star.png' alt='' />
                                        </div>
                                    </div>
                                </div>
                                <div className='d-flex align-items-center gap-2 verified'>
                                    <img src='./img/product_def/verified.png' alt='' />
                                    <span>All reviews are from verified buyers</span>
                                </div>
                            </div>
                            <div className='no-review py-4'>
                                <h5 className='info-title '>No item reviews yet</h5>
                                <p>But this shop has 225 reviews for other items. Check out shop reviews <MdOutlineKeyboardArrowDown /></p>
                            </div>

                            <div className='together'>
                                <div className='no-review frequently py-4 pt-0 pt-sm-4   d-flex align-items-center justify-content-between'>
                                    <h5 className='info-title cos-title'>Frequently bought together</h5>
                                    <Button>See all <MdOutlineKeyboardArrowRight /></Button>
                                </div>
                                <div>
                                    <Swiper
                                        slidesPerView={4}
                                        spaceBetween={30}
                                        hashNavigation={{
                                            watchState: true,
                                        }}
                                        breakpoints={{
                                            0: {
                                                slidesPerView: 1,
                                                spaceBetween: 20
                                            },
                                            425: {
                                                slidesPerView: 2,
                                                spaceBetween: 20
                                            },
                                            650: {
                                                slidesPerView: 3,
                                                spaceBetween: 20
                                            },
                                            991: {
                                                slidesPerView: 2,
                                                spaceBetween: 20
                                            },
                                            1300: {
                                                slidesPerView: 3,
                                                spaceBetween: 30
                                            }
                                        }}
                                        navigation={true}
                                        modules={[Pagination, Navigation]}
                                        className="mySwiper"
                                    >
                                        <SwiperSlide>
                                            <div className='slide-box'>
                                                <div className='position-relative'>
                                                    <img src='./img/product_def/togethet1.png' alt='' className='w-100' />
                                                    <img src='./img/product_def/right-black.png' alt='' className='right-mark' />
                                                </div>
                                                <div className='slider-box-per pt-3'>
                                                    <Button>Black x1</Button>
                                                    <div className='d-flex align-items-center gap-2 mt-3'>
                                                        <h5>$12.29</h5>
                                                        <del>$534,33</del>
                                                        <span>1 sold</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className='slide-box'>
                                                <div className='position-relative'>
                                                    <img src='./img/product_def/togethet2.png' alt='' className='w-100' />
                                                    <img src='./img/product_def/right-black.png' alt='' className='right-mark' />
                                                </div>
                                                <div className='slider-box-per pt-3'>
                                                    <Button>Black x1</Button>
                                                    <div className='d-flex align-items-center gap-2 mt-3'>
                                                        <h5>$12.29</h5>
                                                        <del>$534,33</del>
                                                        <span>1 sold</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className='slide-box'>
                                                <div className='position-relative'>
                                                    <img src='./img/product_def/togethet3.png' alt='' className='w-100' />
                                                    <img src='./img/product_def/right-black.png' alt='' className='right-mark' />
                                                </div>
                                                <div className='slider-box-per pt-3'>
                                                    <Button>Black x1</Button>
                                                    <div className='d-flex align-items-center gap-2 mt-3'>
                                                        <h5>$12.29</h5>
                                                        <del>$534,33</del>
                                                        <span>1 sold</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className='slide-box'>
                                                <div className='position-relative'>
                                                    <img src='./img/product_def/togethet1.png' alt='' className='w-100' />
                                                    <img src='./img/product_def/right-black.png' alt='' className='right-mark' />
                                                </div>
                                                <div className='slider-box-per pt-3'>
                                                    <Button>Black x1</Button>
                                                    <div className='d-flex align-items-center gap-2 mt-3'>
                                                        <h5>$12.29</h5>
                                                        <del>$534,33</del>
                                                        <span>1 sold</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className='slide-box'>
                                                <div className='position-relative'>
                                                    <img src='./img/product_def/togethet2.png' alt='' className='w-100' />
                                                    <img src='./img/product_def/right-black.png' alt='' className='right-mark' />
                                                </div>
                                                <div className='slider-box-per pt-3'>
                                                    <Button>Black x1</Button>
                                                    <div className='d-flex align-items-center gap-2 mt-3'>
                                                        <h5>$12.29</h5>
                                                        <del>$534,33</del>
                                                        <span>1 sold</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className='slide-box'>
                                                <div className='position-relative'>
                                                    <img src='./img/product_def/togethet3.png' alt='' className='w-100' />
                                                    <img src='./img/product_def/right-black.png' alt='' className='right-mark' />
                                                </div>
                                                <div className='slider-box-per pt-3'>
                                                    <Button>Black x1</Button>
                                                    <div className='d-flex align-items-center gap-2 mt-3'>
                                                        <h5>$12.29</h5>
                                                        <del>$534,33</del>
                                                        <span>1 sold</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    </Swiper>

                                    <div className='d-flex justify-content-center'>
                                        <Button className='add-items' onClick={handleDrawerShow}>Add 3 items to cart: <b>$36.45</b> <del>$534,33</del></Button>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col lg={6} md={12} className='mt-5 mt-lg-0'>
                            <div className='pro-def'>
                                <h6>A Student Backpack Casual School Bag Lightweight Computer Backpack Water Resistant Travel Backpack Fits 13 Inch Laptop</h6>

                                <div className='brand my-3'>
                                    <p><span>By</span> <img src='./img/product_def/uppack.png' alt='' /> UPPACK (4.8K+ sold)</p>
                                </div>

                                <div className='per-pro d-flex align-items-end gap-2'>
                                    <h3>$299,43</h3>
                                    <del>$534,33</del>
                                    <span>24% Off</span>
                                </div>

                                <div className='price Individual-per mt-3 gap-3 d-flex align-items-center mobile-row'>
                                    <Button className={`${perActive === "Individual" ? "active" : ""}`} onClick={() => setPerActive('Individual')}>Individual Price <br />
                                        $12.00</Button>
                                    <Button className={`${perActive === "Group" ? "active" : ""}`} onClick={() => {
                                        handleShow();
                                        setPerActive('Group')
                                    }}>Group Price: <br />
                                        $12.00</Button>
                                </div>

                                <p className='interest mt-3'>4 interest-free installments of <span>$4.25</span> with
                                    <img src='./img/after.png' alt='' />
                                    or
                                    <img src='./img/kla.png' alt='' />
                                </p>

                                <div className='order-time d-flex align-items-center justify-content-between mt-4'>
                                    <div className='d-flex align-items-center gap-3'>
                                        <img src='./img/product_def/right-green.png' alt='' />
                                        <h5>Free shipping on all orders</h5>
                                    </div>
                                    <div className='d-flex align-items-center gap-3 order-time-cos'>
                                        <div className='time d-flex align-items-center gap-2'>
                                            <span>08</span>
                                            <p>:</p>
                                            <span>34</span>
                                            <p>:</p>
                                            <span>52</span>
                                        </div>
                                        <span>Left today</span>
                                    </div>
                                </div>

                                <div className='product-color mt-4'>
                                    <h5>Color:</h5>
                                    <div className='d-flex align-items-center flex-wrap mt-2 gap-2'>
                                        {
                                            colors.map((e, i) => {
                                                return (
                                                    <Button className={`${productColorActive === e.id ? "active" : ""} color-btn`} onClick={() => setProductColorActive(e.id)}>
                                                        <img src={e.img} alt='' />
                                                    </Button>
                                                )
                                            })
                                        }
                                    </div>

                                    <div className='size mt-4'>
                                        <h5>Size:</h5>
                                        <div className='d-flex align-items-center gap-2 mt-2 flex-wrap'>
                                            <Button className={`${sizeActive === "xs" ? "active" : ""}`} onClick={() => setSizeActive("xs")}>XS</Button>
                                            <Button className={`${sizeActive === "s" ? "active" : ""}`} onClick={() => setSizeActive("s")}>S</Button>
                                            <Button className={`${sizeActive === "m" ? "active" : ""}`} onClick={() => setSizeActive("m")}>M</Button>
                                            <Button className={`${sizeActive === "l" ? "active" : ""}`} onClick={() => setSizeActive("l")}>L</Button>
                                            <Button className={`${sizeActive === "xl" ? "active" : ""}`} onClick={() => setSizeActive("xl")}>XL</Button>
                                        </div>
                                    </div>


                                    <div className='qty mt-4 d-flex align-items-center gap-3'>
                                        <h5>Qty:</h5>
                                        <select>
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                        </select>
                                    </div>
                                </div>

                                <Button className='add-cart mt-4'>Add to cart</Button>

                                <div className='shipping-def mt-4'>
                                    <div className='stock d-flex align-items-center gap-2'>
                                        <span className='d-flex align-items-center gap-2'>
                                            <img src='./img/product_def/stok-limit.png' alt='' />
                                            Selling fast!
                                        </span>
                                        <p>Only 10 left in stock</p>
                                    </div>
                                    <h5 className='info-title my-4'>Shipping & Return</h5>
                                    <div className='shipping-order'>
                                        <div className='sub-title-info d-flex align-items-center gap-2'>
                                            <img src='./img/product_def/shipping.png' alt='' />
                                            <span>Shipping <MdOutlineKeyboardArrowRight /></span>
                                        </div>
                                        <div className='order-types mt-3'>
                                            <Swiper
                                                slidesPerView={4}
                                                spaceBetween={30}
                                                hashNavigation={{
                                                    watchState: true,
                                                }}
                                                breakpoints={{
                                                    0: {
                                                        slidesPerView: 1,
                                                        spaceBetween: 20
                                                    },
                                                    600: {
                                                        slidesPerView: 1,
                                                        spaceBetween: 20
                                                    },
                                                    991: {
                                                        slidesPerView: 1,
                                                        spaceBetween: 20
                                                    },
                                                    1500: {
                                                        slidesPerView: 2,
                                                        spaceBetween: 30
                                                    }
                                                }}
                                                navigation={true}
                                                modules={[Pagination, Navigation]}
                                                className="mySwiper"
                                            >
                                                <SwiperSlide>
                                                    <div className='order-box'>
                                                        <h5>Standard: free on all orders </h5>
                                                        <div className='d-flex align-items-center gap-2 mt-2'>
                                                            <span>Courier company: </span>
                                                            <div className='d-flex align-items-center gap-2'>
                                                                <p><img src='./img/product_def/usps.png' alt='' /> USPS</p>
                                                                <p><img src='./img/product_def/ups.png' alt='' /> UPS</p>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex align-items-center gap-2 mt-1'>
                                                            <span>Delivery: Apr 13-18,</span>
                                                            <p> 67.7% are - 13 days</p>
                                                        </div>
                                                        <div className='d-flex align-items-center gap-2 mt-1'>
                                                            <span>Get a $5 credit for late delivery</span>
                                                        </div>
                                                    </div>
                                                </SwiperSlide>
                                                <SwiperSlide>
                                                    <div className='order-box'>
                                                        <h5>Express: $12.90, free over $129.00</h5>
                                                        <div className='d-flex align-items-center gap-2 mt-2'>
                                                            <span>Courier company: </span>
                                                            <div className='d-flex align-items-center gap-2'>
                                                                <p><img src='./img/product_def/usps.png' alt='' /> USPS</p>
                                                                <p><img src='./img/product_def/ups.png' alt='' /> UPS</p>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex align-items-center gap-2 mt-1'>
                                                            <span>Delivery: Apr 13-18,</span>
                                                            <p> 67.7% are - 13 days</p>
                                                        </div>
                                                        <div className='d-flex align-items-center gap-2 mt-1'>
                                                            <span>Get a $5 credit for late delivery</span>
                                                        </div>
                                                    </div>
                                                </SwiperSlide>
                                                <SwiperSlide>
                                                    <div className='order-box'>
                                                        <h5>Standard: free on all orders </h5>
                                                        <div className='d-flex align-items-center gap-2 mt-2'>
                                                            <span>Courier company: </span>
                                                            <div className='d-flex align-items-center gap-2'>
                                                                <p><img src='./img/product_def/usps.png' alt='' /> USPS</p>
                                                                <p><img src='./img/product_def/ups.png' alt='' /> UPS</p>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex align-items-center gap-2 mt-1'>
                                                            <span>Delivery: Apr 13-18,</span>
                                                            <p> 67.7% are - 13 days</p>
                                                        </div>
                                                        <div className='d-flex align-items-center gap-2 mt-1'>
                                                            <span>Get a $5 credit for late delivery</span>
                                                        </div>
                                                    </div>
                                                </SwiperSlide>
                                            </Swiper>
                                        </div>
                                    </div>
                                    <div className='sub-title-info d-flex align-items-center gap-2 mt-4'>
                                        <img src='./img/product_def/return.png' alt='' />
                                        <span className='d-flex align-items-center gap-1'>Free returns <p>•</p> Price adjustment <MdOutlineKeyboardArrowRight /></span>
                                    </div>
                                    <div className='sub-title-info d-flex align-items-center gap-2 mt-3'>
                                        <img src='./img/product_def/commited.png' alt='' />
                                        <span className='d-flex align-items-center gap-1'>Clubmall is commited to environmental sustainability</span>
                                    </div>
                                </div>

                                <div className='shipping-def mt-4'>
                                    <h5 className='info-title mt-4 mb-2'>Shop with confidence</h5>
                                    <p className='security-line'><img src='./img/product_def/security.png' alt='' /> Shopping security <MdOutlineKeyboardArrowRight /></p>
                                    <ul>
                                        <div>
                                            <li>Safe payment</li>
                                            <li>Secure privacy</li>
                                        </div>
                                        <div>
                                            <li>Secure logistics</li>
                                            <li>Purchase protection</li>
                                        </div>
                                    </ul>
                                </div>

                                <div className='shipping-def description mt-4'>
                                    <h5 className='info-title mt-4 mb-2'>Description</h5>
                                    <div className='d-flex align-items-center copy-div gap-3'>
                                        <span>Item ID: WQ05712</span>
                                        <Button className='copy-btn'>Copy</Button>
                                    </div>
                                    <span>Material: Nylon</span>
                                    <span className='mt-1'>Applicable Age Group: 12 Years & Up</span>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <div className='recent-view'>
                        <h4>Items you may want to add</h4>
                        <div className='mb-0 explore-main'>
                            {
                                data.map((e) => {
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
                                <Button className='shop-btn rotate-img'>View More <MdKeyboardDoubleArrowRight /></Button>
                            </div>
                        </div>
                    </div>
                </div>


                {/* cart drawer */}
                <Offcanvas show={drawer} onHide={handleDrawerClose} placement="end" className="cart-canvas">
                    <Offcanvas.Body>
                        <div className='cart-side position-relative'>

                            <Button className='close-modal-btn cart-side-close' onClick={handleDrawerClose}>
                                <MdOutlineClose />
                            </Button>

                            <div className='cart-header d-flex align-items-center gap-2 pt-2'>
                                <img src='./img/product_def/right-black.png' alt='' width="18px" />
                                <h5>Added 3 items(s) to cart</h5>
                            </div>

                            <div className='product-info'>
                                <div className='order-time d-flex align-items-center justify-content-between mt-4'>
                                    <div className='d-flex align-items-center gap-3'>
                                        <img src='./img/product_def/right-green.png' alt='' className='right-green-mark' />
                                        <h5>Free shipping on all orders</h5>
                                    </div>
                                    <div className='d-flex align-items-center gap-3 order-time-cos'>
                                        <span>Ends in</span>
                                        <div className='time d-flex align-items-center gap-2'>
                                            <span>08</span>
                                            <p>:</p>
                                            <span>34</span>
                                            <p>:</p>
                                            <span>52</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='cart-list border-bottom-cos mt-4 pb-4'>
                                {
                                    cartListData.slice(0, 3).map((e, i) => {
                                        return (
                                            <div className='cart-items d-flex align-items-start gap-3 mt-4' >
                                                <img src={e.img} alt='' width="90px" />
                                                <div className='cart-items-text'>
                                                    <h5>{e.name}</h5>
                                                    <span>{e.categories}</span>
                                                    <div className='cart-per d-flex align-items-center gap-2'>
                                                        <h5>{e.per}</h5>
                                                        <del>{e.delPer}</del>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }

                                <Button className='go-cart'>Go to cart</Button>
                            </div>

                            <div className='purchased-list pt-4'>
                                <h4>Items purchased together</h4>
                                <div>
                                    {
                                        cartListData.slice(0, 5).map((e, i) => {
                                            return (
                                                <div className='cart-items d-flex align-items-start gap-3 mt-4' >
                                                    <img src={e.img} alt='' width="90px" />
                                                    <div className='cart-items-text'>
                                                        <h5>{e.name}</h5>
                                                        <span>{e.categories}</span>
                                                        <div className='cart-per d-flex align-items-center justify-content-between gap-2'>
                                                            <div className='cart-per d-flex align-items-center gap-2'>
                                                                <h5>{e.per}</h5>
                                                                <del>{e.delPer}</del>
                                                            </div>
                                                            <Button className='cart-side-btn'>
                                                                <img src='./img/product_def/cart-orange.png' alt='' />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                    <div className='w-100 d-flex justify-content-center'>
                                        <Button className='shop-btn rotate-img'>View More <MdKeyboardDoubleArrowRight /></Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Offcanvas.Body>
                </Offcanvas>


                <Modal show={show} onHide={handleClose} centered className='welcome-modal'>
                    <Modal.Body>
                        <div className='text-center p-3 p-sm-4'>
                            <img src='./img/modal-logo.png' alt='' />
                            <h5 className='my-3'>Get the full experience on <br /> the app</h5>
                            <p>Follow you favoritevendor accounts,
                                explore new product and message the <br /> vendor</p>
                            <div className='d-flex align-items-center justify-content-center gap-2 mt-4 app-download'>
                                <NavLink href='https://play.google.com/store/apps/details?id=com.clubmall' target='_blank'>
                                    <img src='./img/playstore.png' alt='' />
                                </NavLink>
                                <NavLink href='https://apps.apple.com/us/app/clubmall/id6444752184' target='_blank'>
                                    <img src='./img/app.png' alt='' />
                                </NavLink>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>

            </div>
        </Layout>
    )
}

export default ProductInfo
