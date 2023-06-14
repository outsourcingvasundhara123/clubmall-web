import React, { useState, useRef } from 'react'
import Layout from '../../layout/Layout'
import { Button, Form, Modal, NavLink, } from 'react-bootstrap'
import "react-phone-input-2/lib/bootstrap.css";
import SucessSnackBar from "../SnackBar/SnackBar";
import ErrorSnackBar from "../SnackBar/SnackBar";
import { getServerURL } from '../../helper/envConfig';
import api from '../../helper/api';
import { useNavigate } from 'react-router-dom'
import { validate } from './LoginSchema';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from '@greatsumini/react-facebook-login';
import { MdOutlineClose } from "react-icons/md"
import { Link } from 'react-router-dom';
import { login } from '../../helper/auth';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import AppleLogin from 'react-apple-login';
import { BsApple } from 'react-icons/bs'
import axios from 'axios';
import { SOCIALLOGIN } from '../../helper/endpoints';


const LogIn = () => {

  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
    login_type: "4",
    terms_and_condition: "",
  };

  const [showPass, setShowPass] = useState(true)
  const [otpShow, SetOtpShow] = useState(false)
  const [show, setShow] = useState(false);

  const handleClose = () => {
    SetOtpShow(false)
    setShow(false)
    setValues(" ")
  };
  const handleShow = () => {
    SetOtpShow(true)
    setShow(true);
  }

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [Mymessage, setMyMessage] = useState("");
  const [submitCount, setSubmitCount] = useState(0);
  const serverURL = getServerURL();
  const [sucessSnackBarOpen, setSucessSnackBarOpen] = useState(false);
  const [warningSnackBarOpen, setWarningSnackBarOpen] = useState(false);
  const [otpEmail, SetEmail] = useState("")
  const inputRefs = useRef([]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedValues = { ...values };

    const validationErrors = validate(updatedValues);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        updatedValues.login_type = "4"
        api.post(`${serverURL}login`, updatedValues)
          .then((res) => {
            console.log(res.data, "res.data");
            if (res.data.success === true) {
              if (res.data.data.user) {
                setMyMessage(res.data.message);
                setSucessSnackBarOpen(!sucessSnackBarOpen);
                login(res.data.data.user);
                setTimeout(() => {
                  setValues(initialValues);
                  navigate("/");
                }, 1000);

              } else {
                console.log("else");
                SetOtpShow(true)
                SetEmail(updatedValues.email)
                setMyMessage(res.data.message);
                setSucessSnackBarOpen(!sucessSnackBarOpen);
              }
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

  const googlelogin = useGoogleLogin({

    onSuccess: async (respose) => {
      try {
        const res = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${respose.access_token}`,
            },
          }
        );
        api.post(`${serverURL + SOCIALLOGIN}`, {
          email: res.data.email,
          social_login_type: 2,
          social_login_id: res.data.sub,
          login_type: 4,
          name: res.data.name,
          username: res.data.given_name
        })
          .then((res) => {
            setMyMessage(res.data.message);
            setSucessSnackBarOpen(!sucessSnackBarOpen);
            login(res.data.data.user);
            setTimeout(() => {
              setValues(initialValues);
              navigate("/");
            }, 1000);
          })
      } catch (err) {
        console.log(err);
      }
    },
  });

  const handleChangeotp = (index, event) => {
    const { value } = event.target;
    let newValue = value;

    // Restrict input to a single digit
    if (value.length > 1) {
      newValue = value.slice(0, 1);
    }

    // Validate input as a number
    if (!isNaN(newValue)) {
      setValues((prevValues) => ({
        ...prevValues,
        [`otp${index}`]: newValue,
      }));

      // Auto focus on the next input field
      if (newValue !== '') {
        const nextIndex = index + 1;
        if (nextIndex < 7) {
          inputRefs.current[nextIndex].focus();
        }
      }
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && values[`otp${index}`] === '') {
      if (index > 1) {
        const prevIndex = index - 1;
        inputRefs.current[prevIndex].focus();
      }
    }
  };

  const SubmitOTP = (e) => {

    e.preventDefault();

    var myotp = values.otp1 + values.otp2 + values.otp3 + values.otp4 + values.otp5 + values.otp6

    if (myotp.length === 6) {
      try {
        api.post(`${serverURL}verify-email`, {
          email: otpEmail,
          verification_code: myotp
        })
          .then((res) => {
            console.log(res.data, "send otp");
            if (res.data.success == true) {
              setValues(initialValues);
              setMyMessage(res.data.message);
              setSucessSnackBarOpen(!sucessSnackBarOpen);
              // login({token:res.data.data.token});
              setTimeout(() => {
                SetOtpShow(false)
                // navigate("/login");
              }, 1000);
            } else {
              setMyMessage(res.data.message);
              setWarningSnackBarOpen(!warningSnackBarOpen);
            }
          });
      } catch (error) {
        setWarningSnackBarOpen(!warningSnackBarOpen);
        console.error(error);
      }
    } else {
      setMyMessage("Enter a valid otp");
      setWarningSnackBarOpen(!warningSnackBarOpen);
    }
  };

  const SubSendEmail = (e) => {

    e.preventDefault();

    if (values.email) {
      try {
        api.post(`${serverURL}forgot-password`, {
          email: values.email
        }).then((res) => {
          console.log(res.data, "send otp");
          if (res.data.success == true) {
            setMyMessage(res.data.message);
            setSucessSnackBarOpen(!sucessSnackBarOpen);
            SetOtpShow(1)
            SetEmail("")
          } else {
            setMyMessage(res.data.message);
            setWarningSnackBarOpen(!warningSnackBarOpen);
          }
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      setMyMessage("Enter a email");
      setWarningSnackBarOpen(!warningSnackBarOpen);
    }
  };

  const SubmitResetPassword = (e) => {

    e.preventDefault();
    console.log(errors);
    if (values.email && (!errors.password) && values.password && values.reset_password_otp) {
      try {
        api.post(`${serverURL}reset-password`, {
          email: values.email,
          password: values.password,
          reset_password_otp: values.reset_password_otp
        }).then((res) => {
          if (res.data.success == true) {
            setMyMessage(res.data.message);
            setSucessSnackBarOpen(!sucessSnackBarOpen);
            setValues(initialValues);
            setTimeout(() => {
              handleClose()
            }, 1000);
          } else {
            setMyMessage(res.data.message);
            setWarningSnackBarOpen(!warningSnackBarOpen);
          }
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      setMyMessage("Enter OTP and New password");
      setWarningSnackBarOpen(!warningSnackBarOpen);
    }
  };

  console.log(otpShow, "otpShow");
  console.log(values, "values");

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
                  <Button className='show-hide-pass' onClick={() => setShowPass(!showPass)}>
                    {showPass ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </Button>
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
                <label htmlFor='check_terms' className='pointer'>I accept to the <Link to="/privacy-policy">Privacy Policy</Link> & <NavLink>Terms & Condition</NavLink></label>
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
                {/* <div className='google-login'>
                  <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
                </div> */}
                <NavLink>
                  <img onClick={googlelogin} src='./img/login/google.png' alt='' />
                </NavLink>
                {/* <NavLink><img src='./img/login/facebook.png' alt='' /></NavLink> */}
                <FacebookLogin
                  appId={process.env.REACT_APP_APP_ID}
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
                ><img src='./img/login/facebook.png' alt='' /></FacebookLogin>

                <AppleLogin
                  clientId="YOUR_CLIENT_ID"
                  redirectURI="YOUR_REDIRECT_URL"
                  usePopup={true} // Catch the response
                  scope="email name"
                  responseMode="query"
                  render={renderProps => (
                    <button
                      onClick={renderProps.onClick}
                      style={{
                        backgroundColor: "white",
                        border: "none",
                        fontSize: "35px",
                        padding: "0px",
                        display: "flex",
                      }}
                    >
                      <BsApple />
                    </button>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={otpShow} onHide={handleClose}
        centered className='forgot-pass'>
        <Modal.Body>
          <div className='pass-body position-relative p-3'>
            <Button className='close-modal-btn forgot-pass-close'
              onClick={handleClose}
            >
              <MdOutlineClose />
            </Button>

            {
              show ? <div className='pass-model-title text-center'>
                <h3>Forget Password?</h3>
                {(otpShow !== 1 && show == true) &&
                  <p className='mt-2'>Enter email to retrieve OTP for resetting password</p>
                }

              </div> : <div className='pass-model-title text-center'>
                <h3>Verify Email </h3>
                <p>Enter verification code to verify your email</p>
              </div>
            }

            {
              (otpShow !== 1 && show == true)
                ?
                <>
                  <div className='login-input text-start mt-3'>
                    <input placeholder='Enter your email '
                      name="email"
                      onChange={handleChange}
                      value={values.email}
                      type='text'
                      autoComplete="off"
                    />
                  </div>
                  <Button type='button' className='w-100 mt-4 submit-btn' onClick={SubSendEmail}>Submit</Button>
                </>
                :
                <div className='login-input text-start mt-3'>
                  {(otpShow !== true) &&
                    <>
                      <Form >
                        <label>OTP</label>
                        <input placeholder='Enter OTP'
                          name="reset_password_otp"
                          onChange={handleChange}
                          value={values.reset_password_otp}
                          type='number'
                          autoComplete="off"
                          max={6}
                        />
                        <label className='mt-2'>New Password</label>
                        <div className='position-relative'>
                          <input placeholder='Enter your Password'
                            onChange={handleChange} name='password' value={values.password}
                            autoComplete="off"
                            type={showPass ? "password" : "text"} />
                          <div className='error pass-error' >{(errors?.password !== "Password is required") && errors?.password}</div>
                          <Button className='show-hide-pass' onClick={() => setShowPass(!showPass)}>
                            {showPass ? <AiFillEyeInvisible /> : <AiFillEye />}
                          </Button>
                        </div>
                        <Button type='button' className='w-100 mt-4 submit-btn' onClick={SubmitResetPassword}>Submit</Button>
                      </Form>
                    </>
                  }

                </div>
            }

            {
              (!show && otpShow) &&
              <Form onSubmit={handleSubmit}>
                <div className='otp d-flex align-items-center justify-content-center mt-4 mb-1 gap-3 w-100'>
                  {[1, 2, 3, 4, 5, 6].map((index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      value={values[`otp${index}`]}
                      type="number"
                      name={`otp${index}`}
                      onChange={(event) => handleChangeotp(index, event)}
                      onKeyDown={(event) => handleKeyDown(index, event)}
                      maxLength={1}
                      min={0}
                      max={9}
                      autoComplete="off"
                    />
                  ))}
                </div>
                <Button type='button' className='w-100 mt-4 submit-btn' onClick={SubmitOTP}>Submit</Button>
              </Form>
            }

          </div>
        </Modal.Body>
      </Modal>

    </Layout>
  )
}

export default LogIn
