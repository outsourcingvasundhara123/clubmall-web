import React, { useRef, useState, useEffect, useContext } from 'react'
import { Button, Col, Form, Modal, NavLink, Row, Table } from 'react-bootstrap'
import {
    MdOutlineKeyboardArrowRight,
    MdKeyboardDoubleArrowRight,
    MdOutlineClose

} from "react-icons/md"
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import ProCard from '../components/ProCard';
import ProductSlider from '../components/ProductSlider';
import api from "../helper/api";
import { getServerURL } from '../helper/envConfig';
import { PRODUCTDETAIL, ADDTOCART, PRODUCTList } from "../helper/endpoints";
import SucessSnackBar from "../components/SnackBar";
import ErrorSnackBar from "../components/SnackBar";
import { useNavigate } from 'react-router-dom'
import { errorResponse, afterLogin } from '../helper/constants'
import Loader from '../components/Loader';
import { Is_Login } from '../helper/IsLogin'
import { CartContext } from '../context/CartContext'
import { Rating } from '@mui/material'
import { handelCategorydata } from '../helper/constants'
import { handelProductDetail } from '../helper/constants'
import { useParams } from 'react-router-dom';
import { RWebShare } from "react-web-share";
import { FiUpload } from 'react-icons/fi'
import { isMobile } from 'react-device-detect';
import { createJsonLdSchema } from './productjson';
import ProductGif from '../components/ProductGif'
import reporticon from '../assets/img/fluent-mdl2_message-1.png';



const ProductChartModal = ({ sizeChartTitle, onHide, sizeChartDescription, rows, columns, toggleSizeChartUnit, isInInch }) => {
    const maxRows = Math.max(...rows.map(item => columns.filter(col => col.row_name === item.name).length));

    return (
        <Modal show={true} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title className='amazone-text'>{sizeChartTitle}</Modal.Title>
                
            </Modal.Header>
            <Modal.Body>
                {sizeChartDescription ? (
                    <>
                        <p className='amazone-text'>{sizeChartDescription}</p>
                        <Button onClick={toggleSizeChartUnit} className="size-chart-button" style={{position:'relative',bottom:'25px',left:'626px'}}>
                            {isInInch ? 'Size Chart in Cm' : 'Size Chart in Inch'}
                        </Button>
                        <br></br>
                        <Table striped bordered hover className='size-chart-modal amazone-text'>
                            <tbody className="d-flex amazone-text">
                                {rows.map((item, i) => {
                                    const rowData = columns.filter(col => col.row_name === item.name);
                                    return (
                                        <div key={i} className='w-100'>
                                            <tr className='d-flex flex-row justify-content-center' style={{ backgroundColor: "#f0f2f2" }}>
                                                <td className="border-0 amazone-text">{item.name}</td>
                                            </tr>
                                            <tr className="d-flex flex-column">
                                                {rowData.map((sub, j) => (
                                                    <td key={j}>{sub.name}</td>
                                                ))}
                                                {[...Array(maxRows - rowData.length)].map((_, j) => (
                                                    <td key={j} className='amazone-text'>-</td>
                                                ))}
                                            </tr>
                                        </div>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </>
                ) : (
                    <p style={{ color: 'red', fontSize: '500' }}>Size chart not available</p>
                )}
            </Modal.Body>
        </Modal>
    );
};

const CustEmailModal = ({ onHide }) => {
    return (
        <Modal show={true} onHide={onHide} size="lg" centered >
            <Modal.Header closeButton>
                Report an issue
            </Modal.Header>
            <Modal.Body>
                <div className='footer-bottom' >
                    <p className='custemailtext' >
                        If you want to leave any positive or negative feedback, you can always mail to
                        <a href="mailto:asouare@clubmall.com"> asouare@clubmall.com </a>
                        – We are thankful for any feedback.
                    </p>
                </div>
            </Modal.Body>
            <style jsx>{`
            .footer-bottom p
            {
                position: relative;
                top: -21px;
            }
                @media (max-width: 768px) {
                    .modal-content {
                        height: 200px; /* Example height for smaller screens */
                    }
                }
            `}</style>
        </Modal>
    );
};
const ProductInfo = () => {


    const { getcartcount, handleShow, addcartLocal, addProductDetailsToLocal, handleDrawerShow, setMainLoder, addWishList, generateDynamicLink, getCartData, cartList, add_wished_Called, Mymessage, setSucessSnackBarOpen, sucessSnackBarOpen, setWarningSnackBarOpen, warningSnackBarOpen, sellIs_wished, activeImage, setActiveImage } = useContext(CartContext);
    const name = localStorage.getItem("name")
    const initialValues = {
        action: "create",
        product_id: "",
        content: "",
        rating: "",
        title: name,
        vendor_id: "",
        review_type: "",
        review_files: ""
    };

    const isLoggedIn = Is_Login();
    const navigate = useNavigate();
    const [values, setValues] = useState(initialValues);

    const defaultProfile = `../img/for_you/defaultuser.png`
    const [perActive, setPerActive] = useState('Individual');
    const [sucessSnackBarOpenProductDtl, setSucessSnackBarOpenProductDtl] = useState(false);
    const [warningSnackBarOpenProductDtl, setWarningSnackBarOpenProductDtl] = useState(false);
    const [MymessageProductDtl, setMyMessageProductDtl] = useState("");
    const [loading, setLoading] = useState(true);
    const player = useRef();
    const [url, setUrl] = useState("");
    const [submitLoderRv, setSubmitLoderRv] = useState(false);
    const serverURL = getServerURL();
    const [isfilter, setIsFilter] = useState(false);

    //install app popup
    // const [show, setShow] = useState(false);
    // const handleShow = () => setShow(true);
    // const handleClose = () => setShow(false);


    const [page, setPage] = useState(1);
    const [Product, setProduct] = useState({})
    const [reviweList, setReviweList] = useState([]);
    const [favoriteProductList, setFavoriteProductList] = useState([]);
    const [trendingProductList, setTrendingProductList] = useState([]);
    const [sizeActive, setSizeActive] = useState("")
    const [product_qtyActive, setProduct_QtyActive] = useState(1);
    const [productColorActive, setProductColorActive] = useState()
    const [colorProduct, setColorProduct] = useState()
    // const product_id = localStorage.getItem("selectedProductId") && localStorage.getItem("selectedProductId")  
    const [reviewShow, setreviewShow] = useState(false);
    const handlereviewShow = () => {
        if (isLoggedIn) {
            setreviewShow(true);
        } else {
            // User is not logged in, redirect to the login page
            afterLogin(setMyMessageProductDtl)
            setWarningSnackBarOpenProductDtl(!warningSnackBarOpenProductDtl);
        }

    }

    const handlereviewClose = () => setreviewShow(false);
    const { id } = useParams();
    const product_id = id
    const initialValues_2 = {
        "action": "list",
        "filter_by": [],
        "rating_value": [],
        "sort_by": "",
        product_id: product_id,

    };
    const [filters, setFilters] = useState(initialValues_2);

    const [showSizeChart, setShowSizeChart] = useState(false);
    const [isInInch, setIsInInch] = useState(true);
    const [showcustemail, setShowCustEmail] = useState(false);

    const handleSizeChartClick = () => {
        setShowSizeChart(true);
    };
    const handleCustEmailClick = () => {
        setShowCustEmail(true);
    };
    const handleSizeChartClose = () => {
        setShowSizeChart(false);
    };
    const handleCustEmailClose = () => {
        setShowCustEmail(false);
    };
    const toggleSizeChartUnit = () => setIsInInch(!isInInch);

    const handelreviewFilter = (e) => {
        setPage(1)
        const { name, value } = e.target;

        if (name === "filter_by") {
            setFilters((prevValues) => ({
                ...prevValues,
                filter_by: [value],
            }));
        } else if (name === "rating_value" && value !== "") {
            setFilters((prevValues) => ({
                ...prevValues,
                rating_value: [value],
            }));
        } else {
            setFilters((prevValues) => ({
                ...prevValues,
                [name]: value,
            }));
        }
        setMainLoder(true)
        setIsFilter(false)
    };

    const [shareLink, setShareLink] = useState('');
    const [imagePreview, setImagePreview] = useState([]);

    // wishlist 
    const [isWishlist, setIsWishlist] = useState(Product?.isWishList === 1);

    useEffect(() => {
        setIsWishlist(Product?.isWishList === 1);
    }, [Product.isWishList]);

    const handleWishlistClick = async () => {
        const newWishlistStatus = !isWishlist;
        setIsWishlist(newWishlistStatus);

        if (newWishlistStatus) {
            await addWishList(Product.productList?._id, "product-wishlist");
        } else {
            await addWishList(Product.productList?._id, "product-delete-wishlist");
        }
    }


    const handelSubCat = (Id) => {
        localStorage.setItem("selectedSubcategories", Id);
        window.location.href = "/categories";
    };

    const startAnimation = () => {
        if (player.current) {
            player.current.play();
        }
    };
    
    const stopAnimation = () => {
        setLoading(false);
    };

    const uniqueColors = (colors) => {
        const unique = [];
        colors.forEach(color => {
            if (!unique.find(c => c.attrs[0].color === color.attrs[0].color)) {
                unique.push(color);
            }
        });
        return unique;
    }

    const getProductDetail = async () => {
        startAnimation();
        try {
            const apiTyp = isLoggedIn ? api.getWithToken : api.get;
            if (product_id && product_id !== undefined) {
                const productDetail = await apiTyp(`${serverURL + PRODUCTDETAIL + `?product_id=${product_id}`}`);

                const productData = productDetail.data.data;
                setProduct(productData);
                setProductColorActive(productData?.productList?.sku_details[0]?.attrs[0]?.color)
                setSizeActive(productData?.productList?.sku_details[0]?.attrs[0]?.size);
                setProduct_QtyActive(productData?.productList?.product_qty[0]);
                stopAnimation();
                setUrl(productData.productImagePath);
                const uniqueColorDetails = uniqueColors(productData.productList.sku_details);
                const imageUrls = uniqueColorDetails.map(e => `${productData.productImagePath + productData.productList._id + "/" + e.file_name}`);
                const mergedImages = imageUrls.map(url => ({
                    thumbnail: url,
                    original: url,
                }));
                setColorProduct(mergedImages);

            } else {
                navigate("/");
            }

        } catch (error) {
            console.log(error, "error");
            navigate("/");
        }
    };

    const getProductReview = async () => {
        startAnimation()
        const apiTyp = isLoggedIn ? api.postWithToken : api.post;
        try {
            if (product_id) {
                filters.page = page
                const [productReview] = await Promise.all([
                    apiTyp(`${serverURL + "product-review-list"}`, filters)
                ]);

                if (isfilter) {
                    const updateProductList = [...reviweList, ...productReview.data.data.list]
                        .filter((product, index, self) => self.findIndex(p => p._id === product._id) === index);
                    setReviweList(updateProductList)
                } else {
                    setReviweList(productReview.data.data.list)

                }
            }
            setMainLoder(false)
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        getProductDetail();
        getProductReview()
    }, [product_id, isLoggedIn, isWishlist, add_wished_Called, filters, page]);


    // useEffect(() => {
    //     getProductReview()
    // }, [page]);


    const getproductlist = async () => {

        const apiTyp = isLoggedIn ? api.postWithToken : api.post;

        try {
            startAnimation()
            const [trendingproductListResponse, favorites] = await Promise.all([
                apiTyp(`${serverURL + PRODUCTList}`, { "product_list_type": "trending-product" }),
                api.post(`${serverURL + PRODUCTList}`, {
                    product_list_type: "recommended-products",
                    page: 1
                })]);
            const favoriteproductData = favorites.data.data;
            const trendingproductData = trendingproductListResponse.data.data;
            setFavoriteProductList(favoriteproductData);
            setTrendingProductList(trendingproductData)
            stopAnimation()
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getproductlist();
        // getWishList()
    }, [sellIs_wished, isLoggedIn, add_wished_Called]);


    // const findSKUId = () => {
    //     const sku = Product?.productList.sku_details.find((sku) => {
    //         return sku.attrs[0].color === productColorActive && sku.attrs[0].size === sizeActive;
    //     });
    //     return sku ? sku.skuid : null;
    // };

    const findSKUId = () => {
        const sku = Product?.productList.sku_details.find((sku) => {
            // Check if color matches and either size is not required or size matches
            return sku.attrs[0].color === productColorActive &&
                (!sizeActive || sku.attrs[0].size === sizeActive);
        });
        return sku ? sku.skuid : null;
    };

    const handleCart = async (e) => {

        try {
            var data
            if (productColorActive && (sizeActive || Product?.productList?.sku_attributes?.size == undefined)) {

                data = {
                    action: "add-to-cart-product",
                    seller_id: Product?.productList?.user_id?._id,
                    product_id: Product?.productList?._id,
                    product_price: Product?.productList.individual_price,
                    product_price_type: 1,
                    product_tax: 0,
                    group_id: null,
                    skuid: findSKUId(),
                }

                if (isLoggedIn) {

                    setMainLoder(true)
                    const res = await api.postWithToken(`${serverURL}${ADDTOCART}`, data)
                    if (res.data.success == true) {

                        var data = {
                            action: "update-to-cart-qty",
                            _id: res.data.data._id,
                            qty: product_qtyActive
                        }

                        const updateData = await api.postWithToken(`${serverURL + ADDTOCART}`, data)

                        getCartData()
                        getcartcount()

                        setSucessSnackBarOpenProductDtl(!sucessSnackBarOpenProductDtl);
                        setMyMessageProductDtl(res.data.message);
                        setProductColorActive(" ")
                        setSizeActive(" ")
                        setMainLoder(false)
                        handleDrawerShow()
                    } else if (res.data.success === false) {
                        handleDrawerShow()
                        setMainLoder(false)
                        setMyMessageProductDtl(res.data.message);
                        setWarningSnackBarOpenProductDtl(!warningSnackBarOpenProductDtl);
                    }
                } else {
                    // User is not logged in, redirect to the login page
                    //    afterLogin(setMyMessageProductDtl)
                    //    setWarningSnackBarOpenProductDtl(!warningSnackBarOpenProductDtl);
                    // handleDrawerShow()
                    addProductDetailsToLocal(data, Product, sizeActive, productColorActive, product_qtyActive)
                    addcartLocal(data, handleDrawerShow)
                }
            } else {

                setMyMessageProductDtl("select color and size  of the product");
                setWarningSnackBarOpenProductDtl(!warningSnackBarOpenProductDtl);
            }
        } catch (error) {
            setMainLoder(false)
            setProductColorActive(" ")
            setSizeActive(" ")
            errorResponse(error, setMyMessageProductDtl)
            setWarningSnackBarOpenProductDtl(!warningSnackBarOpenProductDtl);
        }
    };



    // const ciphertext = localStorage.getItem('cartPostData');
    // if (ciphertext) {
    //     const bytes  = CryptoJS.AES.decrypt(ciphertext, 'your_secret_key');
    //     const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    //     console.log(decryptedData,"decryptedData");
    // } else {
    //     // Handle the case where the cart data does not exist
    //     console.log("No cart data found");
    // }

    const textRef = useRef(null);

    const handleCopy = () => {

        if (textRef.current) {
            setMyMessageProductDtl("Item id copied successfully");
            setSucessSnackBarOpenProductDtl(!sucessSnackBarOpenProductDtl);
            const range = document.createRange();
            range.selectNode(textRef.current);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            document.execCommand('copy');
            window.getSelection().removeAllRanges();
        }
    };


    const groupPriceShare = (id) => {
        if (isMobile) {
            generateDynamicLink(id)
        } else {
            // If the device is not mobile, log 'false' to the console
            handleShow();
            setPerActive('Group')
        }
    }

    const handleChange = (e) => {

        const { name, value, checked, type } = e.target;
        let newValue = type === "checkbox" ? checked : value;


        setValues((prevValues) => ({
            ...prevValues,
            [name]: newValue,
        }));
    };

    const handlePhoto = (e) => {

        // const file = e.target.files[0];
        // setValues({ ...values, [e.target.name]: e.target.files });

        let files = e.target.files;
        if (files.length > 5) {
            setMyMessageProductDtl("You can select up to 5 files only!");
            setWarningSnackBarOpenProductDtl(!warningSnackBarOpenProductDtl);
            e.target.value = ""; // clear selected files
            setValues({ ...values, ["review_files"]: "" });
        } else {
            setValues({ ...values, [e.target.name]: files });
        }

    };


    const submitReviews = async (e) => {
        e.preventDefault();
        try {
            setMainLoder(true)
            if (product_id && product_id !== undefined && Product.productList.user_id?._id) {
                if (values.title && values.content && values.rating) {
                    const formData = new FormData();
                    formData.append('action', "create");
                    formData.append('product_id', product_id);
                    formData.append('vendor_id', Product.productList.user_id?._id);
                    formData.append('content', values.content);
                    formData.append('rating', values.rating);
                    formData.append('title', values.title);

                    let isImage = false;
                    let isVideo = false;

                    for (let i = 0; i < values.review_files.length; i++) {
                        formData.append('review_files', values.review_files[i]);
                        if (values.review_files[i].type.startsWith('image/')) {
                            isImage = true;
                        }
                        if (values.review_files[i].type.startsWith('video/')) {
                            isVideo = true;
                        }
                    }

                    let reviewType = 0; // default value
                    if (isImage && isVideo) {
                        reviewType = 3; // for both image and video
                    } else if (isImage) {
                        reviewType = 1; // for image review
                    } else if (isVideo) {
                        reviewType = 2; // for video review
                    }
                    formData.append('review_type', reviewType);

                    const response = await Promise.all([
                        api.postWithToken(`${serverURL}product-review-manage`, formData)
                    ]);
                    if (response[0]?.data.success === true) {
                        if (response[0]?.data.message == "Already review and rating this product!") {
                            setMyMessageProductDtl("This product has already been reviewed and rated");
                            setSucessSnackBarOpenProductDtl(!sucessSnackBarOpenProductDtl);
                        } else {
                            setMyMessageProductDtl(response[0]?.data.message);
                            setSucessSnackBarOpenProductDtl(!sucessSnackBarOpenProductDtl);
                        }
                    } else {
                        setMyMessageProductDtl(response[0]?.data.message);
                        setWarningSnackBarOpenProductDtl(!warningSnackBarOpenProductDtl);
                    }
                    getProductDetail()
                    getProductReview()
                    setValues(initialValues)
                    setreviewShow(false)
                } else {
                    setMyMessageProductDtl("please fill out all required fields!");
                    setWarningSnackBarOpenProductDtl(!warningSnackBarOpenProductDtl);
                }
            } else {
                navigate("/")
            }
            setMainLoder(false)
        } catch (error) {

            setMyMessageProductDtl("please try again with video or image!");
            setWarningSnackBarOpenProductDtl(!warningSnackBarOpenProductDtl);
            // setreviewShow(false)
            setMainLoder(false)
            console.error('Error posting  data:', error);
        }
    }

    useEffect(() => {
        const schema = createJsonLdSchema(Product);
        // console.log(schema,"schema");
        const script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.innerHTML = JSON.stringify(schema);
        document.head.appendChild(script);

        //Clean-up function to remove the script when component unmounts
        return () => {
            document.head.removeChild(script);
        }
    }, [Product]);

    const [modalOpen, setModalOpen] = useState(false);

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };


    const [isFullScreen, setIsFullScreen] = useState(false);

    const handleFullScreen = (event) => {
        const video = event.target;

        if (!isFullScreen) {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.mozRequestFullScreen) { /* Firefox */
                video.mozRequestFullScreen();
            } else if (video.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                video.webkitRequestFullscreen();
            } else if (video.msRequestFullscreen) { /* IE/Edge */
                video.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { /* Firefox */
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE/Edge */
                document.msExitFullscreen();
            }
        }

        setIsFullScreen(!isFullScreen);
    };

    return (
        <>
            <h1 className='d-none'></h1>
            <SucessSnackBar
                open={sucessSnackBarOpenProductDtl}
                setOpen={setSucessSnackBarOpenProductDtl}
                text={MymessageProductDtl}
                type="success"
            />

            <ErrorSnackBar
                open={warningSnackBarOpenProductDtl}
                setOpen={setWarningSnackBarOpenProductDtl}
                text={MymessageProductDtl}
                type="error"
            />


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

                        <div className='product-info pb-5'>
                            <div className='container-cos'>

                                <div className='page-path d-flex align-items-center gap-1'>
                                    <div className='d-flex align-items-center gap-1'>
                                        <NavLink>Home</NavLink>
                                        <MdOutlineKeyboardArrowRight />
                                    </div>
                                    <div onClick={() => (handelCategorydata(Product?.productList?.product_category_keys?.product_category_one?._id), localStorage.removeItem("selectedSubcategories"))} className='d-flex align-items-center gap-1'>
                                        <NavLink> {Product?.productList?.product_category_keys?.product_category_one.name}</NavLink>
                                        <MdOutlineKeyboardArrowRight />
                                    </div>
                                    <div onClick={() => (handelSubCat(Product?.productList?.product_category_keys?.product_category_two._id))} className='d-flex align-items-center gap-1'>
                                        <NavLink >{Product?.productList?.product_category_keys?.product_category_two.name}</NavLink>
                                        <MdOutlineKeyboardArrowRight />
                                    </div>
                                    <NavLink className='active wrap-line-cos'>  {Product?.productList?.name} </NavLink>
                                </div>

                                <Row className='mt-4'>
                                    <Col lg={6} md={12}>
                                        <div className='review shipping-def pb-2 mb-2 d-flex align-items-center justify-content-between mobile-together'>
                                            <div className='d-flex align-items-center flex-wrap gap-3'>
                                                <h5 className='info-title border-right-cos cos-title'> {Product?.productList?.rating_count} shop reviews</h5>
                                                <div className='rate d-flex align-items-center gap-2'>
                                                    <span className='cos-title'>{Product?.productList?.rating}</span>
                                                    <div className='d-flex align-items-center gap-1'>
                                                        <Rating name="half-rating-read" value={Product?.productList?.rating} precision={0.5} defaultValue={0} readOnly />
                                                    </div>
                                                </div>
                                                <div className='d-flex align-items-center gap-2 verified'>
                                                    <img src='../img/product_def/verified.png' alt='' />
                                                    <span>All reviews are from verified buyers</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='position-relative'>

                                            {
                                                isWishlist === false &&
                                                <Button onClick={handleWishlistClick} className='wishlist-btn-cos'><img src='../img/header/wishlist.png' alt='' width="20px" /></Button>
                                            }
                                            {
                                                isWishlist === true &&
                                                <Button onClick={handleWishlistClick} className='wishlist-btn-cos'><img src='../img/Vector.png' alt='' /></Button>
                                            }

                                            <RWebShare
                                                data={{

                                                    text: "Hey, check out this product on Clubmall. Limited stock available. It’s going fast!",
                                                    url: window.location.href,
                                                    title: "Clubmall",
                                                }}

                                                sites={[
                                                    "facebook",
                                                    "twitter",
                                                    "whatsapp",
                                                    "telegram",
                                                    "linkedin",
                                                    "instagram"
                                                ]}
                                                onClick={() => console.log("shared successfully!")}
                                            >
                                                <Button className='wishlist-btn'><FiUpload /></Button>
                                            </RWebShare>
                                            <ProductSlider activeImage={activeImage} colorProduct={colorProduct} productImagePath={Product?.productImagePath} productList={Product?.productList?.product_images} id={Product?.productList?._id && Product?.productList?._id} />

                                        </div>

                                        {Product?.productList?.rating_count == 0 &&
                                            <div className='no-review py-4 d-flex gap-3'>
                                                <h5 className='info-title '>No item reviews yet</h5>
                                                <Button onClick={handlereviewShow} className='write-review'>
                                                    Write a review
                                                </Button>
                                                {/* <p>But this shop has 225 reviews for other items. Check out shop reviews <MdOutlineKeyboardArrowDown /></p> */}
                                            </div>
                                        }
                                        <div className='together web-together mt-4'>
                                            <div className='no-review frequently py-2 pt-0 pt-sm-4   d-flex align-items-center justify-content-between'>
                                                <h5 className='info-title cos-title'>Frequently bought together</h5>
                                                {/* <Button > <Link to="/trending" >See all <MdOutlineKeyboardArrowRight /> </Link>  </Button> */}
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

                                                        favoriteProductList.productListArrObj
                                                        && favoriteProductList.productListArrObj?.map((e, i) => {
                                                            return (
                                                                <SwiperSlide>
                                                                    <div key={i} className='slide-box pointer' onClick={() => handelProductDetail(e._id)}>
                                                                        <div className='position-relative'>
                                                                            <img src={favoriteProductList?.productImagePath + e._id + "/" + e.product_images[0]?.file_name} alt='' className='w-100' />
                                                                        </div>
                                                                        <div className='slider-box-per pt-3'>
                                                                            <h5 className='text_frequently'>{e.name}</h5>
                                                                            <div className='d-flex align-items-center gap-2 mt-2'>
                                                                                <h5>${e.individual_price}</h5>
                                                                                {/* <del>${e.group_price}</del> */}
                                                                                {/* <span>{e.in_stock > 0 ? e.in_stock : 0} sold</span> */}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </SwiperSlide>
                                                            )
                                                        })
                                                    }


                                                </Swiper>

                                                {/* <div className='d-flex justify-content-center'>
                                                    <Button className='add-items' onClick={handleDrawerShow}>Show cart List</Button>
                                                </div> */}


                                            </div>
                                        </div>

                                    </Col>

                                    <Col lg={6} md={12} className='mt-4 mt-lg-0'>
                                        <div className='pro-def'>
                                            <h6 className='product-heading-name'> {Product?.productList?.name}</h6>

                                            <div className='review shipping-def pb-2 d-flex align-items-center justify-content-between web-together'>
                                                <div className='d-flex align-items-center flex-wrap gap-2 gap-xl-3'>
                                                    <h5 className='info-title border-right-cos cos-title'>{Product?.productList?.rating_count} shop reviews</h5>
                                                    <div className='rate d-flex align-items-center gap-2'>
                                                        <span className='cos-title'>{Product?.productList?.rating}</span>
                                                        <div className='d-flex align-items-center gap-1'>
                                                            <Rating name="half-rating-read" value={Product?.productList?.rating} precision={0.5} />
                                                        </div>
                                                    </div>
                                                    <div className='d-flex align-items-center gap-2 verified'>
                                                        <img src='../img/product_def/verified.png' alt='' />
                                                        <span>All reviews are from verified buyers</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='per-pro d-flex align-items-end gap-2'>
                                                <h3>${Product?.productList?.individual_price}</h3>
                                            </div>
                                            <div className='per-pro d-flex align-items-end gap-2 mt-2'>
                                                {Product?.productList?.competitors_price !== 0 && Product?.productList?.competitors_price !== undefined && (
                                                    <h3 className='competitors-text'>Competitors Price : <span className='competitors-price' style={{ fontSize: "unset" }}>${Product?.productList?.competitors_price}</span></h3>
                                                )}
                                            </div>

                                            <div className='shipping-def description mt-2'>
                                                <h5 className='info-title mt-2'>Product Details</h5>
                                                <textarea
                                                    value={Product?.productList?.description.split(":").join(":")}
                                                    readOnly
                                                    rows={Product?.productList?.description.split(":").length}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        resize: 'none',
                                                        border: 'none'
                                                    }}
                                                />
                                            </div>
                                            {(Product?.productList?.size_chartInInch.title !== "" || Product?.productList?.size_chartIncm.title !== "" && Product?.productList?.size_chartInInch.description !== "" && Product?.productList?.size_chartInInch.columns.length !== 0 && Product?.productList?.size_chartInInch.title !== undefined) && (
                                            <div className='d-flex align-items-center flex-wrap gap-2'>
                                                <Button className="size-chart-button" onClick={handleSizeChartClick}>
                                                    Show Size Chart
                                                </Button>
                                                
                                                {showSizeChart && (
                                                    <ProductChartModal
                                                        sizeChartTitle={isInInch ? Product.productList.size_chartInInch.title : Product.productList.size_chartIncm.title}
                                                        sizeChartDescription={isInInch ? Product.productList.size_chartInInch.description : Product.productList.size_chartIncm.description}
                                                        onHide={handleSizeChartClose}
                                                        toggleSizeChartUnit={toggleSizeChartUnit}
                                                        isInInch={isInInch}
                                                        rows={isInInch ? Product.productList.size_chartInInch.row_name : Product.productList.size_chartIncm.row_name}
                                                        columns={isInInch ? Product.productList.size_chartInInch.columns : Product.productList.size_chartIncm.columns}
                                                    />
                                                )}
                                            </div>
                                            )
                                            }

                                            <div className='product-color mt-3'>
                                                <div className='d-flex align-items-center flex-wrap gap-2'>
                                                    {
                                                        Product?.productList?.sku_details && uniqueColors(Product?.productList?.sku_details)?.map((e, i) => {
                                                            return (
                                                                <Button className={`${productColorActive === e.attrs[0]?.color ? "active" : ""} color-btn`} onClick={() => (setProductColorActive(e.attrs[0]?.color), setActiveImage(url + Product.productList?._id + "/" + e.file_name))}>
                                                                    <img className='colors' src={url + Product.productList?._id + "/" + e.file_name} alt='' />
                                                                </Button>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                {Product?.productList?.product_qty !== undefined && Product?.productList?.product_qty.length > 0 ? (
                                                    <div className='size mt-3'>
                                                        <h5>Quantity: <span style={{ color: "rgb(224, 46, 36, 1)" }}>{" " + product_qtyActive}</span></h5>
                                                        <div className='d-flex align-items-center gap-2 mt-3 flex-wrap'>
                                                            {Product?.productList?.product_qty?.map((e, i) => (
                                                                <Button key={i} className={`${product_qtyActive === e ? "active" : ""}`} onClick={() => setProduct_QtyActive(e)}>
                                                                    {e}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <></>
                                                )}

                                                <div className='size mt-3'>
                                                    {Product?.productList?.sku_attributes.size !== undefined && <h5>   Size:  <span style={{ color: "rgb(224, 46, 36, 1)" }}>{" " + sizeActive}</span></h5>}
                                                    <div className='d-flex align-items-center gap-2 mt-3 flex-wrap'>
                                                        {
                                                            Product?.productList?.sku_attributes.size?.map((e, i) => {
                                                                return (
                                                                    <Button className={`${sizeActive === e.name ? "active" : ""}`} onClick={() => setSizeActive(e.name)}>
                                                                        {e.name}
                                                                    </Button>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>

                                            </div>
                                            <Button onClick={handleCart} className='add-cart-items mt-4' style={{ width: "100%", borderRadius: "30px" }} >Add to cart</Button>
                                            <div className='mt-4'>
                                                {/* <Swiper
                                             
                                                    slidesPerView={4}
                                                    spaceBetween={10}
                                                    hashNavigation={{ watchState: true }}
                                                    loop={true}
                                                    
                                                    breakpoints={{
                                                        0: {
                                                            slidesPerView: 3,
                                                            spaceBetween: 10
                                                        },

                                                        425: {
                                                            slidesPerView: 4,
                                                            spaceBetween: 10,
                                                        },

                                                        650: {
                                                            slidesPerView: 4,
                                                            spaceBetween: 10
                                                        },

                                                        991: {
                                                            slidesPerView: 4,
                                                            spaceBetween: 10
                                                        },

                                                        1300: {
                                                            slidesPerView: 4,
                                                            spaceBetween: 10
                                                        }

                                                    }}
                                                    navigation={true}
                                                    modules={[Pagination, Navigation]}
                                                    className="mySwiper slider_pinfo"
                                                >
                                                    {Product?.productList?.product_files?.map((video, index) => (
                                                        <SwiperSlide key={index}>
                                                            <div className='d-flex gap-2 pb-2 align-items-center'>
                                                                <video
                                                                    className='product-video'
                                                                    autoPlay
                                                                    muted
                                                                    loop
                                                                    onClick={handleFullScreen}
                                                                >
                                                                    <source src={url + video.file_name} type="video/mp4" />
                                                                    Your browser does not support the video.
                                                                </video>
                                                               
                                                            </div>
                                                            <div className='d-flex gap-2 pb-2 align-items-center'>
                                                            <p className='amazone-text'>{video.title}</p>
                                                            </div>
                                                        </SwiperSlide>
                                                    ))}
                                                </Swiper> */}
                                                <div className='overflow-auto d-flex align-items-start gap-3 gap-xl-4'>
                                                {Product?.productList?.product_files?.map((video, index) => (
                                                        <div key={index}>
                                                            <div className='d-flex gap-2 pb-2 align-items-center'>
                                                                <video
                                                                    className='product-video'
                                                                    autoPlay
                                                                    muted
                                                                    loop
                                                                    onClick={handleFullScreen}
                                                                >
                                                                    <source src={url + video.file_name} type="video/mp4" />
                                                                    Your browser does not support the video.
                                                                </video>
                                                               
                                                            </div>
                                                            <div className='d-flex gap-2 pb-2 align-items-center'>
                                                            <p className='amazone-text'>{video.title}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            
                                            {/* <div className='d-flex gap-2 py-2 align-items-center' style={{ marginTop: '30px' }}>
                                                {Product?.productList?.product_files?.map((r, i) => (
                                                    <video className='product-video '
                                                        key={i}
                                                        autoPlay
                                                        muted
                                                        loop
                                                        onClick={handleFullScreen}
                                                        style={{

                                                            height: 'auto',
                                                            border: '1px solid #ccc', // Example border
                                                            borderRadius: '8px', // Example border radius
                                                        }}>
                                                        <source src={url + r.file_name} type="video/mp4" />
                                                        Your browser does not support the video.
                                                    </video>
                                                ))}
                                            </div> */}



                                            {/* <div className='d-flex align-items-start gap-4 justify-content-left overflow-hidden mt-4 '
                                                style={{ maxHeight: "300px" }}
                                            >
                                                <ProductGif activeImage={activeImage} colorProduct={colorProduct} productImagePath={Product?.productImagePath} productList={Product?.productList?.product_images} id={Product?.productList?._id && Product?.productList?._id} />
                                            </div> */}
                                            <div className='shipping-def'>
                                                <h5 className='info-title mb-2'>Shop with confidence</h5>
                                                <p className='security-line'><img src='../img/product_def/security.png' alt='' /> Shopping security <MdOutlineKeyboardArrowRight /></p>
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


                                                {Object.entries(typeof Product?.productList?.attributes === 'string' ? JSON.parse(Product?.productList?.attributes) : (Product?.productList?.attributes || {})).map(([key, value], index) => (


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

                                            {(Product?.productList?.content !== null && Product?.productList?.content !== undefined && Product.productList.content.length > 0) && (
                                                <div className='show-content '>
                                                    <h5 className='info-title mt-4 mb-2'>Content</h5>
                                                    <div className='show-content-editor'>
                                                        <div dangerouslySetInnerHTML={{ __html: Product.productList.content }} />
                                                    </div>
                                                </div>
                                            )}



                                            <div>
                                                <Swiper
                                                    slidesPerView={4}
                                                    spaceBetween={10}
                                                    hashNavigation={{ watchState: true }}
                                                    loop={true}
                                                    breakpoints={{
                                                        0: {
                                                            slidesPerView: 1,
                                                            spaceBetween: 10
                                                        },
                                                        425: {
                                                            slidesPerView: 1,
                                                            spaceBetween: 10
                                                        },
                                                        650: {
                                                            slidesPerView: 1,
                                                            spaceBetween: 10
                                                        },
                                                        991: {
                                                            slidesPerView: 1,
                                                            spaceBetween: 10
                                                        },
                                                        1300: {
                                                            slidesPerView: 1,
                                                            spaceBetween: 10
                                                        }
                                                    }}
                                                    navigation={true}
                                                    modules={[Pagination, Navigation]}
                                                    className="mySwiper"
                                                >
                                                    {Product?.productList?.description_video?.map((video, index) => (
                                                        <SwiperSlide key={index}>
                                                            <div className='d-flex gap-2 pb-2 align-items-center'>
                                                                <video
                                                                    className='product-video bottom-product-video'
                                                                    autoPlay
                                                                    muted
                                                                    loop
                                                                    onClick={handleFullScreen}
                                                                >
                                                                    <source src={url + video.file_name} type="video/mp4" />
                                                                    Your browser does not support the video.
                                                                </video>
                                                            </div>
                                                        </SwiperSlide>
                                                    ))}
                                                </Swiper>
                                            </div>
                                            <div>
                                                <div>
                                                    <a onClick={handleCustEmailClick} style={{ cursor: 'pointer', color: "#223263" }} >
                                                        <img src={reporticon} className='custemailicon' /> &nbsp; Report an issue with this product</a></div></div>

                                            {/* <Link className='custemailbutton' onClick={handleCustEmailClick}>
                                                <div className='d-flex align-items-center flex-wrap mt-2 gap-2 '>
                                                    <img src={reporticon} className='custemailicon' /> <p className='mb-0'>Report an issue with this product</p>
                                                </div>
                                                    </Link> */}

                                            {showcustemail && (
                                                <CustEmailModal

                                                    onHide={handleCustEmailClose}
                                                    className="size-chart-modal"
                                                />
                                            )}

                                        </div>

                                    </Col>
                                </Row>

                                <div className='review mt-5 mar-top-20'>
                                    {Product?.productReviewList?.length === 0 ? " " :
                                        <div className='d-flex align-items-center justify-content-between review-responsive'>
                                            <h4 className='info-title'>All Reviews ({Product?.productReviewList?.length})</h4>
                                            <div className='filter-review d-flex align-items-center gap-3'>
                                                <select name='filter_by' value={filters.filter_by} onChange={handelreviewFilter}>
                                                    <option value=''>All</option>
                                                    <option value='video'>With Video</option>
                                                    <option value='image'>With Photos</option>
                                                </select>
                                                <select name='rating_value' value={filters.rating_value} onChange={handelreviewFilter}>
                                                    <option value=''>All Ratings</option>
                                                    <option value='5'>5 Star</option>
                                                    <option value='4'>4 Star</option>
                                                    <option value='3'>3 Star</option>
                                                    <option value='2'>2 Star</option>
                                                    <option value='1'>1 Star</option>
                                                </select>
                                                <select name='sort_by' value={filters.sort_by} onChange={handelreviewFilter}>
                                                    <option value=''>Sort by default</option>
                                                    {/* <option>Sort by videos</option> */}
                                                    {/* <option>Sort by pictures</option> */}
                                                    <option value='rating'>Sort by ratings</option>
                                                </select>
                                                <Button onClick={handlereviewShow} className='write-review'>
                                                    Write a review
                                                </Button>
                                            </div>
                                        </div>
                                    }
                                    <div className=''>

                                        {
                                            reviweList.length <= 0 &&
                                            <div className='d-flex align-items-center justify-content-center h-100 spacing-top'>
                                                <div className='text-center found'>
                                                    <img src='../img/not-found.png' alt='' />
                                                    <p className='mt-3'> No comments </p>
                                                    {/* <Button className='mt-3 submit-btn'>Shop Now</Button> */}
                                                </div>
                                            </div>
                                        }

                                        {

                                            reviweList?.map((e, i) => {
                                                return (
                                                    <div className='d-flex align-items-start review-box gap-3 mt-4'>
                                                        {/* <img src='./img/cart/cart1.png' alt='' width="150px" className='review-img' /> */}
                                                        <div className='review-items-def w-100 d-flex align-items-start justify-content-between pb-4'>
                                                            <div className='review-text'>
                                                                <div className='d-flex align-items-center gap-2'>
                                                                    <img alt='profile' className='myprofile' width="34px" height="34px" style={{ borderRadius: "50%", objectFit: "cover" }} src={defaultProfile} />
                                                                    <h5>  {e.title ? e.title : "A Clubmall user"}</h5>
                                                                </div>
                                                                <div className='d-flex gap-2 pb-2 align-items-center'>
                                                                    {e?.review_files?.map((r, i) => (
                                                                        <React.Fragment key={i}>
                                                                            { r.file_name && !r.file_name.includes("mp4") ? (
                                                                                <img style={{ width: "100px" }} src={r.file_name} alt='' />
                                                                            ) : (
                                                                                <video
                                                                                    style={{ width: "200px", cursor: "pointer" }}
                                                                                    controls
                                                                                    onClick={handleFullScreen}
                                                                                >
                                                                                    <source src={r.file_name} type="video/mp4" />
                                                                                    {/* Add more <source> elements for different video formats if necessary */}
                                                                                    Your browser does not support the video.
                                                                                </video>
                                                                            )}
                                                                        </React.Fragment>
                                                                    ))}
                                                                </div>
                                                               
                                                                <span className='date_pro_info'>{e.content}</span>
                                                                <span className='date_pro_info'>{e.created_at.slice(0, 10)}</span>
                                                                <div className='d-flex align-items-center gap-1'>
                                                                    <Rating name="simple-controlled" value={e?.rating} readOnly />
                                                                </div>

                                                                {/* <div className='flex-wrap color-def d-flex align-items-center mb-3 mt-2'>
                                                                    <p><b>Overall Fit:</b> True to Size</p>
                                                                    <p><b>Color:</b> Olive Green</p>
                                                                    <p><b>Size:</b> M</p>
                                                                </div> */}
                                                            </div>
                                                            {/* <div className='d-flex align-items-center gap-3 review-like'>
                                                    <Button>
                                                        <img src='./img/for_you/like.png' alt='' />
                                                    </Button>
                                                    <Button>
                                                        <BsThreeDots />
                                                    </Button>
                                                </div> */}
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }

                                        {
                                            reviweList.length >= 10 &&
                                            <div className='w-100 d-flex justify-content-center mt-3 mb-5'>
                                                <Button className='shop-btn btn-cos-mobile' onClick={() => (setPage(page + 1), setMainLoder(true), setIsFilter(true))}  > View More <MdKeyboardDoubleArrowRight /></Button>
                                            </div>
                                        }

                                    </div>
                                </div>

                                <div className='together mobile-together'>
                                    <div className='no-review frequently py-2 pt-0 pt-sm-4   d-flex align-items-center justify-content-between'>
                                        <h5 className='info-title cos-title'>Frequently bought together</h5>
                                        {/* <Button > <Link to="/trending" >See all <MdOutlineKeyboardArrowRight /> </Link>  </Button> */}
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
                                                            && favoriteProductList.productListArrObj?.map((e) => {
                                                                return (
                                                                    <SwiperSlide>
                                                                        <div className='slide-box pointer' onClick={() => handelProductDetail(e._id)}>
                                                                            <div className='position-relative'   >
                                                                                <img src={favoriteProductList?.productImagePath + e._id + "/" + e.product_images[0]?.file_name} alt='' className='w-100' />
                                                                            </div>
                                                                            <div className='slider-box-per pt-3'>
                                                                                <h5 className='text_frequently'>{e.name}</h5>
                                                                                <div className='d-flex align-items-center gap-2 mt-3'>
                                                                                    <h5>${e.individual_price}</h5>
                                                                                    {/* <del>${e.group_price}</del> */}
                                                                                    {/* <span>{e.in_stock > 0 ? e.in_stock : 0} sold</span> */}
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

                                        {/* <div className='d-flex justify-content-center'> */}
                                        {/* <Button className='add-items' onClick={handleDrawerShow}>Show cart List</Button> */}
                                        {/* </div> */}

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
                                                        path={trendingProductList?.productImagePath && trendingProductList?.productImagePath}
                                                        is_wishList={e.wishList && e.wishList}
                                                    />
                                                )
                                            })
                                        }
                                        {/* <div className='w-100 d-flex justify-content-center'>
                                            <Button className='shop-btn rotate-img btn-cos-mobile' onClick={() => handelCategorydata()} >View More <MdKeyboardDoubleArrowRight /></Button>
                                        </div> */}
                                    </div>
                                </div>
                            </div>


                            {/* cart drawer */}
                            {/* <CartDrawer /> */}


                            {/* <Modal show={show} onHide={handleClose} centered className='welcome-modal'>
                                <Modal.Body>
                                    <div className='text-center p-3 p-sm-4'>
                                        <img src='../img/modal-logo.png' alt='' />
                                        <h5 className='my-3'>Get the full experience on <br /> the app</h5>
                                        <p>Follow you favorite vendor accounts,
                                            explore new product and message the <br /> vendor</p>
                                        <div className='d-flex align-items-center justify-content-center gap-2 mt-4 app-download'>
                                            <NavLink href='https://play.google.com/store/apps/details?id=com.clubmall' target='_blank'>
                                                <img src='../img/playstore.png' alt='' />
                                            </NavLink>
                                            <NavLink href='https://apps.apple.com/us/app/clubmall/id6444752184' target='_blank'>
                                                <img src='../img/app.png' alt='' />
                                            </NavLink>
                                        </div>
                                    </div>
                                </Modal.Body>
                            </Modal> */}

                            <Modal show={reviewShow} onHide={handlereviewClose} centered className='for_you-modal'>
                                <Modal.Body>
                                    <div className='comment-modal position-relative'>
                                        <Button className='close-modal-btn forgot-pass-close' onClick={handlereviewClose}>
                                            <MdOutlineClose />
                                        </Button>
                                        <h5>Write a review</h5>
                                        <Form className='mt-3'>
                                            <div className='login-input text-start'>
                                                <label>You Rating*</label>
                                            </div>
                                            <Rating name="simple-controlled" onChange={(event, newValue) => {
                                                setValues({ ...values, rating: newValue });
                                            }} />
                                            <div className='login-input text-start'>
                                                <label>You Name*</label>
                                                <input type='text' name='title' value={values.title} onChange={handleChange} />
                                            </div>
                                            <div className='login-input text-start mt-3'>
                                                <label>Comments*</label>
                                                <textarea placeholder='Type your review here' value={values.content} name='content' onChange={handleChange} rows={5} />
                                            </div>
                                            <div className='mt-3 review-file'>
                                                <input type='file' name='review_files' accept='image/*,video/*' onChange={handlePhoto} multiple />
                                            </div>
                                            <Button className='submit-btn mt-3 w-100' type='button' onClick={submitReviews} > {submitLoderRv ? "Loding..." : "Publish Review"} </Button>
                                        </Form>
                                    </div>
                                </Modal.Body>
                            </Modal>

                        </div>
                    </>
                )
            }
        </ >
    )
}

export default ProductInfo

