import React, { useState } from 'react'
import { Button, Col, Form, Modal, NavLink, Row } from 'react-bootstrap'
import { MdOutlineClose, MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { FiChevronLeft } from 'react-icons/fi'

const CartNew = () => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <div className='cart-main pb-5'>
                <div className='container-cos'>

                    <div className='page-path d-flex align-items-center gap-1'>
                        <div className='d-flex align-items-center gap-1'>
                            <NavLink>Cart</NavLink>
                            <MdOutlineKeyboardArrowRight />
                            <NavLink className='active'>Information</NavLink>
                            <MdOutlineKeyboardArrowRight />
                            <NavLink>Shipping</NavLink>
                            <MdOutlineKeyboardArrowRight />
                            <NavLink>Payment</NavLink>
                            <MdOutlineKeyboardArrowRight />
                        </div>
                    </div>
                    <Row className='mt-4'>
                        <Col lg={6} md={12}>
                            {/* <div>
                                <div>
                                    <div className='login-input text-start'>
                                        <label>Contact</label>
                                        <input placeholder='Email or mobile number'
                                            type='number'
                                        />
                                    </div>
                                    <div className='d-flex align-items-start check-terms gap-2 mt-1'>
                                        <Form.Check
                                            type="checkbox"
                                            id="check_terms"
                                            name="terms_and_condition"
                                        />
                                        <label htmlFor='check_terms' className='pointer'>Email me with news and offers</label>
                                    </div>
                                </div>

                                <div className='location-main mt-4'>
                                    <Button onClick={() => handleShow("add")}>+ Add a new address</Button>
                                    <div className='address-box mt-1'>
                                        <h5> Rohan Vasundhara</h5>
                                        <p className='my-2'>Chula Vista, CA 91910-3800, United States</p>
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <div className='d-flex align-items-center check-options'   >
                                                <input type='checkbox' id='add-select' />
                                                <label htmlFor='add-select'>Default</label>
                                            </div>
                                            <div className='copy-main'>
                                                <Button>Edit</Button>
                                                <span>I</span>
                                                <Button >Delete</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button className='submit-btn w-100'>Continue to shipping</Button>
                            </div> */}

                            {/* <div className='shipping'>

                                <Button className='p-0 back-btn'>
                                    <FiChevronLeft />
                                    Return to information
                                </Button>

                                <div className='contact-details mt-3'>
                                    <div className='d-flex align-items-start gap-3'>
                                        <label>Contact:</label>
                                        <p>john66@gmail.com</p>
                                    </div>
                                    <div className='d-flex align-items-start gap-3 mt-3'>
                                        <label>Ship to:</label>
                                        <p>376 Center St, Chula Vista, CA 91910-3800, United State</p>
                                    </div>
                                </div>

                                <div className='login-input text-start mt-4'>
                                    <label>Shipping method</label>
                                    <input placeholder='Free Shipping'
                                        type='number'
                                    />
                                </div>

                                <Button className='submit-btn w-100'>Continue to payment</Button>
                            </div> */}

                            <div className='shipping'>

                                <Button className='p-0 back-btn'>
                                    <FiChevronLeft />
                                    Return to information
                                </Button>

                                <div className='contact-details mt-3'>
                                    <div className='d-flex align-items-start gap-3'>
                                        <label>Contact:</label>
                                        <p>john66@gmail.com</p>
                                    </div>
                                    <div className='d-flex align-items-start gap-3 mt-3'>
                                        <label>Ship to:</label>
                                        <p>376 Center St, Chula Vista, CA 91910-3800, United State</p>
                                    </div>
                                    <div className='d-flex align-items-start gap-3 mt-3'>
                                        <label>Method:</label>
                                        <p>Free Shipping | <span>Free</span></p>
                                    </div>
                                </div>

                                <div className='payment mt-4'>
                                    <h5 className='sub-all-title'>Payment</h5>
                                    <p>All transactions are secure and encrypted.</p>

                                    <div className='card-main mt-3'>
                                        <div className='card-title p-3'>
                                            <h5>Card</h5>
                                            <div className='d-flex gap-2 align-items-center'>
                                                <svg class="SVGInline-svg SVGInline--cleaned-svg SVG-svg BrandIcon-svg BrandIcon--size--20-svg" height="20" width="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 0h32v32H0z" fill="#00579f"></path><g fill="#fff" fill-rule="nonzero"><path d="M13.823 19.876H11.8l1.265-7.736h2.023zm7.334-7.546a5.036 5.036 0 0 0-1.814-.33c-1.998 0-3.405 1.053-3.414 2.56-.016 1.11 1.007 1.728 1.773 2.098.783.379 1.05.626 1.05.963-.009.518-.633.757-1.216.757-.808 0-1.24-.123-1.898-.411l-.267-.124-.283 1.737c.475.213 1.349.403 2.257.411 2.123 0 3.505-1.037 3.521-2.641.008-.881-.532-1.556-1.698-2.107-.708-.354-1.141-.593-1.141-.955.008-.33.366-.667 1.165-.667a3.471 3.471 0 0 1 1.507.297l.183.082zm2.69 4.806.807-2.165c-.008.017.167-.452.266-.74l.142.666s.383 1.852.466 2.239h-1.682zm2.497-4.996h-1.565c-.483 0-.85.14-1.058.642l-3.005 7.094h2.123l.425-1.16h2.597c.059.271.242 1.16.242 1.16h1.873zm-16.234 0-1.982 5.275-.216-1.07c-.366-1.234-1.515-2.575-2.797-3.242l1.815 6.765h2.14l3.18-7.728z"></path><path d="M6.289 12.14H3.033L3 12.297c2.54.641 4.221 2.189 4.912 4.049l-.708-3.556c-.116-.494-.474-.633-.915-.65z"></path></g></g></svg>

                                                <svg class="SVGInline-svg SVGInline--cleaned-svg SVG-svg BrandIcon-svg BrandIcon--size--20-svg" height="20" width="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 0h32v32H0z" fill="#000"></path><g fill-rule="nonzero"><path d="M13.02 10.505h5.923v10.857H13.02z" fill="#ff5f00"></path><path d="M13.396 15.935a6.944 6.944 0 0 1 2.585-5.43c-2.775-2.224-6.76-1.9-9.156.745s-2.395 6.723 0 9.368 6.38 2.969 9.156.744a6.944 6.944 0 0 1-2.585-5.427z" fill="#eb001b"></path><path d="M26.934 15.935c0 2.643-1.48 5.054-3.81 6.21s-5.105.851-7.143-.783a6.955 6.955 0 0 0 2.587-5.428c0-2.118-.954-4.12-2.587-5.429 2.038-1.633 4.81-1.937 7.142-.782s3.811 3.566 3.811 6.21z" fill="#f79e1b"></path></g></g></svg>

                                                <svg class="SVGInline-svg SVGInline--cleaned-svg SVG-svg BrandIcon-svg BrandIcon--size--20-svg" height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g fill="none" fill-rule="evenodd"><path fill="#0193CE" d="M0 0h32v32H0z"></path><path d="M17.79 18.183h4.29l1.31-1.51 1.44 1.51h1.52l-2.2-2.1 2.21-2.27h-1.52l-1.44 1.51-1.26-1.5H17.8v-.85h4.68l.92 1.18 1.09-1.18h4.05l-3.04 3.11 3.04 2.94h-4.05l-1.1-1.17-.92 1.17h-4.68v-.84zm3.67-.84h-2.53v-.84h2.36v-.83h-2.36v-.84h2.7l1.01 1.26-1.18 1.25zm-14.5 1.68h-3.5l2.97-6.05h2.8l.35.67v-.67h3.5l.7 1.68.7-1.68h3.31v6.05h-2.63v-.84l-.34.84h-2.1l-.35-.84v.84H8.53l-.35-1h-.87l-.35 1zm9.96-.84v-4.37h-1.74l-1.4 3.03-1.41-3.03h-1.74v4.04l-2.1-4.04h-1.4l-2.1 4.37h1.23l.35-1h2.27l.35 1h2.43v-3.36l1.6 3.36h1.05l1.57-3.36v3.36h1.04zm-8.39-1.85-.7-1.85-.87 1.85h1.57z" fill="#FFF"></path></g></svg>

                                                <svg class="SVGInline-svg SVGInline--cleaned-svg SVG-svg BrandIcon-svg BrandIcon--size--20-svg" height="20" width="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 0h32v32H0z" fill="#ebf1f8"></path><path d="M0 0h32v32H0z" fill="#fff"></path><g fill-rule="nonzero"><path d="M13.319 8.021V8h5.263v.021C22.707 8.327 25.9 11.808 25.9 16s-3.193 7.673-7.318 7.979V24h-5.263v-.021C9.193 23.673 6 20.192 6 16s3.193-7.673 7.319-7.979z" fill="#0165ac"></path><path d="M15.474 20.523c1.888-.68 3.15-2.492 3.15-4.523s-1.262-3.842-3.15-4.523zm-3.158-9.046c-1.889.68-3.15 2.492-3.15 4.523s1.261 3.842 3.15 4.523zm1.579 11.456c-3.78 0-6.842-3.104-6.842-6.933 0-3.83 3.063-6.933 6.842-6.933 3.779 0 6.842 3.104 6.842 6.933 0 3.83-3.063 6.933-6.842 6.933z" fill="#fff"></path></g></g></svg>

                                                <svg class="SVGInline-svg SVGInline--cleaned-svg SVG-svg BrandIcon-svg BrandIcon--size--20-svg" height="20" width="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient x1="84.571%" y1="-2.163%" x2="20.485%" y2="100%" id="bi_cartesbancaires__a"><stop stop-color="#002253" offset="0%"></stop><stop stop-color="#0082B1" offset="54.255%"></stop><stop stop-color="#0E9641" offset="100%"></stop></linearGradient></defs><g fill="none" fill-rule="evenodd"><path fill="url(#bi_cartesbancaires__a)" d="M0 0h32v32H0z"></path><path d="M17.657 10.009v6.008h9.591a3.004 3.004 0 0 0 0-6.008h-9.59zm-.818 6.008c-.054-1.182-.35-2.242-.846-3.142a5.963 5.963 0 0 0-2.358-2.357c-1.001-.553-2.2-.856-3.546-.856H8.818c-1.345 0-2.545.303-3.546.856a5.963 5.963 0 0 0-2.358 2.357c-.553 1.002-.856 2.201-.856 3.547 0 1.345.303 2.544.856 3.546a5.963 5.963 0 0 0 2.358 2.358c1.001.553 2.2.855 3.546.855h1.27c1.346 0 2.546-.302 3.547-.855a5.963 5.963 0 0 0 2.358-2.358c.497-.9.792-1.96.846-3.142H9.684v-.809h7.155zm.818.809v6.009h9.591a3.004 3.004 0 0 0 0-6.009h-9.59z" fill="#FFF"></path></g></svg>

                                                <svg class="SVGInline-svg SVGInline--cleaned-svg SVG-svg BrandIcon-svg BrandIcon--size--20-svg" height="20" width="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 0h32v32H0z" fill="#ebf1f8"></path><path d="M0 0h32v32H0z" fill="#fff"></path><g fill-rule="nonzero"><path d="M5 24h4.4c1.001 0 2.2-1.195 2.2-2.133V8H7.2C6.199 8 5 9.195 5 11.2z" fill="#047ab1"></path><path d="M7.497 18.816A9.283 9.283 0 0 1 5 18.475V17.3c.63.378 1.35.591 2.09.619.847 0 1.32-.576 1.32-1.365v-3.222h2.09v3.222c0 1.258-.682 2.261-3.003 2.261z" fill="#fff"></path><path d="M12.7 24h4.4c1.001 0 2.2-1.195 2.2-2.133V8h-4.4c-1.001 0-2.2 1.195-2.2 3.2z" fill="#d42d06"></path><path d="M12.7 14.08c.638-.597 1.738-.97 3.52-.885.968.042 1.98.32 1.98.32v1.184a4.574 4.574 0 0 0-1.903-.608c-1.353-.118-2.178.618-2.178 1.909s.825 2.027 2.178 1.92a4.64 4.64 0 0 0 1.903-.619v1.174s-1.012.288-1.98.33c-1.782.086-2.882-.288-3.52-.885z" fill="#fff"></path><path d="M20.4 24h4.4c1.001 0 2.2-1.195 2.2-2.133V8h-4.4c-1.001 0-2.2 1.195-2.2 3.2z" fill="#67b637"></path><path d="M25.9 17.28c0 .853-.682 1.387-1.595 1.387H20.4v-5.334h3.553l.253.011c.803.043 1.397.501 1.397 1.29 0 .62-.407 1.153-1.144 1.28v.033c.814.053 1.441.554 1.441 1.333zm-2.805-3.104a1.032 1.032 0 0 0-.143-.01h-1.32v1.343h1.463c.275-.064.506-.309.506-.672 0-.362-.231-.608-.506-.661zm.165 2.176a.975.975 0 0 0-.176-.01h-1.452v1.46h1.452l.176-.02c.275-.065.506-.342.506-.715 0-.374-.22-.64-.506-.715z" fill="#fff"></path></g></g></svg>

                                                <svg class="SVGInline-svg SVGInline--cleaned-svg SVG-svg BrandIcon-svg BrandIcon--size--20-svg" height="20" width="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 0h32v32H0z" fill="#fff"></path><g fill-rule="nonzero"><path d="M8.082 7h6.478c.904 0 1.466.816 1.256 1.821L12.8 23.163c-.213 1.002-1.118 1.819-2.023 1.819H4.3c-.903 0-1.467-.817-1.256-1.819L6.061 8.821c.211-1.005 1.116-1.82 2.021-1.82" fill="#dd2423"></path><path d="M14.02 7h7.45c.904 0 .496.816.284 1.821l-3.016 14.342c-.211 1.002-.145 1.819-1.051 1.819h-7.45c-.905 0-1.466-.817-1.253-1.819L12 8.821c.214-1.005 1.117-1.82 2.022-1.82" fill="#16315e"></path><path d="M21.174 7h6.478c.905 0 1.468.816 1.255 1.821l-3.015 14.342c-.213 1.002-1.119 1.819-2.024 1.819h-6.475c-.906 0-1.468-.817-1.255-1.819l3.015-14.342c.211-1.005 1.115-1.82 2.021-1.82" fill="#036862"></path><path d="M9.774 11.596c-.666.008-.863 0-.926-.016-.024.127-.473 2.424-.475 2.426-.096.464-.167.796-.406 1.01a.682.682 0 0 1-.478.184c-.295 0-.468-.163-.496-.47l-.006-.107.09-.625s.472-2.094.556-2.37a.22.22 0 0 0 .007-.032c-.918.01-1.08 0-1.092-.016a4.287 4.287 0 0 0-.029.152l-.482 2.36-.041.2-.08.654c0 .194.034.352.103.486.22.425.845.489 1.2.489.456 0 .884-.108 1.173-.304.502-.328.633-.842.75-1.298l.055-.235s.486-2.173.568-2.456c.004-.016.005-.024.009-.032zm1.654 1.754a1.18 1.18 0 0 0-.524.136c-.07.04-.136.085-.205.131l.062-.251-.034-.043c-.408.092-.5.104-.876.163l-.031.023a13.64 13.64 0 0 1-.245 1.493c-.062.291-.126.585-.19.876l.017.037a8.46 8.46 0 0 1 .839-.017l.027-.033c.043-.241.048-.298.143-.788.044-.232.136-.743.182-.924a.583.583 0 0 1 .246-.086c.188 0 .165.182.157.254a9.978 9.978 0 0 1-.146.86l-.047.22c-.033.162-.069.32-.101.481l.014.033c.38-.023.496-.023.821-.017l.038-.033c.06-.377.076-.478.18-1.028l.053-.253c.102-.495.153-.746.076-.95-.082-.229-.277-.284-.456-.284zm1.847.518c-.203.043-.332.072-.46.09-.127.023-.25.043-.446.073l-.016.016-.014.012c-.02.161-.035.3-.062.465-.022.17-.058.362-.115.638a2.718 2.718 0 0 1-.092.36c-.025.075-.052.147-.102.356l.012.019.01.018c.182-.01.301-.017.424-.018.123-.005.25 0 .447.001l.017-.016.019-.017c.028-.187.032-.238.05-.33.017-.098.046-.234.12-.597.034-.171.072-.341.108-.515.037-.174.076-.345.113-.515l-.006-.021zm.004-.698c-.184-.12-.506-.082-.723.084-.217.162-.242.393-.058.515.18.117.504.082.72-.086.215-.166.242-.394.061-.513zm1.111 2.782c.372 0 .753-.113 1.04-.45.22-.273.322-.68.357-.847.114-.555.025-.814-.086-.972-.17-.24-.47-.317-.78-.317-.187 0-.632.02-.98.375-.25.257-.365.604-.435.938-.07.34-.151.95.356 1.178.157.075.383.095.528.095zm-.029-1.248c.086-.42.187-.773.446-.773.202 0 .217.263.127.684-.016.094-.09.442-.19.59-.07.109-.153.175-.244.175-.027 0-.189 0-.191-.265a1.992 1.992 0 0 1 .052-.411zm2.356 1.194.029-.033c.04-.241.048-.298.139-.788.046-.232.14-.743.184-.924.084-.043.166-.086.247-.086.187 0 .164.182.157.254a9.065 9.065 0 0 1-.147.86l-.044.22c-.034.162-.071.32-.104.481l.014.033a8.12 8.12 0 0 1 .82-.017l.04-.033c.057-.377.073-.479.18-1.028l.051-.253c.102-.495.154-.746.078-.95-.083-.229-.28-.284-.457-.284a1.17 1.17 0 0 0-.524.136c-.068.04-.137.085-.204.131l.059-.251-.032-.043c-.407.092-.5.104-.877.163l-.029.023c-.045.402-.082.704-.245 1.494-.061.29-.125.584-.19.875l.018.037c.386-.023.502-.023.837-.017zm2.805.016.167-.898s.122-.565.13-.585c0 0 .037-.059.076-.082h.056c.53 0 1.129 0 1.598-.383.32-.262.538-.65.636-1.12.025-.116.043-.253.043-.39a.885.885 0 0 0-.127-.498c-.239-.371-.716-.378-1.266-.38l-.271.002c-.704.01-.987.007-1.103-.009l-.028.158-.252 1.297-.633 2.884c.615-.008.867-.008.974.004zm.467-2.3.267-1.288.009-.066.003-.05.108.011.566.054c.218.094.308.335.245.65-.057.288-.225.53-.442.646-.178.1-.396.108-.621.108h-.146zm1.67 1.114c-.07.335-.152.946.353 1.164a.902.902 0 0 0 .452.09c.155-.009.298-.095.431-.219l-.036.153.023.033c.363-.017.476-.017.87-.014l.035-.03c.058-.374.112-.738.261-1.454l.22-1.024-.011-.037c-.407.083-.515.1-.906.162l-.03.027-.012.102a.577.577 0 0 0-.284-.26c-.174-.076-.583.022-.934.376-.246.253-.365.599-.432.93zm.854.02c.087-.412.187-.761.446-.761.163 0 .25.167.232.453l-.047.23c-.026.123-.054.245-.081.366a.928.928 0 0 1-.096.214.432.432 0 0 1-.316.17c-.026 0-.186 0-.191-.261-.002-.13.023-.264.053-.41zm4.457-1.362-.032-.04c-.402.09-.474.105-.844.16l-.027.03-.004.02-.002-.007c-.275.703-.267.551-.49 1.104l-.003-.067-.056-1.2-.035-.04c-.421.09-.431.105-.82.16l-.03.03c-.005.015-.005.03-.008.048l.003.006c.049.275.037.214.086.648.022.213.053.428.075.638.039.353.06.526.107 1.064-.263.48-.325.662-.578 1.083l.002.005-.178.312c-.02.032-.039.055-.065.065a.245.245 0 0 1-.116.018h-.1l-.146.54.503.01a.613.613 0 0 0 .581-.36l.317-.6h-.005l.033-.043c.213-.508 1.832-3.584 1.832-3.584zm-5.31 7.098h-.214l.79-2.895h.262l.083-.298.008.331c-.01.205.136.387.518.357h.443l.152-.557h-.167c-.095 0-.14-.027-.134-.085L23.393 17h-.82v.002c-.264.006-1.055.028-1.215.075a1.386 1.386 0 0 0-.398.218l.08-.298h-.765l-.16.592-.8 2.939h-.156l-.152.553h1.525l-.05.185h.751l.05-.185h.21zm-.627-2.307a3.234 3.234 0 0 0-.35.152l.202-.74h.609l-.147.539s-.188.012-.314.05zm.012 1.057s-.191.027-.317.058a2.959 2.959 0 0 0-.357.173l.21-.77h.612zm-.341 1.256h-.61l.176-.65h.609zm1.47-1.795h.88l-.126.454h-.892l-.134.496h.78l-.59.921a.25.25 0 0 1-.12.11.326.326 0 0 1-.159.051h-.216l-.149.544h.566c.295 0 .468-.149.597-.343l.405-.615.087.624a.29.29 0 0 0 .146.212c.056.031.115.085.198.093.088.005.152.008.195.008h.278l.167-.608h-.11c-.063 0-.171-.012-.19-.034-.018-.026-.018-.067-.028-.13l-.088-.624h-.362l.159-.21h.89l.137-.495h-.824l.128-.454h.822l.152-.56h-2.449zm-7.433 1.922.206-.757h.844l.154-.563H15.1l.13-.466h.825l.153-.545h-2.066l-.15.545h.47l-.126.466h-.47l-.157.572h.47l-.274 1.002c-.037.132.017.183.052.244.035.06.07.1.15.123.084.02.14.032.217.032h.952l.17-.623-.422.064c-.082 0-.307-.01-.283-.094zm.097-3.624-.214.429a.492.492 0 0 1-.124.178c-.033.022-.097.032-.191.032h-.112l-.149.548h.37a.779.779 0 0 0 .381-.109c.07-.041.089-.018.143-.076l.125-.12h1.158l.154-.57h-.848l.148-.312zm1.71 3.635c-.02-.032-.006-.087.024-.203l.316-1.16h1.126c.164-.002.282-.004.36-.01a.688.688 0 0 0 .27-.102.532.532 0 0 0 .197-.2c.048-.075.127-.238.194-.488l.398-1.468-1.168.007s-.36.059-.518.124c-.16.072-.388.274-.388.274l.105-.402h-.721l-1.01 3.71a2.5 2.5 0 0 0-.066.312c-.002.068.077.135.128.186.06.05.15.042.236.05.09.008.218.012.395.012h.555l.17-.636-.497.052a.127.127 0 0 1-.107-.058zm.544-2.146h1.182l-.075.26c-.01.007-.036-.012-.156.004H17.02zm.237-.875h1.192l-.085.314s-.562-.006-.652.012c-.396.076-.628.31-.628.31zm.897 2.01a.142.142 0 0 1-.047.08c-.024.017-.063.023-.12.023h-.17l.01-.317h-.7l-.029 1.553c0 .112.01.177.083.23.074.064.302.072.61.072h.439l.158-.581-.382.023-.127.008a.147.147 0 0 1-.053-.036c-.016-.018-.043-.007-.039-.119l.003-.398.401-.019a.493.493 0 0 0 .388-.152c.076-.071.1-.153.129-.264l.067-.352h-.551z" fill="#fefefe"></path></g></g></svg>
                                            </div>
                                        </div>
                                        <div className='card-info p-3'>
                                            <div className='login-input text-start'>
                                                <input placeholder='Card number'
                                                    type='number'
                                                    className='lock'
                                                />
                                            </div>
                                            <div className='login-input text-start mt-2'>
                                                <input placeholder='Name on card'
                                                    type='text'
                                                />
                                            </div>
                                            <Row>
                                                <Col lg={6} md={12}>
                                                    <div className='login-input text-start mt-2'>
                                                        <input placeholder='Expiration date (MM/YY)'
                                                            type='text'
                                                        />
                                                    </div>
                                                </Col>
                                                <Col lg={6} md={12}>
                                                    <div className='login-input text-start mt-2'>
                                                        <input placeholder='Security code'
                                                            type='text'
                                                            className='alert'
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                </div>

                                <Button className='submit-btn w-100'>Continue to payment</Button>
                            </div>

                        </Col>
                        <Col lg={6} md={12} className='mt-5 mt-lg-0'>
                            <div className='cart-pricing-main '>
                                <div className='cart-product border-bottom-cos pb-3'>
                                    <div className='cart-product-box d-flex align-items-center justify-content-between'>
                                        <div className='d-flex align-items-center gap-3 gap-sm-4'>
                                            <div className='cart-product-img position-relative'>
                                                <img src='./img/cart.png' />
                                                <span>6</span>
                                            </div>
                                            <div className='cart-items-def '>
                                                <h5>Amazing earrings</h5>
                                                <span>8-3 silver white / 6.5</span>
                                            </div>
                                        </div>
                                        <div className='items-per'>
                                            <h5>$299,43</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className='cart-product mt-3'>
                                    <div className='cart-product-box d-flex align-items-center justify-content-between'>
                                        <div className='d-flex align-items-center gap-3 gap-sm-4'>
                                            <div className='cart-product-img position-relative'>
                                                <img src='./img/cart.png' />
                                                <span>6</span>
                                            </div>
                                            <div className='cart-items-def '>
                                                <h5>Amazing earrings</h5>
                                                <span>8-3 silver white / 6.5</span>
                                            </div>
                                        </div>
                                        <div className='items-per'>
                                            <h5>$299,43</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='login-input text-start mt-4'>
                                {/* <label>Coupon Code</label> */}
                                <div className='d-flex align-items-center gap-2'>
                                    <input className='mt-0' placeholder='Discount code' type='text' />
                                    <Button className='checkout px-4' style={{ width: "auto", whiteSpace: "nowrap" }}>Apply</Button>
                                </div>
                            </div>

                            <div className='total-list mt-4'>
                                <div className='d-flex align-items-center justify-content-between'>
                                    <label>Subtotal</label>
                                    <h5>$299,43</h5>
                                </div>
                                <div className='d-flex align-items-center justify-content-between mt-3'>
                                    <label>Shipping</label>
                                    <h5>Free</h5>
                                </div>
                                <div className='d-flex align-items-center justify-content-between mt-3 all-total'>
                                    <label>Total</label>
                                    <h5>USD <span>$299,43</span></h5>
                                </div>
                            </div>
                        </Col>
                    </Row>


                </div>
            </div>

            <Modal show={show} onHide={handleClose} className='add-address' centered>
                <Modal.Body>
                    <div className='position-relative'>
                        <Button className='close-modal-btn forgot-pass-close' onClick={handleClose}>
                            <MdOutlineClose />
                        </Button>
                        <h5>Shipping address</h5>
                        <Form>
                            <Row className='mt-2'>
                                <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>Ship to Address</label>
                                        <select name='country_id'
                                            className='select-arrow'>
                                            <option value="" >Select Country</option>
                                        </select>
                                    </div>
                                </Col>
                                <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>Full Name</label>
                                        <input placeholder='Full Name'
                                            type='text'
                                            name='fullname'
                                        />

                                    </div>
                                </Col>
                                <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>Phone Number</label>
                                        <input placeholder='Phone Number'
                                            type='number'
                                        />
                                    </div>
                                </Col>
                                <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>City</label>
                                        <input placeholder='City'
                                            type='text'
                                        />
                                    </div>
                                </Col>
                                <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>State</label>
                                        <select
                                            name='state_id' className='select-arrow'>
                                            <option value="" >Select State</option>

                                        </select>
                                    </div>
                                </Col>
                                <Col lg={6} md={6} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>Zip Code</label>
                                        <input placeholder='Zip Code'
                                            type='number'
                                        />
                                    </div>
                                </Col>
                                <Col lg={12} md={12} sm={12} className='mt-3'>
                                    <div className='login-input text-start'>
                                        <label>Address</label>
                                        <textarea className='w-100'
                                            placeholder='Enter Address'
                                            rows={5}></textarea>
                                    </div>
                                </Col>
                            </Row>
                            <button className='submit-btn w-100 mt-3' type='button' >Add Address</button>
                        </Form>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default CartNew
