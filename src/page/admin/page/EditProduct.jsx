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
    size_chartInInch: {},
    size_chartIncm: {},
    product_files: Array(4).fill({ file: undefined, preview: "", title: "" }),
    description_video: "",
    product_images: Array(10).fill({ file: undefined, preview: "", type: "image" }),
    description_images: Array(5).fill({ file: undefined, preview: "" }),

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
  const [showColumnInputs, setShowColumnInputs] = useState({});
  const [showInColumnInputs, setShowInColumnInputs] = useState({})
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
  const addColumn = (rowName) => {
    if (columnName.trim() !== '') {
      const updatedRows = rows.map(row => {
        if (row.name === rowName) {
          row.columns.push(columnName);
        }
        return row;
      });

      setValues(prevState => ({
        ...prevState,
        size_chartInInch: {
          ...prevState.size_chartInInch,
          columns: [...prevState.size_chartInInch.columns, { name: columnName, row_name: rowName }],
        },
      }));

      setRows(updatedRows);
      setColumnName('');
      setShowColumnInputs({ ...showColumnInputs, [rowName]: false });
    }
  };
  const addInColumn = (inrowName) => {

    if (IncolumnName.trim() !== '') {
      const updatedRows = inrows.map(row => {
        if (row.name === inrowName) { // Check for unique row ID
          row.columns.push(IncolumnName);
        }

        return row;
      });

      setValues(prevState => ({
        ...prevState,
        size_chartIncm: {
          ...prevState.size_chartIncm,
          columns: [...prevState.size_chartIncm.columns, { name: IncolumnName, row_name: inrowName }],
        },
      }));

      setInRows(updatedRows);
      setInColumnName('');
      setShowInColumnInputs({ ...showInColumnInputs, [inrowName]: false });
    }
  };
  const deleteColumn = (rowIndex, columnIndex) => {
    // Make a copy of the rows state
    const updatedRows = [...rows];

    // Remove the specified column from the specified row
    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      columns: updatedRows[rowIndex].columns.filter((col, index) => index !== columnIndex),
    };

    // Update the state with the modified rows
    setRows(updatedRows);

    // Update the values state to remove the column from size_chartInInch.columns
    setValues(prevState => {
      const updatedColumns = prevState.size_chartInInch.columns.filter((column, index) => {
        // Find the column that matches both row_name and index, then filter it out
        return !(column.row_name === updatedRows[rowIndex].name && index === columnIndex);
      });

      return {
        ...prevState,
        size_chartInInch: {
          ...prevState.size_chartInInch,
          columns: updatedColumns,
        },
      };
    });
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
  const deleteInColumn = (InrowIndex, IncolumnIndex) => {
    // Make a copy of the rows state
    const updatedRows = [...inrows];

    // Remove the specified column from the specified row
    updatedRows[InrowIndex] = {
      ...updatedRows[InrowIndex],
      columns: updatedRows[InrowIndex].columns.filter((col, index) => index !== IncolumnIndex),
    };

    // Update the state with the modified rows
    setInRows(updatedRows);


    setValues(prevState => {
      const updatedColumns = prevState.size_chartIncm.columns.filter((column, index) => {
        // Find the column that matches both row_name and index, then filter it out
        return !(column.row_name === updatedRows[InrowIndex].name && index === IncolumnIndex);
      });

      return {
        ...prevState,
        size_chartIncm: {
          ...prevState.size_chartIncm,
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
        const updatedProductImages = productData.product_images.map(file => ({
          file: file.file_name,
          preview: `${Url}${product_id}/${file.file_name}`,
          type: file.file_name.endsWith('.mp4') ? 'video' : 'image'
        }));
        setValues(prevValues => ({
          ...prevValues,
          name: productData.name,
          total_order: productData.total_order,
          individual_price: productData.individual_price,
          group_price: productData.group_price,
          competitors_price: productData.competitors_price,
          description: productData.description,
          product_files: productData.product_files.map(file => ({
            file: file.file_name,
            preview: `${Url}${file.file_name}`, // Assuming thumbnail URL can be used as preview
            title: file.title || "",
          })),
          description_video: productData.description_video,
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
          description_images: productData.description_images.map(img => ({
            file: img.file_name,
            preview: `${Url}${product_id}/${img.file_name}`,
          })),
          product_images: updatedProductImages,
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
        console.log("description_video>>", productData.description_video);
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
  const [sucessSnackBarOpen, setSucessSnackBarOpen] = useState(false);
  const [Mymessage, setMyMessage] = useState("");
  const [warningSnackBarOpen, setWarningSnackBarOpen] = useState(false);


  const getImage = async (data) => {

    try {
      const formData = new FormData();
      values.product_images.forEach((img, index) => {
        if (img && img.file) {
          formData.append(`product_images[${index}]`, img.file);
        }
      });
      values.description_images.forEach((img, index) => {
        if (img && img.file) {
          formData.append(`description_images[${index}]`, img.file);
        }
      });
      const [productResponse] = await Promise.all([
        api.postWithToken(`${serverURL}product-media-update/${product_id}`, formData),
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
      size_chartIncm: values.size_chartIncm,
    };
    const validationErrors = validate(updatedProductData);
    setErrors(validationErrors);

    if (
      Object.keys(validationErrors).length === 0 &&
      values.product_category_keys.product_category_one._id &&
      values.product_category_keys.product_category_two._id
    ) {
      try {
        setMainLoder(true);

        const formData = new FormData();
        let isVideo = false;
        const titles = [];

        for (let i = 0; i < values.product_files.length; i++) {
          const video = values.product_files[i];
          if (video && video.title) {
            titles[i] = video.title;
          }
        }

        for (let i = 0, j = 0; i < values.product_files.length; i++) {
          const video = values.product_files[i];
          if (video && video.file) {
            formData.append("product_files", video.file);

            if (titles[i] !== undefined) {
              formData.append(`product_files_titles_${j}`, titles[i]);
              j++;
            }

            if (video.file.type.startsWith("video/")) {
              isVideo = true;
            }
          }
        }

        for (let i = 0; i < values.description_video.length; i++) {
          formData.append("description_video", values.description_video[i]);
          if (values.description_video[i].type.startsWith("video/")) {
            isVideo = true;
          }
        }

        formData.append("product_category_keys", JSON.stringify(values.product_category_keys));
        formData.append("description", values.description);
        formData.append("total_order", values.total_order);
        formData.append("group_price", values.group_price);
        formData.append("individual_price", values.individual_price);
        formData.append("competitors_price", values.competitors_price);
        formData.append("name", values.name);
        formData.append("product_id", values.product_id);
        formData.append("tax", values.tax);
        formData.append("content", states.content);
        formData.append("size_chartInInch", JSON.stringify(values.size_chartInInch));
        formData.append("size_chartIncm", JSON.stringify(values.size_chartIncm));

        const response = await api.postWithToken(`${serverURL}/product-update/${product_id}`, formData);
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (response.data.success === true) {

          await getImage(response.data);

          setSnackbarMessage('Product updated successfully!');
          setSnackbarOpen(true);
          setTimeout(() => {
            navigate("/admin/product");
          }, 1000);
        }

        setMainLoder(false);
      } catch (error) {
        console.error(error);
        setMainLoder(false);
      }
    }
  };

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


  const handleTitleChange = (e, index) => {
    const title = e.target.value;
    const updatedVideos = [...values.product_files];
    updatedVideos[index] = {
      ...updatedVideos[index],
      title
    };
    setValues(prevValues => ({ ...prevValues, product_files: updatedVideos }));
  };

  const handledescriptionVideo = (e) => {
    const files = Array.from(e.target.files);
    setValues((prevValues) => ({
      ...prevValues,
      description_video: files
    }));
  };





  const handleDescriptionPhoto = (e) => {
    const index = parseInt(e.target.name.split('_')[2]);
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (upload) {
        const updatedDescriptions = [...values.description_images];
        updatedDescriptions[index] = {
          file,
          preview: upload.target.result
        };
        setValues(prevValues => ({ ...prevValues, description_images: updatedDescriptions }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handlePhoto = (e) => {
    const index = parseInt(e.target.name.split('_')[2]);
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (upload) {
        const updatedImages = [...values.product_images];
        updatedImages[index] = {
          file,
          preview: upload.target.result,
          type: file.type.startsWith('video') ? 'video' : 'image'
        };
        setValues(prevValues => ({ ...prevValues, product_images: updatedImages }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleDeleteImage = (index) => {
    const updatedImages = [...values.product_images];
    updatedImages[index] = { file: undefined, preview: "", type: "image" };
    setValues((prevValues) => ({ ...prevValues, product_images: updatedImages }));
  };
  const handleVideo = (e) => {
    const index = parseInt(e.target.name.split('_')[2], 10);
    const file = e.target.files[0];
    const title = e.target.parentNode.querySelector('.video-title-input').value;

    if (file) {
      const reader = new FileReader();
      reader.onload = function (upload) {
        const updatedVideos = [...values.product_files];
        updatedVideos[index] = {
          file,
          preview: upload.target.result,
          title: title
        };
        setValues(prevValues => ({ ...prevValues, product_files: updatedVideos }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDesDeleteImage = (index) => {
    const updatedImages = [...values.description_images];
    updatedImages[index] = { file: undefined, preview: "" };
    setValues((prevValues) => ({ ...prevValues, description_images: updatedImages }));
  };
  const handleDeleteVideo = (index) => {
    const updatedVideos = [...values.product_files];
    updatedVideos[index] = { file: undefined, preview: "" };
    setValues((prevValues) => ({ ...prevValues, product_files: updatedVideos }));
  };

  const handleDeleteDesVideo = (index) => {
    const updatedVideos = [...values.description_video];
    updatedVideos.splice(index, 1);
    setValues((prevValues) => ({ ...prevValues, description_video: updatedVideos }));
  };
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
        <br></br>
        <div className="px-3 px-sm-4 pb-5 border-green-bottom">
          <Row className="align-items-end">
            <Col lg={12} md={12} sm={12}>
              <div className="select-img-input mt-3">
                <label>Product Image*</label>
                <div className="d-flex align-items-center gap-5 flex-wrap mt-4">
                  {Array(10).fill(null).map((_, index) => (
                    <div className="select-img-output" key={index}>
                      {values.product_images[index]?.preview && (
                        <>
                          {values.product_images[index].type === 'image' ? (
                            <img
                              src={values.product_images[index].preview}
                              alt=""
                              className="output-file"
                            />
                          ) : (
                            <video controls className="output-file">
                              <source src={values.product_images[index].preview} type={values.product_images[index].file?.type || 'video/mp4'} />
                            </video>
                          )}
                        </>
                      )}
                      {!values.product_images[index]?.preview && (
                        <img
                          src="../../admin-img/user.jpg"
                          alt=""
                          className="output-file"
                        />
                      )}
                      <input
                        type="file"
                        id={`preview-img-${index}`}
                        name={`product_image_${index}`}
                        onChange={handlePhoto}
                        className="d-none"
                        accept="image/*, video/*"
                      />
                      <label className="choose-file-btn" htmlFor={`preview-img-${index}`}>
                        <img src="../../admin-img/add.svg" alt="" />
                      </label>
                      <Button className="delete-preview-img" onClick={() => handleDeleteImage(index)}>
                        <img
                          src="../../admin-img/profile/delete.svg"
                          alt=""
                          width="15px"
                        />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className='errorAdmin'>{errors?.product_images}</div>
              </div>
            </Col>

            <Col lg={12} md={12} sm={12} className='video-title'>
              <div className="select-img-input mt-3">
                <label>Upload Video</label>
                <div className="d-flex align-items-center gap-5 flex-wrap mt-4 width-video">
                  {Array(4).fill(null).map((_, index) => (
                    <div className="select-img-output" key={index}>
                      {values.product_files[index]?.preview ? (
                        <video
                          src={values.product_files[index]?.preview}
                          className="output-file"
                          controls
                        />
                      ) : (
                        <img
                          src="../../admin-img/user.jpg"
                          alt=""
                          className="output-file"
                        />
                      )}
                      <input
                        type="file"
                        id={`preview-video-${index}`}
                        name={`product_files_${index}`}
                        onChange={handleVideo}
                        className="d-none"
                        accept="video/*"
                      />
                      <div className="fees-input mt-3 width-title" >
                        <input
                          type='text'
                          onChange={(e) => handleTitleChange(e, index)}
                          name={`product_file_title_${index}`}
                          placeholder="Enter Title"
                          className="video-title-input"
                          value={values.product_files[index]?.title || ""}
                        />
                      </div>
                      <label className="choose-file-btn" htmlFor={`preview-video-${index}`}>
                        <img src="../../admin-img/add.svg" alt="Upload Video" />
                      </label>
                      <Button className="delete-preview-img" onClick={() => handleDeleteVideo(index)}>
                        <img src="../../admin-img/profile/delete.svg" alt="Delete Video" width="15px" />
                      </Button>
                    </div>
                  ))}
                </div>

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
            <Col lg={12} md={12} sm={12}>
              <div className="fees-input mt-3 mb-4">
                <label>Description Videos</label>
                <Row>
                  <input
                    type="file"
                    style={{ width: "24%", position: 'relative', right: "-12px" }}
                    name="description_video"
                    accept="video/*"
                    onChange={handledescriptionVideo}
                    multiple
                  />
                </Row>
              </div>
              {values.description_video.length > 0 && (
                <div>
                  Selected Videos:
                  <ul style={{display:'flex',gap:'48px'}}>
                    {values.description_video.map((file, index) => (
                      <li key={index} className="video-item" style={{marginLeft:'-30px',marginTop:'20px'}}>
                        <video controls className="video-preview" style={{width:'100px',height:'100px',borderRadius:'10px'}}>
                          <source src={Url+file.file_name} type="video/mp4" />
                      </video>
                        <Button
                          className="sel-delete-preview-img"
                          onClick={() => handleDeleteDesVideo(index)}
                        >
                          <img src="../../admin-img/profile/delete.svg" alt="" width="15px" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </Col>

            <Col lg={12} md={12} sm={12}>
              <div className="select-img-input mt-3">
                <label>Description Image</label>
                <div className="d-flex align-items-center gap-5 flex-wrap mt-4">
                  {Array(5).fill(null).map((_, index) => (
                    <div key={index} className="select-img-output">
                      <img
                        src={values.description_images[index]?.preview || "../../admin-img/user.jpg"} // Provide a default image path
                        alt=""
                        className="output-file"
                      />
                      <input
                        type="file"
                        id={`preview-desc-img-${index}`}
                        name={`description_image_${index}`} // Naming convention
                        onChange={handleDescriptionPhoto}
                        className="d-none"
                        accept="image/*"
                      />
                      <label className="choose-file-btn" htmlFor={`preview-desc-img-${index}`}>
                        <img src="../../admin-img/add.svg" alt="" />
                      </label>
                      <Button
                        className="delete-preview-img"
                        onClick={() => handleDesDeleteImage(index)}
                      >
                        <img
                          src="../../admin-img/profile/delete.svg"
                          alt=""
                          width="15px"
                        />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </Col>

          </Row>

        </div>
        <div className="px-3 px-sm-4 pb-5 border-green-bottom">
          <div className="size-chart" style={{ position: 'relative', top: '32px', border: 'none !important' }}>
            <br />
            <label style={{ fontSize: '15px', fontWeight: 600 }}>Size Chart In Inch</label>

            <Row>
              <Col lg={4} md={6} sm={12}>
                <div className="fees-input mt-3">
                  <label>Title</label>
                  <div className='d-flex align-items-center gap-2'>
                    <input
                      type="text"
                      name="newRowName"
                      value={newRowName}
                      onChange={(e) => setNewRowName(e.target.value)}
                      placeholder="Enter Title Name"
                    />
                    <Button
                      className="add-items"
                      // style={{ position: "relative", right: '4px', top: '-38px', left: "495px" }}
                      onClick={addRow}
                    >
                      <img src="../../admin-img/add.svg" alt="Add Row" />
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>

            {rows.map((row, index) => (
              <Row key={index} className='mt-3'>
                <Col className="d-flex align-items-center list-data" lg={4} md={6} sm={12}>
                  <p>{row.name}</p>
                  <Button onClick={() => deleteRow(row.name)} className="delete-preview-img">
                    <img src="../../admin-img/remove.svg" style={{ width: '18px' }} />
                  </Button>
                  <Button
                    onClick={() => setShowColumnInputs({ ...showColumnInputs, [row.name]: !showColumnInputs[row.name] })}
                    className="add-items"
                    style={{ marginLeft: '10px' }}
                  >
                    {showColumnInputs[row.name] ? <img src="../../admin-img/remove.svg" style={{ width: '18px' }} /> : <img src="../../admin-img/add.svg" />}
                  </Button>
                </Col>

                {showColumnInputs[row.name] && (
                  <Row className='mt-2'>
                    <Col lg={4} md={6} sm={12} className='pe-1'>
                      <div className="fees-input">
                        <label>Value</label>
                        <div className='d-flex align-items-center gap-2'>
                          <input
                            type="text"
                            name="columnName"
                            placeholder="Type Value Name"
                            value={columnName}
                            onChange={(e) => setColumnName(e.target.value)}
                          />
                          <Button
                            className="add-items"
                            onClick={() => addColumn(row.name)}
                          >
                            <img src="../../admin-img/add.svg" alt="Add Column" />
                          </Button>
                        </div>
                      </div>
                    </Col>
                  </Row>
                )}
                {row.columns.map((col, colIndex) => (
                  <Row>
                    <Col lg={4} md={6} sm={12} className='pe-1'>
                      <div className="fees-input list-data mt-3" key={index}>
                        <div className="d-flex align-items-center gap-3">
                          <p key={colIndex}>{col}</p>
                          <Button className="add-items" onClick={() => deleteColumn(index, colIndex)}>
                            <img src="../../admin-img/remove.svg" style={{ width: '18px' }} />
                          </Button>
                        </div>
                      </div>
                    </Col>
                  </Row>
                ))}
              </Row>
            ))}
          </div>
          <br />
        </div>
        <div className="px-3 px-sm-4 pb-5 border-green-bottom">
          <div className="size-chart" style={{ position: 'relative', top: '32px', border: 'none !important' }}>
            <br />
            <label style={{ fontSize: '15px', fontWeight: 600 }}>Size Chart In Cm</label>

            <Row>
              <Col lg={4} md={6} sm={12}>
                <div className="fees-input mt-3">
                  <label>Title</label>
                  <div className='d-flex align-items-center gap-2'>
                    <input
                      type="text"
                      name="InnewRowName"
                      value={InnewRowName}
                      onChange={(e) => setInNewRowName(e.target.value)}
                      placeholder="Enter Title Name"
                    />
                    <Button
                      className="add-items"
                      // style={{ position: "relative", right: '4px', top: '-38px', left: "495px" }}
                      onClick={addInRow}
                    >
                      <img src="../../admin-img/add.svg" alt="Add Row" />
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>

            {inrows.map((row, index) => (
              <div key={index}>
                <Row key={index} className='mt-3'>
                  <Col className="d-flex align-items-center list-data" lg={4} md={6} sm={12}>
                    <p>{row.name}</p>
                    <Button onClick={() => deleteInRow(row.name)} className="delete-preview-img">
                      <img src="../../admin-img/remove.svg" style={{ width: '18px' }} />
                    </Button>
                    <Button
                      onClick={() => setShowInColumnInputs({ ...showInColumnInputs, [row.name]: !showInColumnInputs[row.name] })}
                      className="add-items"
                      style={{ marginLeft: '10px' }}
                    >
                      {showInColumnInputs[row.name] ? <img src="../../admin-img/remove.svg" style={{ width: '18px' }} /> : <img src="../../admin-img/add.svg" />}
                    </Button>
                  </Col>
                </Row>


                {showInColumnInputs[row.name] && (
                  <Row>
                    <Col lg={4} md={6} sm={12}>
                      <div className="fees-input mt-2">
                        <label>Value</label>
                        <div className='d-flex align-items-center gap-2'>
                          <input
                            type="text"
                            name="IncolumnName"
                            placeholder="Type Value Name"
                            value={IncolumnName}
                            onChange={(e) => setInColumnName(e.target.value)}
                          />
                          <Button
                            className="add-items"
                            onClick={() => addInColumn(row.name)}
                          // style={{ position: "relative", right: '4px', top: '-38px', left: "495px" }}
                          >
                            <img src="../../admin-img/add.svg" alt="Add Column" />
                          </Button>
                        </div>
                      </div>
                    </Col>
                  </Row>
                )}
                {row.columns.map((col, colIndex) => (
                  <Row>
                    <Col lg={4} md={6} sm={12}>
                      <div className="fees-input list-data mt-3" key={index}>
                        <div className="d-flex align-items-center gap-2">
                          <p key={colIndex}>{col}</p>
                          <Button className="add-items" onClick={() => deleteInColumn(index, colIndex)}>
                            <img src="../../admin-img/remove.svg" style={{ width: '18px' }} />
                          </Button>
                        </div>
                      </div>
                    </Col>
                  </Row>
                ))}
              </div>
            ))}
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
