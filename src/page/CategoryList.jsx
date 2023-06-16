import React, { useRef, useState, useEffect } from 'react'
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useNavigate } from 'react-router-dom'
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowLeft } from "react-icons/md"
import api from "../helper/api";
import { getServerURL } from '../helper/envConfig';
import { PRODUCTCATEGORY, PRODUCTList } from "../helper/endpoints";
import Loader from '../components/Loader';
import { handelCategorydata,handelCategory } from '../helper/constants';

const CategoryList = () => {

    const navigate = useNavigate();
    const [category, setcategory] = useState([]);

    const serverURL = getServerURL();
    const [loading, setLoading] = useState(true);
    const player = useRef();

    const startAnimation = () => {
        if (player.current) {
            player.current.play(); // Check if player.current is not null before accessing play()
        }
    };
    const stopAnimation = () => {
        setLoading(false);
    };

    const [active, setActive] = useState("1");

    const handleClick = (event) => {
        // setActive(event.target.id);
    }

    const carousel1Ref = useRef(null);
    const carousel2Ref = useRef(null);

    const handlePrev = () => {
        carousel1Ref.current.prev();
        carousel2Ref.current.prev();
    };

    const handleNext = () => {
        carousel1Ref.current.next();
        carousel2Ref.current.next();
    };

    const CateResponsiveOptions = {
        0: {
            items: 2,
        },
        425: {
            items: 2,
        },
        768: {
            items: 3,
        },
        1024: {
            items: 4,
        },
        1200: {
            items: 5,
        },
        1700: {
            items: 6,
        },
    };

    const getCategory = async () => {
        startAnimation()
        try {
            const [categoryResponse] = await Promise.all([
                api.post(`${serverURL + PRODUCTCATEGORY}`, { action: "web" })
            ]);
            const categoryData = categoryResponse.data.data;

            // Divide the category list into two parts
            const halfwayIndex = Math.ceil(categoryData.productsCategory && categoryData?.productsCategory.length / 2);

            const firstHalf = categoryData.productsCategory?.slice(0, halfwayIndex);
            const secondHalf = categoryData.productsCategory?.slice(halfwayIndex);
            // Set the first half and second half of categories
            setcategory({ firstHalf, secondHalf, productsCategoryIconPath: categoryData?.productImagePath });
            stopAnimation()
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCategory();
    }, []);

    return (
        <div className='categories-slider mt-5 position-relative'>
            {
                loading ? <Loader startAnimation={startAnimation} stopAnimation={stopAnimation} player={player} /> : (
                    <>
                        <OwlCarousel
                            className="owl-theme"
                            loop
                            dots={false}
                            navText={['Prev', 'Next']}
                            responsive={CateResponsiveOptions}
                            ref={carousel1Ref}
                        >
                            {category && category.firstHalf && category.firstHalf.map((e, i) => {
                                return (
                                    <div className='item' key={i}>
                                        <div className='cate-slider-box text-center px-0 px-md-3 pointer' key={i} onClick={() => handelCategorydata(e._id)}>
                                            <div className='categories-slider-img '>   {/* "active-catagories" use this class to active catagories */}
                                                <img src={category.productsCategoryIconPath + e.icon} alt='' />
                                            </div>
                                            <h6 className='mt-3'>{e.name}</h6>
                                            <p>From ${e.minPrice}</p>
                                        </div>
                                    </div>
                                );
                            })}

                        </OwlCarousel>

                        <OwlCarousel
                            className="owl-theme"
                            loop
                            dots={false}
                            navText={['Prev', 'Next']}
                            responsive={CateResponsiveOptions}
                            ref={carousel2Ref}
                        >
                            {category && category.secondHalf && category.secondHalf.map((e, i) => {
                                return (
                                    <div className='item ' key={i} onClick={() => handelCategorydata(e.name)} >
                                        <div className='cate-slider-box text-center px-0 px-md-3 pointer'  >
                                            <div className='categories-slider-img'  >
                                                <img src={category.productsCategoryIconPath + e.icon} alt='' />
                                            </div>
                                            <h6 className='mt-3'>{e.name}</h6>
                                            <p>From ${e.minPrice}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </OwlCarousel>

                        <div className='slider-controls w-100 d-flex align-items-center justify-content-between'>
                            <button className="prev" onClick={handlePrev}>
                                <MdOutlineKeyboardArrowLeft />
                            </button>
                            <button className="next" onClick={handleNext}>
                                <MdOutlineKeyboardArrowRight />
                            </button>
                        </div>
                    </>
                )}
        </div>
    )
}

export default CategoryList


// use contect 

// import React, { useRef, useState, useEffect,useContext } from 'react'
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import { useNavigate } from 'react-router-dom'
// import OwlCarousel from 'react-owl-carousel';
// import 'owl.carousel/dist/assets/owl.carousel.css';
// import 'owl.carousel/dist/assets/owl.theme.default.css';
// import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowLeft } from "react-icons/md"
// import api from "../helper/api";
// import { getServerURL } from '../helper/envConfig';
// import { PRODUCTCATEGORY, PRODUCTList } from "../helper/endpoints";
// import Loader from '../components/Loader';
// import { handelCategorydata } from '../helper/constants';
// import { CartContext } from '../context/CartContext';
// import { Is_Login } from '../helper/IsLogin';

// const CategoryList = () => {

//     const { stopAnimationcategory, startAnimationcategory, playercategory,loadingCategory,setLoadingCategory,categoryWeb,getCategoryWeb, userProductList, loading, setLoading, wishProductUrl, category, currentUser,
//         productList, trendingProductList, getProducts, getWishList, wishlist, addWishList, sucessSnackBarOpen, warningSnackBarOpen, Mymessage, setWarningSnackBarOpen, setSucessSnackBarOpen } = useContext(CartContext);
//     const navigate = useNavigate();
//     // const [category, setcategory] = useState([]);

//     const serverURL = getServerURL();
//     // const [loading, setLoading] = useState(true);
//     // const player = useRef();

//     // const startAnimation = () => {
//     //     if (player.current) {
//     //         player.current.play(); // Check if player.current is not null before accessing play()
//     //     }
//     // };
//     // const stopAnimation = () => {
//     //     setLoading(false);
//     // };

//     const [active, setActive] = useState("1");

//     const handleClick = (event) => {
//         // setActive(event.target.id);
//     }

//     const carousel1Ref = useRef(null);
//     const carousel2Ref = useRef(null);

//     const handlePrev = () => {
//         carousel1Ref.current.prev();
//         carousel2Ref.current.prev();
//     };

//     const handleNext = () => {
//         carousel1Ref.current.next();
//         carousel2Ref.current.next();
//     };

//     const CateResponsiveOptions = {
//         0: {
//             items: 1,
//         },
//         425: {
//             items: 2,
//         },
//         768: {
//             items: 3,
//         },
//         1024: {
//             items: 3,
//         },
//         1200: {
//             items: 4,
//         },
//         1700: {
//             items: 5,
//         },
//     };

//     // const getCategory = async () => {
//     //     startAnimation()
//     //     try {
//     //         const [categoryResponse] = await Promise.all([
//     //             api.post(`${serverURL + PRODUCTCATEGORY}`, { action: "web" })
//     //         ]);
//     //         const categoryData = categoryResponse.data.data;

//     //         // Divide the category list into two parts
//     //         const halfwayIndex = Math.ceil(categoryData.productsCategory && categoryData?.productsCategory.length / 2);

//     //         const firstHalf = categoryData.productsCategory?.slice(0, halfwayIndex);
//     //         const secondHalf = categoryData.productsCategory?.slice(halfwayIndex);
//     //         // Set the first half and second half of categories
//     //         setcategory({ firstHalf, secondHalf, productsCategoryIconPath: categoryData?.productImagePath , categoryData:categoryData.productsCategory });
//     //         stopAnimation()
//     //     } catch (error) {
//     //         console.log(error);
//     //     }
//     // };

//     useEffect(() => {
//         getCategoryWeb();
//     }, []);

// // console.log(categoryWeb,"categoryWeb");
// // console.log(loadingCategory,"loadingCategory");
//     return (
//         <div className='categories-slider mt-5 position-relative'>
//             {
//                 loadingCategory ? <Loader startAnimation={stopAnimationcategory} stopAnimation={stopAnimationcategory} player={playercategory} /> : (
//                     <>
//                         <OwlCarousel
//                             className="owl-theme"
//                             loop
//                             dots={false}
//                             navText={['Prev', 'Next']}
//                             responsive={CateResponsiveOptions}
//                             ref={carousel1Ref}
//                         >
//                             {categoryWeb && categoryWeb.firstHalf && categoryWeb.firstHalf.map((e, i) => {
//                                 return (
//                                     <div className='item' key={i}>
//                                         <div className='cate-slider-box text-center px-0 px-md-3 pointer' key={i}   onClick={() => handelCategorydata(e.name)}>
//                                             <div className='categories-slider-img '>   {/* "active-catagories" use this class to active catagories */}
//                                                 <img src={categoryWeb.productsCategoryIconPath + e.icon} alt='' />
//                                             </div>
//                                             <h6 className='mt-3'>{e.name}</h6>
//                                             <p>From ${e.minPrice}</p>
//                                         </div>
//                                     </div>
//                                 );
//                             })}

//                         </OwlCarousel>

//                         <OwlCarousel
//                             className="owl-theme"
//                             loop
//                             dots={false}
//                             navText={['Prev', 'Next']}
//                             responsive={CateResponsiveOptions}
//                             ref={carousel2Ref}
//                         >
//                             {categoryWeb && categoryWeb.secondHalf && categoryWeb.secondHalf.map((e, i) => {
//                                 return (
//                                     <div className='item ' key={i} onClick={() => handelCategorydata(e.name)} >
//                                         <div className='cate-slider-box text-center px-0 px-md-3 pointer'  >
//                                             <div className='categories-slider-img'  >
//                                                 <img   src={categoryWeb.productsCategoryIconPath + e.icon} alt='' />
//                                             </div>
//                                             <h6 className='mt-3'>{e.name}</h6>
//                                             <p>From ${e.minPrice}</p>
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </OwlCarousel>

//                         <div className='slider-controls w-100 d-flex align-items-center justify-content-between'>
//                             <button className="prev" onClick={handlePrev}>
//                                 <MdOutlineKeyboardArrowLeft />
//                             </button>
//                             <button className="next" onClick={handleNext}>
//                                 <MdOutlineKeyboardArrowRight />
//                             </button>
//                         </div>
//                     </>
//                 )}
//         </div>
//     )
// }

// export default CategoryList