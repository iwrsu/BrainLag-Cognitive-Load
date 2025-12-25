// src/components/LoginPage.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import MindGaugeCanvas from './MindGaugeCanvas';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {Link as RouterLink} from 'react-router-dom';
const inputStyle = {
  input: { color: '#FFFFFF' },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: '#555' },
    '&:hover fieldset': { borderColor: '#A390FF' },
    '&.Mui-focused fieldset': { borderColor: '#A390FF' },
  },
  '& input::placeholder': {
    color: '#B0B0FF',
    opacity: 1,
  },
};

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [popup, setPopup] = useState({
    open: false,
    message: '',
    severity: 'error',
  });

  // ✅ Auto-login on page load if token exists
  useEffect(() => {
  const checkLoggedIn = async () => {
    const token = localStorage.getItem('token');
    if (!token) return; // no token → stay on login page

    try {
      // Verify token with backend and get email
      const res = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { email } = res.data;
      
      // Redirect to dashboard with email (pass via state or context)
      navigate('/Loaddashboard', { state: { email } });

    } catch {
      // Token invalid/expired → remove token
      localStorage.removeItem('token');
    }
  };

  checkLoggedIn();
}, [navigate]);


  // ✅ Login button handler
  const handleLogin = async () => {
    if (!email || !password) {
      setPopup({
        open: true,
        message: 'Please enter email and password',
        severity: 'error',
      });
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);

      setSuccess(true);
      setPopup({
        open: true,
        message: 'Login successful!',
        severity: 'success',
      });

      // Delay before redirecting to dashboard
      setTimeout(() => {
        navigate('/Loaddashboard');
      }, 1500);
    } catch (err) {
      setPopup({
        open: true,
        message: err.response?.data?.message || 'Login failed. Try again.',
        severity: 'error',
      });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', backgroundColor: '#0A0A23' }}>
      {/* Background */}
      <Box sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <MindGaugeCanvas />
      </Box>

      <Box
        sx={{
          position: 'relative',
          zIndex: 10,
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <AnimatePresence>
          {!success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={{ duration: 0.8 }}
            >
              <Paper
                elevation={10}
                sx={{
                  p: 6,
                  borderRadius: 4,
                  width: 380,
                  backgroundColor: 'rgba(28, 28, 51, 0.9)',
                  backdropFilter: 'blur(10px)',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h4" sx={{ mb: 3, color: '#A390FF', fontWeight: 700 }}>
                  MindGauge Login 🧠
                </Typography>

                <Typography sx={{ color: '#C0C0FF', mb: 4 }}>
                  Access your cognitive dashboard.
                </Typography>

                {/* Email */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <EmailIcon sx={{ mr: 1, color: '#C0C0FF' }} />
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={inputStyle}
                  />
                </Box>

                {/* Password */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <LockIcon sx={{ mr: 1, color: '#C0C0FF' }} />
                  <TextField
                    fullWidth
                    size="small"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={inputStyle}
                  />
                </Box>

                <Button
                  fullWidth
                  sx={{
                    backgroundColor: '#6A0DAD',
                    py: 1.5,
                    fontWeight: 700,
                    '&:hover': { backgroundColor: '#7F1FE0' },
                    mb: 2,
                  }}
                  onClick={handleLogin}
                >
                  Login
                </Button>

                <Typography variant="body2">
                  <Link href="#" sx={{ color: 'white', textDecoration: 'none' }}>
                    Forgot password?
                  </Link>{' '}
                  |{' '}
                 <RouterLink to="/RegistrationPage">
                 <Link href="/register" sx={{ color: 'white', textDecoration: 'none' }}>
                    Sign Up
                  </Link>
                 </RouterLink> 
                </Typography>
              </Paper>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.9 }}
            >
              <Paper
                sx={{
                  p: 6,
                  borderRadius: 4,
                  width: 380,
                  backgroundColor: 'rgba(28,28,51,0.92)',
                  textAlign: 'center',
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 80, color: '#4CAF50', mb: 2 }} />
                <Typography variant="h4" sx={{ color: '#E0FFE8', fontWeight: 700 }}>
                  Welcome Back!
                </Typography>
                <Typography sx={{ color: '#C0FFE0', mt: 2 }}>
                  Redirecting to dashboard...
                </Typography>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* Snackbar for error/success */}
      <Snackbar
        open={popup.open}
        autoHideDuration={3000}
        onClose={() => setPopup({ ...popup, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={popup.severity} sx={{ width: '100%' }}>
          {popup.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;
