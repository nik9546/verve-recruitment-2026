import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Environment } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

function GoldRing({ position, rotation, scale = 1 }: { position: [number, number, number]; rotation: [number, number, number]; scale?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.x += dt * 0.15;
      ref.current.rotation.y += dt * 0.1;
    }
  });
  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={1}>
      <mesh ref={ref} position={position} rotation={rotation} scale={scale}>
        <torusGeometry args={[1, 0.06, 24, 96]} />
        <meshStandardMaterial color="#d9b25b" metalness={1} roughness={0.18} />
      </mesh>
    </Float>
  );
}

function Orb({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  return (
    <Float speed={1.1} rotationIntensity={0.6} floatIntensity={1.6}>
      <mesh position={position} scale={scale}>
        <icosahedronGeometry args={[0.55, 1]} />
        <MeshDistortMaterial color={color} metalness={0.6} roughness={0.25} distort={0.35} speed={1.6} />
      </mesh>
    </Float>
  );
}

function Camera3D({ position }: { position: [number, number, number] }) {
  return (
    <Float speed={1.2} rotationIntensity={0.5} floatIntensity={1.2}>
      <group position={position}>
        <mesh>
          <boxGeometry args={[0.9, 0.55, 0.55]} />
          <meshStandardMaterial color="#0f1e3d" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.25, 32]} />
          <meshStandardMaterial color="#d9b25b" metalness={1} roughness={0.15} />
        </mesh>
        <mesh position={[0.3, 0.32, 0]}>
          <boxGeometry args={[0.18, 0.12, 0.18]} />
          <meshStandardMaterial color="#d9b25b" metalness={1} roughness={0.15} />
        </mesh>
      </group>
    </Float>
  );
}

function Mic3D({ position }: { position: [number, number, number] }) {
  return (
    <Float speed={1.3} rotationIntensity={0.7} floatIntensity={1.3}>
      <group position={position} rotation={[0.3, 0.4, 0.2]}>
        <mesh position={[0, 0.35, 0]}>
          <capsuleGeometry args={[0.22, 0.45, 8, 16]} />
          <meshStandardMaterial color="#d9b25b" metalness={1} roughness={0.18} />
        </mesh>
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.5, 16]} />
          <meshStandardMaterial color="#0f1e3d" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
    </Float>
  );
}

function Particles({ count = 80 }: { count?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, [count]);

  const ref = useRef<THREE.Points>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.04;
  });
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);
  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial color="#f4d77a" size={0.04} transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

function Scene({ mobile }: { mobile: boolean }) {
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 5, 5]} intensity={1.1} />
      <pointLight position={[-4, -2, 3]} intensity={0.8} color="#f4d77a" />

      <Camera3D position={mobile ? [-1.6, 0.6, 0] : [-2.6, 0.6, 0]} />
      <Mic3D position={mobile ? [1.6, -0.4, 0] : [2.6, -0.4, 0]} />
      <Orb position={[0, 1.2, -1]} color="#1a3a7a" scale={0.9} />
      {!mobile && <Orb position={[-2.2, -1.3, -0.5]} color="#0f1e3d" scale={0.6} />}
      <GoldRing position={[1.5, 1.2, -1]} rotation={[0.5, 0.2, 0]} scale={0.9} />
      {!mobile && <GoldRing position={[-1.6, -1.2, -0.8]} rotation={[1.2, 0.3, 0.6]} scale={0.6} />}

      <Particles count={mobile ? 40 : 90} />
      <Environment preset="city" />
    </>
  );
}

interface Props {
  mobile?: boolean;
}

export default function HeroScene({ mobile = false }: Props) {
  return (
    <Canvas
      dpr={[1, mobile ? 1.5 : 2]}
      camera={{ position: [0, 0, 6], fov: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <Suspense fallback={null}>
        <Scene mobile={mobile} />
      </Suspense>
    </Canvas>
  );
}
