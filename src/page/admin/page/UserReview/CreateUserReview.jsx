import React, { useRef, useState, useEffect, useContext } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import Layout from '../layout/Layout';
import api from '../../../../helper/apiAdmin';
import { getServerURL } from '../../../../helper/envConfig';
import { useNavigate, useParams } from 'react-router-dom';
import { CartContext } from '../../../../context/CartContext';
import { Rating } from '@mui/material';
import { PRODUCTDETAIL } from '../../../../../src/helper/endpoints';
import { Is_Login } from '../../../../helper/IsLogin';
import './CreateUserReview.css';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ListUserReview from './ListUserReview';

function CreateUserReview() {
  const { setMainLoder } = useContext(CartContext);
  const name = localStorage.getItem("name")
  const { id } = useParams();
  const product_id = id;
  const serverURL = getServerURL();
  const navigate = useNavigate();
  const player = useRef();
  const [Product, setProduct] = useState({})
  const [loading, setLoading] = useState(true);
  const initialValues = {
    action: "create",
    product_id: "",
    content: "",
    rating: "",
    title: "",
    vendor_id: "",
    review_type: "",
    review_files: ""
  };
  const [values, setValues] = useState(initialValues);
  const isLoggedIn = Is_Login();
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handlePhoto = (e) => {
    const files = e.target.files;
    const fileNames = Array.from(files).map(file => file.name); // Extracting file names

    // Check if total files selected exceeds the limit
    if (fileNames.length > 5) {
      // Show an alert or message indicating the limit is exceeded

      handleErrorSnackbarforMultiplefile(true);
      // Clear the input field
      e.target.value = null;
      return; // Exit function
    }

    setValues({ ...values, review_files: files, fileNames: fileNames }); // Setting file names in state
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
        const [productDetail] = await Promise.all([
          apiTyp(`${serverURL + PRODUCTDETAIL + `?product_id=${product_id}`}`),
        ]);
        const productData = productDetail.data.data;
        setProduct(productData);
        stopAnimation();
      } else {
        navigate('/');
      }
    } catch (error) {
      console.log(error, 'error');
      navigate('/');
    }
  };

  const submitReviews = async (e) => {
    e.preventDefault();
    try {
      setMainLoder(true);
      if (product_id && product_id !== undefined && Product.productList.user_id?._id) {
        if (values.title && values.content && values.rating) {
          const formData = new FormData();
          formData.append('action', 'create');
          formData.append('product_id', product_id);
          formData.append('vendor_id', Product.productList.user_id?._id);
          formData.append('content', values.content);
          formData.append('rating', values.rating);
          formData.append('title', values.title);

          let isImage = false;
          let isVideo = false;

          if (values.review_files.length >= 0) {
            for (let i = 0; i < values.review_files.length; i++) {
              formData.append('review_files', values.review_files[i]);
              if (values.review_files[i].type.startsWith('image/')) {
                isImage = true;
              }
              if (values.review_files[i].type.startsWith('video/')) {
                isVideo = true;
              }
            }

            let reviewType = 0; // default value
            if (isImage && isVideo) {
              reviewType = 3; // for both image and video
            } else if (isImage) {
              reviewType = 1; // for image review
            } else if (isVideo) {
              reviewType = 2; // for video review
            }
            formData.append('review_type', reviewType);
          }
          else {
            // If no files are uploaded, still submit the review
            formData.append('review_type', 0);
          }

          const response = await Promise.all([
            api.postWithToken(`${serverURL}product-review-manage`, formData),
          ]);
          if (response[0]?.data.success === true) {
            if (response[0]?.data.message === 'Already review and rating this product!') {
              handleErrorSnackbar('This product has already been reviewed and rated');
            }
            else {
              handleSuccessSnackbar(response[0]?.data.message);
            }
          } else {
            handleErrorSnackbar(response[0]?.data.message);
          }
          getProductDetail();
        } else {
          handleErrorSnackbar('Please fill out all required fields!');
        }
      } else {
        navigate('/product');
      }
      setMainLoder(false);
    } catch (error) {
      handleErrorSnackbar('Failed to submit review. Please try again.');
      setMainLoder(false);
      console.error('Error posting data:', error);
    }
  };


  useEffect(() => {
    getProductDetail();
  }, [product_id]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSuccessSnackbarOpen(false);
    setErrorSnackbarOpen(false);
  };

  const handleSuccessSnackbar = () => {
    setSnackbarMessage('Review created successfully.');
    setSuccessSnackbarOpen(true);
    setTimeout(() => {
      window.location.replace("/admin/product");
    }, 1000);
  };

  const handleErrorSnackbar = (errorMessage) => {
    setSnackbarMessage(errorMessage);
    setErrorSnackbarOpen(true);
  };
  const handleErrorSnackbarforMultiplefile = () => {

    setSnackbarMessage("You can only upload a maximum of 5 files. Please select fewer files.");
    setErrorSnackbarOpen(true);
    setTimeout(() => {
      setErrorSnackbarOpen(false);
    }, 2000);

  };


  return (
    <>
<Layout>
      <div className="border-green">
        <div className="px-3 px-sm-4 mt-3 mt-sm-4">
          <form onSubmit={submitReviews}>
            <Row className="align-items-end">
              <Col lg={3} md={6} sm={12}>
                <div className="fees-input mt-3">
                  <label>User Name*</label>
                  <input
                    type="text"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    placeholder="Enter user name"
                  />
                </div>
              </Col>
            </Row>
            <Row className="align-items-end">
              <Col lg={3} md={6} sm={12}>
                <div className="fees-input mt-3">
                  <label>Rating *</label>
                  <Rating name="simple-controlled" className="rating" onChange={(event, newValue) => setValues({ ...values, rating: newValue })} />
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <div className="fees-input mt-3">
                  <label>Comments*</label>
                  <textarea
                    type="text"
                    name="content"
                    value={values.content}
                    onChange={handleChange}
                    placeholder="Enter your review comments"
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <div className="fees-input mt-3">
                  <label>Image/Video</label>
                  <Row>
                    <input type="file" style={{ width: "24%", position: 'relative', right: "-12px" }} name="review_files" accept="image/*,video/*" onChange={handlePhoto} multiple />
                  </Row>
                </div>
                {values.fileNames && values.fileNames.length > 0 && (
                  <div>
                    Selected Files:
                    <ul>
                      {values.fileNames.map((fileName, index) => (
                        <li key={index}>{fileName}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Col>
            </Row>

            <div className="d-flex align-items-center justify-content-end flex-wrap mt-3 gap-3 mt-5">
              <Button className="fixed-fee" type="submit">
                Add Review
              </Button>
            </div>
          </form>
        </div>
      </div>
      <br></br>
      <h3> User ReviewList</h3>
      <br></br>
      <ListUserReview/>
      <Snackbar open={successSnackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <MuiAlert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
      <Snackbar open={errorSnackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <MuiAlert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
      
    </Layout>
    
    </>
    
  );
}

export default CreateUserReview;
