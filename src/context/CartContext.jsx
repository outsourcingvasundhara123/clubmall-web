import React, { useRef, createContext, useState } from 'react';
import { WISHLIST, PRODUCTCATEGORY, PRODUCTList, ADDTOCART } from '../helper/endpoints';
import { getServerURL } from '../helper/envConfig';
import api from '../helper/api';
import { Is_Login } from '../helper/IsLogin'
import { errorResponse, afterLogin } from '../helper/constants';
import CryptoJS from 'crypto-js';

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
  const [localCart, setLocalCart] = useState([]);
  const [localCartPostData, setLocalCartPostData] = useState([]);

  //install app popup
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const serverURL = getServerURL();
  const player = useRef();
  const mainplayer = useRef();
  const [activeImage, setActiveImage] = useState("")

  const [couponId, setCouponId] = useState([]);
  const [cartList, setCartList] = useState([]);


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
        setAdd_wished_Called(true)
        const res = await api.postWithToken(`${serverURL + WISHLIST}`, data)
        if (res.data.success == true) {
          setMyMessage(res.data.message);
          setSucessSnackBarOpen(!sucessSnackBarOpen);
          setSellIs_wished(sellIs_wished + 1)
          getwishlistcount()
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

  // local store products 

  const addcartLocal = async (data, handleDrawerShow) => {
    let currentCartData = localStorage.getItem('cartPostData');
    if (currentCartData) {
      const bytes = CryptoJS.AES.decrypt(currentCartData, process.env.REACT_APP_JWT_SECRET_KEY);
      currentCartData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } else {
      currentCartData = [];
    }
    const productIndex = currentCartData.findIndex(item => 
      item.product_id === data.product_id &&
      item.color === data.color &&
      item.size === data.size
    );
  
    if (productIndex !== -1) {
      currentCartData[productIndex].qty += data.qty;
      const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(currentCartData), process.env.REACT_APP_JWT_SECRET_KEY).toString();
      localStorage.setItem('cartPostData', ciphertext);
      handleDrawerShow();
      setMyMessage("Product quantity updated successfully");
      setSucessSnackBarOpen(!sucessSnackBarOpen);
    } else {
      currentCartData.push(data);
      const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(currentCartData), process.env.REACT_APP_JWT_SECRET_KEY).toString();
      localStorage.setItem('cartPostData', ciphertext);
  
      handleDrawerShow();
      setMyMessage("Product added to cart successfully");
      setSucessSnackBarOpen(!sucessSnackBarOpen);
    }
  }

  const addProductDetailsToLocal = async (data, Product, sizeActive, productColorActive,product_qtyActive) => {
    let currentProductDetails = localStorage.getItem('productDetails');
    if (currentProductDetails) {
      const bytes = CryptoJS.AES.decrypt(currentProductDetails, process.env.REACT_APP_JWT_SECRET_KEY);
      currentProductDetails = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } else {
      currentProductDetails = {
        items: [],
        subtotal: 0
      };
    }
  
    const productIndex = currentProductDetails.items.findIndex(item => 
      item.product_id === data.product_id &&
      item.color === productColorActive &&
      item.size === sizeActive
    );
  
    if (productIndex !== -1) {
      currentProductDetails.items[productIndex].qty += product_qtyActive;
      currentProductDetails.items[productIndex].total_price += (Product.productList.individual_price * product_qtyActive);

      currentProductDetails.subtotal += (Product.productList.individual_price * product_qtyActive);

      const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(currentProductDetails), process.env.REACT_APP_JWT_SECRET_KEY).toString();
      localStorage.setItem('productDetails', ciphertext);
  
      setMyMessage("Product quantity updated successfully");
      setSucessSnackBarOpen(!sucessSnackBarOpen);
      getLocalCartData();
    } else {
      const skuDetail = Product.productList.sku_details.find(sku => sku.attrs[0].color === productColorActive);
      if (!skuDetail) {
        console.error('SKU details not found');
        return;
      }

      // construct the details
      let productDetail = {
        product_id: data.product_id,
        name: Product.productList.name,
        image: `${Product.productImagePath}${data.product_id}/${skuDetail.file_name}`,
        qty: product_qtyActive,
        total_price: Product.productList.individual_price * product_qtyActive,
        individual_price: Product.productList.individual_price,
        size: sizeActive,
        color: productColorActive
      }

      currentProductDetails.items.push(productDetail);

      // Update subtotal
      currentProductDetails.subtotal += productDetail.total_price;

      // Convert object to string and encrypt
      const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(currentProductDetails), process.env.REACT_APP_JWT_SECRET_KEY).toString();

      localStorage.setItem('productDetails', ciphertext);
      setMyMessage("Product details added successfully");
      setSucessSnackBarOpen(!sucessSnackBarOpen);
      getLocalCartData();
    }
  }

  const deleteProductFromLocalCart = async (productId) => {
    let currentCartData = localStorage.getItem('cartPostData');
    if (!currentCartData) {
      setMyMessage("Cart is empty");
      setWarningSnackBarOpen(!warningSnackBarOpen);
      return;
    }
    const bytes = CryptoJS.AES.decrypt(currentCartData, process.env.REACT_APP_JWT_SECRET_KEY);
    currentCartData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    // Find the product in the cart
    const productIndex = currentCartData.findIndex(item => item.product_id === productId);
    if (productIndex === -1) {
      setMyMessage("Product not found in the cart");
      setWarningSnackBarOpen(!warningSnackBarOpen);
      return;
    }

    // Remove the product from the cart
    currentCartData?.splice(productIndex, 1);

    // Convert object to string and encrypt
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(currentCartData), process.env.REACT_APP_JWT_SECRET_KEY).toString();

    // Save updated cart data
    localStorage.setItem('cartPostData', ciphertext);

    setMyMessage("Product removed from cart successfully");
    setSucessSnackBarOpen(!sucessSnackBarOpen);
  }

  const deleteProductDetailsFromLocal = async (productId) => {
    let currentProductDetails = localStorage.getItem('productDetails');
    if (!currentProductDetails) {
      setMyMessage("No product details stored");
      setWarningSnackBarOpen(!warningSnackBarOpen);
      return;
    }
    const bytes = CryptoJS.AES.decrypt(currentProductDetails, process.env.REACT_APP_JWT_SECRET_KEY);
    currentProductDetails = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    // Find the product in the stored details
    const productIndex = currentProductDetails.items.findIndex(item => item.product_id === productId);
    if (productIndex === -1) {
      setMyMessage("Product details not found");
      setWarningSnackBarOpen(!warningSnackBarOpen);
      return;
    }

    // Update subtotal
    currentProductDetails.subtotal -= currentProductDetails.items[productIndex].total_price; // Updated this line.

    // Remove the product details from storage
    currentProductDetails.items.splice(productIndex, 1);

    // Convert object to string and encrypt
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(currentProductDetails), process.env.REACT_APP_JWT_SECRET_KEY).toString();

    // Save updated product details
    localStorage.setItem('productDetails', ciphertext);
    getLocalCartData()
    setMyMessage("Product details removed successfully");
    setSucessSnackBarOpen(!sucessSnackBarOpen);
  }

  const increaseProductQuantity = async (productId, increaseBy = 1) => {
    let currentProductDetails = localStorage.getItem('productDetails');
    if (!currentProductDetails) {
      setMyMessage("No product details stored");
      setWarningSnackBarOpen(!warningSnackBarOpen);
      return;
    }
    const bytes = CryptoJS.AES.decrypt(currentProductDetails, process.env.REACT_APP_JWT_SECRET_KEY);
    currentProductDetails = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  
    const productIndex = currentProductDetails.items.findIndex(item => item.product_id === productId);
    if (productIndex === -1) {
      setMyMessage("Product details not found");
      setWarningSnackBarOpen(!warningSnackBarOpen);
      return;
    }
  
    currentProductDetails.items[productIndex].qty += increaseBy;
    currentProductDetails.items[productIndex].total_price = currentProductDetails.items[productIndex].qty * currentProductDetails.items[productIndex].individual_price;
    currentProductDetails.subtotal = currentProductDetails.items.reduce((sum, item) => sum + item.total_price, 0);
  
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(currentProductDetails), process.env.REACT_APP_JWT_SECRET_KEY).toString();
    localStorage.setItem('productDetails', ciphertext);
    getLocalCartData();
    setMyMessage("Product quantity increased successfully");
    setSucessSnackBarOpen(!sucessSnackBarOpen);
  }
  

  const decreaseProductQuantity = async (productId) => {
    let currentProductDetails = localStorage.getItem('productDetails');
    if (!currentProductDetails) {
      setMyMessage("No product details stored");
      setWarningSnackBarOpen(!warningSnackBarOpen);
      return;
    }
    const bytes = CryptoJS.AES.decrypt(currentProductDetails, process.env.REACT_APP_JWT_SECRET_KEY);
    currentProductDetails = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    // Find the product in the stored details
    const productIndex = currentProductDetails.items.findIndex(item => item.product_id === productId);
    if (productIndex === -1) {
      setMyMessage("Product details not found");
      setWarningSnackBarOpen(!warningSnackBarOpen);
      return;
    }

    // Decrease the product quantity, but don't go below 1
    if (currentProductDetails.items[productIndex].qty > 1) {
      // Decrease the product quantity
      currentProductDetails.items[productIndex].qty -= 1;
      // Update total price for the product
      currentProductDetails.items[productIndex].total_price = parseFloat((currentProductDetails.items[productIndex].qty * currentProductDetails.items[productIndex].individual_price).toFixed(2));
      // Update subtotal
      currentProductDetails.subtotal = parseFloat((currentProductDetails.items.reduce((sum, item) => sum + item.total_price, 0)).toFixed(2));

      // Convert object to string and encrypt
      const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(currentProductDetails), process.env.REACT_APP_JWT_SECRET_KEY).toString();

      // Save updated product details
      localStorage.setItem('productDetails', ciphertext);
      getLocalCartData()
      setMyMessage("Product quantity decreased successfully");
      setSucessSnackBarOpen(!sucessSnackBarOpen);
    } else {
      setMyMessage("Product quantity cannot be less than 1");
      setWarningSnackBarOpen(!warningSnackBarOpen);
    }
  }

  const getLocalCartData = async () => {
    try {
      let currentProductDetails = localStorage.getItem('productDetails');
      if (currentProductDetails) {
        const bytes = CryptoJS.AES.decrypt(currentProductDetails, process.env.REACT_APP_JWT_SECRET_KEY);
        currentProductDetails = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      } else {
        currentProductDetails = [];
      }
      setLocalCart(currentProductDetails)

    } catch (error) {
      console.log(error);
    }
  };

  const getLocalCartPostData = async () => {
    try {
      let currentCartData = localStorage.getItem('cartPostData');
      if (currentCartData) {
        const bytes = CryptoJS.AES.decrypt(currentCartData, process.env.REACT_APP_JWT_SECRET_KEY);
        currentCartData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      } else {
        currentCartData = [];
      }
      setLocalCartPostData(currentCartData)

    } catch (error) {
      console.log(error);
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
      // if (window.location.pathname == "/wishlist") {
      //   errorResponse(error, setMyMessage);
      //   setWarningSnackBarOpen(!warningSnackBarOpen);
      // }
    }

  };

  const getwishlistcount = async () => {
    try {
      const res = await api.postWithToken(`${serverURL + "get-count"}`, { "action": "wishlist" })
      setWishlistCount(res.data.data.count)
    } catch (error) {
      console.log(error, "error");
    }
  };

  const getcartcount = async () => {
    try {
      const res = await api.postWithToken(`${serverURL + "get-count"}`, { "action": "cart" })
      setCart(res.data.data.count)
    } catch (error) {
      console.log(error, "error");
    }
  };


  const deleteWishList = async (id) => {
    startAnimation()
    setMainLoder(true)
    try {
      const res = await api.postWithToken(`${serverURL + WISHLIST}`, { "action": "product-delete-wishlist", "product_id": id })
      if (res.data.success == true) {
        setMyMessage(res.data.message);
        setSucessSnackBarOpen(!sucessSnackBarOpen);
        getWishList()
        getwishlistcount()
        // getProducts()
      } else {
        setMyMessage(res.data.message);
        setWarningSnackBarOpen(!warningSnackBarOpen);
      }
      stopAnimation()

      setTimeout(() => {
        setMainLoder(false)
      }, 1000);

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
        // setCart(poroductResponse.data.data.list?.length)
        let ids = poroductData.list?.map((e) => e._id)
        setCouponId(ids)
        setCartList(poroductData);
        stopAnimation()
        // setMainLoder(false)
      }
    } catch (error) {
      console.log(error);
      // if (window.location.pathname == "/cart") {
      //   errorResponse(error, setMyMessage);
      //   setWarningSnackBarOpen(!warningSnackBarOpen);
      // }
    }
  };

  const handelSearch = (search) => {
    localStorage.setItem("search", search);
    setIs_search(1)
  };

  // dynamic link functions 
  // const call = (link) => {
  //   window.open(link, '_blank');
  // };
  const call = (link) => {
    return window.open(link, '_blank');
  };

  function openLink(link) {
    window.location.href = link;
  }

  // function isIOS() {
  //   return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  // }

  const isIOS = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  }

  function tryOpenAppOrFallback(deepLink, fallbackUrl) {
    const isBrowserVisible = () => !document.hidden; // If the browser isn't hidden, it means the app didn't launch

    window.location.href = deepLink; // Try to open the app using the custom URL scheme

    setTimeout(() => {
        if (isBrowserVisible()) {
            window.location.href = fallbackUrl;
        }
    }, 2000); // Let's wait for 2 seconds
}


function openAppOrRedirectToStore(universalLink, appStoreURL) {
  // Try to open the app using the Universal Link.
  window.location.href = universalLink;

  // Create an event listener to check page visibility
  const visibilityChangeEvent = "hidden" in document ? "visibilitychange" : "pagehide";

  // Set up the event listener function
  const handleVisibilityChange = function() {
      // If the page is hidden (app has opened), remove the event listener
      if (document[visibilityChangeEvent]) {
          document.removeEventListener(visibilityChangeEvent, handleVisibilityChange);
      }
  };

  // Add the event listener
  document.addEventListener(visibilityChangeEvent, handleVisibilityChange, false);

  // Set a short delay to check if the page is still visible (app hasn't opened)
  setTimeout(() => {
      // Remove the event listener regardless of the result
      document.removeEventListener(visibilityChangeEvent, handleVisibilityChange);

      // If the page is still visible, redirect to the App Store
      if (!document[visibilityChangeEvent]) {
          window.location.href = appStoreURL;
      }
  }, 2500);  // 2.5 seconds delay
}


const tryOpenAppWithCustomScheme = () => {
  let iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = 'https://apps.apple.com/us/app/clubmall/id6444752184';
  document.body.appendChild(iframe);
  setTimeout(() => {
      document.body.removeChild(iframe);
  }, 1000);
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
    const newWindow = call(response.data.shortLink);

    if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
      //POPUP BLOCKED
      handleShow();
      setPerActive('Group')
      // alert('Please disable your popup blocker and try again.');
    }

    // if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
    //   if (isIOS()) {
    //     // openLink(`https://clubmall.com/.well-known/apple-app-site-association`)
    //     openLink(`com.clubmall.deeplink://product-details/${productId}?w=g`)
    //     // tryOpenAppOrFallback(`com.clubmall.deeplink://product-details/${productId}?w=g`, "https://apps.apple.com/us/app/clubmall/id6444752184");
    //   } else if (isAndroid()) {
    //     handleShow();
    //     setPerActive('Group');
    //   }
    // }

// ------------- for block popup -------

    // const response = await api.post(
    //   `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${process.env.REACT_APP_API_FIREBASE}`,
    //   {
    //     "dynamicLinkInfo": {
    //       "domainUriPrefix": "https://clubmall.page.link",
    //       "link": `https://www.clubmall.com/product-details/${productId}?w=g`,
    //       "androidInfo": {
    //         "androidPackageName": "com.clubmall"
    //       },
    //       "iosInfo": {
    //         "iosBundleId": "com.clubmall",
    //         "iosAppStoreId": "6444752184",
    //       }
    //     },
    //     "suffix": {
    //       "option": "SHORT"
    //     },
    //   }
    // );

    // window.location.href = response.data.shortLink;
  

  };


  // dynamic link functions ---- end -----


  return (

    <CartContext.Provider value={{
      handleClose, handleShow, show, setShow, getwishlistcount, getcartcount,
      handleDrawerShow, handleDrawerClose, drawer, addcartLocal, addProductDetailsToLocal, localCart, getLocalCartData, deleteProductDetailsFromLocal, deleteProductFromLocalCart, increaseProductQuantity, decreaseProductQuantity, localCartPostData, getLocalCartPostData,
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