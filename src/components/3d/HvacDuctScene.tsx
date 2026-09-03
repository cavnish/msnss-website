"use client";
import { Canvas } from "@react-three/fiber";
import { Environment, Float, PresentationControls } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

function metal(color: string, rough = 0.32) {
  return <meshStandardMaterial color={color} metalness={0.92} roughness={rough} envMapIntensity={1.1} />;
}

function DuctAssembly() {
  return (
    <group rotation={[0.35, -0.5, 0]} scale={1.15}>
      {/* Main rectangular duct run */}
      <mesh castShadow receiveShadow position={[-1.4, 0, 0]}>
        <boxGeometry args={[2.2, 1.15, 1.15]} />
        {metal("#c7ced6")}
      </mesh>
      {/* Flange rings on the main run */}
      {[-2.5, -0.3].map((x) => (
        <mesh key={x} position={[x, 0, 0]} castShadow>
          <boxGeometry args={[0.12, 1.4, 1.4]} />
          {metal("#9aa6b2", 0.25)}
        </mesh>
      ))}
      {/* Elbow transition block */}
      <mesh castShadow receiveShadow position={[0.05, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.62, 0.62, 0.9, 6]} />
        {metal("#b7c0ca")}
      </mesh>
      {/* Vertical riser */}
      <mesh castShadow receiveShadow position={[0.05, 1.15, 0]}>
        <boxGeometry args={[1.0, 1.7, 1.0]} />
        {metal("#c7ced6")}
      </mesh>
      {/* Top flange */}
      <mesh position={[0.05, 2.05, 0]} castShadow>
        <boxGeometry args={[1.25, 0.12, 1.25]} />
        {metal("#9aa6b2", 0.25)}
      </mesh>
      {/* Round branch outlet */}
      <mesh castShadow receiveShadow position={[-1.4, -0.05, 0.95]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.9, 24]} />
        {metal("#aeb8c2")}
      </mesh>
      <mesh position={[-1.4, -0.05, 1.45]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.36, 0.06, 12, 24]} />
        {metal("#8b97a3", 0.2)}
      </mesh>
      {/* Brand accent seam */}
      <mesh position={[-1.4, 0.58, 0]}>
        <boxGeometry args={[2.22, 0.05, 1.17]} />
        <meshStandardMaterial color="#0e7cc4" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}

export default function HvacDuctScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [4.4, 1.8, 4.4], fov: 42 }}
      onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 6, 4]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#7dd3fc" />
      <Suspense fallback={null}>
        <PresentationControls global polar={[-0.15, 0.25]} azimuth={[-0.5, 0.5]}>
          <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.6}>
            <DuctAssembly />
          </Float>
        </PresentationControls>
        <Environment preset="city" />
      </Suspense>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.7, 0]} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <shadowMaterial opacity={0.22} />
      </mesh>
    </Canvas>
  );
}
