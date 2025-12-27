import React, { useRef, useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import * as THREE from 'three';
import { useLocation, useNavigate } from 'react-router-dom';

const dashboardOptions = [
  {
    title: 'Mental Balance',
    description: 'Check your cognitive load and emotional stability',
    color: '#7c5aff',
    link: '/MentalBalance',
    image: 'https://cdn-icons-png.flaticon.com/512/4320/4320337.png',
  },
  {
    title: 'Track Daily Mindfulness',
    description: 'Record your daily mental and cognitive states',
    color: '#ff5c5c',
    link: '/TrackDaily',
    image: 'https://cdn-icons-png.flaticon.com/512/2920/2920277.png',
  },
  {
    title: 'View Insights',
    description: 'Visualize trends and mental patterns over time',
    color: '#82ce91',
    link: '/Charts',
    image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  },
  {
    title: 'Smart Recommendations',
    description: 'Personalized suggestions to protect mental energy',
    color: '#516dca',
    link: '/Recommendations',
    image: 'https://cdn-icons-png.flaticon.com/512/942/942748.png',
  },
];

const LoadDashboard = () => {
  const mountRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  // ✅ Auth check + email
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/LoginPage');
      return;
    }

    // Email from login state OR fallback to localStorage
    setEmail(location.state?.email || localStorage.getItem('email') || '');
  }, [location.state, navigate]);

  // ✅ Three.js star background
  useEffect(() => {
    if (!mountRef.current) return;

    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a23);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    // Stars
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    for (let i = 0; i < 1200; i++) {
      starVertices.push((Math.random() - 0.5) * 300);
      starVertices.push((Math.random() - 0.5) * 300);
      starVertices.push((Math.random() - 0.5) * 300);
    }
    starGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(starVertices, 3)
    );

    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.6 });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      stars.rotation.y += 0.0004;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      starGeometry.dispose();
      starMaterial.dispose();
      renderer.dispose();
      if (mount && renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/LoginPage');
  };

  return (
    <>
      {/* Star background */}
      <Box ref={mountRef} sx={{ position: 'fixed', inset: 0, zIndex: 0 }} />

      {/* Logout */}
      <Button
        variant="contained"
        color="error"
        onClick={handleLogout}
        sx={{
          position: 'fixed',
          top: 25,
          right: 25,
          zIndex: 3,
          borderRadius: 5,
          px: 3,
        }}
      >
        Logout
      </Button>

      {/* Center heading */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          mt: 10,
          color: '#fff',
        }}
      >
        <Typography variant="h3" fontWeight="bold">
          Hello, {email}
        </Typography>
        <Typography variant="h5" sx={{ mt: 1 }}>
          Welcome to your Mental Capacity Monitor
        </Typography>
        <Typography
          variant="body1"
          sx={{ mt: 2, maxWidth: 650, mx: 'auto', opacity: 0.9 }}
        >
          Instead of predicting marks, let’s predict and protect your mental energy.
        </Typography>
      </Box>

      {/* Dashboard cards */}
      <Box
        sx={{
          mt: 8,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 5,
          px: 6,
          zIndex: 2,
          position: 'relative',
        }}
      >
        {dashboardOptions.map((option, index) => (
          <Box
            key={index}
            sx={{
              backgroundColor: option.color,
              borderRadius: 6,
              p: 4,
              textAlign: 'center',
              color: '#fff',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              transition: 'transform 0.3s',
              cursor: 'pointer',
              '&:hover': { transform: 'translateY(-8px)' },
            }}
            onClick={() => navigate(option.link, { state: { email } })}
          >
            <img
              src={option.image}
              alt={option.title}
              style={{ width: 70, marginBottom: 20 }}
            />
            <Typography variant="h5" fontWeight="bold">
              {option.title}
            </Typography>
            <Typography sx={{ mt: 1, opacity: 0.95 }}>{option.description}</Typography>
            <Button
              sx={{
                mt: 3,
                backgroundColor: '#fff',
                color: option.color,
                fontWeight: 'bold',
                borderRadius: 5,
                px: 4,
                '&:hover': { backgroundColor: '#f2f2f2' },
              }}
            >
              Access
            </Button>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default LoadDashboard;
