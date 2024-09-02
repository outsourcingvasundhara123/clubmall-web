import React, { useRef, useState, useEffect, useContext } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import {
    MdOutlineKeyboardArrowRight,
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
import { handelProductDetail } from '../helper/constants';
import { CartContext } from '../context/CartContext'
import { useLocation } from 'react-router-dom';
import { isMobile } from 'react-device-detect';




const ProductChartModal = ({ url, productId, sizeChartFileName, onHide }) => {
    return (
        <Modal show={true} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Size Chart</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <img className='size-chart-img' src={`${url}${productId}/${sizeChartFileName}`} alt='Size Chart' />
            </Modal.Body>
        </Modal>
    );
};


const AddCartModal = (props) => {
    let location = useLocation();
    const { getcartcount, handleShow, addcartLocal, addProductDetailsToLocal, handleDrawerShow, setMainLoder, generateDynamicLink, getCartData, activeImage, setActiveImage } = useContext(CartContext);
    const isLoggedIn = Is_Login();
    const navigate = useNavigate();
    const [perActive, setPerActive] = useState('Individual');
    const serverURL = getServerURL();
    const [modelProduct, setModelProduct] = useState({})
    const [sizeActive, setSizeActive] = useState("")
    const [productColorActive, setProductColorActive] = useState();
    const [sucessSnackBarOpen, setSucessSnackBarOpen] = useState(false);
    const [warningSnackBarOpen, setWarningSnackBarOpen] = useState(false);
    const [Mymessage, setMyMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const player = useRef();
    const [colorProduct, setColorProduct] = useState()
    const [url, setUrl] = useState("");
    const [product_qtyActive, setProduct_QtyActive] = useState("");

    const [showSizeChart, setShowSizeChart] = useState(false);
    const [warningSnackBarOpenProductDtl, setWarningSnackBarOpenProductDtl] = useState(false);
    const [MymessageProductDtl, setMyMessageProductDtl] = useState("");
    const handleSizeChartClose = () => {
        setShowSizeChart(false);
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
        startAnimation()

        try {
            if (props.show) {
                const [productDetail] = await Promise.all([
                    api.get(`${serverURL + PRODUCTDETAIL + `?product_id=${props.product_id}`}`)
                ]);
                const productData = productDetail.data.data;
                setModelProduct(productData);
                stopAnimation()
                setUrl(productData.productImagePath)
                const uniqueColorDetails = uniqueColors(productData.productList.sku_details);

                const imageUrls = uniqueColorDetails.map(e => `${productData.productImagePath + productData?.productList?._id + "/" + e?.file_name}`);

                const mergedImages = imageUrls.map(url => ({
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
    }, [props.show]);
    const setProduct_QtyActives = (qty) => {
        setProduct_QtyActive(qty);
        let tempColor = uniqueColors(modelProduct?.productList?.sku_details)
        setProductColorActive(tempColor[0].attrs[0]?.color);
    };
    const findSKUId = () => {

        const selectedPack = modelProduct?.packets.find((packet) => packet.count === product_qtyActive);
    
        const sku = modelProduct?.productList.sku_details.find((sku) => {
            const attrs = sku.attrs[0];

            const isColorMatch = attrs.color === productColorActive;
            const isSizeMatch = sizeActive ? attrs.size === sizeActive : true;
            const isPackCountMatch = selectedPack ? attrs.packets?.count === selectedPack.count : true; 
    
            return isColorMatch && isSizeMatch && isPackCountMatch;
        });
        return sku ? sku.skuid : null;
    };
    const selectedPack = modelProduct.packets?.find((packet) => packet.count === product_qtyActive);
    const packPrice = selectedPack ? selectedPack.price : modelProduct.productList?.individual_price;



    const handleCart = async (e) => {
        e.preventDefault();
        try {
           
            if (modelProduct?.packets && modelProduct.packets.length === 1) {
                setProduct_QtyActives(modelProduct.packets[0].count);
            }
    

            const packetsExist = modelProduct?.packets && modelProduct.packets.length > 0;
            const sizeDefined = modelProduct?.productList?.sku_attributes?.size.length > 0;
            if (productColorActive && (sizeActive || modelProduct?.productList?.sku_attributes?.size === undefined || !sizeDefined)) {
                if (packetsExist && product_qtyActive) {
                    const selectedPack = modelProduct?.packets.find((packet) => packet.count === product_qtyActive);
                    const packPrice = selectedPack ? parseFloat(selectedPack.price).toFixed(2) : parseFloat(modelProduct.productList?.individual_price).toFixed(2);
    
                    const data = {
                        action: "add-to-cart-product",
                        seller_id: modelProduct?.productList?.user_id?._id,
                        product_id: modelProduct?.productList?._id,
                        product_price: packPrice,
                        product_price_type: 1,
                        product_tax: 0,
                        group_id: null,
                        skuid: findSKUId(), // Ensure SKU ID is included
                    };
    
                    if (isLoggedIn) {
                        setMainLoder(true);
                        const res = await api.postWithToken(`${serverURL}${ADDTOCART}`, data);
                        if (res.data.success === true) {
                            setSucessSnackBarOpen(!sucessSnackBarOpen);
                        setMyMessage(res.data.message);
                            const updateData = {
                                action: "update-to-cart-qty",
                                _id: res.data.data._id,
                                qty: 1
                            };
                            if (product_qtyActive > 1) {
                                updateData.qty = res.data.data.qty;
                                await api.postWithToken(`${serverURL + ADDTOCART}`, updateData);
                            }
    
                            getCartData();
                            getcartcount();
    
                            setTimeout(() => {
                                if (location.pathname == "/cart") {
                                    window.location.reload();
                                } else {
                                    props.handleClose()
                                    //handleDrawerShow()
                                }
                                setMainLoder(false)
                            }, 1000);
                        } else {
                            setMainLoder(false);
                            setMyMessage(res.data.message);
                            setWarningSnackBarOpenProductDtl(!warningSnackBarOpenProductDtl);
                        }
                    } else {
                        props.handleClose()
                        addProductDetailsToLocal(data, modelProduct, sizeActive, productColorActive, product_qtyActive);
                        addcartLocal(data, handleDrawerShow);
                    }
                } else if (!packetsExist) {
                  
                    const packPrice = modelProduct?.productList?.individual_price;
                    const data = {
                        action: "add-to-cart-product",
                        seller_id: modelProduct?.productList?.user_id?._id,
                        product_id: modelProduct?.productList?._id,
                        product_price: packPrice,
                        product_price_type: 1,
                        product_tax: 0,
                        group_id: null,
                        skuid: findSKUId(), // Ensure SKU ID is included
                    };
    
                    if (isLoggedIn) {
                        setMainLoder(true);
                        const res = await api.postWithToken(`${serverURL}${ADDTOCART}`, data);
                        if (res.data.success === true) {
                            setSucessSnackBarOpen(!sucessSnackBarOpen);
                        setMyMessage(res.data.message);
                            getCartData();
                            getcartcount();
    
                            setTimeout(() => {
                                if (location.pathname == "/cart") {
                                    window.location.reload();
                                } else {
                                    props.handleClose()
                                    //handleDrawerShow()
                                }
                                setMainLoder(false)
                            }, 1000);
                        } else {
                            setMainLoder(false);
                            setMyMessage(res.data.message);
                            setWarningSnackBarOpenProductDtl(!warningSnackBarOpenProductDtl);
                        }
                    } else {
                        props.handleClose()
                        addProductDetailsToLocal(data, modelProduct, sizeActive, productColorActive, product_qtyActive);
                        addcartLocal(data, handleDrawerShow);
                    }
                } else {
                    setMyMessage("Please select quantity for the product.");
                    setWarningSnackBarOpen(!warningSnackBarOpenProductDtl);
                }
            } else {
                // Handle validation errors for color and size
                if (!productColorActive) {
                    setMyMessage("Please select color for the product.");
                } else if (!sizeActive && sizeDefined) 
                {
                    setMyMessage("Please select size for the product.");
                }
                setWarningSnackBarOpen(!warningSnackBarOpenProductDtl);
            }
        } catch (error) {
            setMainLoder(false);
            setProductColorActive("");
            setSizeActive("");
            addProductDetailsToLocal(modelProduct, sizeActive, productColorActive, product_qtyActive)
            errorResponse(error, setMyMessage);
            setWarningSnackBarOpenProductDtl(!warningSnackBarOpenProductDtl);
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


    return (
        <>
            <Modal
                show={props.show}
                onHide={props.handleClose}
                centered
                className='cart-modal product-info add-modal ps-0'
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
                                            <ProductSlider activeImage={activeImage} colorProduct={colorProduct} productImagePath={modelProduct.productImagePath} productList={modelProduct.productList?.product_images} id={props.product_id} />
                                        </div>
                                    </Col>
                                    <Col lg={6} md={12} className='mt-3 mt-lg-0'>
                                        <div className='pro-def pt-2'>
                                            <h6>  {modelProduct.productList?.name}</h6>
                                            <div className='brand my-3'>
                                                <p><span>1 sold by {modelProduct.stockData?.recent_bought_name} ({modelProduct.stockData?.order_count}K + sold)</span></p>
                                            </div>

                                            <div className='per-pro d-flex align-items-end gap-2'>
                                                <h3> ${packPrice}</h3>
                                            </div>

                                 

                                            <div className='product-color mt-4'>
                                                <h5>Color:   <span style={{ color: "rgb(224, 46, 36, 1)" }}>{productColorActive}</span></h5>
                                                <div className='d-flex align-items-center flex-wrap gap-2 mt-3'>
                                                        {  (
                                                            modelProduct?.productList?.sku_details && uniqueColors(modelProduct?.productList?.sku_details)?.map((e, i) => (
                                                                <Button
                                                                    key={i}
                                                                    className={`${productColorActive === e.attrs[0]?.color ? "active" : ""} color-btn`}
                                                                    onClick={() => {
                                                                        setProductColorActive(e.attrs[0]?.color);
                                                                        setActiveImage(url + modelProduct.productList?._id + "/" + e.file_name);
                                                                   
                                                                    }}
                                                                >
                                                                    <img className='colors' src={url + modelProduct.productList?._id + "/" + e.file_name} alt='' />
                                                                </Button>
                                                            ))
                                                        )}
                                                    </div>
                                                    <div className='size mt-4'>
                                                    {modelProduct?.productList?.sku_attributes.size !== undefined && modelProduct?.productList?.sku_attributes?.size?.length > 0 && <h5>   Size:  <span style={{ color: "rgb(224, 46, 36, 1)" }}>{" " + sizeActive}</span></h5>}
                                                    <div className='d-flex align-items-center gap-2 mt-2 flex-wrap'>
                                                        {
                                                            modelProduct.productList?.sku_attributes.size?.map((e, i) => {
                                                                return (
                                                                    <Button className={`${sizeActive === e.name ? "active" : ""}`} onClick={() => setSizeActive(e.name)}>
                                                                        {e.name}
                                                                    </Button>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>



                                                {modelProduct?.packets && modelProduct?.packets.length > 0 ? (
                                                    <div className='size mt-3'>
                                                        <h5>Quantity: <span style={{ color: "rgb(224, 46, 36, 1)" }}>{" " + product_qtyActive}</span></h5>
                                                        <div className='d-flex align-items-center gap-2 mt-3 flex-wrap'>
                                                               {modelProduct.packets.map((item, index) => (
                                                                <Button key={index} className={`${product_qtyActive === item.count ? "active" : ""}`} onClick={() => setProduct_QtyActives(item.count)}>
                                                                    {item.count}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <></>
                                                )}


                                            {showSizeChart && (
                                                <ProductChartModal
                                                    url={url}
                                                    productId={modelProduct.productList._id}
                                                    sizeChartFileName={modelProduct.productList.sizechart_image.file_name}
                                                    onHide={handleSizeChartClose}
                                                    className="size-chart-modal"
                                                />
                                            )}

                                                

                                            </div>
                                            <Button onClick={handleCart} style={{ width: "100%", borderRadius: "30px" }} type='button' className='add-cart-items mt-4 w-75'>Add to cart</Button>

                                            <div>
                                                <Button type='button' onClick={() => handelProductDetail(modelProduct.productList._id)} className='show-more mt-3'>All details <MdOutlineKeyboardArrowRight /></Button>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Modal.Body>

                        </>
                    )}
            </Modal>



        </>
    )
}

export default AddCartModal
