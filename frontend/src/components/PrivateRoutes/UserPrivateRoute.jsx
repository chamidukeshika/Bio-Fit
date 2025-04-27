import React from 'react'
import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

const UserPrivateRoute = () => {
    const userInfoString = localStorage.getItem('UserInfo');
    const storedUserInfo = JSON.parse(userInfoString);
    
    const navigate = useNavigate();
  
    useEffect(() => {
        
        if(userInfoString){
            console.log(storedUserInfo);
            if (storedUserInfo.userType != "User") {
                
                navigate('/login');
            }
        }
        else{
            navigate('/login');
        }
      
  
      
    }, [])
  
    return storedUserInfo && storedUserInfo.userType == "User" ? <Outlet /> :  null ;
}

export default UserPrivateRoute
