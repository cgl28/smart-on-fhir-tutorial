import React from 'react';
import { Container, Typography, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const services = [
  'Echocardiogram',
  'OGD',
  'ERCP',
  'Holter Monitor'
];

export default function ServiceSelector() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Select a Clinical Service
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {services.map(svc => (
          <Grid item xs={12} sm={6} key={svc}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={() => navigate(`/form/service/${svc}`)}
            >
              {svc}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

