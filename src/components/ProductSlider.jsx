import React, { useEffect, useRef } from 'react';
import ImageGallery from 'react-image-gallery';

const ProductSlider = ({ productImagePath, productList, id, colorProduct, activeImage ,sliderRef }) => {
  const imageGalleryRef = useRef(); // create a ref

  const images = productList?.map((product) => {
    const isVideo = product.file_name.endsWith('.mp4'); // check if the file is a video
    const original = productImagePath + id + "/" + product?.file_name;
    const thumbnail = product.thumbnail ? (productImagePath + id + "/" + product.thumbnail) : original;

    return {
      original: original,
      thumbnail: thumbnail,
      type: isVideo ? 'video' : 'image', // add type property
    };
  }) ?? [];
  

  const data = [...images, ...(colorProduct || [])].filter(item => item.original);
  const videoRef = useRef(null);
  const handlePlay = (event) => {
      const video = event.target;
      if (video) {
          video.play();
          enterFullscreen(video);
      }
  };
  
  const enterFullscreen = (video) => {
      if (video && video.webkitEnterFullscreen) {
          video.webkitEnterFullscreen();
      }
  };
  useEffect(() => {
    const index = data.findIndex(image => image.original === activeImage);
    if (index !== -1 && imageGalleryRef.current) {
      imageGalleryRef.current.slideToIndex(index); // manually slide to the index
    }
  }, [activeImage, data]);
  const renderItem = (item) => {
    const imageUrl = item.original;
    const thumUrl=item.thumbnail
    return item.type === 'video' ? (
      <video ref={videoRef} autoPlay loop playsInline width="100%" className='slider-video'  onClick={(event) => handlePlay(event)}>
        <source src={item.original} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    ) : (
      <img src={thumUrl} className='image-gallery-image' alt="" />
    );
  };
  
  const renderThumbInner = (item) => {
    return  (
      <img style={{width:'100%'}} className='image-gallery-image' src={item.thumbnail} alt="" />
    );
  };
  return (
    <div ref={sliderRef}   className='product-img-slider-cos'>
      <div className="wrapper">
        {images && (
          <ImageGallery
            ref={imageGalleryRef} // attach the ref
            items={data}
            renderItem={renderItem}
            renderThumbInner={renderThumbInner}
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
