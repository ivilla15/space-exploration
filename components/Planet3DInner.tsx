"use client";

import { OrbitControls } from "@react-three/drei/core/OrbitControls";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useRef } from "react";
import { TextureLoader, Mesh } from "three";

type Props = {
  texturePath: string;
};

function PlanetMesh({ texturePath }: { texturePath: string }) {
  const planetRef = useRef<Mesh>(null);
  const texture = useLoader(TextureLoader, texturePath);

  useFrame(() => {
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh ref={planetRef}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

export default function Planet3DInner({ texturePath }: Props) {
  return (
    <Canvas style={{ height: 700 }}>
      <ambientLight intensity={1} />
      <directionalLight position={[2, 2, 5]} />
      <PlanetMesh texturePath={texturePath} />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}