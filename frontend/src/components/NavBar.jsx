import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { Button } from 'react-bootstrap';
import { Home, FitnessCenter, Fastfood, Search, ListAlt, Settings } from '@mui/icons-material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const NavBar = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const userInfoString = localStorage.getItem('UserInfo');
  const storedUserInfo = JSON.parse(userInfoString);
  const [user, setUser] = useState({});

  const location = useLocation();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/users/getUserById/${storedUserInfo.id}`
        );
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    if (storedUserInfo) loadUser();
  }, []);

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleSignOut = () => {
    localStorage.removeItem('UserInfo');
    window.location.href = '/login';
  };

  return (
    <AppBar
      position="fixed"
      style={{
        background: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        top: 0,
        zIndex: 1000,
        height: '60px',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 30px' }}>

        {/* Logo */}
        <div className="ms-2" style={{ width: '75px', height: '35px' }}>
          <Link to={`/`}>
            <img src="/src/assets/biofit.png" alt="Bio-Fit Logo" style={{ width: '100%', height: '80%' }} />
          </Link>
        </div>

        {/* Navigation Icons */}
        <Box sx={{ display: 'flex', gap: '80px', flexGrow: 1, justifyContent: 'center', marginLeft: '40px', }}>
          {[
            { href: '/', icon: <Home />, label: 'Feed' },
            { href: '/WorkoutPlans', icon: <FitnessCenter />, label: 'Workouts' },
            { href: '/HomeMealPlans', icon: <Fastfood />, label: 'Meals' },
            { href: '/AllStatus', icon: <ListAlt />, label: 'Status' },
            { href: '/usersearch', icon: <Search />, label: 'Search' },
          ].map((item, index) => {
            const isActive = location.pathname === item.href ||
              (item.href !== '/' && location.pathname.includes(item.href));

            return (
              <a key={index} href={item.href} style={{ textDecoration: 'none', color: 'black' }}>
                <IconButton
                  sx={{
                    color: isActive ? '#0077B6' : '#333',
                    transition: 'transform 0.3s ease, color 0.3s ease',
                    '&:hover': {
                      color: '#0077B6',
                      backgroundColor: 'transparent',
                    }
                  }}
                >
                  {item.icon}
                  {isActive && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '90%',
                        transform: 'translateX(-50%)',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#0077B6',
                      }}
                    />
                  )}
                </IconButton>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    textAlign: 'center',
                    color: isActive ? '#0077B6' : '#333',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '0.75rem',
                  }}
                >
                  {item.label}
                </Typography>
              </a>
            );
          })}
        </Box>

        {/* User Profile / Login Button */}
        {userInfoString ? (
          <Box style={{ display: 'flex', alignItems: 'center', gap: '15px', marginRight: '20px' }}>

            {/* User Avatar with Tooltip */}
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt={user.firstName || 'User'}
                  src={user.profilePicURL}
                  style={{
                    border: '2px solid #0077B6',
                    boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.2)',
                    width: '35px',
                    height: '35px',
                    transition: 'transform 0.3s ease',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
              </IconButton>
            </Tooltip>

            {/* User Name & Settings */}
            <Box style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px' }} onClick={handleOpenUserMenu}>
              <Typography
                sx={{
                  fontWeight: '500',
                  color: '#333',
                  fontSize: '14px',
                  transition: 'color 0.3s ease',
                }}
                onMouseOver={(e) => (e.target.style.color = '#0077B6')}
                onMouseOut={(e) => (e.target.style.color = '#333')}
              >
                {user.firstName}
              </Typography>
              <Settings sx={{ fontSize: '20px', color: '#555', transition: 'color 0.3s ease' }} />
            </Box>

            {/* User Menu Dropdown */}
            <Menu
              sx={{ mt: '45px' }}
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <a href="/myprofile" style={{ textDecoration: 'none', color: 'black' }}>
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">Profile</Typography>
                </MenuItem>
              </a>
              <MenuItem onClick={handleSignOut}>
                <Typography textAlign="center" style={{ color: 'red' }}>Sign Out</Typography>
              </MenuItem>
            </Menu>

          </Box>

        ) : (
          <a href="/login">
            <Button
              style={{
                background: '#0077B6',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '20px',
                padding: '8px 20px',
                border: 'none',
                transition: '0.3s ease',
                boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.1)',
                marginRight: '20px',
              }}
              onMouseOver={(e) => (e.target.style.background = '#00B4D8')}
              onMouseOut={(e) => (e.target.style.background = '#0077B6')}
            >
              Login
            </Button>
          </a>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
