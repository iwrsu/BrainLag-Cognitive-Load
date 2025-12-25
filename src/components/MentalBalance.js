import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Slider,
  Button,
  Typography,
  CssBaseline,
  Alert,
} from "@mui/material";
import * as THREE from "three";
import axios from "axios";
import { useLocation } from 'react-router-dom';
const subjects = ["Coding", "Math", "Reading", "Science", "Other"];

export default function LoadInputForm() {
  const mountRef = useRef(null);
const location = useLocation();
  const [email, setEmail] = useState('');

  useEffect(() => {
    // email comes from navigation state
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // fallback: maybe localStorage if you saved it there
      setEmail(localStorage.getItem('email') || '');
    }
  }, [location.state]);
  const [formData, setFormData] = useState({
    total_time: "",
    num_sessions: "",
    subject: "Coding",
    focus: 3,
    fatigue: 3,
    late_night: 0,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= THREE.JS STAR BACKGROUND ================= */
  useEffect(() => {
    if (!mountRef.current) return;
    let mounted = true;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const count = 1800;
    const positions = [];

    for (let i = 0; i < count; i++) {
      positions.push((Math.random() - 0.5) * 140);
      positions.push((Math.random() - 0.5) * 140);
      positions.push((Math.random() - 0.5) * 140);
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.08,
    });

    const stars = new THREE.Points(geometry, material);
    scene.add(stars);

    const animate = () => {
      if (!mounted) return;
      requestAnimationFrame(animate);
      stars.rotation.y += 0.00025;
      stars.rotation.x += 0.00015;
      renderer.render(scene, camera);
    };
    animate();

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", resize);

    return () => {
      mounted = false;
      window.removeEventListener("resize", resize);
      renderer.dispose();
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSlider = (name) => (_, value) => {
    setFormData((p) => ({ ...p, [name]: value }));
  };

  /* ================= SUBMIT WITH VALIDATION ================= */
  const handleSubmit = async () => {
    setError("");
    setResult(null);

    // Frontend validation
    if (!formData.total_time || !formData.num_sessions || !formData.subject) {
      setError("Please fill all required fields.");
      return;
    }

    if (Number(formData.total_time) <= 0 || Number(formData.num_sessions) <= 0) {
      setError("Time and sessions must be positive numbers.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        email,
        total_time: Number(formData.total_time),
        num_sessions: Number(formData.num_sessions),
        subject: formData.subject,
        focus: Number(formData.focus),
        fatigue: Number(formData.fatigue),
        late_night: Number(formData.late_night),
        duration_missing: 0,
      };

      const res = await axios.post(
        "http://localhost:8000/estimate-load",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      setResult(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setResult({ message: "Error connecting to server" });
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = {
    mb: 2,
    input: { color: "#fff" },
    label: { color: "#bbb" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#666" },
      "&:hover fieldset": { borderColor: "#fff" },
      "&.Mui-focused fieldset": { borderColor: "#9c8cff" },
    },
  };

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          background: "radial-gradient(circle, #070b1f, #020312)",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
        }}
      >
        {/* STAR BACKGROUND */}
        <div
          ref={mountRef}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
          }}
        />

        {/* CONTAINER: FORM LEFT, RESULT RIGHT */}
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            background: "rgba(10,12,35,0.88)",
            borderRadius: 3,
            backdropFilter: "blur(12px)",
            boxShadow: "0 0 40px rgba(160,140,255,0.45)",
            p: 4,
            maxWidth: "900px",
            width: "100%",
          }}
        >
          {/* LEFT PANEL: FORM */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" align="center" color="white" gutterBottom>
              Mental Load Input 
            </Typography>

            <TextField
              label="Total Study Time (minutes)"
              name="total_time"
              type="number"
              value={formData.total_time}
              onChange={handleChange}
              fullWidth
              sx={fieldStyle}
            />

            <TextField
              label="Number of Sessions"
              name="num_sessions"
              type="number"
              value={formData.num_sessions}
              onChange={handleChange}
              fullWidth
              sx={fieldStyle}
            />

            <TextField
              select
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              fullWidth
              sx={{
                ...fieldStyle,
                "& .MuiSelect-select": { color: "#fff" },
              }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: { bgcolor: "#0b0f2a", color: "#fff" },
                  },
                },
              }}
            >
              {subjects.map((s) => (
                <MenuItem key={s} value={s} sx={{ color: "#fff" }}>
                  {s}
                </MenuItem>
              ))}
            </TextField>

            <Typography color="white">Focus (1–5)</Typography>
            <Slider
              value={formData.focus}
              min={1}
              max={5}
              step={1}
              onChange={handleSlider("focus")}
              sx={{ color: "#9c8cff" }}
            />

            <Typography color="white">Fatigue (1–5)</Typography>
            <Slider
              value={formData.fatigue}
              min={1}
              max={5}
              step={1}
              onChange={handleSlider("fatigue")}
              sx={{ color: "#9c8cff" }}
            />

            <Typography color="white">Late Night Study</Typography>
            <Slider
              value={formData.late_night}
              min={0}
              max={1}
              step={1}
              onChange={handleSlider("late_night")}
              sx={{ color: "#9c8cff" }}
            />

            {error && (
              <Typography color="error" sx={{ mb: 2, mt: 1 }}>
                {error}
              </Typography>
            )}

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 1 }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Checking..." : "Submit"}
            </Button>
          </Box>

          {/* RIGHT PANEL: RESULT */}
          <Box
            sx={{
              flex: 1,
              background: "rgba(0,0,50,0.6)",
              borderRadius: 2,
              p: 2,
              color: "#fff",
              minHeight: "300px",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Result
            </Typography>
            {result ? (
              <Alert
                severity={
                  result.status === "low"
                    ? "success"
                    : result.status === "medium"
                    ? "warning"
                    : "error"
                }
              >
                <Typography variant="subtitle1">
                  {result.message || "No result"}
                </Typography>
                {result.recommendation && (
                  <Typography>{result.recommendation}</Typography>
                )}
                {result.load_score && (
                  <Typography>Score: {result.load_score}</Typography>
                )}
              </Alert>
            ) : (
              <Typography>Submit the form to see result</Typography>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}
