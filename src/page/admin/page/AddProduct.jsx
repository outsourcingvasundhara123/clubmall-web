import React, { useRef, Fragment, useState, useEffect, useContext } from 'react'
import { Button, Col, Row } from "react-bootstrap";
import Layout from "./layout/Layout";
import api from '../../../helper/apiAdmin'
import { getServerURL } from '../../../helper/envConfig'
import { useNavigate } from 'react-router-dom'
import { CartContext } from '../../../context/CartContext'
import { validate } from './AddProductSchima';
import secureLocalStorage from "react-secure-storage";
import { loginAdmin } from '../../../helper/authAdmin'
import { PRODUCTCATEGORY } from '../../../helper/endpoints';
import { product_data } from '../../../helper/constants';


const AddProduct = () => {     

  const { getcartcount, getwishlistcount, setMainLoder, itemShow, setItemShow, getCartData, searchKeyWord, setSearchKeyWord, getSearchedProduct, handelSearch, profileOption, setProfileOption, wishlistCount, cart, setCart } = useContext(CartContext);
   
  const initialValues = {
    name: "",
    // attributes: {},
    // sku_attributes: {},
    // sku_details: [],
    individual_price: "",
    group_price: "",
    product_images: Array(10).fill(undefined),
    product_category_keys: {},
    product_id: "",
    tax: 0,
    category: "",
    subcategory: "",
    attributes: {},
    // group_size: 0,
    // product_sizes: [],
    // product_colours: []
  };

  const [showPass, setShowPass] = useState();
  const [values, setValues] = useState(initialValues);
  const [category, setcategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [errors, setErrors] = useState({});
  const [Mymessage, setMyMessage] = useState("");
  const [submitCount, setSubmitCount] = useState(0);
  const serverURL = getServerURL();
  const [sucessSnackBarOpen, setSucessSnackBarOpen] = useState(false);
  const [warningSnackBarOpen, setWarningSnackBarOpen] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [Url, setUrl] = useState("");
  const [CateData, setCateData] = useState(product_data.FeaturedData);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [inputSize, setInputSize] = useState('');
  const [inputColor, setInputColor] = useState('');
  const [colorImage, setColorImage] = useState(null);
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [list, setList] = useState({});
  const player = useRef();
  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }
  const startAnimation = () => {
    if (player.current) {
      player.current.play(); // Check if player.current is not null before accessing play()
    }
  };

  const stopAnimation = () => {
    setLoading(false);
  };

  const handleAdd = () => {
    if (key && value) {
      setList(prevList => ({
        ...prevList,
        [key]: [value]
      }));
      // Clear input fields after adding
      setKey("");
      setValue("");
    }
    values.attributes = list
  }

  const handleRemove = (keyToRemove) => {
    setList(prevList => {
      const updatedList = { ...prevList };
      delete updatedList[keyToRemove];
      return updatedList;
    });
    values.attributes = list
  }

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    let newValue = type === "checkbox" ? checked : value;

    if (submitCount > 0) {
      const validationErrors = validate({ ...values, [name]: newValue });
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length === 0) {
        delete errors[name];
      }
    }

    setValues((prevValues) => ({
      ...prevValues,
      [name]: newValue,
    }));
  };

  const handlePhoto = (e) => {
    const index = parseInt(e.target.name.split('_')[2]); // Extracts index from name like 'product_image_0'
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (upload) {
        const updatedImages = [...values.product_images];
        updatedImages[index] = {
          file,
          preview: upload.target.result
        };
        setValues({ ...values, product_images: updatedImages });
      };
      reader.readAsDataURL(file);
    }

    if (submitCount > 0) {
      const validationErrors = validate({ ...values, [e.target.name]: e.target.files[0] });
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length === 0) {
        delete errors[e.target.name];
      }
    }

  };

  const handleDeleteImage = (index) => {
    const updatedImages = [...values.product_images];
    updatedImages[index] = undefined; // Clear the image at the given index
    setValues({ ...values, product_images: updatedImages });
  };

  const getCategory = async () => {
    startAnimation()
    try {
      const categoryResponse = await api.post(`${serverURL + PRODUCTCATEGORY}`, { action: "sub-category" })
      const categoryData = categoryResponse.data.data;
      setUrl(categoryResponse.data.data.productImagePath)
      // console.log(categoryResponse?.data.data?.productsCategoryList,"cat");
      // values.product_category_keys = {
      //   "product_category_one": categoryResponse?.data.data?.productsCategoryList[0]?.child[0].parent_id,
      //   "product_category_two": categoryResponse?.data.data?.productsCategoryList[0]?.child[0]._id,
      // }
      // values.category = categoryResponse?.data.data?.productsCategoryList[0]?.child[0].parent_id
      // values.subcategory = categoryResponse?.data.data?.productsCategoryList[0]?.child[0]._id
      setSubCategory(categoryResponse.data.data?.productsCategoryList[0]?.child)
      setcategory(categoryData);
      stopAnimation()
    } catch (error) {
      console.log(error);
      // errorResponse(error, setMyMessage);
    }
  };

  const handelCategorydata = (e) => {
    let data = category?.productsCategoryList.filter((s) => s._id === e.target.value)
    values.category = data[0]?.child[0]?.parent_id
    setSubCategory(data[0]?.child)
    values.subcategory = ""

    if (submitCount > 0) {
      const validationErrors = validate({ ...values, [e.target.name]: e.target.value });
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length === 0) {
        delete errors[e.target.name];
      }
    }

  }

  const handelSubCat = (e) => {
    let data = subCategory.filter((s) => s._id === e.target.value)

    setValues(prevValues => ({
      ...prevValues,
      subcategory: data[0]?._id,
      category: data[0]?.parent_id,
      product_category_keys: {
        "product_category_one": data[0]?.parent_id,
        "product_category_two": data[0]?._id,
      }
    }));

    if (submitCount > 0) {
      const validationErrors = validate({ ...values, [e.target.name]: e.target.value });
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length === 0) {
        delete errors[e.target.name];
      }
    }

  };

  const getImage = async (data) => {

    try {

      values.colors = colors
      values.sizes = sizes
      // Create FormData object
      const formData = new FormData();

      // Append product images to form data
      values.product_images.forEach((img, index) => {
        if (img && img.file) {
          formData.append(`product_images[${index}]`, img.file);
        }
      });

      // Append colors to form data
      colors.forEach((color, index) => {
        formData.append(`colors[${index}][name]`, color.name);
        if (color.image && color.image.file) {
          formData.append(`colors[${index}][image]`, color.image.file);
        }
      });
      sizes.forEach((size, index) => {
        formData.append(`product_sizes[${index}]`, size);
      });
      const [productResponse] = await Promise.all([
        api.postWithToken(`${serverURL}product-media/${data.id}`, formData),
      ]);

      if (productResponse.data.success) {

        setMyMessage(productResponse.data.message);
        setSucessSnackBarOpen(!sucessSnackBarOpen);
        setMainLoder(false)
        setTimeout(() => {
          navigate("/admin/product")
        }, 1000);

      } else if (productResponse.data.success === false) {
        setMainLoder(false)
        setMyMessage(productResponse.data.message);
        setWarningSnackBarOpen(!warningSnackBarOpen);
      }
    } catch (error) {
      console.log(error);
    };

  }

  function generateSkuId() {
    const timestamp = Date.now().toString().slice(-10);
    const randomDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return parseInt(timestamp + randomDigits, 7);
  }

  const handleSubmit = async (e) => {

    e.preventDefault();
    const updatedValues = { ...values };
    const validationErrors = validate(updatedValues);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0 && colors.length !== 0 && !isEmpty(list)) { 
      setMainLoder(true)
      values.colors = colors
      values.sizes = sizes
      const newProductId = { ["Product ID"]: [generateSkuId()] };
      const updatedList = { ...newProductId, ...list };
      setList(updatedList);
      values.attributes = updatedList

      try {
        const data = api.postWithToken(`${serverURL}product-create`, {
          product_category_keys: values.product_category_keys, description: values.description, group_price: values.group_price, individual_price: values.individual_price,
          name: values.name, product_category_keys: values.product_category_keys, product_sizes: values.sizes, tax: values.tax, product_id: updatedList["Product ID"]
          , attributes: updatedList
        })
        const responses = await Promise.all([data]);
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (responses[0].data.success == true) {
          await getImage(responses[0].data.data); // Fetch and store the data
        }
      } catch (error) {
        setMainLoder(false)
        // setWarningSnackBarOpen(!warningSnackBarOpen);
        console.error(error);
      }
    }
  };

  const addSize = () => {
    if (inputSize) {
      setSizes(prevSizes => [...prevSizes, inputSize]);
      setInputSize('');
    }
  };

  const addColor = () => {
    if (inputColor && colorImage) {
      setColors(prevColors => [...prevColors, { name: inputColor, image: colorImage }]);
      setInputColor('');
      setColorImage(null);
    }
  };


  const handleSizeChange = (e) => {
    setInputSize(e.target.value);
  };

  const handleColorChange = (e) => {
    setInputColor(e.target.value);
  };

  const handleColorImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (upload) {
        setColorImage({ file: file, preview: upload.target.result });
      };
      reader.readAsDataURL(file);
    }
  };


  const deleteSize = (indexToRemove) => {
    const newSizes = sizes.filter((_, index) => index !== indexToRemove);
    setSizes(newSizes);
  };

  const deleteColor = (indexToRemove) => {
    const newColors = colors.filter((_, index) => index !== indexToRemove);
    setColors(newColors);
  };

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <Layout>

      <div className="border-green">
        <div className="px-3 px-sm-4 mt-3 mt-sm-4 ">
          <Row className="align-items-end">
            <Col lg={12} md={12} sm={12}>
              <div className="fees-input mt-3">
                <label>Product Name*</label>
                <input type="type"
                  name="name"
                  onChange={handleChange}
                  placeholder="Enter product name"
                  value={values.name}
                />
                <div className='errorAdmin' >{errors?.name}</div>
              </div>
            </Col>
            <Col lg={3} md={6} sm={12}>
              <div className="fees-input mt-3">
                <label>Individual Price*</label>
                <input type="number"
                  name="individual_price"
                  value={values.individual_price}
                  onChange={handleChange}
                  placeholder="Enter product individual price"
                />
                <div className='errorAdmin' >{errors?.individual_price}</div>
              </div>
            </Col>
            <Col lg={3} md={6} sm={12}>
              <div className="fees-input mt-3">
                <label>Group Price*</label>
                <input type="number"
                  onChange={handleChange}
                  name="group_price"
                  placeholder="Enter product group price"
                />
                <div className='errorAdmin' >{errors?.group_price}</div>
              </div>
            </Col>
            <Col lg={3} md={6} sm={12}>
              <div className="fees-input mt-3">
                <label>Category*</label>
                <select value={values.category} name='category' onChange={handelCategorydata}>
                  <option value="" disabled selected>Select a Category</option> {/* Empty input field */}
                  {category && category?.productsCategoryList?.map((e, i) => {
                    return (
                      <option value={e._id} >
                        {e.name}
                      </option>
                    );
                  })}
                </select>
                <div className='errorAdmin' >{errors?.category}</div>
              </div>
            </Col>
            <Col lg={3} md={6} sm={12}>
              <div className="fees-input mt-3">
                <label>Sub Category*</label>
                <select value={values.subcategory} name='subcategory' onChange={handelSubCat} >
                  <option value="" disabled selected>Select a subCategory</option> {/* Empty input field */}
                  {subCategory && subCategory?.map((e, i) => {
                    return (
                      <option value={e._id} >{e.name}</option>
                    )
                  })
                  }
                </select>
                <div className='errorAdmin' >{errors?.subcategory}</div>
              </div>
            </Col>
          </Row>
        </div>
        <div className="px-3 px-sm-4 pb-5 border-green-bottom">
          <Row className="align-items-end">
            <Col lg={12} md={12} sm={12}>
              <div className="select-img-input  mt-3">
                <label>Product Image*</label>
                <div className="d-flex align-items-center gap-5 flex-wrap mt-4">
                  {Array(10).fill(null).map((_, index) => (
                    <div className="select-img-output" key={index}>
                      <img
                        src={values.product_images[index]?.preview || "../admin-img/user.jpg"}
                        alt=""
                        className="output-file"
                      />
                      <input
                        type="file"
                        id={`preview-img-${index}`}
                        name={`product_image_${index}`}
                        onChange={handlePhoto}
                        className="d-none"
                        accept="image/*"
                      />
                      <label className="choose-file-btn" htmlFor={`preview-img-${index}`}>
                        <img src="../admin-img/add.svg" alt="" />
                      </label>
                      <Button className="delete-preview-img"
                        onClick={() => handleDeleteImage(index)}
                      >
                        <img
                          src="../admin-img/profile/delete.svg"
                          alt=""
                          width="15px"
                        />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className='errorAdmin' >{errors?.product_images}</div>
              </div>
            </Col>

            <div className="fees-input mt-3">
              <label>Attribute*</label>

              <Row className="align-items-start">

                <Col lg={6} md={6} sm={12}>
                  <input
                    placeholder="Enter Key"
                    value={key}
                    onChange={e => setKey(e.target.value)}
                  />
                </Col>
                <Col lg={6} md={6} sm={12}>
                  <div className='d-flex gap-3' >
                    <input
                      placeholder="Enter Value"
                      value={value}
                      onChange={e => setValue(e.target.value)}
                    />
                    <Button className="add-items" onClick={handleAdd}>
                      <img src="../admin-img/add.svg" alt="" />
                    </Button>

                  </div>
                </Col>

                <ul>
                  {Object.entries(list).map(([k, v]) => (
                    <div className="fees-input list-data mt-3" key={k}>
                      <div className="d-flex align-items-center gap-3">
                        <p> {k}: {v}</p>
                        <Button className="add-items" onClick={() => handleRemove(k)}>
                          <img src="../admin-img/profile/delete.svg" alt="" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </ul>

              </Row>

              <div className='errorAdmin' >{isEmpty(list) && submitCount > 0 && "Attribute is require "}</div>
            </div>
          </Row>
        </div>

        <div className="px-3 px-sm-4 pb-3 pb-sm-4 mt-3 mt-sm-4 ">
          <Row className="align-items-start">
            <Col lg={6} md={6} sm={12}>
              <div className="fees-input mt-3">
                <label>Size</label>
                <div className="d-flex align-items-center gap-3">
                  <input type="text" placeholder="Enter product size" value={inputSize} onChange={handleSizeChange} />
                  <Button className="add-items" onClick={addSize}>
                    <img src="../admin-img/add.svg" alt="" />
                  </Button>
                </div>
              </div>

              {sizes.map((size, index) => (
                <div className="fees-input list-data mt-3" key={index}>
                  <div className="d-flex align-items-center gap-3">
                    <p>{size}</p>
                    <Button className="add-items" onClick={() => deleteSize(index)}>
                      <img src="../admin-img/profile/delete.svg" alt="" />
                    </Button>
                  </div>
                </div>
              ))}

            </Col>

            <Col lg={6} md={6} sm={12}>
              <div className="fees-input mt-3">
                <label>Color*</label>
                <div className="d-flex align-items-center gap-3">
                  <div className="choose-color">
                    <input type="file" id="selectColor" onChange={handleColorImageChange} />
                    <label htmlFor="selectColor">
                      <img src={colorImage?.preview || "../admin-img/upload.png"} alt="" width="17px" />
                    </label>
                  </div>
                  <input type="text" placeholder="Enter product  color" value={inputColor} onChange={handleColorChange} />
                  <Button className="add-items" onClick={addColor}>
                    <img src="../admin-img/add.svg" alt="" />
                  </Button>
                </div>
              </div>

              {colors.map((color, index) => (
                <div className="fees-input list-data mt-3" key={index}>
                  <div className="d-flex align-items-center gap-3">
                    <div className="select-img-output resize">
                      <img src={color.image.preview} alt="" className="output-file" />
                    </div>
                    <p>{color.name}</p>
                    <Button className="add-items" onClick={() => deleteColor(index)}>
                      <img src="../admin-img/profile/delete.svg" alt="" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className='errorAdmin' >{colors.length == 0 && submitCount > 0 && "color is required"}</div>

            </Col>

          </Row>

          {/* <Row className="align-items-start row">
            <Col lg={6} md={6} sm={12} >

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

              <div className="fees-input mt-3 d-flex gap-3">
                <label>Daily Deal</label>
                <div className="d-flex align-items-center gap-3">
                  <div className="status">
                    <label className="switch">
                      <input type="checkbox" />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="fees-input mt-3 d-flex gap-3">
                <label>Featured</label>
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

            <Col lg={6} md={6} sm={12} >

              <div className="fees-input mt-3 d-flex gap-3">
                <label>Flash Sale</label>
                <div className="d-flex align-items-center gap-3">
                  <div className="status">
                    <label className="switch">
                      <input type="checkbox" />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="fees-input mt-3 d-flex gap-3">
                <label>Recommended</label>
                <div className="d-flex align-items-center gap-3">
                  <div className="status">
                    <label className="switch">
                      <input type="checkbox" />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="fees-input mt-3 d-flex gap-3">
                <label>Super Flash Sale</label>
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

          </Row> */}

          <div className="d-flex align-items-center justify-content-end flex-wrap mt-3 gap-3 mt-5">
            <Button className="fixed-fee" type="button"
              onClick={(e) => (setSubmitCount(1), handleSubmit(e))} >Add</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddProduct;
