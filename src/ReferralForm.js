import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from '@mui/material';

export default function ReferralForm() {
  const { type, target } = useParams();
  const [formData, setFormData] = useState({
    reason: '',
    urgency: 'routine',
    department: target,
    notes: ''
  });

  useEffect(() => {
    setFormData(fd => ({ ...fd, department: target }));
  }, [target]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log('Submit payload for', type, target, formData);
    // TODO: send FHIR ServiceRequest
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Refer to {type === 'specialty' ? 'Specialty' : 'Service'}: {target}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Reason for Referral"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Urgency</InputLabel>
              <Select
                name="urgency"
                value={formData.urgency}
                label="Urgency"
                onChange={handleChange}
              >
                <MenuItem value="routine">Routine</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
                <MenuItem value="stat">Immediate</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={type === 'specialty' ? 'Specialty' : 'Service'}
              name="department"
              value={formData.department}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Additional Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              size="large"
            >
              Submit Referral
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
