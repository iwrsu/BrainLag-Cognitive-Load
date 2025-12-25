// src/components/HowItWorks.js
import React from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const steps = [
  { emoji: '📝', title: "Log", desc: "Quickly record your study sessions or let the system auto-track your activity for convenience." },
  { emoji: '📊', title: "Analyze", desc: "AI continuously monitors your study patterns, break frequency, and task switching to detect cognitive load." },
  { emoji: '💡', title: "Act", desc: "Receive smart, actionable recommendations to prevent burnout and improve productivity." },
];

const HowItWorks = () => {
  return (
    <Box sx={{ p: 8, backgroundColor: '#0A0A23', color: '#fff' }}>
      <Typography variant="h4" sx={{ mb: 6, textAlign: 'center', fontWeight: 700, letterSpacing: 1 }}>
        How It Works
      </Typography>
      <Grid container spacing={5} justifyContent="center">
        {steps.map((s, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.3 }}
            >
              <Paper
                sx={{
                  p: 4,
                  minHeight: 220,
                  borderRadius: 3,
                  backgroundColor: '#1B1B35',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
                  textAlign: 'center',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.8)',
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h3" sx={{ mb: 2 }}>
                  {s.emoji}
                </Typography>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#E0E0FF' }}>
                  {s.title}
                </Typography>
                <Typography sx={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#C0C0FF' }}>
                  {s.desc}
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HowItWorks;
