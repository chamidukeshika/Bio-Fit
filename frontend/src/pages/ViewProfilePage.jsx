import React from 'react'
import NavBar from '../components/NavBar'
import { Container, Button } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import { Box, CircularProgress } from '@mui/material'; import {
    FiUser,
    FiBarChart2,
    FiActivity,
    FiUsers,
    FiUserPlus,
    FiUserCheck
} from 'react-icons/fi';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AllMealPlanPage from './AllMealPlanPage'
import AllUserWorkoutPlans from '../components/AllUserWorkoutPlans'
import { useParams } from 'react-router-dom'

const ViewProfilePage = () => {
    const userInfoString = localStorage.getItem('UserInfo');
    const storedUserInfo = JSON.parse(userInfoString);
    const [userData, setUserData] = useState('');
    const [value, setValue] = useState(0);
    const emailParam = useParams();
    const [followed, setFollowed] = useState('');
    const [isLoading, setIsLoading] = useState(false);



    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/users/getUserByEmail/${emailParam.id}`); // Make request to backend API endpoint
            setUserData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const followAUSer = async (followedUser) => {
        const loginDto = {
            user1: followedUser,
            user2: storedUserInfo.id
        }
        console.log(loginDto);
        try {
            const response = await axios.post(`http://localhost:8080/api/users/follow`, loginDto); // Make request to backend API endpoint
            setFollowed(response.data)// Update state with retrieved data

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const unfollowAUSer = async (followedUser) => {
        const loginDto = {
            user1: followedUser,
            user2: storedUserInfo.id
        }
        console.log(loginDto);
        try {
            const response = await axios.post(`http://localhost:8080/api/users/unfollow`, loginDto); // Make request to backend API endpoint
            setFollowed(response.data)

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    useEffect(() => {
        fetchData();
    }, [followed])

    const pageStyle = {
        background: 'rgba(111, 204, 250, 0.6)',
        minHeight: '100vh',
        padding: '2rem'
    }

    return (
        <div style={pageStyle}>
            <NavBar />
            
            <Container style={{
                maxWidth: '1200px',
                padding: '0 1rem',
                marginTop: '6rem'
            }}>
                {/* Profile Card */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '1.5rem',
                    boxShadow: '0 12px 24px rgba(0, 82, 255, 0.08)',
                    overflow: 'hidden',
                    marginBottom: '2rem',
                    padding: '2rem'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '2rem',
                        flexWrap: 'wrap'
                    }}>
                        {/* Left Section - Profile Picture & Name */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                border: '4px solid rgba(255,255,255,0.2)',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                                overflow: 'hidden',
                                flexShrink: 0
                            }}>
                                <img
                                    src={userData.profilePicURL}
                                    alt="Profile"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>

                            <div>
                                <h1 style={{
                                    fontSize: '1.75rem',
                                    margin: '0 0 0.25rem',
                                    fontWeight: '700',
                                    color: '#1F2937'
                                }}>
                                    {userData.firstName} {userData.lastName}
                                </h1>
                                <p style={{
                                    fontSize: '1rem',
                                    margin: 0,
                                    color: '#6B7280',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <FiUser style={{ opacity: 0.8 }} />
                                    @{userData.userName}
                                </p>
                            </div>
                        </div>

                        {/* Stats Section */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            {/* Weight */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    backgroundColor: 'rgba(79, 172, 254, 0.1)',
                                    padding: '0.75rem',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <FiActivity style={{ color: '#4FACFE', fontSize: '1.25rem' }} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1F2937' }}>
                                        {userData.weight}kg
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>Weight</div>
                                </div>
                            </div>

                            {/* Height */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    backgroundColor: 'rgba(79, 172, 254, 0.1)',
                                    padding: '0.75rem',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <FiBarChart2 style={{ color: '#4FACFE', fontSize: '1.25rem' }} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1F2937' }}>
                                        {userData.height}m
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>Height</div>
                                </div>
                            </div>

                            {/* Followers/Following */}
                            <div style={{ display: 'flex', gap: '1.5rem', marginLeft: '1rem' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <FiUsers style={{ color: '#4FACFE' }} />
                                        <span style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1F2937' }}>
                                            {userData.followers?.length || 0}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>Followers</div>
                                </div>

                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <FiUserPlus style={{ color: '#4FACFE' }} />
                                        <span style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1F2937' }}>
                                            {userData.following?.length || 0}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>Following</div>
                                </div>
                            </div>
                        </div>

                        {/* Follow Button */}
                        <div>
                            {userData.followers?.includes(storedUserInfo.id) ? (
                                <Button
                                    onClick={() => unfollowAUSer(userData.id)}
                                    style={{
                                        background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8787 100%)',
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '2rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        boxShadow: '0 4px 12px rgba(255,107,107,0.3)',
                                        border: 'none',
                                        color: 'white',
                                        fontWeight: '600',
                                        transition: 'transform 0.2s',
                                        ':hover': { transform: 'translateY(-2px)' }
                                    }}
                                >
                                    <FiUserCheck /> Following
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => followAUSer(userData.id)}
                                    style={{
                                        background: 'linear-gradient(135deg,rgb(24, 144, 250) 0%,rgb(0, 174, 254) 100%)',
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '2rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        boxShadow: '0 4px 12px rgba(79,172,254,0.3)',
                                        border: 'none',
                                        color: 'white',
                                        fontWeight: '600',
                                        transition: 'transform 0.2s',
                                        ':hover': { transform: 'translateY(-2px)' }
                                    }}
                                >
                                    <FiUserPlus /> Follow
                                </Button>
                            )}
                        </div>
                    </div>
                </div>


                {/* Content Tabs */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '1.5rem',
                    boxShadow: '0 12px 24px rgba(0, 82, 255, 0.08)',
                    overflow: 'hidden'
                }}>
                    <TabContext value={value}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            variant="fullWidth"
                            sx={{
                                '& .MuiTabs-indicator': {
                                    height: '4px',
                                    backgroundColor: '#4FACFE'
                                },
                                '& .MuiTab-root': {
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    color: '#6B7280',
                                    padding: '1.5rem',
                                    '&.Mui-selected': {
                                        color: '#2C6DB4'
                                    }
                                }
                            }}
                        >
                            <Tab
                                label="Workout Plans"
                                icon={<FitnessCenterIcon style={{ fontSize: '1.5rem' }} />}
                                iconPosition="start"
                                value={0}
                            />
                            <Tab
                                label="Meal Plans"
                                icon={<RestaurantIcon style={{ fontSize: '1.5rem' }} />}
                                iconPosition="start"
                                value={1}
                            />
                        </Tabs>

                        <TabPanel value={0} style={{ padding: '2rem' }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                gap: '1.5rem',
                                padding: '1rem 0'
                            }}>
                                <AllUserWorkoutPlans userId={emailParam.id2} />
                            </div>
                        </TabPanel>

                        <TabPanel value={1} style={{ padding: '2rem' }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                gap: '1.5rem',
                                padding: '1rem 0'
                            }}>
                                <AllMealPlanPage userId={emailParam.id2} />
                            </div>
                        </TabPanel>
                    </TabContext>
                </div>
            </Container>
        </div>
    )
}

export default ViewProfilePage