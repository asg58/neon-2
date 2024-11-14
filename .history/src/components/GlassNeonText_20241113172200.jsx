import React, { useEffect, useRef, useState } from 'react';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';

extend({ TextGeometry });

export default function GlassNeonText({ text, color, intensity, font, depth, position, rotation, setIsDragging }) {
  const mesh = useRef();
  const [hovered, setHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(position);

  useEffect(() => {
    if (mesh.current && font) {
      const geometry = new TextGeometry(text, { font, size: 1, depth });
      geometry.center();
      mesh.current.geometry = geometry;
    }
  }, [font, text, depth]);

  // Basic Neon Shader
  const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vPosition;

      void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vPosition;
      
      uniform vec3 neonColor; 
      uniform float intensity;
      uniform float threshold;

      void main() {
        vec3 glow = neonColor * intensity;
        gl_FragColor = vec4(glow, 1.0);
        
        if (length(vPosition) > threshold) {
          gl_FragColor.rgb += glow * 0.5;
        }
      }
    `,
    uniforms: {
      neonColor: { value: new THREE.Color(color) },
      intensity: { value: intensity },
      threshold: { value: 1.5 }
    },
    side: THREE.DoubleSide,
    emissive: new THREE.Color(color), // Add emissive for neon effect
    emissiveIntensity: intensity,
    transparent: true
  });

  return (
    <mesh ref={mesh} position={currentPosition} rotation={rotation} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={intensity}
        roughness={0.2}
        metalness={0.1}
      />
      {/* Apply the shaderMaterial for neon effect */}
      <primitive object={mesh.current} material={shaderMaterial} />
    </mesh>
  );
}
