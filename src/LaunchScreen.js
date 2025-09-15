
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography } from '@mui/material';
import './App.css'; // ensure the CSS is loaded

function LaunchScreen() {
  const navigate = useNavigate();
  return (
    <Container maxWidth="xs" sx={{
      textAlign: 'center',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <Typography variant="h5" gutterBottom>
        Start a Referral
      </Typography>
      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={() => navigate('/specialty')}
        sx={{ mb: 2 }}
      >
        Refer to a Specialty
      </Button>
      <Button
        variant="outlined"
        size="large"
        fullWidth
        onClick={() => navigate('/service')}
      >
        Refer to a Clinical Service
      </Button>
    </Container>
  );
}

export default LaunchScreen;
