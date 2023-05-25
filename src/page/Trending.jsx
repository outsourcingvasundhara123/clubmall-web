import React, { useState } from 'react'
import Layout from '../layout/Layout'
import { Button } from 'react-bootstrap'
import { MdKeyboardDoubleArrowRight } from "react-icons/md"

import { data } from "../page/Data"
import ProCard from '../components/ProCard'

const Trending = () => {

    const [active, setActive] = useState("1");

    const handleClick = (event) => {
        setActive(event.target.id);
    }

    return (
        <Layout>

            <section className='explore'>
                <div className='container-cos'>
                    <div className='btns mt-5'>
                        <Button className={active === "1" ? "active" : undefined} id={"1"} onClick={handleClick}>All</Button>
                        <Button className={active === "2" ? "active" : undefined} id={"2"} onClick={handleClick}>Today</Button>
                        <Button className={active === "3" ? "active" : undefined} id={"3"} onClick={handleClick}>Yesterday</Button>
                        <Button className={active === "4" ? "active" : undefined} id={"4"} onClick={handleClick}>1 month ago</Button>
                        <Button className={active === "5" ? "active" : undefined} id={"5"} onClick={handleClick}>10 Month ago</Button>
                        <Button className={active === "6" ? "active" : undefined} id={"6"} onClick={handleClick}>1 year ago</Button>
                    </div>

                    <div className='mb-0 mt-4 explore-main'>
                        {
                            data.map((e) => {
                                return (
                                    <ProCard
                                        img={e.img}
                                        name={e.name}
                                        per={e.per}
                                        per2={e.per2}
                                        sold={e.sold}
                                        secper={e.secper}
                                        off={e.off}
                                    />
                                )
                            })
                        }
                        <div className='w-100 d-flex justify-content-center'>
                            <Button className='shop-btn'>View More <MdKeyboardDoubleArrowRight /></Button>
                        </div>
                    </div>
                </div>
            </section>

        </Layout>
    )
}

export default Trending
