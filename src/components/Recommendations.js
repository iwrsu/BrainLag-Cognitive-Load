import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Button, TextField, Avatar } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as THREE from 'three';

const glassStyle = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.1))',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  borderRadius: '20px',
  border: '1px solid rgba(255,255,255,0.2)',
  boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
  color: '#fff',
  p: 3,
  mb: 3,
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 60px rgba(0,0,0,0.7)',
  },
};

// Mapping tip keywords to images
const tipImages = {
  water: '/images/water.png',
  walk: '/images/walk.png',
  nap: '/images/nap.png',
  meditation: '/images/meditation.png',
  relax: '/images/relax.png',
  calendar: '/images/calendar.png',
  focus: '/images/focus.png',
  music: '/images/music.png',
  eye: '/images/eye.png',
  default: '/images/tip.png',
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

  // ==================== Three.js Star Background ====================
  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a2a);

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
    for (let i = 0; i < 1200; i++) {
      stars.push((Math.random() - 0.5) * 600);
      stars.push((Math.random() - 0.5) * 600);
      stars.push((Math.random() - 0.5) * 600);
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
          { text: 'Maintain focus by taking short breaks every hour.', keyword: 'focus' },
          { text: 'Stay hydrated and stretch lightly every 2 hours.', keyword: 'water' },
          { text: 'Plan your tasks for tomorrow to avoid stress.', keyword: 'calendar' },
        ];
      } else if (status === 'medium') {
        t = [
          { text: 'Take a 10-minute walk.', keyword: 'walk' },
          { text: 'Practice deep breathing or meditation.', keyword: 'meditation' },
          { text: 'Listen to relaxing music for 5–10 minutes.', keyword: 'music' },
        ];
      } else if (status === 'high') {
        t = [
          { text: 'Take a 15-minute power nap.', keyword: 'nap' },
          { text: 'Practice guided deep breathing.', keyword: 'meditation' },
          { text: 'Avoid heavy tasks, do something relaxing first.', keyword: 'relax' },
        ];
      } else {
        t = [{ text: 'Keep monitoring your mental balance regularly.', keyword: 'eye' }];
      }

      // Add image property
      const tipsWithImages = t.map(tip => ({
        ...tip,
        image: tipImages[tip.keyword] || tipImages.default
      }));

      setTips(tipsWithImages);
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
    if (email) fetchTips(today); // show today by default
  }, [email]);

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', p: 4 }}>
      {/* Stars background */}
      <Box ref={mountRef} sx={{ position: 'fixed', inset: 0, zIndex: 0 }} />

      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: '900px', mx: 'auto' }}>
        <Typography variant="h3" fontWeight="bold" mb={3} color="#fff" textAlign="center">
          🌟 Daily Recommendations
        </Typography>

        {/* Date Filters */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mb: 4 }}>
          <Button variant="contained" color="primary" onClick={() => fetchTips(today)}>Today</Button>
          <Button variant="contained" color="secondary" onClick={() => fetchTips(yesterday)}>Yesterday</Button>
          <Button variant="contained" color="success" onClick={() => fetchTips(tomorrow)}>Tomorrow</Button>
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
        {message && <Typography color="error" mb={2} textAlign="center">{message}</Typography>}

        {/* Glass card */}
        {!message && loadScore !== null && (
          <Box sx={{ ...glassStyle }}>
            <Typography variant="body1" mb={1}><strong>Date:</strong> {dateStr}</Typography>
            <Typography variant="body1" mb={2}><strong>Load Score:</strong> 
              <span style={{
                color:
                  loadScore < 40 ? '#4ade80' :
                  loadScore < 70 ? '#facc15' :
                  '#f87171',
                fontWeight: 'bold',
                marginLeft: '6px'
              }}>
                {loadScore}
              </span>
            </Typography>

            <Typography variant="h6" mb={2}>💡 Tips to Improve Mental Balance:</Typography>
            {tips.map((tip, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                <Avatar src={tip.image} sx={{ width: 32, height: 32 }} />
                <Typography>{tip.text}</Typography>
              </Box>
            ))}
          </Box>
        )}

        {!tips.length && !message && (
          <Typography color="#fff" textAlign="center">No recommendations available</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Recommendations;
