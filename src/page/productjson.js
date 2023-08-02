export const createJsonLdSchema = (product) => {
  console.log(product, "sku_details");
  let description = product.productList?.name +
    "Item ID: " + product.productList?.attributes['Product ID']?.[0] +
    "Pattern Type: " + product.productList?.attributes['Pattern Type']?.[0] +
    "Type: " + product.productList?.attributes.Type?.[0] +
    "Closure Type: " + product.productList?.attributes['Closure Type']?.[0] +
    "Details: " + product.productList?.attributes.Details?.[0] +
    "Waist Line: " + product.productList?.attributes['Waist Line']?.[0] +
    "Length: " + product.productList?.attributes.Length?.[0] +
    "Fit Type: " + product.productList?.attributes['Fit Type']?.[0] +
    "Fabric: " + product.productList?.attributes.Fabric?.[0] +
    "Material: " + product.productList?.attributes.Material?.[0] +
    "Composition: " + product.productList?.attributes.Composition?.[0] +
    "Care Instructions: " + product.productList?.attributes['Care Instructions']?.[0] +
    "Body: " + product.productList?.attributes.Body?.[0] +
    "Sheer: " + product.productList?.attributes.Sheer?.[0];


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
    "gtin8": product.productList?._id,
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
