import React, { useRef, useState, useEffect, useContext } from 'react'
import { MdKeyboardDoubleArrowRight } from "react-icons/md"
import { Button, Col, Row, Tab, Tabs } from 'react-bootstrap'
import ProCard from '../components/ProCard'
import { useNavigate } from 'react-router-dom'
import api from "../helper/api";
import { getServerURL } from '../helper/envConfig';
import Loader from '../components/Loader';
import { handelCategorydata } from '../helper/constants'
import { Is_Login } from '../helper/IsLogin';
import SucessSnackBar from "../components/SnackBar";
import ErrorSnackBar from "../components/SnackBar";
import { CartContext } from '../context/CartContext';
import { PRODUCTCATEGORY } from '../helper/endpoints'

const Selling = () => {

    const { playercategoryweb, startAnimationcategoryweb, stopAnimationcategoryweb
        , catwebLoading, handelwishSell, sellIs_wished, sellProducUrl, favoritepage, kidspage, manpage, womanpage, favoriteProductList, kidsProductList, manProductList, womanProductList, getSellProducts, sellingCategory, getCategoryWeb, categoryWeb, trendingProductList, getProducts, sucessSnackBarOpen, warningSnackBarOpen, Mymessage, setWarningSnackBarOpen, setSucessSnackBarOpen } = useContext(CartContext);

    const isLoggedIn = Is_Login();
    const navigate = useNavigate();
    const [sellCategory, setSellCategory] = useState([]);
    const serverURL = getServerURL();
    const [categoryLoading, setCategoryLoading] = useState(true);


    const playercat = useRef();

    const startAnimationcat = () => {
        if (playercat.current) {
            playercat.current.play(); // Check if player.current is not null before accessing play()
        }
    };

    const stopAnimationcat = () => {
        setCategoryLoading(false);

    };


    const getCategory = async () => {
        startAnimationcat()
        setCategoryLoading(true);
        try {
            const [categoryResponse] = await Promise.all([
                api.post(`${serverURL + PRODUCTCATEGORY}`, { action: "category" })
            ]);
            const categoryData = categoryResponse.data.data;
            // Divide the category list into two parts
            const halfwayIndex = Math.ceil(categoryData.productsCategoryList && categoryData?.productsCategoryList.length / 2);
            const firstHalf = categoryData.productsCategoryList?.slice(0, halfwayIndex);
            const secondHalf = categoryData.productsCategoryList?.slice(halfwayIndex);
            // Set the first half and second half of categories
            setSellCategory({ firstHalf, secondHalf, productsCategoryIconPath: categoryData?.productImagePath });

            setCategoryLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getSellProducts();
        getProducts()
    }, [womanpage, manpage, kidspage, favoritepage, sellingCategory, sellIs_wished, isLoggedIn]);

    useEffect(() => {
        // getWishList()
        getCategoryWeb()
        getCategory()
    }, []);

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

            {/* {
                loading ? <Loader startAnimation={startAnimation} stopAnimation={stopAnimation} player={player} /> : (
                    <> */}
            <section className='hero position-relative selling-banner pointer' onClick={() => (handelCategorydata("6447cbbb4140dd3938c74b34"), localStorage.removeItem("selectedSubcategories"))}>
                <img src='./img/banner2.webp' />
            </section>

            {catwebLoading ?
                <Loader startAnimation={startAnimationcategoryweb} stopAnimation={stopAnimationcategoryweb} player={playercategoryweb} /> : (
                    <section className='shop-categories'>
                        <div className='container-cos'>
                            <div className='title w-100 text-center'>
                                <h2><span>S</span>HOP BY CATEGORY </h2>
                            </div>
                            <div className='cate-main d-flex align-items-center justify-content-center gap-5 flex-wrap mt-4 mar-top-0'>
                                {
                                    sellCategory && sellCategory.firstHalf?.slice(0, 6).map((e) => {
                                        return (
                                            <div className='cate-box text-center pointer' onClick={() => (handelCategorydata(e._id), localStorage.removeItem("selectedSubcategories"))} >
                                                <div className='cat-img-round'>
                                                    <img src={categoryWeb.productsCategoryIconPath + e.product_icon} alt='' width="100%" />
                                                </div>
                                                <h5 className='mt-4'>{e.name}</h5>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </section>
                )
            }

            <section className='basket'>
                <div className='container-cos'>
                    <div className='title w-100 text-center'>
                        <h2><span>B</span>ASKET STUFFERS FOR EVERYONE FROM $0.39</h2>
                    </div>
                    <Row className='mt-4'>
                        {catwebLoading ?
                            <Loader startAnimation={startAnimationcat} stopAnimation={stopAnimationcat} player={playercat} /> : (

                                sellCategory && sellCategory.secondHalf?.slice(0, 4).map((e) => {
                                    return (

                                        <Col lg={3} md={6} sm={12} className='mt-4 pointer' onClick={() => (handelCategorydata(e._id), localStorage.removeItem("selectedSubcategories"))}>
                                            <div className='basket-box'>
                                                <h5>{e.name}</h5>
                                                <img src={categoryWeb.productsCategoryIconPath + e.product_icon} alt='' width="80%" className='my-4' />
                                                <div className='d-flex justify-content-center'>
                                                    <Button className='shop-btn'  >Shop Now <MdKeyboardDoubleArrowRight /></Button>
                                                </div>
                                            </div>
                                        </Col>
                                    )
                                })

                            )
                        }

                    </Row>
                </div>
            </section>

            <section className='tabs-cos'>
                <div className='container-cos'>
                    <div className='title w-100 text-center'>
                        <h2><span>C</span>ELEBRATE IN FRESH STYLES </h2>
                    </div>


                    {/* {
                                    sellProLoading ? <Loader startAnimation={startAnimationsellpro} stopAnimation={stopAnimationsellpro} player={playersellproduct} /> : (
                                        <> */}

                    <div className='tabs-content mt-5 '>
                        <Tabs
                            defaultActiveKey={sellingCategory?.first?.name}
                            id="fill-tab-example"
                            className="mb-3"
                            fill

                        >
                            <Tab eventKey={sellingCategory?.first?.name} title={sellingCategory.first?.name}>
                                <div className='mb-0 mt-4 explore-main'>
                                    {
                                        womanProductList && womanProductList.map((e) => {
                                            return (
                                                <ProCard
                                                    id={e._id}
                                                    img={e.product_images[0]?.file_name}
                                                    name={e.name}
                                                    group_price={e.group_price}
                                                    individual_price={e.individual_price}
                                                    sold={e.total_order}
                                                    secper={e.secper}
                                                    off={e.discount_percentage}
                                                    path={sellProducUrl && sellProducUrl}
                                                    is_wishList={e.wishList && e.wishList}

                                                />
                                            )
                                        })
                                    }
                                </div>
                                {/* <div className='w-100 d-flex justify-content-center'>
                                                <Button className='shop-btn' onClick={() => (setWomanPage(womanpage + 1), setViewmoreLoder(true), handelwishSell())} >  {viewMoreLodr ? "Loding..." : "View More"}   <MdKeyboardDoubleArrowRight /></Button>
                                            </div> */}
                            </Tab>
                            <Tab eventKey={sellingCategory?.second?.name} title={sellingCategory?.second?.name}>
                                <div className='mb-0 mt-4 explore-main'>

                                    {
                                        manProductList && manProductList.map((e) => {
                                            return (
                                                <ProCard
                                                    id={e._id}
                                                    img={e.product_images[0]?.file_name}
                                                    name={e.name}
                                                    group_price={e.group_price}
                                                    individual_price={e.individual_price}
                                                    sold={e.total_order}
                                                    secper={e.secper}
                                                    off={e.discount_percentage}
                                                    path={sellProducUrl && sellProducUrl}
                                                    is_wishList={e.wishList && e.wishList}
                                                />
                                            )
                                        })
                                    }

                                </div>
                                {/* <div className='w-100 d-flex justify-content-center'>
                                                <Button className='shop-btn' onClick={() => (setManPage(manpage + 1), setViewmoreLoder(true), handelwishSell())}>{viewMoreLodr ? "Loding..." : "View More"}<MdKeyboardDoubleArrowRight /></Button>
                                            </div> */}
                            </Tab>
                            <Tab eventKey={sellingCategory?.third?.name} title={sellingCategory?.third?.name}>
                                <div className='mb-0 mt-4 explore-main'>
                                    {
                                        kidsProductList && kidsProductList.map((e) => {

                                            return (
                                                <ProCard
                                                    id={e._id}
                                                    img={e.product_images[0]?.file_name}
                                                    name={e.name}
                                                    group_price={e.group_price}
                                                    individual_price={e.individual_price}
                                                    sold={e.total_order}
                                                    secper={e.secper}
                                                    off={e.discount_percentage}
                                                    path={sellProducUrl && sellProducUrl}
                                                    is_wishList={e.wishList && e.wishList} />
                                            )
                                        })
                                    }
                                </div>
                                {/* <div className='w-100 d-flex justify-content-center'>
                                                <Button className='shop-btn' onClick={() => (setKidPage(kidspage + 1), setViewmoreLoder(true), handelwishSell())} >{viewMoreLodr ? "Loding..." : "View More"}<MdKeyboardDoubleArrowRight /></Button>
                                            </div> */}
                            </Tab>
                        </Tabs>

                    </div>
                    {/* </>
                                    )
                                } */}
                </div>
            </section>

            {/* <section className='get-set'>
                            <div className='container-cos'>
                                <div className='title w-100 text-center'>
                                    <h2><span>G</span>ET SET TO HOST PRODUCT</h2>
                                </div>
                                <Row className='mt-5'>
                                    <Col lg={6} md={12} sm={12}>
                                        <div className='get-box'>
                                            <img src='./img/selling/img7.png' alt='' />
                                            <div className='per-box-get'>
                                                <h5>Set the table from <b>$0.49</b></h5>
                                                <Button className='shop-btn mt-0' onClick={() => navigate("/categories")}>Shop Now <MdKeyboardDoubleArrowRight /></Button>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={12} sm={12} className='mt-3 mt-lg-0'>
                                        <div className='get-box'>
                                            <img src='./img/selling/img8.png' alt='' />
                                            <div className='per-box-get'>
                                                <h5>Dinner prep from <b>$0.19</b></h5>
                                                <Button className='shop-btn mt-0' onClick={() => navigate("/categories")}>Shop Now <MdKeyboardDoubleArrowRight /></Button>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </section> */}

            <section className='get-set hot'>
                <div className='container-cos'>
                    <div className='title w-100 text-center'>
                        <h2><span>H</span>OT DEALS</h2>
                    </div>
                    <Row className='mt-5 mar-top-20 pointer'>
                        <Col lg={12} md={12} sm={12} onClick={() => (handelCategorydata("644804f095c53d0f01ab0782"), localStorage.removeItem("selectedSubcategories"))}>
                            <img src='./img/selling/img9.webp' alt='' width="100%" />
                        </Col>
                        <Col lg={6} md={12} sm={12} className='mt-4 mar-top-10 pointer' onClick={() => (handelCategorydata("6442c8b437764b869857ac13"), localStorage.removeItem("selectedSubcategories"))}>
                            <div className='get-box hot-sub-box position-relative'>
                                <img src='./img/selling/img10.webp' alt='' />
                            </div>
                        </Col>
                        <Col lg={6} md={12} sm={12} className='mt-4 mar-top-10 pointer' onClick={() => (handelCategorydata("6447ca944140dd3938c74adb"), localStorage.removeItem("selectedSubcategories"))}>
                            <div className='get-box hot-sub-box position-relative'>
                                <img src='./img/selling/img11.webp' alt='' />
                            </div>
                        </Col>
                    </Row>
                </div>
            </section>

            <section className='explore mar-top-40 mar-bot-0'>
                <div className='container-cos'>
                    <div className='title w-100 text-center'>
                        <h2><span>F</span>AVORITES FOR YOU</h2>
                    </div>
                    {/* 
                                {


                                    sellProLoading ?
                                        <Loader startAnimation={startAnimationsellpro} stopAnimation={stopAnimationsellpro} player={playersellproduct} /> : ( */}
                    <div className='mb-0 mt-4 explore-main mar-top-0'>
                        {


                            favoriteProductList && favoriteProductList.map((e) => {
                                return (
                                    <ProCard
                                        id={e._id}
                                        img={e.product_images[0]?.file_name}
                                        name={e.name}
                                        group_price={e.group_price}
                                        individual_price={e.individual_price}
                                        sold={e.total_order}
                                        secper={e.secper}
                                        off={e.discount_percentage}
                                        path={sellProducUrl && sellProducUrl}
                                        is_wishList={e.wishList && e.wishList}
                                    />
                                )
                            })
                        }

                        {/* <div className='w-100 d-flex justify-content-center'>
                                        <Button className='shop-btn btn-cos-mobile' onClick={() => (setFavoritePage(favoritepage + 1), setViewmoreLoder(true), handelwishSell())} > {viewMoreLodr ? "Loding..." : "View More"} <MdKeyboardDoubleArrowRight /></Button>
                                    </div> */}
                    </div>
                    {/* //         )
                                // } */}
                </div>
            </section>

            <section className='explore mar-top-40 mar-bot-20'>
                <div className='container-cos'>
                    <div className='title w-100 text-center'>
                        <h2><span>E</span>XPLORE YOUR INTERESTS</h2>
                    </div>

                    {/* {


                                    // sellProLoading ?
                                    //     <Loader startAnimation={startAnimationsellpro} stopAnimation={stopAnimationsellpro} player={playersellproduct} /> : ( */}

                    <div className='mb-0 mt-4 explore-main mar-top-0'>
                        {
                            trendingProductList.productListArrObj?.map((e) => {
                                return (
                                    <ProCard
                                        id={e._id}
                                        img={e.product_images[0]?.file_name}
                                        name={e.name}
                                        group_price={e.group_price}
                                        individual_price={e.individual_price}
                                        sold={e.total_order}
                                        secper={e.secper}
                                        off={e.discount_percentage}
                                        path={sellProducUrl && sellProducUrl}
                                        is_wishList={e.wishList && e.wishList}
                                    />
                                )
                            })
                        }
                        <div className='w-100 d-flex justify-content-center'>
                            <Button className='shop-btn btn-cos-mobile' onClick={() => (navigate("/trending"), handelwishSell())} >View More<MdKeyboardDoubleArrowRight /></Button>
                        </div>
                    </div>
                    {/* //         )
                                // } */}
                </div>
            </section>
            {/* </>
                )
            } */}
        </ >
    )
}

export default Selling
