import React, { useRef, useState, useEffect, useContext } from 'react'
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
import { handelProductDetail } from '../helper/constants';
import { CartContext } from '../context/CartContext';
import SucessSnackBar from "../components/SnackBar";
import ErrorSnackBar from "../components/SnackBar";
import { Is_Login } from '../helper/IsLogin';
import { isMobile } from 'react-device-detect';
import { handelCategorydata } from '../helper/constants';

const Home = () => {
    const { handelSearch, getSearchedProduct, searchKeyWord, setSearchKeyWord,  setMyMessage, startAnimation, stopAnimation, player, loading, 
        productList, trendingProductList, getProducts,  sucessSnackBarOpen, warningSnackBarOpen, Mymessage, setWarningSnackBarOpen, setSucessSnackBarOpen } = useContext(CartContext);
   
    const textRef = useRef(null);
    const isLoggedIn = Is_Login();
    const navigate = useNavigate();

   
    const [active, setActive] = useState("1");
    const [imageLoaded, setImageLoaded] = useState(false);


    const colorMap = {
        "2": "#EECA94",
        "3": "#893350",
        "4": "#D7C9BE",
        "5": "#DDCAD7",
        "6": "#C49275",
        "7": "#D3C4B1",
        "8": "#DFA6A8",
        "9": "#EECA94",
        "10": "#D7C9BE"
        // Note: changed id to 9 because there were two "8"s in your comment block
    };

    useEffect(() => {
        getProducts();
        // getWishList()
        setSearchKeyWord("")
    }, [isLoggedIn]);

    const handleClick = (event) => {
        setActive(event.target.id);
    }

    const handleCopy = () => {
        if (textRef.current) {
            setMyMessage("Coupon code copied successfully");
            setSucessSnackBarOpen(!sucessSnackBarOpen);
            navigator.clipboard.writeText(textRef.current.innerText)
                .then(() => {
                    console.log('Text copied to clipboard');
                })
                .catch(err => {
                    console.error('Could not copy text: ', err);
                });
        }
    };

    const handleKeyUp = () => {
        handelSearch(searchKeyWord)
        getSearchedProduct()
        navigate("/search")
    };

    const handleChange = (value) => {
        setSearchKeyWord(value);
        handleKeyUp()
    };

    const handelSubCat = (Id) => {
        localStorage.setItem("selectedSubcategories", Id);
        window.location.href = "/categories";
    };


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


                        <section className='home-first-image'>
                            <div className='container-cos'>
                                <div className='w-100  pointer ' onClick={() => (handelCategorydata("64426a1637764b8698579aa0"), localStorage.removeItem("selectedSubcategories"))}>
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
                                                <p>ORDERS OF $120+</p>
                                            </div>
                                        </Col>
                                        <Col className='py-4 pad-cos'>
                                            <div className='discount-card mt-1' style={{ borderRight: "none" }}>
                                                <Button onClick={handleCopy} className='discount-btn mx-auto' >
                                                    CODE : <span ref={textRef} >clubmalltry</span>
                                                </Button>
                                                {/* <p>CAPPED AT $5</p> */}
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </section>

                        <section className='home-second-image ' >
                            <div className='container-cos position-relative'>
                                <div className='w-100 pointer ' onClick={() => (handelCategorydata("6442b56d37764b869857a925"), localStorage.removeItem("selectedSubcategories"))}>
                                    <img src="./img/homePageBg2.webp" alt="" width={"100%"} />
                                </div>
                                <Button onClick={() => (handelCategorydata("6442b56d37764b869857a925"), localStorage.removeItem("selectedSubcategories"))} className='shop-the-drop'>Shop The Drop</Button>
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
                                            1200: {
                                                slidesPerView: 5,
                                                spaceBetween: 20
                                            },
                                            1300: {
                                                slidesPerView: 5,
                                                spaceBetween: 20
                                            },
                                        }}
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
                                    <Col xl={6} lg={6} md={6} sm={12} className='mt-4 pointer' onClick={() => (handelCategorydata("6488512c483f4ea550675331"), localStorage.removeItem("selectedSubcategories"))}>
                                        <div className='product-s4-card'>
                                            <div className='position-relative'>
                                                <img src='./img/img4.svg' alt='' />
                                                <div className='card-text-bottom big-box'>
                                                    <div className='card-text'>
                                                        <h5>Jewelry</h5>
                                                        <span className='my-2 d-block'>From $0.29</span>
                                                    </div>
                                                    <Button className='shop-btn mt-0 mt-3' >Shop Now <MdKeyboardDoubleArrowRight /></Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xl={6} lg={6} md={6} sm={12} className='mt-4 mar-top-10 pointer' onClick={() => (handelCategorydata("644804f095c53d0f01ab0782"), localStorage.removeItem("selectedSubcategories"))}>
                                        <div className='product-s4-card'>
                                            <div className='position-relative'>
                                                <img src='./img/img5.svg' alt='' />
                                                <div className='card-text-bottom big-box'>
                                                    <div className='card-text'>
                                                        <h5>FS - Nike Air Max 270 React </h5>
                                                        <span className='my-2 d-block'>Up to 50% off</span>
                                                    </div>
                                                    <Button className='shop-btn mt-0 mt-3' >Shop Now <MdKeyboardDoubleArrowRight /></Button>
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
                                    <Col xl={6} lg={6} md={6} sm={12} className='mt-4 pointer' onClick={() => (handelCategorydata("6443aac367efa3bfcab97f69"), localStorage.removeItem("selectedSubcategories"))}>
                                        <div className='product-s4-card' style={{ borderRadius: "0px 0px 15px 15px" }}>
                                            <div className='position-relative'>
                                                <img src='./img/daily-drop-1.webp' alt='' />
                                                <div className='card-text-bottom big-box-daily-drops'>
                                                    <Button className='shop-btn mt-0 mt-3' >Shop Now</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xl={6} lg={6} md={6} sm={12} className='mt-4 mar-top-10 pointer' onClick={() => (handelCategorydata("6442936437764b869857a33e"), localStorage.removeItem("selectedSubcategories"))}>
                                        <div className='product-s4-card'  >
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

                                            isMobile === false &&

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

                                        {
                                            isMobile === true &&
                                            trendingProductList.productListArrObj?.map((e) => {
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
                                    <div className='w-100 d-flex justify-content-center'>
                                        <Button className='shop-btn btn-cos-mobile' onClick={() => navigate("/trending")} > View More <MdKeyboardDoubleArrowRight /></Button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className='home-first-image mar-top-10' >
                            <div className='container-cos'>
                                <div className='title w-100 text-center '>
                                    <h2><span>C</span>LUBMALL CAMPAIGNS</h2>
                                </div>
                                <div className='w-100 mt-5 pointer mar-top-20' onClick={() => (handelCategorydata("6442c8b437764b869857ac13"), localStorage.removeItem("selectedSubcategories"))}>
                                    <img src="./img/homePageBg3.webp" alt="" width={"100%"} />
                                </div>
                            </div>
                        </section>

                        <section className='home-second-image' onClick={() => (handelSubCat("64493af9b4e98da026bbd859"), handelCategorydata("6447cf2d4140dd3938c74c35"))}>
                            <div className='container-cos position-relative'>
                                <div className='w-100 pointer '>
                                    <img src="./img/homePageBg4.webp" alt="" width={"100%"} />
                                </div>
                                <Button className='shop-the-drop' >Shop The Drop</Button>
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

                                            isMobile === false &&
                                            productList.productListArrObj?.slice(5, 10).map((e) => {
                                                return (

                                                    <SwiperSlide>
                                                        <div className='product-card stylist-card1 position-relative p-0 position-relative shop-btn-up'>
                                                            <img
                                                                src="./img/placeholder_img.webp"
                                                                alt=''
                                                                className='img-fluid'
                                                                style={{ display: imageLoaded ? 'none' : 'block' }}
                                                            />
                                                            <img onLoad={() => setImageLoaded(true)}
                                                                style={{ display: imageLoaded ? 'block' : 'none' }}
                                                                src={productList?.productImagePath + e._id + "/" + e.product_images[0]?.file_name} alt={e.name} className='w-100 img-size' />
                                                            <Button className='shop-now' onClick={() => handelProductDetail(e._id)} >Shop Now</Button>
                                                        </div>
                                                    </SwiperSlide>
                                                )
                                            })
                                        }

                                        {

                                            isMobile === true &&
                                            productList.productListArrObj && productList.productListArrObj?.map((e) => {
                                                return (
                                                    <SwiperSlide>
                                                        <div className='product-card stylist-card1 position-relative p-0 position-relative shop-btn-up'>
                                                            <img
                                                                src="./img/placeholder_img.webp"
                                                                alt=''
                                                                className='img-fluid'
                                                                style={{ display: imageLoaded ? 'none' : 'block' }}
                                                            />
                                                            <img
                                                                onLoad={() => setImageLoaded(true)}
                                                                style={{ display: imageLoaded ? 'block' : 'none' }}
                                                                src={productList?.productImagePath && productList?.productImagePath + e._id + "/" + e.product_images[0]?.file_name} alt={e.name} className='w-100' />
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


                                    <Button className={active === "2" ? "active" : undefined} style={{ backgroundColor: "#2D4658" }} id={"2"} onClick={(e) => (handleClick(e), handleChange("Spring"))} >Spring</Button>
                                    <Button className={active === "3" ? "active" : undefined} style={{ backgroundColor: "#893350" }} id={"3"} onClick={(e) => (handleClick(e), handleChange("Makeup"))} >Makeup</Button>
                                    <Button className={active === "4" ? "active" : undefined} style={{ backgroundColor: "#D7C9BE" }} id={"4"} onClick={(e) => (handleClick(e), handleChange("Denim"))} >Denim</Button>
                                    <Button className={active === "5" ? "active" : undefined} style={{ backgroundColor: "#DDCAD7" }} id={"5"} onClick={(e) => (handleClick(e), handleChange("Girls"))} >Girls</Button>
                                    <Button className={active === "6" ? "active" : undefined} style={{ backgroundColor: "#C49275" }} id={"6"} onClick={(e) => (handleClick(e), handleChange("Beauty"))} >Beauty</Button>
                                    <Button className={active === "7" ? "active" : undefined} style={{ backgroundColor: "#D3C4B1" }} id={"7"} onClick={(e) => (handleClick(e), handleChange("Style"))} >Style</Button>
                                    <Button className={active === "8" ? "active" : undefined} style={{ backgroundColor: "#DFA6A8" }} id={"8"} onClick={(e) => (handleClick(e), handleChange("Elegant"))}  >Elegant</Button>
                                    <Button className={active === "8" ? "active" : undefined} style={{ backgroundColor: "#EECA94" }} id={"8"} onClick={(e) => (handleClick(e), handleChange("Cool"))}  >Cool</Button>
                                </div>
                            </div>
                        </section>
                    </>
                )
            }
        </>
    )
}

export default Home
