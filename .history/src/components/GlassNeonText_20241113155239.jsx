// components/GlassNeonText.jsx
import React, { useEffect, useState, useRef } from 'react';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { extend, useFrame } from '@react-three/fiber';
import { useDrag } from '@use-gesture/react';
import * as THREE from 'three';

extend({ TextGeometry });

export default function GlassNeonText({ text, color, intensity, font, depth, envMap, position, rotation }) {
  const mesh = useRef();
  const [currentPosition, setCurrentPosition] = useState(position);

  const bind = useDrag(({ offset: [x, y], memo = currentPosition }) => {
    const clampedX = Math.max(-5, Math.min(5, memo[0] + x / 10));
    const clampedY = Math.max(-5, Math.min(5, memo[1] - y / 10));
    setCurrentPosition([clampedX, clampedY, memo[2]]);
    return memo;
  });

  useEffect(() => {
    if (mesh.current && font) {
      const geometry = new TextGeometry(text, { font, size: 1, depth });
      geometry.center();
      mesh.current.geometry = geometry;
    }
  }, [font, text, depth]);

  return (
    <mesh ref={mesh} position={currentPosition} rotation={rotation} castShadow {...bind()}>
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
        envMap={envMap}
      />
    </mesh>
  );
}
