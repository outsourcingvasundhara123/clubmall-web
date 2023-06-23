import React from 'react'
import { useRef, useState, useEffect, useContext } from 'react'
import Layout from '../layout/Layout'
import { MdOutlineKeyboardArrowRight, MdDelete } from "react-icons/md"
import { Button, NavLink } from 'react-bootstrap'
import { IoMdShareAlt } from 'react-icons/io'
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Is_Login } from '../helper/IsLogin';
import SucessSnackBar from "../components/SnackBar";
import ErrorSnackBar from "../components/SnackBar";

const Wishlist = () => {

    const isLoggedIn = Is_Login();
    const { wishProductUrl, wishlist, userProductList, loading, setLoading, category, currentUser,
        productList, trendingProductList, getProducts, getWishList, addWishList, sucessSnackBarOpen, warningSnackBarOpen, Mymessage, setWarningSnackBarOpen, setSucessSnackBarOpen } = useContext(CartContext);

    const navigate = useNavigate();


    useEffect(() => {
        getProducts();
        getWishList()
    }, [isLoggedIn]);

    console.log(wishlist, "wishlist");

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
                    {/* <div className='w-100 mt-3'>
                        <div className='search-filed d-flex align-items-center gap-2'>
                            <img src='./img/header/search-icone.png' alt='' className='mt-1' />
                            <input type='text' placeholder='Search Product' className='w-100' />
                        </div>
                    </div> */}


                    <div className='wishlist-items explore-main justify-content-start'>

                        {
                            wishlist && wishlist?.map((e) => {
                                return (
                                    <>
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
                                    </>
                                )
                            })}
                    </div>

                </div>
            </div>
        </>
    )
}

export default Wishlist
