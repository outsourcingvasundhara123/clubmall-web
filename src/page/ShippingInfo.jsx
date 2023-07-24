import React from 'react'
import { NavLink, Table } from 'react-bootstrap'

const ShippingInfo = () => {
    return (
        <div>
            <h1 className='d-none'></h1>
            <div className='policy pb-5'>
                <div className='container-cos'>
                    <h3>International Shipping</h3>

                    <div className='shipping-table my-4'>
                        <Table responsive bordered >
                            <thead>
                                <tr>
                                    <th>Price Types </th>
                                    <th>Delivery Time</th>
                                    <th>Costs</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Individual Price</td>
                                    <td className='text-gray'>Estimated to be delivered by 10 to 12 days </td>
                                    <td>
                                        <div className='shipping-per'>
                                            <span>$5 for orders under $18.00</span>
                                            <p className='text-red'>Free - orders over $18.00</p>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Group Price</td>
                                    <td className='text-gray'>Estimated to be delivered by 10 to 12 days</td>
                                    <td>
                                        <div className='shipping-per'>
                                            <span>$5 for orders under $19.00</span>
                                            <p className='text-red'>Free - orders over $19.00</p>
                                        </div>
                                    </td>
                                </tr>
                                {/* <tr>
                                    <td>EXPRESS SHIPPING</td>
                                    <td className='text-gray'>Estimated to be delivered on 07/31/2023 - 08/03/2023.</td>
                                    <td>
                                        <div className='shipping-per'>
                                            <span>$12.90</span>
                                            <p className='text-red'>Free - orders over $129.00</p>
                                        </div>
                                    </td>
                                </tr> */}
                            </tbody>
                        </Table>
                        {/* <p>A “Quickship” tag will let you know that the item may be available to be shipped from a warehouse located in the United States. If the item is not available to be shipped from a warehouse located in the United States, it will be shipped from a warehouse located outside the United States.</p> */}
                    </div>

                    <div className='nots'>
                        <h5>Nots :</h5>
                        <p>1) Express Shipping is not available for P.O. Boxes and APO/FPO addresses</p>
                        <p>2) After the order has been paid, the warehouse needs 1-3 days to process your order. You will receive a notification once your order has been shipped.</p>
                        <p>3) In most cases, the package will be delivered within the estimated time of arrival. However, the actual delivery date may be affected by flight arrangements, weather conditions and other external factors. Please refer to the tracking information for the most accurate delivery date.</p>
                        <p>4) If your package has not been delivered or your tracking information shows that your package has been delivered but you have not received it, you must contact Customer Service to verify within 45 days of the order date. For other orders, products, and logistics related issues, you must contact customer service within 90 days of the order date.</p>
                        {/* <p>5) Please click the "Confirm Delivery" button within 6 months (from the date of shipment). After that, the button will turn gray and cannot be used to get additional points.</p> */}
                        {/* <p>6) The free On-Time Delivery Guarantee service entitles you to receive 500 CLUBMALL points if your order doesn't arrive by the expected date. Please refer to On-Time Delivery Guarantee <NavLink href='/privacy-policy'>Terms and Conditions</NavLink> for more details.</p> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShippingInfo
