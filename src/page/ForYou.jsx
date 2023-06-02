import React, { useRef, useState, useEffect } from 'react'
import Layout from '../layout/Layout'
import { Button, Dropdown } from 'react-bootstrap'
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

const ForYou = () => {
  const POST_URL = process.env.REACT_APP_POST_URL
  const swiperRef = useRef(null);
  const defaultProfile = 'http://backend.clubmall.com/uploads/profile-images/profile_image-1669788396576.png'
  const [postList, setPostList] = useState([]);
  const serverURL = getServerURL();
  const [page, setPage] = useState(1);
  const [profilUrl, setProfileUrl] = useState(" ");
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const currentPageRef = useRef(page);
  const [loading, setLoading] = useState(true);
  const player = useRef();
  var totalPages = 9
  const startAnimation = () => {
    if (player.current) {
      player.current.play(); // Check if player.current is not null before accessing play()
    }
  };
  const stopAnimation = () => {
    setLoading(false);
  };

  const getCategory = async () => {
    startAnimation();
    try {
      const [postListResponse] = await Promise.all([
        api.get(`${serverURL + POSTSList + `?action=list&page=${page}`}`),
      ]);
      setProfileUrl(postListResponse.data.data.productImagePath);
      const postsData = postListResponse.data.data.postList;
      totalPages = postsData.length
      setPostList(postsData);
      setIsFetching(false);
      stopAnimation();
    } catch (error) {
      console.log(error);
    }
  };

  function isVideo(url) {
    return /\.(mp4|webm|ogg)$/i.test(url);
  }

  const handleSlideChange = (swiper) => {
    setCurrentVideoIndex(swiper.activeIndex);

    // Check if the last video is being rendered
    // if (swiper.activeIndex === postList.length - 1) {
    //   if (page < totalPages) {
    //     setIsFetching(true);
    //     setPage((prevPage) => prevPage + 1);
    //     setCurrentVideoIndex(0); // Redirect user to the first video on the new page
    //   } else {
    //     console.log("Last video on the last page");
    //   }
    // }
    // Check if the first video is being rendered
    if (swiper.activeIndex === 0 && page > 1) {
      setCurrentVideoIndex(0); // Reset the current video index to 0
      setIsFetching(true);
      setPage((prevPage) => prevPage - 1);
    }

    // Redirect user to the top of the video when page changes and new data is loaded
    // if (
    //   swiperRef.current &&
    //   swiper.activeIndex === 0 &&
    //   page > 1 &&
    //   swiper.isEnd
    // ) {
    //   setTimeout(() => {
    //     swiperRef.current.slideTo(0, 0);
    //   }, 100);
    // }
  };

  const LikeDissliek = async (post_id) => {
    try {
      const likeDislike = await api.postWithToken(`${serverURL + "post-like-dislike "}`, { post_id: post_id });
      getCategory();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategory();
  }, [page]);

  return (

    <Layout>

      {
        loading ? <Loader startAnimation={startAnimation} stopAnimation={stopAnimation} player={player} /> : (
          <>
            <div className='for-you'>

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
                    <div className='reels-box position-relative'>
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
                          <img alt='profile' width="34px" height="34px" style={{ borderRadius: "50%", objectFit: "cover" }} src={e.user_profile ? e.user_profile : defaultProfile} />
                          <div>
                            <p>{e.user_name}</p>
                            {/* <span>
                              <img alt='' src='./img/for_you/eye.png' className='me-1' />
                              13K</span> */}
                          </div>
                        </div>
                        <Button className='follow-btn'>+ Follow ({e.total_followers})</Button>
                      </div>
                      {/* <div className='price'>
                    <Button>Individual Price <br />
                      ${e.products_obj[0]?.product_id?.individual_price ? e.products_obj[0]?.product_id?.individual_price : 0}</Button>
                    <Button>Group Price: <br />
                      ${e.products_obj[0]?.product_id?.group_price ? e.products_obj[0]?.product_id?.group_price : 0}</Button>
                  </div> */}
                      {e.products_obj.length !== 0 &&

                        <div className='reel-items'>
                          <p>{e.products_obj.length}+ More Products</p>
                          <div className='items-box p-2 mt-2'>
                            <img alt='' src={POST_URL + e.products_obj[0]?.product_id._id + "/" + e.products_obj[0].product_id.product_images[0]?.file_name} width="100%" />
                            <del>$299,43</del>
                          </div>
                        </div>}
                      <div className='additional-icon'>
                        <div className='additional-box'>

                          {e.products_obj.length !== 0 &&
                            <Button>
                              <img alt='' src='./img/for_you/doc.png' />
                            </Button>
                          }

                          <Button>
                            <img alt='' onClick={() => LikeDissliek(e._id)} src='./img/for_you/like.png' />
                            <p>1</p>
                          </Button>
                          {/* <Button>
                      <img alt='' src='./img/for_you/dlike.png' />
                      <p>{e.total_like}</p>
                    </Button> */}
                          <Button>
                            <img alt='' src='./img/for_you/msg.png' />
                            <p>{e.total_comment}</p>
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
                      <div className='cart-btn-reels'>
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
                      </div>
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
          </>
        )}
    </Layout>

  )
}

export default ForYou

