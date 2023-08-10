import React, { useRef, useEffect } from "react";
import gifshot from 'gifshot';

const ProductGif = ({ productImagePath, productList, id, colorProduct, activeImage }) => {
    const imageGalleryRef = useRef();
    
    const images = productList?.map((product) => ({
        original: productImagePath + id + "/" + product?.file_name,
        thumbnail: productImagePath + id + "/" + product.thumbnail,
    })) ?? [];

    const data = [...images, ...(colorProduct || [])];


    // console.log(data,"data");

    useEffect(() => {
        const index = data.findIndex(image => image.original === activeImage);
        if (index !== -1 && imageGalleryRef.current) {
            imageGalleryRef.current.slideToIndex(index);
        }
    }, [activeImage, data]);

    useEffect(() => {
        if (data && data.length > 0) {
            const imageUrls = data.map(imageObj => imageObj.original);
            console.log(imageUrls,"imageUrls");

            gifshot.createGIF({
                'images': imageUrls[0],
                interval: 0.5,  // you can set the delay here, 0.5 seconds between frames
                gifWidth: 500,
                gifHeight: 500
            }, function (obj) {
                console.log(obj,"image");
                if (!obj.error) {
                    const image = obj.image;
                    document.getElementById('generatedGif').src = image;
                }
            });
        }
    }, [data]);

    return (
        <div>
            <img id="generatedGif" alt="Generated GIF" />
        </div>
    );
}

export default ProductGif;
