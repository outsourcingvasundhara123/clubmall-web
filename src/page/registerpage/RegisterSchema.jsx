
export const validate = (values) => {
  let errors = {};

  // Validate name field
//   if (!values.first_name) {
//     errors.first_name = "First name is required";
//   }else if (values.first_name.length > 20) {
//     errors.first_name = "First name can not be more than 20 character";
//   }

//   // Validate last name field
//   if (!values.last_name) {
//     errors.last_name = "Last name is required";
//   }else if ( values.last_name.length > 20) {
//     errors.last_name = " Last name can not be more than 20 character";
//   }

// // Validate username field
// if (!values.username) {
//   errors.username = "Username is required";
// } else if (values.username.length < 3 ) {
//   errors.username = "Username must be under 3 ";
// }

  // Validate email field
  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "Email is invalid";
  }

// // Validate contact number field
// if (!values.contact_no) {
//   errors.contact_no = "Contact number is required";
// } else if (values.contact_no.length < 3 || values.contact_no.length > 12) {
//   errors.contact_no = "Contact number must be a 3 to 12-digit";
// }
//   // Validate country field
//   if (!values.country_id) {
//     errors.country_id = "Country is required";
//   }

//   // Validate state field
//   if (!values.state_id) {
//     errors.state_id = "State is required";
//   }

  // Validate password field
  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 3) {
    errors.password = "Password must be at least 3 characters long";
  }

// Validate terms and conditions field
if (!values.terms_and_condition) {
  errors.terms_and_condition = "You must accept the terms and conditions";
}

  return errors;
};


