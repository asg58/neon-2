import React, { useEffect, useRef, useState } from 'react';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';

extend({ TextGeometry });

export default function GlassNeonText({ text, color, intensity, font, depth, envMap, position, rotation, setIsDragging }) {
  const mesh = useRef();
  const [hovered, setHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false); // Nieuwe state voor selectie
  const [currentPosition, setCurrentPosition] = useState(position);

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
    <mesh
      ref={mesh}
      position={currentPosition}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <meshPhysicalMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isSelected ? 2 : intensity} // Emissive verandert naar blauw bij selectie
        roughness={0.05} // Verlaagd om het glas gladder te maken
        metalness={0.1} // Verlaagd om een subtiel metalen effect te behouden
        transmission={0.9} // Verhoogd voor glasachtig effect
        thickness={0.3} // Verhoogd om het doorzichtige effect te verbeteren
        ior={1.5} // Hogere brekingsindex voor glasachtig effect
        reflectivity={0.8} // Verhoogd voor reflectie-effecten
        envMap={envMap} // Reflectie van de omgeving (optioneel)
      />
    </mesh>
  );
}
