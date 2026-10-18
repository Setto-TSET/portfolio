"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Float, Html, Line, OrbitControls, Sparkles, Stars } from "@react-three/drei";
import * as THREE from "three";
import { STARS } from "./stars";

export type Props = {
  links: number[];
  onPick: (i: number) => void;
  autoRotate: boolean;
};


function Star({ pos, picked, onPick, i }: { pos: THREE.Vector3; picked: boolean; onPick: (i: number) => void; i: number }) {
  const m = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);
  const phase = (i * 1.7) % 10;
  useFrame(({ clock }) => {
    if (!m.current) return;
    const tw = 1 + Math.sin(clock.elapsedTime * 2 + phase) * 0.25; // twinkle
    const target = (hover ? 2 : picked ? 1.6 : 1) * tw;
    m.current.scale.setScalar(THREE.MathUtils.lerp(m.current.scale.x, target, 0.15));
  });
  return (
    <mesh ref={m} position={pos}
      onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onPick(i); }}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHover(false); document.body.style.cursor = ""; }}>
      <sphereGeometry args={[0.12, 12, 12]} />
      <meshBasicMaterial color={picked ? "#d9cffb" : "#ffffff"} toneMapped={false} />
    </mesh>
  );
}

/** Low-poly black cat sitting on the moon. Head follows the pointer, click to make it hop. */
function MoonCat() {
  const head = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Mesh>(null);
  const hop = useRef(0);
  const [meow, setMeow] = useState(false);
  const black = <meshStandardMaterial color="#17141d" roughness={0.6} />;

  useFrame(({ pointer, clock }, dt) => {
    if (head.current) {
      head.current.rotation.y = THREE.MathUtils.lerp(head.current.rotation.y, pointer.x * 0.8, 0.08);
      head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, -pointer.y * 0.4, 0.08);
    }
    if (tail.current) tail.current.rotation.z = Math.sin(clock.elapsedTime * 2.2) * 0.35;
    if (body.current) {
      hop.current = Math.max(0, hop.current - dt * 2);
      body.current.position.y = 1.55 + Math.sin(hop.current * Math.PI) * 0.6;
    }
  });

  return (
    <group>
      {/* moon */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.4, 48, 48]} />
        <meshStandardMaterial color="#efe9ff" emissive="#b9a6ff" emissiveIntensity={0.35} roughness={0.9} />
      </mesh>
      <group ref={body} position={[0, 1.55, 0]}
        onClick={(e) => { e.stopPropagation(); hop.current = 1; setMeow(true); setTimeout(() => setMeow(false), 1600); }}
        onPointerOver={() => (document.body.style.cursor = "pointer")} onPointerOut={() => (document.body.style.cursor = "")}>
        <mesh scale={[0.55, 0.5, 0.45]}><sphereGeometry args={[1, 24, 24]} />{black}</mesh>
        <mesh ref={tail} position={[0.45, -0.15, -0.2]}>
          <torusGeometry args={[0.35, 0.07, 8, 24, Math.PI * 1.1]} />{black}
        </mesh>
        <group ref={head} position={[0, 0.62, 0.05]}>
          <mesh><sphereGeometry args={[0.42, 24, 24]} />{black}</mesh>
          <mesh position={[-0.22, 0.34, 0]} rotation={[0, 0, 0.35]}><coneGeometry args={[0.13, 0.3, 4]} />{black}</mesh>
          <mesh position={[0.22, 0.34, 0]} rotation={[0, 0, -0.35]}><coneGeometry args={[0.13, 0.3, 4]} />{black}</mesh>
          <mesh position={[-0.15, 0.04, 0.36]}><sphereGeometry args={[0.075, 16, 16]} /><meshBasicMaterial color="#b9a6ff" toneMapped={false} /></mesh>
          <mesh position={[0.15, 0.04, 0.36]}><sphereGeometry args={[0.075, 16, 16]} /><meshBasicMaterial color="#b9a6ff" toneMapped={false} /></mesh>
          <mesh position={[0, -0.18, 0.38]}><sphereGeometry args={[0.03, 8, 8]} /><meshBasicMaterial color="#c4b8e0" /></mesh>
          {meow && <Html center position={[0, 0.8, 0]}><span className="bubble" style={{ position: "static", translate: "none" }}>Meow ~ ✦</span></Html>}
        </group>
      </group>
    </group>
  );
}

export default function PlaygroundScene({ links, onPick, autoRotate }: Props) {
  const stars = STARS;
  const linePts = links.map((i) => stars[i]);
  return (
    <Canvas camera={{ position: [0, 2.5, 9], fov: 55 }} dpr={[1, 1.75]}>
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 6, 6]} intensity={40} color="#d9cffb" />
      <Stars radius={70} depth={50} count={4000} factor={3.5} fade speed={1} />
      <Sparkles count={80} scale={[18, 10, 18]} size={2.5} speed={0.3} color="#b9a6ff" />
      {stars.map((p, i) => <Star key={i} i={i} pos={p} picked={links.includes(i)} onPick={onPick} />)}
      {linePts.length > 1 && <Line points={linePts} color="#d9cffb" lineWidth={1.6} transparent opacity={0.8} />}
      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.6}>
        <MoonCat />
      </Float>
      <OrbitControls enablePan={false} minDistance={5} maxDistance={14} autoRotate={autoRotate} autoRotateSpeed={0.6} enableDamping />
    </Canvas>
  );
}
