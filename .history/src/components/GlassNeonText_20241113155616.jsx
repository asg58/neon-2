// components/GlassNeonText.jsx
import React, { useEffect, useRef, useState } from 'react';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { extend, useFrame } from '@react-three/fiber';
import { useDrag } from '@use-gesture/react';
import * as THREE from 'three';

extend({ TextGeometry });

export default function GlassNeonText({ text, color, intensity, font, depth, envMap, position, rotation }) {
  const mesh = useRef();
  const [currentPosition, setCurrentPosition] = useState(position);

  // `useDrag` hook met nauwkeuriger schaal voor beweging
  const bind = useDrag(({ movement: [x, y], memo = currentPosition }) => {
    const newPosition = [
      memo[0] + x / 50,  // aanpasbare schaal voor nauwkeurigere controle
      memo[1] - y / 50,
      memo[2],
    ];
    setCurrentPosition(newPosition);
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
    <mesh ref={mesh} position={currentPosition} rotation={rotation} {...bind()}>
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
