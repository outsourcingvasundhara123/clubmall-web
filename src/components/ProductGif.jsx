import { useRef, useEffect, useState } from 'react';
import * as GIF from 'gif.js';

const ProductGif = ({ productImagePath, productList, id, colorProduct, activeImage }) => {

    const imageGalleryRef = useRef();
    const [gifSrc, setGifSrc] = useState(null);

    const images = productList?.map((product) => ({
        original: productImagePath + id + "/" + product?.file_name,
        thumbnail: productImagePath + id + "/" + product.thumbnail,
    })) ?? [];

    const data = [...images, ...(colorProduct || [])];

    useEffect(() => {
        const index = data.findIndex(image => image.original === activeImage);
        if (index !== -1 && imageGalleryRef.current) {
            imageGalleryRef.current.slideToIndex(index);
        }
    }, [activeImage, data]);

    useEffect(() => {
        let loadedImages = [];
        const gif = new GIF({
            workers: 2,
            quality: 10
        });

        data.forEach(({ original }) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = original;
            
            img.onload = () => {
                loadedImages.push(img);
                if (loadedImages.length === data.length) {
                    loadedImages.forEach(loadedImg => gif.addFrame(loadedImg, { delay: 200 }));
                    gif.on('finished', blob => {
                        const gifURL = URL.createObjectURL(blob);
                        setGifSrc(gifURL);
                    });
                    gif.render();
                }
            };
        });
    }, [data]);

// console.log(gifSrc,"gifSrc");

    return (
        <div>
            <img id="generatedGif" src={gifSrc} />
        </div>
    );
}

export default ProductGif;
