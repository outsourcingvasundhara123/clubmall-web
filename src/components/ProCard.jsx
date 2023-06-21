import React, { useRef, useState, useEffect, useContext } from 'react'
import { Button } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import AddCartModal from './AddCartModal';
import { handelProductDetail } from '../helper/constants';
import { CartContext } from '../context/CartContext';
import SucessSnackBar from "../components/SnackBar";
import ErrorSnackBar from "../components/SnackBar";

const ProCard = (props) => {

    const { addWishList } = useContext(CartContext);
    const location = useLocation(window.location.pathname);
    const navigate = useNavigate();
    const [product_id, setProduct_id] = useState({});
    const [productColorActive, setProductColorActive] = useState()
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setProduct_id({})
        setShow(false)
    }
    const handleShow = (id) => {
        setProduct_id(id)
        setShow(true);
    }

    useEffect(() => {
        // for not set the state after values come 
        if (props?.color && props.color.length > 0) {
            setProductColorActive(props.color[0]?.name);
        }
    }, []);


    return (
        <>

            <div className='cos-width explore-card'>
                <div className='product-card   pointer'>
                    <div className='position-relative'>
                        <img src={props.path + props.id + "/" + props.img} alt='' className='img-fluid' onClick={() => handelProductDetail(props.id)} />
                        <Button className='add-to-card-btn' onClick={() => handleShow(props.id)}>Add to Cart</Button>
                    </div>
                    <div className='py-3 px-3 space-card'>
                        <h5>{props.name}</h5>
                        <div className='d-flex align-items-center justify-content-between'>
                            <div>
                                <p className='per'>${props.group_price} <span>(Group Price)</span></p>
                                <span className='sub-per in-per'>${props.individual_price} (Individual Price)</span>
                            </div>
                            {props.is_wishList === 0
                                &&
                                <Button className='like-btn' onClick={() => addWishList(props.id, "product-wishlist")} >
                                    <img src='./img/new_in/like.png' className='like-size' alt='' />
                                </Button>
                            }
                            {
                                props.is_wishList === 1 &&
                                <Button className='like-btn' onClick={() => addWishList(props.id, "product-delete-wishlist")} >
                                    <img src='./img/Vector.png' alt='' />
                                </Button>
                            }

                        </div>
                    </div>
                </div>

                {
                    location.pathname === "/trending" ?
                        <>
                            <div className='product-color-cos d-flex align-items-center overflow-auto gap-2 mt-2'>

                                {props.color && props.color?.map((e, i) => {
                                    return (
                                        <div>
                                            <Button className={`${productColorActive === e.name ? "active" : ""} color-btn`} onClick={() => setProductColorActive(e.name)}>
                                                <img alt='' src={e.imgUrl} width="20px" />
                                            </Button>
                                        </div>
                                    )
                                })
                                }

                            </div>
                        </> : ""
                }
                {
                    location.pathname === "/categories" ?
                        <>
                            <div className='product-color-cos d-flex align-items-center overflow-auto gap-2 mt-2'>
                                {props.color && props.color?.map((e, i) => {
                                    return (
                                        <div>
                                            <Button className={`${productColorActive === e.name ? "active" : ""} color-btn`} onClick={() => setProductColorActive(e.name)}>
                                                <img alt='' src={e.imgUrl} width="20px" />
                                            </Button>
                                        </div>
                                    )
                                })
                                }
                            </div>
                        </> : ""
                }
            </div>
            <AddCartModal handleClose={handleClose} show={show} product_id={product_id} />
        </>
    )
}

export default ProCard
