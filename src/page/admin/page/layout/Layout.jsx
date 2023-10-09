import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

const Layout = (props) => {

    const [toggle, setToggle] = useState();

    return (
        <>

            <Sidebar toggle={toggle} setToggle={setToggle} />

            <div className='layout-main'>
                <Header toggle={toggle} setToggle={setToggle} />
                <div className='p-3 p-sm-4'>
                    {props.children}
                </div>
            </div>

        </>
    )
}

export default Layout
