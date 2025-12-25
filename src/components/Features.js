// src/components/Features.js
import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const features = [
  { emoji: '🧠', title: "Load", description: "Real-time cognitive load monitoring (0-100)." },
  { emoji: '🔥', title: "Burnout", description: "Get early alerts before stress spikes." },
  { emoji: '💡', title: "Tips", description: "Receive actionable, adaptive study recommendations." },
  { emoji: '⏱️', title: "Track", description: "Monitor your sessions, breaks, and focus patterns." },
];

const Features = () => {
  return (
    <Box sx={{ p: 8, backgroundColor: '#0B0B1F', color: '#fff' }}>
      <Typography variant="h4" sx={{ mb: 6, textAlign: 'center', fontWeight: 700 }}>
        Features
      </Typography>
      <Grid container spacing={5} justifyContent="center">
        {features.map((f, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <Paper
                sx={{
                  p: 4,
                  minHeight: 200,
                  borderRadius: 3,
                  backgroundColor: '#1C1C33',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.7)',
                  textAlign: 'center',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 12px 35px rgba(0,0,0,0.9)',
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h3" sx={{ mb: 1, color: '#A390FF' }}>
                  {f.emoji}
                </Typography>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, color: '#E0E0FF' }}>
                  {f.title}
                </Typography>
                <Typography sx={{ fontSize: '0.95rem', lineHeight: 1.5, color: '#C0C0FF' }}>
                  {f.description}
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Features;
