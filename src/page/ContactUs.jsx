import React from 'react'
import { Col, Row, Button } from 'react-bootstrap'

const ContactUs = () => {
    return (
        <>
            <h1 className='d-none'></h1>
            <div className='influencer pb-5'>
                <div className='container-cos'>
                    <div className='contact-title text-center'>
                        <h1>Contact</h1>
                    </div>
                    <div className='contact mt-4'>
                        <form>
                            <Row>
                                <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>First Name</label>
                                        <input placeholder='Enter first name'
                                            type='text'
                                        />

                                    </div>
                                </Col>
                                <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>Email Contact</label>
                                        <input placeholder='Enter email contact'
                                            type='text'
                                        />

                                    </div>
                                </Col>
                                <Col lg={12} md={12} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>Phone Number</label>
                                        <input placeholder='Enter phone number'
                                            type='number'
                                        />

                                    </div>
                                </Col>

                                <Col lg={12} md={12} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>Interested In</label>
                                        <textarea placeholder='Tell us about yourself and the products you are interested in' rows={6}></textarea>
                                    </div>
                                </Col>
                            </Row>
                            <div className='d-flex justify-content-center w-100 mt-3'>
                                <Button className='submit-btn w-100 mt-0'>Send</Button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </>
    )
}

export default ContactUs
