
import React, {  useContext } from 'react'
import {  Modal, NavLink } from 'react-bootstrap'
import { CartContext } from '../context/CartContext'

const InstallApp = (props) => {

    const { handleClose,show } = useContext(CartContext);

    return (
        <>
            <Modal show={show} onHide={handleClose} centered className='welcome-modal'>
                <Modal.Body>
                    <div className='text-center p-3 p-sm-4'>
                        <img src='../img/modal-logo.png' alt='' />
                        <h5 className='my-3'>Get the full experience on <br /> the app</h5>
                        <p>Follow you favorite vendor accounts,
                            explore new product and message the <br /> vendor</p>
                        <div className='d-flex align-items-center justify-content-center gap-2 mt-4 app-download'>
                            <NavLink href='https://play.google.com/store/apps/details?id=com.clubmall' target='_blank'>
                                <img src='../img/playstore.png' alt='' />
                            </NavLink>
                            <NavLink href="https://apps.apple.com/us/app/clubmall/id6444752184" target='_blank'>
                                <img src='../img/app.png' alt='' />
                            </NavLink>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

        </>
    )
}

export default InstallApp