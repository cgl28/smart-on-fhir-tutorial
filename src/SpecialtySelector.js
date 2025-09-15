import React from 'react';
import { Container, Typography, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const specialties = [
  'Gastroenterology',
  'Cardiology',
  'Respiratory',
  'Endocrinology',
  'Rheumatology',
  'Gynaecology',
  'Paediatrics'
];

export default function SpecialtySelector() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Select a Specialty
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {specialties.map(spec => (
          <Grid item xs={12} sm={6} key={spec}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={() => navigate(`/form/specialty/${spec}`)}
            >
              {spec}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

