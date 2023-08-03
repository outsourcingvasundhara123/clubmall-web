import React, { useRef, useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import { Is_Login } from '../helper/IsLogin'
import { CartContext } from '../context/CartContext'
import { Button, Col, Form, Modal, NavLink, Offcanvas, Row, } from 'react-bootstrap'
import {
    MdOutlineKeyboardArrowRight,
    MdOutlineKeyboardArrowDown,
    MdKeyboardDoubleArrowRight,
    MdOutlineClose,
    MdDelete

} from "react-icons/md"
import ProCard from '../components/ProCard'
import { useLocation } from 'react-router-dom'
import { handelProductDetail } from '../helper/constants';
import { ADDTOCART, PRODUCTList } from "../helper/endpoints";
import api from "../helper/api";
import { getServerURL } from '../helper/envConfig';
import Loader from '../components/Loader';
import SucessSnackBar from "../components/SnackBar";
import ErrorSnackBar from "../components/SnackBar";
import { errorResponse, afterLogin } from '../helper/constants'
import { AiFillCloseCircle } from 'react-icons/ai'
import { handelCategorydata } from '../helper/constants'
import { MdRemove, MdAdd } from 'react-icons/md'
import CryptoJS from 'crypto-js';


const CartDrawer = () => {
    const { localCartPostData, getLocalCartPostData, localCart, getLocalCartData, increaseProductQuantity, decreaseProductQuantity, deleteProductDetailsFromLocal, deleteProductFromLocalCart, handleDrawerShow, handleDrawerClose, drawer, cartList, setMainLoder, addWishList, generateDynamicLink, getCartData, getWishList, add_wished_Called, Mymessage, setSucessSnackBarOpen, sucessSnackBarOpen, setMyMessage, setWarningSnackBarOpen, warningSnackBarOpen, sellIs_wished, activeImage, setActiveImage, setCart, cart } = useContext(CartContext);
    const isLoggedIn = Is_Login();
    const navigate = useNavigate();
    const [sucessSnackBarOpenCart, setSucessSnackBarOpenCart] = useState(false);
    const [warningSnackBarOpenCart, setWarningSnackBarOpenCart] = useState(false);
    const [, setLocalCart] = useState([]);
    const [MymessageCart, setMyMessageCart] = useState("");
    const serverURL = getServerURL();
    const getimagename = (list, id) => {
        let data = list.filter(detail => detail.skuid.toString() == id);
        return data[0]?.file_name
    }
    //count arising time 
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 2);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 14);

    const removeCartData = async (id, action, qty) => {
        try {
            setMainLoder(true)
            var data = {
                action: action,
                _id: id
            }
            if (action !== "remove-to-cart-product") {
                data.qty = qty
            }
            const res = await api.postWithToken(`${serverURL + ADDTOCART}`, data)
            if (res.data.success === true) {
                getCartData()
                setMyMessageCart(res.data.message);
                setSucessSnackBarOpenCart(!sucessSnackBarOpenCart);
            } else {
                setMyMessageCart(res.data.message);
                setWarningSnackBarOpenCart(!warningSnackBarOpenCart);
            }

            setTimeout(() => {
                setMainLoder(false)
            }, 1000);


        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        getLocalCartData()
        getCartData()
    }, [isLoggedIn,drawer]);

    let subtotal = parseFloat(localCart.subtotal).toFixed(2);

    return (
        <>
            <Offcanvas show={drawer} onHide={handleDrawerClose} placement="end" className="cart-canvas">
                <Offcanvas.Body>
                    <div className='cart-side position-relative'>

                        <Button className='close-modal-btn cart-side-close' onClick={handleDrawerClose}>
                            <MdOutlineClose />
                        </Button>

                        {isLoggedIn ?
                            <div className='cart-header d-flex align-items-center gap-2 pt-2'>
                                <img src='../img/product_def/right-black.png' alt='' width="18px" />
                                <h5>Added ({cartList.list ? cartList.list?.length : 0}) items to cart</h5>
                            </div> :

                            <div className='cart-header d-flex align-items-center gap-2 pt-2'>
                                <img src='../img/product_def/right-black.png' alt='' width="18px" />
                                <h5>Added ({localCart.items ? localCart.items?.length : 0}) items to cart</h5>
                            </div>
                        }

                        {((!cartList || !cartList.list || cartList.list.length === 0) && isLoggedIn ) &&
                            <div className='d-flex align-items-center justify-content-center h-100'>
                                <div className='text-center found'>
                                    <img src='../img/not-found.png' alt='' className='my-4' />
                                    <p className='mt-3'>The cart is empty</p>
                                    <Button className='mt-3 submit-btn' type='button' onClick={() => { navigate("/trending"); handleDrawerClose(); }}  >Shop Now</Button>
                                </div>
                            </div>
                        }


                        {((!localCart || !localCart.items || localCart.items.length === 0 ) && !isLoggedIn) &&
                            <div className='d-flex align-items-center justify-content-center h-100'>
                                <div className='text-center found'>
                                    <img src='../img/not-found.png' alt='' className='my-4' />
                                    <p className='mt-3'>The cart is empty</p>
                                    <Button className='mt-3 submit-btn' type='button' onClick={() => { navigate("/trending"); handleDrawerClose(); }}  >Shop Now</Button>
                                </div>
                            </div>
                        }


                        <div className='cart-list border-bottom-cos mt-4 pb-4'>
                            {
                                isLoggedIn && cartList.list && cartList.list?.map((e, i) => {
                                    return (
                                        <div className='cart-items d-flex align-items-start gap-3 mt-4 pointer' onClick={() => handelProductDetail(e.product_details?._id)} >
                                            <img className='pointer' src={cartList.productImagePath + e.product_id + "/" + getimagename(e.sku_details, e.skuid)} alt='' width="150px" />
                                            <div className='cart-items-text w-100'>
                                                <h5>{e.product_name}</h5>
                                                {/* <span className='d-flex align-items-center'>
                                                {formatDate(startDate)} - {formatDate(endDate)}
                                            </span>
                                            <span className='d-flex align-items-center'>By {e.seller_name}</span> */}
                                                <div className='d-flex align-items-center gap-2 cart-color w-100 mt-2'>
                                                    <h6>Color : </h6>
                                                    <span className='m-0'>{e.sku_data?.color}</span>
                                                </div>

                                                {e.sku_data?.size &&
                                                    <div className='d-flex align-items-center gap-2 cart-color w-100 mt-1'>
                                                        <h6>Size : </h6>
                                                        <span className='m-0'>{e.sku_data?.size}</span>
                                                    </div>
                                                }

                                                <div className='wrap-cos d-flex align-items-center justify-content-between'>
                                                    <div className='items-per d-flex align-items-center gap-2 mt-2'>
                                                        <h5>${e.total_price}</h5>
                                                        {/* <del>${e.product_details.group_price}</del> */}
                                                        {/* <span>{Math.round(e.product_details.group_price * 100 / e.product_details.individual_price)}% Off</span> */}
                                                    </div>

                                                    <div className='product-info d-flex align-items-center gap-3 marg-cos' onClick={(event) => event.stopPropagation()}>
                                                        <div className='qty d-flex align-items-center gap-3'>
                                                            <h5>Qty:</h5>
                                                            <div className='count-product'>
                                                                <Button onClick={(d) => (removeCartData(e?._id, "update-to-cart-qty", e.qty - 1))} > <MdRemove /></Button>
                                                                <span>{e.qty}</span>
                                                                <Button onClick={(d) => (removeCartData(e?._id, "update-to-cart-qty", e.qty + 1))}><MdAdd /></Button>
                                                            </div>
                                                        </div>
                                                        <Button onClick={() => removeCartData(e?._id, "remove-to-cart-product")} className='submit-btn delete-comment delete-product'>
                                                            <MdDelete />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }


                            {localCart.items?.length > 0 && localCart?.items.map((e, i) => {
                                return (
                                    <div className='cart-items d-flex align-items-start gap-3 mt-4 pointer' onClick={() => handelProductDetail(e.product_id)} >
                                        <img className='pointer' src={e.image} alt='' width="150px" />
                                        <div className='cart-items-text w-100'>
                                            <h5>{e.name}</h5>
                                            {/* <span className='d-flex align-items-center'>
                    {formatDate(startDate)} - {formatDate(endDate)}
                </span>
                <span className='d-flex align-items-center'>By {e.seller_name}</span> */}
                                            <div className='d-flex align-items-center gap-2 cart-color w-100 mt-2'>
                                                <h6>Color : </h6>
                                                <span className='m-0'>{e.color}</span>
                                            </div>

                                            {e?.size &&
                                                <div className='d-flex align-items-center gap-2 cart-color w-100 mt-1'>
                                                    <h6>Size : </h6>
                                                    <span className='m-0'>{e?.size}</span>
                                                </div>
                                            }

                                            <div className='wrap-cos d-flex align-items-center justify-content-between'>
                                                <div className='items-per d-flex align-items-center gap-2 mt-2'>
                                                    <h5>${e.total_price}</h5>
                                                    {/* <del>${e.product_details.group_price}</del> */}
                                                    {/* <span>{Math.round(e.product_details.group_price * 100 / e.product_details.individual_price)}% Off</span> */}
                                                </div>

                                                <div className='product-info d-flex align-items-center gap-3 marg-cos' onClick={(event) => event.stopPropagation()}>
                                                    <div className='qty d-flex align-items-center gap-3'>
                                                        <h5>Qty:</h5>
                                                        <div className='count-product'>
                                                            <Button onClick={(d) => decreaseProductQuantity(e.product_id)} > <MdRemove /></Button>
                                                            <span>{e.qty}</span>
                                                            <Button onClick={(d) => increaseProductQuantity(e.product_id)}><MdAdd /></Button>
                                                        </div>
                                                    </div>
                                                    <Button onClick={() => (deleteProductDetailsFromLocal(e.product_id), deleteProductFromLocalCart(e.product_id))} className='submit-btn delete-comment delete-product'>
                                                        <MdDelete />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })


                            }

                            {localCart.items?.length > 0 &&
                                <>
                                    <div className='sub-total d-flex gap-2 align-items-center p-10 mt-5'>
                                        <h5 className=''>Subtotal:</h5>
                                        <span>${subtotal}</span>
                                    </div>
                                    <Button className='go-cart mt-2' onClick={() => (navigate("/login"), handleDrawerClose(), localStorage.setItem('lastVisitedPath', "/cart"))}  >Go to cart</Button>
                                </>
                            }


                            {((cartList.list?.length > 0 && isLoggedIn)) &&
                                <>
                                    <div className='sub-total d-flex gap-2 align-items-center p-10 mt-5'>
                                        <h5 className=''>Subtotal:</h5>
                                        <span>${cartList.cartAmountDetails.total_amount}</span>
                                    </div>
                                    <Button className='go-cart mt-2' onClick={() => (navigate("/cart"), handleDrawerClose())}  >Go to cart</Button>
                                </>
                            }

                        </div>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}

export default CartDrawer