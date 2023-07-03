
export const errorResponse = (error, setMyMessage, props) => {

    if (error.response) {
        const { status, data } = error.response;

        if (status === 403) {
            setMyMessage(data.message)
            setTimeout(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('name');
                localStorage.removeItem('user');
                localStorage.removeItem('profile_image');
                window.location.href = "/login";
            }, 5000);
        } else {
            setMyMessage(data.message)
            if (props !== undefined) {
                setTimeout(() => {
                    props.handleClose()
                }, 1000);
            }
        }
    } else {
        return { status: 0, message: "try again" };
    }
};

export const afterLogin = (setMyMessage) => {

    if (setMyMessage) {
        setMyMessage("login first for access this functionality")
        setTimeout(() => {
            window.location.href = "/login";
            sessionStorage.removeItem("token");
        }, 1000);
    } else {
        return { status: 0, message: "try again" };
    }
};

export const handelProductDetail = (productId) => {
    localStorage.setItem("selectedProductId", productId);
    window.location.href = "/Product-info";
};


export const handelCategorydata = (categorie, navigate) => {


    if (categorie == undefined) {
        localStorage.setItem("selectedcategories", "646b3f3a9d6497250b8f17c4");
    } else {
        localStorage.setItem("selectedcategories", categorie);
    }
    if (navigate !== undefined) {
        navigate("/categories");
    } else {
        window.location.href = "/categories";
    }

};

export const colors = [
    { id: 1, name: "Black", img: "./img/selling/color1.png" },
    { id: 2, name: "white", img: "./img/selling/color2.png" },
    { id: 3, name: "pink", img: "./img/selling/color3.png" },
    { id: 4, name: "red", img: "./img/selling/color4.png" },
    { id: 5, name: "blue", img: "./img/selling/color5.png" },
    { id: 6, name: "green", img: "./img/selling/color6.png" },
    { id: 7, name: "", img: "./img/selling/color7.png" },
    { id: 8, name: "", img: "./img/selling/color8.png" },
    { id: 9, name: "", img: "./img/selling/color9.png" },
    { id: 10, name: "", img: "./img/selling/color10.png" },
    { id: 11, name: "", img: "./img/selling/color11.png" },
    { id: 12, name: "", img: "./img/selling/color12.png" },
    { id: 13, name: "", img: "./img/selling/color13.png" },
    { id: 14, name: "", img: "./img/selling/color14.png" },
    { id: 15, name: "", img: "./img/selling/color15.png" },
    { id: 16, name: "", img: "./img/selling/color16.png" },
    { id: 17, name: "", img: "./img/selling/color17.png" },
    { id: 18, name: "", img: "./img/selling/color18.png" },
    { id: 19, name: "", img: "./img/selling/color19.png" },
    { id: 20, name: "", img: "./img/selling/color20.png" },
]

export const categoriesSliderData = [
    {
        name: "Women’s Jewellary",
        img: './img/header/mega-menu/img1.png'
    },
    {
        name: "Girl’s Dresses",
        img: './img/header/mega-menu/img2.png'
    },
    {
        name: "Men’s Plus Size Shirts",
        img: './img/header/mega-menu/img3.png'
    },
    {
        name: "Laptop Bags",
        img: './img/header/mega-menu/img4.png'
    },
    {
        name: "Car Storage & Organizers",
        img: './img/header/mega-menu/img5.png'
    },
    {
        name: "Women’s Sleepwear",
        img: './img/header/mega-menu/img6.png'
    },
    {
        name: "Security & Surveillance",
        img: './img/header/mega-menu/img7.png'
    },
    {
        name: "Interior Accessories",
        img: './img/header/mega-menu/img8.png'
    },
    {
        name: "Women’s Slippers",
        img: './img/header/mega-menu/img9.png'
    },
    {
        name: "Boy’s Sets",
        img: './img/header/mega-menu/img10.png'
    },
    {
        name: "Girl’s Shirts",
        img: './img/header/mega-menu/img11.png'
    },
    {
        name: "Girl’s T-shirts",
        img: './img/header/mega-menu/img12.png'
    },
    {
        name: "Baby Dresses",
        img: './img/header/mega-menu/img13.png'
    },
    {
        name: "Car Audio & Video",
        img: './img/header/mega-menu/img14.png'
    },
    {
        name: "Women’s Sandals",
        img: './img/header/mega-menu/img15.png'
    },
    {
        name: "Women’s Glasses",
        img: './img/header/mega-menu/img16.png'
    },
    {
        name: "Home Decor Products",
        img: './img/header/mega-menu/img17.png'
    },
    {
        name: "Girl’s Sets",
        img: './img/header/mega-menu/img18.png'
    },
    {
        name: "Baby Onesies",
        img: './img/header/mega-menu/img19.png'
    },
    {
        name: "Women’s Beach Wear",
        img: './img/header/mega-menu/img20.png'
    },
    {
        name: "Smart Doorbells & Enrty",
        img: './img/header/mega-menu/img21.png'
    },
]

export const homeSliderData = [
    {
        img: "./img/cate2.png",
        name: "Men’s Shoes",
        per: "From $1.34"
    },
    {
        img: "./img/cate1.png",
        name: "Men’s Shoes",
        per: "From $1.34"
    },
    {
        img: "./img/cate2.png",
        name: "Men’s Shoes",
        per: "From $1.34"
    },
    {
        img: "./img/cate1.png",
        name: "Men’s Shoes",
        per: "From $1.34"
    },
    {
        img: "./img/cate2.png",
        name: "Men’s Shoes",
        per: "From $1.34"
    },
    {
        img: "./img/cate1.png",
        name: "Men’s Shoes",
        per: "From $1.34"
    },
    {
        img: "./img/cate2.png",
        name: "Men’s Shoes",
        per: "From $1.34"
    },
    {
        img: "./img/cate1.png",
        name: "Men’s Shoes",
        per: "From $1.34"
    },
    {
        img: "./img/cate2.png",
        name: "Men’s Shoes",
        per: "From $1.34"
    },
    {
        img: "./img/cate1.png",
        name: "Men’s Shoes",
        per: "From $1.34"
    },
    {
        img: "./img/cate2.png",
        name: "Men’s Shoes",
        per: "From $1.34"
    },
    {
        img: "./img/cate1.png",
        name: "Men’s Shoes",
        per: "From $1.34"
    },
]

export const homeSliderData2 = [
    {
        img: "./img/cate1.png",
        name: "Women’s Jewellary",
        per: "From $1.34"
    },
    {
        img: "./img/cate2.png",
        name: "Girl’s Dresses",
        per: "From $1.34"
    },
    {
        img: "./img/cate3.png",
        name: "Men’s Plus Size Shirts",
        per: "From $1.34"
    },
    {
        img: "./img/cate4.png",
        name: "Laptop Bags",
        per: "From $1.34"
    },
    {
        img: "./img/cate5.png",
        name: "Car Storage & Organizers",
        per: "From $1.34"
    },
    {
        img: "./img/cate1.png",
        name: "Women’s Jewellary",
        per: "From $1.34"
    },
    {
        img: "./img/cate2.png",
        name: "Girl’s Dresses",
        per: "From $1.34"
    },
    {
        img: "./img/cate3.png",
        name: "Men’s Plus Size Shirts",
        per: "From $1.34"
    },
    {
        img: "./img/cate4.png",
        name: "Laptop Bags",
        per: "From $1.34"
    },
    {
        img: "./img/cate5.png",
        name: "Car Storage & Organizers",
        per: "From $1.34"
    },
    {
        img: "./img/cate1.png",
        name: "Women’s Jewellary",
        per: "From $1.34"
    },
    {
        img: "./img/cate2.png",
        name: "Girl’s Dresses",
        per: "From $1.34"
    },
    {
        img: "./img/cate3.png",
        name: "Men’s Plus Size Shirts",
        per: "From $1.34"
    },
    {
        img: "./img/cate4.png",
        name: "Laptop Bags",
        per: "From $1.34"
    },
    {
        img: "./img/cate5.png",
        name: "Car Storage & Organizers",
        per: "From $1.34"
    },
]

export const saleData = [
    {
        img: "./img/product1.png",
    },
    {
        img: "./img/product3.png",
    },
    {
        img: "./img/product4.png",
    },
    {
        img: "./img/product5.png",
    },
    {
        img: "./img/product6.png",
    },
    {
        img: "./img/product7.png",
    },
    {
        img: "./img/product8.png",
    },
    {
        img: "./img/product9.png",
    },
]

export const productData = {
    pink: [
        {
            img: "./img/new_in/pink1.png",
        },
        {
            img: "./img/new_in/pink2.png",
        },
        {
            img: "./img/new_in/pink3.png",
        },
        {
            img: "./img/new_in/pink4.png",
        },
        {
            img: "./img/new_in/pink5.png",
        },
        {
            img: "./img/new_in/pink6.png",
        },
        {
            img: "./img/new_in/pink1.png",
        },
        {
            img: "./img/new_in/pink2.png",
        },
        {
            img: "./img/new_in/pink3.png",
        },
        {
            img: "./img/new_in/pink4.png",
        },
        {
            img: "./img/new_in/pink5.png",
        },
        {
            img: "./img/new_in/pink6.png",
        }
    ],
    purple: [
        {
            img: "./img/new_in/purple1.png",
        },
        {
            img: "./img/new_in/purple2.png",
        },
        {
            img: "./img/new_in/purple3.png",
        },
        {
            img: "./img/new_in/purple4.png",
        },
        {
            img: "./img/new_in/purple5.png",
        },
        {
            img: "./img/new_in/purple6.png",
        },
        {
            img: "./img/new_in/purple1.png",
        },
        {
            img: "./img/new_in/purple2.png",
        },
        {
            img: "./img/new_in/purple3.png",
        },
        {
            img: "./img/new_in/purple4.png",
        },
        {
            img: "./img/new_in/purple5.png",
        },
        {
            img: "./img/new_in/purple6.png",
        }
    ],
    blue: [
        {
            img: "./img/new_in/blue1.png",
        },
        {
            img: "./img/new_in/blue2.png",
        },
        {
            img: "./img/new_in/blue3.png",
        },
        {
            img: "./img/new_in/blue4.png",
        },
        {
            img: "./img/new_in/blue5.png",
        },
        {
            img: "./img/new_in/blue6.png",
        },
        {
            img: "./img/new_in/blue1.png",
        },
        {
            img: "./img/new_in/blue2.png",
        },
        {
            img: "./img/new_in/blue3.png",
        },
        {
            img: "./img/new_in/blue4.png",
        },
        {
            img: "./img/new_in/blue5.png",
        },
        {
            img: "./img/new_in/blue6.png",
        }
    ],
    green: [
        {
            img: "./img/new_in/green1.png",
        },
        {
            img: "./img/new_in/green2.png",
        },
        {
            img: "./img/new_in/green3.png",
        },
        {
            img: "./img/new_in/green4.png",
        },
        {
            img: "./img/new_in/green5.png",
        },
        {
            img: "./img/new_in/green6.png",
        },
        {
            img: "./img/new_in/green1.png",
        },
        {
            img: "./img/new_in/green2.png",
        },
        {
            img: "./img/new_in/green3.png",
        },
        {
            img: "./img/new_in/green4.png",
        },
        {
            img: "./img/new_in/green5.png",
        },
        {
            img: "./img/new_in/green6.png",
        }
    ]
}

export const images = [
    {
        original: './img/product_def/bag-img.png',
        thumbnail: './img/product_def/thum1.png',
    },
    {
        original: './img/product_def/bag-img.png',
        thumbnail: './img/product_def/thum2.png',
    },
    {
        original: './img/product_def/bag-img.png',
        thumbnail: './img/product_def/thum3.png',
    },
    {
        original: './img/product_def/bag-img.png',
        thumbnail: './img/product_def/thum4.png',
    },
    {
        original: './img/product_def/bag-img.png',
        thumbnail: './img/product_def/thum5.png',
    },
];

export const cartListData = [
    {
        img: "./img/product_def/added1.png",
        name: "Large Capacity High School Student Backpack Female Korean Schoolbag",
        categories: "Silvery",
        per: "$299,43",
        delPer: "$534,33"
    },
    {
        img: "./img/product_def/added2.png",
        name: "Large Capacity High School Student Backpack Female Korean Schoolbag",
        categories: "Silvery",
        per: "$299,43",
        delPer: "$534,33"
    },
    {
        img: "./img/product_def/added3.png",
        name: "Large Capacity High School Student Backpack Female Korean Schoolbag",
        categories: "Silvery",
        per: "$299,43",
        delPer: "$534,33"
    },
    {
        img: "./img/product_def/added1.png",
        name: "Large Capacity High School Student Backpack Female Korean Schoolbag",
        categories: "Silvery",
        per: "$299,43",
        delPer: "$534,33"
    },
    {
        img: "./img/product_def/added2.png",
        name: "Large Capacity High School Student Backpack Female Korean Schoolbag",
        categories: "Silvery",
        per: "$299,43",
        delPer: "$534,33"
    },
    {
        img: "./img/product_def/added3.png",
        name: "Large Capacity High School Student Backpack Female Korean Schoolbag",
        categories: "Silvery",
        per: "$299,43",
        delPer: "$534,33"
    },
    {
        img: "./img/product_def/added1.png",
        name: "Large Capacity High School Student Backpack Female Korean Schoolbag",
        categories: "Silvery",
        per: "$299,43",
        delPer: "$534,33"
    },
    {
        img: "./img/product_def/added2.png",
        name: "Large Capacity High School Student Backpack Female Korean Schoolbag",
        categories: "Silvery",
        per: "$299,43",
        delPer: "$534,33"
    },
]

export const product_data = {
    FeaturedData: [
        {
            name: "Women’s Jewellary",
            img: './img/header/mega-menu/img1.png'
        },
        {
            name: "Girl’s Dresses",
            img: './img/header/mega-menu/img2.png'
        },
        {
            name: "Men’s Plus Size Shirts",
            img: './img/header/mega-menu/img3.png'
        },
        {
            name: "Laptop Bags",
            img: './img/header/mega-menu/img4.png'
        },
        {
            name: "Car Storage & Organizers",
            img: './img/header/mega-menu/img5.png'
        },
        {
            name: "Women’s Sleepwear",
            img: './img/header/mega-menu/img6.png'
        },
        {
            name: "Security & Surveillance",
            img: './img/header/mega-menu/img7.png'
        },
        {
            name: "Interior Accessories",
            img: './img/header/mega-menu/img8.png'
        },
        {
            name: "Women’s Slippers",
            img: './img/header/mega-menu/img9.png'
        },
        {
            name: "Boy’s Sets",
            img: './img/header/mega-menu/img10.png'
        },
        {
            name: "Girl’s Shirts",
            img: './img/header/mega-menu/img11.png'
        },
        {
            name: "Girl’s T-shirts",
            img: './img/header/mega-menu/img12.png'
        },
        {
            name: "Baby Dresses",
            img: './img/header/mega-menu/img13.png'
        },
        {
            name: "Car Audio & Video",
            img: './img/header/mega-menu/img14.png'
        },
        {
            name: "Women’s Sandals",
            img: './img/header/mega-menu/img15.png'
        },
        {
            name: "Women’s Glasses",
            img: './img/header/mega-menu/img16.png'
        },
        {
            name: "Home Decor Products",
            img: './img/header/mega-menu/img17.png'
        },
        {
            name: "Girl’s Sets",
            img: './img/header/mega-menu/img18.png'
        },
        {
            name: "Baby Onesies",
            img: './img/header/mega-menu/img19.png'
        },
        {
            name: "Women’s Beach Wear",
            img: './img/header/mega-menu/img20.png'
        },
        {
            name: "Smart Doorbells & Enrty",
            img: './img/header/mega-menu/img21.png'
        },
    ],
    WomenData: [
        {
            name: "Women’s Jewellary",
            img: './img/header/mega-menu/img1.png'
        },
        {
            name: "Girl’s Dresses",
            img: './img/header/mega-menu/img2.png'
        },
        {
            name: "Men’s Plus Size Shirts",
            img: './img/header/mega-menu/img3.png'
        },
        {
            name: "Laptop Bags",
            img: './img/header/mega-menu/img4.png'
        },
        {
            name: "Car Storage & Organizers",
            img: './img/header/mega-menu/img5.png'
        },
        {
            name: "Women’s Sleepwear",
            img: './img/header/mega-menu/img6.png'
        },
        {
            name: "Security & Surveillance",
            img: './img/header/mega-menu/img7.png'
        },
        {
            name: "Interior Accessories",
            img: './img/header/mega-menu/img8.png'
        },
        {
            name: "Women’s Slippers",
            img: './img/header/mega-menu/img9.png'
        },
        {
            name: "Boy’s Sets",
            img: './img/header/mega-menu/img10.png'
        },
        {
            name: "Women’s Beach Wear",
            img: './img/header/mega-menu/img20.png'
        },
        {
            name: "Smart Doorbells & Enrty",
            img: './img/header/mega-menu/img21.png'
        },
    ],
    HomeKitchen: [
        {
            name: "Laptop Bags",
            img: './img/header/mega-menu/img4.png'
        },
        {
            name: "Car Storage & Organizers",
            img: './img/header/mega-menu/img5.png'
        },
        {
            name: "Women’s Sleepwear",
            img: './img/header/mega-menu/img6.png'
        },
        {
            name: "Security & Surveillance",
            img: './img/header/mega-menu/img7.png'
        },
        {
            name: "Interior Accessories",
            img: './img/header/mega-menu/img8.png'
        },
        {
            name: "Women’s Slippers",
            img: './img/header/mega-menu/img9.png'
        },
        {
            name: "Boy’s Sets",
            img: './img/header/mega-menu/img10.png'
        },
        {
            name: "Women’s Beach Wear",
            img: './img/header/mega-menu/img20.png'
        },
        {
            name: "Smart Doorbells & Enrty",
            img: './img/header/mega-menu/img21.png'
        },
    ],
    WomenCurve: [
        {
            name: "Laptop Bags",
            img: './img/header/mega-menu/img4.png'
        },
        {
            name: "Car Storage & Organizers",
            img: './img/header/mega-menu/img5.png'
        },
        {
            name: "Women’s Sleepwear",
            img: './img/header/mega-menu/img6.png'
        },
        {
            name: "Security & Surveillance",
            img: './img/header/mega-menu/img7.png'
        },
        {
            name: "Interior Accessories",
            img: './img/header/mega-menu/img8.png'
        },
        {
            name: "Women’s Slippers",
            img: './img/header/mega-menu/img9.png'
        },
        {
            name: "Boy’s Sets",
            img: './img/header/mega-menu/img10.png'
        },
    ],
    KidFashion: [
        {
            name: "Women’s Sandals",
            img: './img/header/mega-menu/img15.png'
        },
        {
            name: "Women’s Glasses",
            img: './img/header/mega-menu/img16.png'
        },
        {
            name: "Home Decor Products",
            img: './img/header/mega-menu/img17.png'
        },
        {
            name: "Girl’s Sets",
            img: './img/header/mega-menu/img18.png'
        },
        {
            name: "Baby Onesies",
            img: './img/header/mega-menu/img19.png'
        },
        {
            name: "Women’s Beach Wear",
            img: './img/header/mega-menu/img20.png'
        },
        {
            name: "Smart Doorbells & Enrty",
            img: './img/header/mega-menu/img21.png'
        },
    ],
    MenClothing: [
        {
            name: "Women’s Sandals",
            img: './img/header/mega-menu/img15.png'
        },
        {
            name: "Women’s Glasses",
            img: './img/header/mega-menu/img16.png'
        },
        {
            name: "Home Decor Products",
            img: './img/header/mega-menu/img17.png'
        },
        {
            name: "Girl’s Sets",
            img: './img/header/mega-menu/img18.png'
        },
        {
            name: "Baby Onesies",
            img: './img/header/mega-menu/img19.png'
        },
    ],
    BeautyHealth: [
        {
            name: "Women’s Sandals",
            img: './img/header/mega-menu/img15.png'
        },
        {
            name: "Women’s Glasses",
            img: './img/header/mega-menu/img16.png'
        },
        {
            name: "Home Decor Products",
            img: './img/header/mega-menu/img17.png'
        },
        {
            name: "Girl’s Sets",
            img: './img/header/mega-menu/img18.png'
        },
        {
            name: "Baby Onesies",
            img: './img/header/mega-menu/img19.png'
        }, {
            name: "Interior Accessories",
            img: './img/header/mega-menu/img8.png'
        },
        {
            name: "Women’s Slippers",
            img: './img/header/mega-menu/img9.png'
        },
        {
            name: "Boy’s Sets",
            img: './img/header/mega-menu/img10.png'
        },
        {
            name: "Girl’s Shirts",
            img: './img/header/mega-menu/img11.png'
        },
    ],
    WomenShoes: [
        {
            name: "Baby Onesies",
            img: './img/header/mega-menu/img19.png'
        }, {
            name: "Interior Accessories",
            img: './img/header/mega-menu/img8.png'
        },
        {
            name: "Women’s Slippers",
            img: './img/header/mega-menu/img9.png'
        },
        {
            name: "Boy’s Sets",
            img: './img/header/mega-menu/img10.png'
        },
        {
            name: "Girl’s Shirts",
            img: './img/header/mega-menu/img11.png'
        },
    ],
    JewelaryAccessories: [
        {
            name: "Laptop Bags",
            img: './img/header/mega-menu/img4.png'
        },
        {
            name: "Car Storage & Organizers",
            img: './img/header/mega-menu/img5.png'
        },
        {
            name: "Women’s Sleepwear",
            img: './img/header/mega-menu/img6.png'
        },
        {
            name: "Security & Surveillance",
            img: './img/header/mega-menu/img7.png'
        },
        {
            name: "Interior Accessories",
            img: './img/header/mega-menu/img8.png'
        },
        {
            name: "Women’s Slippers",
            img: './img/header/mega-menu/img9.png'
        },
        {
            name: "Boy’s Sets",
            img: './img/header/mega-menu/img10.png'
        },
        {
            name: "Women’s Beach Wear",
            img: './img/header/mega-menu/img20.png'
        },
        {
            name: "Smart Doorbells & Enrty",
            img: './img/header/mega-menu/img21.png'
        },
    ],
    ToysGames: [
        {
            name: "Baby Onesies",
            img: './img/header/mega-menu/img19.png'
        }, {
            name: "Interior Accessories",
            img: './img/header/mega-menu/img8.png'
        },
        {
            name: "Women’s Slippers",
            img: './img/header/mega-menu/img9.png'
        },
        {
            name: "Boy’s Sets",
            img: './img/header/mega-menu/img10.png'
        },
        {
            name: "Girl’s Shirts",
            img: './img/header/mega-menu/img11.png'
        }, {
            name: "Security & Surveillance",
            img: './img/header/mega-menu/img7.png'
        },
        {
            name: "Interior Accessories",
            img: './img/header/mega-menu/img8.png'
        },
        {
            name: "Women’s Slippers",
            img: './img/header/mega-menu/img9.png'
        },
        {
            name: "Boy’s Sets",
            img: './img/header/mega-menu/img10.png'
        },
        {
            name: "Women’s Beach Wear",
            img: './img/header/mega-menu/img20.png'
        },
        {
            name: "Smart Doorbells & Enrty",
            img: './img/header/mega-menu/img21.png'
        },
    ],
    Electronics: [
        {
            name: "Baby Onesies",
            img: './img/header/mega-menu/img19.png'
        }, {
            name: "Interior Accessories",
            img: './img/header/mega-menu/img8.png'
        },
        {
            name: "Women’s Slippers",
            img: './img/header/mega-menu/img9.png'
        },
        {
            name: "Women’s Slippers",
            img: './img/header/mega-menu/img9.png'
        },
        {
            name: "Boy’s Sets",
            img: './img/header/mega-menu/img10.png'
        },
        {
            name: "Women’s Beach Wear",
            img: './img/header/mega-menu/img20.png'
        },
        {
            name: "Smart Doorbells & Enrty",
            img: './img/header/mega-menu/img21.png'
        },
    ],
    ArtsCraftsSewing: [
        {
            name: "Baby Onesies",
            img: './img/header/mega-menu/img19.png'
        }, {
            name: "Interior Accessories",
            img: './img/header/mega-menu/img8.png'
        },
        {
            name: "Women’s Slippers",
            img: './img/header/mega-menu/img9.png'
        },
        {
            name: "Women’s Slippers",
            img: './img/header/mega-menu/img9.png'
        },
        {
            name: "Boy’s Sets",
            img: './img/header/mega-menu/img10.png'
        },
        {
            name: "Women’s Beach Wear",
            img: './img/header/mega-menu/img20.png'
        },
        {
            name: "Smart Doorbells & Enrty",
            img: './img/header/mega-menu/img21.png'
        },
        {
            name: "Car Audio & Video",
            img: './img/header/mega-menu/img14.png'
        },
        {
            name: "Women’s Sandals",
            img: './img/header/mega-menu/img15.png'
        },
        {
            name: "Women’s Glasses",
            img: './img/header/mega-menu/img16.png'
        },
        {
            name: "Home Decor Products",
            img: './img/header/mega-menu/img17.png'
        },
        {
            name: "Girl’s Sets",
            img: './img/header/mega-menu/img18.png'
        },
        {
            name: "Baby Onesies",
            img: './img/header/mega-menu/img19.png'
        },
        {
            name: "Women’s Beach Wear",
            img: './img/header/mega-menu/img20.png'
        },
    ],
    PatioLawnGarden: [
        {
            name: "Baby Onesies",
            img: './img/header/mega-menu/img19.png'
        }, {
            name: "Interior Accessories",
            img: './img/header/mega-menu/img8.png'
        },
        {
            name: "Women’s Slippers",
            img: './img/header/mega-menu/img9.png'
        },
        {
            name: "Women’s Slippers",
            img: './img/header/mega-menu/img9.png'
        },
        {
            name: "Boy’s Sets",
            img: './img/header/mega-menu/img10.png'
        },
        {
            name: "Women’s Sandals",
            img: './img/header/mega-menu/img15.png'
        },
        {
            name: "Women’s Glasses",
            img: './img/header/mega-menu/img16.png'
        },
        {
            name: "Home Decor Products",
            img: './img/header/mega-menu/img17.png'
        },
        {
            name: "Girl’s Sets",
            img: './img/header/mega-menu/img18.png'
        },
        {
            name: "Baby Onesies",
            img: './img/header/mega-menu/img19.png'
        },
        {
            name: "Women’s Beach Wear",
            img: './img/header/mega-menu/img20.png'
        },
    ],
    Automotive: [
        {
            name: "Baby Onesies",
            img: './img/header/mega-menu/img19.png'
        }, {
            name: "Interior Accessories",
            img: './img/header/mega-menu/img8.png'
        },
        {
            name: "Women’s Slippers",
            img: './img/header/mega-menu/img9.png'
        },
        {
            name: "Women’s Slippers",
            img: './img/header/mega-menu/img9.png'
        },
    ],
    BagsLuggage: [
        {
            name: "Baby Onesies",
            img: './img/header/mega-menu/img19.png'
        }, {
            name: "Interior Accessories",
            img: './img/header/mega-menu/img8.png'
        },
    ],
    WomenUnderwearSleep: [
        {
            name: "Baby Onesies",
            img: './img/header/mega-menu/img19.png'
        }, {
            name: "Interior Accessories",
            img: './img/header/mega-menu/img8.png'
        },
        {
            name: "Baby Dresses",
            img: './img/header/mega-menu/img13.png'
        },
        {
            name: "Car Audio & Video",
            img: './img/header/mega-menu/img14.png'
        },
        {
            name: "Women’s Sandals",
            img: './img/header/mega-menu/img15.png'
        },
        {
            name: "Women’s Glasses",
            img: './img/header/mega-menu/img16.png'
        },
        {
            name: "Home Decor Products",
            img: './img/header/mega-menu/img17.png'
        },
        {
            name: "Girl’s Sets",
            img: './img/header/mega-menu/img18.png'
        },
        {
            name: "Baby Onesies",
            img: './img/header/mega-menu/img19.png'
        },
    ],
}
