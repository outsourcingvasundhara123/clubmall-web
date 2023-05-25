import React from 'react'
import Layout from '../layout/Layout'
import { Button, Dropdown } from 'react-bootstrap'

const ForYou = () => {
    return (
        <Layout>
            <div className='for-you position-relative'>

                <div className='reels-box position-relative'>
                    <img alt='' src='./img/for_you/reels.png' width="100%" />
                    <div className='user-name px-3'>
                        <div className='d-flex align-items-center gap-2'>
                            <img alt='' src='./img/header/user-pic.png' />
                            <div>
                                <p>Hello, Ali</p>
                                <span>
                                    <img alt='' src='./img/for_you/eye.png' className='me-1' />
                                    13K</span>
                            </div>
                        </div>
                        <Button className='follow-btn'>+ Follow (12K)</Button>
                    </div>
                    <div className='price'>
                        <Button>Individual Price <br />
                            $12.00</Button>
                        <Button>Group Price: <br />
                            $12.00</Button>
                    </div>
                    <div className='additional-icon'>
                        <div className='additional-box'>
                            <Button>
                                <img alt='' src='./img/for_you/doc.png' />
                            </Button>
                            <Button>
                                <img alt='' src='./img/for_you/like.png' />
                                <p>1</p>
                            </Button>
                            <Button>
                                <img alt='' src='./img/for_you/dlike.png' />
                                <p>1</p>
                            </Button>
                            <Button>
                                <img alt='' src='./img/for_you/msg.png' />
                                <p>5</p>
                            </Button>
                        </div>
                        <div className='additional-box mt-2'>
                            <Button>
                                <img alt='' src='./img/for_you/tip.png' />
                            </Button>
                            <Button>
                                <img alt='' src='./img/for_you/share.png' />
                            </Button>
                            <Button>
                                <img alt='' src='./img/for_you/add.png' />
                            </Button>
                            <Button>
                                <img alt='' src='./img/for_you/flag.png' />
                            </Button>
                        </div>
                    </div>
                    <div className='cart-btn-reels'>
                        <Dropdown>
                            <Dropdown.Toggle id="dropdown-basic">
                                <img alt='' src='./img/for_you/cart.png' width="22px" />
                                <img alt='' src='./img/for_you/up.png' width="10px" />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>

                <div className='reels-box position-relative'>
                    <img alt='' src='./img/for_you/reels.png' width="100%" />
                    <div className='user-name px-3'>
                        <div className='d-flex align-items-center gap-2'>
                            <img alt='' src='./img/header/user-pic.png' />
                            <div>
                                <p>Hello, Ali</p>
                                <span>
                                    <img alt='' src='./img/for_you/eye.png' className='me-1' />
                                    13K</span>
                            </div>
                        </div>
                        <Button className='follow-btn'>+ Follow (12K)</Button>
                    </div>
                    <div className='reel-items'>
                        <p>2+ More Products</p>
                        <div className='items-box p-2 mt-2'>
                            <img alt='' src='./img/for_you/item.png' width="100%" />
                            <del>$299,43</del>
                        </div>
                    </div>
                    <div className='additional-icon'>
                        <div className='additional-box'>
                            <Button>
                                <img alt='' src='./img/for_you/doc.png' />
                            </Button>
                            <Button>
                                <img alt='' src='./img/for_you/like.png' />
                                <p>1</p>
                            </Button>
                            <Button>
                                <img alt='' src='./img/for_you/dlike.png' />
                                <p>1</p>
                            </Button>
                            <Button>
                                <img alt='' src='./img/for_you/msg.png' />
                                <p>5</p>
                            </Button>
                        </div>
                        <div className='additional-box mt-2'>
                            <Button>
                                <img alt='' src='./img/for_you/tip.png' />
                            </Button>
                            <Button>
                                <img alt='' src='./img/for_you/share.png' />
                            </Button>
                            <Button>
                                <img alt='' src='./img/for_you/add.png' />
                            </Button>
                            <Button>
                                <img alt='' src='./img/for_you/flag.png' />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className='reels-box position-relative'>
                    <img alt='' src='./img/for_you/reels.png' width="100%" />
                    <div className='user-name px-3'>
                        <div className='d-flex align-items-center gap-2'>
                            <img alt='' src='./img/header/user-pic.png' />
                            <div>
                                <p>Hello, Ali</p>
                                <span>
                                    <img alt='' src='./img/for_you/eye.png' className='me-1' />
                                    13K</span>
                            </div>
                        </div>
                        <Button className='follow-btn'>+ Follow (12K)</Button>
                    </div>
                    <div className='additional-icon'>
                        <div className='additional-box'>
                            <Button>
                                <img alt='' src='./img/for_you/doc.png' />
                            </Button>
                            <Button>
                                <img alt='' src='./img/for_you/like.png' />
                                <p>1</p>
                            </Button>
                            <Button>
                                <img alt='' src='./img/for_you/dlike.png' />
                                <p>1</p>
                            </Button>
                            <Button>
                                <img alt='' src='./img/for_you/msg.png' />
                                <p>5</p>
                            </Button>
                        </div>
                        <div className='additional-box mt-2'>
                            <Button>
                                <img alt='' src='./img/for_you/tip.png' />
                            </Button>
                            <Button>
                                <img alt='' src='./img/for_you/share.png' />
                            </Button>
                            <Button>
                                <img alt='' src='./img/for_you/add.png' />
                            </Button>
                            <Button>
                                <img alt='' src='./img/for_you/flag.png' />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ForYou
