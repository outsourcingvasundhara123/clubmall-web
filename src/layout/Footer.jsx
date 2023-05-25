import React from 'react'
import { Col, NavLink, Row } from 'react-bootstrap'

const Footer = () => {
    return (
        <div className='footer'>
            <div className='container-cos'>
                <div className='footer-working'>
                    <div className='info footer-box'>
                        <h5>Company Info</h5>
                        <div className='mt-3'>
                            <NavLink>About</NavLink>
                            <NavLink>Affiliate & Influencer</NavLink>
                            <NavLink>Campus Ambassador</NavLink>
                            <NavLink>Contact Us</NavLink>
                            <NavLink>Careers</NavLink>
                            <NavLink>Press</NavLink>
                        </div>
                    </div>
                    <div className='info footer-box'>
                        <h5>Customer Services</h5>
                        <div className='mt-3'>
                            <NavLink>Terms of use</NavLink>
                            <NavLink>Return and refund policy</NavLink>
                            <NavLink>Intellectual property policy</NavLink>
                            <NavLink>Shipping info</NavLink>
                            <NavLink>Student discount</NavLink>
                        </div>
                    </div>
                    <div className='info footer-box'>
                        <h5>Help</h5>
                        <div className='mt-3'>
                            <NavLink>Support center & FAQ</NavLink>
                            <NavLink>Clubmall Purchase Protection</NavLink>
                            <NavLink>Privacy Policy and setting</NavLink>
                            <NavLink>Sitemap</NavLink>
                            <NavLink>How to order</NavLink>
                            <NavLink>How to Track</NavLink>
                            <NavLink>Sell on Clubmall</NavLink>
                        </div>
                    </div>
                    <div className='info footer-box'>
                        <h5>Download the Clubmall App</h5>
                        <div className='mt-3'>
                            <NavLink>
                                <img src='./img/play.png' alt='' />
                            </NavLink>
                            <NavLink>
                                <img src='./img/store.png' alt='' />
                            </NavLink>
                        </div>
                    </div>
                    <div className='info footer-box'>
                        <h5>Connect with Clubmall</h5>
                        <div className='mt-3 d-flex align-items-center gap-3'>
                            <NavLink>
                                <img src='./img/insta.png' alt='' />
                            </NavLink>
                            <NavLink>
                                <img src='./img/face.png' alt='' />
                            </NavLink>
                            <NavLink>
                                <img src='./img/twitter.png' alt='' />
                            </NavLink>
                            <NavLink>
                                <img src='./img/tiktok.png' alt='' />
                            </NavLink>
                            <NavLink>
                                <img src='./img/youtub.png' alt='' />
                            </NavLink>
                            <NavLink>
                                <img src='./img/pintrest.png' alt='' />
                            </NavLink>
                        </div>
                    </div>
                </div>
                <Row className="cards-all mt-5">
                    <Col xl={6} lg={12} md={12}>
                        <div className=''>
                            <h5>Secure Sertification</h5>
                            <div className='mt-3'>
                                <img src='./img/cards1.png' alt='' />
                            </div>
                        </div>
                    </Col>
                    <Col xl={6} lg={12} md={12} className='mt-4 mt-xl-0'>
                        <div className=''>
                            <h5>We accept</h5>
                            <div className='mt-3'>
                                <img src='./img/cards2.png' alt='' />
                            </div>
                        </div>
                    </Col>
                </Row>
                <p className='last'>@2023 WhaleCo Inc.</p>
            </div>
        </div>
    )
}

export default Footer
