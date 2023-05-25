import React, { useState } from 'react'
import Layout from '../layout/Layout'
import { Button, Col, NavLink, Row } from 'react-bootstrap'
import {
    MdOutlineKeyboardArrowRight,
    MdOutlineKeyboardArrowDown,
    MdKeyboardDoubleArrowRight
} from "react-icons/md"
import { data } from "../page/Data"
import ProCard from '../components/ProCard'

const Cart = () => {

    const [selectAll, setSelectAll] = useState();

    return (
        <Layout>
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

                                <div className='product-info'>
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
                                </div>

                                <div className='select-items mt-4'>
                                    <div className='select-all d-flex align-items-center'>
                                        <input id='select-all' type='checkbox' onClick={() => setSelectAll(!selectAll)} />
                                        <label htmlFor='select-all'>Select all</label>
                                    </div>

                                    <div className='mt-3'>

                                        <div className='cart-items'>
                                            <div className='items-img select-all d-flex align-items-center'>
                                                <input id='select-all' type='checkbox' checked={selectAll} />
                                                <img src='./img/cart/cart1.png' alt='' style={{ marginLeft: "30px" }} width="150px" />
                                            </div>
                                            <div className='cart-items-def'>
                                                <h5>A Student Backpack Casual School Bag Lightweight Computer Backpack Water Resistant Travel Backpack Fits 13 Inch Laptop</h5>
                                                <span className='d-flex align-items-center'>By <img src='./img/product_def/uppack.png' alt='' /> Lalyuan</span>
                                                <Button className='select-items-color mt-2 my-3'>
                                                    White
                                                    <MdOutlineKeyboardArrowRight />
                                                </Button>
                                                <p>Hot Deal  I   Ends in 04:23:58:15</p>

                                                <div className='wrap-cos d-flex align-items-center justify-content-between'>
                                                    <div className='items-per d-flex align-items-center gap-2 mt-2'>
                                                        <h5>$299,43</h5>
                                                        <del>$534,33</del>
                                                        <span>24% Off</span>
                                                    </div>

                                                    <div className='product-info d-flex align-items-center gap-3 marg-cos'>
                                                        <div className='qty d-flex align-items-center gap-2'>
                                                            <h5>Qty:</h5>
                                                            <select>
                                                                <option>1</option>
                                                                <option>2</option>
                                                                <option>3</option>
                                                                <option>4</option>
                                                            </select>
                                                        </div>
                                                        <Button className='delete-btn'>
                                                            <img src='./img/cart/delete.png' alt='' />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='cart-items'>
                                            <div className='items-img select-all d-flex align-items-center'>
                                                <input id='select-all' type='checkbox' checked={selectAll} />
                                                <img src='./img/cart/cart2.png' alt='' style={{ marginLeft: "30px" }} width="150px" />
                                            </div>
                                            <div className='cart-items-def'>
                                                <h5>A Student Backpack Casual School Bag Lightweight Computer Backpack Water Resistant Travel Backpack Fits 13 Inch Laptop</h5>
                                                <span className='d-flex align-items-center'>By <img src='./img/product_def/uppack.png' alt='' /> Lalyuan</span>
                                                <Button className='select-items-color mt-2 my-3'>
                                                    White
                                                    <MdOutlineKeyboardArrowRight />
                                                </Button>
                                                <p>Hot Deal  I   Ends in 04:23:58:15</p>

                                                <div className='wrap-cos d-flex align-items-center justify-content-between'>
                                                    <div className='items-per d-flex align-items-center gap-2 mt-2'>
                                                        <h5>$299,43</h5>
                                                        <del>$534,33</del>
                                                        <span>24% Off</span>
                                                    </div>

                                                    <div className='product-info d-flex align-items-center gap-3 marg-cos'>
                                                        <div className='qty d-flex align-items-center gap-2'>
                                                            <h5>Qty:</h5>
                                                            <select>
                                                                <option>1</option>
                                                                <option>2</option>
                                                                <option>3</option>
                                                                <option>4</option>
                                                            </select>
                                                        </div>
                                                        <Button className='delete-btn'>
                                                            <img src='./img/cart/delete.png' alt='' />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='cart-items'>
                                            <div className='items-img select-all d-flex align-items-center'>
                                                <input id='select-all' type='checkbox' checked={selectAll} />
                                                <img src='./img/cart/cart3.png' alt='' style={{ marginLeft: "30px" }} width="150px" />
                                            </div>
                                            <div className='cart-items-def'>
                                                <h5>A Student Backpack Casual School Bag Lightweight Computer Backpack Water Resistant Travel Backpack Fits 13 Inch Laptop</h5>
                                                <span className='d-flex align-items-center'>By <img src='./img/product_def/uppack.png' alt='' /> Lalyuan</span>
                                                <Button className='select-items-color mt-2 my-3'>
                                                    White
                                                    <MdOutlineKeyboardArrowRight />
                                                </Button>
                                                <p>Hot Deal  I   Ends in 04:23:58:15</p>

                                                <div className='wrap-cos d-flex align-items-center justify-content-between'>
                                                    <div className='items-per d-flex align-items-center gap-2 mt-2'>
                                                        <h5>$299,43</h5>
                                                        <del>$534,33</del>
                                                        <span>24% Off</span>
                                                    </div>

                                                    <div className='product-info d-flex align-items-center gap-3 marg-cos'>
                                                        <div className='qty d-flex align-items-center gap-2'>
                                                            <h5>Qty:</h5>
                                                            <select>
                                                                <option>1</option>
                                                                <option>2</option>
                                                                <option>3</option>
                                                                <option>4</option>
                                                            </select>
                                                        </div>
                                                        <Button className='delete-btn'>
                                                            <img src='./img/cart/delete.png' alt='' />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className='unavailable mt-5'>
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
                                </div>

                            </div>
                        </Col>

                        <Col lg={5} md={12} className='mt-5 mt-lg-0'>
                            <div className='ps-0 ps-lg-5'>
                                <div className='order-summary'>
                                    <h5>Order summary</h5>

                                    <div className='total-list mt-3'>
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <label>Item(s) total: </label>
                                            <del>$534,33</del>
                                        </div>
                                        <div className='d-flex align-items-center justify-content-between mt-2'>
                                            <label>Item(s) discount: </label>
                                            <span>-$63.37</span>
                                        </div>
                                        <div className='d-flex align-items-center justify-content-end mt-3'>
                                            <h5>$61.56</h5>
                                        </div>
                                    </div>

                                    <div className='total'>
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <h5>Estimated total (7 items)</h5>
                                            <h5>$61.56</h5>
                                        </div>
                                        <p>Taxes and delivery fees are calculated on the next page.</p>
                                    </div>

                                    <div className='checkout-main mt-3'>
                                        <p>4 interest-free installments of <span>$15.39</span></p>
                                        <p className='add d-flex align-items-center gap-2 mt-2'> with
                                            <img src='./img/after.png' alt='' width="60px" />
                                            or
                                            <img src='./img/kla.png' alt='' width="60px" />
                                            <img src='./img/cart/blue-note.png' alt='' />
                                        </p>
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


                                    <h5 className='mt-4 pt-2'>Secure options in checkout</h5>
                                    <img src='./img/cart/card-logo.png' alt='' className='mt-3 cards-logo' />
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <div className='recent-view product-info'>
                        <h4>Based on your recently viewed</h4>
                        <div className='mb-0 explore-main'>
                            {
                                data.map((e) => {
                                    return (
                                        <ProCard
                                            img={e.img}
                                            name={e.name}
                                            per={e.per}
                                            per2={e.per2}
                                            sold={e.sold}
                                            secper={e.secper}
                                            off={e.off}
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
        </Layout>
    )
}

export default Cart
