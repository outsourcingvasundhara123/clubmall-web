import React, { useRef, useState, useEffect, useContext } from 'react'
import Layout from '../layout/Layout'
import { MdKeyboardDoubleArrowRight } from "react-icons/md"
import { Button, Col, Row } from 'react-bootstrap'
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import { useNavigate } from 'react-router-dom'
import ProCard from '../components/ProCard'
import SaleCard from '../components/SaleCard'
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import { getServerURL } from '../helper/envConfig';
import CategoryList from './CategoryList';
import Loader from '../components/Loader';
import { handelProductDetail, handelCategory } from '../helper/constants';
import { CartContext } from '../context/CartContext';
import SucessSnackBar from "../components/SnackBar";
import ErrorSnackBar from "../components/SnackBar";
import { Is_Login } from '../helper/IsLogin';

const Home = () => {

    const { startAnimation, stopAnimation, player, loading, setLoading, wishProductUrl, category, currentUser,
        productList, trendingProductList, getProducts, getWishList, wishlist, addWishList, sucessSnackBarOpen, warningSnackBarOpen, Mymessage, setWarningSnackBarOpen, setSucessSnackBarOpen } = useContext(CartContext);

    const isLoggedIn = Is_Login();
    const navigate = useNavigate();
    // const [category, setcategory] = useState([]);
    // const [currentUser, setCorrectUser] = useState("");
    // const [productList, setProductList] = useState([]);
    // const [trendingProductList, setTrendingProductList] = useState([]);
    const serverURL = getServerURL();
    // const [loading, setLoading] = useState(true);
    const [active, setActive] = useState("1");

    const breakpoints = {
        0: {
            slidesPerView: 3,
            spaceBetween: 10
        },
        600: {
            slidesPerView: 3,
            spaceBetween: 10
        },
        991: {
            slidesPerView: 3,
            spaceBetween: 10
        },
        1140: {
            slidesPerView: 4,
            spaceBetween: 20
        },
        1200: {
            slidesPerView: 5,
            spaceBetween: 20
        },
        1300: {
            slidesPerView: 6,
            spaceBetween: 20
        },
    }

    useEffect(() => {
        getProducts();
        getWishList()
    }, [isLoggedIn]);

    const handleClick = (event) => {
        setActive(event.target.id);
    }

    return (
        <>

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

            {/* {
                loading ? <Loader startAnimation={startAnimation} stopAnimation={stopAnimation} player={player} /> : ( */}
            <>


                <section className='home-first-image'>
                    <div className='container-cos'>
                        <div className='w-100  pointer ' onClick={() => navigate("/trending")}>
                            <img src="./img/homePageBg1.webp" alt="" width={"100%"} />
                        </div>
                    </div>
                </section>

                <section>
                    <div className='container-cos'>
                        <div className='discount-offer'>
                            <Row className='align-items-center'>
                                <Col className='py-4 pad-cos'>
                                    <div className='discount-card'>
                                        <h1>10% OFF</h1>
                                        <p>ORDERS OF $49+</p>
                                    </div>
                                </Col>
                                <Col className='py-4 pad-cos'>
                                    <div className='discount-card'>
                                        <h1>15% OFF</h1>
                                        <p>ORDERS OF $89+</p>
                                    </div>
                                </Col>
                                <Col className='py-4 pad-cos'>
                                    <div className='discount-card'>
                                        <h1>20% OFF</h1>
                                        <p>ORDERS OF $89+</p>
                                    </div>
                                </Col>
                                <Col className='py-4 pad-cos'>
                                    <div className='discount-card mt-1' style={{ borderRight: "none" }}>
                                        <Button className='discount-btn mx-auto'>
                                            CODE : clubmall30
                                        </Button>
                                        <p>CAPPED AT $5</p>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </section>

                <section className='home-second-image ' >
                    <div className='container-cos position-relative'>
                        <div className='w-100 pointer ' onClick={() => navigate("/trending")}>
                            <img src="./img/homePageBg2.webp" alt="" width={"100%"} />
                        </div>
                        <Button className='shop-the-drop'>Shop The Drop</Button>
                    </div>
                </section>

                <section className='categories'>
                    <div className='container-cos'>
                        <div className='title w-100 text-center'>
                            <h2><span>C</span>ATEGORIES</h2>
                        </div>
                        <CategoryList />
                    </div>
                </section>

                <section className='stylist'>
                    <div className='container-cos'>
                        <div className='title w-100 text-center'>
                            <h2><span>C</span>LUBMALL SALE</h2>
                        </div>
                        <div className='mt-5 mar-cos-sale'>
                            <Swiper
                                slidesPerView={4}
                                spaceBetween={30}
                                hashNavigation={{
                                    watchState: true,
                                }}
                                loop={true}
                                breakpoints={breakpoints}
                                navigation={true}
                                modules={[Pagination, Navigation]}
                                className="mySwiper" >
                                {
                                    productList.productListArrObj && productList.productListArrObj.map((e) => {
                                        return (
                                            <SwiperSlide>
                                                <SaleCard img={e} path={productList?.productImagePath && productList.productImagePath} />
                                            </SwiperSlide>
                                        )
                                    })
                                }

                            </Swiper>
                        </div>
                    </div>
                </section>

                <section className='section-4 my-5'>
                    <div className='container-cos'>
                        <Row>
                            <Col xl={6} lg={6} md={6} sm={12} className='mt-4'>
                                <div className='product-s4-card'>
                                    <div className='position-relative'>
                                        <img src='./img/img4.webp' alt='' />
                                        <div className='card-text-bottom big-box'>
                                            <div className='card-text'>
                                                <h5>RJ Jewellery</h5>
                                                <span className='my-2 d-block'>From $0.29</span>
                                            </div>
                                            <Button className='shop-btn mt-0 mt-3' onClick={() => navigate("/trending")}>Shop Now <MdKeyboardDoubleArrowRight /></Button>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col xl={6} lg={6} md={6} sm={12} className='mt-4 mar-top-10'>
                                <div className='product-s4-card'>
                                    <div className='position-relative'>
                                        <img src='./img/img5.webp' alt='' />
                                        <div className='card-text-bottom big-box'>
                                            <div className='card-text'>
                                                <h5>FS - Nike Air Max 270 React </h5>
                                                <span className='my-2 d-block'>Up to 50% off</span>
                                            </div>
                                            <Button className='shop-btn mt-0 mt-3' onClick={() => navigate("/trending")}>Shop Now <MdKeyboardDoubleArrowRight /></Button>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </section>

                <section className='section-4 jewellery' style={{ marginTop: "80px" }}>
                    <div className='container-cos'>
                        <div className='title w-100 text-center'>
                            <h2><span>D</span>AILY DROPS</h2>
                        </div>
                        <Row className=''>
                            <Col xl={6} lg={6} md={6} sm={12} className='mt-4'>
                                <div className='product-s4-card' style={{ borderRadius: "0px 0px 15px 15px" }}>
                                    <div className='position-relative'>
                                        <img src='./img/daily-drop-1.webp' alt='' />
                                        <div className='card-text-bottom big-box-daily-drops'>
                                            <Button className='shop-btn mt-0 mt-3' onClick={() => navigate("/trending")}>Shop Now</Button>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col xl={6} lg={6} md={6} sm={12} className='mt-4 mar-top-10'>
                                <div className='product-s4-card'>
                                    <div className='position-relative'>
                                        <img src='./img/daily-drop-2.webp' alt='' />
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </section>

                <section className='stylist mb-5'>
                    <div className='container-cos'>
                        <div className='mt-5 mar-top-10'>
                            <Swiper
                                slidesPerView={4}
                                spaceBetween={30}
                                hashNavigation={{
                                    watchState: true,
                                }}
                                loop={true}
                                breakpoints={{
                                    0: {
                                        slidesPerView: 3,
                                        spaceBetween: 10
                                    },
                                    600: {
                                        slidesPerView: 3,
                                        spaceBetween: 10
                                    },
                                    991: {
                                        slidesPerView: 3,
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
                                }}
                                navigation={true}
                                modules={[Pagination, Navigation]}
                                className="mySwiper"
                            >
                                {
                                    trendingProductList.productListArrObj?.slice(0, 5).map((e) => {
                                        return (

                                            <SwiperSlide>
                                                <ProCard
                                                    id={e._id}
                                                    img={e.product_images[0]?.file_name}
                                                    name={e.name}
                                                    group_price={e.group_price}
                                                    individual_price={e.individual_price}
                                                    sold={e.total_order}
                                                    secper={e.secper}
                                                    off={e.discount_percentage}
                                                    path={trendingProductList?.productImagePath && trendingProductList.productImagePath}
                                                    is_wishList={e.wishList && e.wishList}
                                                />
                                            </SwiperSlide>
                                        )
                                    })
                                }
                            </Swiper>
                        </div>
                    </div>
                </section>

                <section className='home-first-image mar-top-10' >
                    <div className='container-cos'>
                        <div className='title w-100 text-center '>
                            <h2><span>C</span>LUBMALL CAMPAIGNS</h2>
                        </div>
                        <div className='w-100 mt-5 pointer mar-top-20' onClick={() => navigate("/trending")}>
                            <img src="./img/homePageBg1.webp" alt="" width={"100%"} />
                        </div>
                    </div>
                </section>

                <section className='home-second-image'>
                    <div className='container-cos position-relative'>
                        <div className='w-100 pointer ' onClick={() => navigate("/trending")}>
                            <img src="./img/homePageBg2.webp" alt="" width={"100%"} />
                        </div>
                        <Button className='shop-the-drop'>Shop The Drop</Button>
                    </div>
                </section>

                <section className='stylist mb-5 mar-top-40 mar-bot-20'>
                    <div className='container-cos'>
                        <div className='title w-100 text-center'>
                            <h2><span>S</span>TYLE GALLERY</h2>
                        </div>
                        <div className='mt-5 mar-top-20'>
                            <Swiper
                                slidesPerView={4}
                                spaceBetween={30}
                                hashNavigation={{
                                    watchState: true,
                                }}
                                loop={true}
                                breakpoints={{
                                    0: {
                                        slidesPerView: 3,
                                        spaceBetween: 10
                                    },
                                    600: {
                                        slidesPerView: 3,
                                        spaceBetween: 10
                                    },
                                    991: {
                                        slidesPerView: 4,
                                        spaceBetween: 20
                                    },
                                    1300: {
                                        slidesPerView: 5,
                                        spaceBetween: 20
                                    }
                                }}
                                navigation={true}
                                modules={[Pagination, Navigation]}
                                className="mySwiper"
                            >

                                {
                                    productList.productListArrObj && productList.productListArrObj?.slice(5, 10).map((e) => {
                                        return (

                                            <SwiperSlide>
                                                <div className='product-card stylist-card1 position-relative p-0 position-relative shop-btn-up'>
                                                    <img src={productList?.productImagePath && productList?.productImagePath + e._id + "/" + e.product_images[0]?.file_name} alt={e.name} className='w-100' />
                                                    <Button className='shop-now' onClick={() => handelProductDetail(e._id)} >Shop Now</Button>
                                                </div>
                                            </SwiperSlide>
                                        )
                                    })
                                }


                            </Swiper>
                        </div>
                    </div>
                </section>

                <section className='explore my-5 mar-top-0 mar-bot-20'>
                    <div className='container-cos d-flex justify-content-center'>
                        <div className='btns-home'>
                            <Button className={active === "2" ? "active" : undefined} style={{ backgroundColor: "#2D4658" }} id={"2"} onClick={handleClick}>Spring&Summer</Button>
                            <Button className={active === "3" ? "active" : undefined} style={{ backgroundColor: "#893350" }} id={"3"} onClick={handleClick}>Springiton</Button>
                            <Button className={active === "4" ? "active" : undefined} style={{ backgroundColor: "#D7C9BE" }} id={"4"} onClick={handleClick}>Denim Guide</Button>
                            <Button className={active === "5" ? "active" : undefined} style={{ backgroundColor: "#DDCAD7" }} id={"5"} onClick={handleClick}>Girls Outing</Button>
                            <Button className={active === "6" ? "active" : undefined} style={{ backgroundColor: "#C49275" }} id={"6"} onClick={handleClick}>Beauty</Button>
                            <Button className={active === "7" ? "active" : undefined} style={{ backgroundColor: "#D3C4B1" }} id={"7"} onClick={handleClick}>Cozy Style</Button>
                            <Button className={active === "8" ? "active" : undefined} style={{ backgroundColor: "#DFA6A8" }} id={"8"} onClick={handleClick}>Elegant Lady</Button>
                            <Button className={active === "8" ? "active" : undefined} style={{ backgroundColor: "#EECA94" }} id={"8"} onClick={handleClick}>Cool In Black</Button>
                        </div>
                    </div>
                </section>
            </>
            {/* )} */}
        </>
    )
}

export default Home
