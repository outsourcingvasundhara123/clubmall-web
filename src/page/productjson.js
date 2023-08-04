export const createJsonLdSchema = (product) => {
  // console.log(product,"product");

  function generateDescription(attributes) {
    let description = "";

    Object.entries(attributes || {}).forEach(([key, value]) => {
      if (key === "Product ID") {
        description += `Item ID: ${value[0]} `;
      } else {
        description += `${key}: ${Array.isArray(value) ? value.join(", ") : value} `;
      }
    });

    return description;
  }

  let description = generateDescription(product.productList?.attributes);

    let colors = []; // Create colors as an array instead of an object
    let sizes = [];  // Create sizes as an array instead of an object

    product.productList?.sku_details?.forEach((sku) => {
      if (sku.attrs) {
        sku.attrs?.forEach((attr) => {
          if (attr.color && !colors.includes(attr.color)) {
            colors.push(attr.color); // Push colors to the array
          }
          if (attr.size && !sizes.includes(attr.size)) {
            sizes.push(attr.size);   // Push sizes to the array
          }
        });
      }
    });

  return {
    "@context": {
      "schema": "http://schema.org/"
    },
   "@type": "Product",
   "@id": `https://clubmall.com/product-info/${product.productList?._id}`,
    "itemID": product.productList?.attributes['Product ID']?.[0],
    "name": product.productList?.name,
    "description": description,
    "url": `https://clubmall.com/product-info/${product.productList?._id}`, //assuming there is an id field in product
    "image": product.productImagePath + product.productList?._id + "/" + product.productList?.product_images[0]?.file_name,
    "brand": "Clubmall",
    "material": product.productList?.attributes.Material?.[0],
    "size": sizes,
    "offers": {
      "@type": "Offer",
      "price": product.productList?.individual_price,
      "priceCurrency": "USD",
      "availability": "http://schema.org/InStock"
    },
    "color": colors,
  };

}
