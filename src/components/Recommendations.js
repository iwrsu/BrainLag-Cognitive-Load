import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as THREE from 'three';

// Glassmorphism card style
const glassStyle = {
  background: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  borderRadius: '18px',
  border: '1px solid rgba(255,255,255,0.2)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
  color: '#fff',
  p: 3,
  mb: 3,
  fontFamily: "'Georgia', serif",
  fontWeight: '500',
  letterSpacing: '0.02em',
};

const Recommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mountRef = useRef(null);

  const email = location.state?.email;

  const [tips, setTips] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [message, setMessage] = useState('');
  const [loadScore, setLoadScore] = useState(null);
  const [dateStr, setDateStr] = useState('');

  const formatDate = (d) => d.toISOString().split('T')[0];
  const today = formatDate(new Date());
  const yesterday = formatDate(new Date(Date.now() - 86400000));
  const tomorrow = formatDate(new Date(Date.now() + 86400000));

  // redirect if no email
  useEffect(() => {
    if (!email) navigate('/LoginPage');
  }, [email, navigate]);

  // ==================== Three.js Moving Stars ====================
  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a2a); // dark night

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.z = 60;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (mountRef.current) mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const stars = [];
    for (let i = 0; i < 1000; i++) {
      stars.push((Math.random() - 0.5) * 600); // x
      stars.push((Math.random() - 0.5) * 600); // y
      stars.push((Math.random() - 0.5) * 600); // z
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(stars, 3));

    const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7 });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const animate = () => {
      requestAnimationFrame(animate);
      points.rotation.y += 0.0005;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // ==================== Fetch Recommendations ====================
  const fetchTips = async (date) => {
    if (!email) return;

    try {
      const res = await axios.get('http://localhost:5000/api/auth/student-data', {
        params: { email, date },
      });

      if (!res.data?.data || res.data.data.length === 0) {
        setTips([]);
        setLoadScore(null);
        setDateStr('');
        setMessage('Data unavailable for selected date');
        return;
      }

      const latestRecord = res.data.data[0];
      const status = latestRecord.result?.status;
      const load = latestRecord.result?.load_score;
      const createdAt = latestRecord.created_at;

      setLoadScore(load ?? null);
      setDateStr(new Date(createdAt).toLocaleString());

      let t = [];
      if (status === 'low') {
        t = [
          'Maintain focus by taking short breaks every hour.',
          'Stay hydrated and stretch lightly every 2 hours.',
          'Plan your tasks for tomorrow to avoid stress.',
        ];
      } else if (status === 'medium') {
        t = [
          'Take a 10-minute walk.',
          'Practice deep breathing or meditation.',
          'Listen to relaxing music for 5–10 minutes.',
        ];
      } else if (status === 'high') {
        t = [
          'Take a 15-minute power nap.',
          'Practice guided deep breathing.',
          'Avoid heavy tasks, do something relaxing first.',
        ];
      } else {
        t = ['Keep monitoring your mental balance regularly.'];
      }

      setTips(t);
      setMessage('');
    } catch (err) {
      console.error(err);
      setTips([]);
      setLoadScore(null);
      setDateStr('');
      setMessage('Unable to fetch data');
    }
  };

  useEffect(() => {
    if (email) fetchTips(today);
  }, [email]);

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Stars background */}
      <Box ref={mountRef} sx={{ position: 'fixed', inset: 0, zIndex: 0 }} />

      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 1, p: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={3} color="#fff">
          Daily Recommendations
        </Typography>

        {/* Date Filters */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <Button variant="contained" onClick={() => fetchTips(today)}>
            Today
          </Button>
          <Button variant="contained" onClick={() => fetchTips(yesterday)}>
            Yesterday
          </Button>
          <Button variant="contained" onClick={() => fetchTips(tomorrow)}>
            Tomorrow
          </Button>
          <TextField
            type="date"
            size="small"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            sx={{ backgroundColor: '#fff', borderRadius: 1 }}
          />
          <Button
            variant="outlined"
            sx={{ color: '#fff', borderColor: '#fff' }}
            onClick={() => selectedDate && fetchTips(selectedDate)}
          >
            Apply
          </Button>
        </Box>

        {/* Message */}
        {message && <Typography color="error" mb={2}>{message}</Typography>}

        {/* Glass card */}
        {!message && loadScore !== null && (
          <Box sx={glassStyle}>
            <Typography variant="body1" mb={1}>
              <strong>Date:</strong> {dateStr}
            </Typography>
            <Typography variant="body1" mb={1}>
              <strong>Load Score:</strong> {loadScore}
            </Typography>

            <Typography variant="h6" mt={2} mb={1}>
              Proactive & Preventive Tips:
            </Typography>
            {tips.map((tip, index) => (
              <Typography key={index} sx={{ mb: 0.5 }}>
                • {tip}
              </Typography>
            ))}
          </Box>
        )}

        {!tips.length && !message && (
          <Typography color="#fff">No recommendations available</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Recommendations;
