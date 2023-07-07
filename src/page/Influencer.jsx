import React from 'react'
import Layout from '../layout/Layout'
import { Button, Col, Row } from 'react-bootstrap'

const Influencer = () => {
    return (
        <>
            <h1 className='d-none'></h1>
            <div className='influencer pb-5'>
                <div className='container-cos'>
                    <div className='contact-title text-center'>
                        <h1>Influencers</h1>
                        <p>Please complete this form for collaboration with</p>
                        <p> CLUBMALL</p>
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
                                        <label>Last Name</label>
                                        <input placeholder='Enter last name'
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
                                <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>Phone Number</label>
                                        <input placeholder='Enter phone number'
                                            type='number'
                                        />

                                    </div>
                                </Col>
                                <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>Country</label>
                                        <input placeholder='Enter country'
                                            type='text'
                                        />

                                    </div>
                                </Col>
                                <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>State</label>
                                        <input placeholder='Enter state'
                                            type='text'
                                        />

                                    </div>
                                </Col>
                                <Col lg={4} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>TikTok Followers:</label>
                                        <input placeholder='TikTok'
                                            type='number'
                                        />

                                    </div>
                                </Col>
                                <Col lg={4} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>YouTube Followers:</label>
                                        <input placeholder='YouTube'
                                            type='number'
                                        />

                                    </div>
                                </Col>
                                <Col lg={4} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>Instagram Followers:</label>
                                        <input placeholder='Instagram'
                                            type='number'
                                        />

                                    </div>
                                </Col>
                                <Col lg={4} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>TikTok Account Link:</label>
                                        <input placeholder='TikTok account'
                                            type='number'
                                        />

                                    </div>
                                </Col>
                                <Col lg={4} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>YouTube Account Link:</label>
                                        <input placeholder='YouTube account'
                                            type='number'
                                        />

                                    </div>
                                </Col>
                                <Col lg={4} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>Instagram Account Link:</label>
                                        <input placeholder='Instagram account'
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

export default Influencer
