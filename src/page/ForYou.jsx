import React, { useRef, useState, useEffect, useContext } from 'react'
import { Button, Form, Modal, NavLink } from 'react-bootstrap'
import { POSTSList } from "../helper/endpoints";
import api from "../helper/api";
import { getServerURL } from '../helper/envConfig';
import ReactPlayer from 'react-player';
import { Swiper, SwiperSlide } from "swiper/react";
import Loader from '../components/Loader';
import "swiper/css";
import "swiper/css/pagination";
import { Mousewheel } from "swiper";
import { Is_Login } from '../helper/IsLogin'
import { errorResponse, afterLogin, handelProductDetail } from '../helper/constants'
import { RiSendPlaneFill } from "react-icons/ri"
import { MdOutlineClose } from 'react-icons/md'
import { Rating } from '@mui/material';
import { MdDelete } from 'react-icons/md'
import { CartContext } from '../context/CartContext'
import { isMobile } from 'react-device-detect';
import axios from 'axios';
import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RWebShare } from 'react-web-share';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare } from '@fortawesome/free-solid-svg-icons';
// import SucessSnackBar from "../components/SnackBar";
// import ErrorSnackBar from "../components/SnackBar";
const SucessSnackBar = React.lazy(() => import('../components/SnackBar'));
const ErrorSnackBar = React.lazy(() => import('../components/SnackBar'));


const ForYou = () => {

  const { setMainLoder, setShow, generateDynamicLink } = useContext(CartContext);
  const location = useLocation();
  const [perActive, setPerActive] = useState('Individual');
  const isLoggedIn = Is_Login();
  const navigate = useNavigate();
  const swiperRef = useRef(null);
  const defaultProfile = `./img/for_you/defaultuser.png`
  const Userprofile = localStorage.getItem("profile_image") ? localStorage.getItem("profile_image") : defaultProfile
  const UserId = localStorage.getItem("user") && localStorage.getItem("user")
  const [postList, setPostList] = useState([]);
  const [sucessSnackBarOpen, setSucessSnackBarOpen] = useState(false);
  const [warningSnackBarOpen, setWarningSnackBarOpen] = useState(false);
  const serverURL = getServerURL();
  const [page, setPage] = useState(1);
  const [profilUrl, setProfileUrl] = useState(" ");
  const [postlUrl, setPostUrl] = useState(" ");
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [Mymessage, setMyMessage] = useState("");
  const [totalPages, setTotalPages] = useState(1000); // Declare totalPages state variable
  const [modelCount, setModelCount] = useState(1); // Declare totalPages state variable
  const player = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modelData, setMyModelData] = useState("");
  const [comment, setCommnet] = useState(null);
  const [postId, setPostId] = useState(null);
  const [report, setReport] = useState({});
  const [muted, setMuted] = useState(true);
  const [playerRefs, setPlayerRefs] = useState({});
  const [currentVideoId, setCurrentVideoId] = useState();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const playerRef = useRef();
  const [showComments, setShowComments] = useState(false);
  
  const handleCommentsClose = () => {
    setCommnet(" ")
    setShowComments(false);
  }

  const [showAppDownload, setShowAppDownload] = useState(false);
  const handleAppDownloadShow = () => setShowAppDownload(true);
  const handleAppDownloadClose = () => setShowAppDownload(false);
  const [showProduct, setShowProduct] = useState(false);

  const handleProductShow = (data) => {
    setShowProduct(true);
    setMyModelData(data)
  }
  const handleProductClose = () => {
    setMyModelData("")
    setShowProduct(false);
  }
  const [showReport, setShowReport] = useState(false);

  const handleReportClose = () => {
    setReport({})
    setShowReport(false);
    setPostId(null)
  }

  const handleReportShow = (id) => {
    setShowReport(true)
    setPostId(id)
  }

  const handleClose = () => {
    setIsModalOpen(false);
    setShow(false);
    setCommnet("")
  };

  const handleShow = () => {
    if(modelCount <= 1){
      setIsModalOpen(true);
      setShow(true);
      setModelCount(modelCount + 1)
    }
  };


  const startAnimation = () => {
    if (player.current) {
      player.current.play(); // Check if player.current is not null before accessing play()
    }
  };

  const stopAnimation = () => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }

  const handleCommentsShow = async (id) => {
    startAnimation();

    try {
      if (isLoggedIn) {
        setShowComments(true)
        setIsFetching(true)
        const commentListResponse = await api.postWithToken(`${serverURL + "post-comment-list"}`, { post_id: id })
        setPostId(id)
        setProfileUrl(commentListResponse.data.data.profileImagePath)
        const postsCommentData = commentListResponse.data.data.postsComment;
        setMyModelData(postsCommentData)
        setIsFetching(false);
        stopAnimation();
      } else {
        // User is not logged in, redirect to the login page
        afterLogin(setMyMessage);
        setWarningSnackBarOpen(!warningSnackBarOpen);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPostsStatic = async () => {
    try {
      const postListResponse = await axios.get(`${serverURL + POSTSList + `?action=list&page=${1}`}`);
      setPostUrl(postListResponse.data.data.productImagePath)
      const postsData = postListResponse.data.data.postList;
      setPostList(postsData.slice(0, 4));
    } catch (error) {
      console.log(error);
    }
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
      const updatedfavoriteProductList = [...postList, ...postsData]
        .filter((product, index, self) => self.findIndex(p => p._id === product._id) === index);
      // if (!isLoggedIn) {
      // setPostList(updatedfavoriteProductList.slice(0, 4));
      // } else {
      setPostList(updatedfavoriteProductList);
      // }
      setIsFetching(false);
      stopAnimation();
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    // if (isLoggedIn) {
    getPosts();
    // }
  }, [page, isLoggedIn, currentVideoId]);

  function isVideo(url) {
    return url && /\.(mp4|webm|ogg)$/i.test(url);
  }

  const handleSlideChange = useCallback((swiper) => {
    setCurrentVideoIndex(swiper.activeIndex);
    setCurrentVideoId(postList[swiper.activeIndex]._id)
    if (swiper.activeIndex === postList.length - 3) {
      // if (isLoggedIn && swiper.activeIndex === postList.length - 3) {
      if (swiper.activeIndex === postList.length - 3) {
        if (page < totalPages) {
          setIsFetching(true);
          setPage((prevPage) => prevPage + 1);
          setCurrentVideoIndex(0);
        } else {
          console.log("Last video on the last page");
        }
      }

      if (swiper.activeIndex === 0 && page > 1) {
        setCurrentVideoIndex(0); // Reset the current video index to 0
        setIsFetching(true);
        setPage((prevPage) => prevPage - 1);
      }
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
    } 
    if (swiper.activeIndex % 3 === 0 && swiper.activeIndex !== 0) {
      setShowAppDownload(true);
    }
    else if ( swiper.activeIndex === 3) {
      handleShow()
    }
  }, [isLoggedIn, postList, page, totalPages]);


  const followUnfollow = async (user_id) => {
    try {
      if (isLoggedIn) {
        setMainLoder(true)
        const res = await api.postWithToken(`${serverURL + "user-follow-unfollow"}`, { following: user_id });
        if (res.data.success === true) {
          setMyMessage(res.data.message);
          setSucessSnackBarOpen(!sucessSnackBarOpen);
          const updatedPostList = postList.map((post) => {
            if (post.user_id === user_id) {
              return {
                ...post,
                is_follower: post.is_follower === 1 ? 0 : 1,
                total_followers: post.is_follower === 1 ? post.total_followers - 1 : post.total_followers + 1,
              };
            }
            return post;
          });
          setPostList(updatedPostList);

        } else if (res.data.success === false) {
          setMyMessage(res.data.message);
          setWarningSnackBarOpen(!warningSnackBarOpen);
        }
        setMainLoder(false)
      } else {
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
        setMainLoder(true)
        const res = await api.postWithToken(`${serverURL}post-like-dislike`, { post_id: post_id });
        if (res.data.success === true) {
          setSucessSnackBarOpen(!sucessSnackBarOpen);
          setMyMessage(res.data.message);
          const postIndex = postList.findIndex((post) => post._id === post_id);
          if (postIndex !== -1) {
            const updatedPost = {
              ...postList[postIndex],
              is_like: postList[postIndex].is_like === 0 ? 1 : 0,
              total_like: postList[postIndex].is_like === 0 ? postList[postIndex].total_like + 1 : postList[postIndex].total_like - 1,
            };
            const updatedPostList = [...postList];
            updatedPostList[postIndex] = updatedPost;
            setPostList(updatedPostList);
          }
        } else if (res.data.success === false) {
          setMyMessage(res.data.message);
          setWarningSnackBarOpen(!warningSnackBarOpen);
        }
        setMainLoder(false)
      } else {
        afterLogin(setMyMessage);
        setWarningSnackBarOpen(!warningSnackBarOpen);
      }
    } catch (error) {
      errorResponse(error, setMyMessage);
      setWarningSnackBarOpen(!warningSnackBarOpen);
    }
  };

  const submitReport = async () => {
    try {
      if (isLoggedIn) {
        setMainLoder(true)
        if (report && report.report_type && report.content && report.report_type !== " ") {
          report.action = "create-post-report"
          report.post_id = postId
          report.is_comment = true

          const res = await api.postWithToken(`${serverURL}report-manage`, report);
          if (res.data.success === true) {
            setMyMessage(res.data.message);
            setSucessSnackBarOpen(!sucessSnackBarOpen);
            setPostList((prevPostList) => prevPostList.filter((post) => post._id !== postId));
            setTimeout(() => {
              handleReportClose()
            }, 1000);

            setCommnet("")
          } else if (res.data.success === false) {
            setMyMessage(res.data.message);
            setWarningSnackBarOpen(!warningSnackBarOpen);
          }
          setMainLoder(false)
        } else {
          setMyMessage("select a report type  and description ");
          setWarningSnackBarOpen(!warningSnackBarOpen);
        }
        setMainLoder(false)
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

  const postComment = async () => {
    try {
      if (isLoggedIn) {
        setMainLoder(true)
        if (comment && comment !== null && comment !== " ") {
          const res = await api.postWithToken(`${serverURL}post-comment-create`, { post_id: postId, content: comment });
          if (res.data.success === true) {
            setSucessSnackBarOpen(!sucessSnackBarOpen);
            setMyMessage(res.data.message);
            // for update count of total comments 
            setPostList((prevPostList) =>
              prevPostList.map((post) =>
                post._id === postId ? { ...post, total_comment: post.total_comment + 1 } : post
              )
            );
            setCommnet("")
            handleCommentsShow(postId)
          } else if (res.data.success === false) {
            setMyMessage(res.data.message);
            setWarningSnackBarOpen(!warningSnackBarOpen);
          }
          setMainLoder(false)
        } else {
          setMyMessage("Enter a comment");
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

  const DeleteComment = async (id) => {
    try {
      if (isLoggedIn) {
        const res = await api.postWithToken(`${serverURL}post-comment-delete`, { post_id: postId, comment_id: id });
        setMainLoder(true)
        if (res.data.success === true) {
          setSucessSnackBarOpen(!sucessSnackBarOpen);
          setMyMessage(res.data.message);
          // for update count of total comments 
          setPostList((prevPostList) =>
            prevPostList.map((post) =>
              post._id === postId ? { ...post, total_comment: post.total_comment - 1 } : post
            )
          );
          handleCommentsShow(postId)
        } else if (res.data.success === false) {
          setMyMessage(res.data.message);
          setWarningSnackBarOpen(!warningSnackBarOpen);
        }
        setMainLoder(false)
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

  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     getPostsStatic();
  //   }
  // }, []);

  const groupPriceShare = (id) => {
    if (isMobile) {
      generateDynamicLink(id)
    } else {
      // If the device is not mobile, log 'false' to the console
      handleShow();
      setPerActive('Group')
    }
  }

  // const handleVolumeChange = ({ played, playedSeconds, loaded, loadedSeconds, volume }) => {
  //   if (muted === false) {
  //     setMuted(true);
  //   } else if (muted === true) {
  //     setMuted(false);
  //   }
  // };

  const toggleMute = () => {
    const newMutedStatus = !muted;
    setMuted(newMutedStatus);
    if (playerRef.current) {
      playerRef.current.getInternalPlayer().muted = newMutedStatus; // Directly set muted property on the player
    }
  };


  return (

    <>
      <h1 className='d-none'></h1>
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
          {postList.length > 0 && postList?.map((e, i) => (
            <SwiperSlide key={i}>
              <div className='reels-box position-relative pointer'>
                {e.post_video_link && isVideo(e.post_video_link) ? (

                    <ReactPlayer
                      url={e.post_video_link}
                      width="100%"
                      height="100%"
                      controls={true}
                      // onPlay={handleOnUnmute}
                      playing={e._id === currentVideoId || (!currentVideoId && i === 0)}
                      // onVolumeChange={handleVolumeChange}
                      muted={muted}
                      volume={0.5} // Set a fixed volume level, as you cannot entirely remove the volume control for all browsers
                      loop={true}
                      config={{
                        file: {
                          attributes: {
                            controlsList: 'nodownload',
                            preload: 'auto',
                            'webkit-playsinline': true,
                            playsInline: 'true', // This is the correct attribute for modern browsers

                          },
                        },
                      }}
                    />
                   
                ) : (
                  <>
                    {/* <img
                  className='reels-img' src={e.post_video_link} alt="Image" /> */}
                    <img
                      className='reels-img'
                      src={e.post_video_link ? e.post_video_link : "./img/placeholder_img.webp"}
                      alt="Image"
                      loading="lazy"
                    />
                  </>
                )}

                <div className='user-name px-3'>
                  <div className='d-flex align-items-center gap-2'>
                    {/* <img alt='profile'
                     className='myprofile' width="34px" height="34px" style={{ borderRadius: "50%", objectFit: "cover" }} src={e.user_profile ? e.user_profile : `${defaultProfile}`} /> */}
                    <img
                      alt='profile'
                      className='myprofile'
                      width="34px"
                      height="34px"
                      style={{ borderRadius: "50%", objectFit: "cover" }}
                      src={e.user_profile ? e.user_profile : `${defaultProfile}`}
                      loading="lazy"
                    />

                    <div>
                      <p>{e.user_name}</p>
                      {/* <span>
                              <img alt='' src='./img/for_you/eye.png' className='me-1' />
                              13K</span> */}
                    </div>
                  </div>
                  <Button className='follow-btn' onClick={() => followUnfollow(e.user_id)}>
                    {e.is_follower === 0 ? "+ Follow" : "Following"} ({e.total_followers})
                  </Button>                </div>
                {e.products_obj?.length !== 0 &&
                  <>
                    {/* <div className='price '>
                      <Button onClick={() =>
                        groupPriceShare(e.products_obj[0]?.product_id?._id)} >Group Price: <br />
                        ${e.products_obj[0]?.product_id?.group_price ? e.products_obj[0]?.product_id?.group_price : 0}</Button>
                               <Button type='button'  style={{width:"90%"}} onClick={() => handelProductDetail(e.products_obj[0]?.product_id?._id && e.products_obj[0]?.product_id?._id)} > Add to cart <br />
                        ${e.products_obj[0]?.product_id?.individual_price ? e.products_obj[0]?.product_id?.individual_price : 0}</Button>
                      <Button type='button' className='active btn btn-primary' style={{width:"90%"}} onClick={() => handelProductDetail(e.products_obj[0]?.product_id?._id && e.products_obj[0]?.product_id?._id)} > Add to cart <br />
                        ${e.products_obj[0]?.product_id?.individual_price ? e.products_obj[0]?.product_id?.individual_price : 0}</Button>
                    </div> */}

                    <div className='reel-items'>
                      <p onClick={() => handleProductShow(e.products_obj)} className='pointer'>{e.products_obj.length}+ More Products</p>
                      <div className='items-box p-2 mt-2'>
                        {/* <img
                          src="./img/placeholder_img.webp"
                          alt=''
                          className='img-fluid'
                          style={{ display: imageLoaded ? 'none' : 'block' }}
                        /> */}
                        {/* <img
                          alt=''
                          className='img-fluid'
                          src="./img/placeholder_img.webp"
                          style={{ display: imageLoaded ? 'none' : 'block' }}
                          loading="lazy"
                        /> */}
                        <img
                          // onLoad={() => setImageLoaded(true)}
                          // style={{ display: imageLoaded ? 'block' : 'none' }}
                          alt=''
                          src={postlUrl + e.products_obj[0]?.product_id?._id + "/" + e.products_obj[0]?.product_id?.product_images[0]?.file_name} width="100%"
                          loading="lazy"
                        />
                        <del>${e.products_obj[0]?.product_id?.group_price}</del>
                      </div>
                    </div>

                  </>
                }

                <div className='additional-icon'>
                  <div className='additional-box'>
                    {e?._id &&
                      <RWebShare
                        data={{
                          text: "Hey! Checkout this amazing post on Clubmall.",
                          url: `${window.location.href}post/${e?._id}`,
                          title: "Clubmall",
                        }}
                        sites={[
                          "facebook",
                          "twitter",
                          "whatsapp",
                          "telegram",
                          "linkedin",
                          "instagram"
                        ]}
                        onClick={() => console.log("shared successfully!")}
                      >
                        <Button>
                        <FontAwesomeIcon icon={faShare} style={{height:'18px'}} />
                        </Button>
                      </RWebShare>

                    }

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

                    <Button onClick={() => handleCommentsShow(e._id)}>
                      <img alt='' src='./img/for_you/msg.png' />
                      <p>{e.total_comment}</p>
                    </Button>
                    <Button onClick={() => handleReportShow(e._id)}>
                      <img alt='' src='./img/for_you/flag.png' />
                    </Button>

                    <Button onClick={toggleMute} className='foryou-voice'>
                      {muted ? <img alt='' src='./img/for_you/mute.png' /> : <img alt='' src='./img/for_you/unmute.png' />}
                    </Button>

                  </div>

                </div>

              </div>

            </SwiperSlide>

          ))}
        </Swiper>

      </div>

      <Modal show={showComments} onHide={handleCommentsClose} centered className='for_you-modal'>
        <Modal.Body>
          <div className='comment-modal position-relative'>
            <Button className='close-modal-btn forgot-pass-close' onClick={handleCommentsClose}>
              <MdOutlineClose />
            </Button>
            <h5>Comments</h5>

            <div className='show-all-comments'>
              <ul className='mt-4'>
                {isFetching ? <p> Loding..... </p> :
                  modelData && modelData?.map((e, i) => (
                    <li>
                      <div className='d-flex align-items-center justify-content-between gap-3'>
                        <div className='d-flex align-items-center  gap-3'>
                          <div className='comment-user'>
                            <img className='myprofile' src={e.user_id?.profile_image ? profilUrl + e.user_id?.profile_image : `${defaultProfile}`}
                              alt='' width="30px" />
                          </div>
                          <div className='comments-user-name'>
                            <h6> {e.user_id?.username}</h6>
                            <span>{e.content}</span>
                          </div>
                        </div>
                        {UserId === e.user_id?._id &&
                          <Button onClick={() => DeleteComment(e?._id)} className='submit-btn delete-comment'>
                            <MdDelete />
                          </Button>
                        }
                      </div>
                    </li>

                  ))
                }
                {(modelData.length <= 0) && (!isFetching) && <p>No Commnets are available</p>}
              </ul>
            </div>
            <div className='sent-comment d-flex align-items-center gap-3'>
              <div className='comment-user'>
                <img className='myprofile' src={Userprofile} alt='' width="30px" />
              </div>
              <div className='position-relative w-100'>
                <input type='text' name='content' value={comment} onChange={(e) => setCommnet(e.target.value)} placeholder='Your  comment..' />
                <Button onClick={postComment} className='sent-comment-icon'><RiSendPlaneFill /></Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showReport} onHide={handleReportClose} centered className='for_you-modal'>
        <Modal.Body>
          <div className='comment-modal position-relative'>
            <Button className='close-modal-btn forgot-pass-close' onClick={handleReportClose}>
              <MdOutlineClose />
            </Button>
            <h5>Report</h5>
            <Form className='mt-3'>
              <div className='login-input text-start'>
                <label>Report Type</label>
                <select value={report.report_type} onChange={(e) => setReport({ ...report, report_type: e.target.value })} className='select-arrow'>
                  <option defaultChecked={true} >Select Report Type</option>
                  <option value="Sexual content" >Sexual content</option>
                  <option value="Child abuse" >Child abuse</option>
                  <option value="Hateful or abusive content" >Hateful or abusive content</option>
                  <option value="Violent or repulsive content"> Violent or repulsive content</option>
                </select>
              </div>
              <div className='login-input text-start mt-3'>
                <label>Description</label>
                <textarea placeholder='Describe your report here' onChange={(e) => setReport({ ...report, content: e.target.value })} rows={5} />
              </div>
              <Button className='submit-btn mt-3 w-100' onClick={submitReport} >Send</Button>
            </Form>
          </div>
        </Modal.Body>
      </Modal>

      {/* <InstallApp show={show} Hide={handleClose} /> */}

      <Modal show={showAppDownload} onHide={handleAppDownloadClose} centered className='welcome-modal'>
        <Modal.Body>
          <div className='text-center p-3 p-sm-4'>
            <img src='./img/modal-logo.png' alt='' />
            <h5 className='my-3'>Get the full experience on <br /> the app</h5>
            <p>Follow you favoritevendor accounts,
              explore new product and message the <br /> vendor</p>
            <div className='d-flex align-items-center justify-content-center gap-2 mt-4 app-download'>
              <NavLink href='https://play.google.com/store/apps/details?id=com.clubmall' target='_blank'>
                <img src='./img/playstore.png' alt='' />
              </NavLink>
              <NavLink href='https://apps.apple.com/us/app/clubmall/id6444752184' target='_blank'>
                <img src='./img/app.png' alt='' />
              </NavLink>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showProduct} onHide={handleProductClose} centered className='for_you-modal product-list-modal'>
        <Modal.Body>
          <div className='product-modal position-relative'>
            <Button className='close-modal-btn forgot-pass-close' onClick={handleProductClose}>
              <MdOutlineClose />
            </Button>
            <h5>Product List</h5>
            <div className='product-list-scroll mt-4' >
              {

                modelData && modelData?.map((e, i) => (

                  <div className='for_you_product d-flex align-items-start gap-3 mt-2'>
                    <div className='cos-img-size'>
                      <img src={postlUrl + e.product_id?._id + "/" + e.product_id?.product_images[0]?.file_name}

                        className='for-you-product-img' />
                    </div>
                    <div className='for-you-product-text w-100'>
                      <h6>  {e.product_id?.name} </h6>

                      <div className='d-flex align-items-center gap-1 my-2'>

                        <Rating name="read-only" value={e.product_id?.rating} readOnly />

                      </div>
                      <div className='price Individual-per mt-3 gap-3 d-flex align-items-center mobile-row' >
                        {/* <Button className={`${perActive === "Group" ? "active" : ""}`} onClick={() => groupPriceShare(e.product_id?._id)}>Group Price <br />
                          ${e.product_id?.group_price} </Button>  */}
                        <Button className={`${perActive === "Individual" ? "active" : ""}`} onClick={() => (setPerActive('Individual'), handelProductDetail(e.product_id?._id && e.product_id?._id))}> Add to cart  <br />
                          $ {e.product_id?.individual_price} </Button>
                      </div>
                    </div>
                  </div>
                ))}

            </div>
          </div>
        </Modal.Body>
      </Modal>

    </>

  )
}

export default ForYou

