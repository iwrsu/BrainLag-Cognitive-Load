// src/components/BrainCanvas.js
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function BrainModel() {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    meshRef.current.rotation.y += 0.002;
    const scale = 1 + 0.03 * Math.sin(clock.getElapsedTime() * 2);
    meshRef.current.scale.set(scale, scale, scale);

    const intensity = 0.5 + (Math.sin(clock.getElapsedTime() * 2) + 1) / 4; // subtle glow
    meshRef.current.material.emissiveIntensity = intensity;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color="#6A0DAD"
        emissive="#9B59B6"
        roughness={0.4}
        metalness={0.2}
      />
    </mesh>
  );
}

export default function BrainCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <BrainModel />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.2} />
    </Canvas>
  );
}
