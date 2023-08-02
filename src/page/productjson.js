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
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.productList?.name,
    "image": product.productImagePath + product.productList?._id + "/" + product.productList?.product_images[0]?.file_name,
    "description": description,
    "brand": {
      "@type": "Brand",
      "name": "Clubmall"
    },
    "gtin8": product.productList?.attributes['Product ID']?.[0],
    "url": `https://clubmall.com/product-info/${product.productList?._id}`, //assuming there is an id field in product
    "priceCurrency": "USD",
    "price": product.productList?.individual_price,
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition",
    "color": colors,
    "size": sizes,
    "material": product.productList?.attributes.Material?.[0],
  };

}
