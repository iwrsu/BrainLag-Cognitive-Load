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
import { useLocation,useNavigate } from "react-router-dom";

const subjects = [
  { label: "Coding", icon: "💻" },
  { label: "Math", icon: "📐" },
  { label: "Reading", icon: "📚" },
  { label: "Science", icon: "🔬" },
  { label: "Other", icon: "📝" },
];

export default function LoadInputForm() {
  const mountRef = useRef(null);
  const location = useLocation();
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      setEmail(localStorage.getItem("email") || "");
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
  const [showForm, setShowForm] = useState(true);
const navigate=useNavigate();
  // ================== THREE.JS STAR BACKGROUND ==================
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSlider = (name) => (_, value) => {
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async () => {
    setError("");
    setResult(null);

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
      setShowForm(false);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setResult({ message: "Error connecting to server" });
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      total_time: "",
      num_sessions: "",
      subject: "Coding",
      focus: 3,
      fatigue: 3,
      late_night: 0,
    });
    setResult(null);
    setError("");
    setShowForm(true);
  };

  const fieldStyle = {
    mb: 2,
    input: { color: "#fff" },
    label: { color: "#bbb", fontWeight: "bold" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#666" },
      "&:hover fieldset": { borderColor: "#9c8cff" },
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
        {/* Star background */}
        <div ref={mountRef} style={{ position: "fixed", inset: 0, zIndex: 0 }} />

        {/* Form container */}
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            background: "rgba(10,12,35,0.9)",
            borderRadius: 4,
            backdropFilter: "blur(15px)",
            boxShadow: "0 0 50px rgba(156,140,255,0.45)",
            p: 5,
            maxWidth: "900px",
            width: "100%",
          }}
        >
          {showForm && (
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h4"
                align="center"
                color="#fff"
                gutterBottom
                sx={{ mb: 4 }}
              >
                🧠 Mental Load Input
              </Typography>

              {/* Total Time */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography sx={{ fontSize: "1.5rem", mr: 1 }}>⏱️</Typography>
                <TextField
                  label="Total Study Time (minutes)"
                  name="total_time"
                  type="number"
                  value={formData.total_time}
                  onChange={handleChange}
                  fullWidth
                  sx={fieldStyle}
                />
              </Box>

              {/* Number of Sessions */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography sx={{ fontSize: "1.5rem", mr: 1 }}>📊</Typography>
                <TextField
                  label="Number of Sessions"
                  name="num_sessions"
                  type="number"
                  value={formData.num_sessions}
                  onChange={handleChange}
                  fullWidth
                  sx={fieldStyle}
                />
              </Box>

              {/* Subject */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography sx={{ fontSize: "1.5rem", mr: 1 }}>
                  {subjects.find((s) => s.label === formData.subject)?.icon || "📘"}
                </Typography>
                <TextField
                  select
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  fullWidth
                  sx={{ ...fieldStyle, "& .MuiSelect-select": { color: "#fff" } }}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: { sx: { bgcolor: "#0b0f2a", color: "#fff" } },
                    },
                  }}
                >
                  {subjects.map((s) => (
                    <MenuItem key={s.label} value={s.label} sx={{ color: "#fff" }}>
                      {s.icon} {s.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              {/* Focus */}
              <Typography color="#fff" sx={{ mt: 2 }}>
                🎯 Focus (1–5)
              </Typography>
              <Slider
                value={formData.focus}
                min={1}
                max={5}
                step={1}
                onChange={handleSlider("focus")}
                sx={{ color: "#9c8cff", mb: 2 }}
              />

              {/* Fatigue */}
              <Typography color="#fff">😴 Fatigue (1–5)</Typography>
              <Slider
                value={formData.fatigue}
                min={1}
                max={5}
                step={1}
                onChange={handleSlider("fatigue")}
                sx={{ color: "#9c8cff", mb: 2 }}
              />

              {/* Late night */}
              <Typography color="#fff" sx={{ mt: 2, mb: 1 }}>
                🌙 Late Night Study
              </Typography>
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Button
                  variant={formData.late_night === 1 ? "contained" : "outlined"}
                  color="primary"
                  onClick={() => setFormData((p) => ({ ...p, late_night: 1 }))}
                  sx={{ flex: 1, fontSize: "1rem", height: "36px" }}
                >
                  {formData.late_night === 1 ? "✔ Yes" : "Yes"}
                </Button>
                <Button
                  variant={formData.late_night === 0 ? "contained" : "outlined"}
                  color="primary"
                  onClick={() => setFormData((p) => ({ ...p, late_night: 0 }))}
                  sx={{ flex: 1, fontSize: "1rem", height: "36px" }}
                >
                  {formData.late_night === 0 ? "✔ No" : "No"}
                </Button>
              </Box>

              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}

              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 1, fontWeight: "bold" }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Checking..." : "Submit"}
              </Button>
            </Box>
          )}

          {!showForm && (
  <Box
    sx={{
      flex: 1,
      background: "rgba(0,0,50,0.6)",
      borderRadius: 3,
      p: 3,
      color: "#fff",
      minHeight: "300px",
    }}
  >
    <Typography variant="h5" gutterBottom>
      📝 Result
    </Typography>
    {result ? (
      <>
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

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleResetForm}
          >
            Submit Another Form
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={() => navigate("/TrackDaily", { state: { email } })}
          >
            View Insights
          </Button>
        </Box>
      </>
    ) : (
      <Typography>Submit the form to see result</Typography>
    )}
  </Box>
)}

        </Box>
      </Box>
    </>
  );
}
