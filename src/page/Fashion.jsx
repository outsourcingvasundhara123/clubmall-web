import React, { useRef, useState, useEffect, useContext } from 'react'
import { Col, Row } from 'react-bootstrap'
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
import {handelCategorydata } from '../helper/constants';
import { CartContext } from '../context/CartContext';
import { Is_Login } from '../helper/IsLogin';
import SucessSnackBar from "../components/SnackBar";
import ErrorSnackBar from "../components/SnackBar";
import ProductCard from './ProductCard';
import { PRODUCTList } from "../helper/endpoints";

const Fashion = () => {

    const isLoggedIn = Is_Login();
    const { loading, setLoading,
        productList, trendingProductList, getProducts, sucessSnackBarOpen, warningSnackBarOpen, Mymessage, setWarningSnackBarOpen, setSucessSnackBarOpen } = useContext(CartContext);
    const serverURL = getServerURL();

    const navigate = useNavigate();
    const [isWishlist, setIsWishlist] = useState(); // We use !! to convert to a boolean
    const [show, setShow] = useState(false);
    const [colorProductList, setColorProductList] = useState([]);
    const [url, setUrl] = useState([]);
    const [colorLoading, setColorLoading] = useState(false);


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

    const handelSubCat = (Id) => {
        localStorage.setItem("selectedSubcategories", Id);
        window.location.href = "/categories";
    };



    useEffect(() => {
        getProducts();
        // getWishList()
    }, [isLoggedIn]);

    useEffect(() => {
        setColorLoading(true);

        // Array of product IDs to ignore for all colors
        const idsToIgnore = [
            "648548e5cd7dafd7b364678a",
            "6485c02e3d634c69fdac598e",
            "6485c02e3d634c69fdac598e",
            "6484cacacd7dafd7b3646403",
            "6485731752b0e7657d84b1f8",
            "64857eef3d634c69fdac5853",
            "6484885052b0e7657d84acb2",
            "6484cd9ccd7dafd7b3646418",
            "648557d5b60a664b6e52bf0e",
            "64868f11b60a664b6e52c686",
            "64868a1fcd7dafd7b3646f11",
            "64867a7952b0e7657d84b88f",
            "64858a0a47a981c1dddf72c1",
            "6485ee123d634c69fdac5ad6"
        ];

        const getProductsByColor = async (color, ignoreIds) => {
            startAnimation();
            const apiType = isLoggedIn ? api.postWithToken : api.post;

            const postListResponse = await apiType(`${serverURL + PRODUCTList}`, {
                "product_list_type": "by-filters",
                product_category_one_id: "64426a1637764b8698579aa0",
                color: color,
                page: 1,
            });

            const postsData = postListResponse.data.data;
            setUrl(postsData.productImagePath);

            // Filtering out products with the specified IDs
            const filteredData = postsData.productListArrObj.filter(
                (product) => !ignoreIds.includes(product._id)
            );

            return { color, data: filteredData };
        };

        Promise.all([
            getProductsByColor("Pink", idsToIgnore),
            getProductsByColor("Purple", idsToIgnore),
            getProductsByColor("Blue", idsToIgnore),
            getProductsByColor("Green", idsToIgnore),
        ])
            .then((results) => {
                const newColorProductList = results.reduce((accumulator, current) => {
                    accumulator[current.color.toLowerCase()] = current.data;
                    return accumulator;
                }, {});

                setColorProductList(newColorProductList);
                setColorLoading(false);
            })
            .catch((error) => {
                // errorResponse(error, setMyMessage);
                console.log(error);
            });
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
                loading || colorLoading ? <Loader startAnimation={startAnimation} stopAnimation={stopAnimation} player={player} /> : (
                    <>
                        <section className='home-first-image mb-0'>
                            <div className='container-cos'>
                                <div className='w-100 position-relative pointer' onClick={() => (handelSubCat("64481e7595c53d0f01ab0bf4"), handelCategorydata("64426a1637764b8698579aa0"))}>
                                    <img alt='' src="./img/new_in/hero-new-in.webp" width={"100%"} />
                                </div>
                            </div>
                        </section>

                        <section className='sec-2'>
                            <div className='container-cos blue-bg'>
                                <div className='shop-care-bears text-center pb-5'>
                                    <p>Dress for sunny days ahead with the help of our very caring friends!</p>
                                    {/* <div className='d-flex justify-content-center'>
                                        <Button className='shop-care-bears-btn mt-3'>Shop Care Bears</Button>
                                    </div> */}
                                </div>

                                <div className='shop-trend px-5'>
                                    <Row>
                                        <Col xl={3} lg={4} md={6} sm={12}>
                                            <div className='shop-box position-relative pointer ' onClick={() => (handelCategorydata("64426a1637764b8698579aa0"), localStorage.removeItem("selectedSubcategories"))}>
                                                <img alt='' src='./img/new_in/shop1.png' width="100%" />
                                                <h2 className='brown'>Shop Women</h2>
                                            </div>
                                        </Col>
                                        <Col xl={3} lg={4} md={6} sm={12} className='mt-5 '>
                                            <div className='shop-box position-relative pointer ' onClick={() => (handelCategorydata("6442936437764b869857a33e"), localStorage.removeItem("selectedSubcategories"))}>
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
                                            <div className='shop-box position-relative pointer ' onClick={() => (handelCategorydata("6442b56d37764b869857a925"), localStorage.removeItem("selectedSubcategories"))}>
                                                <img alt='' src='./img/new_in/shop4.png' width="100%" />
                                                <h2 className='green-text'>Shop Kids</h2>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>

                                <img alt='' src='./img/new_in/pink.webp' width="100%" className='pink-big-img mt-5' />
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

                                            colorProductList?.pink && colorProductList?.pink?.map((e) => {
                                                return (
                                                    <>
                                                        <SwiperSlide>
                                                            <PinkCard img={e} path={url && url} color={"Pink"} />
                                                        </SwiperSlide>
                                                    </>
                                                )
                                            })
                                        }

                                        {
                                            colorProductList?.pink?.length <= 0 && trendingProductList.productListArrObj && trendingProductList.productListArrObj?.map((e) => {
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

                                    {/* <div className='d-flex justify-content-center mt-4'>
                                        <Button className='view-all-btn' onClick={() => navigate("/trending")}>View All</Button>
                                    </div> */}
                                </div>

                                <img alt='' src='./img/new_in/purple.webp' width="100%" className='mt-0 mt-md-5' />

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

                                            colorProductList?.purple && colorProductList?.purple?.map((e) => {
                                                return (
                                                    <>
                                                        <SwiperSlide>
                                                            <PinkCard img={e} path={url && url} color={"Purple"} />
                                                        </SwiperSlide>
                                                    </>
                                                )
                                            })
                                        }


                                        {
                                            colorProductList?.purple?.length <= 0 && trendingProductList.productListArrObj && trendingProductList.productListArrObj?.map((e) => {
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

                                    {/* <div className='d-flex justify-content-center mt-4'>
                                        <Button className='view-all-btn view-btn-yellow' onClick={() => navigate("/trending")}>View All</Button>
                                    </div> */}
                                </div>

                                <img alt='' src='./img/new_in/blue.webp' width="100%" className='pink-big-img mt-0 mt-md-5' />
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

                                            colorProductList?.blue && colorProductList?.blue?.map((e) => {
                                                return (
                                                    <>
                                                        <SwiperSlide>
                                                            <PinkCard img={e} path={url && url} color={"Blue"} />
                                                        </SwiperSlide>
                                                    </>
                                                )
                                            })
                                        }

                                        {
                                            colorProductList?.blue?.length <= 0 && trendingProductList.productListArrObj && trendingProductList.productListArrObj?.map((e) => {
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

                                    {/* <div className='d-flex justify-content-center mt-4'>
                                        <Button className='view-all-btn' onClick={() => navigate("/trending")} >View All</Button>
                                    </div> */}
                                </div>

                                <img alt='' src='./img/new_in/green.webp' width="100%" className='mt-0 mt-md-5' />

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

                                            colorProductList?.green && colorProductList?.green?.map((e) => {
                                                return (
                                                    <>
                                                        <SwiperSlide>
                                                            <PinkCard img={e} path={url && url} color={"Green"} />
                                                        </SwiperSlide>
                                                    </>
                                                )
                                            })
                                        }

                                        {
                                            colorProductList?.green?.length <= 0 && trendingProductList.productListArrObj && trendingProductList.productListArrObj.map((e) => {
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

                                    {/* <div className='d-flex justify-content-center mt-4'>
                                        <Button className='view-all-btn view-btn-red' onClick={() => navigate("/trending")} >View All</Button>
                                    </div> */}
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