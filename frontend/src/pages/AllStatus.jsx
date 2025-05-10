import React from 'react';
import { Box, Grid, Container } from '@mui/material';
import NavBar from '../components/NavBar';
import SideUserPanel from '../components/SideUserPanel';
import SideNotoficationPanel from '../components/SideNotoficationPanel';
import AllStatusSingleCard from '../components/AllStatusSingleCard';

const AllStatus = () => {
  return (
    <Box sx={{
       background: 'rgba(111, 204, 250, 0.6)',
      minHeight: '100vh'
    }}>
      <NavBar />
      
      <Grid container sx={{ pt: 8 }}>
        <Grid item xs={3}>
          <SideUserPanel />
        </Grid>
        
        <Grid item xs={6}>
          <Container maxWidth="lg" sx={{ py: 3 }} >
            <AllStatusSingleCard />
          </Container>
        </Grid>
        
        <Grid item xs={3}>
          <SideNotoficationPanel />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AllStatus;