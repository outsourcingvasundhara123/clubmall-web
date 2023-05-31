import React from 'react'
import ImageGallery from 'react-image-gallery';
import { images } from '../helper/constants';


const ProductSlider = ({ productImagePath, productList, id }) => {

  // Transform the data into the required format
  const images = productList && productList?.map((product) => ({
    original: productImagePath + id + "/" + product.file_name,
    thumbnail: productImagePath + id + "/" + product.thumbnail,
  }));

  // const responsiveConfig = [
  //   {
  //     breakpoint: 512,
  //     options: {
  //       thumbnailsPosition: 'bottom'
  //     }
  //   }
  // ];

  return (
    <div className='product-img-slider-cos'>
      <div className="wrapper">
        {images && <ImageGallery
          items={images}
          thumbnailPosition="left"
          showFullscreenButton={false}
          showPlayButton={false}
        // responsive={responsiveConfig}

        />}
      </div>
    </div>
  )
}

export default ProductSlider
