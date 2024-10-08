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
    size_chartInInch: { description: "" },
    size_chartIncm: { description: "" },
    product_files: Array(4).fill({ file: undefined, preview: "", title: "" }),
    description_video: Array(4).fill({ file: undefined, preview: "" }),
    product_images: Array(10).fill({ file: undefined, preview: "", type: "image" }),
    description_images: Array(5).fill({ file: undefined, preview: "" }),
    deleted_images: [],
    pdt_img_deleted_images: [],
    deleted_videos: [],
    deleted_files: [],
    colors: Array(10).fill({ name: "", image: { file: undefined, preview: "" } }),
    sizes: Array(10).fill(""),
    packets: [],
  });

  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitCount, setSubmitCount] = useState(0);
  const serverURL = getServerURL();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [Url, setUrl] = useState("");
  const [ImageUrl, setImageUrl] = useState("");
  const [states, setStates] = useState({});
  const player = useRef();
  const { id } = useParams();
  const product_id = id;
  const isLoggedIn = Is_Login();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [rows, setRows] = useState([]);
  const [columnName, setColumnName] = useState('');
  const [newRowName, setNewRowName] = useState('');
  const [inrows, setInRows] = useState([]);
  const [IncolumnName, setInColumnName] = useState('');
  const [InnewRowName, setInNewRowName] = useState('');
  const [showColumnInputs, setShowColumnInputs] = useState({});
  const [showInColumnInputs, setShowInColumnInputs] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [inRowErrorMessage, setInRowErrorMessage] = useState('');
  const addRow = () => {
    if (newRowName.trim() !== '') {
      const rowExists = rows.some(row => row.name === newRowName.trim());
      if (rowExists) {
        setErrorMessage('Row already exists');
        return;
      }
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
      const rowExists = inrows.some(row => row.name === InnewRowName.trim());
      if (rowExists) {
        setInRowErrorMessage('Row already exists');
        return;
      }
    

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
    const updatedRows = [...rows];
    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      columns: updatedRows[rowIndex].columns.filter((col, index) => index !== columnIndex),
    };
    setRows(updatedRows);
    setValues(prevState => {
      const updatedColumns = prevState.size_chartInInch.columns.filter((column, index) => {
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
    const updatedRows = [...inrows];
    updatedRows[InrowIndex] = {
      ...updatedRows[InrowIndex],
      columns: updatedRows[InrowIndex].columns.filter((col, index) => index !== IncolumnIndex),
    };
    setInRows(updatedRows);


    setValues(prevState => {
      const updatedColumns = prevState.size_chartIncm.columns.filter((column, index) => {
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
  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }
  const [sizes, setSizes] = useState([]);
  const [product_qty, setProduct_Qty] = useState([]);
  const [inputQuantity, setInputQuantity] = useState('');
  const [colors, setColors] = useState([]);
  const [inputSize, setInputSize] = useState('');
  const [inputColor, setInputColor] = useState('');
  const [colorImage, setColorImage] = useState(null);
  const [deletedSizes, setDeletedSizes] = useState([]);
  const [deletedColors, setDeletedColors] = useState([]);
  const addQuantity = () => {
    if (inputQuantity) {
      setProduct_Qty(prevProductQuantity => [...prevProductQuantity, parseInt(inputQuantity)]);
      setInputQuantity('');
    }
  };
  const handleSizeChange = (e) => {
    setInputSize(e.target.value);
  };
  const handleColorChange = (e) => {
    setInputColor(e.target.value);
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
  const handleColorImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (upload) => {
        setColorImage({ file: file, preview: upload.target.result });
      };
      reader.readAsDataURL(file);
    }
  };


  const deleteSize = (indexToRemove) => {
    setDeletedSizes(prevDeletedSizes => [...prevDeletedSizes, sizes[indexToRemove]]);
    setSizes(sizes.filter((_, index) => index !== indexToRemove));
  };
  const deleteColor = (indexToRemove) => {
    setDeletedColors(prevDeletedColors => [...prevDeletedColors, colors[indexToRemove].name]);
    setColors(colors.filter((_, index) => index !== indexToRemove));
  };
  const handleQuantityChange = (e) => {
    setInputQuantity(e.target.value);
  };
  const deleteQuantity = (indexToRemove) => {
    const newQuantity = product_qty.filter((_, index) => index !== indexToRemove);
    setProduct_Qty(newQuantity);
  };
  const [quantityPriceItems, setQuantityPriceItems] = useState([]);
  const [inputPrice, setInputPrice] = useState('');


  const handlePriceChange = (e) => {
    setInputPrice(e.target.value);
  };

  const addQuantityPriceItem = () => {
    if (inputQuantity && inputPrice) {
      setQuantityPriceItems([...quantityPriceItems, { count: inputQuantity, price: inputPrice }]);
      setInputQuantity('');
      setInputPrice('');
    }
  };

  const deleteQuantityPriceItem = (idToRemove) => {
    const newItems = quantityPriceItems.filter(item => item._id !== idToRemove);
    setQuantityPriceItems(newItems);
  };
  

  const getProductDetail = async () => {
    startAnimation();
    try {
      const apiTyp = isLoggedIn ? api.getWithToken : api.get;
      if (product_id && product_id !== undefined) {
        const productDetail = await apiTyp(`${serverURL + PRODUCTDETAIL + `?product_id=${product_id}`}`);
        const productData = productDetail.data.data.productList;
        const sizeChart = productData.size_chartInInch;
        const sizeChartInCM = productData.size_chartIncm;
        setImageUrl(productDetail.data.data.productImagePath);
        setProduct_Qty(productData.product_qty || []);
        const newSizes = productData.sku_attributes.size.map(size => size.name);
        setSizes(newSizes);
        const packets_price = productDetail.data.data.packets
        setQuantityPriceItems(packets_price)
        const newColors = productData.sku_attributes.color.map(color => ({
          name: color.name,
          image: {
            file: null,
            preview: color.imgUrl ? `${productDetail.data.data.productImagePath}${product_id}/${color.imgUrl}` : null
          }
        }));
        setColors(newColors);
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
          preview: file.file_name.match(/\.(mp4|mov|mkv|webm|jpg|png)$/i)
            ? `${productDetail.data.data.productImagePath}${product_id}/${file.file_name}`
            : `${productDetail.data.data.productImagePath}${product_id}/${file.file_name}`,
          type: file.file_name.match(/\.(mp4|mov|mkv|webm)$/i) ? 'video' : 'image'
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
            preview: `${productDetail.data.data.productImagePath}${file.file_name}`,
            title: file.title || "",
          })),
          description_video: productData.description_video.map(file => ({
            file: file.file_name,
            preview: `${productDetail.data.data.productImagePath}${product_id}/${file.file_name}`,
          })),
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
            preview: `${productDetail.data.data.productImagePath}${product_id}/${img.file_name}`,
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
      values.description_video.forEach((img, index) => {
        if (img && img.file) {
          formData.append(`description_video[${index}]`, img.file);
        }
      });
      values.description_images.forEach((img, index) => {
        if (img && img.file) {
          formData.append(`description_images[${index}]`, img.file);
        }
      });
      colors.forEach((color, index) => {
        formData.append(`colors[${index}][name]`, color.name);
        if (color.image && color.image.file) {
          formData.append(`colors[${index}][image]`, color.image.file);
        }
      });
      sizes.forEach((size, index) => {
        formData.append(`product_sizes[${index}]`, size);
      });
      if (values.deleted_videos && values.deleted_videos.length > 0) {
        formData.append('deleted_videos', JSON.stringify(values.deleted_videos));
      }
      if (values.deleted_images && values.deleted_images.length > 0) {
        formData.append('deleted_images', JSON.stringify(values.deleted_images));
      }
      if (values.pdt_img_deleted_images && values.pdt_img_deleted_images.length > 0) {
        formData.append('pdt_img_deleted_images', JSON.stringify(values.pdt_img_deleted_images));
      }
      if (deletedSizes.length > 0) {
        formData.append('deleted_sizes', JSON.stringify(deletedSizes));
      }
      if (deletedColors.length > 0) {
        formData.append('deleted_colors', JSON.stringify(deletedColors));
      }

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
      size_chartIncm: values.size_chartIncm,
      product_qty: product_qty,
      packets: quantityPriceItems,
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
        values.product_files.forEach((video, index) => {
          if (video?.file) {
            formData.append("product_files", video.file);
            formData.append(`product_files_titles_${index}`, video.title);
          }
        });
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
        formData.append("product_qty", JSON.stringify(product_qty));

        // Append quantity_price_item
        formData.append("packets", JSON.stringify(quantityPriceItems));

        if (values.deleted_files && values.deleted_files.length > 0) {
          formData.append('deleted_files', JSON.stringify(values.deleted_files));
        }

        const response = await api.postWithToken(`${serverURL}product-update/${product_id}`, formData);
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

  const handleDescriptionPhoto = (e) => {
    setMainLoder(true);
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
        setMainLoder(false);
      };
      reader.readAsDataURL(file);
    }
  };
  const handlePhoto = (e) => {
    setMainLoder(true);
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
        setMainLoder(false);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleDeleteImage = (index) => {
    const updatedImages = [...values.product_images];
    updatedImages[index] = { file: undefined, preview: "" };
    if (!Array.isArray(values.pdt_img_deleted_images)) {
      setValues((prevValues) => ({
        ...prevValues,
        pdt_img_deleted_images: [],
      }));
    }
    const updatedDeletedImages = [...values.pdt_img_deleted_images];
    updatedDeletedImages.push(index);

    setValues((prevValues) => ({
      ...prevValues,
      product_images: updatedImages,
      pdt_img_deleted_images: updatedDeletedImages,
    }));
  };
  const handleDesDeleteImage = (index) => {
    const updatedImages = [...values.description_images];
    updatedImages[index] = { file: undefined, preview: "" };
    if (!Array.isArray(values.deleted_images)) {
      setValues((prevValues) => ({
        ...prevValues,
        deleted_images: [],
      }));
    }
    const updatedDeletedImages = [...values.deleted_images];
    updatedDeletedImages.push(index); // Store the index or any identifier of the image to delete

    setValues((prevValues) => ({
      ...prevValues,
      description_images: updatedImages,
      deleted_images: updatedDeletedImages,
    }));
  };


  const handleVideo = (e, index) => {
    setMainLoder(true);
    const file = e.target.files[0];
    const title = values.product_files[index]?.title || "";

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
        setMainLoder(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handledescriptionVideo = (e) => {
    setMainLoder(true);
    const file = e.target.files[0];
    const index = parseInt(e.target.name.split('_')[2]);

    if (file) {
      const reader = new FileReader();
      reader.onload = function (upload) {
        const updatedVideos = [...values.description_video];
        updatedVideos[index] = {
          file,
          preview: upload.target.result,
        };
        setValues((prevValues) => ({
          ...prevValues,
          description_video: updatedVideos,
        }));
        setMainLoder(false);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleDeleteVideo = (index) => {
    const updatedVideos = [...values.product_files];
    updatedVideos[index] = {
      ...updatedVideos[index],
      file: undefined,
      preview: "",
      title: ""
    };

    const updatedDeletedVideos = [...values.deleted_files];
    updatedDeletedVideos.push(index);

    setValues(prevValues => ({
      ...prevValues,
      product_files: updatedVideos,
      deleted_files: updatedDeletedVideos
    }));
  };

  const handleDeleteDescriptionVideo = (index) => {
    const updatedVideos = [...values.description_video];
    updatedVideos[index] = { file: undefined, preview: "" }; // Clear the video at the given index

    // Mark the deleted video in a separate array
    const updatedDeletedVideos = [...values.deleted_videos];
    updatedDeletedVideos.push(index); // Store the index or any identifier of the video to delete

    setValues((prevValues) => ({
      ...prevValues,
      description_video: updatedVideos,
      deleted_videos: updatedDeletedVideos,
    }));
  };

  const filteredQuantityPriceItems = quantityPriceItems.filter(item => item.count !== 1);
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
                <label>Group Price</label>
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
                
              </div>
            </Col>
          </Row>
        </div>
        <br></br>
        <div className="px-3 px-sm-4 pb-4 border-green-bottom">
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
                              <source src={values.product_images[index].preview} type={values.product_images[index].file?.type} />
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

            <Col lg={12} md={12} sm={12}>
              <div className="select-img-input mt-3">
                <label>Upload Video</label>
                <div className="row align-items-center mt-1 mb-4 g-4">
                  {Array(4).fill(null).map((_, index) => (
                    <div className="col-12 col-md-6 col-lg-4 col-xl-3" key={index}>
                      <div className="select-img-output">
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
                          onChange={(e) => handleVideo(e, index)}
                          className="d-none"
                          accept="video/*"
                        />
                        <label className="choose-file-btn" htmlFor={`preview-video-${index}`}>
                          <img src="../../admin-img/add.svg" alt="Upload Video" />
                        </label>
                        <Button className="delete-preview-img" onClick={() => handleDeleteVideo(index)}>
                          <img src="../../admin-img/profile/delete.svg" alt="Delete Video" width="15px" />
                        </Button>
                      </div>
                      <div className="fees-input mt-3" >
                        <input
                          type='text'
                          onChange={(e) => handleTitleChange(e, index)}
                          name={`product_file_title_${index}`}
                          placeholder="Enter Title"
                          className="video-title-input"
                          value={values.product_files[index]?.title || ""}
                        />
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </Col>

          </Row>
        </div>
        <div className="px-3 px-sm-4 pb-5 pb-sm-4 mt-3 mt-sm-4 border-green-bottom">
          <Row className='align-items-start'>
            <Col lg={6} md={6} sm={12}>
              <div className="fees-input mt-3">
                <label>Size</label>
                <div className="d-flex align-items-center gap-3">
                  <input type="text" placeholder="Enter product size" value={inputSize} onChange={handleSizeChange} />
                  <Button className="add-items" onClick={addSize}>
                    <img src="../../admin-img/add.svg" alt="" />
                  </Button>
                </div>
              </div>
              {sizes.map((size, index) => (
                <div className="fees-input list-data mt-3" key={index}>
                  <div className="d-flex align-items-center gap-3">
                    <p>{size}</p>
                    <Button className="add-items" onClick={() => deleteSize(index)}>
                      <img src="../../admin-img/profile/delete.svg" alt="" />
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
                    <input type="file" id="selectColor" accept='image/*' onChange={handleColorImageChange} />
                    <label htmlFor="selectColor">
                      <img src={colorImage?.preview || "../../admin-img/upload.png"} alt="" width="17px" />
                    </label>
                  </div>
                  <input type="text" placeholder="Enter product color" value={inputColor} onChange={handleColorChange} />
                  <Button className="add-items" onClick={addColor}>
                    <img src="../../admin-img/add.svg" alt="" />
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
                      <img src="../../admin-img/profile/delete.svg" alt="" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className='errorAdmin'>{colors.length === 0 && submitCount > 0 && "color is required"}</div>
            </Col>
          </Row>

          <Row className='mb-5'>
           
            <Col lg={6} md={6} sm={12}>
              <div className="fees-input mt-3">
                <label>Quantity and Price</label>
                <div className="d-flex align-items-center gap-3">
                  <input type="number" placeholder="Enter Quantity" value={inputQuantity} onChange={handleQuantityChange} />
                  <input type="number" placeholder="Enter Price" value={inputPrice} onChange={handlePriceChange} />
                  <Button className="add-items" onClick={addQuantityPriceItem}>
                    <img src="../../admin-img/add.svg" alt="" />
                  </Button>
                </div>
              </div>

              {filteredQuantityPriceItems.map((item, index) => (
                <div className="fees-input list-data mt-3" key={index}>
                  <div className="d-flex align-items-center gap-3">
                    <p>{`Packs: ${item.count}, Price: ${item.price}`}</p>
                    <Button className="add-items" onClick={() => deleteQuantityPriceItem(item._id)}>
                      <img src="../../admin-img/profile/delete.svg" alt="" />
                    </Button>
                  </div>
                </div>
              ))}
            </Col>

            <Col lg={12} md={12} sm={12}>
              <div className="fees-input mt-3">
                <label className=''>Description</label>
                <CKEditor
                  editor={ClassicEditor}
                  data={values.content}
                  onChange={handleEditorChange}
                  config={editorConfiguration}
                />
              </div>
            </Col>

            <Col lg={12} md={12} sm={12}>
              <div className="select-img-input  mt-3">
                <label>Description Video</label>
                <div className="d-flex align-items-center gap-5 gap-md-4 flex-wrap mt-4">
                  {Array(5).fill(null).map((_, index) => ( // Adjust the number based on your requirement
                    <div key={index} className="select-img-output">
                      {values.description_video[index]?.preview ? (
                        <video
                          src={values.description_video[index]?.preview}
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
                        id={`preview-desc-video-${index}`}
                        name={`description_video_${index}`} // Naming convention
                        onChange={handledescriptionVideo}
                        className="d-none"
                        accept="video/*"
                      />
                      <label className="choose-file-btn" htmlFor={`preview-desc-video-${index}`}>
                        <img src="../../admin-img/add.svg" alt="" />
                      </label>
                      <Button className="delete-preview-img"
                        onClick={() => handleDeleteDescriptionVideo(index)}
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
            <Col lg={12} md={12} sm={12}>
              <div className="select-img-input mt-3">
                <label>Description Image</label>
                <div className="d-flex align-items-center gap-4 flex-wrap mt-4">
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
          <Row>
            <Col xl={5} lg={6} md={8} sm={12}>
              <div className="fees-input mt-3">
                <label>Size Chart Title</label>
                <div className='d-flex align-items-center gap-2'>
                  <input
                    type="text"
                    name="size_chartInInch.description"
                    value={values.size_chartInInch.description}
                    onChange={handleChange}
                    placeholder="Enter SizeChart Title Name"
                  />
                </div>
              </div>
            </Col>
          </Row>

          <div className="size-chart" style={{ position: 'relative', border: 'none !important' }}>
            <br />
            <label style={{ fontSize: '15px', fontWeight: 600 }}>Size Chart In Inch</label>

            <Row>
              <Col xl={5} lg={6} md={8} sm={12}>
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
                  {errorMessage && (
      <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>
        {errorMessage}
      </div>
    )}
                </div>
              </Col>
            </Row>

            {rows.map((row, index) => (
              <Row key={index} className='mt-3'>
                <Col className="d-flex align-items-center list-data" xl={5} lg={6} md={8} sm={12}>
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
                    <Col xl={5} lg={6} md={8} sm={12} className='pe-1'>
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
                  <Row className='pe-0'>
                    <Col xl={5} lg={6} md={8} sm={12} className='pe-1'>
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
              <Col xl={5} lg={6} md={8} sm={12}>
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
                  {inRowErrorMessage && (
      <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>
        {inRowErrorMessage}
      </div>
    )}
                </div>
              </Col>
            </Row>

            {inrows.map((row, index) => (
              <div key={index}>
                <Row key={index} className='mt-3'>
                  <Col className="d-flex align-items-center list-data" xl={5} lg={6} md={8} sm={12}>
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
                    <Col xl={5} lg={6} md={8} sm={12}>
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
                    <Col xl={5} lg={6} md={8} sm={12}>
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
            <Button className="fixed-fee" type="button" onClick={(e) => (setSubmitCount(1), handleSubmit(e))} >Save</Button>
          </div>
        </div>
      </div>
      <SucessSnackBar open={snackbarOpen} setOpen={setSnackbarOpen} text={snackbarMessage} type="success" />
    </Layout>
  );
};
export default EditProduct;
