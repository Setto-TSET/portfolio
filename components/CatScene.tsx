"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const ROBE = "#8e62ad", HAT = "#7d4a7c", BRIM = "#6d3a6c", SCARF = "#c9a6e3", PATCH = "#c9b0dc";
const LOOK = {
  night: { fur: "#2a2433", point: "#2a2433", iris: "#f59a2c", mask: false }, // black cat, lifted a touch so the cel shading reads on a dark page
  day: { fur: "#f1e4cb", point: "#4a3328", iris: "#5d9be0", mask: true }, // Siamese
};
const SPEED = 70; // px per second along the bottom of the screen

/** Toon-shaded mesh: flat cel bands like the hand-drawn reference. */
function Part({ color, children, ...p }: { color: string; children: React.ReactNode } & React.ComponentProps<"mesh">) {
  return (
    <mesh {...p}>
      {children}
      <meshToonMaterial color={color} />
    </mesh>
  );
}

function starShape() {
  const s = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? 0.055 : 0.13, a = (i / 10) * Math.PI * 2 + Math.PI / 2;
    s[i ? "lineTo" : "moveTo"](Math.cos(a) * r, Math.sin(a) * r);
  }
  return s;
}

// the DOM box is moved outside React; a plain helper keeps that out of the render-purity lint
function move(el: HTMLElement, x: number) {
  el.style.transform = `translate3d(${x}px,0,0)`;
}

function WizardCat({ night, calm, wrap, hops }: { night: boolean; calm: boolean; wrap: React.RefObject<HTMLDivElement | null>; hops: number }) {
  const c = night ? LOOK.night : LOOK.day;
  const root = useRef<THREE.Group>(null), body = useRef<THREE.Group>(null), tail = useRef<THREE.Group>(null);
  const footL = useRef<THREE.Mesh>(null), footR = useRef<THREE.Mesh>(null), eyes = useRef<THREE.Group>(null), star = useRef<THREE.Group>(null);
  const walk = useRef({ x: -1, dir: 1, idle: 1.2, next: 6, hop: 0, phase: 0 });
  const tailCurve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0.08, -0.22), new THREE.Vector3(0.04, 0.34, -0.34), new THREE.Vector3(0.14, 0.5, -0.28),
  ]), []);
  const star3d = useMemo(() => starShape(), []);

  // every pet: hop and stay put for a moment
  useEffect(() => {
    if (!hops) return;
    walk.current.hop = 0.45;
    walk.current.idle = Math.max(walk.current.idle, 2);
  }, [hops]);

  useFrame((state, delta) => {
    const w = walk.current, el = wrap.current;
    if (!root.current || !body.current || !el) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const maxX = Math.max(0, innerWidth - el.offsetWidth);
    if (w.x < 0) w.x = maxX * 0.12;

    // wander: walk, sometimes stop for a look around, sometimes turn back
    const moving = !calm && w.idle <= 0;
    if (moving) {
      w.x += w.dir * SPEED * dt;
      if (w.x <= 0 || w.x >= maxX) { w.x = Math.min(Math.max(w.x, 0), maxX); w.dir *= -1; }
      if ((w.next -= dt) <= 0) {
        w.idle = 1.5 + Math.random() * 2.5;
        w.next = 4 + Math.random() * 6;
        if (Math.random() < 0.35) w.dir *= -1;
      }
    } else w.idle -= dt;
    move(el, w.x);

    // waddle
    w.phase = moving ? w.phase + dt * 9 : 0;
    const s = Math.sin(w.phase);
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, moving ? w.dir * 1.05 : 0.25, 7, dt);
    body.current.rotation.z = THREE.MathUtils.damp(body.current.rotation.z, moving ? s * 0.13 : 0, 10, dt);
    let y = moving ? Math.abs(s) * 0.05 : Math.sin(t * 1.6) * 0.012; // breathe when idle
    if (w.hop > 0) { w.hop = Math.max(0, w.hop - dt); y += Math.sin((1 - w.hop / 0.45) * Math.PI) * 0.35; }
    root.current.position.y = y;
    if (footL.current && footR.current) { footL.current.position.z = 0.2 + s * 0.12; footR.current.position.z = 0.2 - s * 0.12; }
    if (tail.current) tail.current.rotation.z = Math.sin(t * (w.hop ? 9 : 2.2)) * 0.35;
    if (eyes.current) eyes.current.scale.y = t % 4.2 < 0.12 ? 0.1 : 1; // blink
    if (star.current) { star.current.rotation.z = Math.sin(t * 1.4) * 0.25; star.current.scale.setScalar(1 + Math.sin(t * 3) * 0.08); }
  });

  return (
    <group ref={root}>
      <group ref={body}>
        {/* feet */}
        <Part ref={footL} color={c.point} position={[-0.15, 0.05, 0.2]} scale={[1, 0.55, 1.3]}><sphereGeometry args={[0.1, 20, 14]} /></Part>
        <Part ref={footR} color={c.point} position={[0.15, 0.05, 0.2]} scale={[1, 0.55, 1.3]}><sphereGeometry args={[0.1, 20, 14]} /></Part>

        {/* tail */}
        <group ref={tail} position={[0, 0.25, -0.28]}>
          <Part color={c.point}><tubeGeometry args={[tailCurve, 24, 0.05, 10]} /></Part>
        </group>

        {/* robe, buttons, patch */}
        <Part color={ROBE} position={[0, 0.41, 0]}><cylinderGeometry args={[0.26, 0.4, 0.56, 28]} /></Part>
        <mesh position={[0, 0.42, 0.355]}><sphereGeometry args={[0.03, 10, 8]} /><meshToonMaterial color={PATCH} /></mesh>
        <mesh position={[0, 0.27, 0.39]}><sphereGeometry args={[0.03, 10, 8]} /><meshToonMaterial color={PATCH} /></mesh>
        <mesh position={[0.24, 0.3, 0.28]} rotation={[0, 0.7, 0.2]}><boxGeometry args={[0.1, 0.1, 0.01]} /><meshToonMaterial color={PATCH} /></mesh>

        {/* paws + glowing star */}
        <Part color={c.point} position={[-0.31, 0.5, 0.14]}><sphereGeometry args={[0.08, 16, 12]} /></Part>
        <Part color={c.point} position={[0.33, 0.52, 0.2]}><sphereGeometry args={[0.08, 16, 12]} /></Part>
        <group ref={star} position={[0.4, 0.66, 0.28]}>
          <mesh>
            <extrudeGeometry args={[star3d, { depth: 0.04, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 2 }]} />
            <meshStandardMaterial color="#fff1bf" emissive="#ffc94d" emissiveIntensity={1.6} toneMapped={false} />
          </mesh>
          <pointLight color="#ffd27a" intensity={1.4} distance={1.6} />
        </group>

        {/* scarf */}
        <Part color={SCARF} position={[0, 0.67, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.28, 0.08, 14, 32]} /></Part>
        <Part color={SCARF} position={[0.16, 0.52, 0.3]} rotation={[0.2, 0, 0.25]}><boxGeometry args={[0.12, 0.26, 0.05]} /></Part>

        {/* head, Siamese mask, eyes */}
        <Part color={c.fur} position={[0, 0.94, 0]} scale={[1.12, 1, 1]}><sphereGeometry args={[0.38, 32, 24]} /></Part>
        {c.mask && <mesh position={[0, 0.89, 0.2]} scale={[1.05, 0.82, 0.75]}><sphereGeometry args={[0.3, 28, 20]} /><meshToonMaterial color={c.point} /></mesh>}
        {/* huge eyes fill most of the face, like the references */}
        <group ref={eyes} position={[0, 0.96, 0]}>
          {[-0.16, 0.16].map((x) => (
            <group key={x} position={[x, 0, 0.29]} rotation={[0, x * 1.6, 0]}>
              <mesh scale={[1, 1.08, 0.7]}><sphereGeometry args={[0.135, 24, 16]} /><meshToonMaterial color="#fbf4e6" /></mesh>
              <mesh position={[0, -0.01, 0.06]} scale={[1, 1.08, 0.6]}><sphereGeometry args={[0.1, 22, 14]} /><meshToonMaterial color={c.iris} /></mesh>
              <mesh position={[0, -0.01, 0.105]} scale={[0.75, 1, 0.4]}><sphereGeometry args={[0.05, 14, 10]} /><meshBasicMaterial color="#15131a" /></mesh>
              <mesh position={[0.035, 0.045, 0.12]}><sphereGeometry args={[0.024, 10, 8]} /><meshBasicMaterial color="#ffffff" /></mesh>
            </group>
          ))}
        </group>
        {/* blush + little open mouth */}
        {[-0.29, 0.29].map((x) => (
          <mesh key={x} position={[x, 0.82, 0.27]} rotation={[0, x * 2, 0]} scale={[1, 0.6, 0.3]}>
            <sphereGeometry args={[0.065, 14, 10]} /><meshBasicMaterial color="#f29a9a" transparent opacity={0.75} />
          </mesh>
        ))}
        <mesh position={[0, 0.79, 0.355]} scale={[1, 0.8, 0.4]}><sphereGeometry args={[0.04, 14, 10]} /><meshBasicMaterial color="#e2667a" /></mesh>

        {/* ears poke through the brim */}
        <Part color={c.point} position={[-0.42, 1.3, 0.02]} rotation={[0, 0, 0.5]}><coneGeometry args={[0.15, 0.4, 4]} /></Part>
        <Part color={c.point} position={[0.42, 1.3, 0.02]} rotation={[0, 0, -0.5]}><coneGeometry args={[0.15, 0.4, 4]} /></Part>

        {/* patched wizard hat with a bent tip */}
        <group position={[0, 1.22, 0]} rotation={[0.08, 0, -0.1]}>
          <Part color={BRIM}><cylinderGeometry args={[0.58, 0.58, 0.05, 40]} /></Part>
          <Part color={HAT} position={[0, 0.3, 0]}><cylinderGeometry args={[0.1, 0.34, 0.56, 28]} /></Part>
          <Part color={HAT} position={[0.1, 0.66, 0]} rotation={[0, 0, -0.75]}><coneGeometry args={[0.11, 0.3, 20]} /></Part>
          <mesh position={[0.05, 0.36, 0.25]} rotation={[-0.3, 0.2, -0.1]}><boxGeometry args={[0.1, 0.11, 0.01]} /><meshToonMaterial color={PATCH} /></mesh>
          <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.32, 0.335, 0.07, 28]} /><meshToonMaterial color="#4f2a50" /></mesh>
        </group>
      </group>
    </group>
  );
}

// R3F aims the default camera at the origin; frame the whole cat (feet to hat tip) instead
function Aim() {
  const camera = useThree((s) => s.camera);
  useEffect(() => { camera.lookAt(0, 0.98, 0); }, [camera]);
  return null;
}

export default function CatScene(props: { night: boolean; calm: boolean; wrap: React.RefObject<HTMLDivElement | null>; hops: number }) {
  return (
    <Canvas camera={{ position: [0, 1.15, 4.4], fov: 32 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[2, 3, 4]} intensity={1.8} />
      <directionalLight position={[-3, 2, -3]} intensity={1.2} color="#b9a6ff" />
      <Aim />
      <WizardCat {...props} />
    </Canvas>
  );
}
