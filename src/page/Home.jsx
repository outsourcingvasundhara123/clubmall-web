import React, { useRef, useState, useEffect } from 'react'
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
import api from "../helper/api";
import { getServerURL } from '../helper/envConfig';
import { PRODUCTCATEGORY, PRODUCTList } from "../helper/endpoints";
import CategoryList from './CategoryList';
import Loader from '../components/Loader';
import { handelProductDetail } from '../helper/constants';

const Home = () => {

    const navigate = useNavigate();
    const [category, setcategory] = useState([]);
    const [currentUser, setCorrectUser] = useState("");
    const [productList, setProductList] = useState([]);
    const [trendingProductList, setTrendingProductList] = useState([]);
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
    const breakpoints = {
        0: {
            slidesPerView: 1,
            spaceBetween: 20
        },
        600: {
            slidesPerView: 2,
            spaceBetween: 20
        },
        991: {
            slidesPerView: 3,
            spaceBetween: 20
        },
        1140: {
            slidesPerView: 4,
            spaceBetween: 20
        },
        1300: {
            slidesPerView: 5,
            spaceBetween: 20
        },
    }

    const getCategory = async () => {

        try {
            startAnimation()
            const [categoryResponse, trendingproductListResponse, productListResponse] = await Promise.all([
                api.post(`${serverURL + PRODUCTCATEGORY}`),
                api.post(`${serverURL + PRODUCTList}`, { "product_list_type": "trending-product" }),
                api.post(`${serverURL + PRODUCTList}`, { "product_list_type": "flashsale-products" })
            ]);
            const categoryData = categoryResponse.data.data;
            const productListData = productListResponse.data.data;
            const trendingproductData = trendingproductListResponse.data.data

            setcategory(categoryData);
            setProductList(productListData);
            setTrendingProductList(trendingproductData)

            stopAnimation()
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCategory();
        // setCorrectUser(sessionStorage.getItem("token"))
    }, []);

    const [active, setActive] = useState("1");
    const handleClick = (event) => {
        setActive(event.target.id);
    }

    return (
        <Layout>
            {
                loading ? <Loader startAnimation={startAnimation} stopAnimation={stopAnimation} player={player} /> : (
                    <>
                        <section className='home-first-image'>
                            <div className='container-cos'>
                                <div className='w-100  pointer ' onClick={() => navigate("/categories")}>
                                    <img src="./img/homePageBg1.png" alt="" width={"100%"} />
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className='container-cos'>
                                <div className='discount-offer'>
                                    <Row >
                                        <Col xl={3} lg={3} md={6} sm={6} className='py-4'>
                                            <div className='discount-card'>
                                                <h1>10% OFF</h1>
                                                <p>ORDERS OF $49+</p>
                                            </div>
                                        </Col>
                                        <Col xl={3} lg={3} md={6} sm={6} className='py-4'>
                                            <div className='discount-card mid-border-none'>
                                                <h1>15% OFF</h1>
                                                <p>ORDERS OF $89+</p>
                                            </div>
                                        </Col>
                                        <Col xl={3} lg={3} md={6} sm={6} className='py-4'>
                                            <div className='discount-card '>
                                                <h1>20% OFF</h1>
                                                <p>ORDERS OF $89+</p>
                                            </div>
                                        </Col>
                                        <Col xl={3} lg={3} md={6} sm={6} className='py-4'>
                                            <div className='discount-card mt-1' style={{ borderRight: "none" }}>
                                                <p className='d-flex justify-content-center'><span className='discount-btn'>CODE : HOIYUBN58</span></p>
                                                <p>CAPPED AT $60</p>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </section>

                        <section className='home-second-image ' >
                            <div className='container-cos position-relative'>
                                <div className='w-100 pointer ' onClick={() => navigate("/categories")}>
                                    <img src="./img/homePageBg2.png" alt="" width={"100%"} />
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
                                <div className='mt-5'>
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
                                                <img src='./img/img4.png' alt='' />
                                                <div className='card-text-bottom big-box'>
                                                    <div className='card-text'>
                                                        <h5>RJ Jewellery</h5>
                                                        <span className='my-2 d-block'>From $0.29</span>
                                                    </div>
                                                    <Button className='shop-btn mt-0 mt-3' onClick={() => navigate("/categories")}>Shop Now <MdKeyboardDoubleArrowRight /></Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xl={6} lg={6} md={6} sm={12} className='mt-4'>
                                        <div className='product-s4-card'>
                                            <div className='position-relative'>
                                                <img src='./img/img5.png' alt='' />
                                                <div className='card-text-bottom big-box'>
                                                    <div className='card-text'>
                                                        <h5>FS - Nike Air Max 270 React </h5>
                                                        <span className='my-2 d-block'>Up to 50% off</span>
                                                    </div>
                                                    <Button className='shop-btn mt-0 mt-3' onClick={() => navigate("/categories")}>Shop Now <MdKeyboardDoubleArrowRight /></Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </section>

                        <section className='section-4' style={{ marginTop: "80px" }}>
                            <div className='container-cos'>
                                <div className='title w-100 text-center'>
                                    <h2><span>D</span>AILY DROPS</h2>
                                </div>
                                <Row className=''>
                                    <Col xl={6} lg={6} md={6} sm={12} className='mt-4'>
                                        <div className='product-s4-card' style={{ borderRadius: "0px 0px 15px 15px" }}>
                                            <div className='position-relative'>
                                                <img src='./img/daily-drop-1.png' alt='' />
                                                <div className='card-text-bottom big-box-daily-drops'>
                                                    <Button className='shop-btn mt-0 mt-3' onClick={() => navigate("/categories")}>Shop Now</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xl={6} lg={6} md={6} sm={12} className='mt-4'>
                                        <div className='product-s4-card'>
                                            <div className='position-relative'>
                                                <img src='./img/daily-drop-2.png' alt='' />
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </section>

                        <section className='stylist mb-5'>
                            <div className='container-cos'>
                                <div className='mt-5'>
                                    <Swiper
                                        slidesPerView={4}
                                        spaceBetween={30}
                                        hashNavigation={{
                                            watchState: true,
                                        }}
                                        loop={true}
                                        breakpoints={{
                                            0: {
                                                slidesPerView: 1,
                                                spaceBetween: 20
                                            },
                                            600: {
                                                slidesPerView: 2,
                                                spaceBetween: 20
                                            },
                                            991: {
                                                slidesPerView: 3,
                                                spaceBetween: 20
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
                                                        />
                                                    </SwiperSlide>
                                                )
                                            })
                                        }
                                    </Swiper>
                                </div>
                            </div>
                        </section>

                        <section className='home-first-image ' >
                            <div className='container-cos'>
                                <div className='title w-100 text-center '>
                                    <h2><span>C</span>LUBMALL CAMPAIGNS</h2>
                                </div>
                                <div className='w-100 mt-5 pointer' onClick={() => navigate("/categories")}>
                                    <img src="./img/homePageBg1.png" alt="" width={"100%"} />
                                </div>
                            </div>
                        </section>

                        <section className='home-second-image'>
                            <div className='container-cos position-relative'>
                                <div className='w-100 pointer ' onClick={() => navigate("/categories")}>
                                    <img src="./img/homePageBg2.png" alt="" width={"100%"} />
                                </div>
                                <Button className='shop-the-drop'>Shop The Drop</Button>
                            </div>
                        </section>

                        <section className='stylist mb-5'>
                            <div className='container-cos'>
                                <div className='title w-100 text-center'>
                                    <h2><span>S</span>TYLE GALLERY</h2>
                                </div>
                                <div className='mt-5'>
                                    <Swiper
                                        slidesPerView={4}
                                        spaceBetween={30}
                                        hashNavigation={{
                                            watchState: true,
                                        }}
                                        loop={true}
                                        breakpoints={{
                                            0: {
                                                slidesPerView: 1,
                                                spaceBetween: 20
                                            },
                                            600: {
                                                slidesPerView: 3,
                                                spaceBetween: 20
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

                        <section className='explore my-5'>
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
                )}
        </Layout>
    )
}

export default Home
