import React, { useState, useEffect } from 'react'
import Layout from '../../layout/Layout'
import { Button, Col, Form, Modal, NavLink, Row } from 'react-bootstrap'
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { Link } from 'react-router-dom';
import api from '../../helper/api';
import { getServerURL } from '../../helper/envConfig';
import { validate } from './RegisterSchema';
import SucessSnackBar from "../SnackBar/SnackBar";
import ErrorSnackBar from "../SnackBar/SnackBar";
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google';

function Register() {


    const navigate = useNavigate();

    const initialValues = {
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        contact_no: "",
        country_id: "",
        state_id: "",
        password: "",
        terms_and_condition: "",
    };

    const [showPass, setShowPass] = useState(true)
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [Mymessage, setMyMessage] = useState("");
    const [stateList, setStateList] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [submitCount, setSubmitCount] = useState(0);
    const serverURL = getServerURL();
    const [sucessSnackBarOpen, setSucessSnackBarOpen] = useState(false);
    const [warningSnackBarOpen, setWarningSnackBarOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        let newValue = type === "checkbox" ? checked : value;


        if (name === "state_id") {
            const selectedState = stateList.find((state) => state.name === newValue);
            newValue = selectedState ? selectedState._id : "";
        }


        if (name === "country_id") {
            const selectedState = countryList.find((state) => state.name === newValue);
            newValue = selectedState ? selectedState._id : "";
        }

        if (submitCount > 0) {
            const validationErrors = validate({ ...values, [name]: newValue });
            setErrors(validationErrors);

            // Remove error message for the specific field if it is valid
            if (Object.keys(validationErrors).length === 0) {
                delete errors[name];
            }
        }

        setValues((prevValues) => ({
            ...prevValues,
            [name]: newValue,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedValues = { ...values }; // Create a copy of the values object

        const validationErrors = validate(updatedValues);
        setErrors(validationErrors);

        if (updatedValues.contact_no) {
            updatedValues.contact_no = "+" + updatedValues.contact_no;
        }

        if (updatedValues.first_name && updatedValues.last_name) {
            updatedValues.name = updatedValues.first_name + " " + updatedValues.last_name;
        }

        console.log(errors, "errors");

        // Perform additional actions if the form is valid
        if (Object.keys(validationErrors).length === 0) {
            updatedValues.user_type = "4";

            try {
                api.post(`${serverURL}signup`, updatedValues)
                    .then((res) => {
                        if (res.data.status === 1) {
                            setSucessSnackBarOpen(!sucessSnackBarOpen);
                            setValues(initialValues);
                            setMyMessage(res.data.message);
                            navigate("/login");
                        } else {
                            setMyMessage(res.data.message);
                            setWarningSnackBarOpen(!warningSnackBarOpen);
                        }
                    });
            } catch (error) {
                setWarningSnackBarOpen(!warningSnackBarOpen);
                console.error(error);
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const request1 = api.get(`${serverURL + "/country-list"}`);
                const request2 = api.get(`${serverURL + "/state-list"}`);
                const responses = await Promise.all([request1, request2]);
                setCountryList(responses[0].data.data.country);
                setStateList(responses[1].data.data.states);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const responseMessage = (response) => {
        console.log(response);
    };
    const errorMessage = (error) => {
        console.log(error);
    };

    return (

        <Layout>

            <SucessSnackBar
                open={sucessSnackBarOpen}
                setOpen={setSucessSnackBarOpen}
                text={Mymessage}
                type="success"
            />

            <ErrorSnackBar
                open={warningSnackBarOpen}
                setOpen={setWarningSnackBarOpen}
                text={Mymessage}
                type="error"
            />

            <div className='register-main spacing-cos'>
                <div className='register-box text-center'>
                    <h3>Register</h3>
                    <Form onSubmit={handleSubmit}
                        className='mt-4'>
                        <Row>
                            <Col lg={6} md={6} sm={12} className='mb-3'>
                                <div className='login-input text-start'>
                                    <label>First Name</label>
                                    <input placeholder='Enter your first name'
                                        type='text'
                                        name="first_name"
                                        onChange={handleChange}
                                        value={values.first_name}
                                    />
                                    <div className='error' >{errors?.first_name}</div>
                                </div>
                            </Col>
                            <Col lg={6} md={6} sm={12} className='mb-3'>
                                <div className='login-input text-start'>
                                    <label>Last Name</label>
                                    <input placeholder='Enter last name'
                                        type='text'
                                        name="last_name"
                                        onChange={handleChange}
                                        value={values.last_name}
                                    />
                                    <div className='error' >{errors?.last_name}</div>

                                </div>
                            </Col>
                            <Col lg={6} md={6} sm={12} className='mb-3'>
                                <div className='login-input text-start'>
                                    <label>User Name</label>
                                    <input placeholder='Enter user name' type='text'
                                        name="username"
                                        onChange={handleChange}
                                        value={values.username}
                                    />
                                    <div className='error' >{errors?.username}</div>
                                </div>
                            </Col>
                            <Col lg={6} md={6} sm={12} className='mb-3'>
                                <div className='login-input text-start'>
                                    <label>Contact number</label>
                                    <PhoneInput
                                        country={"eg"}
                                        enableSearch={true}
                                        name="contact_no"
                                        value={values.contact_no}
                                        onChange={(value) => handleChange({ target: { name: "contact_no", value } })}
                                    />
                                    <div className='error' >{errors?.contact_no}</div>

                                </div>
                            </Col>
                            <Col lg={6} md={6} sm={12} className='mb-3'>
                                <div className='login-input text-start'>
                                    <label>Country/Region</label>
                                    <select onChange={handleChange} name='country_id'
                                        value={values.country}
                                        className='select-arrow'>
                                        <option>Select Country</option>
                                        {
                                            countryList.map((e, i) =>
                                            (
                                                <option key={i} value={e.name}
                                                >{e.name}</option>

                                            ))
                                        }
                                    </select>
                                    <div className='error' >{errors?.country_id}</div>
                                </div>
                            </Col>
                            <Col lg={6} md={6} sm={12} className='mb-3'>
                                <div className='login-input text-start'>
                                    <label>State</label>
                                    <select onChange={handleChange}
                                        value={values.state}
                                        name='state_id' className='select-arrow'>
                                        <option>Select State</option>
                                        {
                                            stateList.map((e, i) =>
                                            (
                                                <option key={i} >{e.name}</option>

                                            ))
                                        }
                                    </select>
                                    <div className='error' >{errors?.state_id}</div>
                                </div>
                            </Col>
                            <Col lg={12} md={12} sm={12} className='mb-3'>
                                <div className='login-input text-start'>
                                    <label>Email Address</label>
                                    <input placeholder='Enater your email'
                                        name="email"
                                        onChange={handleChange}
                                        value={values.email}
                                        type='text' />
                                    <div className='error' >{errors?.email}</div>
                                </div>
                            </Col>
                            <Col lg={12} md={12} sm={12}>
                                <div className='login-input text-start position-relative'>
                                    <label>Password</label>
                                    <input placeholder='Enater your Password' onChange={handleChange} name='password' value={values.password} type={showPass ? "password" : "text"} />
                                    <Button className='show-hide-pass' onClick={() => setShowPass(!showPass)}><img src='./img/login/pass-show.png' alt='' /></Button>

                                    <div className='error' >{errors?.password}</div>

                                </div>
                            </Col>
                        </Row>
                        <div className='d-flex align-items-start check-terms gap-2 mt-3'>
                            <Form.Check
                                onChange={handleChange}
                                type="checkbox"
                                id="check_terms"
                                name="terms_and_condition"
                                checked={values.terms_and_condition}
                            />

                            <label htmlFor='check_terms' className='pointer'>I accept to the <NavLink>Privacy Policy</NavLink> & <NavLink>Terms & Condition</NavLink></label>

                        </div>
                        <div className='error d-flex align-items-start check-terms gap-2 mt-3' >{errors?.terms_and_condition}</div>
                        <Button
                            type="submit"
                            onClick={() => setSubmitCount(1)}
                            className='w-100 submit-btn'>Register </Button>
                    </Form>

                    <div className='footer-sec mt-4'>
                        <span className='register-link d-flex align-items-center gap-2 justify-content-center mt-3'>Already a user? <Link to='/login'> Login</Link></span>
                        <div className='or-sec d-flex align-items-center gap-2 my-2'>
                            <div className='line'></div>
                            <span>Or</span>
                            <div className='line'></div>
                        </div>
                        <div className='d-flex align-items-center justify-content-center gap-4 mt-3'>
                            <div className='google-login'>
                                <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
                            </div>
                            {/* <NavLink>
                                <img src='./img/login/google.png' alt='' />
                            </NavLink> */}
                            <NavLink><img src='./img/login/facebook.png' alt='' /></NavLink>
                        </div>
                    </div>
                </div>
            </div>

        </Layout>
    )
}

export default Register
