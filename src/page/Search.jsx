
import React, { useRef, useState, useEffect, useContext } from 'react'
import Layout from '../layout/Layout'
import { Button } from 'react-bootstrap'
import { MdKeyboardDoubleArrowRight } from "react-icons/md"
import ProCard from '../components/ProCard'
import { PRODUCTList } from "../helper/endpoints";
import api from "../helper/api";
import { getServerURL } from '../helper/envConfig';
import Loader from '../components/Loader';
import { handelCategorydata } from '../helper/constants'
import { CartContext } from '../context/CartContext';

const Search = () => {

    //   const [searchPage, setSearchPage] = useState(1);
    const { setIs_search, setViewmoreLoder, viewMoreLodr, searchUrl, searchKeyWord, searchpostList, setSearchPage, searchPage, getSearchedProduct, startAnimation, stopAnimation, player, loading, setLoading, wishProductUrl, category, currentUser,
        productList, trendingProductList, getProducts, getWishList, wishlist, addWishList, sucessSnackBarOpen, warningSnackBarOpen, Mymessage, setWarningSnackBarOpen, setSucessSnackBarOpen } = useContext(CartContext);

    useEffect(() => {
        getSearchedProduct();
    }, [searchPage, searchKeyWord]);


    return (
        <>
            {
                loading && !viewMoreLodr ? <Loader startAnimation={startAnimation} stopAnimation={stopAnimation} player={player} /> : (
                    <>
                        <section className='explore mar-bot-20'>
                            <div className='container-cos'>
                                {/* <div className='btns mt-5'>
                                    <Button className={active === "1" ? "active" : undefined} id={"1"} onClick={handleClick}>All</Button>
                                    <Button className={active === "2" ? "active" : undefined} id={"2"} onClick={handleClick}>Today</Button>
                                    <Button className={active === "3" ? "active" : undefined} id={"3"} onClick={handleClick}>Yesterday</Button>
                                    <Button className={active === "4" ? "active" : undefined} id={"4"} onClick={handleClick}>1 month ago</Button>
                                    <Button className={active === "5" ? "active" : undefined} id={"5"} onClick={handleClick}>10 Month ago</Button>
                                    <Button className={active === "6" ? "active" : undefined} id={"6"} onClick={handleClick}>1 year ago</Button>
                                </div> */}

                                {searchpostList.length <= 0 &&
                                    <div className='d-flex align-items-center justify-content-center h-100'>
                                        <div className='text-center found'>
                                            <img src='./img/not-found.png' alt='' />
                                            <p className='mt-3'>The cart is empty</p>
                                            <Button className='mt-3 submit-btn'>Shop Now</Button>
                                        </div>
                                    </div>
                                }

                                <div className='mb-0 mt-4 explore-main mar-top-0'>

                                    {
                                        searchpostList && searchpostList.map((e) => {
                                            return (

                                                <ProCard
                                                    id={e._id}
                                                    img={e.product_images[0]?.file_name}
                                                    name={e.name}
                                                    group_price={e.group_price}
                                                    individual_price={e.individual_price}
                                                    // sold={e.total_order && e.total_order }
                                                    // secper={e.secper && e.secper }
                                                    // off={e.discount_percentage && e.discount_percentage}
                                                    path={searchUrl && searchUrl}
                                                // color={e.sku_attributes.color}
                                                />
                                            )
                                        })
                                    }
                                    {searchpostList.length !== 0 &&
                                        <div className='w-100 d-flex justify-content-center'>
                                            <Button className='shop-btn btn-cos-mobile' onClick={() => (setSearchPage(searchPage + 1), setViewmoreLoder(true), setIs_search(0))} >{viewMoreLodr ? "Loding..." : "View More"} <MdKeyboardDoubleArrowRight /></Button>
                                        </div>
                                    }
                                </div>
                            </div>
                        </section>
                    </>
                )}
        </>
    )
}

export default Search
