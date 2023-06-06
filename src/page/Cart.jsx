import React, { useRef, useState, useEffect } from 'react'
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
import { ADDTOCART , PRODUCTList} from "../helper/endpoints";
import api from "../helper/api";
import { getServerURL } from '../helper/envConfig';
import Loader from '../components/Loader';
import SucessSnackBar from "../components/SnackBar";
import ErrorSnackBar from "../components/SnackBar";

const Cart = () => {

    const [checkboxes, setCheckboxes] = useState({
        checkbox1: false,
        checkbox2: false,
        checkbox3: false,
    });

    const navigate = useNavigate();

    const [productList, setProductList] = useState([]);
    const [fleshProductList, setFleshProductList] = useState([]);
    const serverURL = getServerURL();
    const [page, setPage] = useState(1);
    const [product_id, setProduct_id] = useState({});
    const [productColorActive, setProductColorActive] = useState()
    const [show, setShow] = useState(false);
    const [sucessSnackBarOpen, setSucessSnackBarOpen] = useState(false);
    const [warningSnackBarOpen, setWarningSnackBarOpen] = useState(false);
    const [Mymessage, setMyMessage] = useState("");
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

    function handleSelectAll(event) {
        const { checked } = event.target;

        setCheckboxes(prevState => ({
            ...prevState,
            checkbox1: checked,
            checkbox2: checked,
            checkbox3: checked,
        }));
    }

    const handleClose = () => {
        setProduct_id({})
        setShow(false)
    }

    const handleShow = (id) => {
        setProduct_id(id)
        setShow(true);
    }

    const removeCartData = async (id) => {
        try {


            const res = await api.postWithToken(`${serverURL + ADDTOCART}`,
                {
                    action: "remove-to-cart-product",
                    _id: id
                }
            )

            if (res.data.success == true) {
                getCartData()
                setSucessSnackBarOpen(!sucessSnackBarOpen);
                setMyMessage(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };



    const getCartData = async () => {
        startAnimation()
        try {
            const [poroductResponse,flashProduct] = await Promise.all([
                api.postWithToken(`${serverURL + ADDTOCART}`, { "action": "cart-list" }),
                api.post(`${serverURL + PRODUCTList}`, {
                    product_list_type: "recommended-products",
                    page: 1
                })
            ]);

            const poroductData = poroductResponse.data.data;
            const flashProductproductListData = flashProduct.data.data;
            setProductList(poroductData);
            setFleshProductList(flashProductproductListData)
            stopAnimation()
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCartData();
    }, []);

 console.log(productList,"productList");


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

                        <div className='cart-main pt-4 pb-5'>
                            <div className='container-cos'>

                                <div className='page-path d-flex align-items-center gap-1'>
                                    <div className='d-flex align-items-center gap-1'>
                                        <NavLink>Home</NavLink>
                                        <MdOutlineKeyboardArrowRight />
                                    </div>
                                    <NavLink className='active'>cart</NavLink>
                                </div>

                                <Row className='mt-3'>
                                    <Col lg={7} md={12}>
                                        <div className='cart-main-list'>

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
                                                        productList.list && productList.list.map((e, i) => {
                                                            return (
                                                                <div className='cart-items' key={i} >
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
                                                                        <img src={e.product_images} alt='' style={{ marginLeft: "30px" }} width="150px" />
                                                                    </div>
                                                                    <div className='cart-items-def w-100'>
                                                                        <h5>{e.product_name}</h5>
                                                                        <span className='d-flex align-items-center'>By <img src='./img/product_def/uppack.png' alt='' /> {e.seller_name}</span>
                                                                        <Button className='select-items-color mt-2 my-3'>
                                                                        {e.sku_attributes?.color[0]?.name}
                                                                            
                                                                            <MdOutlineKeyboardArrowRight />
                                                                        </Button>
                                                                        <p>Hot Deal  I   Ends in 04:23:58:15</p>

                                                                        <div className='wrap-cos d-flex align-items-center justify-content-between'>
                                                                            <div className='items-per d-flex align-items-center gap-2 mt-2'>
                                                                                <h5>${e.product_details.individual_price}</h5>
                                                                                <del>${e.product_details.group_price}</del>
                                                                                <span>{Math.round(e.product_details.group_price * 100 / e.product_details.individual_price)}% Off</span>
                                                                            </div>

                                                                            <div className='product-info d-flex align-items-center gap-3 marg-cos'>
                                                                                <div className='qty d-flex align-items-center gap-2'>
                                                                                    <h5>Qty:</h5>
                                                                                    <select  >
                                                                                        <option>1</option>
                                                                                        <option>2</option>
                                                                                        <option>3</option>
                                                                                        <option>4</option>
                                                                                    </select>
                                                                                </div>
                                                                                <Button onClick={() => removeCartData(e._id)} className='delete-btn'>
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
                                                        <label>Item(s) total: </label>
                                                        <del>${productList.cartAmountDetails?.total_amount}</del>
                                                    </div>
                                                    <div className='d-flex align-items-center justify-content-between mt-2'>
                                                        <label>Item(s) discount: </label>
                                                        <span>-${productList.cartAmountDetails?.discount_amount}</span>
                                                    </div>
                                                    <div className='d-flex align-items-center justify-content-between mt-2'>
                                                        <label>Item(s) sales tax: </label>
                                                        <span>${productList.cartAmountDetails?.sales_tax}</span>
                                                    </div>
                                                    
                                                    <div className='d-flex align-items-center justify-content-between mt-2'>
                                                        <label>Item(s) shipping charge: </label>
                                                        <span>${productList.cartAmountDetails?.shipping_charge}</span>
                                                    </div>
                                                    <div className='d-flex align-items-center justify-content-end mt-3'>
                                                        <h5>${productList.cartAmountDetails?.net_amount}</h5>
                                                    </div>
                                                </div>

                                                <div className='total'>
                                                    <div className='d-flex align-items-center justify-content-between'>
                                                        <h5>Estimated total ({productList.list?.length} items)</h5>
                                                        <h5>${productList.cartAmountDetails?.net_amount}</h5>
                                                    </div>
                                                    {/* <p>Taxes and delivery fees are calculated on the next page.</p> */}
                                                </div>

                                                <div className='checkout-main mt-3'>
                                                    {/* <p>4 interest-free installments of <span>$15.39</span></p> */}
                                                    {/* <p className='add d-flex align-items-center gap-2 mt-2'> with
                                                        <img src='./img/after.png' alt='' width="60px" />
                                                        or
                                                        <img src='./img/kla.png' alt='' width="60px" />
                                                        <img src='./img/cart/blue-note.png' alt='' />
                                                    </p> */}
                                                    <Button className='checkout mt-4'>Checkout</Button>
                                                    <Button className='mt-3 btn-cos'>Express checkout with</Button>
                                                </div>

                                            </div>


                                            <div className='term mt-5'>
                                                <p><img src='./img/cart/note.png' alt='' />
                                                    Item availability and pricing are not guaranteed until payment is final.</p>
                                                <span>
                                                    <img src='./img/cart/lock.png' alt='' />
                                                    You will not be charged until you review this order on the next page
                                                </span>
                                                <div>
                                                    <span>
                                                        <img src='./img/cart/cart-icone.png' alt='' />
                                                        Clubmall Purchase Protection
                                                    </span>
                                                    <p className='ps-4 mt-2'>Shop confidently on Clubmall knowing that if something goes wrong, we’ve always got your back.</p>
                                                    <NavLink className='ps-4 mt-2'>See program terms</NavLink>
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
                                            fleshProductList?.productListArrObj?.map((e) => {
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
                                                    path={fleshProductList?.productImagePath && fleshProductList.productImagePath}
                                                    />
                                                )
                                            })
                                        }
                                        <div className='w-100 d-flex justify-content-center'>
                                            <Button className='shop-btn rotate-img'>View More <MdKeyboardDoubleArrowRight /></Button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </>
                )}
        </Layout>
    )
}

export default Cart
