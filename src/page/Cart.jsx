import React, { useRef, useState, useEffect, useContext } from 'react'
import Layout from '../layout/Layout'
import { Button, Col, NavLink, Row } from 'react-bootstrap'
import {
    MdOutlineKeyboardArrowRight,
    MdOutlineKeyboardArrowDown,
    MdKeyboardDoubleArrowRight
} from "react-icons/md"
import { data } from "../page/Data"
import ProCard from '../components/ProCard'
import { useLocation, useNavigate } from 'react-router-dom'
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
import { CartContext } from '../context/CartContext'
import { Is_Login } from '../helper/IsLogin'
import { CardElement, Elements, ElementsConsumer } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useStripe, useElements } from '@stripe/react-stripe-js';


// Your public Stripe key
const stripePromise = loadStripe(process.env.REACT_APP_PUBLISHABLE_KEY_LOCAL);

const WrappedCart = () => {

    const stripe = useStripe();
    const elements = useElements();

    const isLoggedIn = Is_Login();
    const { getCartData, setCartList, couponId, setCouponId, cartList, add_wished_Called, Mymessage, setSucessSnackBarOpen, sucessSnackBarOpen, warningSnackBarOpen, setWarningSnackBarOpen, sellIs_wished, setProfileOption, getMyAddress, correntAddess, setCart, cart } = useContext(CartContext);

    const [checkboxes, setCheckboxes] = useState({
        checkbox1: false,
        checkbox2: false,
        checkbox3: false,
    });

    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const [fleshProductList, setFleshProductList] = useState([]);
    const serverURL = getServerURL();
    const [page, setPage] = useState(1);
    const [product_id, setProduct_id] = useState({});
    const [productColorActive, setProductColorActive] = useState();
    const [show, setShow] = useState(false);
    const [sucessSnackBarOpenCart, setSucessSnackBarOpenCart] = useState(false);
    const [warningSnackBarOpenCart, setWarningSnackBarOpenCart] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [MymessageCart, setMyMessageCart] = useState("");
    const [loading, setLoading] = useState(true);
    const [is_Wait, setIs_Wait] = useState(false);
    const player = useRef();
    const [stripeLoaded, setStripeLoaded] = useState(false);

    const startAnimation = () => {
        if (player.current) {
            player.current.play(); // Check if player.current is not null before accessing play()
        }
    };
    const stopAnimation = () => {
        setLoading(false);
    };

    // create order with payment
    const handleCheckout = async (event) => {

        try {
            // console.log(token, "stripe");
            setIsOpen(!isOpen);

            if (Object.keys(correntAddess)?.length === 0) {
                setMyMessageCart("Add  or select  Address")
                setWarningSnackBarOpenCart(!warningSnackBarOpenCart);
            } else {
                if (cartList.list?.length === 0) {
                    setMyMessageCart("You don't have any product in a cart")
                    setWarningSnackBarOpenCart(!warningSnackBarOpenCart);
                } else {

                    if (correntAddess?.data?.length !== 0) {
                        const amountInCents = Math.round(cartList?.cartAmountDetails?.net_amount * 100);
                        const data = {
                            order_items: cartList.list,
                            shipping_address_id: correntAddess.data[0]._id,
                            shipping_method_id: correntAddess.shipping_method_id
                        }
                        //validation for card detail
                        const cardElement = elements.getElement(CardElement);

                        if (cardElement) {
                            const cardElementState = cardElement._empty;

                            if (cardElementState) {
                                setMyMessageCart('Please enter your card details');
                                setWarningSnackBarOpenCart(!warningSnackBarOpenCart);
                                return;
                            }
                        }

                        const order = await api.postWithToken(`${serverURL + "order-create"}`, data)

                        if (order.data.success == true) {
                            setIs_Wait(true)
                            // create payment intent and get client_secret
                            const paymentIntentResponse = await api.post(`${serverURL + "create-payment-intent"}`, {
                                amount: amountInCents,
                                order_id: order.data.data?.orderObj?._id
                            });

                            const clientSecret = paymentIntentResponse.data.clientSecret;
                            if (!stripe || !elements) {
                                return;
                            }
                            const cardElement = elements.getElement(CardElement);

                            if (!cardElement) {
                                console.log("CardElement not loaded");
                                return;
                            }

                            const payment = await stripe.confirmCardPayment(clientSecret, {
                                payment_method: {
                                    card: cardElement,
                                    billing_details: {
                                    },
                                },
                            });

                            const paymentStatus = await api.post(`${serverURL + "order-payment-status"}`, { order_id: order.data.data?.orderObj?._id })
                            if (payment.error) {
                                setMyMessageCart(payment.error.message);
                                setWarningSnackBarOpenCart(!warningSnackBarOpenCart);
                            } else {
                                setMyMessageCart(paymentStatus.data.message);
                                setSucessSnackBarOpenCart(!sucessSnackBarOpenCart);

                                setTimeout(() => {
                                    setProfileOption("list")
                                    navigate("/profile")
                                }, 1000);
                                // Continue with the rest of your checkout flow here.
                            }
                            setIs_Wait(false)
                            getCartData()
                        } else {
                            setMyMessageCart(order.data.message);
                            setWarningSnackBarOpenCart(!warningSnackBarOpenCart);
                        }

                    } else {
                        setMyMessageCart("Add shipping address")
                        setWarningSnackBarOpen(!warningSnackBarOpenCart);
                    }
                }
            }
        } catch (error) {
            console.log(error);
            errorResponse(error, setMyMessageCart);
            setWarningSnackBarOpenCart(!warningSnackBarOpenCart);
        }
    };

    const removeCartData = async (id, action, qty) => {
        try {
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
        } catch (error) {
            console.log(error);
        }
    };

    const getFleshData = async () => {

        startAnimation()
        const apiTyp = isLoggedIn ? api.postWithToken : api.post;

        try {
            // if (isLoggedIn) {
            const [flashProduct] = await Promise.all([
                apiTyp(`${serverURL + PRODUCTList}`, {
                    product_list_type: "trending-product",
                    page: 1
                })
            ]);

            const flashProductproductListData = flashProduct.data.data;
            setFleshProductList(flashProductproductListData)
            stopAnimation()
        } catch (error) {
            console.log(error);
            errorResponse(error, setMyMessageCart);
            setWarningSnackBarOpenCart(!warningSnackBarOpenCart);
        }
    };

    const handleCoupon = async (action, coupon) => {
        try {
            var data = {
                action: action,
                cart_id: couponId,
                coupon_title: coupon ? coupon : couponCode
            }

            const res = await api.postWithToken(`${serverURL + "coupon-code-manage"}`, data)

            if (res.data.success === true) {
                getCartData()
                setMyMessageCart(res.data.message);
                setSucessSnackBarOpenCart(!sucessSnackBarOpenCart);
                setCouponCode("")
            } else if (res.data.success === false) {
                setMyMessageCart(res.data.message);
                setWarningSnackBarOpenCart(!warningSnackBarOpenCart);
            }
        } catch (error) {
            console.log(error, "error");
        }
    };

    useEffect(() => {
        getCartData();
        getFleshData()
        getMyAddress()
    }, [sellIs_wished, isLoggedIn, add_wished_Called]);

    //count arising time 
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 2);
  
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 14);
  
    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', {
        weekday: 'long', 
        year: 'numeric', 
        month: 'short', 
        day: '2-digit' 
      });
    };
  

        return (
            <>


                <SucessSnackBar
                    open={sucessSnackBarOpenCart}
                    setOpen={setSucessSnackBarOpenCart}
                    text={MymessageCart}
                    type="success"
                />

                <ErrorSnackBar
                    open={warningSnackBarOpenCart}
                    setOpen={setWarningSnackBarOpenCart}
                    text={MymessageCart}
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

                            <div className='cart-main pb-5'>
                                <div className='container-cos'>

                                    <div className='page-path d-flex align-items-center gap-1'>
                                        <div className='d-flex align-items-center gap-1'>
                                            <NavLink>Home</NavLink>
                                            <MdOutlineKeyboardArrowRight />
                                        </div>
                                        <NavLink className='active'>Cart</NavLink>

                                    </div>

                                    <Row className='mt-3'>
                                        <Col lg={7} md={12}>
                                            {cartList.list?.length <= 0 &&
                                                <div className='d-flex align-items-center justify-content-center h-100'>
                                                    <div className='text-center found'>
                                                        <img src='./img/not-found.png' alt='' />
                                                        <p className='mt-3'>The cart is empty</p>
                                                        <Button className='mt-3 submit-btn' type='button' onClick={() => navigate("/trending")}  >Shop Now</Button>
                                                    </div>
                                                </div>
                                            }
                                            <div className='cart-main-list'>

                                                <div>

                                                </div>

                                                {/* <div className='product-info'>
                                                <div className='order-time d-flex align-items-center justify-content-between'>
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
                                            </div> */}

                                                <div className='select-items mt-4'>
                                                    {/* <div className='select-all d-flex align-items-center'>
                                                    <input
                                                        id='select-all'
                                                        type='checkbox'
                                                        onChange={handleSelectAll}
                                                    />
                                                    <label htmlFor='select-all'>Select all</label>
                                                </div> */}

                                                    <div className='mt-3'>

                                                        {
                                                            cartList.list && cartList.list?.map((e, i) => {
                                                                return (

                                                                    <div className='cart-items pointer' onClick={() => handelProductDetail(e.product_details._id)} key={i} >

                                                                        <div className='items-img select-all d-flex align-items-center'>
                                                                            {/* <input
                                                                            id='select-all'
                                                                            type='checkbox'
                                                                            checked={checkboxes.checkbox1}
                                                                            onChange={event =>
                                                                                setCheckboxes(prevState => ({
                                                                                    ...prevState,
                                                                                    checkbox1: event.target.checked,
                                                                                }))
                                                                            }
                                                                        /> */}
                                                                            <img src={e.product_images} alt='' width="150px" />
                                                                        </div>
                                                                        <div className='cart-items-def w-100'>
                                                                            <h5>{e.product_name}</h5>
                                                                            <span className='d-flex align-items-center'>
                                                                                {formatDate(startDate)} - {formatDate(endDate)}
                                                                            </span>
                                                                            <span className='d-flex align-items-center'>By {e.seller_name}</span>
                                                                            <Button className='select-items-color mt-2 my-3'>
                                                                                {e.sku_attributes?.color[0]?.name}
                                                                                <MdOutlineKeyboardArrowRight />
                                                                            </Button>

                                                                            <div className='wrap-cos d-flex align-items-center justify-content-between'>
                                                                                <div className='items-per d-flex align-items-center gap-2 mt-2'>
                                                                                    <h5>${e.product_details.individual_price}</h5>
                                                                                    <del>${e.product_details.group_price}</del>
                                                                                    <span>{Math.round(e.product_details.group_price * 100 / e.product_details.individual_price)}% Off</span>
                                                                                </div>

                                                                                <div className='product-info d-flex align-items-center gap-3 marg-cos'>
                                                                                    <div className='qty d-flex align-items-center gap-3'>
                                                                                        <h5>Qty:</h5>
                                                                                        <div className='count-product'>
                                                                                            <Button onClick={(d) => (removeCartData(e._id, "update-to-cart-qty", e.qty - 1))} > <MdRemove /></Button>
                                                                                            <span>{e.qty}</span>
                                                                                            <Button onClick={(d) => (removeCartData(e._id, "update-to-cart-qty", e.qty + 1))}><MdAdd /></Button>
                                                                                        </div>
                                                                                    </div>
                                                                                    <Button onClick={() => removeCartData(e._id, "remove-to-cart-product")} className='delete-btn'>
                                                                                        <img src='./img/cart/delete.png' alt='' />
                                                                                    </Button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        }

                                                    </div>
                                                </div>

                                                {/* <div className='unavailable mt-5'>
                                                <h5>Unavailable item (1)</h5>
                                                <div className='mail d-flex align-items-center gap-2 mb-4 mt-2 pt-1'>
                                                    <img src='./img/cart/email.png' alt='' />
                                                    <span>We will email you if the following items are restocked.</span>
                                                </div>

                                                <div className='cart-items'>
                                                    <div className='items-img select-all d-flex align-items-center'>
                                                        <input id='select-all' type='checkbox' />
                                                        <img src='./img/cart/cart1.png' alt='' style={{ marginLeft: "30px" }} width="150px" />
                                                    </div>
                                                    <div className='cart-items-def'>
                                                        <h5>A Student Backpack Casual School Bag Lightweight Computer Backpack Water Resistant Travel Backpack Fits 13 Inch Laptop</h5>
                                                        <span className='d-flex align-items-center'>By <img src='./img/product_def/uppack.png' alt='' /> Lalyuan</span>

                                                        <div className='d-flex align-items-center justify-content-between'>
                                                            <span className='d-flex align-items-center gap-1 mt-2'>
                                                                <img src='./img/cart/note.png' alt='' />
                                                                This item is sold out.
                                                            </span>
                                                            <Button className='delete-btn'>
                                                                <img src='./img/cart/delete.png' alt='' />
                                                            </Button>
                                                        </div>

                                                        <Button className='select-items-color mt-2 my-3'>
                                                            Similar items
                                                            <MdOutlineKeyboardArrowDown />
                                                        </Button>


                                                    </div>
                                                </div>
                                            </div> */}

                                            </div>
                                        </Col>

                                        <Col lg={5} md={12} className='mt-5 mt-lg-0'>
                                            <div className='ps-0 ps-lg-5'>
                                                <div className='order-summary'>
                                                    <h5>Order summary</h5>

                                                    <div className='total-list mt-3'>
                                                        <div className='d-flex align-items-center justify-content-between'>
                                                            <label>TOTAL ITEM VALUE </label>
                                                            <h5>${cartList.cartAmountDetails?.total_amount ? cartList.cartAmountDetails?.total_amount : 0}</h5>
                                                        </div>

                                                        <div className='d-flex align-items-center justify-content-between mt-2'>
                                                            <label>SHIPPING CHARGE </label>
                                                            {/* {console.log(cartList.cartAmountDetails?.shipping_charge,"cartList.cartAmountDetails?.shipping_charge")} */}
                                                            {
                                                                cartList.cartAmountDetails?.shipping_charge
                                                                    ? <h5>$ {cartList.cartAmountDetails?.shipping_charge}</h5>
                                                                    : <div className='d-flex align-items-center gap-2'>
                                                                        <del> $5.00 </del>
                                                                        <h5>(FREE)</h5>
                                                                    </div>
                                                            }

                                                        </div>

                                                        <div className='d-flex align-items-center justify-content-between mt-2'>
                                                            <label>SALES TEX </label>
                                                            <h5>${cartList.cartAmountDetails?.sales_tax ? cartList.cartAmountDetails?.sales_tax : 0}</h5>
                                                        </div>

                                                        <div className='d-flex align-items-center justify-content-between mt-2'>
                                                            <span>DISCOUNT </span>
                                                            <span>{cartList.cartAmountDetails?.discount_amount ? "-$" + cartList.cartAmountDetails?.discount_amount : "$0"}</span>
                                                        </div>

                                                    </div>

                                                    <div className='total mt-3'>
                                                        <div className='d-flex align-items-center justify-content-between'>
                                                            <h5>NET PAYABLE ({cartList.list?.length} items)</h5>
                                                            <h5>${cartList.cartAmountDetails?.net_amount ? cartList.cartAmountDetails?.net_amount : 0}</h5>
                                                        </div>
                                                        {/* <p>Taxes and delivery fees are calculated on the next page.</p> */}
                                                    </div>

                                                    <div className='checkout-main mt-3'>

                                                        <div className='mb-3'>
                                                            <div className='login-input text-start'>
                                                                <label>Coupon Code</label>

                                                                {cartList.cartDiscount?.coupon_id?.coupon_title ?
                                                                    <div>
                                                                        <div className='coupne-code d-flex align-items-center gap-2 mt-2'>
                                                                            <span>{cartList.cartDiscount.coupon_id?.coupon_title}</span>
                                                                            <Button onClick={() => handleCoupon("remove", cartList?.cartDiscount.coupon_id?.coupon_title)} ><AiFillCloseCircle /></Button>
                                                                        </div>
                                                                        <p>{cartList.cartDiscount?.coupon_id?.coupon_description}</p>
                                                                    </div> :
                                                                    <div className='d-flex align-items-center gap-2'>
                                                                        <input className='mt-0' placeholder='Enter coupon code ' value={couponCode} onChange={(e) => setCouponCode(e.target.value)} type='text' />
                                                                        <Button className='checkout px-4 '
                                                                            onClick={() => handleCoupon("apply")}
                                                                            style={{ width: "auto", whiteSpace: "nowrap" }} >Apply</Button>
                                                                    </div>
                                                                }
                                                            </div>
                                                        </div>

                                                        {/* <p>4 interest-free installments of <span>$15.39</span></p> */}
                                                        {/* <p className='add d-flex align-items-center gap-2 mt-2'> with
                                                        <img src='./img/after.png' alt='' width="60px" />
                                                        or
                                                        <img src='./img/kla.png' alt='' width="60px" />
                                                        <img src='./img/cart/blue-note.png' alt='' />
                                                    </p> */}

                                                        {/* <StripeCheckout
                                                        stripeKey="pk_test_51LRdY5Gli3mG69O8osWmVdwsRWJG0zFsKoef3dVnaJd8byvVQKQQlbFJtdU5mTp5oAMn9TddIezKaOsrOl6WaSVG00dCweTrSr"
                                                        token={handleCheckout}
                                                        amount={productList.cartAmountDetails?.net_amount} // Amount in cents
                                                        name="My Product"
                                                        description="Product description"
                                                        currency="USD"
                                                    /> */}

                                                        <div>
                                                            <div className='mt-3 login-input'>
                                                                <label>Shipping details</label>

                                                                {correntAddess.data && correntAddess.data.map((e, i) => {
                                                                    return (
                                                                        <div className='address-shipped mt-2'>
                                                                            <h6> {e.fullname}</h6>
                                                                            <p className='mt-1'>{e.zipcode} , {e.address} <br />{e.state_id?.name},{e.country_id?.name},{e.contact_no} </p>
                                                                        </div>
                                                                    )
                                                                })}
                                                                {Object.keys(correntAddess)?.length === 0 && <Button className='change-add' onClick={() => (navigate("/profile"), setProfileOption("location"))} >Add</Button>}
                                                            </div>

                                                        </div>
                                                        <div className='address-shipped mt-3'>
                                                            <CardElement />
                                                        </div>

                                                        {stripe ? (
                                                            <ElementsConsumer>
                                                                {({ elements, stripe }) => (
                                                                    <div>
                                                                        <Button className='checkout mt-3' disabled={!stripe} onClick={() => handleCheckout()}>  {is_Wait ? "Loading..." : "Checkout"} </Button>
                                                                    </div>
                                                                )}
                                                            </ElementsConsumer>
                                                        ) : (
                                                            <div>Loading...</div>
                                                        )
                                                        }

                                                    </div>

                                                </div>

                                                <div className='term mt-5 mar-top-20'>
                                                    <p><img src='./img/cart/note.png' alt='' />
                                                        Item availability and pricing are not guaranteed until payment is final.</p>
                                                    <div>
                                                        <span>
                                                            <img src='./img/cart/cart-icone.png' alt='' />
                                                            Clubmall Purchase Protection
                                                        </span>
                                                        <p className='ps-4 mt-2'>Shop confidently on Clubmall knowing that if something goes wrong, we’ve always got your back.</p>
                                                        {/* <NavLink className='ps-4 mt-2'>See program terms</NavLink> */}
                                                    </div>
                                                    <span>
                                                        <img src='./img/cart/commited.png' alt='' />
                                                        Clubmall is commited to environmental sustainability
                                                    </span>

                                                    {/* 
                                                <h5 className='mt-4 pt-2'>Secure options in checkout</h5>
                                                <img src='./img/cart/card-logo.png' alt='' className='mt-3 cards-logo' /> */}
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>

                                    <div className='recent-view product-info'>
                                        <h4>Based on your recently viewed</h4>
                                        <div className='mb-0 explore-main'>
                                            {
                                                fleshProductList?.productListArrObj && fleshProductList?.productListArrObj?.map((e) => {
                                                    return (
                                                        <ProCard
                                                            id={e._id}
                                                            img={e.product_images[0]?.file_name}
                                                            name={e?.name}
                                                            group_price={e.group_price}
                                                            individual_price={e.individual_price}
                                                            sold={e.total_order}
                                                            secper={e.secper}
                                                            off={e.discount_percentage}
                                                            path={fleshProductList?.productImagePath && fleshProductList.productImagePath}
                                                            is_wishList={e.wishList && e.wishList}
                                                        />
                                                    )
                                                })
                                            }
                                            {/* <div className='w-100 d-flex justify-content-center'>
                                            <Button className='shop-btn rotate-img btn-cos-mobile'  onClick={() => navigate("/trending")} >View More <MdKeyboardDoubleArrowRight /></Button>
                                        </div> */}
                                        </div>
                                    </div>

                                </div>


                            </div>

                        </>
                    )
                }

            </ >
        )
    }

    // Wrap your Cart component with Elements component
    const Cart = () => (
        <Elements stripe={stripePromise}>
            <WrappedCart />
        </Elements>
    );


    export default Cart
