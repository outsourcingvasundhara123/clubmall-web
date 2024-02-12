import React, { useRef, useState, useEffect, useContext } from 'react'
import { Button, Col, Row } from "react-bootstrap";
import Layout from "./layout/Layout";
import { PRODUCTDETAIL } from "../../../helper/endpoints";
import { useParams } from 'react-router-dom';
import { CartContext } from '../../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { getServerURL } from '../../../helper/envConfig';
import apiAdmin from '../../../helper/apiAdmin';
import { validate } from './AddProductSchima';

const EditProduct = () => {

  const { id } = useParams();
  const { getcartcount, handleShow, addcartLocal, addProductDetailsToLocal, handleDrawerShow, setMainLoder, generateDynamicLink, getCartData, activeImage, setActiveImage } = useContext(CartContext);
  const navigate = useNavigate();
  const [perActive, setPerActive] = useState('Individual');
  const serverURL = getServerURL();
  const [product, setProduct] = useState({})
  const [sizeActive, setSizeActive] = useState("")
  const [productColorActive, setProductColorActive] = useState();
  const [sucessSnackBarOpen, setSucessSnackBarOpen] = useState(false);
  const [warningSnackBarOpen, setWarningSnackBarOpen] = useState(false);
  const [Mymessage, setMyMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const player = useRef();
  const [colorProduct, setColorProduct] = useState()
  const [url, setUrl] = useState("");

  const uniqueColors = (colors) => {
    const unique = [];
    colors.forEach(color => {
      if (!unique.find(c => c.attrs[0].color === color.attrs[0].color)) {
        unique.push(color);
      }
    });
    return unique;
  }

  const getProductDetail = async () => {

    try {
      setMainLoder(true)
      const [productDetail] = await Promise.all([
        apiAdmin.get(`${serverURL + PRODUCTDETAIL + `?product_id=${id}`}`)
      ]);
      const productData = productDetail.data.data;
      setProduct(productData);
      setProductColorActive(productDetail.data.data.productList?.sku_attributes?.color[0]?.name && productDetail.data.data.productList?.sku_attributes?.color[0]?.name)
      setSizeActive(productData?.productList?.sku_details[0]?.attrs[0]?.size)
      setMainLoder(false)
      setUrl(productData.productImagePath)
      const uniqueColorDetails = uniqueColors(productData.productList.sku_details);
      const imageUrls = uniqueColorDetails.map(e => `${productData.productImagePath + productData?.productList?._id + "/" + e?.file_name}`);
      const mergedImages = imageUrls.map(url => ({
        thumbnail: url,
        original: url,
      }));
      setColorProduct(mergedImages)
    } catch (error) {
      setMainLoder(false)
      console.log(error);
    }
  };

  useEffect(() => {
    getProductDetail();
  }, [id]);


  return (
    <Layout>
      <div className="border-green">
        <div className="px-3 px-sm-4 mt-3 mt-sm-4 ">
          <Row className="align-items-end">
            <Col lg={12} md={12} sm={12}>
              <div className="fees-input mt-3">
                <label>Product Name</label>
                <input type="type" />
              </div>
            </Col>
            <Col lg={3} md={6} sm={12}>
              <div className="fees-input mt-3">
                <label>Individual Price</label>
                <input type="number"
                  name='name'
                  placeholder="Enter product name"
                />
              </div>
            </Col>
            <Col lg={3} md={6} sm={12}>
              <div className="fees-input mt-3">
                <label>Group Price</label>
                <input type="number"
                  placeholder="Enter product number"
                />
              </div>
            </Col>
            <Col lg={3} md={6} sm={12}>
              <div className="fees-input mt-3">
                <label>Category</label>
                <select>
                  <option>1</option>
                  <option>2</option>
                </select>
              </div>
            </Col>
            <Col lg={3} md={6} sm={12}>
              <div className="fees-input mt-3">
                <label>Sub Category</label>
                <select>
                  <option>1</option>
                  <option>2</option>
                </select>
              </div>
            </Col>
          </Row>
        </div>
        <div className="px-3 px-sm-4 pb-5 border-green-bottom">
          <Row className="align-items-end">
            <Col lg={12} md={12} sm={12}>
              <div className="select-img-input  mt-3">
                <label>Product Image</label>
                <div className="d-flex align-items-center gap-5 flex-wrap mt-4">
                  <div className="select-img-output">
                    <img
                      src="../../admin-img/user.jpg"
                      alt=""
                      className="output-file"
                    />
                    <input type="file" id="preview-img" className="d-none" />
                    <label className="choose-file-btn" htmlFor="preview-img">
                      <img src="../../admin-img/add.svg" alt="" />
                    </label>
                    <Button className="delete-preview-img">
                      <img
                        src="../../admin-img/profile/delete.svg"
                        alt=""
                        width="15px"
                      />
                    </Button>
                  </div>
                  <div className="select-img-output">
                    <img
                      src="../../admin-img/user.jpg"
                      alt=""
                      className="output-file"
                    />
                    <input type="file" id="preview-img" className="d-none" />
                    <label className="choose-file-btn" htmlFor="preview-img">
                      <img src="../../admin-img/add.svg" alt="" />
                    </label>
                    <Button className="delete-preview-img">
                      <img
                        src="../../admin-img/profile/delete.svg"
                        alt=""
                        width="15px"
                      />
                    </Button>
                  </div>
                  <div className="select-img-output">
                    <img
                      src="../../admin-img/user.jpg"
                      alt=""
                      className="output-file"
                    />
                    <input type="file" id="preview-img" className="d-none" />
                    <label className="choose-file-btn" htmlFor="preview-img">
                      <img src="../../admin-img/add.svg" alt="" />
                    </label>
                    <Button className="delete-preview-img">
                      <img
                        src="../../admin-img/profile/delete.svg"
                        alt=""
                        width="15px"
                      />
                    </Button>
                  </div>
                  <div className="select-img-output">
                    <img
                      src="../../admin-img/user.jpg"
                      alt=""
                      className="output-file"
                    />
                    <input type="file" id="preview-img" className="d-none" />
                    <label className="choose-file-btn" htmlFor="preview-img">
                      <img src="../../admin-img/add.svg" alt="" />
                    </label>
                    <Button className="delete-preview-img">
                      <img
                        src="../../admin-img/profile/delete.svg"
                        alt=""
                        width="15px"
                      />
                    </Button>
                  </div>
                  <div className="select-img-output">
                    <img
                      src="../../admin-img/user.jpg"
                      alt=""
                      className="output-file"
                    />
                    <input type="file" id="preview-img" className="d-none" />
                    <label className="choose-file-btn" htmlFor="preview-img">
                      <img src="../../admin-img/add.svg" alt="" />
                    </label>
                    <Button className="delete-preview-img">
                      <img
                        src="../../admin-img/profile/delete.svg"
                        alt=""
                        width="15px"
                      />
                    </Button>
                  </div>

                  <div className="select-img-output">
                    <img
                      src="../../admin-img/user.jpg"
                      alt=""
                      className="output-file"
                    />
                    <input type="file" id="preview-img" className="d-none" />
                    <label className="choose-file-btn" htmlFor="preview-img">
                      <img src="../../admin-img/add.svg" alt="" />
                    </label>
                    <Button className="delete-preview-img">
                      <img
                        src="../../admin-img/profile/delete.svg"
                        alt=""
                        width="15px"
                      />
                    </Button>
                  </div>
                  <div className="select-img-output">
                    <img
                      src="../../admin-img/user.jpg"
                      alt=""
                      className="output-file"
                    />
                    <input type="file" id="preview-img" className="d-none" />
                    <label className="choose-file-btn" htmlFor="preview-img">
                      <img src="../../admin-img/add.svg" alt="" />
                    </label>
                    <Button className="delete-preview-img">
                      <img
                        src="../../admin-img/profile/delete.svg"
                        alt=""
                        width="15px"
                      />
                    </Button>
                  </div>
                  <div className="select-img-output">
                    <img
                      src="../../admin-img/user.jpg"
                      alt=""
                      className="output-file"
                    />
                    <input type="file" id="preview-img" className="d-none" />
                    <label className="choose-file-btn" htmlFor="preview-img">
                      <img src="../../admin-img/add.svg" alt="" />
                    </label>
                    <Button className="delete-preview-img">
                      <img
                        src="../../admin-img/profile/delete.svg"
                        alt=""
                        width="15px"
                      />
                    </Button>
                  </div>
                  <div className="select-img-output">
                    <img
                      src="../../admin-img/user.jpg"
                      alt=""
                      className="output-file"
                    />
                    <input type="file" id="preview-img" className="d-none" />
                    <label className="choose-file-btn" htmlFor="preview-img">
                      <img src="../../admin-img/add.svg" alt="" />
                    </label>
                    <Button className="delete-preview-img">
                      <img
                        src="../../admin-img/profile/delete.svg"
                        alt=""
                        width="15px"
                      />
                    </Button>
                  </div>
                  <div className="select-img-output">
                    <img
                      src="../../admin-img/user.jpg"
                      alt=""
                      className="output-file"
                    />
                    <input type="file" id="preview-img" className="d-none" />
                    <label className="choose-file-btn" htmlFor="preview-img">
                      <img src="../../admin-img/add.svg" alt="" />
                    </label>
                    <Button className="delete-preview-img">
                      <img
                        src="../../admin-img/profile/delete.svg"
                        alt=""
                        width="15px"
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={12} md={12} sm={12}>
              <div className="fees-input mt-3">
                <label>Description</label>
                <textarea rows="5"></textarea>
              </div>
            </Col>
          </Row>
        </div>

        <div className="px-3 px-sm-4 pb-3 pb-sm-4 mt-3 mt-sm-4 ">
          <Row className="align-items-start">
            <Col lg={4} md={6} sm={12}>
              <div className="fees-input mt-3">
                <label>Size</label>
                <div className="d-flex align-items-center gap-3">
                  <input type="text" placeholder="Size" />
                  <Button className="add-items">
                    <img src="../../admin-img/add.svg" alt="" />
                  </Button>
                </div>
              </div>

              <div className="fees-input list-data mt-3">
                <div className="d-flex align-items-center gap-3">
                  <p>hello world</p>
                  <Button className="add-items">
                    <img src="../../admin-img/profile/delete.svg" alt="" />
                  </Button>
                </div>
              </div>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <div className="fees-input mt-3">
                <label>Material</label>
                <div className="d-flex align-items-center gap-3">
                  <input type="text" placeholder="Material" />
                  <Button className="add-items">
                    <img src="../../admin-img/add.svg" alt="" />
                  </Button>
                </div>
              </div>

              <div className="fees-input list-data mt-3">
                <div className="d-flex align-items-center gap-3">
                  <p>hello world</p>
                  <Button className="add-items">
                    <img src="../../admin-img/profile/delete.svg" alt="" />
                  </Button>
                </div>
              </div>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <div className="fees-input mt-3">
                <label>Color</label>
                <div className="d-flex align-items-center gap-3">
                  <div className="choose-color">
                    <input type="file" id="selectColor" />
                    <label htmlFor="selectColor">
                      <img src="../../admin-img/upload.png" alt="" width="17px" />
                    </label>
                  </div>
                  <input type="text" placeholder="Color" />
                  <Button className="add-items">
                    <img src="../../admin-img/add.svg" alt="" />
                  </Button>
                </div>
              </div>

              <div className="fees-input list-data mt-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="select-img-output resize">
                    <img
                      src="../../admin-img/user.jpg"
                      alt=""
                      className="output-file"
                    />
                    <Button className="delete-preview-img">
                      <img
                        src="../../admin-img/profile/delete.svg"
                        alt=""
                        width="12px"
                      />
                    </Button>
                  </div>
                  <p>hello world</p>
                  <Button className="add-items">
                    <img src="../../admin-img/profile/delete.svg" alt="" />
                  </Button>
                </div>
              </div>
            </Col>

            {/* <Col lg={4} md={6} sm={12} >

<div className="fees-input mt-3 d-flex gap-3">
  <label>Trending</label>
  <div className="d-flex align-items-center gap-3">
    <div className="status">
      <label className="switch">
        <input type="checkbox" />
        <span className="slider round"></span>
      </label>
    </div>
  </div>
</div>
</Col>
<Col lg={4} md={6} sm={12} >

<div className="fees-input mt-3 d-flex gap-3">
  <label>Trending</label>
  <div className="d-flex align-items-center gap-3">
    <div className="status">
      <label className="switch">
        <input type="checkbox" />
        <span className="slider round"></span>
      </label>
    </div>
  </div>
</div>
</Col>
<Col lg={4} md={6} sm={12} >

<div className="fees-input mt-3 d-flex gap-3">
  <label>Trending</label>
  <div className="d-flex align-items-center gap-3">
    <div className="status">
      <label className="switch">
        <input type="checkbox" />
        <span className="slider round"></span>
      </label>
    </div>
  </div>
</div>
</Col>
<Col lg={4} md={6} sm={12} >

<div className="fees-input mt-3 d-flex gap-3">
  <label>Trending</label>
  <div className="d-flex align-items-center gap-3">
    <div className="status">
      <label className="switch">
        <input type="checkbox" />
        <span className="slider round"></span>
      </label>
    </div>
  </div>
</div>
</Col>           
<Col lg={4} md={6} sm={12} >

<div className="fees-input mt-3 d-flex gap-3">
  <label>Trending</label>
  <div className="d-flex align-items-center gap-3">
    <div className="status">
      <label className="switch">
        <input type="checkbox" />
        <span className="slider round"></span>
      </label>
    </div>
  </div>
</div>
</Col>  
        <Col lg={4} md={6} sm={12} >

<div className="fees-input mt-3 d-flex gap-3">
  <label>Trending</label>
  <div className="d-flex align-items-center gap-3">
    <div className="status">
      <label className="switch">
        <input type="checkbox" />
        <span className="slider round"></span>
      </label>
    </div>
  </div>
</div>
</Col> */}

          </Row>
          <div className="d-flex align-items-center justify-content-end flex-wrap mt-3 gap-3 mt-5">
            <Button className="fixed-fee">Save</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditProduct;
