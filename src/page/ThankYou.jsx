import React from 'react'
import { Button } from 'react-bootstrap'
import { BsFillCheckCircleFill } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom';

const ThankYou = () => {

    const navigate = useNavigate();

    return (
        <div className='thankyou d-flex align-items-center justify-content-center text-center p-4 p-sm-5'>
            <div className='thankyou-box'>
                <h1>Thank You!</h1>
                <p>Thank you for visiting CLUBMALL website. You will <br /> received an email massage shortly.</p>
                <span className='thankyou-img'><BsFillCheckCircleFill /></span>
                <h3 className='my-2'>Please check your Email</h3>
                <div>
                    <Button onClick={() => navigate("/trending")} className='submit-btn mt-2'>Continue Shopping</Button>
                </div>
            </div>
        </div>
    )
}

export default ThankYou
