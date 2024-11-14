import React, { useEffect, useRef, useState } from 'react';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { extend } from '@react-three/fiber';
import { useDrag } from '@use-gesture/react';
import * as THREE from 'three';

// Extend TextGeometry to use it in react-three-fiber
extend({ TextGeometry });

export default function GlassNeonText({ text, color, intensity, font, depth, envMap, position, rotation, setIsDragging }) {
  const mesh = useRef();
  const [hovered, setHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false); // State to track selection
  const [currentPosition, setCurrentPosition] = useState(position);

  // Dragging functionality
  const bind = useDrag(
    ({ offset: [x, y], active }) => {
      setIsDragging(active);
      setIsSelected(active); // Set selection state
      const newPosition = [x / 50, -y / 50, currentPosition[2]];
      setCurrentPosition(newPosition);
    },
    { pointerEvents: true }
  );

  // Change cursor when hovering over the text
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
  }, [hovered]);

  // Load the geometry for the text whenever the font or text changes
  useEffect(() => {
    if (mesh.current && font) {
      const geometry = new TextGeometry(text, { font, size: 1, depth: depth }); // Use depth instead of height
      geometry.center();
      mesh.current.geometry = geometry;
    }
  }, [font, text, depth]);

  return (
    <mesh
      ref={mesh}
      position={currentPosition}
      rotation={rotation}
      {...bind()}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Simplified Material without IOR and transmission */}
      <meshPhysicalMaterial
        color={color}
        emissive={isSelected ? 'blue' : color} // Emissive turns blue when selected
        emissiveIntensity={intensity}
        roughness={0.2}
        metalness={0.1}
        reflectivity={0.8}
        envMap={envMap} // Reflection from the environment map
      />
    </mesh>
  );
}
