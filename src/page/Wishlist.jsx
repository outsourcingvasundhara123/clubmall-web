import React from 'react'
import Layout from '../layout/Layout'
import { MdOutlineKeyboardArrowRight, MdDelete } from "react-icons/md"
import { Button, NavLink } from 'react-bootstrap'
import { IoMdShareAlt } from 'react-icons/io'

const Wishlist = () => {
    return (
        <>
            <div className='wishlist pb-5'>
                <div className='container-cos'>

                    <div className='page-path d-flex align-items-center gap-1'>
                        <div className='d-flex align-items-center gap-1'>
                            <NavLink>Home</NavLink>
                            <MdOutlineKeyboardArrowRight />
                        </div>
                        <NavLink className='active'>Wishlist</NavLink>
                    </div>

                    <div className='title-wishlist mt-4 pb-3'>
                        <h4>My Wishlist</h4>
                    </div>
                    <div className='w-100 mt-3'>
                        <div className='search-filed d-flex align-items-center gap-2'>
                            <img src='./img/header/search-icone.png' alt='' className='mt-1' />
                            <input type='text' placeholder='Search Product' className='w-100' />
                        </div>
                    </div>

                    <div className='wishlist-items explore-main justify-content-start'>
                        <div className='product-card explore-card'>
                            <div className='position-relative'>
                                <img src='./img/dummy.png' alt='' />
                                <div className='d-flex align-items-center gap-2 share-del-btn'>
                                    <Button><MdDelete /></Button>
                                </div>
                            </div>
                            <div className='py-3 px-3' >
                                <h5>FS - Nike Air Max 270 React...</h5>
                                <div className='wishlist-sell mt-1'>
                                    <span>Free shipping</span>
                                    <span>shold by clubmall</span>
                                </div>
                                <Button className='submit-btn mt-3 w-100'>Buy item</Button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Wishlist
