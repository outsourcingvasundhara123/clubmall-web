import React, { useRef, useState, useEffect, useContext } from 'react'
import Layout from '../layout/Layout'
import { Button, Col, Row } from 'react-bootstrap'
import "swiper/css/pagination";
import "swiper/css/navigation";
import { handelProductDetail, handelCategorydata } from '../helper/constants';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product, productImagePath, handleShow }) => {

    const { addWishList } = useContext(CartContext);
    const [isWishlist, setIsWishlist] = useState(!!product.wishList);
    const [imageLoaded, setImageLoaded] = useState(false);


    const handleWishlistClick = async ()=> {
        const newWishlistStatus = !isWishlist;
        setIsWishlist(newWishlistStatus);

        if (newWishlistStatus) {
            await addWishList(product._id, "product-wishlist");
        } else {
            await addWishList(product._id, "product-delete-wishlist");
        }
    }

    useEffect(() => {
        setIsWishlist(!!product.wishList);
    }, [product.wishList]);

    return (
        <div className='product-card explore-card  pointer'>
            <h1 className='d-none'></h1>
            <div className='position-relative'>
            <img
                            src="./img/placeholder_img.png"
                            alt=''
                            className='img-fluid'
                            style={{ display: imageLoaded ? 'none' : 'block' }}
                        />
                <img 
                 onLoad={() => setImageLoaded(true)}
                 style={{ display: imageLoaded ? 'block' : 'none' }}
                onClick={() => handelProductDetail(product._id)} alt={product.name} src={productImagePath + product._id + "/" + product.product_images[0]?.file_name} className='img-fluid' />
                <Button className='add-to-card-btn' onClick={() => handleShow(product._id)} >Add to Cart</Button>
            </div>
            <div className='py-3 px-3 space-card'>
                <h5>{product.name}</h5>
                <div className='d-flex align-items-center justify-content-between'>
                    <div>
                        <p className='per'>${product.group_price} <span>(Group Price)</span></p>
                        <span className='sub-per'>${product.individual_price} (Individual Price)</span>
                    </div>
                    {isWishlist === false
                        &&
                        <Button className='like-btn' onClick={handleWishlistClick} >
                            <img src='./img/new_in/like.png' className='like-size' alt='' />
                        </Button>
                    }
                    {
                        isWishlist === true &&
                        <Button className='like-btn' onClick={handleWishlistClick} >
                            <img src='./img/Vector.png' alt='' />
                        </Button>
                    }
                </div>
            </div>
        </div>
    );
};

export default ProductCard

