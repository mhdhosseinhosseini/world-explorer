import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Simple longitude-to-continent mapping
function getContinentFromLongitude(lon) {
  // Normalize longitude to [-180, 180]
  lon = ((lon + 180) % 360) - 180;
  if (lon >= -170 && lon < -30) return 'America';
  if (lon >= -30 && lon < 60) return 'Africa';
  if (lon >= 60 && lon < 150) return 'Asia';
  if (lon >= 150 || lon < -170) return 'Oceania';
  return 'Unknown';
}

export function InteractiveSphere({ onContinentChange }) {
  const meshRef = useRef();
  const lastContinent = useRef('');
  
  // Load planet textures
  const [earthTexture, bumpMap, specularMap] = useTexture([
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'
  ]);

  // Animate the sphere
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1; // Slower rotation for more realistic planet movement
      // Calculate longitude at the center with offset
      const yRot = meshRef.current.rotation.y;
      let lon = (-THREE.MathUtils.radToDeg(yRot) + 90) % 360; // +90° offset
      // Map longitude to continent
      const continent = getContinentFromLongitude(lon);
      if (continent !== lastContinent.current && onContinentChange) {
        lastContinent.current = continent;
        onContinentChange(continent);
      }
    }
  });

  return (
    <>
      {/* Earth Sphere */}
      <mesh
        ref={meshRef}
        scale={1.6}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial
          map={earthTexture}
          bumpMap={bumpMap}
          bumpScale={0.05}
          specularMap={specularMap}
          specular={new THREE.Color('white')}
          shininess={20}
          emissive={new THREE.Color('#222a3a')}
          emissiveIntensity={0.35}
        />
      </mesh>
      {/* Atmosphere Glow */}
      <mesh scale={1.7}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          color={new THREE.Color('#4fc3f7')}
          transparent
          opacity={0.18}
          side={THREE.BackSide}
        />
      </mesh>
    </>
  );
} 