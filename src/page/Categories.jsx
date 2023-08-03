import React, { useRef, useState, useEffect, useContext } from 'react'
import Layout from '../layout/Layout'
import SliderTwo from '../components/SliderTwo'
import { Accordion, Button, Col, Row } from 'react-bootstrap'
import { MdKeyboardDoubleArrowRight } from "react-icons/md"
import { data } from "../page/Data"
import ProCard from '../components/ProCard'
import { colors, categoriesSliderData } from '../helper/constants'
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
import colorNameToHex from 'color-name';
import { errorResponse } from '../helper/constants'
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

const Categories = () => {

    const { setAdd_wished_Called, add_wished_Called, handelwishSell, sellIs_wished, categoryWeb, getCategoryWeb, wishProductUrl, currentUser,
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
    const navigate = useNavigate();
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
    const [colorList, setColorList] = useState([]);
    const serverURL = getServerURL();
    const [page, setPage] = useState(1);
    const [viewCalled, setViewCalled] = useState(false);
    const [loading, setLoading] = useState(true);
    const player = useRef();
    const [message, setMyMessage] = useState("");
    const Categorie_id = localStorage.getItem("selectedcategories") && localStorage.getItem("selectedcategories")
    const [subCatId, setSubCatId] = useState("");
    const [viewMoreLodr, setViewmoreLoder] = useState(false);
    const selectedSub = localStorage.getItem("selectedSubcategories")
    const [range, setRange] = useState([0, 100]); // Initial range values
    const [showButton, setShowButton] = useState(false);

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
            if (add_wished_Called === false) {
                startAnimation()
            }
            if (add_wished_Called === true || viewCalled === true) {
                setLoading(false);
            } else {
                setLoading(true);
            }
            if (Categorie_id) {
                const apiTyp = isLoggedIn ? api.postWithToken : api.post;
                let categoryDtata = await apiTyp(`${serverURL + PRODUCTDEPENDENTCATEGORY}`)
                let subcat = categoryDtata?.data?.data?.productsCategoryList.filter((e) => e._id === Categorie_id);
                var subCart_id = subcat[0]?.child.find(e => e?.name == subCat)
                setSubCatList(subcat[0]?.child)

                if (subCat === null) {
                    let cat = subcat[0]?.child.find(e => e?._id == selectedSub)
                    setSubCat(cat?.name)
                }
                setCatName(subcat[0]?.name)
                const [postListResponse] = await Promise.all([
                    apiTyp(`${serverURL + PRODUCTList}`, {
                        "product_list_type": "by-filters",
                        product_category_one_id: Categorie_id,
                        product_category_two_id: subCart_id?._id,
                        color: productColorActive,
                        size: myFilter.size,
                        type: myFilter.type,
                        patten_type: myFilter.patten_type,
                        material: myFilter.material,
                        min_price: range[0],
                        max_price: range[1],
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
            } else {
                navigate("/")
            }
        } catch (error) {
            // errorResponse(error, setMyMessage);
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

            // set color code 
            const getColorCode = (colorName) => {
                const colorCode = colorNameToHex[colorName.toLowerCase()];
                return colorCode ? `${colorCode} ` : null;
            };

            const colorCodes = filterlist?.data?.filterData[0]?.color?.map((colorName) => ({
                name: colorName,
                code: getColorCode(colorName),
            })).filter((color) => color.code !== null);

            setColorList(colorCodes)
            setFilterList(filterlist.data.filterData)
            stopAnimation()
        } catch (error) {
            // errorResponse(error, setMyMessage);
            console.log(error);
        }
    };

    useEffect(() => {
        getCategory();
    }, [ Categorie_id, subCat, page, viewCalled, subCatId, sellIs_wished, myFilter, range, productColorActive]);


    useEffect(() => {
        getWishList()
    }, [ add_wished_Called]);

    useEffect(() => {
        getFilterDetails();
    }, [subCatId]);

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setMyFilter((prevValues) => ({
    //         ...prevValues,
    //         [name]: value,
    //     }));
    // };

    const handleChange = (e) => {
        setPage(1)
        setViewCalled(false)
        const { name, value } = e.target;
        setAdd_wished_Called(false)
        setMyFilter((prevValues) => {
            return {
                ...prevValues,
                [name]: prevValues[name] === value ? "" : value,
            };
        });
    };

    const handleRangeChange = (values) => {
        setPage(1)
        setAdd_wished_Called(false)
        setViewCalled(false)
        setRange(values);
    };




    useEffect(() => {
        const timer = setTimeout(() => {
            setShowButton(true);
        }, 9000); // Delay in milliseconds (e.g., 5000ms = 5 seconds)

        return () => clearTimeout(timer); // Clear the timer if the component unmounts
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
                                        <Button key={i} className={`${subCat === e.name ? "active" : ""}`} onClick={() => (setViewCalled(false), setSubCat(e.name), setMyFilter(initial), setRange([0, 100]), setProductColorActive(), setAdd_wished_Called(false))}>{e.name} </Button>
                                        // <Button key={i} className={`${subCat === e.name ? "active" : ""}`} onClick={() => ( setViewCalled(false), setSubCat(e.name))}>{e.name} </Button>
                                    )
                                })
                            }
                        </div>
                    </div>

                    <div className='filter-product pt-4'>
                        <Row>
                            <Col xxl={3} xl={4} lg={5} sm={12}>
                                <div className='d-flex align-items-center justify-content-between '>
                                    <div className='fill-title'>
                                        <h5>Filters</h5>
                                    </div>
                                    <Button className='submit-btn filter-show mt-0-cos' onClick={() => setFilterShow(!filterShow)} style={{ fontSize: "18px" }}><FiFilter /></Button>
                                </div>
                                {
                                    filterShow ?
                                        <div className='filter-option p-4 mt-4 sticky-filter'>
                                            <div className='d-flex align-items-center justify-content-end'>
                                                <Button className='clear-all-filter' onClick={() => (setMyFilter(initial), setRange([0, 100]), setProductColorActive())} >Clear all</Button>
                                            </div>
                                            <div className='filter-box'>
                                                <Accordion alwaysOpen>

                                                    {colorList?.length === undefined || colorList?.length !== 0 &&

                                                        <div className='filter-box mt-20 product-color'>
                                                            <h5>Color</h5>
                                                            <div className='d-flex align-items-center flex-wrap mt-4 gap-2'>


                                                                <div className='d-flex align-items-center check-options gap-2 flex-wrap'>
                                                                    {
                                                                        colorList && colorList.map((e, i) => {
                                                                            return (
                                                                                <div key={i} className={`${productColorActive == e.name ? "active" : ""} pointer cat-color `} style={{ backgroundColor: `rgb(${e.code})`, width: '30px', height: '30px', borderRadius: '50%' }} onClick={() => (setProductColorActive(e.name),setViewCalled(false),setPage(1),setAdd_wished_Called(false))}>
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                                </div>

                                                            </div>
                                                        </div>
                                                    }

                                                    {filterList[0]?.size?.length === undefined || filterList[0]?.size?.length !== 0 &&

                                                        <Accordion.Item eventKey="3" className='mt-20'>
                                                            <Accordion.Header>
                                                                <h5>Size</h5>
                                                            </Accordion.Header>
                                                            <Accordion.Body className='px-0'>
                                                                {
                                                                    filterList[0]?.size?.map((e, i) => {
                                                                        return (
                                                                            <div key={i} className='d-flex align-items-center check-options '>
                                                                                <input type='radio' name='size' key={`${subCat}-${e}`} checked={myFilter['size'] === e} onClick={handleChange} value={e} id={e} />
                                                                                <label htmlFor={e}>{e}</label>
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                    }

                                                    {filterList[0]?.style?.length === undefined || filterList[0]?.style?.length !== 0 &&

                                                        <Accordion.Item eventKey="1" className='mt-20 '>
                                                            <Accordion.Header>
                                                                <h5>Style</h5>
                                                            </Accordion.Header>
                                                            <Accordion.Body className='px-0 '>

                                                                {
                                                                    filterList[0]?.style?.map((e, i) => {
                                                                        return (
                                                                            <div key={i} className='d-flex align-items-center check-options'>
                                                                                <input type='radio' name='style' key={`${subCat}-${e}`} checked={myFilter['style'] === e} onClick={handleChange} value={e} id={e} />
                                                                                <label htmlFor={e}>{e}</label>
                                                                            </div>
                                                                        )
                                                                    })
                                                                }

                                                            </Accordion.Body>
                                                        </Accordion.Item>

                                                    }

                                                    {filterList[0]?.type?.length === undefined || filterList[0]?.type?.length !== 0 &&
                                                        <Accordion.Item eventKey="4" className='mt-20'>
                                                            <Accordion.Header>
                                                                <h5>Type</h5>
                                                            </Accordion.Header>
                                                            <Accordion.Body className='px-0'>

                                                                {
                                                                    filterList[0]?.type?.map((e, i) => {
                                                                        return (

                                                                            <div key={i} className='d-flex align-items-center check-options ' >
                                                                                <input type='radio' name='type' key={`${subCat}-${e}`} checked={myFilter['type'] === e} onClick={handleChange} value={e} id={e} />
                                                                                <label htmlFor={e}>{e}</label>
                                                                            </div>
                                                                        )
                                                                    })
                                                                }

                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                    }

                                                    {filterList[0]?.patten_type?.length === undefined || filterList[0]?.patten_type?.length !== 0 &&

                                                        <Accordion.Item eventKey="2" className='mt-20'>
                                                            <Accordion.Header>
                                                                <h5>Pattern Type</h5>
                                                            </Accordion.Header>
                                                            <Accordion.Body className='px-0'>

                                                                {
                                                                    filterList[0]?.patten_type?.map((e, i) => {
                                                                        return (
                                                                            <div key={i} className='d-flex align-items-center check-options' >
                                                                                <input type='radio' name='patten_type' key={`${subCat}-${e}`} checked={myFilter['patten_type'] === e} onClick={handleChange} value={e} id={e} />
                                                                                <label htmlFor={e}>{e}</label>
                                                                            </div>
                                                                        )
                                                                    })
                                                                }

                                                            </Accordion.Body>
                                                        </Accordion.Item>

                                                    }

                                                    {filterList[0]?.material?.length === undefined || filterList[0]?.material?.length !== 0 &&

                                                        <Accordion.Item eventKey="7" className='mt-20'>
                                                            <Accordion.Header>
                                                                <h5>Material</h5>
                                                            </Accordion.Header>
                                                            <Accordion.Body className='px-0'>

                                                                {
                                                                    filterList[0]?.material?.map((e, i) => {
                                                                        return (
                                                                            <div key={i} className='d-flex align-items-center check-options' >
                                                                                <input type='radio' name='material' checked={myFilter['material'] === e} onClick={handleChange} key={`${subCat}-${e}`} value={e} id={e} />
                                                                                <label htmlFor={e}>{e}</label>
                                                                            </div>
                                                                        )
                                                                    })
                                                                }

                                                            </Accordion.Body>
                                                        </Accordion.Item>

                                                    }
                                                    <div className='filter-box mt-20 range'>
                                                        <h5>Price Range</h5>
                                                        <div class="price-range-slider mt-4 mb-3">
                                                            <Slider range min={0} max={100} value={range} onChange={handleRangeChange} />
                                                            <div className='d-flex align-items-center justify-content-between mt-2'>
                                                                <span> {range[0]}</span>
                                                                <span>{range[1]}</span>
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
                                                                colorUrl={e.sku_details}
                                                                productActiveColor={productColorActive}
                                                            />
                                                        )
                                                    })
                                                }

                                                {postList.length >= 20 &&
                                                    <div className='w-100 d-flex justify-content-center'>
                                                        <Button className='shop-btn' onClick={() => (setViewmoreLoder(true), handelwishSell(), setPage(page + 1), setViewmoreLoder(true), setViewCalled(true))}  >{viewMoreLodr ? "Loding..." : "View More"}<MdKeyboardDoubleArrowRight /></Button>
                                                    </div>
                                                }
                                            </div>

                                            {
                                                (postList.length <= 0) && (!loading) && showButton &&
                                                <div className='d-flex align-items-center justify-content-center  catagories-not-found' style={{ marginTop: "100px" }}>
                                                    <div className='text-center found'>
                                                        <img src='./img/not-found.png' alt='' />
                                                        <p className='mt-3'> No result found </p>
                                                        {/* <Button className='mt-3 submit-btn'>Shop Now</Button> */}
                                                    </div>
                                                </div>
                                            }

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
