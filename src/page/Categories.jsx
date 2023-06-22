import React, { useRef, useState, useEffect, useContext } from 'react'
import Layout from '../layout/Layout'
import SliderTwo from '../components/SliderTwo'
import { Accordion, Button, Col, Row } from 'react-bootstrap'
import { MdKeyboardDoubleArrowRight } from "react-icons/md"
import { data } from "../page/Data"
import ProCard from '../components/ProCard'
import { colors, categoriesSliderData } from '../helper/constants'
import { RangeSlider } from 'rsuite';
import { PRODUCTList, PRODUCTSEARCH, PRODUCTCATEGORY } from "../helper/endpoints";
import { useNavigate } from 'react-router-dom'
import api from "../helper/api";
import { getServerURL } from '../helper/envConfig';
import Loader from '../components/Loader';
import { FiFilter } from 'react-icons/fi'
import { CartContext } from '../context/CartContext';

const Categories = () => {

    const { categoryWeb, getCategoryWeb, wishProductUrl, currentUser,
        productList, trendingProductList, getProducts, getWishList, wishlist, addWishList, sucessSnackBarOpen, warningSnackBarOpen, Mymessage, setWarningSnackBarOpen, setSucessSnackBarOpen } = useContext(CartContext);

    const [subCat, setSubCat] = useState(null)
    const [catName, setCatName] = useState()
    const [subCatList, setSubCatList] = useState([])
    const [filterShow, setFilterShow] = useState(window.innerWidth < 991 ? false : true)
    const [productColorActive, setProductColorActive] = useState()
    const [postList, setPostList] = useState([]);
    const serverURL = getServerURL();
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const player = useRef();
    const Categorie_id = localStorage.getItem("selectedcategories") ? localStorage.getItem("selectedcategories") : "Women Apparel"
    const startAnimation = () => {
        if (player.current) {
            player.current.play(); // Check if player.current is not null before accessing play()
        }
    };
    const stopAnimation = () => {
        setLoading(false);
    };

    const getCategory = async () => {

        try {
            startAnimation()
            setLoading(true)
            let categoryDtata = await api.post(`${serverURL + PRODUCTCATEGORY}`)
            let subcat = categoryDtata?.data?.data?.productsCategoryList.filter((e) => e._id === Categorie_id);
            var subCart_id = subcat[0]?.child.find(e => e.name == subCat)
            setSubCatList(subcat[0]?.child)

            if (subCat === null) {
                setSubCat(subcat[0]?.child[0].name)
            }

            setCatName(subcat[0]?.name)
            const [postListResponse] = await Promise.all([
                api.post(`${serverURL + PRODUCTList}`, {
                    "product_list_type": "by-categories",
                    product_category_one_id: Categorie_id,
                    product_category_two_id: subCart_id._id
                }),
            ]);
            const postsData = postListResponse.data.data;
            setPostList(postsData);
            stopAnimation()
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCategory();
        getProducts()
    }, [Categorie_id, subCat]);


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 991) {
                setFilterShow(false);
            } else {
                setFilterShow(true);
            }
        };

        // Attach event listener on component mount
        window.addEventListener('resize', handleResize);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, []);

    return (
        <>
            {
                loading ? <Loader startAnimation={startAnimation} stopAnimation={stopAnimation} player={player} /> : (
                    <>

                        <div className='categories'>
                            <div className='container-cos'>
                                {/* <div className='categories-slider'>
                                    <SliderTwo data={categoriesSliderData} />
                                </div> */}

                                <div className='sub-categories-list'>
                                    <h3>{catName}</h3>
                                    <div className='d-flex align-items-center gap-2 mt-3 flex-wrap'>


                                        {
                                            subCatList.map((e, i) => {
                                                return (
                                                    <Button key={i} className={`${subCat === e.name ? "active" : ""}`} onClick={() => setSubCat(e.name)}>{e.name} </Button>
                                                )
                                            })
                                        }
                                    </div>
                                </div>

                                <div className='filter-product pt-4'>
                                    <Row>
                                        <Col xxl={3} xl={4} lg={5} sm={12}>
                                            <div className='d-flex align-items-center justify-content-between'>
                                                <div className='fill-title'>
                                                    <h5>Filters</h5>
                                                </div>
                                                <Button className='submit-btn mt-0 filter-show' onClick={() => setFilterShow(!filterShow)} style={{ fontSize: "18px" }}><FiFilter /></Button>
                                            </div>
                                            {
                                                filterShow ?
                                                    <div className='filter-option p-4 mt-4'>
                                                        <div className='filter-box'>
                                                            <Accordion alwaysOpen>

                                                                <div className='filter-box mt-20 product-color'>
                                                                    <h5>Color</h5>
                                                                    <div className='d-flex align-items-center flex-wrap mt-4 gap-2'>
                                                                        {
                                                                            colors.map((e, i) => {
                                                                                return (
                                                                                    <Button className={`${productColorActive === e.id ? "active" : ""} color-btn`} onClick={() => setProductColorActive(e.id)}>
                                                                                        <img src={e.img} alt='' />
                                                                                    </Button>
                                                                                )
                                                                            })
                                                                        }
                                                                    </div>
                                                                </div>

                                                                <Accordion.Item eventKey="3" className='mt-20'>
                                                                    <Accordion.Header>
                                                                        <h5>Size</h5>
                                                                    </Accordion.Header>
                                                                    <Accordion.Body className='px-0'>
                                                                        <div className='d-flex align-items-center check-options '>
                                                                            <input type='checkbox' id='check20' />
                                                                            <label htmlFor='check20'>XS</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check21' />
                                                                            <label htmlFor='check21'>S</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check22' />
                                                                            <label htmlFor='check22'>L</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check23' />
                                                                            <label htmlFor='check23'>M</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check24' />
                                                                            <label htmlFor='check24'>XL</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check25' />
                                                                            <label htmlFor='check25'>XXL</label>
                                                                        </div>
                                                                        <Button className='add-btn'>
                                                                            <img src='./img/selling/add.png' alt='' />
                                                                            View More</Button>
                                                                    </Accordion.Body>
                                                                </Accordion.Item>
                                                                {/* 
                                                                <Accordion.Item eventKey="0">
                                                                    <Accordion.Header>
                                                                        <h5>Category</h5>
                                                                    </Accordion.Header>
                                                                    <Accordion.Body className='px-0'>
                                                                        <div className='d-flex align-items-center check-options'>
                                                                            <input type='checkbox' id='check1' />
                                                                            <label htmlFor='check1'>Women’s Jewellary</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check2' />
                                                                            <label htmlFor='check2'>Car Audio & Video</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check3' />
                                                                            <label htmlFor='check3'>Home Decor Products</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check4' />
                                                                            <label htmlFor='check4'>Interior Accessories</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check5' />
                                                                            <label htmlFor='check5'>Girl’s Sets</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check6' />
                                                                            <label htmlFor='check6'>Hair Care</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check7' />
                                                                            <label htmlFor='check7'>Women’s Sleepwear</label>
                                                                        </div>
                                                                        <Button className='add-btn'>
                                                                            <img src='./img/selling/add.png' alt='' />
                                                                            View More</Button>
                                                                    </Accordion.Body>
                                                                </Accordion.Item> */}

                                                                <Accordion.Item eventKey="1" className='mt-20'>
                                                                    <Accordion.Header>
                                                                        <h5>Style</h5>
                                                                    </Accordion.Header>
                                                                    <Accordion.Body className='px-0'>
                                                                        <div className='d-flex align-items-center check-options'>
                                                                            <input type='checkbox' id='check8' />
                                                                            <label htmlFor='check8'>Boho</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check9' />
                                                                            <label htmlFor='check9'>Casual</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check10' />
                                                                            <label htmlFor='check10'>Cute</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check11' />
                                                                            <label htmlFor='check11'>Elegant</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check12' />
                                                                            <label htmlFor='check12'>Party</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check13' />
                                                                            <label htmlFor='check13'>Sexy</label>
                                                                        </div>
                                                                        <Button className='add-btn'>
                                                                            <img src='./img/selling/add.png' alt='' />
                                                                            View More</Button>
                                                                    </Accordion.Body>
                                                                </Accordion.Item>




                                                                <Accordion.Item eventKey="4" className='mt-20'>
                                                                    <Accordion.Header>
                                                                        <h5>Type</h5>
                                                                    </Accordion.Header>
                                                                    <Accordion.Body className='px-0'>
                                                                        <div className='d-flex align-items-center check-options '>
                                                                            <input type='checkbox' id='check26' />
                                                                            <label htmlFor='check26'>A Line</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check27' />
                                                                            <label htmlFor='check27'>Asymmetrical</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check28' />
                                                                            <label htmlFor='check28'>Biker Shorts</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check29' />
                                                                            <label htmlFor='check29'>Bodycon</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check30' />
                                                                            <label htmlFor='check30'>Cami</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check31' />
                                                                            <label htmlFor='check31'>Fitted</label>
                                                                        </div>
                                                                        <Button className='add-btn'>
                                                                            <img src='./img/selling/add.png' alt='' />
                                                                            View More</Button>
                                                                    </Accordion.Body>
                                                                </Accordion.Item>

                                                                <Accordion.Item eventKey="2" className='mt-20'>
                                                                    <Accordion.Header>
                                                                        <h5>Pattern Type</h5>
                                                                    </Accordion.Header>
                                                                    <Accordion.Body className='px-0'>
                                                                        <div className='d-flex align-items-center check-options'>
                                                                            <input type='checkbox' id='check14' />
                                                                            <label htmlFor='check14'>All Over Print</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check15' />
                                                                            <label htmlFor='check15'>Animal</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check16' />
                                                                            <label htmlFor='check16'>Baroque</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check17' />
                                                                            <label htmlFor='check17'>Butterfly</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check18' />
                                                                            <label htmlFor='check18'>Camo</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check19' />
                                                                            <label htmlFor='check19'>Car</label>
                                                                        </div>
                                                                        <Button className='add-btn'>
                                                                            <img src='./img/selling/add.png' alt='' />
                                                                            View More</Button>
                                                                    </Accordion.Body>
                                                                </Accordion.Item>

                                                                {/* <Accordion.Item eventKey="5" className='mt-20'>
                                                                    <Accordion.Header>
                                                                        <h5>Length</h5>
                                                                    </Accordion.Header>
                                                                    <Accordion.Body className='px-0'>
                                                                        <div className='d-flex align-items-center check-options '>
                                                                            <input type='checkbox' id='check32' />
                                                                            <label htmlFor='check32'>Bermuda shorts</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check33' />
                                                                            <label htmlFor='check33'>Capris</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check34' />
                                                                            <label htmlFor='check34'>Crop</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check35' />
                                                                            <label htmlFor='check35'>Cropped</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check36' />
                                                                            <label htmlFor='check36'>Extra Long</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check37' />
                                                                            <label htmlFor='check37'>Knee Length</label>
                                                                        </div>
                                                                        <Button className='add-btn'>
                                                                            <img src='./img/selling/add.png' alt='' />
                                                                            View More</Button>
                                                                    </Accordion.Body>
                                                                </Accordion.Item>

                                                                <Accordion.Item eventKey="6" className='mt-20'>
                                                                    <Accordion.Header>
                                                                        <h5>Sleev Length</h5>
                                                                    </Accordion.Header>
                                                                    <Accordion.Body className='px-0'>
                                                                        <div className='d-flex align-items-center check-options'>
                                                                            <input type='checkbox' id='check38' />
                                                                            <label htmlFor='check38'>Cap Sleeve</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check39' />
                                                                            <label htmlFor='check39'>Half Sleeve</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check40' />
                                                                            <label htmlFor='check40'>Long Sleeve</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check41' />
                                                                            <label htmlFor='check41'>Short Sleeve</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check42' />
                                                                            <label htmlFor='check42'>Sleevless</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check43' />
                                                                            <label htmlFor='check43'>Three Quarter Length Sleeve</label>
                                                                        </div>
                                                                        <Button className='add-btn'>
                                                                            <img src='./img/selling/add.png' alt='' />
                                                                            View More</Button>
                                                                    </Accordion.Body>
                                                                </Accordion.Item> */}

                                                                <Accordion.Item eventKey="7" className='mt-20'>
                                                                    <Accordion.Header>
                                                                        <h5>Material</h5>
                                                                    </Accordion.Header>
                                                                    <Accordion.Body className='px-0'>
                                                                        <div className='d-flex align-items-center check-options '>
                                                                            <input type='checkbox' id='check44' />
                                                                            <label htmlFor='check44'>Chiffon</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='chec45' />
                                                                            <label htmlFor='chec45'>Denim</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check46' />
                                                                            <label htmlFor='check46'>Fabric</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check47' />
                                                                            <label htmlFor='check47'>Flannelette</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check48' />
                                                                            <label htmlFor='check48'>knitted Fabric</label>
                                                                        </div>
                                                                        <div className='d-flex align-items-center check-options mt-3'>
                                                                            <input type='checkbox' id='check49' />
                                                                            <label htmlFor='check49'>Lace</label>
                                                                        </div>
                                                                        <Button className='add-btn'>
                                                                            <img src='./img/selling/add.png' alt='' />
                                                                            View More</Button>
                                                                    </Accordion.Body>
                                                                </Accordion.Item>

                                                            </Accordion>
                                                        </div>

                                                    </div> : ""
                                            }


                                        </Col>
                                        <Col xxl={9} xl={8} lg={7} sm={12} className='mt-3 mt-lg-0'>
                                            {/* <div className='fill-title'>
                                                <h5>Trending Items</h5>
                                            </div> */}
                                            <div className='mb-0 explore-main'>
                                                {
                                                    postList.productListArrObj?.map((e) => {
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
                                                                path={postList?.productImagePath && postList.productImagePath}
                                                                color={e.sku_attributes.color}
                                                            />
                                                        )
                                                    })
                                                }
                                                <div className='w-100 d-flex justify-content-center'>
                                                    <Button className='shop-btn'>View More <MdKeyboardDoubleArrowRight /></Button>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </div>
                    </>
                )}
        </>
    )
}

export default Categories
