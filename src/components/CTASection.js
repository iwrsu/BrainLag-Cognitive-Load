// src/components/CTASection.js
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import {Link} from "react-router-dom";
const CTASection = () => {
  return (
    <Box
      sx={{
        p: 10,
        backgroundColor: '#0B0B1F', // match dark theme
        color: '#fff',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 3,
            fontWeight: 700,
            letterSpacing: 1,
            lineHeight: 1.4,
            color: '#A390FF',
          }}
        >
          Take Control of Your MindGauge 🚀
        </Typography>
        <Typography
          sx={{
            mb: 5,
            color: '#C0C0FF',
            fontSize: '1.05rem',
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          Monitor your cognitive load, avoid burnout, and optimize your study sessions with our smart AI-driven platform.
        </Typography>
        <Link to="/RegistrationPage" >
        
        
         <Button
          variant="contained"
          color="secondary"
          sx={{
            px: 6,
            py: 2,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            borderRadius: 3,
            backgroundColor: '#6A0DAD', // accent color
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            '&:hover': {
              backgroundColor: '#7F1FE0',
              transform: 'translateY(-5px)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.7)',
            },
          }}
        >
          Get Started
        </Button>
        </Link>
       
      </motion.div>
    </Box>
  );
};

export default CTASection;
