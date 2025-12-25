import React, { useRef, useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import * as THREE from 'three';
import { useLocation, useNavigate } from 'react-router-dom';

const dashboardOptions = [
  { title: 'Mental Balance', description: 'Check your cognitive load and mental balance', color: '#7c5aff', link: '/MentalBalance' },
  { title: 'Track Daily Mindness', description: 'Record daily cognitive states', color: '#ff5c5c', link: '/TrackDaily' },
  { title: 'View Charts', description: 'Visualize your trends over time', color: '#82ce91ff', link: '/Charts' },
  { title: 'Recommendations', description: 'Get suggestions based on your score', color: '#516dcaff', link: '/Recommendations' },
];

const LoadDashboard = () => {
  const mountRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  // Get email
  useEffect(() => {
    const token = localStorage.getItem('token');
    const emailFromState = location.state?.email || localStorage.getItem('email');

    if (!token) {
      navigate('/LoginPage');
      return;
    }

    setEmail(emailFromState || '');
  }, [location.state, navigate]);

  // Three.js background
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a23);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const starCount = 1000;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = [];
    for (let i = 0; i < starCount; i++) {
      starPositions.push((Math.random() - 0.5) * 200);
      starPositions.push((Math.random() - 0.5) * 200);
      starPositions.push((Math.random() - 0.5) * 200);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    const animate = () => {
      requestAnimationFrame(animate);
      stars.rotation.y += 0.0005;
      stars.rotation.x += 0.0002;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/LoginPage');
  };

  return (
    <>
      {/* Three.js background */}
      <Box ref={mountRef} sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }} />

      {/* Side Panel */}
      <Box
        sx={{
          position: 'fixed',
          top: 40,
          right: 40,
          display: 'flex',
          flexDirection: 'column',
          gap: 15,
          backgroundColor: 'rgba(10,12,35,0.8)',
          borderRadius: 2,
          padding: 2,
          zIndex: 2,
          minWidth: 200,
          alignItems: 'flex-start',
        }}
      >
        <Typography variant="h6" sx={{ color: '#fff', wordBreak: 'break-word' }}>
          Welcome, {email}
        </Typography>
        <Button variant="contained" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {/* Boxes centered */}
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)', // perfect center
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 250px)',
          gridTemplateRows: 'repeat(2, 200px)',
          gap: 25,
          zIndex: 1,
        }}
      >
        {dashboardOptions.map((option, index) => (
          <Box
            key={index}
            sx={{
              backgroundColor: option.color,
              borderRadius: 3,
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              color: '#fff',
              boxShadow: '0 0 25px rgba(0,0,0,0.3)',
            }}
          >
            <Typography variant="h5">{option.title}</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {option.description}
            </Typography>
            <Button
              sx={{
                mt: 2,
                backgroundColor: '#fff',
                color: option.color,
                fontWeight: 'bold',
                '&:hover': { backgroundColor: '#eee' },
              }}
              onClick={() => {
  navigate(option.link, { state: { email } });
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
