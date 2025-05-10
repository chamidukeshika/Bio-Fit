import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../assets/status.png'
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Box,
  Chip
} from '@mui/material';
import {
  DirectionsRun,
  FitnessCenter,
  AccessTime
} from '@mui/icons-material';

const AllStatusSingleCard = () => {
  const [data, setData] = useState([]);
  const [userMap, setUserMap] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch status data
        const statusResponse = await axios.get('http://localhost:8080/api/user/StatusTest');
        const sortedData = [...statusResponse.data].sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setData(sortedData);
        // Extract unique emails from status data
        const emails = [...new Set(statusResponse.data.map(item => item.user))];

        // Fetch user details for all unique emails
        const usersPromises = emails.map(email =>
          axios.get(`http://localhost:8080/api/users/getUserByEmail/${email}`)
            .then(response => response.data)
            .catch(error => {
              console.error(`Error fetching user ${email}:`, error);
              return null;
            })


        );


        const usersData = await Promise.all(usersPromises);
        console.log(usersData);
        // Create a mapping of email to user's display name
        const newUserMap = {};
        usersData.forEach(user => {
          if (user) {
            // Use firstName if available, otherwise fallback to username
            newUserMap[user.email] = user.firstName || user.userName;
          }
        });

        setUserMap(newUserMap);



      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const formatDate = (createdAt) => {
    return new Date(createdAt).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {data.length === 0 ? (
       
        <Box
  sx={(theme) => ({
    height: '70vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    background: 'rgba(255, 255, 255,0.8)',
    borderRadius: 4,
    mx: 2,
    p: 4,
    animation: 'fadeIn 1.2s ease-in-out',
    backdropFilter: 'blur(10px)',
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
    '@keyframes spin': {
      '0%': {
        transform: 'rotate(0deg)',
      },
      '100%': {
        transform: 'rotate(360deg)',
      },
    },
  })}
>
  {/* Spinner */}
  <Box
    sx={{
      width: 60,
      height: 60,
      border: '6px solid #4FC3F7',
      borderTop: '6px solid transparent',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      mb: 3,
    }}
  />        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            mb: 1,
            color: '#0288d1',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)'
          }}
        >
          No Status Yet!
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#01579b',
            maxWidth: 400,
            fontSize: '1rem',
            opacity: 0.8,
          }}
        >
          Stay tuned! 🚀 New updates and activities will show up here soon.
        </Typography>
      </Box>
      
      ) : (
        <Grid container spacing={3}>
          {data.map((item) => (
            <Grid item xs={12} md={6} key={item.id}>
              <Card sx={{
                borderRadius: 4,
                boxShadow: 3,
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 6px 10px rgba(0, 0, 0, 0.43)'
                }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={logo}
                      sx={{
                        width: 60,
                        height: 60,
                        mr: 3,
                        fontSize: '1.5rem'
                      }}
                    >
                      {(userMap[item.user] || item.user)[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {userMap[item.user] || item.user}
                      </Typography>
                     
                    </Box>
                  </Box>

                  <Box sx={{ pl: 2, borderLeft: '3px solid', borderColor: 'primary.main' }}>
                    <Typography variant="body1" paragraph>
                      {item.description}
                    </Typography>

                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={6}>
                        <Chip
                          icon={<DirectionsRun />}
                          label={`${item.distanceRan} KM`}
                          sx={{ mb: 1, width: '100%' }}
                          color="primary"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Chip
                          icon={<FitnessCenter />}
                          label={`${item.benchPress} KG`}
                          sx={{ mb: 1, width: '100%' }}
                          color="secondary"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <Box component="span" fontWeight="bold">Push-ups:</Box> {item.pushups}
                        </Typography>
                      </Grid>
                    </Grid>

                    {item.comments && (
                      <Box sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'grey.100'
                      }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Work to be done:
                        </Typography>
                        <Typography variant="body2">
                          {item.comments}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}

  export default AllStatusSingleCard;