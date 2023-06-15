import React, { useState,useContext } from 'react'
import { Button } from 'react-bootstrap'
import AddCartModal from './AddCartModal'
import { useNavigate } from 'react-router-dom';
import { handelProductDetail } from '../helper/constants';
import { CartContext } from '../context/CartContext';

const PinkCard = (props) => {

    const navigate = useNavigate();
    const { addWishList } = useContext(CartContext);
    const [show, setShow] = useState(false);
    const handleClose = () => {
     setProduct_id({})  
     setShow(false)
     }
    const [product_id, setProduct_id] = useState({});

    const handleShow = (id) => {
        setProduct_id(id)
        setShow(true);
    }
      
    return (
        <>
            <div className='pink-card  pointer'>
                <div className='pink-img position-relative'>
                    <img alt='' src={ props.path + props.img._id + "/" + props.img?.product_images[0]?.file_name} width="100%" onClick={() => handelProductDetail(props.img._id)} />
                    <Button className='add-to-card-btn'  onClick={ () => handleShow(props.img._id)}>Add to Cart</Button>
                </div>
                <div className='pink-card-text d-flex align-items-center justify-content-between px-3 py-2'>
                    <div>
                        <h5>${props.img.individual_price}</h5>
                        <p>Group Price: <b>${props.img.group_price}</b></p>
                    </div>
                    {props.img.wishList === 0
                                &&
                                <Button className='like-btn' onClick={() => addWishList(props.img._id, "product-wishlist")} >
                                    <img src='./img/new_in/like.png' alt='' />
                                </Button>
                                }
                            {
                                props.img.wishList === 1 &&
                                <Button className='like-btn' onClick={() => addWishList(props.img._id, "product-delete-wishlist")} >
                                   <img src='./img/Vector.png' alt='' />
                                </Button>
                            }

                </div>
            </div>

            <AddCartModal handleClose={handleClose} show={show}  product_id={product_id} />
        </>
    )
}

export default PinkCard
