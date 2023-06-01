import React, { useRef, useState, useEffect } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import { colors } from "../helper/constants"
import {
    MdOutlineKeyboardArrowRight,
    MdAdd,
    MdRemove,
    MdOutlineClose
} from "react-icons/md"
import ProductSlider from './ProductSlider'
import api from "../helper/api";
import { getServerURL } from '../helper/envConfig';
import { PRODUCTDETAIL, ADDTOCART } from "../helper/endpoints";
import SucessSnackBar from "../components/SnackBar";
import ErrorSnackBar from "../components/SnackBar";
import { useNavigate } from 'react-router-dom'
import { errorResponse } from '../helper/constants'
import Loader from '../components/Loader';
import { Is_Login } from '../helper/IsLogin'

const AddCartModal = (props) => {
    const isLoggedIn = Is_Login();
    const navigate = useNavigate();
    const [perActive, setPerActive] = useState('Individual');
    const serverURL = getServerURL();
    const [count, setCount] = useState(1)
    const [modelProduct, setModelProduct] = useState({})
    const [show, setShow] = useState(false);
    const [sizeActive, setSizeActive] = useState("")
    const [productColorActive, setProductColorActive] = useState();
    const [sucessSnackBarOpen, setSucessSnackBarOpen] = useState(false);
    const [warningSnackBarOpen, setWarningSnackBarOpen] = useState(false);
    const [Mymessage, setMyMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const player = useRef();

    const handleClose = () => {
        setShow(false);
    }

    const handleShow = () => setShow(true);
    // setProductColorActive()
    const startAnimation = () => {
        if (player.current) {
            player.current.play();
        }
    };
    const stopAnimation = () => {
        setLoading(false);
    };


    const getCategory = async () => {
        startAnimation()

        try {
            if (props.show) {
                const [productDetail] = await Promise.all([
                    api.get(`${serverURL + PRODUCTDETAIL + `?product_id=${props.product_id}`}`)
                ]);
                const productData = productDetail.data.data;
                setModelProduct(productData);
                setProductColorActive(productDetail.data.data.productList?.sku_attributes.color[0].name && productDetail.data.data.productList?.sku_attributes.color[0].name)
                stopAnimation()

            }

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCategory();
    }, [props.show]);

    const handleCart = async (e) => {

        e.preventDefault();

        try {

            if (productColorActive && sizeActive && count) {

                if (isLoggedIn) {
                    let data = {
                        action: "add-to-cart-product",
                        seller_id: modelProduct.productList.user_id._id,
                        product_id: modelProduct.productList._id,
                        product_price: modelProduct.productList.individual_price,
                        product_price_type: 1,
                        product_tax: 0,
                        group_id: null,
                        skuid: "",
                    }

                    const res = await api.postWithToken(`${serverURL}${ADDTOCART}`, data)

                    if (res.data.success == true) {
                        setSucessSnackBarOpen(!sucessSnackBarOpen);
                        setMyMessage(res.data.message);
                        props.handleClose()
                        setProductColorActive(" ")
                        setSizeActive(" ")
                    } else if (res.data.success === false) {
                        setMyMessage(res.data.message);
                        setWarningSnackBarOpen(!warningSnackBarOpen);
                    }
                } else {
                    // User is not logged in, redirect to the login page
                    navigate('/login');
                }
            } else {
                setMyMessage("select color and size  of the product");
                setWarningSnackBarOpen(!warningSnackBarOpen);
            }
        } catch (error) {
            setProductColorActive(" ")
            setSizeActive(" ")
            errorResponse(error, setMyMessage, props)
            setWarningSnackBarOpen(!warningSnackBarOpen);
            if (error.response.status === 403) {
                props.handleClose()
                navigate("/")
            }
        }
    };


    console.log(productColorActive, "productColorActive");
    return (
        <>
            <Modal
                show={props.show}
                onHide={props.handleClose}
                centered
                className='cart-modal product-info ps-0'
            >

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
                            <Modal.Body>


                                <div className='d-flex justify-content-end mb-2'>
                                    <Button className='close-modal-btn' onClick={props.handleClose}>
                                        <MdOutlineClose />
                                    </Button>
                                </div>
                                <Row>
                                    <Col lg={6} md={12}>
                                        <div>
                                            <ProductSlider productImagePath={modelProduct.productImagePath} productList={modelProduct.productList?.product_images} id={props.product_id} />
                                        </div>
                                    </Col>
                                    <Col lg={6} md={12} className='mt-3 mt-lg-0'>
                                        <div className='pro-def pt-2'>
                                            <h6>  {modelProduct.productList?.name}</h6>

                                            <div className='brand my-3'>
                                                <p><span>1 sold, by {modelProduct.stockData?.recent_bought_name} ({modelProduct.stockData?.order_count}K + sold)</span></p>
                                            </div>

                                            <div className='per-pro d-flex align-items-end gap-2'>
                                                <h3> ${modelProduct.productList?.individual_price}</h3>
                                                <del>$534,33</del>
                                                <span>24% Off</span>
                                            </div>

                                            <div className='price Individual-per mt-3 gap-3 d-flex align-items-center mobile-row'>
                                                <Button className={`${perActive === "Individual" ? "active" : ""}`} onClick={() => setPerActive('Individual')}>Individual Price <br />
                                                    ${modelProduct.productList?.individual_price}</Button>
                                                <Button className={`${perActive === "Group" ? "active" : ""}`} onClick={() => {
                                                    handleShow();
                                                    setPerActive('Group')
                                                    props.handleClose()
                                                }}>Group Price: <br />
                                                    ${modelProduct.productList?.group_price} </Button>
                                            </div>


                                            <div className='product-color mt-4'>
                                                <h5>Color:   <span style={{ color: "rgb(224, 46, 36, 1)" }}>{productColorActive}</span></h5>
                                                <div className='d-flex align-items-center flex-wrap mt-2 gap-2'>
                                                    {
                                                        modelProduct?.productList?.sku_attributes?.color && modelProduct.productList?.sku_attributes.color.map((e, i) => {
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
                                                    <h5>Size:  <span style={{ color: "rgb(224, 46, 36, 1)" }}>{" " + sizeActive}</span></h5>
                                                    <div className='d-flex align-items-center gap-2 mt-2 flex-wrap'>
                                                        {
                                                            modelProduct.productList?.sku_attributes.size.map((e, i) => {
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
                                            <Button onClick={handleCart} type='button' className='add-cart-items mt-4 w-75'>Add to cart</Button>

                                            <div>
                                                <Button className='show-more mt-3'>All details <MdOutlineKeyboardArrowRight /></Button>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Modal.Body>

                        </>
                    )}
            </Modal>

            <Modal show={show} onHide={handleClose} centered className='welcome-modal'>
                <Modal.Body>
                    <div className='text-center p-3 p-sm-4'>
                        <img src='./img/modal-logo.png' alt='' />
                        <h5 className='my-3'>Get the full experience on <br /> the app</h5>
                        <p>Follow you favoritevendor accounts,
                            explore new product and message the <br /> vendor</p>
                        <div className='d-flex align-items-center justify-content-center gap-2 mt-4'>
                            <Button>
                                <img src='./img/playstore.png' alt='' />
                            </Button>
                            <Button>
                                <img src='./img/app.png' alt='' />
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default AddCartModal
