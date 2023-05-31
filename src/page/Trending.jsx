import React, { useRef, useState, useEffect } from 'react'
import Layout from '../layout/Layout'
import { Button } from 'react-bootstrap'
import { MdKeyboardDoubleArrowRight } from "react-icons/md"
import { data } from "../page/Data"
import ProCard from '../components/ProCard'
import { PRODUCTList } from "../helper/endpoints";
import { useNavigate } from 'react-router-dom'
import api from "../helper/api";
import { getServerURL } from '../helper/envConfig';
import Loader from '../components/Loader';

const Trending = () => {

    const [active, setActive] = useState("1");

    const handleClick = (event) => {
        setActive(event.target.id);
    }

    const [postList, setPostList] = useState([]);
    const serverURL = getServerURL();
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const player = useRef();
    const startAnimation = () => {
        if (player.current) {
          player.current.play(); // Check if player.current is not null before accessing play()
        }
      };
    const stopAnimation = () => {
        setLoading(false);
    };

    const getCategory = async () => {
        startAnimation()
        try {
            const [postListResponse] = await Promise.all([
            api.post(`${serverURL + PRODUCTList}`, { "product_list_type": "trending-product" }),
            ]);

            const postsData = postListResponse.data.data;
            setPostList(postsData);
            stopAnimation()
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCategory();
    }, []);


    return (
        <Layout>
{
loading ?  <Loader startAnimation={startAnimation} stopAnimation={stopAnimation} player={player} /> :(
    <>
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
                                postList.productListArrObj?.map((e) => {
                                    return (
                                            <ProCard
                                                id={e._id}
                                                img={e.product_images[0].file_name}
                                                name={e.name}
                                                group_price={e.group_price}
                                                individual_price={e.individual_price}
                                                sold={e.total_order}
                                                secper={e.secper}
                                                off={e.discount_percentage}
                                                path={postList?.productImagePath && postList.productImagePath}
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
            </>         
)}
        </Layout>
    )
}

export default Trending
