import React, { useEffect, useRef, useState } from 'react';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';
import { useDrag } from '@use-gesture/react';

extend({ TextGeometry });

export default function GlassNeonText({ text, color, intensity, font, depth, envMap, position, rotation, setIsDragging }) {
  const mesh = useRef();
  const [hovered, setHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false); 
  const [currentPosition, setCurrentPosition] = useState(position);

  const bind = useDrag(
    ({ offset: [x, y], active }) => {
      setIsDragging(active);
      setIsSelected(active); 
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
      // Verhoog de curveSegments en pas de resolutie van de tekst aan
      const geometry = new TextGeometry(text, {
        font: font,
        size: 1,
        height: depth,
        curveSegments: 100,  // Verhoog het aantal segmenten voor een soepeler resultaat
      });
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
      <meshStandardMaterial
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
  );
}
