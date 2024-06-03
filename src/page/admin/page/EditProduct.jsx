import React, { useRef, Fragment, useState, useEffect, useContext } from 'react';
import { Button, Col, Row } from "react-bootstrap";
import Layout from "./layout/Layout";
import api from '../../../helper/apiAdmin';
import { getServerURL } from '../../../helper/envConfig';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../../context/CartContext';
import { validate } from './EditProductSchema';
import { PRODUCTCATEGORY, PRODUCTDETAIL } from '../../../helper/endpoints';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CustomUploadAdapter from './CustomUploadAdapter';
import { useParams } from 'react-router-dom';
import { Is_Login } from '../../../helper/IsLogin';
import SucessSnackBar from "../../../components/SnackBar";
import delete_product from '../../admin/page/assets/img/delete.svg';
const EditProduct = () => {
  const { setMainLoder } = useContext(CartContext);
  const [values, setValues] = useState({
    name: "",
    total_order: "",
    individual_price: "",
    group_price: "",
    competitors_price: "",
    product_category_keys: {
      product_category_one: {
        name: "",
        _id: ""
      },
      product_category_two: {
        name: "",
        _id: ""
      },
    },
    product_id: "",
    tax: 0,
    category: "",
    subcategory: "",
    description: "",
    content: "",
    size_chartInInch: { title: "", description: "" },
    size_chartIncm: { title: "", description: "" },

  });

  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitCount, setSubmitCount] = useState(0);
  const serverURL = getServerURL();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [Url, setUrl] = useState("");
  const [states, setStates] = useState({});
  const player = useRef();
  const { id } = useParams();
  const product_id = id;
  const isLoggedIn = Is_Login();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState('');
  const [columnName, setColumnName] = useState('');
  const [newRowName, setNewRowName] = useState('');
  const [inrows, setInRows] = useState([]);
  const [selectedInRow, setSelectedInRow] = useState('');
  const [IncolumnName, setInColumnName] = useState('');
  const [InnewRowName, setInNewRowName] = useState('');
  const addRow = () => {
    if (newRowName.trim() !== '') {
      setValues(prevState => ({
        ...prevState,
        size_chartInInch: {
          ...prevState.size_chartInInch,
          row_name: [...prevState.size_chartInInch.row_name, { name: newRowName }],
        },
      }));
      if (newRowName.trim() !== '') {
        setRows([...rows, { name: newRowName, columns: [] }]);
      }
      setNewRowName('');
    }
  };
  const addInRow = () => {
    if (InnewRowName.trim() !== '') {
      setValues(prevState => ({
        ...prevState,
        size_chartIncm: {
          ...prevState.size_chartIncm,
          row_name: [...prevState.size_chartIncm.row_name, { name: InnewRowName }],
        },
      }));
      if (InnewRowName.trim() !== '') {
        setInRows([...inrows, { name: InnewRowName, columns: [] }]);
      }
      setInNewRowName('');
    }
  };
  const addColumn = () => {

    if (selectedRow !== '' && columnName.trim() !== '') {
      const updatedRows = rows.map(row => {
        if (row.name === selectedRow) {
          row.columns.push(columnName);
        }

        return row;
      });

      setValues(prevState => ({
        ...prevState,
        size_chartInInch: {
          ...prevState.size_chartInInch,
          columns: [...prevState.size_chartInInch.columns, { name: columnName, row_name: selectedRow }],
        },
      }));

      setRows(updatedRows);
      setColumnName('');
    }
  };
  const addInColumn = () => {

    if (selectedInRow !== '' && IncolumnName.trim() !== '') {
      const updatedRows = inrows.map(row => {
        if (row.name === selectedInRow) {
          row.columns.push(IncolumnName);
        }

        return row;
      });

      setValues(prevState => ({
        ...prevState,
        size_chartIncm: {
          ...prevState.size_chartIncm,
          columns: [...prevState.size_chartIncm.columns, { name: IncolumnName, row_name: selectedInRow }],
        },
      }));

      setInRows(updatedRows);
      setInColumnName('');
    }
  };
  const deleteRow = (rowName) => {
    const updatedRows = rows.filter(row => row.name !== rowName);
    setRows(updatedRows);
    setValues(prevState => {
      const updatedRowNames = prevState.size_chartInInch.row_name.filter(row => row.name !== rowName);
      const updatedColumns = prevState.size_chartInInch.columns.filter(column => column.row_name !== rowName);
      return {
        ...prevState,
        size_chartInInch: {
          ...prevState.size_chartInInch,
          row_name: updatedRowNames,
          columns: updatedColumns,
        },
      };
    });
  };
  const deleteInRow = (rowName) => {
    const updatedRows = inrows.filter(row => row.name !== rowName);
    setInRows(updatedRows);
    setValues(prevState => {
      const updatedRowNames = prevState.size_chartIncm.row_name.filter(row => row.name !== rowName);
      const updatedColumns = prevState.size_chartIncm.columns.filter(column => column.row_name !== rowName);
      return {
        ...prevState,
        size_chartIncm: {
          ...prevState.size_chartIncm,
          row_name: updatedRowNames,
          columns: updatedColumns,
        },
      };
    });
  };
  const startAnimation = () => {
    if (player.current) {
      player.current.play();
    }
  };

  const stopAnimation = () => {
    setLoading(false);
  };
  const getProductDetail = async () => {
    startAnimation();
    try {
      const apiTyp = isLoggedIn ? api.getWithToken : api.get;
      if (product_id && product_id !== undefined) {
        const productDetail = await apiTyp(`${serverURL + PRODUCTDETAIL + `?product_id=${product_id}`}`);
        const productData = productDetail.data.data.productList;

        // Extract rows and columns from size_chart
        const sizeChart = productData.size_chartInInch;
        const sizeChartInCM = productData.size_chartIncm;

        const newRows = sizeChart.row_name.map(row => ({
          name: row.name,
          columns: sizeChart.columns.filter(col => col.row_name === row.name).map(col => col.name),
        }));
        const newInRows = sizeChartInCM.row_name.map(row => ({
          name: row.name,
          columns: sizeChartInCM.columns.filter(col => col.row_name === row.name).map(col => col.name),
        }));

        setValues(prevValues => ({
          ...prevValues,
          name: productData.name,
          total_order: productData.total_order,
          individual_price: productData.individual_price,
          group_price: productData.group_price,
          competitors_price: productData.competitors_price,
          description: productData.description,
          content: productData.content == null
            ? `<!DOCTYPE html>
        <html lang="en">
        <head>
            <style>
                 figure img {
                    width: 200px !important;
                    height: 300px !important;
                }
            </style>
        </head>
        <body>
        </body>
        </html>`
            : productData.content,
            size_chartInInch: sizeChart,
            size_chartIncm: sizeChartInCM,

        }));

        // Set rows state
        setRows(newRows);
        setInRows(newInRows);

        await getCategory();
        const selectedCategory = category.find(cat => cat._id === productData.product_category_keys.product_category_one._id);
        const selectedSubCategory = selectedCategory?.child.find(sub => sub._id === productData.product_category_keys.product_category_two._id);
        setValues(prevValues => ({
          ...prevValues,
          category: productData.product_category_keys.product_category_one._id,
          subcategory: productData.product_category_keys.product_category_two._id,
          product_category_keys: {
            product_category_one: {
              _id: productData.product_category_keys.product_category_one._id,
              name: selectedCategory?.name || "",
            },
            product_category_two: {
              _id: productData.product_category_keys.product_category_two._id,
              name: selectedSubCategory?.name || "",
            },
          }
        }));
        setStates({ content: productData.content });
        stopAnimation();
      } else {
        navigate("/");
      }
    } catch (error) {
      navigate("/");
    }
  };

  useEffect(() => {
    getProductDetail();
  }, [product_id, isLoggedIn]);
  const getCategory = async () => {
    startAnimation();
    try {
      const categoryResponse = await api.post(`${serverURL + PRODUCTCATEGORY}`, { action: "sub-category" });
      const categoryData = categoryResponse.data.data;
      setUrl(categoryResponse.data.data.productImagePath);
      setCategory(categoryData.productsCategoryList);
      stopAnimation();
    } catch (error) {
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  useEffect(() => {
    if (values.category) {
      const selectedCategory = category.find(cat => cat._id === values.category);
      setSubCategory(selectedCategory?.child || []);
    }
  }, [values.category, category]);

  const handelCategorydata = (e) => {
    const selectedCategory = category.find(cat => cat._id === e.target.value);
    setValues({
      ...values,
      category: e.target.value,
      subcategory: "",
      product_category_keys: {
        product_category_one: {
          _id: e.target.value,
          name: selectedCategory.name,
        },
        product_category_two: {
          _id: "",
          name: "",
        },
      }
    });

    setSubCategory(selectedCategory?.child || []);
    if (submitCount > 0) {
      const validationErrors = validate({ ...values, category: e.target.value });
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length === 0) {
        delete errors[e.target.name];
      }
    }
  }

  const handelSubCat = (e) => {
    const selectedSubCategory = subCategory.find(sub => sub._id === e.target.value);
    setValues({
      ...values,
      subcategory: e.target.value,
      product_category_keys: {
        ...values.product_category_keys,
        product_category_two: {
          _id: e.target.value,
          name: selectedSubCategory.name,
        },
      }
    });

    if (submitCount > 0) {
      const validationErrors = validate({ ...values, subcategory: e.target.value });
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length === 0) {
        delete errors[e.target.name];
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProductData = {
      product_category_keys: values.product_category_keys,
      description: values.description,
      total_order: values.total_order,
      group_price: values.group_price,
      individual_price: values.individual_price,
      competitors_price: values.competitors_price,
      name: values.name,
      tax: values.tax,
      product_id: values.product_id,
      content: states.content,
      size_chartInInch: values.size_chartInInch,
      size_chartIncm: values.size_chartIncm

    };
    const validationErrors = validate(updatedProductData);
    setErrors(validationErrors);
    if (
      Object.keys(validationErrors).length === 0 && values.product_category_keys.product_category_one._id && values.product_category_keys.product_category_two._id
    ) {
      try {
        setMainLoder(true);
        await api.postWithToken(`${serverURL}/product-update/${product_id}`, updatedProductData);
        setMainLoder(false);
        setSnackbarMessage('Product updated successfully!');
        setSnackbarOpen(true);

        setTimeout(() => {
          navigate("/admin/product");
        }, 1000);

      } catch (error) {
        console.error(error);
        setMainLoder(false);
      }
    };
  }
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('size_chartInInch') || name.startsWith('size_chartIncm')) {
      const sizeChartField = name.split('.')[1];
      setValues(prevValues => ({
        ...prevValues,
        size_chartInInch: {
          ...prevValues.size_chartInInch,
          [sizeChartField]: value
        }, size_chartIncm: {
          ...prevValues.size_chartIncm,
          [sizeChartField]: value
        }
      }));
    } else {
      setValues(prevValues => ({
        ...prevValues,
        [name]: value
      }));
    }
  };


  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setStates({ ...states, content: data });
  };
  const editorConfiguration = {
    extraPlugins: [CustomAdapterPlugin],
    mediaEmbed: {
      previewsInData: true,
    },
    toolbar: {
      items: [
        "undo", "redo", "|", "heading", "|", "bold", "italic", "underline",
        "link", "unlink", "anchor",
        "|", "bulletedList", "numberedList", "|", "outdent", "indent", "|", "blockQuote",
        "|",
        "imageUpload",
        "mediaEmbed",
      ],
    },
    image: {
      toolbar: [
        "imageStyle:full",
        "imageStyle:side",
        "|",
        "imageTextAlternative",
      ],
      resizeUnit: "px",
    },
  };

  function CustomAdapterPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new CustomUploadAdapter(loader);
    };
  }
  return (
    <Layout>
      <div className="border-green">
        <div className="px-3 px-sm-4 mt-3 mt-sm-4">
          <Row className="align-items-end">
            <Col lg={4} md={12} sm={12}>
              <div className="fees-input mt-3">
                <label>Product Name*</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter product name"
                  value={values.name}
                  onChange={handleChange}
                />
                <div className='errorAdmin'>{errors?.name}</div>
              </div>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <div className="fees-input mt-3">
                <label>Individual Price*</label>
                <input
                  type="number"
                  name="individual_price"
                  value={values.individual_price}
                  onChange={handleChange}
                  placeholder="Enter product individual price"
                />
                <div className='errorAdmin'>{errors?.individual_price}</div>
              </div>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <div className="fees-input mt-3">
                <label>Competitors Price*</label>
                <input
                  type="number"
                  name="competitors_price"
                  value={values.competitors_price}
                  onChange={handleChange}
                  placeholder="Enter product competitors price"
                />
                <div className='errorAdmin'>{errors?.competitors_price}</div>
              </div>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <div className="fees-input mt-3">
                <label>Group Price*</label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="group_price"
                  placeholder="Enter product group price"
                  value={values.group_price}
                />
                <div className='errorAdmin'>{errors?.group_price}</div>
              </div>
            </Col>
          </Row>
          <Row>
          </Row>
          <Row>
            <Col lg={4} md={6} sm={12}>
              <div className="fees-input mt-3">
                <label>Sales Quantity*</label>
                <input
                  type="number"
                  name="total_order"
                  value={values.total_order}
                  onChange={handleChange}
                  placeholder="Enter Sales Quantity"
                />
              </div>
              <div className='errorAdmin'>{errors?.total_order}</div>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <div className="fees-input mt-3">
                <label>Category*</label>
                <select
                  value={values.category}
                  name="category"
                  onChange={handelCategorydata}
                >
                  <option value="" disabled>Select a Category</option>
                  {category && category.map((e, i) => (
                    <option key={i} value={e._id}>
                      {e.name}
                    </option>
                  ))}
                </select>
                {!values.product_category_keys.product_category_one._id && <div className='errorAdmin'>Category is required</div>}
              </div>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <div className="fees-input mt-3">
                <label>Sub Category*</label>
                <select
                  value={values.subcategory}
                  name="subcategory"
                  onChange={handelSubCat}
                >
                  <option value="" disabled>Select a Sub Category</option>
                  {subCategory && subCategory.map((e, i) => (
                    <option key={i} value={e._id}>
                      {e.name}
                    </option>
                  ))}
                </select>
                {!values.product_category_keys.product_category_two._id && <div className='errorAdmin'>sub Category is required</div>}

              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={6} sm={12}>
              <div className="fees-input mt-3" style={{ position: 'relative', top: '19px' }}>
                <label>Product Details*</label>
                <textarea
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  placeholder="Enter Product Details"
                />
                <div className='errorAdmin'>{errors?.description}</div>
              </div>
            </Col>
          </Row>
        </div>
        <div className="px-3 px-sm-4 pb-5 pb-sm-4 mt-3 mt-sm-4 border-green-bottom">
          <Row className='mb-5'>
            <label className=''>Description</label>
            <CKEditor
              editor={ClassicEditor}
              data={values.content}
              onChange={handleEditorChange}
              config={editorConfiguration}
            />
          </Row>
          </div>
          <div className="px-3 px-sm-4 pb-3 pb-sm-4 mt-3 mt-sm-4 border-green-bottom">
          {/* <div className=""> */}
            <div className="size-chart" style={{ position: 'relative', top: '10px', border: 'none !important' }}>
              <br />
              <label style={{ fontSize: '15px', fontWeight: 600 }}>Size Chart In Inch</label>
              <Row className="align-items-end">
                <Col lg={4} md={12} sm={12}>
                  <div className="fees-input mt-3">
                    <label>Title</label>
                    <input
                      type="text"
                      name="size_chartInInch.title"
                      onChange={handleChange}
                      placeholder="Enter Title"
                      value={values.size_chartInInch.title}
                    />
                    <div className="errorAdmin">{errors?.size_chartInInch?.title}</div>
                  </div>
                </Col>
                <Col lg={4} md={6} sm={12}>
                  <div className="fees-input mt-3">
                    <label>Description</label>
                    <input
                      type="text"
                      name="size_chartInInch.description"
                      value={values.size_chartInInch.description}
                      onChange={handleChange}
                      placeholder="Enter Description"
                    />
                    <div className="errorAdmin">{errors?.size_chartInInch?.description}</div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg={4} md={6} sm={12}>
                  <div className="fees-input mt-3">
                    <label>Row Name</label>
                    <input
                      type="text"
                      name="newRowName"
                      value={newRowName}
                      onChange={(e) => setNewRowName(e.target.value)}
                      placeholder="Enter Row Name"
                    />
                    <button
                      className="add-items"
                      style={{ position: "relative", right: '4px', top: '-38px', left: "495px" }}
                      onClick={addRow}
                    >
                      <img src="../../admin-img/add.svg" alt="Add Row" />
                    </button>
                  </div>
                </Col>
              </Row>
              <Row style={{ position: 'relative', bottom: '24px' }}>
                <Col lg={4} md={6} sm={12}>
                  <div className="fees-input mt-3">
                    <label>RowList</label>
                    <select
                      name="rowlist"
                      className="add-product-selector"
                      onChange={(e) => setSelectedRow(e.target.value)}
                    >
                      <option value=''>Select Row</option>
                      {rows.map(row => (
                        <option key={row.name} value={row.name}>{row.name}</option>
                      ))}
                    </select>
                    <div className="errorAdmin">{errors?.rowlist}</div>
                  </div>
                </Col>
                <Col lg={4} md={6} sm={12}>
                  <div className="fees-input mt-3">
                    <label>Column Name</label>
                    <input
                      type="text"
                      name="columnName"
                      placeholder="Type Column Name"
                      value={columnName}
                      onChange={(e) => setColumnName(e.target.value)}
                    />
                    <button
                      className="add-items"
                      onClick={addColumn}
                      style={{ position: "relative", right: '4px', top: '-38px', left: "495px" }}
                    >
                      <img src="../../admin-img/add.svg" alt="Add Column" />
                    </button>
                  </div>
                </Col>
              </Row>
              <table>
                <tbody className="d-flex">
                  {rows.map((item, i) => (
                    <div key={i}>
                      <tr>
                        <td className="sizechart-heading">
                          {item.name}
                          <Button onClick={() => deleteRow(item.name)} className="delete-preview-img">
                            <img src={delete_product} className="user-review-icon" alt="" />
                          </Button>
                        </td>
                      </tr>
                      <tr className="d-flex flex-column">
                        {item.columns.map((sub, j) => (
                          <td key={j}>{sub}</td>
                        ))}
                      </tr>
                    </div>
                  ))}
                </tbody>
              </table>
            </div>
            <br />
          </div>
          <div className="px-3 px-sm-4 pb-3 pb-sm-4 mt-3 mt-sm-4 border-green-bottom">
          {/* <div className=""> */}
            <div className="size-chart" style={{ position: 'relative', top: '10px', border: 'none !important' }}>
              <br />
              <label style={{ fontSize: '15px', fontWeight: 600 }}>Size Chart In Cm</label>
              <Row className="align-items-end">
                <Col lg={4} md={12} sm={12}>
                  <div className="fees-input mt-3">
                    <label>Title</label>
                    <input
                      type="text"
                      name="size_chartIncm.title"
                      onChange={handleChange}
                      placeholder="Enter Title"
                      value={values.size_chartIncm.title}
                    />
                    <div className="errorAdmin">{errors?.size_chartIncm?.title}</div>
                  </div>
                </Col>
                <Col lg={4} md={6} sm={12}>
                  <div className="fees-input mt-3">
                    <label>Description</label>
                    <input
                      type="text"
                      name="size_chartIncm.description"
                      value={values.size_chartIncm.description}
                      onChange={handleChange}
                      placeholder="Enter Description"
                    />
                    <div className="errorAdmin">{errors?.size_chartIncm?.description}</div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg={4} md={6} sm={12}>
                  <div className="fees-input mt-3">
                    <label>Row Name</label>
                    <input
                      type="text"
                      name="InnewRowName"
                      value={InnewRowName}
                      onChange={(e) => setInNewRowName(e.target.value)}
                      placeholder="Enter Row Name"
                    />
                    <button
                      className="add-items"
                      style={{ position: "relative", right: '4px', top: '-38px', left: "495px" }}
                      onClick={addInRow}
                    >
                      <img src="../../admin-img/add.svg" alt="Add Row" />
                    </button>
                  </div>
                </Col>
              </Row>
              <Row style={{ position: 'relative', bottom: '24px' }}>
                <Col lg={4} md={6} sm={12}>
                  <div className="fees-input mt-3">
                    <label>RowList</label>
                    <select
                      name="rowlist"
                      className="add-product-selector"
                      onChange={(e) => setSelectedInRow(e.target.value)}
                    >
                      <option value=''>Select Row</option>
                      {inrows.map(row => (
                        <option key={row.name} value={row.name}>{row.name}</option>
                      ))}
                    </select>
                    <div className="errorAdmin">{errors?.rowlist}</div>
                  </div>
                </Col>
                <Col lg={4} md={6} sm={12}>
                  <div className="fees-input mt-3">
                    <label>Column Name</label>
                    <input
                      type="text"
                      name="IncolumnName"
                      placeholder="Type Column Name"
                      value={IncolumnName}
                      onChange={(e) => setInColumnName(e.target.value)}
                    />
                    <button
                      className="add-items"
                      onClick={addInColumn}
                      style={{ position: "relative", right: '4px', top: '-38px', left: "495px" }}
                    >
                      <img src="../../admin-img/add.svg" alt="Add Column" />
                    </button>
                  </div>
                </Col>
              </Row>
              <table>
                <tbody className="d-flex">
                  {inrows.map((item, i) => (
                    <div key={i}>
                      <tr>
                        <td className="sizechart-heading">
                          {item.name}
                          <Button onClick={() => deleteInRow(item.name)} className="delete-preview-img">
                            <img src={delete_product} className="user-review-icon" alt="" />
                          </Button>
                        </td>
                      </tr>
                      <tr className="d-flex flex-column">
                        {item.columns.map((sub, j) => (
                          <td key={j}>{sub}</td>
                        ))}
                      </tr>
                    </div>
                  ))}
                </tbody>
              </table>
            </div>
            <br />
          </div>
          <div className="px-3 px-sm-4 pb-3 pb-sm-4 mt-3 mt-sm-4">
          <div className="d-flex align-items-center justify-content-end flex-wrap mt-3 gap-3 mt-5">
            <Button className="fixed-fee" type="button" onClick={(e) => (setSubmitCount(1), handleSubmit(e))} >Edit</Button>
          </div>
        </div>
      </div>
      <SucessSnackBar open={snackbarOpen} setOpen={setSnackbarOpen} text={snackbarMessage} type="success" />
    </Layout>
  );
};
export default EditProduct;
