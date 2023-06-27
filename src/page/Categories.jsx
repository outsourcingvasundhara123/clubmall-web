import React, { useRef, useState, useEffect, useContext } from 'react'
import Layout from '../layout/Layout'
import SliderTwo from '../components/SliderTwo'
import { Accordion, Button, Col, Row } from 'react-bootstrap'
import { MdKeyboardDoubleArrowRight } from "react-icons/md"
import { data } from "../page/Data"
import ProCard from '../components/ProCard'
import { colors, categoriesSliderData } from '../helper/constants'
import { RangeSlider } from 'rsuite';
import 'rsuite/dist/rsuite-no-reset.min.css';
import { PRODUCTList, PRODUCTSEARCH, PRODUCTCATEGORY, PRODUCTDEPENDENTCATEGORY } from "../helper/endpoints";
import { useNavigate } from 'react-router-dom'
import api from "../helper/api";
import { getServerURL } from '../helper/envConfig';
import Loader from '../components/Loader';
import { FiFilter } from 'react-icons/fi'
import { CartContext } from '../context/CartContext';
import SucessSnackBar from "../components/SnackBar";
import ErrorSnackBar from "../components/SnackBar";
import { Is_Login } from '../helper/IsLogin'

const Categories = () => {

    const { handelwishSell, sellIs_wished, categoryWeb, getCategoryWeb, wishProductUrl, currentUser,
        productList, trendingProductList, getProducts, getWishList, wishlist, addWishList, sucessSnackBarOpen, warningSnackBarOpen, Mymessage, setWarningSnackBarOpen, setSucessSnackBarOpen } = useContext(CartContext);

    const initial = {
        color: "",
        size: "",
        type: "",
        patten_type: "",
        material: "",
        min_price: "",
        max_price: ""
    }

    const isLoggedIn = Is_Login();
    const [subCat, setSubCat] = useState(null)
    const [url, setUrl] = useState()
    const [catName, setCatName] = useState()
    const [subCatList, setSubCatList] = useState([])
    const [filterShow, setFilterShow] = useState(window.innerWidth < 991 ? false : true)
    const [filterList, setFilterList] = useState([])
    const [productColorActive, setProductColorActive] = useState()
    const [postList, setPostList] = useState([]);
    const [myFilter, setMyFilter] = useState(initial);
    const serverURL = getServerURL();
    const [page, setPage] = useState(0);
    const [viewCalled, setViewCalled] = useState(false);
    const [loading, setLoading] = useState(true);
    const player = useRef();
    const Categorie_id = localStorage.getItem("selectedcategories") ? localStorage.getItem("selectedcategories") : "Women Apparel"
    const [subCatId, setSubCatId] = useState("");
    const [viewMoreLodr, setViewmoreLoder] = useState(false);
    const selectedSub = localStorage.getItem("selectedSubcategories")

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
            if (viewCalled === true) {
                setLoading(false);
            } else {
                setLoading(true);
            }
            const apiTyp = isLoggedIn ? api.postWithToken : api.post;
            let categoryDtata = await apiTyp(`${serverURL + PRODUCTDEPENDENTCATEGORY}`)
            let subcat = categoryDtata?.data?.data?.productsCategoryList.filter((e) => e._id === Categorie_id);
            var subCart_id = subcat[0]?.child.find(e => e.name == subCat)
            console.log(subCart_id, "subCat");

            setSubCatList(subcat[0]?.child)
            if (subCat === null) {
                let cat = subcat[0]?.child.find(e => e._id == selectedSub)
                setSubCat(cat.name)
                // setSubCat(subcat[0]?.child[0].name)
            }
            setCatName(subcat[0]?.name)
            const [postListResponse] = await Promise.all([
                apiTyp(`${serverURL + PRODUCTList}`, {
                    "product_list_type": "by-filters",
                    product_category_one_id: Categorie_id,
                    product_category_two_id: subCart_id._id,
                    color: myFilter.color,
                    size: myFilter.size,
                    type: myFilter.type,
                    patten_type: myFilter.patten_type,
                    material: myFilter.material,
                    min_price: myFilter.min_price,
                    max_price: myFilter.max_price,
                    page: page
                }),
            ]);
            setSubCatId(subCart_id?._id)
            const postsData = postListResponse.data.data;
            setUrl(postsData.productImagePath)
            if (viewCalled === true) {
                const updateProductList = [...postList, ...postsData.productListArrObj]
                    .filter((product, index, self) => self.findIndex(p => p._id === product._id) === index);
                setPostList(updateProductList);
            } else {
                setPostList(postsData.productListArrObj);
            }
            setViewmoreLoder(false)
            stopAnimation()
        } catch (error) {
            console.log(error);
        }
    };

    // filter-details

    const getFilterDetails = async () => {
        try {
            startAnimation()
            const apiTyp = isLoggedIn ? api.postWithToken : api.post;
            let filterlist = await apiTyp(`${serverURL + "filter-details"}`, {
                product_category_one_id: Categorie_id,
                product_category_two_id: subCatId
            })
            setFilterList(filterlist.data.filterData)
            stopAnimation()
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCategory();
    }, [Categorie_id, subCat, sellIs_wished, page, viewCalled, sellIs_wished, subCatId, myFilter]);

    useEffect(() => {
        getFilterDetails();
    }, [subCatId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMyFilter((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

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

            <div className='categories'>
                <div className='container-cos'>
                    {/* <div className='categories-slider'>
                                    <SliderTwo data={categoriesSliderData} />
                                </div> */}

                    <div className='sub-categories-list'>
                        <h3>{catName}</h3>
                        <div className='d-flex align-items-center gap-2 mt-3 flex-wrap'>
                            {
                                subCatList?.map((e, i) => {
                                    return (
                                        <Button key={i} className={`${subCat === e.name ? "active" : ""}`} onClick={() => (setViewCalled(false), setSubCat(e.name), setMyFilter(initial))}>{e.name} </Button>
                                        // <Button key={i} className={`${subCat === e.name ? "active" : ""}`} onClick={() => ( setViewCalled(false), setSubCat(e.name))}>{e.name} </Button>
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
                                                                colors?.map((e, i) => {
                                                                    return (
                                                                        <Button className={`${productColorActive === e.id ? "active" : ""} color-btn`} onClick={(e) => setProductColorActive(e.id)}>
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
                                                            {
                                                                filterList[0]?.size?.map((e, i) => {
                                                                    return (
                                                                        <div key={i} className='d-flex align-items-center check-options '>
                                                                            <input type='radio' name='size' key={`${subCat}-${e}`} onChange={handleChange} value={e} id={e} />
                                                                            <label htmlFor={e}>{e}</label>
                                                                        </div>
                                                                    )
                                                                })
                                                            }

                                                        </Accordion.Body>
                                                    </Accordion.Item>

                                                    <Accordion.Item eventKey="1" className='mt-20'>
                                                        <Accordion.Header>
                                                            <h5>Style</h5>
                                                        </Accordion.Header>
                                                        <Accordion.Body className='px-0'>

                                                            {
                                                                filterList[0]?.style?.map((e, i) => {
                                                                    return (
                                                                        <div key={i} className='d-flex align-items-center check-options'>
                                                                            <input type='radio' name='style' onChange={handleChange} key={`${subCat}-${e}`} value={e} id={e} />
                                                                            <label htmlFor={e}>{e}</label>
                                                                        </div>
                                                                    )
                                                                })
                                                            }

                                                        </Accordion.Body>
                                                    </Accordion.Item>

                                                    <Accordion.Item eventKey="4" className='mt-20'>
                                                        <Accordion.Header>
                                                            <h5>Type</h5>
                                                        </Accordion.Header>
                                                        <Accordion.Body className='px-0'>


                                                            {
                                                                filterList[0]?.type?.map((e, i) => {
                                                                    return (
                                                                        <div key={i} className='d-flex align-items-center check-options ' >
                                                                            <input type='radio' name='type' onChange={handleChange} key={`${subCat}-${e}`} value={e} id={e} />
                                                                            <label htmlFor={e}>{e}</label>
                                                                        </div>
                                                                    )
                                                                })
                                                            }

                                                        </Accordion.Body>
                                                    </Accordion.Item>

                                                    <Accordion.Item eventKey="2" className='mt-20'>
                                                        <Accordion.Header>
                                                            <h5>Pattern Type</h5>
                                                        </Accordion.Header>
                                                        <Accordion.Body className='px-0'>

                                                            {
                                                                filterList[0]?.patten_type?.map((e, i) => {
                                                                    return (
                                                                        <div key={i} className='d-flex align-items-center check-options' >
                                                                            <input type='radio' name='patten_type' onChange={handleChange} key={`${subCat}-${e}`} value={e} id={e} />
                                                                            <label htmlFor={e}>{e}</label>
                                                                        </div>
                                                                    )
                                                                })
                                                            }

                                                        </Accordion.Body>
                                                    </Accordion.Item>



                                                    <Accordion.Item eventKey="7" className='mt-20'>
                                                        <Accordion.Header>
                                                            <h5>Material</h5>
                                                        </Accordion.Header>
                                                        <Accordion.Body className='px-0'>

                                                            {
                                                                filterList[0]?.material?.map((e, i) => {
                                                                    return (
                                                                        <div key={i} className='d-flex align-items-center check-options' >
                                                                            <input type='radio' name='material' onChange={handleChange} key={`${subCat}-${e}`} value={e} id={e} />
                                                                            <label htmlFor={e}>{e}</label>
                                                                        </div>
                                                                    )
                                                                })
                                                            }



                                                        </Accordion.Body>
                                                    </Accordion.Item>


                                                    <div className='filter-box mt-20 range'>
                                                        <h5>Price Range</h5>
                                                        <div class="price-range-slider mt-4 mb-3">
                                                            <RangeSlider defaultValue={[0, 100]} />
                                                            <div className='d-flex align-items-center justify-content-between mt-2'>
                                                                <span>0</span>
                                                                <span>10</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </Accordion>
                                            </div>

                                        </div> : ""
                                }

                            </Col>

                            <Col xxl={9} xl={8} lg={7} sm={12} className='mt-3 mt-lg-0'>
                                {/* <div className='fill-title'>
                                                <h5>Trending Items</h5>
                                            </div> */}

                                {
                                    loading ? <Loader startAnimation={startAnimation} stopAnimation={stopAnimation} player={player} /> : (
                                        <>
                                            <div className='mb-0 explore-main'>
                                                {
                                                    postList?.map((e) => {
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
                                                                path={url && url}
                                                                color={e.sku_attributes.color}
                                                                is_wishList={e.wishList && e.wishList}
                                                            />
                                                        )
                                                    })
                                                }

                                                {
                                                    postList.length <= 0 &&
                                                    <div className='d-flex align-items-center justify-content-center h-100 spacing-top'>
                                                        <div className='text-center found'>
                                                            <img src='./img/not-found.png' alt='' />
                                                            <p className='mt-3'> No result found </p>
                                                            {/* <Button className='mt-3 submit-btn'>Shop Now</Button> */}
                                                        </div>
                                                    </div>
                                                }


                                                {postList.length !== 0 &&
                                                    <div className='w-100 d-flex justify-content-center'>
                                                        <Button className='shop-btn' onClick={() => (setViewmoreLoder(true), handelwishSell(), setPage(page + 1), setViewmoreLoder(true), setViewCalled(true))}  >{viewMoreLodr ? "Loding..." : "View More"}<MdKeyboardDoubleArrowRight /></Button>
                                                    </div>
                                                }


                                            </div>
                                        </>
                                    )
                                }
                            </Col>

                        </Row>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Categories
