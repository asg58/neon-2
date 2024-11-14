// App.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { extend } from '@react-three/fiber';

// Extend TextGeometry to make it available in React Three Fiber
extend({ TextGeometry });

function NeonText({ text, color, intensity }) {
  const mesh = useRef();
  const [font, setFont] = useState(null);

  // Asynchroon laden van het font
  useEffect(() => {
    const loader = new FontLoader();
    loader.load('/fonts/gentilis_bold.typeface.json', (loadedFont) => {
      setFont(loadedFont);
    });
  }, []);

  useEffect(() => {
    if (mesh.current && font) {
      // Maak de TextGeometry aan zodra het font is geladen
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
      <OrbitControls />
      <NeonText text="Neon Text" color="#00ff00" intensity={2} />
    </Canvas>
  );
}
