import React from 'react'
import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';


const PublicRoutes = () => {
    const userInfoString = localStorage.getItem('UserInfo');
    const storedUserInfo = JSON.parse(userInfoString);
   
    const navigate = useNavigate();
  
    useEffect(() => {
      if (userInfoString) {
          navigate('/');
      }
  
      
    }, [])
  
    return storedUserInfo ?  null :<Outlet />
}

export default PublicRoutes
