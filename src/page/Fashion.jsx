import React, { useRef, useState, useEffect, useContext } from 'react'
import Layout from '../layout/Layout'
import { Button, Col, Row } from 'react-bootstrap'

import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import { useNavigate } from 'react-router-dom';
import PinkCard from '../components/PinkCard';
import AddCartModal from '../components/AddCartModal';
import api from "../helper/api";
import { getServerURL } from '../helper/envConfig';
import Loader from '../components/Loader';
import { handelProductDetail, handelCategorydata } from '../helper/constants';
import { CartContext } from '../context/CartContext';
import { Is_Login } from '../helper/IsLogin';
import SucessSnackBar from "../components/SnackBar";
import ErrorSnackBar from "../components/SnackBar";
import ProductCard from './ProductCard';

const Fashion = () => {

    const isLoggedIn = Is_Login();
    const { userProductList, loading, setLoading, wishProductUrl, category, currentUser,
        productList, trendingProductList, getProducts, getWishList, wishlist, addWishList, sucessSnackBarOpen, warningSnackBarOpen, Mymessage, setWarningSnackBarOpen, setSucessSnackBarOpen } = useContext(CartContext);

    const navigate = useNavigate();
    const [isWishlist, setIsWishlist] = useState(); // We use !! to convert to a boolean
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setProduct_id({})
        setShow(false)
    }
    const [product_id, setProduct_id] = useState({});

    const handleShow = (id) => {
        setProduct_id(id)
        setShow(true);
    }


    const player = useRef();

    const startAnimation = () => {
        if (player.current) {
            player.current.play(); // Check if player.current is not null before accessing play()
        }
    };
    const stopAnimation = () => {
        setLoading(false);
    };


    useEffect(() => {
        getProducts();
        getWishList()
    }, [isLoggedIn]);

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

            {
                loading ? <Loader startAnimation={startAnimation} stopAnimation={stopAnimation} player={player} /> : (
                    <>
                        <section className='home-first-image mb-0'>
                            <div className='container-cos'>
                                <div className='w-100 position-relative pointer' onClick={() => navigate("/trending")}>
                                    <img alt='' src="./img/new_in/hero-new-in.webp" width={"100%"} />
                                    <div className='particular-cate-head'>
                                        <h1>HOT <span>xxx</span> <br />FASHION <p>TREND</p></h1>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className='sec-2'>
                            <div className='container-cos blue-bg'>
                                <div className='shop-care-bears text-center pb-5'>
                                    <p>Dress for sunny days ahead with the help of our very caring friends!</p>
                                    <div className='d-flex justify-content-center'>
                                        <Button className='shop-care-bears-btn mt-3'>Shop Care Bears</Button>
                                    </div>
                                </div>

                                <div className='shop-trend px-5'>
                                    <Row>
                                        <Col xl={3} lg={4} md={6} sm={12}>
                                            <div className='shop-box position-relative pointer ' onClick={() => navigate("/trending")}>
                                                <img alt='' src='./img/new_in/shop1.png' width="100%" />
                                                <h2 className='brown'>Shop Women</h2>
                                            </div>
                                        </Col>
                                        <Col xl={3} lg={4} md={6} sm={12} className='mt-5 '>
                                            <div className='shop-box position-relative pointer ' onClick={() => navigate("/trending")}>
                                                <img alt='' src='./img/new_in/shop2.png' width="100%" />
                                                <h2 className='dark'>Shop Curve</h2>
                                            </div>
                                        </Col>
                                        <Col xl={3} lg={4} md={6} sm={12} className='mt-5 mt-md-0'>
                                            <div className='shop-box position-relative pointer ' onClick={() => navigate("/trending")}>
                                                <img alt='' src='./img/new_in/shop3.png' width="100%" />
                                                <h2 className='brown-light'>Shop Trends</h2>
                                            </div>
                                        </Col>
                                        <Col xl={3} lg={4} md={6} sm={12} className='mt-5'>
                                            <div className='shop-box position-relative pointer ' onClick={() => navigate("/trending")}>
                                                <img alt='' src='./img/new_in/shop4.png' width="100%" />
                                                <h2 className='green-text'>Shop Kids</h2>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>

                                <img alt='' src='./img/new_in/pink.webp' width="100%" className='pink-big-img' />
                            </div>
                        </section>

                        <section className='pink-section'>
                            <div className='container-cos pink-bg'>

                                <div className='pink-slider pt-5'>
                                    <Swiper
                                        slidesPerView={4}
                                        spaceBetween={30}
                                        hashNavigation={{
                                            watchState: true,
                                        }}

                                        breakpoints={{
                                            0: {
                                                slidesPerView: 2,
                                                spaceBetween: 10
                                            },
                                            600: {
                                                slidesPerView: 2,
                                                spaceBetween: 10
                                            },
                                            991: {
                                                slidesPerView: 2,
                                                spaceBetween: 10
                                            },
                                            1140: {
                                                slidesPerView: 4,
                                                spaceBetween: 20
                                            },
                                            1300: {
                                                slidesPerView: 5,
                                                spaceBetween: 20
                                            },
                                            1500: {
                                                slidesPerView: 6,
                                                spaceBetween: 20
                                            }
                                        }}
                                        loop={true}
                                        navigation={true}
                                        modules={[Pagination, Navigation]}
                                        className="mySwiper"
                                    >
                                        {
                                            trendingProductList.productListArrObj && trendingProductList.productListArrObj?.map((e) => {
                                                return (
                                                    <>
                                                        <SwiperSlide>
                                                            <PinkCard img={e} path={trendingProductList?.productImagePath && trendingProductList.productImagePath} />
                                                        </SwiperSlide>
                                                    </>
                                                )
                                            })
                                        }
                                    </Swiper>

                                    <div className='d-flex justify-content-center mt-4'>
                                        <Button className='view-all-btn' onClick={() => navigate("/trending")}>View All</Button>
                                    </div>
                                </div>

                                <img alt='' src='./img/new_in/purple.webp' width="100%" />

                                <div className='pink-slider pt-5'>
                                    <Swiper
                                        slidesPerView={4}
                                        spaceBetween={30}
                                        hashNavigation={{
                                            watchState: true,
                                        }}
                                        loop={true}
                                        breakpoints={{
                                            0: {
                                                slidesPerView: 2,
                                                spaceBetween: 10
                                            },
                                            600: {
                                                slidesPerView: 2,
                                                spaceBetween: 10
                                            },
                                            991: {
                                                slidesPerView: 2,
                                                spaceBetween: 10
                                            },
                                            1140: {
                                                slidesPerView: 4,
                                                spaceBetween: 20
                                            },
                                            1300: {
                                                slidesPerView: 5,
                                                spaceBetween: 20
                                            },
                                            1500: {
                                                slidesPerView: 6,
                                                spaceBetween: 20
                                            }
                                        }}
                                        navigation={true}
                                        modules={[Pagination, Navigation]}
                                        className="mySwiper"
                                    >
                                        {
                                            trendingProductList.productListArrObj && trendingProductList.productListArrObj?.map((e) => {
                                                return (
                                                    <>
                                                        <SwiperSlide>
                                                            <PinkCard img={e} path={trendingProductList?.productImagePath && trendingProductList.productImagePath} />
                                                        </SwiperSlide>
                                                    </>
                                                )
                                            })
                                        }
                                    </Swiper>

                                    <div className='d-flex justify-content-center mt-4'>
                                        <Button className='view-all-btn view-btn-yellow' onClick={() => navigate("/trending")}>View All</Button>
                                    </div>
                                </div>

                                <img alt='' src='./img/new_in/blue.webp' width="100%" className='pink-big-img' />
                            </div>

                        </section>

                        <section className='pink-section'>
                            <div className='container-cos green-bg'>

                                <div className='pink-slider pt-5'>
                                    <Swiper
                                        slidesPerView={4}
                                        spaceBetween={30}
                                        hashNavigation={{
                                            watchState: true,
                                        }}
                                        loop={true}
                                        breakpoints={{
                                            0: {
                                                slidesPerView: 2,
                                                spaceBetween: 10
                                            },
                                            600: {
                                                slidesPerView: 2,
                                                spaceBetween: 10
                                            },
                                            991: {
                                                slidesPerView: 2,
                                                spaceBetween: 10
                                            },
                                            1140: {
                                                slidesPerView: 4,
                                                spaceBetween: 20
                                            },
                                            1300: {
                                                slidesPerView: 5,
                                                spaceBetween: 20
                                            },
                                            1500: {
                                                slidesPerView: 6,
                                                spaceBetween: 20
                                            }
                                        }}
                                        navigation={true}
                                        modules={[Pagination, Navigation]}
                                        className="mySwiper"
                                    >
                                        {
                                            trendingProductList.productListArrObj && trendingProductList.productListArrObj?.map((e) => {
                                                return (
                                                    <>
                                                        <SwiperSlide>
                                                            <PinkCard img={e} path={trendingProductList?.productImagePath && trendingProductList.productImagePath} />
                                                        </SwiperSlide>
                                                    </>
                                                )
                                            })
                                        }
                                    </Swiper>

                                    <div className='d-flex justify-content-center mt-4'>
                                        <Button className='view-all-btn' onClick={() => navigate("/trending")} >View All</Button>
                                    </div>
                                </div>

                                <img alt='' src='./img/new_in/green.webp' width="100%" />

                                <div className='pink-slider py-5'>
                                    <Swiper
                                        slidesPerView={4}
                                        spaceBetween={30}
                                        hashNavigation={{
                                            watchState: true,
                                        }}
                                        loop={true}
                                        breakpoints={{
                                            0: {
                                                slidesPerView: 2,
                                                spaceBetween: 10
                                            },
                                            600: {
                                                slidesPerView: 2,
                                                spaceBetween: 10
                                            },
                                            991: {
                                                slidesPerView: 2,
                                                spaceBetween: 10
                                            },
                                            1140: {
                                                slidesPerView: 4,
                                                spaceBetween: 20
                                            },
                                            1300: {
                                                slidesPerView: 5,
                                                spaceBetween: 20
                                            },
                                            1500: {
                                                slidesPerView: 6,
                                                spaceBetween: 20
                                            }
                                        }}
                                        navigation={true}
                                        modules={[Pagination, Navigation]}
                                        className="mySwiper"
                                    >
                                        {
                                            trendingProductList.productListArrObj && trendingProductList.productListArrObj.map((e) => {
                                                return (
                                                    <>
                                                        <SwiperSlide>
                                                            <PinkCard img={e} path={trendingProductList?.productImagePath && trendingProductList.productImagePath} />
                                                        </SwiperSlide>
                                                    </>
                                                )
                                            })
                                        }
                                    </Swiper>

                                    <div className='d-flex justify-content-center mt-4'>
                                        <Button className='view-all-btn view-btn-red' onClick={() => navigate("/trending")} >View All</Button>
                                    </div>
                                </div>
                            </div>

                        </section>

                        {/* <section className='video-section'>
                            <div className='container-cos'>
                                <video
                                    width="100%"
                                    height="100%"
                                    controls
                                    controlsList="nodownload"
                                    id="def-video"
                                    webkit-playsInline
                                    playsInline
                                    preload="yes"
                                >
                                    <source src="./img/video.mp4" type="video/mp4" />
                                    <source src="./img/video.mp4" type="video/mp4" />
                                </video>
                            </div>
                        </section> */}

                        <section className='explore mar-top-40 mar-bot-20'>
                            <div className='container-cos'>
                                <div className='title w-100 text-center'>
                                    <h2><span>S</span>HOP COLLECTION </h2>
                                </div>

                                <div className='mb-0 mt-4 explore-main particular-product-items mar-top-0'>
                                    {
                                        productList.productListArrObj && productList.productListArrObj?.slice(0, 20).map((product) => (
                                            <ProductCard product={product} productImagePath={productList.productImagePath} handleShow={handleShow} />
                                        ))
                                    }
                                </div>
                            </div>
                        </section>
                    </>
                )}

            <AddCartModal handleClose={handleClose} show={show} product_id={product_id} />
        </>
    )
}

export default Fashion