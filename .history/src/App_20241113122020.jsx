import React, { useEffect, useRef } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { extend } from '@react-three/fiber';

// Extends TextGeometry for use in React Three Fiber
extend({ TextGeometry });

function NeonText({ text, color, intensity }) {
  // Load the font using the correct path to gentilis_bold.typeface.json
  const font = useLoader(THREE.FontLoader, '/fonts/gentilis_bold.typeface.json');

  const mesh = useRef();

  useEffect(() => {
    if (mesh.current) {
      mesh.current.geometry = new TextGeometry(text, {
        font: font,
        size: 1,
        height: 0.2,
      });
    }
  }, [font, text]);

  return (
    <mesh ref={mesh}>
      <meshStandardMaterial emissive={color} emissiveIntensity={intensity} />
    </mesh>
  );
}

export default function App() {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <NeonText text="Neon Text" color="#00ff00" intensity={2} />
      <OrbitControls />
    </Canvas>
  );
}
