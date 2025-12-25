// src/components/RegistrationGauge.js
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';

function Scene() {
  const starsRef = useRef();

  useFrame(({ mouse }) => {
    if (starsRef.current) {
      starsRef.current.rotation.x = mouse.y * 0.3;
      starsRef.current.rotation.y = mouse.x * 0.3;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 2]} intensity={1} />

      {/* ⭐ Mouse-reactive stars */}
      <group ref={starsRef}>
        <Stars
          radius={100}
          depth={50}
          count={1200}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
      </group>

      {/* 🧠 Brain / Gauge */}
      <Sphere args={[1.2, 64, 64]} scale={1.4}>
       <MeshDistortMaterial
  color="#8E6CFF"
  emissive="#C3B5FF"
  emissiveIntensity={1}
  distort={0.25}
  speed={1.5}
  roughness={0.2}
/>

      </Sphere>

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.4} />
    </>
  );
}

export default function RegistrationGauge() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <Scene />
    </Canvas>
  );
}
