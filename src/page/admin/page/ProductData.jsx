import React, {useState, useEffect, useContext } from 'react'
import { Button,Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from '../../../helper/apiAdmin'
import { getServerURL } from '../../../helper/envConfig'
import { CartContext } from '../../../context/CartContext'
import { handelProductDetail } from '../../../helper/constants';
import DynamicPagination from './DynamicPagination';
import createreview from '../../../page/admin/page/assets/img/createuserreview.png';
import edit_product from '../../../page/admin/page/assets/img/edit.png';
import '../../../page/admin/page/assets/css/ProductData.css'
const ProductData = ({ search }) => {

  const { setMainLoder } = useContext(CartContext);
  const [page, setPage] = useState(1);
  const [productList, setProductList] = useState([]);
  const serverURL = getServerURL();
  const navigate = useNavigate();
  const itemsPerPage = 5;

  const getProducts = async () => {

setMainLoder(true);
    try {
     
      var [productListResponse] = await Promise.all([
        api.postWithToken(`${serverURL + "product-list-admin"}`, {
          page: page, limit: itemsPerPage, search: search
        })]);
      setProductList(productListResponse.data)

    } catch (error) {
      console.log(error);
    }finally{
      setMainLoder(false)
    }
  };
  useEffect(() => {
    getProducts();
  }, [page, search]);
  const handleToggle = async (productId, currentStatus) => {
    try {
      // Perform API call to update the is_active status
      const response = await api.postWithToken(`${serverURL}update-product-status`, {
        productId: productId,
        is_active: currentStatus === 1 ? 0 : 1  // Toggle the status (0 to 1 or 1 to 0)
      });
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
            <th width="18%">Sales Quantity</th>

            <th width="10%">Individual Price</th>
            <th width="10%">Group Price</th>
            <th width="8%">Status</th>
            <th width="9%">Action</th>
          </tr>
        </thead>
        <tbody>
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
                  <td> {list?.total_order}</td>
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
                      <Button onClick={() => navigate(`/admin/create-user-review/${list?._id}`)}>
                        <img src={createreview} className='user-review-icon' alt="" />
                      </Button>
                      <Button onClick={() => navigate(`/admin/edit-product/${list?._id}`)}>
                        <img src={edit_product  } className='user-review-icon' alt="" />
                      </Button>
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
