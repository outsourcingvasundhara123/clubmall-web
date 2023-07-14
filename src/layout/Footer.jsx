import React from 'react'
import { Col, NavLink, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Footer = (props) => {
    return (
        <div className='footer'>
            <div className='container-cos'>
                <div className='footer-working'>
                    <div className='info footer-box'>
                        <h5>Company Info</h5>
                        <div className='mt-2 mt-sm-3'>
                            <Link to="/about" onClick={() => props.setActive(false)}>About</Link>
                            <Link to="/influencer" onClick={() => props.setActive(false)}>Affiliate & Influencer</Link>
                            {/* <NavLink>Campus Ambassador</NavLink>
                            <NavLink>Contact Us</NavLink>
                            <NavLink>Careers</NavLink>
                            <NavLink>Press</NavLink> */}
                        </div>
                    </div>
                    <div className='info footer-box'>
                        <h5>Customer Services</h5>
                        <div className='mt-2 mt-sm-3'>
                            <Link to="/terms-use" onClick={() => props.setActive(false)}>Terms of use</Link>
                            {/* <NavLink>Return and refund policy</NavLink>
                            <NavLink>Intellectual property policy</NavLink>
                            <NavLink>Shipping info</NavLink>
                            <NavLink>Student discount</NavLink> */}
                        </div>
                    </div>
                    <div className='info footer-box'>
                        <h5>Help</h5>
                        <div className='mt-2 mt-sm-3'>
                            {/* <NavLink>Support center & FAQ</NavLink>
                            <NavLink>Clubmall Purchase Protection</NavLink> */}
                            <Link to="/privacy-policy" onClick={() => props.setActive(false)}>Privacy Policy</Link>
                            {/* <NavLink>Sitemap</NavLink>
                            <NavLink>How to order</NavLink>
                            <NavLink>How to Track</NavLink>
                            <NavLink>Sell on Clubmall</NavLink> */}
                        </div>
                    </div>
                    <div className='info footer-box'>
                        <h5>Download the Clubmall App</h5>
                        <div className='mt-2 mt-sm-3'>
                            <NavLink href='https://play.google.com/store/apps/details?id=com.clubmall' target='_blank'>
                                <img src='./img/play.svg' alt='' />
                            </NavLink>
                            <NavLink href='https://apps.apple.com/us/app/clubmall/id6444752184' target='_blank'>
                                <img src='./img/store.svg' alt='' />
                            </NavLink>
                        </div>
                    </div>
                    <div className='info footer-box'>
                        <h5>Connect with Clubmall</h5>
                        <div className='mt-2 mt-sm-3 d-flex align-items-center gap-3'>
                            <NavLink href='https://www.instagram.com/clubmallofficial/' target='_blank'>
                                <img src='./img/insta.svg' alt='' />
                            </NavLink>
                            <NavLink href='https://www.facebook.com/people/Clubmall/100088814472280/' target='_blank'>
                                <img src='./img/face.svg' alt='' />
                            </NavLink>
                            <NavLink href='https://twitter.com/Clubmall2' target='_blank'>
                                <img src='./img/twitter.svg' alt='' />
                            </NavLink>
                            <NavLink href='https://www.tiktok.com/@clubmall_official?_t=8YIK4hDQ6IQ&_r=1' target='_blank'>
                                <img src='./img/tiktok.svg' alt='' />
                            </NavLink>
                            <NavLink href='https://www.youtube.com/@clubmall633/about' target='_blank'>
                                <img src='./img/youtub.svg' alt='' />
                            </NavLink>
                            <NavLink href='https://www.pinterest.com/clubmall/?invite_code=fbbd260f52c340579abd4030827a9bdb&sender=663718201242369602' target='_blank'>
                                <img src='./img/pintrest.svg' alt='' />
                            </NavLink>
                        </div>
                    </div>
                </div>
                <p className='last'>@2023 Clubmall.</p>
            </div>
        </div>
    )
}

export default Footer
