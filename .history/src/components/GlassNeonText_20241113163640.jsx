// components/GlassNeonText.jsx
import React, { useEffect, useRef, useState } from 'react';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { extend } from '@react-three/fiber';
import { useDrag } from '@use-gesture/react';
import * as THREE from 'three';

extend({ TextGeometry });

export default function GlassNeonText({ text, color, intensity, font, depth, envMap, position, rotation, setIsDragging }) {
  const mesh = useRef();
  const [hovered, setHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(position);
  const [currentRotation, setCurrentRotation] = useState(rotation || [0, 0, 0]);

  const bind = useDrag(
    ({ offset: [x, y], active }) => {
      setIsDragging(active);
      setIsSelected(active);
      const newPosition = [x / 50, -y / 50, currentPosition[2]];
      setCurrentPosition(newPosition);
    },
    { pointerEvents: true }
  );

  // Functie om de rotatie van de tekst bij te werken
  const rotateText = () => {
    setCurrentRotation([currentRotation[0], currentRotation[1] + 0.1, currentRotation[2]]);
  };

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
  }, [hovered]);

  useEffect(() => {
    if (mesh.current && font) {
      const geometry = new TextGeometry(text, { font, size: 1, depth });
      geometry.center();
      mesh.current.geometry = geometry;
    }
  }, [font, text, depth]);

  return (
    <>
      {/* Rotatieknop */}
      <button
        style={{ position: 'absolute', top: 20, left: 20, zIndex: 1 }}
        onClick={rotateText}
      >
        Rotate Text
      </button>

      <mesh
        ref={mesh}
        position={currentPosition}
        rotation={currentRotation}
        {...bind()}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshPhysicalMaterial
          color={color}
          emissive={isSelected ? 'blue' : color}
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
    </>
  );
}
