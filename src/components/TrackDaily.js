import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableHead, TableRow,
  Box, Typography, Pagination, Chip, Button, TextField, Skeleton
} from '@mui/material';
import axios from 'axios';
import * as THREE from 'three';

const glassStyle = {
  background: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  borderRadius: '18px',
  border: '1px solid rgba(255,255,255,0.2)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
};

const TrackDaily = () => {
  const location = useLocation();
  const email = location.state?.email || localStorage.getItem('email');
  const mountRef = useRef(null);

  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [activeDate, setActiveDate] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // 🌌 Moving stars background with safe cleanup
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

  // 📡 Fetch data from backend
  const fetchData = async (pageNo, date = '') => {
    setLoading(true);
    try {
      const res = await axios.get(
        'http://localhost:5000/api/auth/student-data',
        {
          params: { email, page: pageNo, limit: 5, date },
        }
      );

      const data = res.data.data || [];
      setRows(data);
      setTotalPages(res.data.totalPages || 1);

      setMessage(data.length === 0 ? 'Data unavailable' : '');
    } catch (error) {
      console.error(error);
      setMessage('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // On initial load, show recent data (no date filter)
    fetchData(page);
  }, [page]);

  // 📅 Helper dates
  const formatDate = (d) => d.toISOString().split('T')[0];
  const today = formatDate(new Date());
  const yesterday = formatDate(new Date(Date.now() - 86400000));
  const tomorrow = formatDate(new Date(Date.now() + 86400000));

  // 🎨 Status color
  const getStatusColor = (status) => {
    if (status === 'low') return 'success';
    if (status === 'medium') return 'warning';
    if (status === 'high') return 'error';
    return 'default';
  };

  return (
    <>
      {/* Background */}
      <Box ref={mountRef} sx={{ position: 'fixed', inset: 0, zIndex: 0 }} />

      {/* Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          minHeight: '100vh',
          p: 4,
          color: '#fff',
        }}
      >
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Track Daily Mindness
        </Typography>

        {/* 🌫️ Glass Filter Card */}
        <Box sx={{ ...glassStyle, p: 2, mb: 4 }}>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              onClick={() => {
                setActiveDate(today);
                setPage(1);
                fetchData(1, today);
              }}
            >
              Today
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setActiveDate(yesterday);
                setPage(1);
                fetchData(1, yesterday);
              }}
            >
              Yesterday
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setActiveDate(tomorrow);
                setPage(1);
                fetchData(1, tomorrow);
              }}
            >
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
              onClick={() => {
                if (selectedDate) {
                  setActiveDate(selectedDate);
                  setPage(1);
                  fetchData(1, selectedDate);
                }
              }}
            >
              Apply
            </Button>
          </Box>
        </Box>

        {/* Message */}
        {message && (
          <Typography color="error" mb={2}>
            {message}
          </Typography>
        )}

        {/* 🌫️ Glass Table Card */}
        <Box sx={{ ...glassStyle, p: 3 }}>
          {loading ? (
            <Box>
              {[...Array(5)].map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  height={40}
                  sx={{ mb: 1, borderRadius: 1 }}
                />
              ))}
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#fff' }}>Date</TableCell>
                  <TableCell sx={{ color: '#fff' }}>Subject</TableCell>
                  <TableCell sx={{ color: '#fff' }}>Load</TableCell>
                  <TableCell sx={{ color: '#fff' }}>Status</TableCell>
                  <TableCell sx={{ color: '#fff' }}>Recommendation</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ color: '#ddd' }}>
                      {new Date(row.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ color: '#ddd' }}>{row.input.subject}</TableCell>
                    <TableCell sx={{ color: '#ddd' }}>{row.result.load_score}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.result.status.toUpperCase()}
                        color={getStatusColor(row.result.status)}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#ddd' }}>
                      {row.result.recommendation}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>

        {/* Pagination */}
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, val) => setPage(val)}
            color="primary"
            disabled={rows.length === 0 || loading} // disable when no data or loading
            sx={{
              '& .MuiPaginationItem-previousNext': { color: '#fff' },
              '& .MuiPaginationItem-root': { color: '#fff' },
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default TrackDaily;
