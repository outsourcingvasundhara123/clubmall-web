import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import AddCartModal from './AddCartModal';

const ProCard = (props) => {

    const location = useLocation(window.location.pathname);
    const navigate = useNavigate();
    const [product_id, setProduct_id] = useState({});
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setProduct_id({})  
        setShow(false)
   }
    const handleShow = (id) => {   
    setProduct_id(id)    
    setShow(true);
  }

    return (
        <>
            <div className='cos-width'>
                <div className='product-card explore-card  pointer'>
                    <div className='position-relative'>
                        <img  src={props.path +  props.id + "/" +  props.img} alt='' className='img-fluid' onClick={() => navigate("/Product-info")} />
                        <Button className='add-to-card-btn' onClick={ () => handleShow(props.id) }>Add to Cart</Button>
                    </div>
                    <div className='py-3 px-3' onClick={() => navigate("/Product-info")}>
                        <h5>{props.name}</h5>
                        <div className='d-flex align-items-center justify-content-between'>
                            <div>
                                <p className='per'>${props.group_price} <span>(Group Price)</span></p>
                                <span className='sub-per'>${props.individual_price} (Individual Price)</span>
                            </div>
                            <Button className='like-btn'>
                                <img src='./img/new_in/like.png' alt='' />
                            </Button>
                        </div>
                    </div>
                </div>
                {
                    location.pathname === "/trending" ?
                        <>
                            <div className='product-color-cos d-flex align-items-center gap-2 mt-2'>
                                <Button className='active'>
                                    <img alt='' src='./img/hero/color1.png' width="100%" />
                                </Button>
                                <Button >
                                    <img alt='' src='./img/hero/color2.png' width="100%" />
                                </Button>
                                <Button >
                                    <img alt='' src='./img/hero/color3.png' width="100%" />
                                </Button>
                                <Button >
                                    <img alt='' src='./img/hero/color4.png' width="100%" />
                                </Button>
                                <Button >
                                    <img alt='' src='./img/hero/color5.png' width="100%" />
                                </Button>
                            </div>
                        </> : ""
                }
                {
                    location.pathname === "/categories" ?
                        <>
                            <div className='product-color-cos d-flex align-items-center gap-2 mt-2'>
                                <Button className='active'>
                                    <img alt='' src='./img/hero/color1.png' width="100%" />
                                </Button>
                                <Button >
                                    <img alt='' src='./img/hero/color2.png' width="100%" />
                                </Button>
                                <Button >
                                    <img alt='' src='./img/hero/color3.png' width="100%" />
                                </Button>
                                <Button >
                                    <img alt='' src='./img/hero/color4.png' width="100%" />
                                </Button>
                                <Button >
                                    <img alt='' src='./img/hero/color5.png' width="100%" />
                                </Button>
                            </div>
                        </> : ""
                }
            </div>
            <AddCartModal handleClose={handleClose} show={show} product_id={product_id} />
        </>
    )
}

export default ProCard
