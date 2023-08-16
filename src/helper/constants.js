
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
            }, 1000);
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
    window.location.href = `/product-info/${productId}`;
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
