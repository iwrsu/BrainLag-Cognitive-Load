// src/components/HeroSection.js
import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import BrainCanvas from './BrainCanvas';
import { motion } from 'framer-motion';
import {Link} from "react-router-dom";
const HeroSection = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #04040A, #0D0D1A)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Container sx={{ textAlign: 'center', mb: 5 }}>
        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2, color: '#A390FF' }}>
            MindGauge
          </Typography>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}>
          <Typography variant="h6" sx={{ mb: 4, fontWeight: 400, color: '#C0C0FF' }}>
            Predict mental overload & prevent burnout before it happens.
          </Typography>
          <Link to="/RegistrationPage">
          <Button
            variant="contained"
            color="secondary"
            sx={{ fontWeight: 'bold', px: 5, py: 1.5, fontSize: '1rem', borderRadius: 3, backgroundColor: '#6A0DAD', '&:hover': { backgroundColor: '#7F1FE0' } }}
          >
            Get Started
          </Button>
          </Link>
          
        </motion.div>
      </Container>

      <Box sx={{ width: '100%', height: '400px' }}>
        <BrainCanvas />
      </Box>
    </Box>
  );
};

export default HeroSection;
