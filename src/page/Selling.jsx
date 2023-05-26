import React, { useRef, useState, useEffect } from 'react'
import Layout from '../layout/Layout'
import { MdKeyboardDoubleArrowRight } from "react-icons/md"
import { Button, Col, Row, Tab, Tabs } from 'react-bootstrap'
import { data } from "../page/Data"
import ProCard from '../components/ProCard'
import { useNavigate } from 'react-router-dom'
import api from "../helper/api";
import { getServerURL } from '../helper/envConfig';
import { PRODUCTCATEGORY, PRODUCTList } from "../helper/endpoints";
import CategoryList from './CategoryList';
import SaleCard from '../components/SaleCard'


const Selling = () => {

    const navigate = useNavigate();
    const [category, setcategory] = useState([]);
    const [womanProductList, setWomanProductList] = useState([]);
    const [manProductList, setManProductList] = useState([]);
    const [kidsProductList, setkidsProductList] = useState([]);
    const [womanpage, setWomanPage] = useState(1);
    const [manpage, setManPage] = useState(1);
    const [kidspage, setKidPage] = useState(1);



    const serverURL = getServerURL();



    const getCategory = async () => {
        try {
            const [categoryResponse, womenCategory, kidCategory, menCategory] = await Promise.all([
                api.post(`${serverURL + PRODUCTCATEGORY}`),
                api.post(`${serverURL + PRODUCTList}`, {
                    product_list_type: "by-categories",
                    product_category_one_id: "646b551364bc3ff6c805c0f7",
                    product_category_two_id: "646b74cc64bc3ff6c805c437",
                    page: womanpage
                }),
                api.post(`${serverURL + PRODUCTList}`, {
                    product_list_type: "by-categories",
                    product_category_one_id: "646b3ff09d6497250b8f17d4",
                    product_category_two_id: "646bf84e64bc3ff6c805c8ae",
                    page: kidspage
                }),
                api.post(`${serverURL + PRODUCTList}`, {
                    product_list_type: "by-categories",
                    product_category_one_id: "646b5b9464bc3ff6c805c282",
                    product_category_two_id: "646c241564bc3ff6c805ca24",
                    page: manpage
                })
            ]);

            const categoryData = categoryResponse.data.data;
            const womanproductData = womenCategory.data.data;
            const manproductData = menCategory.data.data;
            const kidsproductData = kidCategory.data.data

            setcategory(categoryData);
            setWomanProductList(womanproductData);
            setManProductList(manproductData);
            setkidsProductList(kidsproductData);
            

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCategory();
    }, [womanpage, manpage, kidspage]);



    return (

        <Layout>
            <section className='hero position-relative selling-banner pointer' onClick={() => navigate("/categories")}>
                <div className='hero-text'>
                    <h1>Hop Into <br /> Hot Selling</h1>
                </div>
            </section>

            <section className='shop-categories'>
                <div className='container-cos'>
                    <div className='title w-100 text-center'>
                        <h2><span>S</span>HOP BY CATEGORY </h2>
                    </div>
                    <div className='cate-main d-flex align-items-center justify-content-center gap-5 flex-wrap mt-5'>

                        {
                            category.productsCategory && category.productsCategory?.slice(0, 5).map((e) => {
                                return (
                                    <div className='cate-box text-center'>
                                        <img src={category.productsCategoryIconPath + e.icon} alt='' width="100%" />
                                        <h5 className='mt-4'>{e.name}</h5>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </section>

            <section className='basket'>
                <div className='container-cos'>
                    <div className='title w-100 text-center'>
                        <h2><span>B</span>ASKET STUFFERS FOR EVERTONE FROM $0.39</h2>
                    </div>
                    <Row className='mt-5'>

                        {
                            category.productsCategory && category.productsCategory?.slice(5, 9).map((e) => {
                                return (

                                    <Col lg={3} md={6} sm={12}>
                                        <div className='basket-box'>
                                            <h5>{e.name}</h5>
                                            <img src={category.productsCategoryIconPath + e.icon} alt='' width="80%" className='my-4' />
                                            <div className='d-flex justify-content-center'>
                                                <Button className='shop-btn' onClick={() => navigate("/categories")}>Shop Now <MdKeyboardDoubleArrowRight /></Button>
                                            </div>
                                        </div>
                                    </Col>
                                )
                            })
                        }

                    </Row>
                </div>
            </section>


            <section className='tabs-cos'>
                <div className='container-cos'>
                    <div className='title w-100 text-center'>
                        <h2><span>C</span>ELEBRATE IN FRESH STYLES </h2>
                    </div>
                    <div className='tabs-content mt-5'>
                        <Tabs
                            defaultActiveKey="Women"
                            id="fill-tab-example"
                            className="mb-3"
                            fill

                        >
                            <Tab eventKey="Women" title="Women">
                                <div className='mb-0 mt-4 explore-main'>
                                    {
                                        womanProductList.productListArrObj && womanProductList.productListArrObj.map((e) => {
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
                                                    path={womanProductList?.productImagePath && womanProductList.productImagePath}
                                                />
                                            )
                                        })
                                    }
                                </div>
                                <div className='w-100 d-flex justify-content-center'>
                                    <Button className='shop-btn' onClick={() => setWomanPage(womanpage + 1)} >View More (999+)  <MdKeyboardDoubleArrowRight /></Button>
                                </div>
                            </Tab>
                            <Tab eventKey="Men" title="Men">


                                <div className='mb-0 mt-4 explore-main'>

                                    {
                                        manProductList.productListArrObj && manProductList.productListArrObj.map((e) => {
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
                                                    path={manProductList?.productImagePath && manProductList.productImagePath}
                                                />
                                            )
                                        })
                                    }

                                </div>
                                <div className='w-100 d-flex justify-content-center'>
                                    <Button className='shop-btn' onClick={() => setManPage(manpage + 1)}>View More (999+)  <MdKeyboardDoubleArrowRight /></Button>

                                </div>
                            </Tab>
                            <Tab eventKey="Kids & Baby" title="Kids & Baby">
                                <div className='mb-0 mt-4 explore-main'>
                                    {
                                        kidsProductList.productListArrObj && kidsProductList.productListArrObj.map((e) => {
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
                                                    path={kidsProductList?.productImagePath && kidsProductList.productImagePath}
                                                />
                                            )
                                        })
                                    }
                                </div>
                                <div className='w-100 d-flex justify-content-center'>
                                    <Button className='shop-btn' onClick={() => setKidPage(kidspage + 1)} >View More (999+)  <MdKeyboardDoubleArrowRight /></Button>
                                </div>
                            </Tab>
                        </Tabs>

                    </div>
                </div>
            </section>

            <section className='get-set'>
                <div className='container-cos'>
                    <div className='title w-100 text-center'>
                        <h2><span>G</span>ET SET TO HOST PRODUCT</h2>
                    </div>
                    <Row className='mt-5'>
                        <Col lg={6} md={12} sm={12}>
                            <div className='get-box'>
                                <img src='./img/selling/img7.png' alt='' />
                                <div className='per-box-get'>
                                    <h5>Set the table from <b>$0.49</b></h5>
                                    <Button className='shop-btn mt-0' onClick={() => navigate("/categories")}>Shop Now <MdKeyboardDoubleArrowRight /></Button>
                                </div>
                            </div>
                        </Col>
                        <Col lg={6} md={12} sm={12} className='mt-3 mt-lg-0'>
                            <div className='get-box'>
                                <img src='./img/selling/img8.png' alt='' />
                                <div className='per-box-get'>
                                    <h5>Dinner prep from <b>$0.19</b></h5>
                                    <Button className='shop-btn mt-0' onClick={() => navigate("/categories")}>Shop Now <MdKeyboardDoubleArrowRight /></Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </section>

            <section className='get-set hot'>
                <div className='container-cos'>
                    <div className='title w-100 text-center'>
                        <h2><span>H</span>OT DEALS</h2>
                    </div>
                    <Row className='mt-5'>
                        <Col lg={12} md={12} sm={12}>
                            <div className='get-box hot-box position-relative'>
                                <img src='./img/selling/img9.png' alt='' />
                                <div className='hot-text'>
                                    <h5>TRENDING <br /> FOR DEALS</h5>
                                    <Button className='shop-btn mt-3' onClick={() => navigate("/categories")}>Shop Now <MdKeyboardDoubleArrowRight /></Button>
                                </div>
                            </div>
                        </Col>
                        <Col lg={6} md={12} sm={12} className='mt-4'>
                            <div className='get-box hot-sub-box position-relative'>
                                <img src='./img/selling/img10.png' alt='' />
                                <div className='hot-text'>
                                    <h5>2<span>FOR</span> $0.98</h5>
                                    <Button className='shop-btn mt-3' onClick={() => navigate("/categories")}>Save Big <MdKeyboardDoubleArrowRight /></Button>
                                </div>
                            </div>
                        </Col>
                        <Col lg={6} md={12} sm={12} className='mt-4'>
                            <div className='get-box hot-sub-box position-relative'>
                                <img src='./img/selling/img11.png' alt='' />
                                <div className='hot-text'>
                                    <div className='d-flex align-items-center'>
                                        <h5 className='white-text'><span>ALL</span> 50-90</h5>
                                        <p>% <br /> OFF</p>
                                    </div>
                                    <Button className='shop-btn mt-3' onClick={() => navigate("/categories")}>Save Big <MdKeyboardDoubleArrowRight /></Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </section>

            <section className='explore'>
                <div className='container-cos'>
                    <div className='title w-100 text-center'>
                        <h2><span>F</span>AVORITES FOR YOU</h2>
                    </div>
                    <div className='mb-0 mt-4 explore-main'>
                        {
                            data.slice(0, 10).map((e) => {
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
                            <Button className='shop-btn'>View More (999+ items) <MdKeyboardDoubleArrowRight /></Button>
                        </div>
                    </div>
                </div>
            </section>

            <section className='explore'>
                <div className='container-cos'>
                    <div className='title w-100 text-center'>
                        <h2><span>E</span>XPLORE YOUR INTERESTS</h2>
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

export default Selling
