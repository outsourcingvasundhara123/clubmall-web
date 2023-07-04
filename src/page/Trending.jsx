import React, { useRef, useState, useEffect } from 'react'
import Layout from '../layout/Layout'
import { Button } from 'react-bootstrap'
import { MdKeyboardDoubleArrowRight } from "react-icons/md"
import ProCard from '../components/ProCard'
import { PRODUCTList } from "../helper/endpoints";
import api from "../helper/api";
import { getServerURL } from '../helper/envConfig';
import Loader from '../components/Loader';
import { handelCategorydata } from '../helper/constants'
const Trending = () => {

    const [active, setActive] = useState("1");

    const handleClick = (event) => {
        setActive(event.target.id);
    }

    const [postList, setPostList] = useState([]);
    const serverURL = getServerURL();
    const [page, setPage] = useState(1);
    const [url, setURL] = useState("");
    const [loading, setLoading] = useState(true);
    const [viewMoreLodr, setViewmoreLoder] = useState(false);
    const player = useRef();

    const startAnimation = () => {
        if (player.current) {
            player.current.play(); // Check if player.current is not null before accessing play()
        }
    };
    const stopAnimation = () => {
        setLoading(false);
    };

    const getTrendingProduct = async () => {
        try {
            startAnimation()
            const [postListResponse] = await Promise.all([
                api.post(`${serverURL + PRODUCTList}`, { "product_list_type": "trending-product", 
                page: page
            }),
            ]);
            const postsData = postListResponse.data.data;
            // console.log(postsData,"postsData");
            const updatedProductList = [...postList, ...postsData.productListArrObj]
            .filter((product, index, self) => self.findIndex(p => p._id === product._id) === index);
            setPostList(updatedProductList);
            // console.log(postsData,"postsData");
            setURL(postsData.productImagePath)
            setViewmoreLoder(false)
            stopAnimation()
        } catch (error) {
            console.log(error);
        }
    };

    console.log(postList,"postList");

    useEffect(() => {
        getTrendingProduct();
    }, [page]);

    return (
        <>
            {
                loading ? <Loader startAnimation={startAnimation} stopAnimation={stopAnimation} player={player} /> : (
                    <>
                        <section className='explore mar-bot-20'>
                            <div className='container-cos'>
                                {/* <div className='btns mt-5'>
                                    <Button className={active === "1" ? "active" : undefined} id={"1"} onClick={handleClick}>All</Button>
                                    <Button className={active === "2" ? "active" : undefined} id={"2"} onClick={handleClick}>Today</Button>
                                    <Button className={active === "3" ? "active" : undefined} id={"3"} onClick={handleClick}>Yesterday</Button>
                                    <Button className={active === "4" ? "active" : undefined} id={"4"} onClick={handleClick}>1 month ago</Button>
                                    <Button className={active === "5" ? "active" : undefined} id={"5"} onClick={handleClick}>10 Month ago</Button>
                                    <Button className={active === "6" ? "active" : undefined} id={"6"} onClick={handleClick}>1 year ago</Button>
                                </div> */}

                                <div className='mb-0 mt-4 explore-main mar-top-0'>
                                    {
                                        postList && postList?.map((e) => {
                                            return (
                                                <ProCard
                                                    id={e._id}
                                                    img={e.product_images[0]?.file_name}
                                                    name={e.name}
                                                    group_price={e.group_price}
                                                    individual_price={e.individual_price}
                                                    sold={e.total_order}
                                                    secper={e.secper}
                                                    off={e.discount_percentage}
                                                    path={url && url}
                                                    color={e.sku_attributes.color}
                                                    colorUrl = {e.sku_details}
                                                    // is_wishList={e.wishList && e.wishList}
                                                />
                                            )
                                        })
                                    }
                                    <div className='w-100 d-flex justify-content-center'>
                                        <Button className='shop-btn btn-cos-mobile' onClick={() => (setPage(page + 1) , setViewmoreLoder(true)) } >{viewMoreLodr ? "Loding..." : "View More"} <MdKeyboardDoubleArrowRight /></Button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </>
                )}
        </>
    )
}

export default Trending
