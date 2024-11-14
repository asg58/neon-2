// utils/calculateDimensions.js
import * as THREE from 'three';

export default function calculateDimensions(mesh) {
  const box = new THREE.Box3().setFromObject(mesh);
  const { width, height, depth } = box.getSize(new THREE.Vector3());
  return { width, height, depth };
}
