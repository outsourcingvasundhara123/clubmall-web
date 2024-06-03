import React, { useContext, useState, useRef } from "react";
import { Button, Dropdown } from "react-bootstrap";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import api from "../../../../helper/apiAdmin";
import { getServerURL } from "../../../../helper/envConfig";
import SucessSnackBar from "../../../../components/SnackBar";
import ErrorSnackBar from "../../../../components/SnackBar";
import { logoutAdmin } from "../../../../helper/authAdmin";
import { useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from "../../../../context/CartContext";

const Header = (props) => {

  const {  setMainLoder } = useContext(CartContext);
  const UserName = localStorage.getItem("adminname") ? localStorage.getItem("adminname") : "undefail"
  const defaultProfile = `../../admin-img/header/profile.svg`
  const Userprofile = localStorage.getItem("adminprofile_image") ? localStorage.getItem("adminprofile_image") : defaultProfile
  const [Mymessage, setMyMessage] = useState("");
  const [sucessSnackBarOpen, setSucessSnackBarOpen] = useState(false);
  const [warningSnackBarOpen, setWarningSnackBarOpen] = useState(false);
  const serverURL = getServerURL();


  const location = useLocation(); // Access current URL

  // Function to extract name from URL
  const getPageName = () => {
    const pathname = location.pathname;
    const parts = pathname.split("/");
    const lastPart = parts[parts.length - 2];
    // Replace hyphens with spaces and capitalize first letter of each word
    return lastPart.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getHeaderTitle = () => {
    const pathname = location.pathname;
    if (pathname.includes("admin/product")) {
      return "Product";
    } else {
      return getPageName();
    }
  };

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
    <header className="header2">

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


      <div className="d-flex align-items-center justify-content-between">
      <h5>{getHeaderTitle()}</h5> {/* Show dynamically extracted name or "Product" */}
        <div className="d-flex align-items-center gap-3">
          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic">
              <img alt="" src={Userprofile} className="user-img" />
              <span>Hello, {UserName}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={handleLogout}
                className="d-flex align-items-center gap-3"
              >
                <span>
                  <img alt="" src="../../admin-img/sidebar/logout.svg" width="18px" />
                </span>
                Log Out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Button className="toggle-btn" onClick={() => props.setToggle(!props.toggle)}>
            <AiOutlineMenuUnfold />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
