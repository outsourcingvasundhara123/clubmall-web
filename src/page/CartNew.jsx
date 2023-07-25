import React, { useState } from 'react'
import { Button, Col, Form, Modal, NavLink, Row } from 'react-bootstrap'
import { MdOutlineClose, MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { Link } from 'react-router-dom'

const CartNew = () => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <div className='cart-main pb-5'>
                <div className='container-cos'>

                    <div className='page-path d-flex align-items-center gap-1'>
                        <div className='d-flex align-items-center gap-1'>
                            <NavLink>Cart</NavLink>
                            <MdOutlineKeyboardArrowRight />
                            <NavLink className='active'>Information</NavLink>
                            <MdOutlineKeyboardArrowRight />
                            <NavLink>Shipping</NavLink>
                            <MdOutlineKeyboardArrowRight />
                            <NavLink>Payment</NavLink>
                            <MdOutlineKeyboardArrowRight />
                        </div>
                    </div>
                    <Row className='mt-4'>
                        <Col lg={6} md={12}>
                            <div>
                                <div className='login-input text-start'>
                                    <label>Contact</label>
                                    <input placeholder='Email or mobile number'
                                        type='number'
                                    />
                                </div>
                                <div className='d-flex align-items-start check-terms gap-2 mt-1'>
                                    <Form.Check
                                        type="checkbox"
                                        id="check_terms"
                                        name="terms_and_condition"
                                    />
                                    <label htmlFor='check_terms' className='pointer'>Email me with news and offers</label>
                                </div>
                            </div>

                            <div className='location-main mt-4'>
                                <Button onClick={() => handleShow("add")}>+ Add a new address</Button>
                                <div className='address-box mt-1'>
                                    <h5> Rohan Vasundhara</h5>
                                    <p className='my-2'>Chula Vista, CA 91910-3800, United States</p>
                                    <div className='d-flex align-items-center justify-content-between'>
                                        <div className='d-flex align-items-center check-options'   >
                                            <input type='checkbox' id='add-select' />
                                            <label htmlFor='add-select'>Default</label>
                                        </div>
                                        <div className='copy-main'>
                                            <Button>Edit</Button>
                                            <span>I</span>
                                            <Button >Delete</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button className='submit-btn w-100'>Continue to shipping</Button>

                        </Col>
                        <Col lg={6} md={12}>

                        </Col>
                    </Row>


                </div>
            </div>

            <Modal show={show} onHide={handleClose} className='add-address' centered>
                <Modal.Body>
                    <div className='position-relative'>
                        <Button className='close-modal-btn forgot-pass-close' onClick={handleClose}>
                            <MdOutlineClose />
                        </Button>
                        <h5>Shipping address</h5>
                        <Form>
                            <Row className='mt-2'>
                                <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>Ship to Address</label>
                                        <select name='country_id'
                                            className='select-arrow'>
                                            <option value="" >Select Country</option>
                                        </select>
                                    </div>
                                </Col>
                                <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>Full Name</label>
                                        <input placeholder='Full Name'
                                            type='text'
                                            name='fullname'
                                        />

                                    </div>
                                </Col>
                                <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>Phone Number</label>
                                        <input placeholder='Phone Number'
                                            type='number'
                                        />
                                    </div>
                                </Col>
                                <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>City</label>
                                        <input placeholder='City'
                                            type='text'
                                        />
                                    </div>
                                </Col>
                                <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>State</label>
                                        <select
                                            name='state_id' className='select-arrow'>
                                            <option value="" >Select State</option>

                                        </select>
                                    </div>
                                </Col>
                                <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>Zip Code</label>
                                        <input placeholder='Zip Code'
                                            type='number'
                                        />
                                    </div>
                                </Col>
                                <Col lg={12} md={12} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>Address</label>
                                        <textarea className='w-100'
                                            placeholder='Enter Address'
                                            rows={5}></textarea>
                                    </div>
                                </Col>
                            </Row>
                            <button className='submit-btn w-100 mt-3' type='button' >Add Address</button>
                        </Form>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default CartNew
