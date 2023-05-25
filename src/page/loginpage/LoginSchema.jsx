export const validate = (values) => {
    let errors = {};

    // Validate email field
    if (!values.email) {
        errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "Email is invalid";
    }

    // Validate password field
    if (!values.password) {
        errors.password = "Password is required";
    } else if (values.password.length < 3) {
        errors.password = "Password must be at least 6 characters long";
    }

    // Validate terms and conditions field
    if (!values.terms_and_condition) {
        errors.terms_and_condition = "You must accept the terms and conditions";
    }

    return errors;
};
