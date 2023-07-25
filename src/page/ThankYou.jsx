import React from 'react'
import { Button } from 'react-bootstrap'

const ThankYou = () => {
    return (
        <div className='thankyou d-flex align-items-center justify-content-center text-center p-2 p-sm-5'>
            <div className='thankyou-box'>
                <img src='./img/thank-you.png' width="100%" />
                <p className='my-3'>Thanks for reaching out! <br />
                    Your message just showed up in my inbox. Talk to you soon!</p>
                <div>
                    <Button className='submit-btn mt-0'>Back to Home</Button>
                </div>
            </div>
        </div>
    )
}

export default ThankYou
