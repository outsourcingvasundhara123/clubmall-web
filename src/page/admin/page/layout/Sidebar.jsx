import React, { useContext, useState, useRef } from "react";
import { NavLink } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import api from "../../../../helper/apiAdmin";
import { getServerURL } from "../../../../helper/envConfig";
import SucessSnackBar from "../../../../components/SnackBar";
import ErrorSnackBar from "../../../../components/SnackBar";
import { logoutAdmin } from "../../../../helper/authAdmin";
import { useNavigate } from 'react-router-dom';
import { CartContext } from "../../../../context/CartContext";

const Sidebar = (props) => {


    const {  setMainLoder } = useContext(CartContext);
    const UserName = localStorage.getItem("adminname") ? localStorage.getItem("admin  name") : "undefail"
    const defaultProfile = `../img/for_you/defaultuser.png`
    const Userprofile = localStorage.getItem("adminprofile_image") ? localStorage.getItem("adminprofile_image") : defaultProfile
    const [Mymessage, setMyMessage] = useState("");
    const [sucessSnackBarOpen, setSucessSnackBarOpen] = useState(false);
    const [warningSnackBarOpen, setWarningSnackBarOpen] = useState(false);
    const serverURL = getServerURL();
  
    const handleLogout = () => {
  
      setMainLoder(true)
      try {
        api.postWithToken(`${serverURL}logout`)
          .then((res) => {
            if (res.data.success === true) {
              setSucessSnackBarOpen(!sucessSnackBarOpen);
              setMyMessage(res.data.message);
              setTimeout(() => {
                setMainLoder(false)
                logoutAdmin();
                // navigate("/login");
              }, 1000);
            } else if (res.data.success === false) {
              setMyMessage(res.data.message);
              setWarningSnackBarOpen(!warningSnackBarOpen);
            }
            setMainLoder(false)
          });
      } catch (error) {
        setMainLoder(false)
        console.error(error);
      }
    };
  
    return (
        <div className={`${props.toggle ? "m-0" : ""} sidebar`}>

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

            <div className=' text-center py-5'>
                <img alt='' src='../../admin-img/logo.svg' width="80px" />
            </div>
            <div className='menu'>
                <ul>
                    <li>
                        <Link to="/admin/product" className="active" >
                            <span className='menu-icon'>
                                <img alt='' src='../../admin-img/sidebar/fees.svg' width="19px" />
                            </span>
                            Product
                        </Link>
                    </li>
                    <li>
                        <NavLink
                        onClick={handleLogout}
                        >
                            <span className='menu-icon'>
                                <img alt='' src='../../admin-img/sidebar/logout.svg' width="19px" />
                            </span>
                            Log Out
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Sidebar
