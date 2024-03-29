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
import Loader from '../components/Loader'
import { handelProductDetail } from '../helper/constants'
const Wishlist = () => {

    const isLoggedIn = Is_Login();
    const { startAnimation, stopAnimation, player, deleteWishList, wishProductUrl, wishlist, loading,  getWishList, sucessSnackBarOpen, warningSnackBarOpen, Mymessage, setWarningSnackBarOpen, setSucessSnackBarOpen } = useContext(CartContext);

    useEffect(() => {
        getWishList()
    }, [isLoggedIn]);


    return (
        <>
            <h1 className='d-none'></h1>
            <SucessSnackBar
                open={sucessSnackBarOpen}
                setOpen={setSucessSnackBarOpen}
                text={Mymessage}
                type="success"
            />

            <ErrorSnackBar
                open={warningSnackBarOpen}
                setOpen={setWarningSnackBarOpen}
                text={Mymessage}
                type="error"
            />
            <div className='wishlist pb-5 h-100'>
                <div className='container-cos'>

                    <div className='page-path d-flex align-items-center gap-1'>
                        <div className='d-flex align-items-center gap-1'>
                            <NavLink>Home</NavLink>
                            <MdOutlineKeyboardArrowRight />
                        </div>
                        <NavLink className='active'>Wishlist</NavLink>
                    </div>

                    {/* <div className='title-wishlist mt-4 pb-3'>
                        <h4>My Wishlist</h4>
                    </div> */}

                    {/* <div className='w-100 mt-3'>
                        <div className='search-filed d-flex align-items-center gap-2'>
                            <img src='./img/header/search-icone.png' alt='' className='mt-1' />
                            <input type='text' placeholder='Search Product' className='w-100' />
                        </div>
                    </div> */}
                    {

                        loading ? <Loader startAnimation={startAnimation} stopAnimation={stopAnimation} player={player} /> : (
                            <>


                                <div className='wishlist-items explore-main justify-content-start'>
                                    {
                                        wishlist && wishlist
                                            .filter((e) => e.product_id !== null)
                                            .map((e, i) => {
                                                return (
                                                    <div className='product-card explore-card wishlist-card'>
                                                        <div className='position-relative'>
                                                            <img src={wishProductUrl + e.product_id._id + "/" + e.product_id.product_images[0]?.file_name} alt='' className='img-size' />
                                                            <div className='d-flex align-items-center gap-2 share-del-btn'>
                                                                <Button type='button' onClick={() => deleteWishList(e.product_id._id)} ><MdDelete /></Button>
                                                            </div>
                                                        </div>
                                                        <div className='py-3 px-3 mobile-spacing-card-body' >
                                                            <h5>{e.product_id?.name}</h5>
                                                            <Button onClick={() => handelProductDetail(e.product_id._id)} className='submit-btn mt-3 w-100 buy-now-items'>Buy item</Button>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                    }

                                    {
                                        wishlist && wishlist.every(e => e.product_id === null) &&
                                        <div className='d-flex align-items-center justify-content-center w-100 h-100 empty-wishlist'>
                                            <div className='text-center found'>
                                                <img src='./img/not-found.png' alt='' />
                                                <p className='mt-3 d-flex align-items-end gap-2 flex-wrap justify-content-center'> Your wish-list is empty,<img src='./img/gift.svg' width="30px" /> Create Your Perfect Wishlist Today! <img src='./img/shopping-bag.svg' width="30px" /> </p>
                                            </div>
                                        </div>
                                    }
                                </div>

                            </>

                        )
                    }




                </div>
            </div >
        </>
    )
}

export default Wishlist
