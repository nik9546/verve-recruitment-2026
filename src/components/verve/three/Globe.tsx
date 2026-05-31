import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

function Wireframe() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.12;
      ref.current.rotation.x += dt * 0.03;
    }
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.6, 3]} />
      <meshBasicMaterial color="#d9b25b" wireframe transparent opacity={0.55} />
    </mesh>
  );
}

function Inner() {
  return (
    <mesh>
      <sphereGeometry args={[1.45, 48, 48]} />
      <meshStandardMaterial color="#0f1e3d" metalness={0.5} roughness={0.4} transparent opacity={0.85} />
    </mesh>
  );
}

function Nodes() {
  const nodes = useMemo(() => {
    const arr: Array<[number, number, number]> = [];
    for (let i = 0; i < 22; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = 1.85;
      arr.push([
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      ]);
    }
    return arr;
  }, []);
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y -= dt * 0.08;
  });
  return (
    <group ref={group}>
      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshBasicMaterial color="#f4d77a" />
        </mesh>
      ))}
    </group>
  );
}

export default function Globe() {
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 4, 4]} intensity={1} />
        <pointLight position={[-3, -2, 2]} color="#f4d77a" intensity={0.8} />
        <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.4}>
          <Inner />
          <Wireframe />
          <Nodes />
        </Float>
      </Suspense>
    </Canvas>
  );
}
