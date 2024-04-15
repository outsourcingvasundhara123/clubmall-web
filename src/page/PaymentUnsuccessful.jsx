import React from 'react'
import { Button } from 'react-bootstrap'
import { BsXCircleFill } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom';

const PaymentUnsuccessful = () => {
    const navigate = useNavigate();

    const errorIconStyles = {
        color: 'red', // Adjust the color to match your design
        fontSize: '5rem', // Adjust the size as needed
        margin: '0.5rem'
    };

    const errorBoxStyles = {
        maxWidth: '600px',
        margin: 'auto',
        padding: '2rem',
        // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Adds a subtle shadow
        backgroundColor: '#fff', // Consider your theme colors
        borderRadius: '8px'
    };

    return (
        <div className='payment-unsuccessful d-flex align-items-center justify-content-center text-center p-4 p-sm-5'>
            <div style={errorBoxStyles} className='unsuccessful-box'>
                <h1>Payment Unsuccessful</h1>
                <p>We're sorry, but there was a problem processing your payment.<br /> Please try again or contact customer support.</p>
                <BsXCircleFill style={errorIconStyles} />
                <h3 className='my-2'>Shope More?</h3>
                <Button variant="danger" onClick={() => navigate("/trending")} className='submit-btn mt-2'>Continue Shopping</Button>
            </div>
        </div>
    )
}

export default PaymentUnsuccessful
