// src/components/NeonText.jsx
import React, { useEffect, useRef, useState } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { ArrowHelper } from 'three';

extend({ TextGeometry });

export default function NeonText({ text, color, font, materialType, onDimensionsChange }) {
  const mesh = useRef();
  const [isSelected, setIsSelected] = useState(false); // Om selectie te beheren
  const [scale, setScale] = useState({ x: 1, y: 1, z: 1 }); // Grootte aanpasbaar per richting

  // Pijlen voor visuele indicatie van schaalbare richtingen
  const arrows = {
    x: new ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0xff0000),
    y: new ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 1, 0x00ff00),
    z: new ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 1, 0x0000ff),
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

  // Realtime grootte-aanpassing
  useFrame(() => {
    mesh.current.scale.set(scale.x, scale.y, scale.z);
    const dimensions = calculateDimensions(mesh.current);
    onDimensionsChange(dimensions);
  });

  // Functies om het formaat te schalen in elke richting
  const handleScaleChange = (axis, delta) => {
    setScale((prevScale) => ({
      ...prevScale,
      [axis]: Math.max(0.1, prevScale[axis] + delta),
    }));
  };

  // Selectie-aanpassing
  const handlePointerDown = (e) => {
    e.stopPropagation();
    setIsSelected(true);
  };

  const handlePointerUp = (e) => {
    e.stopPropagation();
    setIsSelected(false);
  };

  // Kies het materiaaltype op basis van de keuze
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

      {/* Toon pijlen alleen wanneer geselecteerd */}
      {isSelected && (
        <>
          {/* Pijl voor x-richting */}
          <primitive
            object={arrows.x}
            position={[1.5 * scale.x, 0, 0]}
            onClick={() => handleScaleChange("x", 0.1)}
            onContextMenu={() => handleScaleChange("x", -0.1)}
          />
          {/* Pijl voor y-richting */}
          <primitive
            object={arrows.y}
            position={[0, 1.5 * scale.y, 0]}
            onClick={() => handleScaleChange("y", 0.1)}
            onContextMenu={() => handleScaleChange("y", -0.1)}
          />
          {/* Pijl voor z-richting */}
          <primitive
            object={arrows.z}
            position={[0, 0, 1.5 * scale.z]}
            onClick={() => handleScaleChange("z", 0.1)}
            onContextMenu={() => handleScaleChange("z", -0.1)}
          />
        </>
      )}
    </group>
  );
}
