import React, { useRef, createContext, useState } from 'react';
import { WISHLIST, PRODUCTCATEGORY, PRODUCTList } from '../helper/endpoints';
import { getServerURL } from '../helper/envConfig';
import api from '../helper/api';
import { Is_Login } from '../helper/IsLogin'
import { errorResponse, afterLogin } from '../helper/constants';
import { useNavigate } from 'react-router-dom'

// Create the cart context
export const CartContext = createContext();

// Create a provider component to wrap your app
export const CartProvider = ({ children }) => {
  const isLoggedIn = Is_Login();
  const [cart, setCart] = useState(0);

  const [wishlistCount, setWishlistCount] = useState(0);

  const [Mymessage, setMyMessage] = useState("");
  const [wishlist, setWishList] = useState([]);
  const [sucessSnackBarOpen, setSucessSnackBarOpen] = useState(false);
  const [warningSnackBarOpen, setWarningSnackBarOpen] = useState(false);
  const [wishProductUrl, setWishProductURL] = useState("");
  const [userProductList, setUserProductList] = useState([]);

  const [category, setcategory] = useState([]);
  const [categoryWeb, setCategoryWeb] = useState([]);
  const [sellingCategory, setSellingCategory] = useState({});
  const [myAddress, setMyAddess] = useState([]);
  const [correntAddess, setCorrentAddess] = useState({});

  const [currentUser, setCorrectUser] = useState("");
  const [productList, setProductList] = useState([]);
  const [trendingProductList, setTrendingProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategory, setLoadingCategory] = useState(true);

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

  const serverURL = getServerURL();
  const player = useRef();

  const startAnimation = () => {
    if (player.current) {
      player.current.play(); // Check if player.current is not null before accessing play()
    }
  };
  const stopAnimation = () => {
    setLoading(false);
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
          getWishList()
          getProducts()
          getSellProducts()
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
    startAnimation()
    try {
      // if (isLoggedIn) {
      const res = await api.postWithToken(`${serverURL + WISHLIST}`, { "action": "my-wishlist-list" })
      setWishList(res.data.data.list)
      setWishlistCount(res.data.data.list.length)
      setWishProductURL(res.data.data.productImagePath)
      stopAnimation()
      // } else {
      //   // User is not logged in, redirect to the login page
      //   afterLogin(setMyMessage);
      //   setWarningSnackBarOpen(!warningSnackBarOpen);
      // }
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
      const res2 = await api.postWithToken(`${serverURL + "shipping-method-manage"}`, {
        "action": "list",
        "country_id": data[0].country_id._id
      })
      setCorrentAddess({ data: data, shipping_method_id: res2.data.data?.list[0]?._id })
      stopAnimation()
    } catch (error) {
      errorResponse(error, setMyMessage);
      setWarningSnackBarOpen(!warningSnackBarOpen);
    }
  };

  const getProducts = async () => {

    try {
      startAnimation()
      const apiTyp = isLoggedIn ? api.postWithToken : api.post;
      const [categoryResponse, trendingproductListResponse, productListResponse, userProductList] = await Promise.all([
        api.post(`${serverURL + PRODUCTCATEGORY}`),
        apiTyp(`${serverURL + PRODUCTList}`, { "product_list_type": "trending-product" }),
        apiTyp(`${serverURL + PRODUCTList}`, { "product_list_type": "flashsale-products" }),
        api.post(`${serverURL + PRODUCTList}`, { product_list_type: "user-product-list", user_id: "63906926deb5464a1ed67770" })

      ]);

      const categoryData = categoryResponse.data.data;
      const productListData = productListResponse.data.data;
      const trendingproductData = trendingproductListResponse.data.data
      const userproductData = userProductList.data.data;

      setcategory(categoryData);
      setProductList(productListData);
      setTrendingProductList(trendingproductData)
      setUserProductList(userproductData)

      stopAnimation()
    } catch (error) {
      console.log(error);
    }
  };

  const getSellProducts = async () => {

    
    try {
      startAnimation()
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
                product_list_type: "recommended-products",
                page: favoritepage
            })
        ]);

        const womanproductData = womenCategory.data.data;
        const manproductData = menCategory.data.data;
        const kidsproductData = kidCategory.data.data;
        const favoriteproductData = favorites.data.data;

        // Merge products without repetitions
        const updatedWomanProductList = [...womanProductList, ...womanproductData.productListArrObj]
            .filter((product, index, self) => self.findIndex(p => p._id === product._id) === index);
        const updatedManProductList = [...manProductList, ...manproductData.productListArrObj]
            .filter((product, index, self) => self.findIndex(p => p._id === product._id) === index);
        const updatedKidsProductList = [...kidsProductList, ...kidsproductData.productListArrObj]
            .filter((product, index, self) => self.findIndex(p => p._id === product._id) === index);

        const updatedfavoriteProductList = [...favoriteProductList, ...favoriteproductData.productListArrObj]
            .filter((product, index, self) => self.findIndex(p => p._id === product._id) === index);

        setSellProducUrl(womanproductData.productImagePath);
        setWomanProductList(updatedWomanProductList);
        setManProductList(updatedManProductList);
        setkidsProductList(updatedKidsProductList);
        setFavoriteProductList(updatedfavoriteProductList)
        setViewmoreLoder(false)
        stopAnimation()

    } catch (error) {
        console.log(error);
    }
};

  const getCategoryWeb = async () => {

    console.log("called");
    startAnimation()

    try {
      const [categoryResponse] = await Promise.all([
        api.post(`${serverURL + PRODUCTCATEGORY}`, { action: "web" })
      ]);
      const categoryData = categoryResponse.data.data;
      setSellingCategory(
        {
          first: { _id: categoryData.productsCategoryList[0]?._id, name: categoryData.productsCategoryList[0]?.child[0]?.name, id: categoryData.productsCategoryList[0]?.child[0]?._id },
          second: { _id: categoryData.productsCategoryList[1]?._id, name: categoryData.productsCategoryList[1]?.child[0]?.name, id: categoryData.productsCategoryList[1]?.child[0]?._id },
          third: { _id: categoryData.productsCategoryList[2]?._id, name: categoryData.productsCategoryList[2]?.child[0]?.name, id: categoryData.productsCategoryList[2]?.child[0]?._id },
        })
        
      // Divide the category list into two parts
      const halfwayIndex = Math.ceil(categoryData.productsCategory && categoryData?.productsCategory.length / 2);

      const firstHalf = categoryData.productsCategory?.slice(0, halfwayIndex);
      const secondHalf = categoryData.productsCategory?.slice(halfwayIndex);
      // Set the first half and second half of categories
      setCategoryWeb({ firstHalf, secondHalf, productsCategoryIconPath: categoryData?.productImagePath, categoryData: categoryData.productsCategory });

      stopAnimation()
    } catch (error) {
      console.log(error);
    }
  };






  // const getCategoryData = async () => {
  //   startAnimation()
  //   try {
  //       const res = await api.postWithToken(`${serverURL + "shipping-address-manage"}`, {"action":"shipping-address-list"})
  //       setMyAddess(res.data.data.userData)
  //       let data = res.data.data?.userData.filter((e) => e.is_default == 1)
  //       const res2 = await api.postWithToken(`${serverURL + "shipping-method-manage"}`, {
  //         "action":"list",
  //         "country_id": data[0].country_id._id
  //     })
  //       setCorrentAddess({data:data,shipping_method_id:res2.data.data?.list[0]?._id })
  //       stopAnimation()
  //   } catch (error) {
  //       errorResponse(error, setMyMessage);
  //       setWarningSnackBarOpen(!warningSnackBarOpen);
  //   }
  // };


  return (

    <CartContext.Provider value={{
      viewMoreLodr,setViewmoreLoder, sellProducUrl, setFavoritePage, setKidPage, setManPage, setWomanPage, favoritepage,kidspage, manpage, womanpage, favoriteProductList, kidsProductList, manProductList, womanProductList,getSellProducts, correntAddess, myAddress, getMyAddress, sellingCategory, stopAnimationcategory, startAnimationcategory, playercategory, loadingCategory, setLoadingCategory, startAnimation, stopAnimation, player, cart, setCart, addWishList, sucessSnackBarOpen, warningSnackBarOpen, Mymessage,
      setSucessSnackBarOpen, setWarningSnackBarOpen, getWishList, wishlist, getProducts, wishProductUrl, category, currentUser,
      productList, trendingProductList, loading, setLoading, wishlistCount, userProductList, getCategoryWeb, categoryWeb
    }}>
      {children}
    </CartContext.Provider>

  );
};