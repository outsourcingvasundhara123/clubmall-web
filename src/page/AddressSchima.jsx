export const validate = (values) => {
    let errors = {};
  
    // Validate country field
    if (!values.country_id) {
      errors.country_id = "Country is required";
    }
  
    // Validate state field
    if (!values.state_id) {
      errors.state_id = "State is required";
    }
  
    // Validate fullname field
    if (!values.fullname) {
      errors.fullname = "Full name is required";
    }
  
    // Validate contact_no field
    if (!values.contact_no) {
      errors.contact_no = "Contact number is required";
    } else if (values.contact_no.length < 3 || values.contact_no.length > 12) {
      errors.contact_no = "Contact number must be between 3 and 12 digits";
    }
  
    // Validate address field
    if (!values.address) {
      errors.address = "Address is required";
    }
  
    // Validate city field
    if (!values.city) {
      errors.city = "City is required";
    }
  
    // Validate zipcode field
    if (!values.zipcode) {
      errors.zipcode = "Zip code is required";
    }
  
    return errors;
  };