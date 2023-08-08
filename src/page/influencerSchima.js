export const validate = (values) => {
    let errors = {};

    // Validate first name field
    if (!values.first_name) {
        errors.first_name = "First name is required";
    } else if (values.first_name.length > 20) {
        errors.first_name = "First name cannot be more than 20 characters";
    }

    // Validate last name field
    if (!values.last_name) {
        errors.last_name = "Last name is required";
    } else if (values.last_name.length > 20) {
        errors.last_name = "Last name cannot be more than 20 characters";
    }

    // Validate email field
    if (!values.email) {
        errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "Email is invalid";
    }

    // Validate phone number field
    if (!values.phone_number) {
        errors.phone_number = "Phone number is required";
    } else if (values.phone_number.length < 3 || values.phone_number.length > 15) {
        errors.phone_number = "Phone number must be between 3 and 15 digits";
    }

    // Assuming the *_followers fields are numeric
    // Validate TikTok followers
    if (!values.tiktok_followers) {
        errors.tiktok_followers = "TikTok followers count is required";
    } else if (isNaN(values.tiktok_followers)) {
        errors.tiktok_followers = "TikTok followers count must be a number";
    }

    // Validate YouTube followers
    if (!values.youtub_followers) {
        errors.youtub_followers = "YouTube followers count is required";
    } else if (isNaN(values.youtub_followers)) {
        errors.youtub_followers = "YouTube followers count must be a number";
    }

    // Validate Instagram followers
    if (!values.instagram_followers) {
        errors.instagram_followers = "Instagram followers count is required";
    } else if (isNaN(values.instagram_followers)) {
        errors.instagram_followers = "Instagram followers count must be a number";
    }

    // Assuming the *_account fields are URLs
    // Validate TikTok account
    if (!values.tiktok_account) {
        errors.tiktok_account = "TikTok account URL is required";
    } else if (!/^https?:\/\//.test(values.tiktok_account)) {
        errors.tiktok_account = "TikTok account URL is invalid";
    }

    // Validate YouTube account
    if (!values.youtub_account) {
        errors.youtub_account = "YouTube account URL is required";
    } else if (!/^https?:\/\//.test(values.youtub_account)) {
        errors.youtub_account = "YouTube account URL is invalid";
    }

    // Validate Instagram account
    if (!values.instagram_account) {
        errors.instagram_account = "Instagram account URL is required";
    } else if (!/^https?:\/\//.test(values.instagram_account)) {
        errors.instagram_account = "Instagram account URL is invalid";
    }


    // Validate country field
    if (!values.country_id) {
        errors.country_id = "Country is required";
    }

    // Validate state field
    if (!values.state_id) {
        errors.state_id = "State is required";
    }

    // Validate first intrest field
    if (!values.intrest) {
        errors.intrest = "First intrest is required";
    }

    return errors;
};
