// src/components/MindGaugeCanvas.js
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';

const MindGaugeCanvas = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 5, 2]} intensity={1} />
      <Stars radius={50} depth={50} count={500} factor={4} saturation={0} fade />
      <Sphere args={[1.2, 32, 32]} scale={1.5}>
        <MeshDistortMaterial
          color="#6A0DAD"
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
        />
      </Sphere>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  );
};

export default MindGaugeCanvas;
