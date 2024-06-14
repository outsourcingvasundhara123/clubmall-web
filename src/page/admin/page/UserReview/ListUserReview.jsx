import React, { useRef, useState, useEffect, useContext } from 'react';
import { Button, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { CartContext } from '../../../../context/CartContext';
import { Is_Login } from '../../../../helper/IsLogin';
import { Rating } from '@mui/material';
import api from '../../../../helper/apiAdmin';
import { getServerURL } from '../../../../helper/envConfig';
import DynamicPagination from '../DynamicPagination';
import Layout from '../layout/Layout';
import deletereview from '../../../admin/page/assets/img/deleteuserreview.png';

const ListUserReview = () => {
    const { id } = useParams();
    const product_id = id;
    const isLoggedIn = Is_Login();
    const navigate = useNavigate();
    const { setMainLoder } = useContext(CartContext); // Corrected typo in variable name
    const [reviewList, setReviewList] = useState([]);
    const [page, setPage] = useState(1);
    const serverURL = getServerURL();
    const [loading, setLoading] = useState(true);
   
    const player = useRef();


    const startAnimation = () => {
        if (player.current) {
            player.current.play();
        }
    };

    const stopAnimation = () => {
        setLoading(false);
    };

    const itemsPerPage = 10;

    const getProductReview = async () => {
        startAnimation();
        try {
            const apiTyp = isLoggedIn ? api.postWithToken : api.post;
            if (product_id) {
                const productReview = await apiTyp(`${serverURL}product-review-list/`, {
                    product_id: product_id, page: page, limit: itemsPerPage, 
                });
                setReviewList(productReview.data.data);
                stopAnimation();

            }
        } catch (error) {
            console.log(error);
        }
    };
    
    

    useEffect(() => {
        getProductReview();
    }, [product_id, isLoggedIn, page]);

 

    const deleteReview = async (reviewId) => {
        setMainLoder(true);
        try {
            await api.post(`${serverURL}/delete-review`, { review_id: reviewId });
            if (reviewList.list.length === 1 && page > 1) {
                setPage(page - 1);
            } else {
                startAnimation();
                const apiTyp = isLoggedIn ? api.postWithToken : api.post;
                const productReview = await apiTyp(`${serverURL}product-review-list/`, {
                    product_id: product_id,
                    page: page,
                    limit: itemsPerPage,
                });
                setReviewList(productReview.data.data);
                stopAnimation();
            }
        } catch (error) {
            console.log(error);
        }finally{
            setMainLoder(false);
        }
    };

    return (
        <>
            {reviewList?.list?.length > 0 ? (
                <React.Fragment>
                    <Table responsive bordered className="mb-0">
                        <thead>
                            <tr>
                                <th width="3%">No.</th>
                                <th width="12%">Review Image</th>
                                <th width="15%">User Name</th>
                                <th width="15%">Rating</th>
                                <th width="10%">Comment</th>
                                <th width="10%">Review Date</th>
                                <th width="9%">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {reviewList.list.map((review, index) => {
                            const currentNumber = (page - 1) * itemsPerPage + index + 1;
                            return (
                                <tr key={index}>
                                    <td>{currentNumber}.</td>
                                    <td width="12%">
                                        {review.review_files.length > 0 ? (
                                            review.review_files.map((file, idx) => (
                                                <React.Fragment key={idx}>
                                                    {review.review_type === 1 ? (
                                                        <img style={{ width: "100px" }} src={file.file_name} alt='' />
                                                    ) : (
                                                        <video style={{ width: "100px" }} controls>
                                                            <source src={file.file_name} type="video/mp4" />
                                                            Your browser does not support the video.
                                                        </video>
                                                    )}
                                                </React.Fragment>
                                            ))
                                        ) : (
                                            <span>No Image Available</span>
                                        )}
                                    </td>
                                    <td className='text-pre-line'>{review.title || "A Clubmall user"}</td>
                                    <td className='text-pre-line'><Rating name="simple-controlled" value={review.rating} readOnly /></td>
                                    <td className='text-pre-line'>{review.content}</td>
                                    <td className='text-pre-line'>{review.created_at.slice(0, 10)}</td>
                                    <td>
                                        <div className="user-tools d-flex align-items-center gap-2 justify-content-center">
                                            <Button onClick={() => deleteReview(review._id)}><img src={deletereview} className='user-review-icon' alt="Delete" /></Button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>

                    </Table>
                    {reviewList?.totalPages > 1 &&
                    
                    
                    <DynamicPagination
                        currentPage={reviewList.currentPage}
                        totalPages={reviewList.totalPages}
                        onPageChange={(newPage) => {
                            setPage(newPage);
                        }}
                    />
                    }
                </React.Fragment>
            ) : (
                <p>No User Review found.</p>
            )}
        </>
            
        
    );
};
export default ListUserReview;
