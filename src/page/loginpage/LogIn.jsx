import React, { useState } from 'react'
import Layout from '../../layout/Layout'
import { Button, Form, Modal, NavLink, } from 'react-bootstrap'
import "react-phone-input-2/lib/bootstrap.css";
import SucessSnackBar from "../SnackBar/SnackBar";
import ErrorSnackBar from "../SnackBar/SnackBar";
import { getServerURL } from '../../helper/envConfig';
import api from '../../helper/api';
import { useNavigate } from 'react-router-dom'
import { validate } from './LoginSchema';
import { GoogleLogin } from '@react-oauth/google';
import FacebookLogin from '@greatsumini/react-facebook-login';
import { MdOutlineClose } from "react-icons/md"
import { Link } from 'react-router-dom';
import { login } from '../../helper/auth';

const LogIn = () => {

  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
    login_type: "4",
    terms_and_condition: "",
  };

  const [showPass, setShowPass] = useState(true)

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [Mymessage, setMyMessage] = useState("");
  const [submitCount, setSubmitCount] = useState(0);
  const serverURL = getServerURL();
  const [sucessSnackBarOpen, setSucessSnackBarOpen] = useState(false);
  const [warningSnackBarOpen, setWarningSnackBarOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    let newValue = type === "checkbox" ? checked : value;


    if (submitCount > 0) {
      const validationErrors = validate({ ...values, [name]: newValue });
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length === 0) {
        delete errors[name];
      }
    }

    setValues((prevValues) => ({
      ...prevValues,
      [name]: newValue,
    }));
  };

  const [otpShow, SetOtpShow] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedValues = { ...values };

    const validationErrors = validate(updatedValues);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {

      try {
        api.post(`${serverURL}login`, updatedValues)
          .then((res) => {
            if (res.data.success === true) {
              setSucessSnackBarOpen(!sucessSnackBarOpen);
              setValues(initialValues);
              setMyMessage(res.data.message);
              login(res.data.data.user);
              navigate("/");
            } else if (res.data.success === false) {
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

      <div className='login-register'>
        <div className='spacing-cos'>
          <div className='login-box text-center'>
            <h3>Sign In</h3>
            <Form className='mt-4' onSubmit={handleSubmit} >
              <div className='login-input text-start'>
                <label>Email Address</label>
                <input placeholder='Enter your email'

                  name="email"
                  onChange={handleChange}
                  value={values.email}
                  type='text'
                />
                <div className='error' >{errors?.email}</div>
              </div>
              <div className='login-input text-start mt-3'>
                <label>Password</label>
                <div className='position-relative'>
                  <input placeholder='Enter your Password'
                    onChange={handleChange} name='password' value={values.password}

                    type={showPass ? "password" : "text"} />
                  <Button className='show-hide-pass' onClick={() => setShowPass(!showPass)}><img src='./img/login/pass-show.png' alt='' /></Button>
                  <div className='error pass-error' >{errors?.password}</div>
                </div>
                <div className='d-flex justify-content-end'><Button className='reset-pass' onClick={handleShow}>Forgot your password?</Button></div>
              </div>
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
              <div className='error d-flex align-items-start check-terms gap-2 mt-1' >{errors?.terms_and_condition}</div>

              <Button type="submit"
                onClick={() => setSubmitCount(1)}
                className='w-100 submit-btn'> Sign In </Button>
            </Form>

            <div className='footer-sec'>
              <span className='register-link d-flex align-items-center gap-2 justify-content-center mt-3'>Don't have an account?  <Link to='/register'> Register</Link></span>
              <div className='or-sec d-flex align-items-center gap-2 my-2'>
                <div className='line'></div>
                <span>Or</span>
                <div className='line'></div>
              </div>
              <div className='d-flex align-items-center justify-content-center gap-4 mt-3'>
                <div className='google-login'>
                  {/* <GoogleLogin onSuccess={responseMessage} onError={errorMessage} /> */}
                </div>
                {/* <NavLink>
                                <img src='./img/login/google.png' alt='' />
                            </NavLink> */}
                {/* <NavLink><img src='./img/login/facebook.png' alt='' /></NavLink> */}
                {/* <FacebookLogin
                  appId="1088597931155576"
                  style={{
                    backgroundColor: '#fff',
                    padding: "0px",
                    border: "none",
                  }}
                  onSuccess={(response) => {
                    console.log('Login Success!', response);
                  }}
                  onFail={(error) => {
                    console.log('Login Failed!', error);
                  }}
                  onProfileSuccess={(response) => {
                    console.log('Get Profile Success!', response);
                  }}
                ><img src='./img/login/facebook.png' alt='' /></FacebookLogin> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} centered className='forgot-pass'>
        <Modal.Body>
          <div className='pass-body position-relative p-3'>
            <Button className='close-modal-btn forgot-pass-close' onClick={handleClose}>
              <MdOutlineClose />
            </Button>
            <div className='pass-model-title text-center'>
              <h3>Forgot Password</h3>
              <p>No worries, we’ll send you reset instructions.</p>
            </div>
            <Form onSubmit={handleSubmit}>
              {
                otpShow ? <div className='otp d-flex align-items-center justify-content-center flex-wrap mt-4 mb-1 gap-3 w-100'>
                  <input type='number' max={1} />
                  <input type='number' max={1} />
                  <input type='number' max={1} />
                  <input type='number' max={1} />
                </div> :
                  <div className='login-input text-start mt-4'>
                    <label>Email Address</label>
                    <input placeholder='Rohan Vasundhara' type='text' />
                  </div>
              }

              <Button type='submit' className='w-100 mt-4 submit-btn' onClick={() => SetOtpShow(true)}> {otpShow ? "Submit" : "Send"} </Button>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
    </Layout>
  )
}

export default LogIn
