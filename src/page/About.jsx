import React from 'react'
import Layout from '../layout/Layout'
import { Col, NavLink, Row } from 'react-bootstrap'

const About = () => {
    return (
        <>
            <div className='about pt-4 pt-lg-0 pb-5'>
                <Row className='mx-0'>
                    <Col lg={6} md={12}>
                        <div className='banner-left-box'>
                            <h1>Buy together on CLUBMALL and get a <span className='red-color'>Big Discount</span></h1>
                            <div className='download-ui'>
                                <p>DOWNLOAD THE APP NOW</p>
                                <div className='d-flex align-items-center gap-2 mt-2 app-download'>
                                    <NavLink href='https://play.google.com/store/apps/details?id=com.clubmall' target='_blank'>
                                        <img src='./img/playstore.png' alt='' />
                                    </NavLink>
                                    <NavLink href="https://apps.apple.com/us/app/clubmall/id6444752184" target='_blank'>
                                        <img src='./img/app.png' alt='' />
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col lg={6} md={12} className='pe-0 mt-5 mt-lg-0'>
                        <img src='./img/about/about-banner.png' alt='' width="100%" />
                    </Col>
                </Row>

                <div className='clubmall-work'>
                    <div className='container-cos'>
                        <Row className='align-items-center'>
                            <Col lg={6} md={12}>
                                <img src='./img/about/clubmall-work.png' alt='' width="100%" />
                            </Col>
                            <Col lg={6} md={12} className=' mt-5 mt-lg-0'>
                                <div className='clubmall-work-text'>
                                    <h2>How <span className='red-color'>CLUBMALL</span> Works</h2>
                                    <p>CLUBMALL is a social shopping app where people can join groups to purchase products at discounted prices. People will still have the option to purchase products individually.</p>
                                    <div className='download-ui'>
                                        <p>DOWNLOAD THE APP NOW</p>
                                        <div className='d-flex align-items-center gap-2 mt-2 app-download'>
                                            <NavLink href='https://play.google.com/store/apps/details?id=com.clubmall' target='_blank'>
                                                <img src='./img/playstore.png' alt='' />
                                            </NavLink>
                                            <NavLink href="https://apps.apple.com/us/app/clubmall/id6444752184" target='_blank'>
                                                <img src='./img/app.png' alt='' />
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>

                <div className='clubmall-work'>
                    <div className='container-cos'>
                        <Row className='align-items-center'>
                            <Col lg={6} md={12} className=' mt-5 mt-lg-0 order-2 order-lg-1'>
                                <div className='clubmall-work-text'>
                                    <h2>The Main Feature of CLUBMALL is  <span className='red-color'>Group Buying</span></h2>
                                    <p>Group Buying is when people form groups to purchase products at discounted prices.</p>
                                    <div className='download-ui'>
                                        <p>DOWNLOAD THE APP NOW</p>
                                        <div className='d-flex align-items-center gap-2 mt-2 app-download'>
                                            <NavLink href='https://play.google.com/store/apps/details?id=com.clubmall' target='_blank'>
                                                <img src='./img/playstore.png' alt='' />
                                            </NavLink>
                                            <NavLink href="https://apps.apple.com/us/app/clubmall/id6444752184" target='_blank'>
                                                <img src='./img/app.png' alt='' />
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={6} md={12} className='order-1 order-lg-2'>
                                <img src='./img/about/group-buy.png' alt='' width="100%" />
                            </Col>
                        </Row>
                    </div>
                </div>

                <div className='pink-box'>
                    <div className='container-cos'>
                        <div className='round-bg'>
                            <div className="download-section ">
                                <div className="section-texts text-center">
                                    <span className="top-right-bg d-none d-md-block"></span>
                                    <p className='section-title'>
                                        Looking for clothing at reasonable prices? Download the app to experience all the benefits of CLUBMALL
                                    </p>
                                    <div className='download-ui position-relative' style={{ zIndex: "99" }}>
                                        <p>DOWNLOAD THE APP NOW</p>
                                        <div className='d-flex align-items-center justify-content-center gap-2 mt-2 app-download'>
                                            <NavLink href='https://play.google.com/store/apps/details?id=com.clubmall' target='_blank'>
                                                <img src='./img/playstore.png' alt='' />
                                            </NavLink>
                                            <NavLink href="https://apps.apple.com/us/app/clubmall/id6444752184" target='_blank'>
                                                <img src='./img/app.png' alt='' />
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default About
