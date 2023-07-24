export const validate = (values) => {
    let errors = {};

    // Validate email field
    if (!values.email) {
        errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "Email is invalid";
    }

    // Validate first_name field
    if (!values.first_name) {
        errors.first_name = "First name is required";
    } else if (values.first_name.length < 2) {
        errors.first_name = "First name must be at least 2 characters long";
    }

    // Validate phone_number field
    if (!values.phone_number) {
        errors.phone_number = "Phone number is required";
    }
    // } else if (!/^\d{10}$/.test(values.phone_number)) {
    //     errors.phone_number = "Phone number must be exactly 10 digits long";
    // }

    // Validate information field
    if (!values.information) {
        errors.information = "Interest is required";
    }


    return errors;
};
