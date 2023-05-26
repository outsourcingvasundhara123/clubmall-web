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


const CategoryList = () => {

    const navigate = useNavigate();
    const [category, setcategory] = useState([]);
    const [productList, setProductList] = useState([]);
    const [trendingProductList, setTrendingProductList] = useState([]);
    const serverURL = getServerURL();


    const [active, setActive] = useState("1");

    const handleClick = (event) => {
        setActive(event.target.id);
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
            items: 1,
        },
        425: {
            items: 2,
        },
        768: {
            items: 3,
        },
        1024: {
            items: 3,
        },
        1200: {
            items: 4,
        },
        1700: {
            items: 5,
        },
    };


    const getCategory = async () => {
        try {
            const [categoryResponse] = await Promise.all([
                api.post(`${serverURL + PRODUCTCATEGORY}`)
            ]);
            const categoryData = categoryResponse.data.data;

            // Divide the category list into two parts
            const halfwayIndex = Math.ceil(categoryData.productsCategory && categoryData.productsCategory.length / 2);

            const firstHalf = categoryData.productsCategory?.slice(0, halfwayIndex);
            const secondHalf = categoryData.productsCategory?.slice(halfwayIndex);

            // Set the first half and second half of categories
            setcategory({ firstHalf, secondHalf, productsCategoryIconPath: categoryData.productsCategoryIconPath });

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCategory();
    }, []);

    useEffect(() => {
        getCategory();
    }, []);


    return (
        <div className='categories-slider mt-5 position-relative'>
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
                            <div className='cate-slider-box text-center px-0 px-md-3' key={i}>
                                <div className='categories-slider-img' >
                                    <img src={category.productsCategoryIconPath + e.icon} alt='' />
                                </div>
                                <h6 className='mt-3'>{e.name}</h6>
                                <p>{e.minPrice}</p>
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
                        <div className='item' key={i}>
                            <div className='cate-slider-box text-center px-0 px-md-3' key={i}>
                                <div className='categories-slider-img' >
                                    <img src={category.productsCategoryIconPath + e.icon} alt='' />
                                </div>
                                <h6 className='mt-3'>{e.name}</h6>
                                <p>{e.minPrice}</p>
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
        </div>
    )
}

export default CategoryList