import React, { useRef, useState, useEffect, useContext } from 'react'
import { Button } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import AddCartModal from './AddCartModal';
import { handelProductDetail } from '../helper/constants';
import { CartContext } from '../context/CartContext';




const ProCard = (props) => {


    const [isWishlist, setIsWishlist] = useState(props.is_wishList === 1); // We use !! to convert to a boolean
    const { handelwishSell, addWishList } = useContext(CartContext);
    const location = useLocation(window.location.pathname);
    const navigate = useNavigate();
    const [product_id, setProduct_id] = useState({});
    const [productColorActive, setProductColorActive] = useState()
    const [show, setShow] = useState(false);
    const [activeImage, setActiveImage] = useState(null); // Add this line
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleClose = () => {
        setProduct_id({})
        setShow(false)
    }

    const handleShow = (id) => {
        setProduct_id(id)
        setShow(true);
    }


    useEffect(() => {
        setIsWishlist(props.is_wishList === 1);
    }, [props.is_wishList]);

    // new function for wishlist on dome 
    const handleWishlistClick = async () => {
        const newWishlistStatus = !isWishlist;
        setIsWishlist(newWishlistStatus); // We first update the local state

        // Then we update the context or the backend asynchronously
        if (newWishlistStatus) {
            await addWishList(props.id, "product-wishlist"); // Add to wishlist
        } else {
            await addWishList(props.id, "product-delete-wishlist"); // Remove from wishlist
        }
    }

    const uniqueColors = (colors) => {
        const unique = [];
        colors.forEach(color => {
            if (!unique.find(c => c.attrs[0].color === color.attrs[0].color)) {
                unique.push(color);
            }
        });
        return unique;
    }


    useEffect(() => {
        let defaultColor;
        if (props.productActiveColor) {
            defaultColor = props.color?.find((color) => color.name === props.productActiveColor);
        } else if (props?.color && props.color.length > 0) {
            defaultColor = props.color[0];
        }

        if (defaultColor) {
            setProductColorActive(defaultColor.name);
            const matchingColorDetails = props.colorUrl?.find((colorDetail) => colorDetail.attrs[0]?.color === defaultColor.name);
            setActiveImage(props.path + props.id + "/" + matchingColorDetails?.file_name);
        }
    }, []);

    return (
        <>

            <div className='cos-width explore-card'>
                <div className='product-card   pointer'>
                    <div className='position-relative'>
                        <img
                            src="./img/placeholder_img.webp"
                            alt=''
                            className='img-fluid'
                            style={{ display: imageLoaded ? 'none' : 'block' }}
                        />
                        <img
                            src={activeImage ? activeImage : props.path + props.id + "/" + props.img}
                            alt=''
                            className='img-fluid img-size'
                            onClick={() => handelProductDetail(props.id)}
                            onLoad={() => setImageLoaded(true)}
                            style={{ display: imageLoaded ? 'block' : 'none' }}
                        />
                        <Button className='add-to-card-btn' onClick={() => handleShow(props.id)}>Add to Cart</Button>
                    </div>
                    <div className='py-3 px-3 space-card' >
                        <h5 onClick={() => handelProductDetail(props.id)}>{props.name}</h5>
                        <div className='d-flex align-items-center justify-content-between'>
                            <div onClick={() => handelProductDetail(props.id)} >
                                {/* <p className='per' >${props.group_price} <span >(Group Price)</span></p> */}
                                {/* <span className='sub-per in-per'>${props.individual_price} (Individual Price)</span> */}

                                <span className='per in-per'>${props.individual_price}</span>
                            </div>

                            {(isWishlist === false) && (location.pathname !== "/trending" && location.pathname !== "/search") &&

                                <Button className='like-btn' onClick={handleWishlistClick} >
                                    <img src='./img/new_in/like.png' className='like-size' alt='' />
                                </Button>
                            }
                            {
                                (isWishlist === true) && (location.pathname !== "/trending" && location.pathname !== "/search") &&
                                <Button className='like-btn' onClick={handleWishlistClick} >
                                    <img src='./img/Vector.png' alt='' />
                                </Button>
                            }


                        </div>
                    </div>
                </div>
                {
                    location.pathname === "/trending" &&
                    <div className='product-color-cos d-flex align-items-center overflow-auto gap-2 mt-2'>
                        {
                            props.colorUrl && uniqueColors(props.colorUrl).slice(0, 3).map((e, i) => {
                                return (
                                    <div key={i}>
                                        <Button className={`${productColorActive === e.attrs[0]?.color ? "active" : ""} color-btn`} onClick={() => (setProductColorActive(e.attrs[0]?.color), setActiveImage(props.path + props.id + "/" + e.file_name))}>
                                            <img alt='' src={props.path + props.id + "/" + e.file_name} width="20px" />
                                        </Button>
                                    </div>
                                )
                            })
                        }
                        {props.colorUrl && uniqueColors(props.colorUrl).length > 3 && <Button onClick={() => handleShow(props.id)}>+{uniqueColors(props.colorUrl).length - 3}</Button>}
                    </div>
                }
                {
                    location.pathname === "/categories" ?
                        <>
                            <div className='product-color-cos d-flex align-items-center overflow-auto gap-2 mt-2'>
                                {
                                    props.colorUrl && uniqueColors(props.colorUrl).slice(0, 3).map((e, i) => {
                                        return (
                                            <div key={i}>
                                                <Button className={`${productColorActive === e.attrs[0]?.color ? "active" : ""} color-btn`} onClick={() => (setProductColorActive(e.attrs[0]?.color), setActiveImage(props.path + props.id + "/" + e.file_name))}>
                                                    <img alt='' src={props.path + props.id + "/" + e.file_name} width="20px" />
                                                </Button>
                                            </div>
                                        )
                                    })
                                }
                                {props.colorUrl && uniqueColors(props.colorUrl).length > 3 && <Button onClick={() => handleShow(props.id)}>+{uniqueColors(props.colorUrl).length - 3}</Button>}
                            </div>
                        </> : ""
                }
            </div>
            <AddCartModal handleClose={handleClose} show={show} product_id={product_id} />
        </>
    )
}

export default ProCard
