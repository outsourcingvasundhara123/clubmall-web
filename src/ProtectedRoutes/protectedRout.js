import React from 'react'
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const protectedRout = () => {
    const navigate = useNavigate();
    const sessionToken = localStorage.getItem("token");
    const token = useSelector(state => state.token)
  
    const checkUserToken = () => sessionToken !== token && navigate("/admin-login");
  
    useEffect(() => {
      checkUserToken();
    }, []);
  
    return sessionToken === token && children;
}

export default protectedRout