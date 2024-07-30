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
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CustomUploadAdapter from './CustomUploadAdapter';



const AddProduct = () => {

  const { setMainLoder } = useContext(CartContext);

  const initialValues = {
    name: "",
    total_order: "",
    individual_price: "",
    group_price: "",
    product_images: Array(10).fill(undefined),
    description_images: Array(5).fill(undefined),
    size_chartInInch: { description: "", row_name: [], columns: [] },
    size_chartIncm: { description: "", row_name: [], columns: [] },
    product_category_keys: {},
    product_id: "",
    tax: 0,
    category: "",
    subcategory: "",
    attributes: {},
    description: "",
    product_type: "",
    product_files: Array(4).fill({ file: undefined, preview: "", title: "" }),
    description_video: Array(4).fill({ file: undefined, preview: "" }),
    product_qty: [],
    packets : []
  };

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
  const [sizes, setSizes] = useState([]);
  const [product_qty, setProduct_Qty] = useState([]);
  const [states, setStates] = useState({});
  const [colors, setColors] = useState([]);
  const [inputSize, setInputSize] = useState('');
  const [inputQuantity, setInputQuantity] = useState('');

  const [inputColor, setInputColor] = useState('');
  const [colorImage, setColorImage] = useState(null);
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [list, setList] = useState({});
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
    if (newRowName.trim() === '') {
      setErrorMessage('Row name cannot be empty');
      return;
    }
  
    const rowExists = rows.some(row => row.name === newRowName.trim());
    if (rowExists) {
      setErrorMessage('Row already exists');
      return;
    }
  
    setValues(prevState => ({
      ...prevState,
      size_chartInInch: {
        ...prevState.size_chartInInch,
        row_name: [
          ...prevState.size_chartInInch.row_name,
          { name: newRowName.trim() }
        ],
      },
    }));
  
    setRows([...rows, { name: newRowName.trim(), columns: [] }]);
    setErrorMessage(''); // Clear error message on successful addition
    setNewRowName('');
  };
  


  // Function to add a new column to the selected row
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
      setShowColumnInputs({ ...showColumnInputs, [rowName]: false }); // Hide column input after adding column
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
    // Filter out the row from the rows state
    const updatedRows = rows.filter(row => row.name !== rowName);
    setRows(updatedRows);

    // Update the values state to remove the row from size_chart
    setValues(prevState => {
      // Filter out the row from size_chart.row_name
      const updatedRowNames = prevState.size_chartInInch.row_name.filter(row => row.name !== rowName);

      // Filter out the columns associated with the deleted row
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
const addInRow = () => {
  if (InnewRowName.trim() === '') {
    setInRowErrorMessage('Row name cannot be empty');
    return;
  }

  const rowExists = inrows.some(row => row.name === InnewRowName.trim());
  if (rowExists) {
    setInRowErrorMessage('Row already exists');
    return;
  }

  setValues(prevState => ({
    ...prevState,
    size_chartIncm: {
      ...prevState.size_chartIncm,
      row_name: [...prevState.size_chartIncm.row_name, { name: InnewRowName.trim() }],
    },
  }));

  setInRows([...inrows, { name: InnewRowName.trim(), columns: [] }]);
  setInRowErrorMessage(''); // Clear error message on successful addition
  setInNewRowName('');
};


  // Function to add a new column to the selected row
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
    // Filter out the row from the rows state
    const updatedRows = inrows.filter(row => row.name !== rowName);
    setInRows(updatedRows);

    // Update the values state to remove the row from size_chart
    setValues(prevState => {
      // Filter out the row from size_chart.row_name
      const updatedRowNames = prevState.size_chartIncm.row_name.filter(row => row.name !== rowName);

      // Filter out the columns associated with the deleted row
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

  const player = useRef();
  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }
  const startAnimation = () => {
    if (player.current) {
      player.current.play();
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
    const { name, value } = e.target;
    const keys = name.split('.');



    if (keys.length === 1) {

      // Handle top-level fields
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    } else if (keys.length === 3) {
      // Handle nested arrays like size_chart.row_name[0].name
      setValues((prevValues) => {
        const updatedRows = [...prevValues.size_chartInInch.row_name, ...prevValues.size_chartIncm.row_name];
        const index = parseInt(keys[1], 10); // Extract the index
        updatedRows[index] = {
          ...updatedRows[index],
          [keys[2]]: value,
        };
        return {
          ...prevValues,
          size_chartInInch: {
            ...prevValues.size_chartInInch,
            row_name: updatedRows,
          },
          size_chartIncm: {
            ...prevValues.size_chartIncm,
            row_name: updatedRows,
          },
        };
      });
    } else if (keys.length === 4) {
      // Handle nested arrays like size_chart.columns[0].name
      setValues((prevValues) => {
        const rowIndex = parseInt(keys[2], 10); // Extract the row index
        const updatedColumns = [...prevValues.size_chartInInch.row_name[rowIndex][keys[1]], ...prevValues.size_chartIncm.row_name[rowIndex][keys[1]]];
        const index = parseInt(keys[3], 10); // Extract the column index
        updatedColumns[index] = value;
        const updatedRows = [...prevValues.size_chartInInch.row_name, ...prevValues.size_chartIncm.row_name];
        updatedRows[rowIndex] = {
          ...updatedRows[rowIndex],
          [keys[1]]: updatedColumns,
        };
        return {
          ...prevValues,
          size_chartInInch: {
            ...prevValues.size_chartInInch,
            row_name: updatedRows,
          },
          size_chartIncm: {
            ...prevValues.size_chartIncm,
            row_name: updatedRows,
          },
        };
      });
    } else if (keys.length === 2 && keys[0] === 'size_chartInInch') {
      // Handle size_chart top-level fields
      setValues((prevValues) => ({
        ...prevValues,
        size_chartInInch: {
            ...prevValues.size_chartInInch,
            [keys[1]]: value,
        },
        size_chartIncm: {
            ...prevValues.size_chartIncm,
            [keys[1]]: value,
        },
    }));
    }
    else if (keys.length === 2 && keys[0] === 'size_chartIncm') {
      // Handle size_chart top-level fields
      setValues((prevValues) => ({
        ...prevValues,
        size_chartIncm: {
          ...prevValues.size_chartIncm,
          [keys[1]]: value,
        },
      }));
    }
  };




  const handlePhoto = (e) => {
    setMainLoder(true);
  
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
        setMainLoder(false);
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
  

  const handleDescriptionPhoto = (e) => {
    setMainLoder(true);
    const index = parseInt(e.target.name.split('_')[2]); // Adjust based on your naming convention
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (upload) {
        const updatedDescriptions = [...values.description_images];
        updatedDescriptions[index] = {
          file,
          preview: upload.target.result
        };
        setValues({ ...values, description_images: updatedDescriptions });
        setMainLoder(false);
      };
      reader.readAsDataURL(file);
    }

  };
  const handledescriptionVideo = (e) => {
    setMainLoder(true);
    const index = parseInt(e.target.name.split('_')[2]); // Adjust based on your naming convention
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (upload) {
        const updatedDescriptions = [...values.description_video];
        updatedDescriptions[index] = {
          file,
          preview: upload.target.result
        };
        setValues({ ...values, description_video: updatedDescriptions });
        setMainLoder(false);
      };
      reader.readAsDataURL(file);
    }

  };

  // const handleVideo = (e) => {
  //   const index = parseInt(e.target.name.split('_')[2], 10); // Extracts index from name like 'product_files_0'
  //   const file = e.target.files[0];
  //   const title = e.target.value;

  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = function (upload) {
  //       const updatedVideos = [...values.product_files];
  //       updatedVideos[index] = {
  //         file,
  //         preview: upload.target.result,
  //         title: title
  //       };
  //       setValues((prevValues) => ({ ...prevValues, product_files: updatedVideos }));
  //     };
  //     reader.readAsDataURL(file);
  //   }


  //   if (submitCount > 0) {
  //     const validationErrors = validate({ ...values, [e.target.name]: e.target.files[0] });
  //     setErrors(validationErrors);

  //     if (Object.keys(validationErrors).length === 0) {
  //       delete errors[e.target.name];
  //     }
  //   }
  // };

  const handleVideo = (e) => {
    setMainLoder(true);
    const index = parseInt(e.target.name.split('_')[2], 10);
    const file = e.target.files[0];
    let title = '';
    const titleInput = e.target.parentNode.querySelector('.video-title-input');
    if (titleInput) {
      title = titleInput.value;
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = function (upload) {
        const updatedVideos = [...values.product_files];
        updatedVideos[index] = {
          file,
          preview: upload.target.result,
          title: title // Assign the extracted title to the video object
        };
        setValues((prevValues) => ({ ...prevValues, product_files: updatedVideos }));
        setMainLoder(false);
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
  

  const handleTitleChange = (e, index) => {
    const title = e.target.value;
    const updatedVideos = [...values.product_files];
    updatedVideos[index] = {
      ...updatedVideos[index],
      title: title  // Update the title for the specific video index
    };
    setValues((prevValues) => ({ ...prevValues, product_files: updatedVideos }));
  
    // Validation after setting the new title
    if (submitCount > 0) {
      const validationErrors = validate({ ...values, [`product_file_title_${index}`]: title });
      setErrors((prevErrors) => ({
        ...prevErrors,
        [`product_file_title_${index}`]: validationErrors[`product_file_title_${index}`]  // Update specific error for this title
      }));
    }
  };
  



  const handleDeleteImage = (index) => {
    const updatedImages = [...values.product_images];
    updatedImages[index] = undefined; // Clear the image at the given index
    setValues({ ...values, product_images: updatedImages });
  };
  const handleDesDeleteImage = (index) => {
    const updatedImages = [...values.description_images];
    updatedImages[index] = undefined; // Clear the image at the given index
    setValues({ ...values, description_images: updatedImages });
  };
  const handleDeleteDescriptionVideo = (index) => {
    const updatedImages = [...values.description_video];
    updatedImages[index] = undefined; // Clear the image at the given index
    setValues({ ...values, description_video: updatedImages });
  };
  const handleDeleteVideo = (index) => {
    const updatedVideos = [...values.product_files];
    updatedVideos[index] = { file: undefined, preview: "" }; // Reset the video data at the given index
    setValues((prevValues) => ({ ...prevValues, product_files: updatedVideos }));
  };

  const getCategory = async () => {
    startAnimation()
    try {
      const categoryResponse = await api.post(`${serverURL + PRODUCTCATEGORY}`, { action: "sub-category" })
      const categoryData = categoryResponse.data.data;
      setUrl(categoryResponse.data.data.productImagePath)
      setSubCategory(categoryResponse.data.data?.productsCategoryList[0]?.child)
      setcategory(categoryData);
      stopAnimation()
    } catch (error) {
      console.log(error);
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
    return parseInt(timestamp + randomDigits);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedValues = { ...values, packets: quantityPriceItems };
    const validationErrors = validate(updatedValues);
    setErrors(validationErrors);

    if (
      Object.keys(validationErrors).length === 0 &&
      colors.length !== 0 &&
      !isEmpty(list)
    ) {
      setMainLoder(true);
      updatedValues.colors = colors;
      updatedValues.sizes = sizes;
      updatedValues.product_qty = product_qty;
      updatedValues.product_category_keys = {
        product_category_one: values.category,
        product_category_two: values.subcategory,
      };
      const newProductId = { ["Product ID"]: [generateSkuId()] };
      const updatedList = { ...newProductId, ...list };
      updatedValues.attributes = updatedList;
      const formData = new FormData();
      let isVideo = false;
      const titles = [];
      for (let i = 0; i < updatedValues.product_files.length; i++) {
        const video = updatedValues.product_files[i];
        if (video && video.title) {
          titles[i] = video.title;
        }
      }

      // Step 2: Append files and re-indexed titles to formData
      for (let i = 0, j = 0; i < updatedValues.product_files.length; i++) {
        const video = updatedValues.product_files[i];
        if (video && video.file) {
          formData.append("product_files", video.file);

          // Append title if it exists
          if (titles[i] !== undefined) {
            formData.append(`product_files_titles_${j}`, titles[i]);
            j++;
          }

          if (video.file.type.startsWith("video/")) {
            isVideo = true;
          }
        }
      }
      formData.append("product_category_keys", JSON.stringify(updatedValues.product_category_keys));
      formData.append("description", updatedValues.description);
      formData.append("total_order", updatedValues.total_order);
      formData.append("group_price", updatedValues.group_price);
      formData.append("individual_price", updatedValues.individual_price);
      formData.append("competitors_price", updatedValues.competitors_price);
      formData.append("name", updatedValues.name);
      formData.append("product_sizes", updatedValues.sizes);
      formData.append("product_qty", JSON.stringify(updatedValues.product_qty));
      formData.append("tax", updatedValues.tax);
      formData.append("product_id", updatedList["Product ID"]);
      formData.append("attributes", JSON.stringify(updatedList));
      formData.append("content", states.content);
      formData.append("size_chartInInch", JSON.stringify(updatedValues.size_chartInInch));
      formData.append("size_chartIncm", JSON.stringify(updatedValues.size_chartIncm));
      formData.append("packets", JSON.stringify(updatedValues.packets));
      try {
        const response = await api.postWithToken(`${serverURL}product-create`, formData);
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (response.data.success === true) {
          await getImage(response.data.data); // Fetch and store the data
          //     setTimeout(() => {
          //   navigate("/admin/product")
          // }, 1000);
        }
      } catch (error) {
        setMainLoder(false);

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

  const addQuantity = () => {
    if (inputQuantity) {
      setProduct_Qty(prevproductsQuantity => [...prevproductsQuantity, inputQuantity]);
      setInputQuantity('');
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
  const handleQuantityChange = (e) => {
    setInputQuantity(e.target.value);
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

  const deleteQuantity = (indexToRemove) => {
    const newQuantity = product_qty.filter((_, index) => index !== indexToRemove);
    setProduct_Qty(newQuantity);
  };

  const deleteColor = (indexToRemove) => {
    const newColors = colors.filter((_, index) => index !== indexToRemove);
    setColors(newColors);
  };

  useEffect(() => {
    getCategory();
  }, []);

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setStates({ ...states, content: data });
  };
  const [quantityPriceItems, setQuantityPriceItems] = useState([]);
  const [inputPrice, setInputPrice] = useState('');
  const addQuantityPriceItem = () => {
    if (inputQuantity && inputPrice) {
      setQuantityPriceItems([...quantityPriceItems, { count: inputQuantity, price: inputPrice }]);
      setInputQuantity('');
      setInputPrice('');
    }
  };
  const deleteQuantityPriceItem = (indexToRemove) => {
    const newItems = quantityPriceItems.filter((_, index) => index !== indexToRemove);
    setQuantityPriceItems(newItems);
  }
  const handlePriceChange = (e) => {
    setInputPrice(e.target.value);
  };

  const editorConfiguration = {
    extraPlugins: [CustomAdapterPlugin],
    mediaEmbed: {
      previewsInData: true,
    },
    toolbar: {
      items: [
        "undo",
        "redo",
        "|",
        "heading",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "subscript",
        "superscript",
        "link",
        "unlink",
        "anchor",
        "|",
        "bulletedList",
        "numberedList",
        "|",
        "outdent",
        "indent",
        "|",
        "blockQuote",
        "|",
        "imageUpload",  // Existing custom image upload button
        "mediaEmbed",   // Embeds media like videos
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
        <div className="px-3 px-sm-4 mt-3 mt-sm-4 ">
          <Row className="align-items-end">
            <Col lg={4} md={12} sm={12}>
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
            <Col lg={4} md={6} sm={12}>
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
            <Col lg={4} md={6} sm={12}>
              <div className="fees-input mt-3">
                <label>Competitors Price*</label>
                <input type="number"
                  name="competitors_price"
                  value={values.competitors_price}
                  onChange={handleChange}
                  placeholder="Enter product competitors price"
                />
                <div className='errorAdmin' >{errors?.competitors_price}</div>
              </div>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <div className="fees-input mt-3">
                <label>Group Price</label>
                <input type="number"
                  onChange={handleChange}
                  name="group_price"
                  placeholder="Enter product group price"
                />
                <div className='errorAdmin' >{errors?.group_price}</div>
              </div>
            </Col>


          </Row>
          <Row>

          </Row>
          <Row>

            <Col lg={4} md={6} sm={12}>
              <div className="fees-input mt-3">
                <label>Sales Quantity*</label>
                <input type="number"
                  name="total_order"
                  value={values.total_order}
                  onChange={handleChange}
                  placeholder="Enter Sales Quantity"
                />
              </div>
              <div className='errorAdmin' >{errors?.total_order}</div>
            </Col>
            <Col lg={4} md={6} sm={12}>
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
            <Col lg={4} md={6} sm={12}>
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

          <Row>
            <Col lg={12} md={6} sm={12}>
              <div className="fees-input" style={{ position: 'relative', top: '19px' }}>
                <label>Product Details*</label>
                <textarea type="number"
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  placeholder="Enter Product Details"
                />
                <div className='errorAdmin' >{errors?.description}</div>
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
                          {values.product_images[index].file.type.startsWith('image') ? (
                            <img
                              src={values.product_images[index].preview}
                              alt=""
                              className="output-file"
                            />
                          ) : (
                            <video controls className="output-file">
                              <source src={values.product_images[index].preview} type={values.product_images[index].file.type} />
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
                        <img src="../admin-img/add.svg" alt="" />
                      </label>
                      <Button className="delete-preview-img" onClick={() => handleDeleteImage(index)}>
                        <img
                          src="../admin-img/profile/delete.svg"
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

            {/* <Col lg={12} md={12} sm={12} className='video-title'> */}
            <Col lg={12} md={12} sm={12}>
              <div className="select-img-input mt-3">
                <label>Upload Video</label>
                <div className="row align-items-center mt-1 mb-4 g-4">
                  {Array(4).fill(null).map((_, index) => (
                    <div className='col-12 col-md-6 col-lg-4 col-xl-3' key={index}>
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
                          <img src="../admin-img/add.svg" alt="Upload Video" />
                        </label>
                        <Button className="delete-preview-img" onClick={() => handleDeleteVideo(index)}>
                          <img src="../admin-img/profile/delete.svg" alt="Delete Video" width="15px" />
                        </Button>
                      </div>

                      <div className="fees-input mt-3">
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
                <div className='errorAdmin'>{errors?.product_files}</div>
              </div>
            </Col>




            <div className="fees-input">
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
                  <div className='d-flex gap-3 mt-3 mt-md-0' >
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

        <div className="px-3 px-sm-4 pb-5 mt-3 mt-sm-4 border-green-bottom">
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
                    <input type="file" id="selectColor" accept='image/*' onChange={handleColorImageChange} />
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
          <Row>
          
            <Col lg={6} md={6} sm={12}>
              <div className="fees-input mt-3">
                <label>Packs and Price*</label>
                <div className="d-flex align-items-center gap-3">
                  <input type="number" placeholder="Enter Packs" value={inputQuantity} onChange={handleQuantityChange} />
                  <input type="number" placeholder="Enter Price" value={inputPrice} onChange={handlePriceChange} />
                  <Button className="add-items" onClick={addQuantityPriceItem}>
                    <img src="../admin-img/add.svg" alt="" />
                  </Button>
                </div>
              </div>

              {quantityPriceItems.map((item, index) => (
                <div className="fees-input list-data mt-3" key={index}>
                  <div className="d-flex align-items-center gap-3">
                    <p>{`Packs: ${item.count}, Price: ${item.price}`}</p>
                    <Button className="add-items" onClick={() => deleteQuantityPriceItem(index)}>
                      <img src="../admin-img/profile/delete.svg" alt="" />
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
                  data={states?.content || ""}
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
                        <img src="../admin-img/add.svg" alt="" />
                      </label>
                      <Button className="delete-preview-img"
                        onClick={() => handleDeleteDescriptionVideo(index)}
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

              </div>
            </Col>
            <Col lg={12} md={12} sm={12}>
              <div className="select-img-input  mt-3">
                <label>Description Image</label>
                <div className="d-flex align-items-center gap-5 gap-md-4 flex-wrap mt-4">
                  {Array(5).fill(null).map((_, index) => ( // Adjust the number based on your requirement
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
                        <img src="../admin-img/add.svg" alt="" />
                      </label>
                      <Button className="delete-preview-img"
                        onClick={() => handleDesDeleteImage(index)}
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
              </div>
            </Col>
          </Row>
        </div>
        <div className="px-3 px-sm-4 pb-5 border-green-bottom">
        <Row>
        <Col lg={4} md={6} sm={12}>
                <div className="fees-input mt-3">
                  <label>Size Chart Title</label>
                  <input
                    type="text"
                    name="size_chartInInch.description"
                    value={values.size_chartInInch.description}
                    onChange={handleChange}
                    placeholder="Enter Size Chart Title"
                  />
                </div>
              </Col>
            </Row>
          <div className="size-chart" style={{ position: 'relative', top: '32px', border: 'none !important' }}>
         
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
        onClick={addRow}
      >
        <img src="../admin-img/add.svg" alt="Add Row" />
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
                    <img src="../admin-img/remove.svg" style={{ width: '18px' }} />
                  </Button>
                  <Button
                    onClick={() => setShowColumnInputs({ ...showColumnInputs, [row.name]: !showColumnInputs[row.name] })}
                    className="add-items"
                    style={{ marginLeft: '10px' }}
                  >
                    {showColumnInputs[row.name] ? <img src="../admin-img/remove.svg" style={{ width: '18px' }} /> : <img src="../admin-img/add.svg" />}
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
                            <img src="../admin-img/add.svg" alt="Add Column" />
                          </Button>
                        </div>
                      </div>
                    </Col>
                  </Row>
                )}
                {row.columns.map((col, colIndex) => (
                  <Row>
                    <Col xl={5} lg={6} md={8} sm={12} className='pe-1'>
                      <div className="fees-input list-data mt-3" key={index}>
                        <div className="d-flex align-items-center gap-3">
                          <p key={colIndex}>{col}</p>
                          <Button className="add-items" onClick={() => deleteColumn(index, colIndex)}>
                            <img src="../admin-img/remove.svg" style={{ width: '18px' }} />
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
        onClick={addInRow}
      >
        <img src="../admin-img/add.svg" alt="Add Row" />
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
                      <img src="../admin-img/remove.svg" style={{ width: '18px' }} />
                    </Button>
                    <Button
                      onClick={() => setShowInColumnInputs({ ...showInColumnInputs, [row.name]: !showInColumnInputs[row.name] })}
                      className="add-items"
                      style={{ marginLeft: '10px' }}
                    >
                      {showInColumnInputs[row.name] ? <img src="../admin-img/remove.svg" style={{ width: '18px' }} /> : <img src="../admin-img/add.svg" />}
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
                            <img src="../admin-img/add.svg" alt="Add Column" />
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
                            <img src="../admin-img/remove.svg" style={{ width: '18px' }} />
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




        <div className="d-flex align-items-center justify-content-end flex-wrap mt-3 gap-3 mt-5">
          <Button className="fixed-fee" type="button"
            onClick={(e) => (setSubmitCount(1), handleSubmit(e))} style={{ position: "relative", right: '25px' }} >Add</Button>
        </div>
      </div>

    </Layout>
  );
};

export default AddProduct;
