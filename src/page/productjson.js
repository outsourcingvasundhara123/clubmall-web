export const createJsonLdSchema = (product) => {

    return {
        "@context": "http://schema.org/",
        "@type": "Product",
        "name": product.productList?.name,
        "image": product.productImagePath  + product.productList?._id + "/" +  product.productList?.product_images[0]?.file_name, //assuming there is an image field in product
        "offers": {
          "@type": "Offer",
          "priceCurrency": "USD",
          "price": product.productList?.individual_price
          , //assuming there is a price field in product
          "availability": "http://schema.org/InStock",
          "itemCondition": "http://schema.org/NewCondition",
          "url": `https://clubmall.com/product-info/${product.productList?._id}` //assuming there is an id field in product
        }
    };
}