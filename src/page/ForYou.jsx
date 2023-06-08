import React, { useRef, useState, useEffect } from 'react'
import Layout from '../layout/Layout'
import { Button, Dropdown, Form, Modal } from 'react-bootstrap'
import { POSTSList } from "../helper/endpoints";
import api from "../helper/api";
import { getServerURL } from '../helper/envConfig';
import ReactPlayer from 'react-player';
import { Swiper, SwiperSlide } from "swiper/react";
import Loader from '../components/Loader';
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
// import required modules
import { Mousewheel } from "swiper";
import { Is_Login } from '../helper/IsLogin'
import { errorResponse, afterLogin, handelProductDetail } from '../helper/constants'
import SucessSnackBar from "../components/SnackBar";
import ErrorSnackBar from "../components/SnackBar";
import { useNavigate } from 'react-router-dom'
import { RiSendPlaneFill } from "react-icons/ri"
import InstallApp from '../components/InstallApp';

const ForYou = () => {
  const isLoggedIn = Is_Login();
  const navigate = useNavigate();
  const swiperRef = useRef(null);
  const defaultProfile = `./img/for_you/defaultuser.png`
  const [postList, setPostList] = useState([]);
  const [sucessSnackBarOpen, setSucessSnackBarOpen] = useState(false);
  const [warningSnackBarOpen, setWarningSnackBarOpen] = useState(false);
  const serverURL = getServerURL();
  const [page, setPage] = useState(1);
  const [like, setLike] = useState(1);
  const [profilUrl, setProfileUrl] = useState(" ");
  const [postlUrl, setPostUrl] = useState(" ");
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const currentPageRef = useRef(page);
  const [loading, setLoading] = useState(true);
  const [Mymessage, setMyMessage] = useState("");
  const [totalPages, setTotalPages] = useState(0); // Declare totalPages state variable
  const [show, setShow] = useState(false);
  const player = useRef();

  const [showComments, setShowComments] = useState(false);
  const handleCommentsClose = () => setShowComments(false);
  const handleCommentsShow = () => setShowComments(true)

  const [showReport, setShowReport] = useState(false);
  const handleReportClose = () => setShowReport(false);
  const handleReportShow = () => setShowReport(true)
  const handleClose = () => {
    setShow(false);
  }

  const handleShow = () => setShow(true);

  const startAnimation = () => {
    if (player.current) {
      player.current.play(); // Check if player.current is not null before accessing play()
    }
  };
  const stopAnimation = () => {
    setLoading(false);
  };

  const getPosts = async () => {
    startAnimation();
    try {

      const getTyp = isLoggedIn ? api.getWithToken : api.get;
      const [postListResponse] = await Promise.all([
        getTyp(`${serverURL + POSTSList + `?action=list&page=${page}`}`),
      ]);
      setPostUrl(postListResponse.data.data.productImagePath)
      const postsData = postListResponse.data.data.postList;
      setTotalPages(postsData.length);
      const updatedfavoriteProductList = [...postList, ...postsData]
        .filter((product, index, self) => self.findIndex(p => p._id === product._id) === index);
      setPostList(updatedfavoriteProductList);
      setIsFetching(false);
      stopAnimation();
    } catch (error) {
      console.log(error);
    }
  };

  function isVideo(url) {
    return url && /\.(mp4|webm|ogg)$/i.test(url);
  }

  const handleSlideChange = (swiper) => {
    setCurrentVideoIndex(swiper.activeIndex);
    if (isLoggedIn && swiper.activeIndex === postList.length - 2) {
      // Check if the last video is being rendered
      if (swiper.activeIndex === postList.length - 2) { // Change to -2 instead of -1
        if (page < totalPages) {
          setIsFetching(true);
          setPage((prevPage) => prevPage + 1);
          setCurrentVideoIndex(0); // Redirect user to the first video on the new page
        } else {
          console.log("Last video on the last page");
        }
      }

      // Check if the first video is being rendered
      if (swiper.activeIndex === 0 && page > 1) {
        setCurrentVideoIndex(0); // Reset the current video index to 0
        setIsFetching(true);
        setPage((prevPage) => prevPage - 1);
      }

      // Redirect user to the top of the video when page changes and new data is loaded
      if (
        swiperRef.current &&
        swiper.activeIndex === 0 &&
        page > 1 &&
        swiper.isEnd
      ) {
        setTimeout(() => {
          swiperRef.current.slideTo(0, 0);
        }, 100);
      }
    } else if (!isLoggedIn && swiper.activeIndex === 3) {
      handleShow()
      setPostList(postList.slice(0, 3)); // Keep only the first three videos in the list
    }
  }

  const followUnfollow = async (user_id) => {
    try {
      if (isLoggedIn) {
        const res = await api.postWithToken(`${serverURL + "user-follow-unfollow"}`, { following: user_id });
        if (res.data.success === true) {
          setMyMessage(res.data.message);
          setSucessSnackBarOpen(!sucessSnackBarOpen);
          // Update the postList state with the updated data
          const updatedPostList = postList.map((post) => {
            if (post.user_id === user_id) {
              // Toggle the following status for the specific post
              return {
                ...post,
                is_following: !post.is_following,
                total_followers: post.is_following
                  ? post.total_followers - 1
                  : post.total_followers + 1,
              };
            }
            return post;
          });
          setPostList(updatedPostList);
        } else if (res.data.success === false) {
          setMyMessage(res.data.message);
          setWarningSnackBarOpen(!warningSnackBarOpen);
        }
      } else {
        // User is not logged in, redirect to the login page
        afterLogin(setMyMessage);
        setWarningSnackBarOpen(!warningSnackBarOpen);
      }
    } catch (error) {
      errorResponse(error, setMyMessage);
      setWarningSnackBarOpen(!warningSnackBarOpen);
    }
  };

  const LikeDissliek = async (post_id) => {
    try {
      if (isLoggedIn) {
        const res = await api.postWithToken(`${serverURL}post-like-dislike`, { post_id: post_id });
        if (res.data.success === true) {
          setSucessSnackBarOpen(!sucessSnackBarOpen);
          setMyMessage(res.data.message);
          // Find the index of the post within the postList array
          // Find the index of the post within the postList array
          const postIndex = postList.findIndex((post) => post._id === post_id);
          if (postIndex !== -1) {
            // Toggle the like status and like count for the specific post
            const updatedPost = {
              ...postList[postIndex],
              is_like: postList[postIndex].is_like === 0 ? 1 : 0,
              total_like: postList[postIndex].is_like === 0 ? postList[postIndex].total_like + 1 : postList[postIndex].total_like - 1,
            };
            // Create a new array with the updated post
            const updatedPostList = [...postList];
            updatedPostList[postIndex] = updatedPost;

            // Update the postList state with the updated data
            setPostList(updatedPostList);
            // getPosts(); // Move this line outside the if-else block
          }
        } else if (res.data.success === false) {
          setMyMessage(res.data.message);
          setWarningSnackBarOpen(!warningSnackBarOpen);
        }

      } else {
        // User is not logged in, redirect to the login page
        afterLogin(setMyMessage);
        setWarningSnackBarOpen(!warningSnackBarOpen);
      }
    } catch (error) {
      errorResponse(error, setMyMessage);
      setWarningSnackBarOpen(!warningSnackBarOpen);
    }
  };

  useEffect(() => {
    getPosts();
  }, [page, isLoggedIn]);

  return (

    <Layout>

      {
        loading && (
          <Loader startAnimation={startAnimation} stopAnimation={stopAnimation} player={player} />
        )}
      <div className='for-you'>
        <SucessSnackBar
          open={sucessSnackBarOpen}
          setOpen={setSucessSnackBarOpen}
          text={Mymessage}
          type="success"
        />

        <ErrorSnackBar
          open={warningSnackBarOpen}
          setOpen={setWarningSnackBarOpen}
          text={Mymessage}
          type="error"
        />

        <Swiper
          direction={"vertical"}
          slidesPerView={1}
          spaceBetween={30}
          mousewheel={true}
          releaseOnEdges={true}
          followFinger={true}
          modules={[Mousewheel]}
          className="mySwiper"
          onSlideChange={handleSlideChange}
          ref={swiperRef}
          initialSlide={currentVideoIndex}
        >
          {postList && postList.map((e, i) => (
            <SwiperSlide key={i}>
              <div className='reels-box position-relative pointer'>
                {e.post_video_link && isVideo(e.post_video_link) ? (
                  <ReactPlayer
                    url={e.post_video_link}
                    width="100%"
                    height="100%"
                    controls={true}
                    playing={currentVideoIndex === i}
                    muted={false}
                    loop={true}
                    config={{
                      file: {
                        attributes: {
                          controlsList: 'nodownload',
                          preload: 'auto',
                          'webkit-playsinline': true,
                        },
                      },
                    }}
                  />
                ) : (
                  <img className='reels-img' src={e.post_video_link} alt="Image" />
                )}

                <div className='user-name px-3'>
                  <div className='d-flex align-items-center gap-2'>
                    <img alt='profile' width="34px" height="34px" style={{ borderRadius: "50%", objectFit: "cover" }} src={e.user_profile ? e.user_profile : `${defaultProfile}`} />
                    <div>
                      <p>{e.user_name}</p>
                      {/* <span>
                              <img alt='' src='./img/for_you/eye.png' className='me-1' />
                              13K</span> */}
                    </div>
                  </div>
                  <Button className='follow-btn' onClick={() => followUnfollow(e.user_id)}  >+ Follow ({e.total_followers})</Button>
                </div>

                {e.products_obj.length !== 0 &&
                  <>

                    <div className='price'>
                      <Button>Individual Price <br />
                        ${e.products_obj[0]?.product_id?.individual_price ? e.products_obj[0]?.product_id?.individual_price : 0}</Button>
                      <Button>Group Price: <br />
                        ${e.products_obj[0]?.product_id?.group_price ? e.products_obj[0]?.product_id?.group_price : 0}</Button>
                    </div>

                    <div className='reel-items'>
                      <p>{e.products_obj.length}+ More Products</p>
                      <div className='items-box p-2 mt-2'>
                        <img alt='' src={postlUrl + e.products_obj[0]?.product_id._id + "/" + e.products_obj[0].product_id.product_images[0]?.file_name} width="100%" />
                        <del>${e.products_obj[0]?.product_id?.group_price}</del>
                      </div>
                    </div>

                  </>
                }


                <div className='additional-icon'>
                  <div className='additional-box'>

                    {e.products_obj.length !== 0 &&
                      <Button type='button' onClick={() => handelProductDetail(e.products_obj[0]?.product_id?._id && e.products_obj[0]?.product_id?._id)}  >
                        <img alt='' src='./img/for_you/doc.png' />
                      </Button>
                    }


                    <Button>
                      {e.is_like == 0 && <img alt='' onClick={() => LikeDissliek(e._id)} src='./img/for_you/like.png' />}
                      {e.is_like == 1 && <img alt='' onClick={() => LikeDissliek(e._id)} src='./img/for_you/liked.png' />}
                      <p>{e.total_like}</p>
                    </Button>

                    {/* <Button>
                      <img alt='' src='./img/for_you/dlike.png' />
                      <p>{e.total_like}</p>
                    </Button> */}

                    <Button onClick={handleCommentsShow}>
                      <img alt='' src='./img/for_you/msg.png' />
                      <p>{e.total_comment}</p>
                    </Button>
                  </div>
                  <div className='additional-box mt-2'>
                    <Button>
                      <img alt='' src='./img/for_you/tip.png' />
                    </Button>
                    {/* <Button>
                            <img alt='' src='./img/for_you/share.png' />
                          </Button>
                          <Button>
                            <img alt='' src='./img/for_you/add.png' />
                          </Button> */}
                    <Button onClick={handleReportShow}>
                      <img alt='' src='./img/for_you/flag.png' />
                    </Button>
                  </div>
                </div>

                {/* <div className='cart-btn-reels'>
                        <Dropdown>
                          <Dropdown.Toggle id="dropdown-basic">
                            <img alt='' src='./img/for_you/cart.png' width="22px" />
                            <img alt='' src='./img/for_you/up.png' width="10px" />
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div> */}
              </div>

            </SwiperSlide>

          ))}
        </Swiper>
        {/* <div className='reels-box position-relative'>
                    <img alt='' src='./img/for_you/reels.png' width="100%" />
                    <div className='user-name px-3'>
                        <div className='d-flex align-items-center gap-2'>
                            <img alt='' src='./img/header/user-pic.png' />
                            <div>
                                <p>Hello, Ali</p>
                                <span>
                                    <img alt='' src='./img/for_you/eye.png' className='me-1' />
                                    13K</span>
                            </div>
                        </div>
                        <Button className='follow-btn'>+ Follow (12K)</Button>
                    </div>
                    <div className='reel-items'>
                        <p>2+ More Products</p>
                        <div className='items-box p-2 mt-2'>
                            <img alt='' src='./img/for_you/item.png' width="100%" />
                            <del>$299,43</del>
                        </div>
                    </div>
                    <div className='additional-icon'>
                        <div className='additional-box'>
                            <Button>
                                <img alt='' src='./img/for_you/doc.png' />
                            </Button>
                            <Button>
                                <img alt='' src='./img/for_you/like.png' />
                                <p>1</p>
                            </Button>
                            <Button>
                                <img alt='' src='./img/for_you/dlike.png' />
                                <p>1</p>
                            </Button>
                            <Button>
                                <img alt='' src='./img/for_you/msg.png' />
                                <p>5</p>
                            </Button>
                        </div>
                        <div className='additional-box mt-2'>
                            <Button>
                                <img alt='' src='./img/for_you/tip.png' />
                            </Button>
                            <Button>
                                <img alt='' src='./img/for_you/share.png' />
                            </Button>
                            <Button>
                                <img alt='' src='./img/for_you/add.png' />
                            </Button>
                            <Button>
                                <img alt='' src='./img/for_you/flag.png' />
                            </Button>
                        </div>
                    </div>
                </div> */}

      </div>

      <Modal show={showComments} onHide={handleCommentsClose} centered className='for_you-modal'>
        <Modal.Body>
          <div className='comment-modal'>
            <h5>Comments</h5>
            {/* <div className='show-all-comments d-flex align-items-center justify-content-center'>
              <p>No Comments yet</p>
            </div> */}
            <div className='show-all-comments'>
              <ul className='mt-4'>
                <li>
                  <div className='d-flex align-items-center gap-3'>
                    <div className='comment-user'>
                      <img src='./img/header/user-pic.png' alt='' width="30px" />
                    </div>
                    <div className='comments-user-name'>
                      <h6>Mercedes Amg GT</h6>
                      <span>it's a super car</span>
                    </div>
                  </div>
                </li>
                <li>
                  <div className='d-flex align-items-center gap-3'>
                    <div className='comment-user'>
                      <img src='./img/header/user-pic.png' alt='' width="30px" />
                    </div>
                    <div className='comments-user-name'>
                      <h6>Mercedes Amg GT</h6>
                      <span>it's a super car it's a super car it's a super car it's a super car</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div className='sent-comment d-flex align-items-center gap-3'>
              <div className='comment-user'>
                <img src='./img/header/user-pic.png' alt='' width="30px" />
              </div>
              <div className='position-relative w-100'>
                <input type='text' placeholder='Your comment..' />
                <Button className='sent-comment-icon'><RiSendPlaneFill /></Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showReport} onHide={handleReportClose} centered className='for_you-modal'>
        <Modal.Body>
          <div className='comment-modal'>
            <h5>Report</h5>
            <Form className='mt-3'>
              <div className='login-input text-start'>
                <label>Report Type</label>
                <input placeholder='Content' type='text' />
              </div>
              <div className='login-input text-start mt-3'>
                <label>Description</label>
                <textarea placeholder='Describe your report here' rows={5} />
              </div>
              <Button className='submit-btn mt-3 w-100'>Send</Button>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
      <InstallApp show={show} Hide={handleClose} />

    </Layout>

  )
}

export default ForYou

