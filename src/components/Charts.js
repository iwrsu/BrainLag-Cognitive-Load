import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box, Typography, Button, TextField, Skeleton
} from '@mui/material';
import axios from 'axios';
import * as THREE from 'three';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, ResponsiveContainer
} from 'recharts';
import { toPng } from 'html-to-image';
import download from 'downloadjs';


const glassStyle = {
  background: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  borderRadius: '18px',
  border: '1px solid rgba(255,255,255,0.2)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
};

const GraphDashboard = () => {
  const location = useLocation();
  const email = location.state?.email || localStorage.getItem('email');
  const mountRef = useRef(null);
  const chartRef = useRef(null);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('last7');
  const [selectedDate, setSelectedDate] = useState('');
  const [graphType, setGraphType] = useState('line');
  const [message, setMessage] = useState('');

  // 🌌 Moving stars background
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050515);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.z = 60;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const stars = [];
    for (let i = 0; i < 1200; i++) {
      stars.push((Math.random() - 0.5) * 600);
      stars.push((Math.random() - 0.5) * 600);
      stars.push((Math.random() - 0.5) * 600);
    }
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(stars, 3)
    );

    const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7 });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const animate = () => {
      requestAnimationFrame(animate);
      points.rotation.y += 0.0004;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // 📡 Fetch data
  const fetchData = async (filterDate) => {
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.get('http://localhost:5000/api/auth/student-data', {
        params: { email, limit: 7, date: filterDate }
      });

      if (res.data.data.length === 0) {
        setMessage('Data unavailable');
      }

      const chartData = res.data.data
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        .map(d => ({
          date: new Date(d.created_at).toLocaleDateString(),
          load_score: d.result.load_score,
          status: d.result.status
        }));

      setData(chartData);
    } catch (err) {
      console.error(err);
      setMessage('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData('');
  }, []);

  // 📅 Date helpers
  const formatDate = (d) => d.toISOString().split('T')[0];
  const today = formatDate(new Date());
  const yesterday = formatDate(new Date(Date.now() - 86400000));

  // 🔽 Download chart
const handleDownload = () => {
  if (chartRef.current) {
    toPng(chartRef.current)
      .then((dataUrl) => download(dataUrl, 'mental_balance_graph.png'))
      .catch((err) => console.error('Download failed', err));
  }
};


  return (
    <>
      {/* Background */}
      <Box ref={mountRef} sx={{ position: 'fixed', inset: 0, zIndex: 0 }} />

      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 2, minHeight: '100vh', p: 4, color: '#fff' }}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Student Mental Balance Graph
        </Typography>

       <Box sx={{ ...glassStyle, p: 2, mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
  {/* Date Filters */}
  <Button variant="contained" onClick={() => { setFilter('today'); fetchData(today); }}>Today</Button>
  <Button variant="contained" onClick={() => { setFilter('yesterday'); fetchData(yesterday); }}>Yesterday</Button>
  <Button variant="contained" onClick={() => { setFilter('last7'); fetchData(''); }}>Last 7 Days</Button>

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
    onClick={() => { if (selectedDate) { setFilter('custom'); fetchData(selectedDate); } }}
  >
    Apply
  </Button>

  {/* Graph Type + Download */}
  <Button
    variant={graphType === 'line' ? 'contained' : 'outlined'}
    onClick={() => setGraphType('line')}
  >
    Line Graph
  </Button>
  <Button
    variant={graphType === 'bar' ? 'contained' : 'outlined'}
    onClick={() => setGraphType('bar')}
  >
    Bar Graph
  </Button>
  <Button
    variant="contained"
    sx={{ ml: 1 }}
    onClick={handleDownload}
  >
    Download Graph
  </Button>
</Box>


        {message && <Typography color="error" mb={2}>{message}</Typography>}

        {/* 🌫️ Glass Chart Card */}
        <Box ref={chartRef} sx={{ ...glassStyle, p: 3, height: 400 }}>
          {loading ? (
            <Skeleton variant="rectangular" height={400} />
          ) : data.length === 0 ? (
            <Typography color="#fff">No data to display</Typography>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {graphType === 'line' ? (
                <LineChart data={data}>
                  <CartesianGrid stroke="#555" strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="load_score" stroke="#82ca9d" activeDot={{ r: 8 }} />
                </LineChart>
              ) : (
                <BarChart data={data}>
                  <CartesianGrid stroke="#555" strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="load_score" fill="#82ca9d" />
                </BarChart>
              )}
            </ResponsiveContainer>
          )}
        </Box>

        
      </Box>
    </>
  );
};

export default GraphDashboard;
