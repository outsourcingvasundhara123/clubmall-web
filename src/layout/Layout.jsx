import React from 'react'
import Header from './Header'
import Footer from './Footer'

const Layout = (props) => {
    return (
        <>
            <div className='page-layout'>
                <div>
                    <Header />

                    <div className='mar-cos'>
                        {props.children}
                    </div>
                </div>

                <Footer />
            </div>
        </>
    )
}

export default Layout
