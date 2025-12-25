import React, { useState ,useEffect} from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import RegistrationGauge from './RegistrationGauge';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";


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

// Password strength colors
const getPasswordStrength = (password) => {
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  const mediumRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (strongRegex.test(password)) return { label: 'Strong', color: 'green' };
  if (mediumRegex.test(password)) return { label: 'Medium', color: 'orange' };
  return { label: 'Weak', color: 'red' };
};

const RegistrationPage = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ label: '', color: '' });

  // Validation regex
  const usernameRegex = /^(?=.*[\W_]).{8,}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (e.target.name === 'password') {
      setPasswordStrength(getPasswordStrength(e.target.value));
    }
  };
 const navigate = useNavigate();
  const handleSubmit = async () => {
    setError('');

    const { username, email, password } = form;

    // Empty check
    if (!username || !email || !password) {
      setError('Please fill out all details');
      return;
    }

    // Validations
    if (!usernameRegex.test(username)) {
      setError('Username must be at least 8 chars with 1 special char');
      return;
    }

    if (!emailRegex.test(email)) {
      setError('Invalid email format');
      return;
    }

    if (!passwordRegex.test(password)) {
      setError('Password must be min 8 chars with uppercase, lowercase, number, special char');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password,
      });

      if (res.status === 201) setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };
useEffect(() => {
  if (success) {
    const timer = setTimeout(() => {
      navigate('/LoginPage');
    }, 1500);

    return () => clearTimeout(timer); // cleanup
  }
}, [success, navigate]);

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', backgroundColor: '#0A0A23' }}>
      <Box sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <RegistrationGauge />
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
              key="form"
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8 }}
            >
              <Paper
                sx={{
                  p: 6,
                  borderRadius: 4,
                  width: 380,
                  backgroundColor: 'rgba(28,28,51,0.88)',
                  backdropFilter: 'blur(12px)',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h4" sx={{ color: '#A390FF', mb: 2, fontWeight: 700 }}>
                  Registration Gauge 🚀
                </Typography>

                <Typography sx={{ color: '#C0C0FF', mb: 4 }}>
                  Join MindGauge and track your cognitive power.
                </Typography>

                {error && (
                  <Typography sx={{ color: 'red', mb: 2 }}>{error}</Typography>
                )}

                {/* Username */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <PersonIcon sx={{ mr: 1, color: '#C0C0FF' }} />
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    sx={inputStyle}
                  />
                </Box>

                {/* Email */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <EmailIcon sx={{ mr: 1, color: '#C0C0FF' }} />
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    sx={inputStyle}
                  />
                </Box>

                {/* Password */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LockIcon sx={{ mr: 1, color: '#C0C0FF' }} />
                  <TextField
                    fullWidth
                    size="small"
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    sx={inputStyle}
                  />
                </Box>

                {form.password && (
                  <Typography sx={{ color: passwordStrength.color, mb: 2, fontWeight: 700 }}>
                    {passwordStrength.label} Password
                  </Typography>
                )}

                <Button
                  fullWidth
                  sx={{
                    backgroundColor: '#6A0DAD',
                    py: 1.6,
                    fontWeight: 700,
                    '&:hover': { backgroundColor: '#7F1FE0' },
                  }}
                  onClick={handleSubmit}
                >
                  Register
                </Button>

                <Typography sx={{ mt: 2 ,color:'white'}}>
                  Already registered?{' '}
                  <RouterLink to="/LoginPage">
                  <Link href="#" sx={{ color: '#A390FF' }}>
                    Login
                  </Link>
                  </RouterLink>
                  
                </Typography>
              </Paper>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            >
              <Paper
                sx={{
                  p: 6,
                  borderRadius: 4,
                  width: 380,
                  backgroundColor: 'rgba(28,28,51,0.9)',
                  textAlign: 'center',
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 80, color: '#4CAF50', mb: 2 }} />
                <Typography variant="h4" sx={{ color: '#E0FFE8', fontWeight: 700 }}>
                  Registered!
                </Typography>
                <Typography sx={{ color: '#C0FFE0', mt: 2 }}>
                  Your journey with MindGauge begins now.<Typography sx={{ color: '#C0FFE0', mt: 2 }}>
  Redirecting to LoginPage...
</Typography>

                </Typography>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default RegistrationPage;
