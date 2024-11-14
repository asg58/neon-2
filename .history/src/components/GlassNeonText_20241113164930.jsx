import React, { useEffect, useRef, useState } from 'react';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { extend } from '@react-three/fiber';
import { useDrag } from '@use-gesture/react';
import * as THREE from 'three';

extend({ TextGeometry });

export default function GlassNeonText({
  text,
  color,
  intensity,
  font,
  depth,
  envMap,
  position,
  rotation,
  setIsDragging,
  isRotating, // Voeg isRotating toe
}) {
  const mesh = useRef();
  const [hovered, setHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false); // Nieuwe state voor selectie
  const [currentPosition, setCurrentPosition] = useState(position);

  const bind = useDrag(
    ({ offset: [x, y], active }) => {
      setIsDragging(active);
      setIsSelected(active); // Bijwerken van isSelected-status
      const newPosition = [x / 50, -y / 50, currentPosition[2]];
      setCurrentPosition(newPosition);
    },
    { pointerEvents: true }
  );

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

  useEffect(() => {
    if (mesh.current) {
      if (isRotating) {
        mesh.current.rotation.y += 0.05; // De rotatie om de Y-as
      }
    }
  }, [isRotating]);

  return (
    <mesh
      ref={mesh}
      position={currentPosition}
      rotation={rotation}
      {...bind()}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <meshPhysicalMaterial
        color={color}
        emissive={isSelected ? 'blue' : color} // Emissive verandert naar blauw bij selectie
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
