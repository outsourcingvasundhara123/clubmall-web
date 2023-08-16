import React, { useRef } from 'react'
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
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



    return (
        <div className='multy-slider position-relative'>
            <CategoryList />
        </div>
    )
}

export default SliderTwo
