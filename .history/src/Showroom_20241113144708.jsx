// Showroom.jsx
import React from 'react';

function Wall({ position, rotation }) {
  return (
    <mesh position={position} rotation={rotation} receiveShadow>
      <boxGeometry args={[10, 5, 0.1]} />
      <meshStandardMaterial color="#555" />
    </mesh>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#777" />
    </mesh>
  );
}

export default function Showroom() {
  return (
    <>
      {/* Achterwand */}
      <Wall position={[0, 0, -5]} rotation={[0, 0, 0]} />
      {/* Zijwanden */}
      <Wall position={[-5, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      <Wall position={[5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
      {/* Vloer */}
      <Floor />
    </>
  );
}
