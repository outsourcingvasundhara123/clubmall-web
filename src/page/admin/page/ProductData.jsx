import React, { useRef, useState, useEffect, useContext } from 'react'
import { Badge, Button, Modal, Pagination, Table } from "react-bootstrap";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import api from '../../../helper/apiAdmin'
import { getServerURL } from '../../../helper/envConfig'
import { Is_Login } from '../../../helper/IsLogin'
import ErrorSnackBar from "../../SnackBar/SnackBar";
import SucessSnackBar from "../../SnackBar/SnackBar";
import { CartContext } from '../../../context/CartContext'
import { validate } from './SigninSchima';
import secureLocalStorage from "react-secure-storage";
import { loginAdmin } from '../../../helper/authAdmin'
import { handelProductDetail } from '../../../helper/constants';
import DynamicPagination from './DynamicPagination';
const ProductData = ({ search }) => {

  const { setMainLoder } = useContext(CartContext);

  const [showPass, setShowPass] = useState();
  const [errors, setErrors] = useState({});
  const [page, setPage] = useState(1);
  const [productList, setProductList] = useState([]);
  const [Mymessage, setMyMessage] = useState("");
  const [submitCount, setSubmitCount] = useState(0);
  const serverURL = getServerURL();
  const [sucessSnackBarOpen, setSucessSnackBarOpen] = useState(false);
  const [warningSnackBarOpen, setWarningSnackBarOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const handleEditClose = () => setEdit(false);
  const handleEditShow = () => setEdit(true);
  const navigate = useNavigate();
  const itemsPerPage = 5;


  const getProducts = async () => {

    try {
      setMainLoder(true)
      var [productListResponse] = await Promise.all([
        api.postWithToken(`${serverURL + "product-list-admin"}`, {
          page: page, limit: itemsPerPage, search: search
        })]);
      setProductList(productListResponse.data)
      //var productListData = productListResponse.data.data;
      setMainLoder(false)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts();
  }, [page, search]);


  // Function to handle toggle switch changes
  const handleToggle = async (productId, currentStatus) => {
    try {
      // Perform API call to update the is_active status
      const response = await api.postWithToken(`${serverURL}update-product-status`, {
        productId: productId,
        is_active: currentStatus === 1 ? 0 : 1  // Toggle the status (0 to 1 or 1 to 0)
      });

      // Handle the response if needed

      // You might want to update the productList state after a successful API call
      // Example: Call getProducts() again to refresh the product list

      
      getProducts();
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <>

      <Table responsive bordered className="mb-0">
        <thead>
          <tr>
            <th width="3%">No.</th>
            <th width="12%">Product Image</th>
            <th width="15%">Category</th>
            <th width="15%">Sub Category</th>
            <th width="18%">Product Name</th>
            <th width="10%">Individual Price</th>
            <th width="10%">Group Price</th>
            <th width="8%">Status</th>
            <th width="9%">Action</th>
          </tr>
        </thead>
        <tbody>
          {/* <tr>
          <td colSpan={7}>
            <p className="text-center">*** No Data ***</p>
          </td>
        </tr> */}

          {
            productList?.data && productList?.data?.map((list, index) => {
              const currentNumber = (page - 1) * itemsPerPage + index + 1; // this gives the serial number
              return (
                <tr key={index} >
                  <td>{currentNumber}.</td>
                  <td><img style={{ width: "100px", height: "100px" }} src={productList?.productImagePath + list?._id + "/" + list.product_images[0]?.file_name} className="user-profile" alt="" /></td>
                  <td className='text-pre-line'>{list.product_category_keys?.product_category_one?.name}</td>
                  <td className='text-pre-line'>{list.product_category_keys?.product_category_two?.name}</td>
                  <td className='text-pre-line'>{list?.name}</td>
                  <td>$ {list?.individual_price}</td>
                  <td>$ {list?.group_price}</td>
                  <td>
                    <div className="status">
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={list?.is_active === 1}  // Set checked attribute based on is_active property
                          onChange={() => handleToggle(list?._id, list?.is_active)}  // Pass the product ID and current is_active value to handleToggle function
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  </td>
                  <td>
                    <div className="user-tools d-flex align-items-center gap-2 justify-content-center">
                      {list?.is_active === 1 &&
                        <Button onClick={() => handelProductDetail(list?._id)}>
                          <img src="../admin-img/profile/info.svg" alt="" />
                        </Button>
                      }
                      {/* <Button onClick={() => navigate(`/admin/edit-product/${list?._id}`)}>
                        <img src="../admin-img/profile/Edit.svg" alt="" />
                      </Button> */}

                    </div>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </Table>

      <DynamicPagination
        currentPage={productList.currentPage}
        totalPages={productList.totalPages}
        onPageChange={(newPage) => {
          setPage(newPage);
        }}
      />

    </>
  );
};

export default ProductData;
