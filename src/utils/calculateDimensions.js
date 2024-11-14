// src/utils/calculateDimensions.js
import * as THREE from 'three';

export default function calculateDimensions(mesh) {
  // Controleer of mesh en geometry bestaan
  if (mesh && mesh.geometry) {
    const box = new THREE.Box3().setFromObject(mesh);
    const size = box.getSize(new THREE.Vector3());

    return {
      width: size.x,
      height: size.y,
      depth: size.z,
    };
  }
  
  console.warn("Afmetingen konden niet worden berekend. Controleer het mesh-object.");
  return { width: 0, height: 0, depth: 0 }; // Fallback-waarden
}
