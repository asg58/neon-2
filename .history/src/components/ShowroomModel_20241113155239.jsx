// components/ShowroomModel.jsx
import React, { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export default function ShowroomModel({ lightIntensity, lightColor }) {
  const { scene } = useGLTF('/models/room-transformed.glb');

  useEffect(() => {
    const ambientLight = new THREE.AmbientLight(lightColor, lightIntensity);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(lightColor, lightIntensity, 50);
    pointLight.position.set(5, 10, 5);
    scene.add(pointLight);

    return () => {
      scene.remove(ambientLight);
      scene.remove(pointLight);
    };
  }, [scene, lightIntensity, lightColor]);

  return <primitive object={scene} scale={1.5} />;
}
