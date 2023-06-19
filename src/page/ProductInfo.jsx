import React, { useRef, useState, useEffect, useContext } from 'react'
import Layout from '../layout/Layout'
import { Button, Col, Modal, NavLink, Offcanvas, Row } from 'react-bootstrap'
import {
    MdOutlineKeyboardArrowRight,
    MdOutlineKeyboardArrowDown,
    MdKeyboardDoubleArrowRight,
    MdOutlineClose
} from "react-icons/md"
import { Link } from 'react-router-dom'
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import ProCard from '../components/ProCard';
import { data } from "../page/Data"
import ProductSlider from '../components/ProductSlider';
import { cartListData, colors } from '../helper/constants';
import api from "../helper/api";
import { getServerURL } from '../helper/envConfig';
import { PRODUCTDETAIL, ADDTOCART, PRODUCTList } from "../helper/endpoints";
import SucessSnackBar from "../components/SnackBar";
import ErrorSnackBar from "../components/SnackBar";
import { useNavigate } from 'react-router-dom'
import { errorResponse, afterLogin, handelCategorydata } from '../helper/constants'
import Loader from '../components/Loader';
import { Is_Login } from '../helper/IsLogin'
import { BsThreeDots } from 'react-icons/bs'
import { CartContext } from '../context/CartContext'
// import { useContext } from 'react'
const ProductInfo = () => {
    const { setCart, cart } = useContext(CartContext);
    const isLoggedIn = Is_Login();
    const navigate = useNavigate();
    const [perActive, setPerActive] = useState('Individual');
    const [sucessSnackBarOpen, setSucessSnackBarOpen] = useState(false);
    const [warningSnackBarOpen, setWarningSnackBarOpen] = useState(false);
    const [Mymessage, setMyMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const player = useRef();
    const [drawer, setDrawer] = useState(false);
    const handleDrawerClose = () => setDrawer(false);
    const handleDrawerShow = () => setDrawer(true);
    const serverURL = getServerURL();
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const [Product, setProduct] = useState({})
    const [productList, setProductList] = useState([]);
    const [favoriteProductList, setFavoriteProductList] = useState([]);
    const [trendingProductList, setTrendingProductList] = useState([]);
    const [sizeActive, setSizeActive] = useState("")
    const [productColorActive, setProductColorActive] = useState()
    const [colorProduct, setColorProduct] = useState()
    const product_id = localStorage.getItem("selectedProductId") ? localStorage.getItem("selectedProductId") : "646b6db53c9cae7c199c7740"

    const startAnimation = () => {
        if (player.current) {
            player.current.play();
        }
    };
    const stopAnimation = () => {
        setLoading(false);
    };

    const getProductDetail = async () => {
        startAnimation()

        try {
            if (product_id) {
                const [productDetail] = await Promise.all([
                    api.get(`${serverURL + PRODUCTDETAIL + `?product_id=${product_id}`}`)
                ]);
                const productData = productDetail.data.data;
                setProduct(productData);
                setProductColorActive(productDetail.data.data.productList?.sku_attributes?.color[0]?.name && productDetail.data.data.productList?.sku_attributes?.color[0]?.name)
                stopAnimation()
                const imageUrls = (productData?.productList?.sku_attributes?.color && productData?.productList?.sku_attributes?.color?.map(e => e.imgUrl))
                const mergedImages = imageUrls && imageUrls?.map(url => ({
                    thumbnail: url,
                    original: url,
                }));

                setColorProduct(mergedImages)
            }

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getProductDetail();
    }, []);


    const getproductlist = async () => {

        try {
            startAnimation()
            const [trendingproductListResponse, favorites] = await Promise.all([
                api.post(`${serverURL + PRODUCTList}`, { "product_list_type": "trending-product" }),
                api.post(`${serverURL + PRODUCTList}`, {
                    product_list_type: "recommended-products",
                    page: 1
                })]);
            const favoriteproductData = favorites.data.data;
            const trendingproductData = trendingproductListResponse.data.data
            setFavoriteProductList(favoriteproductData);
            setTrendingProductList(trendingproductData)
            stopAnimation()
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getproductlist();
    }, []);


    const findSKUId = () => {
        const sku = Product.productList.sku_details.find((sku) => {
            return sku.attrs[0].color === productColorActive && sku.attrs[0].size === sizeActive;
        });

        return sku ? sku.skuid : null;
    };


    const handleCart = async (e) => {

        try {

            if (productColorActive && (sizeActive || Product.productList?.sku_attributes.size == undefined)) {

                if (isLoggedIn) {
                    let data = {
                        action: "add-to-cart-product",
                        seller_id: Product.productList.user_id._id,
                        product_id: Product.productList._id,
                        product_price: Product.productList.individual_price,
                        product_price_type: 1,
                        product_tax: 0,
                        group_id: null,
                        skuid: findSKUId(),
                    }

                    const res = await api.postWithToken(`${serverURL}${ADDTOCART}`, data)

                    if (res.data.success == true) {
                        setCart(cart + 1)
                        setSucessSnackBarOpen(!sucessSnackBarOpen);
                        setMyMessage(res.data.message);
                        setProductColorActive(" ")
                        setSizeActive(" ")
                    } else if (res.data.success === false) {
                        setMyMessage(res.data.message);
                        setWarningSnackBarOpen(!warningSnackBarOpen);
                    }
                } else {
                    // User is not logged in, redirect to the login page
                    afterLogin(setMyMessage)
                    setWarningSnackBarOpen(!warningSnackBarOpen);
                }
            } else {
                setMyMessage("select color and size  of the product");
                setWarningSnackBarOpen(!warningSnackBarOpen);
            }
        } catch (error) {
            setProductColorActive(" ")
            setSizeActive(" ")
            errorResponse(error, setMyMessage)
            setWarningSnackBarOpen(!warningSnackBarOpen);
        }
    };


    const textRef = useRef(null);

    const handleCopy = () => {
        if (textRef.current) {
            const range = document.createRange();
            range.selectNode(textRef.current);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            document.execCommand('copy');
            window.getSelection().removeAllRanges();
        }
    };

    return (
        <Layout>

            {
                loading ? <Loader startAnimation={startAnimation} stopAnimation={stopAnimation} player={player} /> : (
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

                        <div className='product-info pt-4 pb-5'>
                            <div className='container-cos'>

                                <div className='page-path d-flex align-items-center gap-1'>
                                    <div className='d-flex align-items-center gap-1'>
                                        <NavLink>Home</NavLink>
                                        <MdOutlineKeyboardArrowRight />
                                    </div>
                                    <div className='d-flex align-items-center gap-1'>
                                        <NavLink> {Product.productList?.product_category_keys?.product_category_one.name} Kid’s Fashion</NavLink>
                                        <MdOutlineKeyboardArrowRight />
                                    </div>
                                    <div className='d-flex align-items-center gap-1'>
                                        <NavLink>{Product.productList?.product_category_keys?.product_category_two.name}</NavLink>
                                        <MdOutlineKeyboardArrowRight />
                                    </div>
                                    <NavLink className='active'>  {Product.productList?.name} </NavLink>
                                </div>

                                <Row className='mt-4'>
                                    <Col lg={6} md={12}>
                                        <div className='position-relative'>
                                            <Button className='wishlist-btn'><img src='./img/header/wishlist.png' alt='' width="25px" /></Button>
                                            <ProductSlider colorProduct={colorProduct} productImagePath={Product.productImagePath} productList={Product.productList?.product_images} id={Product.productList?._id && Product.productList?._id} />
                                        </div>
                                        <div className='review shipping-def py-4 d-flex align-items-center justify-content-between'>
                                            <div className='d-flex align-items-center gap-3'>

                                                <h5 className='info-title border-right-cos cos-title'> {Product.productList?.rating_count} shop reviews</h5>
                                                <div className='rate d-flex align-items-center gap-2'>
                                                    <span className='cos-title'>{Product.productList.rating}</span>
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


                                        {Product.productList?.rating_count == 0 &&
                                            <div className='no-review py-4'>
                                                <h5 className='info-title '>No item reviews yet</h5>
                                                <p>But this shop has 225 reviews for other items. Check out shop reviews <MdOutlineKeyboardArrowDown /></p>
                                            </div>
                                        }

                                        <div className='together'>
                                            <div className='no-review frequently py-2 pt-0 pt-sm-4   d-flex align-items-center justify-content-between'>
                                                <h5 className='info-title cos-title'>Frequently bought together</h5>
                                                <Button > <Link to="/categories" >See all <MdOutlineKeyboardArrowRight /> </Link>  </Button>
                                            </div>
                                            <div>
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
                                                        425: {
                                                            slidesPerView: 2,
                                                            spaceBetween: 10
                                                        },
                                                        650: {
                                                            slidesPerView: 2,
                                                            spaceBetween: 10
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

                                                    {

                                                        !favoriteProductList.productListArrObj ? <Loader startAnimation={startAnimation} stopAnimation={stopAnimation} player={player} /> : (
                                                            <>
                                                                {

                                                                    favoriteProductList.productListArrObj
                                                                    && favoriteProductList.productListArrObj?.slice(0, 5)?.map((e) => {
                                                                        return (
                                                                            <SwiperSlide>
                                                                                <div className='slide-box'>
                                                                                    <div className='position-relative'>
                                                                                        <img src={favoriteProductList.productImagePath + e._id + "/" + e.product_images[0]?.file_name} alt='' className='w-100' />
                                                                                    </div>
                                                                                    <div className='slider-box-per pt-3'>

                                                                                        <div className='d-flex align-items-center gap-2 mt-3'>
                                                                                            <h5>${e.individual_price}</h5>
                                                                                            <del>${e.group_price}</del>
                                                                                            <span>{e.in_stock > 0 ? e.in_stock : 0} sold</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </SwiperSlide>
                                                                        )
                                                                    })
                                                                }

                                                            </>
                                                        )}

                                                </Swiper>

                                                {/* <div className='d-flex justify-content-center'>
                                                    <Button className='add-items' onClick={handleDrawerShow}>Add 3 items to cart: <b>$36.45</b> <del>$534,33</del></Button>
                                                </div> */}


                                            </div>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={12} className='mt-5 mt-lg-0'>
                                        <div className='pro-def'>
                                            <h6> {Product.productList?.name}</h6>

                                            {/* <div className='brand my-3'>
                                                <p><span>By</span> <img src='./img/product_def/uppack.png' alt='' />  {Product.stockData?.recent_bought_name} ({Product.stockData?.order_count}K + sold)</p>
                                            </div> */}

                                            <div className='per-pro d-flex align-items-end gap-2 mt-2'>
                                                <h3> ${Product.productList?.individual_price}</h3>
                                                <del>${Product.productList?.group_price}</del>
                                                <span>{Math.round(Product.productList?.group_price * 100 / Product.productList?.individual_price)}% Off</span>
                                            </div>

                                            <div className='price Individual-per mt-3 gap-3 d-flex align-items-center mobile-row'>
                                                <Button className={`${perActive === "Individual" ? "active" : ""}`} onClick={() => setPerActive('Individual')}>Individual Price <br />
                                                    ${Product.productList?.individual_price}</Button>
                                                <Button className={`${perActive === "Group" ? "active" : ""}`} onClick={() => {
                                                    handleShow();
                                                    setPerActive('Group')
                                                }}>Group Price: <br />
                                                    ${Product.productList?.group_price}</Button>
                                            </div>

                                            {/* <p className='interest mt-3'>4 interest-free installments of <span>$4.25</span> with
                                                <img src='./img/after.png' alt='' />
                                                or
                                                <img src='./img/kla.png' alt='' />
                                            </p> */}

                                            {/* <div className='order-time d-flex align-items-center justify-content-between mt-4'>
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
                                            </div> */}

                                            <div className='product-color mt-4'>
                                                <h5>Color:   <span style={{ color: "rgb(224, 46, 36, 1)" }}>{productColorActive}</span></h5>
                                                <div className='d-flex align-items-center flex-wrap mt-2 gap-2'>
                                                    {
                                                        Product?.productList?.sku_attributes?.color && Product.productList?.sku_attributes.color?.map((e, i) => {
                                                            return (
                                                                // <Button className={`color-btn ${productColorActive === e.name ? "active" : ""}`} onClick={() => setProductColorActive(e.name)}>
                                                                <Button className={`${productColorActive === e.name ? "active" : ""} color-btn`} onClick={() => setProductColorActive(e.name)}>
                                                                    <img className='colors' src={e.imgUrl} alt='' />
                                                                </Button>
                                                            )
                                                        })
                                                    }
                                                </div>

                                                <div className='size mt-4'>
                                                    {Product.productList?.sku_attributes.size !== undefined && <h5>   Size:  <span style={{ color: "rgb(224, 46, 36, 1)" }}>{" " + sizeActive}</span></h5>}
                                                    <div className='d-flex align-items-center gap-2 mt-2 flex-wrap'>
                                                        {
                                                            Product.productList?.sku_attributes.size?.map((e, i) => {
                                                                return (
                                                                    <Button className={`${sizeActive === e.name ? "active" : ""}`} onClick={() => setSizeActive(e.name)}>
                                                                        {e.name}
                                                                    </Button>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                    {/* <div className='qty mt-4 pt-2 d-flex align-items-center gap-3'>
                                        <h5>Qty:</h5>
                                        <div className='count-product'>
                                            <Button onClick={(e) => setCount((e) => e - 1)}> <MdRemove /></Button>
                                            <span>{count}</span>
                                            <Button onClick={(e) => setCount((e) => e + 1)}><MdAdd /></Button>
                                        </div>
                                    </div> */}
                                                </div>

                                            </div>

                                            <Button onClick={handleCart} className='add-cart-items mt-4'>Add to cart</Button>

                                            {/* <div className='shipping-def mt-4'> */}
                                            {/* <div className='stock d-flex align-items-center gap-2'>
                                                    <span className='d-flex align-items-center gap-2'>
                                                        <img src='./img/product_def/stok-limit.png' alt='' />
                                                        Selling fast!
                                                    </span>
                                                    <p>Only  {Product.stockData?.stocks_left > 0 ? Product.stockData?.stocks_left : 1} left in stock</p>
                                                </div> */}
                                            {/* <h5 className='info-title my-4'>Shipping & Return</h5> */}
                                            {/* <div className='shipping-order'>
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
                                                </div> */}
                                            {/* <div className='sub-title-info d-flex align-items-center gap-2 mt-4'>
                                                    <img src='./img/product_def/return.png' alt='' />
                                                    <span className='d-flex align-items-center gap-1'>Free returns <p>•</p> Price adjustment <MdOutlineKeyboardArrowRight /></span>
                                                </div> */}
                                            {/* <div className='sub-title-info d-flex align-items-center gap-2 mt-3'>
                                                    <img src='./img/product_def/commited.png' alt='' />
                                                    <span className='d-flex align-items-center gap-1'>Clubmall is commited to environmental sustainability</span>
                                                </div> */}
                                            {/* </div> */}

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

                                                {/* <div className='d-flex align-items-center copy-div gap-3'>
                                                    <span>Item ID: {Product.productList?.attributes["Product ID"][0]} </span>
                                                    <Button className='copy-btn'>Copy</Button>
                                                </div> */}
                                                {Object.entries(Product.productList?.attributes || {})?.map(([key, value], index) => (
                                                    <div key={index}>
                                                        {key === "Product ID" ? (
                                                            <div className='d-flex align-items-center copy-div gap-3'>
                                                                <span className='d-flex align-items-center'>Item ID: <p ref={textRef} className='ms-1'>{value[0]}</p></span>
                                                                <Button className='copy-btn' onClick={handleCopy}>Copy</Button>
                                                            </div>
                                                        ) : (
                                                            <span>{key}: {Array.isArray(value) ? value.join(", ") : value}</span>
                                                        )}
                                                    </div>
                                                ))}

                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                                <div className='review mt-5 mar-top-20'>
                                    <h4 className='info-title'>All Reviews (6)</h4>
                                    <div className=''>
                                        <div className='d-flex align-items-start review-box gap-3 mt-4'>
                                            <img src='./img/cart/cart1.png' alt='' width="150px" className='review-img' />
                                            <div className='review-items-def w-100 d-flex align-items-start justify-content-between'>
                                                <div className='review-text'>
                                                    <h5>Me ha gustado mucho Fresquita parecido a la bambula Uso S pero me pido M para que cuelgue un poco</h5>
                                                    <span>16 May, 2023</span>
                                                    <div className='d-flex align-items-center gap-1'>
                                                        <img src='./img/product_def/rate.png' alt='' />
                                                        <img src='./img/product_def/rate.png' alt='' />
                                                        <img src='./img/product_def/rate.png' alt='' />
                                                        <img src='./img/product_def/rate.png' alt='' />
                                                        <img src='./img/product_def/nonrate.png' alt='' />
                                                    </div>
                                                    <div className='flex-wrap color-def d-flex align-items-center mb-3 mt-2'>
                                                        <p><b>Overall Fit:</b> True to Size</p>
                                                        <p><b>Color:</b> Olive Green</p>
                                                        <p><b>Size:</b> M</p>
                                                    </div>
                                                </div>
                                                <div className='d-flex align-items-center gap-3 review-like'>
                                                    <Button>
                                                        <img src='./img/for_you/like.png' alt='' />
                                                    </Button>
                                                    <Button>
                                                        <BsThreeDots />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='d-flex align-items-start review-box gap-3 mt-4'>
                                            <img src='./img/cart/cart1.png' alt='' width="150px" className='review-img' />
                                            <div className='review-items-def w-100 d-flex align-items-start justify-content-between'>
                                                <div className='review-text'>
                                                    <h5>Me ha gustado mucho Fresquita parecido a la bambula Uso S pero me pido M para que cuelgue un poco</h5>
                                                    <span>16 May, 2023</span>
                                                    <div className='d-flex align-items-center gap-1'>
                                                        <img src='./img/product_def/rate.png' alt='' />
                                                        <img src='./img/product_def/rate.png' alt='' />
                                                        <img src='./img/product_def/rate.png' alt='' />
                                                        <img src='./img/product_def/rate.png' alt='' />
                                                        <img src='./img/product_def/nonrate.png' alt='' />
                                                    </div>
                                                    <div className='flex-wrap color-def d-flex align-items-center mb-3 mt-2'>
                                                        <p><b>Overall Fit:</b> True to Size</p>
                                                        <p><b>Color:</b> Olive Green</p>
                                                        <p><b>Size:</b> M</p>
                                                    </div>
                                                </div>
                                                <div className='d-flex align-items-center gap-3 review-like'>
                                                    <Button>
                                                        <img src='./img/for_you/like.png' alt='' />
                                                    </Button>
                                                    <Button>
                                                        <BsThreeDots />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='recent-view mar-top-20'>
                                    <h4>Items you may want to add</h4>
                                    <div className='mb-0 explore-main'>
                                        {
                                            trendingProductList.productListArrObj?.map((e) => {
                                                return (
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
                                                )
                                            })
                                        }
                                        <div className='w-100 d-flex justify-content-center'>
                                            <Button className='shop-btn rotate-img btn-cos-mobile' onClick={() => handelCategorydata()} >View More <MdKeyboardDoubleArrowRight /></Button>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* cart drawer */}
                            {/* <Offcanvas show={drawer} onHide={handleDrawerClose} placement="end" className="cart-canvas">
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
                                                cartListData.slice(0, 3)?.map((e, i) => {
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
                            </Offcanvas> */}


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
                    </>
                )
            }
        </Layout >
    )
}

export default ProductInfo
