import React, { useRef, useState, useEffect } from 'react'
import Layout from '../layout/Layout'
import { Button, Dropdown } from 'react-bootstrap'
import { POSTSList } from "../helper/endpoints";
import { useNavigate } from 'react-router-dom'
import api from "../helper/api";
import { getServerURL } from '../helper/envConfig';

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Mousewheel } from "swiper";

const ForYou = () => {

    const navigate = useNavigate();
    const [postList, setPostList] = useState([]);
    const serverURL = getServerURL();
    const [page, setPage] = useState(1);

    const videoRef = useRef(null);
  
    useEffect(() => {
      const videoElement = videoRef.current;
  
      const playVideo = () => {
        if (videoElement && videoElement.readyState === 4) {
          videoElement.play().catch((error) => {
            console.error('Error playing video:', error);
          });
        }
      };
  
      const pauseVideo = () => {
        if (videoElement) {
          videoElement.pause();
        }
      };
  
      const handleCanPlay = () => {
        playVideo();
      };
  
      if (videoElement) {
        videoElement.addEventListener('canplay', handleCanPlay);
      }
  
      // Cleanup function
      return () => {
        pauseVideo();
        if (videoElement) {
          videoElement.removeEventListener('canplay', handleCanPlay);
        }
      };
    }, []);

    const getCategory = async () => {
        try {
            const [postListResponse] = await Promise.all([
            api.get(`${serverURL + POSTSList + `?action=list&page=${page}` }`),
            ]);

            const postsData = postListResponse.data.data.postList;
            setPostList(postsData);

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCategory();
    }, [page]);


    return (

                            <Layout>
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
                                >

{
                                postList && postList?.slice(6, 10).map((e,i) => {
                                    return (
                                        
<>
        <SwiperSlide key={i}>
          <div className='reels-box position-relative'>
            <video
              width="100%"
              height="100%"
              controlsList="nodownload"
              id={i}
              webkit-playsInline
              loop
              playsInline
              preload="yes"
              autoPlay // Enable autoplay
            //   muted // Remove this line if you want sound
              controls
            >
              <source src={e.post_video_link} type="video/mp4" />
            </video>
            {/* Rest of the code */}
          </div>
        </SwiperSlide>
      </>
                       )
                    })
                }

                                </Swiper>
                            </div>
                        </Layout>

    )
}

export default ForYou

