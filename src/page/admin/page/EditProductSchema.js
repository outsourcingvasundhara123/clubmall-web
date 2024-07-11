export const validate = (values) => {
    let errors = {};

    // Validate name field
    if (!values.name) {
        errors.name = "Name is required";
    }
    if (!values.description) {
        errors.description = "Description is required";
    }
    if (!values.total_order) {
        errors.total_order = "Sales Quantity  is required";
    }
    // if (!values.product_qty) {
    //     errors.product_qty = " Quantity  is required";
    // }


    // Validate attributes field
    // if (!values.attributes) {
    //     errors.attributes = "Attributes is required";
    // }


    // Validate sku_attributes field
    // if (!values.sku_attributes) {
    //     errors.sku_attributes = "sku attributes is required";
    // }

    // Validate sku_details field
    // if (!values.sku_details || values.sku_details.filter(Boolean).length === 0) {
    //     errors.sku_details = "sku details is required";
    // }

    // Validate individual_price field
    if (!values.individual_price) {
        errors.individual_price = "individual price details is required";
    }
    if (!values.competitors_price) {
        errors.competitors_price = "competitors price details is required";
    }
    

    // Validate group_price field
    // if (!values.group_price) {
    //     errors.group_price = "group price is required";
    // }
    // Validate description field
    // if (!values.attributes) {
    //     errors.attributes = "description is required";
    // }

    // Validate product_images field
    // if (!values.product_images || values.product_images.filter(Boolean).length === 0) {
    //     errors.product_images = "You need to add at least  one image 1st";
    // } else {
    //     const invalidImage = values.product_images.find(img => {
    //         if (img && img.file) {
    //             return !['image/jpeg', 'image/png'].includes(img.file.type);
    //         }
    //         return false;
    //     });

    //     if (invalidImage) {
    //         errors.product_images = "Only jpeg or png images are allowed";
    //     }
    // }
 
    // Validate product_category_keys field
    // if (!values.group_price) {
    //     errors.group_price = "group price is required";
    // }

    // Validate category field
    // if (!values.category) {
    //     errors.category = "category is required";
    // }

    // // Validate subCategory field
    // if (!values.subcategory) {
    //     errors.subcategory = "sub Category is required";
    // }

    return errors;
};


