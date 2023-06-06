import React, { useState } from 'react'
import { Button, ProgressBar } from 'react-bootstrap'
import { RiFlashlightFill } from 'react-icons/ri'
import AddCartModal from './AddCartModal';
import { useNavigate } from 'react-router-dom';
import { handelProductDetail } from '../helper/constants';

const SaleCard = (props) => {

    const navigate = useNavigate();


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
            <div className='product-card pointer  stylist-card position-relative p-0'>
                <div className='position-relative'>
                    <img src={ props.path + props.img._id + "/" +  props.img?.product_images[0]?.file_name} alt={props.img.name} className='w-100' onClick={() => handelProductDetail(props.img._id)} />
                    <Button className='add-to-card-btn' onClick={ () => handleShow(props.img._id)}>Add to Cart</Button>
                </div>
                <Button className='discount'><RiFlashlightFill /><p style={{ fontSize: "13px", fontWeight: "600" }}> -{Math.round(props.img.group_price * 100 / props.img.individual_price)}%</p></Button>
                <div className='desc' onClick={() => handelProductDetail(props.img._id)} >
                    <p className='title truncate-after-words'>{props.img.name}</p>
                    <p className='group-price'>${props.img.group_price}(Group Price)</p>
                    <p className='individual-price mt-1 mb-3'>${props.img.individual_price}(Individual Price)</p>
                    <ProgressBar now={60} />
                    <p className='stock py-2'>{props.img.total_order}% Sold</p>
                </div>
            </div>
            <AddCartModal handleClose={handleClose} show={show} product_id={product_id} />
        </>
    )
}

export default SaleCard
