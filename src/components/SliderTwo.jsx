import React, { useRef } from 'react'
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowLeft } from "react-icons/md"
import CategoryList from '../page/CategoryList';

const SliderTwo = (props) => {

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
            items: 3,
        },
        768: {
            items: 4,
        },
        991: {
            items: 6,
        },
        1200: {
            items: 8,
        },
        1600: {
            items: 11,
        },
    };


    return (
        <div className='multy-slider position-relative'>
            <CategoryList />

            {/* <OwlCarousel
                className="owl-theme"
                loop
                dots={false}
                navText={['Prev', 'Next']}
                responsive={CateResponsiveOptions}
                ref={carousel1Ref}
            >
                {
                    props.data.map((e, i) => {
                        return (
                            <div className='item' key={i}>
                                {

                                    <div className='product-box' key={i}>
                                        <img src={e.img} alt='' />
                                        <h6>{e.name}</h6>
                                    </div>
                                }
                            </div>
                        )
                    })
                }

            </OwlCarousel>

            <OwlCarousel
                className="owl-theme"
                loop
                dots={false}
                navText={['Prev', 'Next']}
                responsive={CateResponsiveOptions}
                ref={carousel2Ref}
            >
                {
                    props.data.map((e, i) => {
                        return (
                            <div className='item' key={i}>
                                {
                                    <div className='product-box' key={i}>
                                        <img src={e.img} alt='' />
                                        <h6>{e.name}</h6>
                                    </div>
                                }
                            </div>
                        )
                    })
                }
            </OwlCarousel>

            <div className='slider-controls w-100 d-flex align-items-center justify-content-between'>
                <button className="prev" onClick={handlePrev}>
                    <MdOutlineKeyboardArrowLeft />
                </button>
                <button className="next" onClick={handleNext}>
                    <MdOutlineKeyboardArrowRight />
                </button>
            </div> */}
        </div>
    )
}

export default SliderTwo
