import React from 'react'
import ImageGallery from 'react-image-gallery';
import { images } from '../helper/constants';


const ProductSlider = ({ productImagePath, productList, id, colorProduct }) => {

  // Transform the data into the required format
  const images = productList && productList?.map((product) => ({
    original: productImagePath + id + "/" + product?.file_name ,
    thumbnail: productImagePath + id + "/" + product.thumbnail,
  }));
  let data = [...images, ...colorProduct]
  console.log(data, "data");

  return (
    <div className='product-img-slider-cos'>
      <div className="wrapper">
        {images && <ImageGallery
          items={data}
          thumbnailPosition="left"
          showFullscreenButton={false}
          showPlayButton={false}
        />}
      </div>
    </div>
  )
}

export default ProductSlider
