import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar, Divider } from '@mui/material';
import { PersonAdd } from '@mui/icons-material';

const SideNotificationPanel = () => {
    const navigate = useNavigate();
    const userInfoString = localStorage.getItem('UserInfo');
    const storedUserInfo = JSON.parse(userInfoString);
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const response1 = await axios.get(`http://localhost:8080/api/users/getUserById/${storedUserInfo.id}`);

                try {
                    const response2 = await axios.post(`http://localhost:8080/api/users/getusersnamesnotify`, response1.data.followers);

                    // Store an array of objects with name, email, and ID
                    setNotifications(response2.data.reverse());

                } catch (error) {
                    console.error('Error fetching notifications:', error);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
            setIsLoading(false);
        };
        loadData();
    }, []);

    // Navigate to the selected user's profile
    const handleNotificationClick = (email, id) => {
        navigate(`/viewprofile/${email}/${id}`);
    };

    return (
        <Box
            sx={{
                width: '22%',
                height: '80vh',
                position: 'fixed',
                top: '12%',
                right: 0,
                margin: '1%',
                padding: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '12px',
                boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': { transform: 'scale(1.02)', boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.4)' }
            }}
        >
            <Typography variant="h5" sx={{ color: '#0077B6', textAlign: 'center', fontWeight: 'bold', mb: 2 }}>
                Notifications
            </Typography>

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                    <CircularProgress sx={{ color: '#0077B6' }} />
                </Box>
            ) : (
                <List>
                    {notifications.length > 0 ? (
                        notifications.map((user, index) => (
                            <React.Fragment key={index}>
                                <ListItem
                                    sx={{
                                        transition: 'background 0.3s ease',
                                        '&:hover': { backgroundColor: '#f5f5f5', cursor: 'pointer' }
                                    }}
                                    onClick={() => handleNotificationClick(user.email, user.id)}
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ backgroundColor: '#7B1FA2', color: 'white' }}>
                                            <PersonAdd />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={<Typography sx={{ fontWeight: 'bold' }}>{user.name}</Typography>}
                                        secondary={<Typography sx={{ color: '#666' }}>Started following you</Typography>}
                                    />
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))
                    ) : (
                        <Typography sx={{ textAlign: 'center', color: '#888', fontStyle: 'italic', mt: 3 }}>
                            No new notifications
                        </Typography>
                    )}
                </List>
            )}
        </Box>
    );
};

export default SideNotificationPanel;
