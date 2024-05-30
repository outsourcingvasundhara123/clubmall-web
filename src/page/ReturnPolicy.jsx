    import React from 'react'

    const ReturnPolicy = () => {
        
        return (
            <>
                <h1 className='d-none'></h1>
                <div className='policy return-policy pb-5'>
                    <div className='container-cos'>
                        <h3>Return Policy</h3>
                        <p className='mt-4'>We hope you love what you've ordered! But , just in case you're not 100% satisfied, we've made the return process super easy.</p>

                        <h5>How Long Do I Have To Make A Return?</h5>
                        <p className='mt-3'>You have a maximum of 35 days from the date of your purchase to make a return. Your return package must be postmarked within 35 days after the purchase date. Returns postmarked after 35 days from the purchase date will not be accepted.</p>

                        <h5>Do I Have To Pay For Shipping When I Return Something?</h5>
                        {/* <p className='mt-3'><span className='highlight'>Return Shipping is free</span> on your <span className='highlight'>1st return package for any order.</span> You must use the return label ("Return Label") we provide (See "How do I make a return?" section for details), then ship the return package postmarked within 35 days from the purchase date.</p> */}

                        <p className='mt-3'>If you have already returned item(s) from an order but would like to make <span className='highlight'>additional returns</span> of item(s) in the same order, you can use the Return Label we provided, and a<span className='highlight'> $5 shipping fee</span> will be deducted from your refund.</p>

                        <p className='mt-3'>Please note that any additional returns must be postmarked within 35 days of the purchase date.</p>

                        <h5>How Do I Make A Return?</h5>
                        <p className='mt-3'>1. Sign into your CLUBMALL User Account from the App.</p>
                        <p className='mt-3'>2. Go to "My Orders" and find the order that contains the item(s) you would like to return and click "Order Details".</p>
                        <p className='mt-3'>3. Then click the "Quick Return" button, select the item(s) you would like to return, indicate the reason, and click "Next Step".</p>
                        <p className='mt-3'>4. Select the "Refund Method". Please note that Wallet Credit is not available for Third-Party Sellers’ products.</p>
                        <p className='mt-3'>5. Select the "Return Method" :</p>
                        <p className='mt-3'>Return By USPS or UPS : You can either use the provided return label (Printer Required) or the QR code (No Printer Required).</p>
                        <p className='mt-3'>6. Pack your return item(s) securely, in the original package if possible, and securely tape the Return Label on the outside of your return package.</p>
                        <p className='mt-3'>7. Mail out the return package at your nearest USPS or UPS (as applicable) location. Your package must be postmarked within 35 days from the purchase date.</p>
                        <p className='mt-3'>8. Please note that no refund shall be settled unless the returned items are correctly shipped according to the respective shipping labels. If there are multiple shipping labels for more than 1 item to be returned, please do not mix them up.</p>
                        <p className='mt-3'>*The Return Label we provide only works if you are shipping within the US.</p>

                        <h5>How Do I Find The Return Label I Generated?</h5>
                        <p className='mt-3'>Find the order containing the returned item(s) in the "My Orders" section of your User Account. → Click "Order Details" → Click "Return & Refund Record" → Click "Details" → Click "Save the Label" to view and download the Return Label.</p>

                        <h5>Can I Still Return Items If They Are Worn, Damaged, Or Have The Tags Removed?</h5>
                        <p className='mt-3'>1. You can only return items that are unworn, unwashed, undamaged, have the original tags attached and hygiene sticker (if applicable) intact.</p>
                        <p className='mt-3'>2. Human hair wigs are not eligible for return if it's in a condition notably different from when it was shipped. You may not return an item if the lace has been cut, the hairnet has been damaged, there is evidence of washing or bleaching, or if any alterations have been made to the product's length, color, shape, or material.</p>

                        <h5>Non-Returnable Items</h5>
                        <p className='mt-3'>1. The following items cannot be returned or exchanged: bodysuits, lingerie, underwear, jewelry, accessories, cosmetics, pet products, and any other items for which return or exchange is noted as not being supported.</p>
                        <p className='mt-3'>2. Free gifts cannot be returned or exchanged.</p>

                        <h5>Important Notice</h5>
                        <p className='mt-3'>1. Please do not send your return to the sender's address on your package. This is not the return address and will affect the processing of your return. You should only send it to the address on the Return Label we provide.</p>
                        <p className='mt-3'>2. Please make sure you do not include any items that were not purchased on the CLUBMALL Site or the App by accident in your return package. We will not be responsible for sending back those items to you.</p>
                        <p className='mt-3'>3. If you return an item that does not qualify for a return under the return policy, we reserve the right not to issue a refund and to send the item back to you.</p>

                        <h5>Refunds</h5>
                        <p className='mt-3'>1. For products that are returned in accordance with this return Policy, refunds will be processed within 7 days after we receive your return package. The refund will be issued to the original payment method.</p>
                        <p className='mt-3'>Unfortunately, due to transportation delays, your refund may require an additional 3-5 days to process. Thank you for your patience and understanding.</p>
                        <p className='mt-3'>2. The original shipping fee, if any, is non-refundable.</p>

                        <p className='mt-4'><span className='highlight '>NOTE</span>: If you have any issues with your return, you must contact Customer Support within 90 days after your purchase date.</p>

                        <div className='d-flex justify-content-center'>
                            {/* <Button className='submit-btn'>Start Return</Button> */}
                        </div>
                    </div>
                </div>
            </>
        )
    }

    export default ReturnPolicy
