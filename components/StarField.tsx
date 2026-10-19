"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Stars } from "@react-three/drei";
import * as THREE from "three";

/** Camera drifts toward the pointer and sinks as the page scrolls: real 3D parallax. */
function Rig() {
  useFrame(({ camera, pointer }, dt) => {
    const k = 1 - Math.pow(0.02, dt);
    camera.position.x += (pointer.x * 1.2 - camera.position.x) * k;
    camera.position.y += (pointer.y * 0.8 - window.scrollY * 0.004 - camera.position.y) * k;
    camera.lookAt(0, 0, -10);
  });
  return null;
}

function SlowSpin({ children }: { children: React.ReactNode }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (g.current) g.current.rotation.y += dt * 0.015;
  });
  return <group ref={g}>{children}</group>;
}

/** A few shooting stars that streak across the sky at random intervals. */
function ShootingStars({ count = 3 }) {
  const refs = useRef<THREE.Mesh[]>([]);
  const state = useMemo(
    () => Array.from({ length: count }, (_, i) => ({ t: -1 - i * 2.5, speed: 0, from: new THREE.Vector3(), dir: new THREE.Vector3() })),
    [count],
  );
  const reset = (s: (typeof state)[number]) => {
    s.t = -2 - Math.random() * 6; // wait before next streak
    s.speed = 14 + Math.random() * 8;
    s.from.set(-14 + Math.random() * 10, 4 + Math.random() * 4, -8 - Math.random() * 6);
    s.dir.set(1, -0.45 - Math.random() * 0.2, 0).normalize();
  };
  useFrame((_, dt) => {
    state.forEach((s, i) => {
      const m = refs.current[i];
      if (!m) return;
      s.t += dt;
      if (s.t > 1.6 || s.speed === 0) reset(s);
      const live = s.t > 0;
      m.visible = live;
      if (!live) return;
      m.position.copy(s.from).addScaledVector(s.dir, s.t * s.speed);
      m.rotation.z = Math.atan2(s.dir.y, s.dir.x);
      (m.material as THREE.MeshBasicMaterial).opacity = Math.sin((s.t / 1.6) * Math.PI);
    });
  });
  return (
    <>
      {state.map((_, i) => (
        <mesh key={i} ref={(m) => { if (m) refs.current[i] = m; }}>
          <planeGeometry args={[2.4, 0.03]} />
          <meshBasicMaterial color="#ffffff" transparent depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}

/**
 * `active` is false once the hero scrolls out of view: the render loop stops entirely.
 * Reduced motion renders on demand (a still sky) instead of every frame.
 */
export default function StarField({ calm = false, active = true }: { calm?: boolean; active?: boolean }) {
  const [small] = useState(() => matchMedia("(max-width: 640px)").matches);
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 60 }} dpr={small ? [1, 1.25] : [1, 1.5]} gl={{ alpha: true, antialias: !small }}
      frameloop={!active ? "never" : calm ? "demand" : "always"}>
      <SlowSpin>
        <Stars radius={60} depth={40} count={small ? 1200 : 2500} factor={3.2} saturation={0.4} fade speed={calm ? 0.2 : 1.2} />
        <Sparkles count={small ? 30 : 60} scale={[16, 8, 6]} position={[0, 2, -4]} size={3} speed={calm ? 0.05 : 0.35} color="#d9cffb" />
      </SlowSpin>
      {!calm && <ShootingStars />}
      <Rig />
    </Canvas>
  );
}
