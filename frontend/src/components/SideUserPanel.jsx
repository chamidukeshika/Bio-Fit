import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { Box, CircularProgress, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { Settings, ExitToApp, Person } from '@mui/icons-material';

const SideUserPanel = () => {
    const userInfoString = localStorage.getItem('UserInfo');
    const storedUserInfo = JSON.parse(userInfoString);
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`http://localhost:8080/api/users/getUserById/${storedUserInfo.id}`);
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setIsLoading(false);
        };
        loadData();
    }, []);

    const handleMenuOpen = (event) => setMenuAnchor(event.currentTarget);
    const handleMenuClose = () => setMenuAnchor(null);

    const handleSignOut = () => {
        localStorage.removeItem('UserInfo');
        window.location.href = '/login';
    };

    return (
        <Box
            sx={{
                width: '22%',
                height: '80vh',
                position: 'fixed',
                top: '12%',
                left: 0,
                margin: '1%',
                padding: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '12px',
                boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': { transform: 'scale(1.02)', boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.4)' }
            }}
        >
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
                    <CircularProgress sx={{ color: '#0077B6' }} />
                </Box>
            ) : (
                <>
                    {/* Profile Section */}
                    <Box sx={{ textAlign: 'center' }}>
                        <img
                            src={user.profilePicURL}
                            alt="User Avatar"
                            width={110}
                            height={110}
                            style={{
                                borderRadius: '50%',
                                border: '1.5px solid rgba(0, 118, 182)',
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                                transition: 'transform 0.3s ease',
                                cursor: 'pointer',
                            }}
                            onMouseOver={(e) => (e.target.style.transform = 'scale(1.1)')}
                            onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
                        />
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2, color: '#333' }}>
                            {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>@{user.userName}</Typography>

                        {/* Followers & Following Section */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '15px', mt: 1 }}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography sx={{ fontWeight: 'bold', fontSize: '16px', color: '#0077B6' }}>
                                    {user.followers?.length || 0}
                                </Typography>
                                <Typography sx={{ fontSize: '14px', color: '#666' }}>Followers</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography sx={{ fontWeight: 'bold', fontSize: '16px', color: '#0077B6' }}>
                                    {user.following?.length || 0}
                                </Typography>
                                <Typography sx={{ fontSize: '14px', color: '#666' }}>Following</Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Menu Section */}
                    <Box sx={{ width: '100%', textAlign: 'center' }}>
                        <MenuItem
                            component="a"
                            href="/myprofile"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                color: '#0077B6',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                padding: '10px',
                                '&:hover': { backgroundColor: '#f5f5f5' },
                            }}
                        >
                            <Person /> Profile
                        </MenuItem>
                        <MenuItem
                            component="a"
                            href="/settings"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                color: '#0077B6',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                padding: '10px',
                                '&:hover': { backgroundColor: '#f5f5f5' },
                            }}
                        >
                            <Settings /> Settings
                        </MenuItem>
                        <MenuItem
                            onClick={handleSignOut}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                color: 'red',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                padding: '10px',
                                '&:hover': { backgroundColor: '#fce4e4' },
                            }}
                        >
                            <ExitToApp /> Logout
                        </MenuItem>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default SideUserPanel;
