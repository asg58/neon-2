// src/components/NeonText.jsx
import React, { useEffect, useRef, useState } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import calculateDimensions from '../utils/calculateDimensions';

extend({ TextGeometry });

export default function NeonText({ text, color, font, materialType, onDimensionsChange }) {
  const mesh = useRef();
  const [isSelected, setIsSelected] = useState(false); // Selectiemodus
  const [scale, setScale] = useState({ x: 1, y: 1, z: 1 }); // Schaalbare richtingen

  // Pijlen voor richtingsaanwijzing
  const arrows = {
    x: new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0xff0000),
    y: new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 1, 0x00ff00),
    z: new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 1, 0x0000ff),
  };

  useEffect(() => {
    if (font && mesh.current) {
      const geometry = new TextGeometry(text, {
        font: font,
        size: 1,
        depth: 0.1,
        curveSegments: 12,
      });
      mesh.current.geometry = geometry;

      const dimensions = calculateDimensions(mesh.current);
      onDimensionsChange(dimensions);
    }
  }, [font, text, scale]);

  // Bijwerken van schaal in realtime
  useFrame(() => {
    if (mesh.current) {
      mesh.current.scale.set(scale.x, scale.y, scale.z);
      const dimensions = calculateDimensions(mesh.current);
      onDimensionsChange(dimensions);
    }
  });

  // Schaal in bepaalde richting aanpassen
  const handleScaleChange = (axis, delta) => {
    setScale((prevScale) => ({
      ...prevScale,
      [axis]: Math.max(0.1, prevScale[axis] + delta),
    }));
  };

  // Muisgebeurtenissen voor selectie
  const handlePointerDown = (e) => {
    e.stopPropagation();
    setIsSelected(true);
  };

  const handlePointerUp = (e) => {
    e.stopPropagation();
    setIsSelected(false);
  };

  // Materiaaltype kiezen
  let material;
  if (materialType === "basic") {
    material = <meshBasicMaterial color={color} />;
  } else if (materialType === "emissive") {
    material = <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />;
  } else if (materialType === "bloom") {
    material = <meshStandardMaterial color={color} emissive={color} emissiveIntensity={5} />;
  }

  return (
    <group>
      <mesh
        ref={mesh}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {material}
      </mesh>

      {/* Toon pijlen bij selectie */}
      {isSelected && (
        <>
          <primitive
            object={arrows.x}
            position={[1.5 * scale.x, 0, 0]}
            onClick={() => handleScaleChange("x", 0.1)}
            onContextMenu={(e) => { e.preventDefault(); handleScaleChange("x", -0.1); }}
          />
          <primitive
            object={arrows.y}
            position={[0, 1.5 * scale.y, 0]}
            onClick={() => handleScaleChange("y", 0.1)}
            onContextMenu={(e) => { e.preventDefault(); handleScaleChange("y", -0.1); }}
          />
          <primitive
            object={arrows.z}
            position={[0, 0, 1.5 * scale.z]}
            onClick={() => handleScaleChange("z", 0.1)}
            onContextMenu={(e) => { e.preventDefault(); handleScaleChange("z", -0.1); }}
          />
        </>
      )}
    </group>
  );
}
