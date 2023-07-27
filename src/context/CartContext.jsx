import React, { useRef, createContext, useState } from 'react';
import { WISHLIST, PRODUCTCATEGORY, PRODUCTList, ADDTOCART } from '../helper/endpoints';
import { getServerURL } from '../helper/envConfig';
import api from '../helper/api';
import { Is_Login } from '../helper/IsLogin'
import { errorResponse, afterLogin } from '../helper/constants';
import { data } from 'jquery';
import { isMobile } from 'react-device-detect';

// Create the cart context
export const CartContext = createContext();

// Create a provider component to wrap your app
export const CartProvider = ({ children }) => {
  const isLoggedIn = Is_Login();
  const [cart, setCart] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [Mymessage, setMyMessage] = useState("");
  const [wishlist, setWishList] = useState([]);
  // Initialize your state and other values...
  // const [isWishlist, setIsWishlist] = useState(false); // Initialize the state as false or as per your requirement
  const [sucessSnackBarOpen, setSucessSnackBarOpen] = useState(false);
  const [warningSnackBarOpen, setWarningSnackBarOpen] = useState(false);
  const [wishProductUrl, setWishProductURL] = useState("");
  const [userProductList, setUserProductList] = useState([]);
  const [category, setcategory] = useState([]);
  const [categoryHome, setcategoryHome] = useState([]);
  const [categoryWeb, setCategoryWeb] = useState([]);
  const [sellingCategory, setSellingCategory] = useState({});
  const [myAddress, setMyAddess] = useState([]);
  const [correntAddess, setCorrentAddess] = useState({});

  const [currentUser, setCorrectUser] = useState("");
  const [productList, setProductList] = useState([]);
  const [trendingProductList, setTrendingProductList] = useState([]);


  const [loading, setLoading] = useState(true);
  const [sellProLoading, setSellProLoading] = useState(false);
  const [mainloder, setMainLoder] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [ProductLoading, setProductLoading] = useState(false);
  const [catwebLoading, setCatwebLoading] = useState(false);


  const [womanProductList, setWomanProductList] = useState([]);
  const [manProductList, setManProductList] = useState([]);
  const [kidsProductList, setkidsProductList] = useState([]);
  const [favoriteProductList, setFavoriteProductList] = useState([]);
  const [womanpage, setWomanPage] = useState(1);
  const [manpage, setManPage] = useState(1);
  const [kidspage, setKidPage] = useState(1);
  const [favoritepage, setFavoritePage] = useState(1);
  const [sellProducUrl, setSellProducUrl] = useState("");
  const [viewMoreLodr, setViewmoreLoder] = useState(false);
  const [profileOption, setProfileOption] = useState();
  const [sellIs_wished, setSellIs_wished] = useState(0);
  const [add_wished_Called, setAdd_wished_Called] = useState(false);
  const [itemShow, setItemShow] = useState(false);
  const [searchKeyWord, setSearchKeyWord] = useState("");
  const [searchpostList, setSearchPostList] = useState([]);
  const [searchPage, setSearchPage] = useState(1);
  const [searchUrl, setSearchURL] = useState("");
  const [is_search, setIs_search] = useState(0);




  const serverURL = getServerURL();
  const player = useRef();
  const mainplayer = useRef();
  const [activeImage, setActiveImage] = useState("")

  const [couponId, setCouponId] = useState([]);
  const [cartList, setCartList] = useState([]);

  //group price state
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [perActive, setPerActive] = useState('Individual');

  //drawer
  const [drawer, setDrawer] = useState(false);
  const handleDrawerClose = () => setDrawer(false);
  const handleDrawerShow = () => setDrawer(true);

  const startAnimation = () => {
    if (player.current) {
      player.current.play(); // Check if player.current is not null before accessing play()
    }
  };

  const stopAnimation = () => {
    setLoading(false);
  };


  const mainstartAnimation = () => {
    if (mainplayer.current) {
      mainplayer.current.play(); // Check if player.current is not null before accessing play()
    }
  };

  const mainstopAnimation = () => {
    setMainLoder(false);
  };


  //category page 
  const playercategory = useRef();

  const startAnimationcategory = () => {
    if (playercategory.current) {
      playercategory.current.play(); // Check if player.current is not null before accessing play()
    }
  };

  const stopAnimationcategory = () => {
    setLoadingCategory(false);
  };

  const addWishList = async (id, action) => {
    try {
      startAnimation()
      if (isLoggedIn) {
        var data = {
          action: action,
          product_id: id
        }
        const res = await api.postWithToken(`${serverURL + WISHLIST}`, data)
        if (res.data.success == true) {
          setMyMessage(res.data.message);
          setSucessSnackBarOpen(!sucessSnackBarOpen);
          setSellIs_wished(sellIs_wished + 1)
          setAdd_wished_Called(true)
          // getSellProducts()
          // getProducts()
          // getWishList()
        } else {
          setMyMessage(res.data.message);
          setWarningSnackBarOpen(!warningSnackBarOpen);
        }

      } else {
        // User is not logged in, redirect to the login page
        afterLogin(setMyMessage);
        setWarningSnackBarOpen(!warningSnackBarOpen);
      }
      stopAnimation()
    } catch (error) {
      console.log(error);
      errorResponse(error, setMyMessage);
    }
  };

  const getWishList = async () => {

    try {
      if (isLoggedIn) {
        startAnimation()
        setLoading(true)
        const res = await api.postWithToken(`${serverURL + WISHLIST}`, { "action": "my-wishlist-list" })
        setWishList(res.data.data.list)
        setWishlistCount(res.data.data.list.length)
        setWishProductURL(res.data.data.productImagePath)
        stopAnimation()
      }
    } catch (error) {
      console.log(error, "error");
      if (window.location.pathname == "/wishlist") {
        errorResponse(error, setMyMessage);
        setWarningSnackBarOpen(!warningSnackBarOpen);
      }
    }

  };

  // const handleWishlistClick = async (productId) => {
  //   const newWishlistStatus = !isWishlist;
  //   setIsWishlist(newWishlistStatus); // Update the local state

  //   // Then update the context or the backend asynchronously
  //   if (newWishlistStatus) {
  //     await addWishList(productId, "product-wishlist"); // Add to wishlist
  //   } else {
  //     await addWishList(productId, "product-delete-wishlist"); // Remove from wishlist
  //   }
  // }

  const deleteWishList = async (id) => {
    startAnimation()
    try {
      const res = await api.postWithToken(`${serverURL + WISHLIST}`, { "action": "product-delete-wishlist", "product_id": id })
      if (res.data.success == true) {
        setMyMessage(res.data.message);
        setSucessSnackBarOpen(!sucessSnackBarOpen);
        getWishList()
        // getProducts()
      } else {
        setMyMessage(res.data.message);
        setWarningSnackBarOpen(!warningSnackBarOpen);
      }

      // setWishList(res.data.data.list)

      stopAnimation()
    } catch (error) {
      errorResponse(error, setMyMessage);
      setWarningSnackBarOpen(!warningSnackBarOpen);
    }
  };

  const getMyAddress = async () => {
    startAnimation()
    try {
      const res = await api.postWithToken(`${serverURL + "shipping-address-manage"}`, { "action": "shipping-address-list" })
      setMyAddess(res.data.data.userData)
      let data = res.data.data?.userData.filter((e) => e.is_default == 1)
      if (data.length !== 0) {
        const res2 = await api.postWithToken(`${serverURL + "shipping-method-manage"}`, {
          "action": "list",
          "country_id": data[0].country_id._id
        })
        setCorrentAddess({ data: data, shipping_method_id: res2.data.data?.list[0]?._id })
      } else {
        setCorrentAddess("")
      }

      stopAnimation()
    } catch (error) {
      console.log(error)
      // errorResponse(error, setMyMessage);
      // setWarningSnackBarOpen(!warningSnackBarOpen);
    }
  };

  const getProducts = async () => {
    try {
      startAnimation()
      setProductLoading(true)
      const apiTyp = isLoggedIn ? api.postWithToken : api.post;

      if (window.location.pathname == "/selling") {
        var [trendingproductListResponse, productListResponse, categoryResponse, userProductList] = await Promise.all([
          apiTyp(`${serverURL + PRODUCTList}`, { "product_list_type": "trending-product" }),
          // apiTyp(`${serverURL + PRODUCTList}`, { "product_list_type": "flashsale-products" }),
          // api.post(`${serverURL + PRODUCTCATEGORY}`, { action: "category" }),
          // api.post(`${serverURL + PRODUCTList}`, { product_list_type: "user-product-list", user_id: "63906926deb5464a1ed67770" })
        ]);
        var trendingproductData = trendingproductListResponse.data.data
        setTrendingProductList(trendingproductData)
      } else {
        var [trendingproductListResponse, productListResponse, categoryResponse, userProductList] = await Promise.all([
          apiTyp(`${serverURL + PRODUCTList}`, { "product_list_type": "trending-product" }),
          apiTyp(`${serverURL + PRODUCTList}`, { "product_list_type": "flashsale-products" }),
          // api.post(`${serverURL + PRODUCTCATEGORY}`, { action: "category" }),
          // api.post(`${serverURL + PRODUCTList}`, { product_list_type: "user-product-list", user_id: "63906926deb5464a1ed67770" })
        ]);
        var productListData = productListResponse.data.data;
        var trendingproductData = trendingproductListResponse.data.data
        setProductList(productListData);
        setTrendingProductList(trendingproductData)
      }

      // const categoryData = categoryResponse.data.data;
      // const userproductData = userProductList.data.data;

      // setcategory(categoryData);


      // setUserProductList(userproductData)

      stopAnimation()
      setProductLoading(false)
    } catch (error) {
      console.log(error);
    }
  };

  //categoryweb loding 
  const playercategoryweb = useRef();

  const startAnimationcategoryweb = () => {
    if (playercategoryweb.current) {
      playercategoryweb.current.play(); // Check if player.current is not null before accessing play()
    }
  };

  const stopAnimationcategoryweb = () => {
    setCatwebLoading(false);
  };

  const getCategoryWeb = async () => {
    startAnimation()
    startAnimationcategoryweb()
    setCatwebLoading(true)
    try {
      const [categoryResponse] = await Promise.all([
        api.post(`${serverURL + PRODUCTCATEGORY}`, { action: "sub-category" })
      ]);
      const categoryData = categoryResponse.data.data;
      //for random category
      const randomIndices = [];

      const maxIndex = categoryData.productsCategoryList?.length - 1;

      while (randomIndices.length < 3) {
        const randomIndex = Math.floor(Math.random() * maxIndex);
        if (!randomIndices.includes(randomIndex)) {
          randomIndices.push(randomIndex);
        }
      }

      const sellingCategory = {
        first: {
          _id: categoryData.productsCategoryList[randomIndices[0]]?._id,
          name: categoryData.productsCategoryList[randomIndices[0]]?.child[0]?.name,
          id: categoryData.productsCategoryList[randomIndices[0]]?.child[0]?._id,
        },
        second: {
          _id: categoryData.productsCategoryList[randomIndices[1]]?._id,
          name: categoryData.productsCategoryList[randomIndices[1]]?.child[0]?.name,
          id: categoryData.productsCategoryList[randomIndices[1]]?.child[0]?._id,
        },
        third: {
          _id: categoryData.productsCategoryList[randomIndices[2]]?._id,
          name: categoryData.productsCategoryList[randomIndices[2]]?.child[0]?.name,
          id: categoryData.productsCategoryList[randomIndices[2]]?.child[0]?._id,
        },
      };

      setSellingCategory(sellingCategory)
      // Divide the category list into two parts
      const halfwayIndex = Math.ceil(categoryData.productsCategoryList && categoryData?.productsCategoryList.length / 2);
      const firstHalf = categoryData.productsCategoryList?.slice(0, halfwayIndex);
      const secondHalf = categoryData.productsCategoryList?.slice(halfwayIndex);
      // Set the first half and second half of categories
      setCategoryWeb({ firstHalf, secondHalf, productsCategoryIconPath: categoryData?.productImagePath, categoryData: categoryData.productsCategoryList });
      stopAnimationcategoryweb()
      setCatwebLoading(false)
      stopAnimation()

    } catch (error) {
      console.log(error);
    }
  };

  //sellproduct loding 
  const playersellproduct = useRef();

  const startAnimationsellpro = () => {
    if (playersellproduct.current) {
      playersellproduct.current.play(); // Check if player.current is not null before accessing play()
    }
  };

  const stopAnimationsellpro = () => {
    setSellProLoading(false);
  };


  const getSellProducts = async () => {
    try {

      // startAnimation()
      startAnimationsellpro()
      setSellProLoading(true)
      const apiTyp = isLoggedIn ? api.postWithToken : api.post;
      const [womenCategory, menCategory, kidCategory, favorites] = await Promise.all([
        apiTyp(`${serverURL + PRODUCTList}`, {
          product_list_type: "by-categories",
          product_category_one_id: sellingCategory?.first?._id,
          product_category_two_id: sellingCategory?.first?.id,
          page: womanpage
        }),
        apiTyp(`${serverURL + PRODUCTList}`, {
          product_list_type: "by-categories",
          product_category_one_id: sellingCategory?.second?._id,
          product_category_two_id: sellingCategory?.second?.id,
          page: kidspage
        }),
        apiTyp(`${serverURL + PRODUCTList}`, {
          product_list_type: "by-categories",
          product_category_one_id: sellingCategory?.third?._id,
          product_category_two_id: sellingCategory?.third?.id,
          page: manpage
        }),
        apiTyp(`${serverURL + PRODUCTList}`, {
          product_list_type: "flashsale-products",
          page: favoritepage
        })
      ]);
      const womanproductData = womenCategory.data.data;
      const manproductData = menCategory.data.data;
      const kidsproductData = kidCategory.data.data;
      const favoriteproductData = favorites.data.data;
      setSellProducUrl(womanproductData?.productImagePath);

      // if (sellIs_wished >= 1) {
      setWomanProductList(womanproductData?.productListArrObj);
      setManProductList(manproductData?.productListArrObj);
      setkidsProductList(kidsproductData?.productListArrObj);
      setFavoriteProductList(favoriteproductData?.productListArrObj)

      // } else if(sellIs_wished === 0){
      //   // Merge products without repetitions
      //   const updatedWomanProductList = [...womanProductList, ...womanproductData.productListArrObj]
      //     .filter((product, index, self) => self.findIndex(p => p._id === product._id) === index);
      //   const updatedManProductList = [...manProductList, ...manproductData.productListArrObj]
      //     .filter((product, index, self) => self.findIndex(p => p._id === product._id) === index);
      //   const updatedKidsProductList = [...kidsProductList, ...kidsproductData.productListArrObj]
      //     .filter((product, index, self) => self.findIndex(p => p._id === product._id) === index);
      //   const updatedfavoriteProductList = [...favoriteProductList, ...favoriteproductData.productListArrObj]
      //     .filter((product, index, self) => self.findIndex(p => p._id === product._id) === index);
      //   setWomanProductList(updatedWomanProductList);
      //   setManProductList(updatedManProductList);
      //   setkidsProductList(updatedKidsProductList);
      //   setFavoriteProductList(updatedfavoriteProductList)
      // }
      // stopAnimation()

      stopAnimationsellpro()
      setViewmoreLoder(false)
      setSellProLoading(false)
    } catch (error) {
      console.log(error);
    }
  };

  const getSearchedProduct = async () => {
    try {
      const apiTyp = isLoggedIn ? api.postWithToken : api.post;
      setLoading(true)
      if (searchKeyWord) {
        let search = searchKeyWord
        handelSearch(search)
        const [postListResponse] = await Promise.all([
          apiTyp(`${serverURL + "search"}`, {
            q: search,
            search_type: "product",
            page: searchPage,
          }),
        ]);
        const postsData = postListResponse.data;
        if (postsData && Array.isArray(postsData.data)) {
          if (is_search === 0) {
            const updatedProductList = [
              ...searchpostList,
              ...postsData.data,
            ].filter(
              (product, index, self) =>
                self.findIndex((p) => p._id === product._id) === index
            );
            setSearchPostList(updatedProductList);
          } else {
            setSearchPostList(postsData.data);
          }
          setSearchURL(postsData.productImagePath);
          setViewmoreLoder(false);
          setLoading(false)

        } else {
          stopAnimation();
        }
      } else {
        setSearchPostList([])
        setSearchURL()
        setViewmoreLoder(false);
        setLoading(false)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handelwishSell = (mood) => {
    setSellIs_wished(0)
  }

  const getCartData = async () => {

    try {
      if (isLoggedIn) {

        startAnimation()
        // setMainLoder(true)
        const [poroductResponse] = await Promise.all([
          api.postWithToken(`${serverURL + ADDTOCART}`, { "action": "cart-list" }),

        ]);

        const poroductData = poroductResponse.data.data;
        setCart(poroductResponse.data.data.list?.length)
        let ids = poroductData.list?.map((e) => e._id)
        setCouponId(ids)
        setCartList(poroductData);
        stopAnimation()
        // setMainLoder(false)
      }
    } catch (error) {
      console.log(error);
      if (window.location.pathname == "/cart") {
        errorResponse(error, setMyMessage);
        setWarningSnackBarOpen(!warningSnackBarOpen);
      }
    }
  };

  const handelSearch = (search) => {
    localStorage.setItem("search", search);
    setIs_search(1)
  };

  // dynamic link functions 
  const call = (link) => {
    window.open(link, '_blank');
  };

  const generateDynamicLink = async (productId) => {
    const response = await api.post(

      `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${process.env.REACT_APP_API_FIREBASE}`,
      {
        "dynamicLinkInfo": {
          "domainUriPrefix": "https://clubmall.page.link",
          "link": `https://www.clubmall.com/product-details/${productId}?w=g`,
          "androidInfo": {
            "androidPackageName": "com.clubmall"
          },
          "iosInfo": {
            "iosBundleId": "com.clubmall"
          }
        },
        "suffix": {
          "option": "SHORT"
        }
      }
    );
    call(response.data.shortLink)
  };

  //chnage for redirect ios user
  // const generateDynamicLink = async (productId) => {
  //   const response = await api.post(
  //     `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${process.env.REACT_APP_API_FIREBASE}`,
  //     {
  //       "dynamicLinkInfo": {
  //         "domainUriPrefix": "https://clubmall.page.link",
  //         "link": `https://www.clubmall.com/product-details/${productId}?w=g`,
  //         "androidInfo": {
  //           "androidPackageName": "com.clubmall"
  //         },
  //         "iosInfo": {
  //           "iosBundleId": "com.clubmall",
  //           "iosFallbackLink": "https://apps.apple.com/app/clubmall/id6444752184"
  //         }
  //       },
  //       "suffix": {
  //         "option": "SHORT"
  //       }
  //     }
  //   );
  //   call(response.data.shortLink)
  // };


  // dynamic link functions ---- end -----


  return (

    <CartContext.Provider value={{
      handleDrawerShow, handleDrawerClose, drawer,
      playersellproduct, startAnimationsellpro, stopAnimationsellpro, playercategoryweb, startAnimationcategoryweb, stopAnimationcategoryweb
      , categoryHome, setcategoryHome, categoryLoading, setCategoryLoading, catwebLoading, setCatwebLoading, ProductLoading, setProductLoading, sellProLoading, setSellProLoading,
      mainloder, setMainLoder, mainstopAnimation, mainstartAnimation, mainplayer,
      generateDynamicLink, setMyMessage,
      itemShow, setItemShow, getCartData, setCartList, setCouponId, cartList, couponId, setAdd_wished_Called, add_wished_Called, deleteWishList, player, handelwishSell, sellIs_wished, activeImage, setActiveImage, setIs_search, handelSearch, searchUrl, searchPage, searchKeyWord, setSearchKeyWord, searchpostList, setSearchPage, searchUrl, getSearchedProduct, profileOption, setProfileOption, viewMoreLodr, setViewmoreLoder, sellProducUrl, setFavoritePage, setKidPage, setManPage, setWomanPage, favoritepage, kidspage, manpage, womanpage, favoriteProductList, kidsProductList, manProductList, womanProductList, getSellProducts, correntAddess, myAddress, getMyAddress, sellingCategory, stopAnimationcategory, startAnimationcategory, playercategory, loadingCategory, setLoadingCategory, startAnimation, stopAnimation, player, cart, setCart, addWishList, sucessSnackBarOpen, warningSnackBarOpen, Mymessage,
      setSucessSnackBarOpen, setWarningSnackBarOpen, getWishList, wishlist, getProducts, wishProductUrl, category, currentUser,
      productList, trendingProductList, loading, setLoading, wishlistCount, userProductList, getCategoryWeb, categoryWeb
    }}>
      {children}
    </CartContext.Provider>

  );
};