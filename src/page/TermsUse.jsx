import React from 'react'
import { Col, NavLink, Row } from 'react-bootstrap'

const TermsUse = () => {
    return (
        <>
            <h1 className='d-none'></h1>
            <div className=' text-center mt-2'>
                <h2 className='terms-use-header'>Terms of Use</h2>
            </div>
            <div className='about pt-4 pt-lg-0 pb-5'>
                <div className='clubmall-work space-top'>
                    <div className='container-cos'>
                        <Row className='align-items-center'>
                            <Col lg={6} md={12}>
                                <img src='./img/about/clubmall-work.webp' alt='' width="100%" />
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
            </div>
        </>
    )
}

export default TermsUse
