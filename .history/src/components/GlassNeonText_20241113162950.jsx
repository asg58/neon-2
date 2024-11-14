// GlassNeonText.jsx
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function GlassNeonText({ text, color, intensity, font, depth }) {
  const mesh = useRef();

  useEffect(() => {
    if (mesh.current && font) {
      const geometry = new THREE.TextGeometry(text, {
        font: font,
        size: 1,
        depth: depth, // Depth alleen aan de voorzijde
      });
      geometry.center();
      mesh.current.geometry = geometry;
    }
  }, [font, text, depth]);

  return (
    <mesh ref={mesh}>
      <meshPhysicalMaterial
        color={color}
        emissive={color}
        emissiveIntensity={intensity}
        roughness={0.2}
        metalness={0.1}
        transmission={0.9}
        thickness={0.3}
        ior={1.4}
        reflectivity={0.8}
      />
    </mesh>
  );
}

export default GlassNeonText;
