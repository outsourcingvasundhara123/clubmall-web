import React, { useRef, useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Is_Login } from '../helper/IsLogin'
import { CartContext } from '../context/CartContext'
import { Button, Offcanvas, } from 'react-bootstrap'
import {

    MdOutlineClose,
    MdDelete

} from "react-icons/md"
import { handelProductDetail } from '../helper/constants';
import { ADDTOCART } from "../helper/endpoints";
import api from "../helper/api";
import { getServerURL } from '../helper/envConfig';
import { MdRemove, MdAdd } from 'react-icons/md'



const CartDrawer = () => {
    const { getcartcount, localCart, getLocalCartData, increaseProductQuantity, decreaseProductQuantity, deleteProductDetailsFromLocal, deleteProductFromLocalCart,  handleDrawerClose, drawer, cartList, setMainLoder,  getCartData,  setSucessSnackBarOpen, sucessSnackBarOpen, setMyMessage,  } = useContext(CartContext);
    const isLoggedIn = Is_Login();
    const navigate = useNavigate();
    const [sucessSnackBarOpenCart, setSucessSnackBarOpenCart] = useState(false);
    const [warningSnackBarOpenCart, setWarningSnackBarOpenCart] = useState(false);
    const textRef = useRef(null);
    const [timeRemaining, setTimeRemaining] = useState(null); // time in seconds
    // Define discount offers and their corresponding thresholds
    const offers = [
        { discount: 10, threshold: 49 },
        { discount: 15, threshold: 89 },
        { discount: 20, threshold: 120 }
    ];

    const [applicableOffer, setApplicableOffer] = useState(offers[0]); // Start with the default offer

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
                getcartcount()
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

    //------Timer------- 

    useEffect(() => {
        // On component mount, check if there's an end-time saved in localStorage
        const endTime = localStorage.getItem('end-time');

        if (endTime) {
            const now = new Date().getTime();
            const remaining = Math.floor((endTime - now) / 1000);
            setTimeRemaining(remaining > 0 ? remaining : null);
        }
    }, []);

    useEffect(() => {
        const itemsCount = (localCart.items?.length || 0) + (cartList.list?.length || 0);

        if (itemsCount > 0 && timeRemaining === null) {
            const newRemaining = 2 * 60 * 60; // 2 hours in seconds
            setTimeRemaining(newRemaining);

            const now = new Date().getTime();
            const endTime = now + newRemaining * 1000;
            localStorage.setItem('end-time', endTime.toString());
        }

        if (timeRemaining === 0) {
            setTimeRemaining(null);
            localStorage.removeItem('end-time');

            // If you want to restart the timer automatically when it ends
            if (itemsCount > 0) {
                const newRemaining = 2 * 60 * 60;
                setTimeRemaining(newRemaining);

                const now = new Date().getTime();
                const endTime = now + newRemaining * 1000;
                localStorage.setItem('end-time', endTime.toString());
            }
            return;
        }

        const timerId = timeRemaining !== null ? setInterval(() => {
            setTimeRemaining(prevTime => prevTime - 1);
        }, 1000) : null;

        return () => clearInterval(timerId);
    }, [cartList, localCart, timeRemaining]);

    const formatTime = () => {
        if (timeRemaining === null) return { hours: '00', minutes: '00', seconds: '00' };
        const hours = Math.floor(timeRemaining / 3600);
        const minutes = Math.floor((timeRemaining % 3600) / 60);
        const seconds = timeRemaining % 60;
        return {
            hours: hours.toString().padStart(2, '0'),
            minutes: minutes.toString().padStart(2, '0'),
            seconds: seconds.toString().padStart(2, '0')
        };
    };

    const { hours, minutes, seconds } = formatTime();

    // ------ Timer END ------- // 


    useEffect(() => {
        getLocalCartData()
        getCartData()
    }, [isLoggedIn, drawer]);

    let subtotal = parseFloat(localCart.subtotal).toFixed(2);

    // Calculate cart total based on localCart and cartList
    const cartTotal = cartList.cartAmountDetails?.total_amount || subtotal;

    // Calculate the remaining amount needed for the next offer threshold
    const nextOffer = offers.find(offer => cartTotal < offer.threshold);
    const remainingForNextOffer = nextOffer ? (nextOffer.threshold - cartTotal) : 0;

    // Update applicable offer whenever the cart total changes
    useEffect(() => {
        if (cartTotal >= offers[2].threshold) {
            setApplicableOffer(offers[2]);
        } else if (cartTotal >= offers[1].threshold) {
            setApplicableOffer(offers[1]);
        } else if (cartTotal >= offers[0].threshold) {
            setApplicableOffer(offers[0]);
        }
    }, [cartTotal]);

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

                        {((!cartList || !cartList.list || cartList.list?.length === 0) && isLoggedIn) &&
                            <div className='d-flex align-items-center justify-content-center h-100'>
                                <div className='text-center found'>
                                    <img src='../img/not-found.png' alt='' className='my-4' />
                                    <p className='mt-3'>The cart is empty</p>
                                    <Button className='mt-3 submit-btn' type='button' onClick={() => { navigate("/trending"); handleDrawerClose(); }}  >Shop Now</Button>
                                </div>
                            </div>
                        }


                        {((!localCart || !localCart.items || localCart.items?.length === 0) && !isLoggedIn) &&
                            <div className='d-flex align-items-center justify-content-center h-100'>
                                <div className='text-center found'>
                                    <img src='../img/not-found.png' alt='' className='my-4' />
                                    <p className='mt-3'>The cart is empty</p>
                                    <Button className='mt-3 submit-btn' type='button' onClick={() => { navigate("/trending"); handleDrawerClose(); }}  >Shop Now</Button>
                                </div>
                            </div>
                        }
                        <div className="product-info mt-3">
                            {localCart.items?.length > 0 || cartList.list?.length > 0 ? (
                                <div className="order-time d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center gap-3">
                                        <h5>Hurry Up Shoppers </h5>
                                    </div>
                                    <div className="d-flex align-items-center gap-3 order-time-cos">
                                        <span>Offer Ends in</span>
                                        <div className="time d-flex align-items-center gap-2">
                                            <span>{hours}</span>
                                            <p>:</p>
                                            <span>{minutes}</span>
                                            <p>:</p>
                                            <span>{seconds}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : ("")}
                        </div>

                        <div className='cart-list border-bottom-cos mt-4 pb-4'>

                            {/* {timeRemaining !== null && (
                                <div>
                                    Time remaining: {formatTime()}
                                </div>
                            )} */}

                            {
                                isLoggedIn && cartList.list && cartList.list?.map((e, i) => {
                                    return (
                                        <div key={i} className='cart-items d-flex align-items-start gap-3 mt-4 pointer' onClick={() => handelProductDetail(e.product_details?._id)} >
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

                                    <div key={i} className='cart-items d-flex align-items-start gap-3 mt-4 pointer' onClick={() => handelProductDetail(e.product_id)} >
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


                            {/* ... other code ... */}
                            {/* {localCart.items?.length > 0 || cartList.list?.length > 0 ? (
                                <div className='coupon-code-text d-flex align-items-center gap-3'>
                                    <Button className='submit-btn clubmalltry' onClick={handleCopy} >CLUBMALLTRY</Button>
                                    {applicableOffer && (
                                        <p>
                                            <span>GET {applicableOffer.discount}% OFF</span> on spend ${applicableOffer.threshold} or more using <span ref={textRef}>clubmalltry</span> coupon code
                                        </p>
                                    )}

                                </div>
                            ) : (
                                ""
                            )} */}


                            {(localCart.items?.length > 0 || cartList.list?.length > 0) && nextOffer?.discount ? (
                                <div className='coupon-code-text d-flex align-items-center gap-3'>
                                    <Button className='submit-btn clubmalltry' onClick={handleCopy} >CLUBMALLTRY</Button>
                                    {/* Display the remaining amount needed for the next offer */}

                                    <p>
                                        <span>GET {nextOffer.discount}% OFF</span> on orders of  ${parseFloat(remainingForNextOffer).toFixed(2)} or more using coupon code <span ref={textRef}>clubmalltry</span> 
                                    </p>

                                    {/* 
                                    {remainingForNextOffer > 0 && (
                                        <p>Spend ${parseFloat(remainingForNextOffer).toFixed(2)} more for {nextOffer.discount}% OFF</p>
                                    )} */}

                                </div>
                            ) : (
                                ""
                            )}


                            { cartTotal >= 120  ? (
                                <div className='coupon-code-text d-flex align-items-center gap-3'>
                                    <Button className='submit-btn clubmalltry' onClick={handleCopy} >CLUBMALLTRY</Button>
                                    {/* Display the remaining amount needed for the next offer */}

                                    <p>
                                        <span>GET 20% OFF</span> using  coupon code <span ref={textRef}>clubmalltry</span> 
                                    </p>

                                    {/* 
                                    {remainingForNextOffer > 0 && (
                                        <p>Spend ${parseFloat(remainingForNextOffer).toFixed(2)} more for {nextOffer.discount}% OFF</p>
                                    )} */}
                                </div>
                            ) : (
                                ""
                            )}


                            {localCart.items?.length > 0 &&
                                <>
                                    <div className='sub-total d-flex gap-2 align-items-center p-10 mt-3'>
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