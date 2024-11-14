// App.jsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

// Extend TextGeometry to make it available in React Three Fiber
extend({ TextGeometry });

function NeonText({ text, color, intensity }) {
  return (
    <mesh>
      {/* Use textGeometry here with args */}
      <textGeometry args={[text, { font: '/path/to/font.json', size: 1, height: 0.2 }]} />
      <meshStandardMaterial emissive={color} emissiveIntensity={intensity} />
    </mesh>
  );
}

function App() {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={null}>
        <NeonText text="Neon Text" color="#00ff00" intensity={2} />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
}

export default App;
