import React, { Fragment, useState , useContext } from 'react'
import { Button, Form, NavLink } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import api from '../../../helper/apiAdmin'
import { getServerURL } from '../../../helper/envConfig'
import { Is_Login } from '../../../helper/IsLogin'
import { useNavigate } from 'react-router-dom'
import ErrorSnackBar from "../../SnackBar/SnackBar";
import SucessSnackBar from "../../SnackBar/SnackBar";
import { CartContext } from '../../../context/CartContext'
import { validate } from './SigninSchima';
import  secureLocalStorage  from  "react-secure-storage";
import { loginAdmin } from '../../../helper/authAdmin'


const SignIn = () => {

    const initialValues = {
        email: "",
        password: "",
        login_type: "1",
    };

    const { localCartPostData, getLocalCartPostData, localCart, getLocalCartData, setMainLoder } = useContext(CartContext);

    const [showPass, setShowPass] = useState();
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [Mymessage, setMyMessage] = useState("");
    const [submitCount, setSubmitCount] = useState(0);
    const serverURL = getServerURL();
    const [sucessSnackBarOpen, setSucessSnackBarOpen] = useState(false);
    const [warningSnackBarOpen, setWarningSnackBarOpen] = useState(false);
    const navigate = useNavigate();

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
            updatedValues.login_type = "1"
            setMainLoder(true)
    
            api.post(`${serverURL}login`, updatedValues)
              .then(async (res) => {
                if (res.data.success === true) {
                  if (res.data.data.user) {
                    loginAdmin(res.data.data.user);
                    secureLocalStorage.setItem("user_type", res.data.data.user.user_type);
                    setMyMessage(res.data.message);
                    setSucessSnackBarOpen(!sucessSnackBarOpen);
                    setTimeout(() => {
                        window.location.href = "/admin/product";
                      }, 1000);
                  } else {
                    // SetEmail(updatedValues.email);
                    setMyMessage(res.data.message);
                    setSucessSnackBarOpen(!sucessSnackBarOpen);
                  }
                } else if (res.data.success === false) {
                  setMyMessage(res.data.message);
                  setWarningSnackBarOpen(!warningSnackBarOpen);
                }
                setMainLoder(false)
    
              });
    
          } catch (error) {
            // setWarningSnackBarOpen(!warningSnackBarOpen);
            console.error(error);
          }
        }
      };

    return (
        <Fragment>
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
            <section className='auth-main d-flex align-items-center justify-content-center'>
                <div className='auth-box'>
                    <div>
                        <img src='./admin-img/logo.svg' width="100px" className='logo' alt='' />
                        <div className='auth-heading position-relative my-5'>
                            <h1>SIGN IN</h1>
                        </div>
                    </div>

                    <Form className='user-form' onSubmit={handleSubmit}>
                        <div className='input-main-auth'>
                            <label>Email</label>
                            <input type='text'
                                name="email"
                                onChange={handleChange}
                                value={values.email}
                                placeholder='Enter Email' />
                            <div className='errorAdmin' >{errors?.email}</div>
                        </div>
                        <div className='input-main-auth mt-4'>
                            <label>Password</label>
                            <div className='position-relative'>
                                <input type={showPass ? ' text' : 'password'}
                                onChange={handleChange} name='password' value={values.password}
                                placeholder='Enter Password' />
                                <Button className='show-pass' onClick={() => setShowPass(!showPass)}>
                                    {
                                        showPass ?
                                            <img src='./admin-img/show-pass.svg' width="25px" alt='' />
                                            :
                                            <img src='./admin-img/hide-pass.svg' width="25px" alt='' />
                                    }
                                </Button>
                            </div>
                            <div className='errorAdmin' >{errors?.password}</div>
                        </div>
                        <Button className='submit-btn'
                        type="submit"
                        onClick={() => setSubmitCount(1)}
                        >Sign in</Button>
                    </Form>
                </div>
            </section>
        </Fragment>
    )
}

export default SignIn
