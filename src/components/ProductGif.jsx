import { useRef, useEffect, useState } from 'react';

const ProductGif = ({ productImagePath, productList, id, colorProduct }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const images = productList?.map((product) => ({
        original: productImagePath + id + "/" + product?.file_name,
        thumbnail: productImagePath + id + "/" + product.thumbnail,
    })) ?? [];

    const data = [...images, ...(colorProduct || [])];

    // Change image at an interval
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % data.length);
        }, 150);  // Change image every second. Adjust as needed.

        // Cleanup interval on unmount
        return () => clearInterval(interval);
    }, [data]);


    return (
        <div className='gif_position'>
            <img src={data[currentImageIndex]?.original} alt="product" />
        </div>
    );
}

export default ProductGif;
