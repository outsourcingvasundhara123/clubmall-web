import React, { useEffect, useRef } from 'react';
import ImageGallery from 'react-image-gallery';

const ProductSlider = ({ productImagePath, productList, id, colorProduct, activeImage }) => {
  const imageGalleryRef = useRef(); // create a ref

  // const images = productList?.map((product) => ({
  //   original: productImagePath + id + "/" + product?.file_name,
  //   thumbnail: productImagePath + id + "/" + product.thumbnail,
  // }));

  const images = productList?.map((product) => ({
    original: productImagePath + id + "/" + product?.file_name,
    thumbnail: productImagePath + id + "/" + product.thumbnail,
  })) ?? [];
  

  const data = [...images, ...(colorProduct || [])];

  useEffect(() => {
    const index = data.findIndex(image => image.original === activeImage);
    if (index !== -1 && imageGalleryRef.current) {
      imageGalleryRef.current.slideToIndex(index); // manually slide to the index
    }
  }, [activeImage, data]);

  return (
    <div className='product-img-slider-cos'>
      <div className="wrapper">
        {images && (
          <ImageGallery
            ref={imageGalleryRef} // attach the ref
            items={data}
            thumbnailPosition={window.innerWidth < 668 ? "bottom" : "left"}
            showFullscreenButton={false}
            showPlayButton={false}
          />
        )}
      </div>
    </div>
  )
}

export default ProductSlider;
