"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

export function Laptop3D() {
  const groupRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      // Gentle floating tilt
      groupRef.current.rotation.y = Math.sin(t / 3) * 0.35;
      groupRef.current.rotation.x = Math.sin(t / 5) * 0.05;
    }
    if (lidRef.current) {
      // Subtle opening/closing hinge breathing animation
      lidRef.current.rotation.x = -Math.PI * 0.58 + Math.sin(t * 1.5) * 0.02;
    }
  });

  // Generate procedural keyboard keys grid
  const keyRows = useMemo(() => {
    const rows = [];

    // Row 0: Function row (14 small keys)
    const fKeys = [];
    for (let i = 0; i < 14; i++) {
      fKeys.push({ x: -0.9 + i * 0.138, w: 0.11, h: 0.065 });
    }
    rows.push({ z: -0.48, keys: fKeys });

    // Row 1: Number row (14 keys)
    const numKeys = [];
    for (let i = 0; i < 13; i++) {
      numKeys.push({ x: -0.9 + i * 0.138, w: 0.12, h: 0.09 });
    }
    numKeys.push({ x: 0.89, w: 0.15, h: 0.09 }); // Backspace
    rows.push({ z: -0.37, keys: numKeys });

    // Row 2: QWERTY row
    const qwertyKeys = [];
    qwertyKeys.push({ x: -0.88, w: 0.16, h: 0.09 }); // Tab
    for (let i = 0; i < 12; i++) {
      qwertyKeys.push({ x: -0.71 + i * 0.138, w: 0.12, h: 0.09 });
    }
    qwertyKeys.push({ x: 0.90, w: 0.13, h: 0.09 });
    rows.push({ z: -0.26, keys: qwertyKeys });

    // Row 3: ASDF row
    const asdfKeys = [];
    asdfKeys.push({ x: -0.86, w: 0.20, h: 0.09 }); // Caps
    for (let i = 0; i < 11; i++) {
      asdfKeys.push({ x: -0.67 + i * 0.138, w: 0.12, h: 0.09 });
    }
    asdfKeys.push({ x: 0.87, w: 0.20, h: 0.09 }); // Enter
    rows.push({ z: -0.15, keys: asdfKeys });

    // Row 4: ZXCV row
    const zxcvKeys = [];
    zxcvKeys.push({ x: -0.84, w: 0.25, h: 0.09 }); // Left Shift
    for (let i = 0; i < 10; i++) {
      zxcvKeys.push({ x: -0.62 + i * 0.138, w: 0.12, h: 0.09 });
    }
    zxcvKeys.push({ x: 0.84, w: 0.25, h: 0.09 }); // Right Shift
    rows.push({ z: -0.04, keys: zxcvKeys });

    // Row 5: Spacebar row
    const spaceKeys = [];
    spaceKeys.push({ x: -0.89, w: 0.12, h: 0.09 });
    spaceKeys.push({ x: -0.75, w: 0.12, h: 0.09 });
    spaceKeys.push({ x: -0.61, w: 0.14, h: 0.09 });
    spaceKeys.push({ x: -0.05, w: 0.90, h: 0.09 }); // Spacebar
    spaceKeys.push({ x: 0.51, w: 0.14, h: 0.09 });
    spaceKeys.push({ x: 0.65, w: 0.12, h: 0.09 });
    spaceKeys.push({ x: 0.79, w: 0.12, h: 0.09 });
    spaceKeys.push({ x: 0.92, w: 0.12, h: 0.09 });
    rows.push({ z: 0.07, keys: spaceKeys });

    return rows;
  }, []);

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
      <group ref={groupRef} scale={1.75} position={[0, -0.2, 0]}>
        {/* --- LAPTOP BASE CHASSIS --- */}
        {/* Main Aluminum Base Body */}
        <mesh position={[0, -0.04, 0]}>
          <boxGeometry args={[2.2, 0.07, 1.5]} />
          <meshStandardMaterial color="#2d2f35" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Bottom Feet (4 rubber pucks) */}
        <mesh position={[-0.9, -0.08, -0.55]}>
          <cylinderGeometry args={[0.04, 0.04, 0.015, 16]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
        <mesh position={[0.9, -0.08, -0.55]}>
          <cylinderGeometry args={[0.04, 0.04, 0.015, 16]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
        <mesh position={[-0.9, -0.08, 0.55]}>
          <cylinderGeometry args={[0.04, 0.04, 0.015, 16]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
        <mesh position={[0.9, -0.08, 0.55]}>
          <cylinderGeometry args={[0.04, 0.04, 0.015, 16]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>

        {/* Front Lip Opening Notch */}
        <mesh position={[0, -0.02, 0.745]}>
          <boxGeometry args={[0.24, 0.02, 0.015]} />
          <meshStandardMaterial color="#1c1d21" metalness={0.8} />
        </mesh>

        {/* Side Ports (USB-C & Headphone Jack) */}
        {/* Left Ports */}
        <mesh position={[-1.102, -0.04, -0.2]}>
          <boxGeometry args={[0.01, 0.025, 0.06]} />
          <meshStandardMaterial color="#111" metalness={0.9} />
        </mesh>
        <mesh position={[-1.102, -0.04, -0.08]}>
          <boxGeometry args={[0.01, 0.025, 0.06]} />
          <meshStandardMaterial color="#111" metalness={0.9} />
        </mesh>
        {/* Right Ports */}
        <mesh position={[1.102, -0.04, -0.2]}>
          <boxGeometry args={[0.01, 0.025, 0.06]} />
          <meshStandardMaterial color="#111" metalness={0.9} />
        </mesh>
        <mesh position={[1.102, -0.04, 0.1]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.018, 0.018, 0.01, 16]} />
          <meshStandardMaterial color="#111" metalness={0.9} />
        </mesh>

        {/* Recessed Keyboard Bed */}
        <mesh position={[0, -0.004, -0.2]}>
          <boxGeometry args={[1.96, 0.005, 0.72]} />
          <meshStandardMaterial color="#151618" roughness={0.7} />
        </mesh>

        {/* Keyboard Backlight Emissive Layer */}
        <mesh position={[0, -0.003, -0.2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.94, 0.70]} />
          <meshStandardMaterial color="#C5A46E" emissive="#C5A46E" emissiveIntensity={0.6} />
        </mesh>

        {/* Keyboard Keys */}
        <group position={[0, 0.008, -0.2]}>
          {keyRows.map((row, rIdx) => (
            <group key={rIdx} position={[0, 0, row.z]}>
              {row.keys.map((k, kIdx) => (
                <mesh key={kIdx} position={[k.x, 0, 0]}>
                  <boxGeometry args={[k.w, 0.016, k.h]} />
                  <meshStandardMaterial color="#1c1d22" metalness={0.3} roughness={0.5} />
                </mesh>
              ))}
            </group>
          ))}
        </group>

        {/* Glass Trackpad */}
        <group position={[0, -0.002, 0.42]}>
          {/* Outer Chrome Border */}
          <mesh>
            <boxGeometry args={[0.72, 0.006, 0.46]} />
            <meshStandardMaterial color="#C5A46E" metalness={0.95} roughness={0.1} />
          </mesh>
          {/* Inner Touch Surface */}
          <mesh position={[0, 0.002, 0]}>
            <boxGeometry args={[0.70, 0.006, 0.44]} />
            <meshStandardMaterial color="#25272c" metalness={0.5} roughness={0.3} />
          </mesh>
        </group>

        {/* Speaker Grilles (Left & Right micro dots) */}
        <mesh position={[-0.92, -0.002, -0.2]}>
          <boxGeometry args={[0.07, 0.005, 0.68]} />
          <meshStandardMaterial color="#1c1d21" roughness={0.9} />
        </mesh>
        <mesh position={[0.92, -0.002, -0.2]}>
          <boxGeometry args={[0.07, 0.005, 0.68]} />
          <meshStandardMaterial color="#1c1d21" roughness={0.9} />
        </mesh>

        {/* Cylindrical Hinge */}
        <mesh position={[0, 0.005, -0.735]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.032, 0.032, 2.05, 20]} />
          <meshStandardMaterial color="#1a1b1f" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* --- LAPTOP DISPLAY LID ASSEMBLY (Attached at Hinge) --- */}
        <group position={[0, 0.005, -0.735]} ref={lidRef}>
          {/* Lid Outer Aluminum Back */}
          <mesh position={[0, 0.72, 0]}>
            <boxGeometry args={[2.2, 1.44, 0.03]} />
            <meshStandardMaterial color="#2d2f35" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Glowing Lid Logo Emblem (Back) */}
          <mesh position={[0, 0.72, -0.016]} rotation={[0, Math.PI, 0]}>
            <circleGeometry args={[0.1, 32]} />
            <meshStandardMaterial color="#C5A46E" emissive="#C5A46E" emissiveIntensity={4} />
          </mesh>

          {/* Front Glass Bezel Frame */}
          <mesh position={[0, 0.72, 0.016]}>
            <boxGeometry args={[2.16, 1.40, 0.006]} />
            <meshStandardMaterial color="#0b0c0e" metalness={0.9} roughness={0.1} />
          </mesh>

          {/* Top Webcam Lens Dot */}
          <mesh position={[0, 1.37, 0.02]}>
            <sphereGeometry args={[0.012, 16, 16]} />
            <meshStandardMaterial color="#000" emissive="#06b6d4" emissiveIntensity={1} />
          </mesh>

          {/* Glowing UI Screen Surface */}
          <mesh position={[0, 0.72, 0.021]}>
            <planeGeometry args={[2.04, 1.26]} />
            <meshStandardMaterial
              color="#090a0f"
              emissive="#0d111a"
              emissiveIntensity={1}
              roughness={0.1}
            />
          </mesh>

          {/* --- HIGH-TECH UI SCREEN CONTENT --- */}
          <group position={[0, 0.72, 0.022]}>
            {/* Header Window Bar */}
            <mesh position={[0, 0.58, 0]}>
              <planeGeometry args={[2.0, 0.06]} />
              <meshStandardMaterial color="#161922" emissive="#161922" emissiveIntensity={0.5} />
            </mesh>

            {/* Window Dots (Red, Yellow, Green) */}
            <mesh position={[-0.92, 0.58, 0.001]}>
              <circleGeometry args={[0.012, 16]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
            </mesh>
            <mesh position={[-0.88, 0.58, 0.001]}>
              <circleGeometry args={[0.012, 16]} />
              <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={2} />
            </mesh>
            <mesh position={[-0.84, 0.58, 0.001]}>
              <circleGeometry args={[0.012, 16]} />
              <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={2} />
            </mesh>

            {/* Title Bar Text Block */}
            <mesh position={[0, 0.58, 0.001]}>
              <planeGeometry args={[0.5, 0.03]} />
              <meshStandardMaterial color="#C5A46E" emissive="#C5A46E" emissiveIntensity={1.5} />
            </mesh>

            {/* Sidebar UI Box */}
            <mesh position={[-0.75, -0.02, 0]}>
              <planeGeometry args={[0.42, 1.1]} />
              <meshStandardMaterial color="#10131c" emissive="#10131c" emissiveIntensity={0.8} />
            </mesh>

            {/* Code Lines on Screen */}
            {[0.4, 0.3, 0.2, 0.1, 0.0, -0.1, -0.2, -0.3, -0.4].map((y, i) => (
              <group key={i} position={[-0.45, y, 0.001]}>
                <mesh position={[((i * 17) % 5) * 0.05, 0, 0]}>
                  <planeGeometry args={[0.25 + ((i * 7) % 4) * 0.12, 0.025]} />
                  <meshStandardMaterial
                    color={i % 3 === 0 ? "#C5A46E" : i % 2 === 0 ? "#06b6d4" : "#a855f7"}
                    emissive={i % 3 === 0 ? "#C5A46E" : i % 2 === 0 ? "#06b6d4" : "#a855f7"}
                    emissiveIntensity={1.8}
                  />
                </mesh>
              </group>
            ))}

            {/* Analytics Dashboard Visual Card on Right Screen Side */}
            <mesh position={[0.45, 0.15, 0.001]}>
              <planeGeometry args={[0.85, 0.65]} />
              <meshStandardMaterial color="#141824" emissive="#141824" emissiveIntensity={0.5} />
            </mesh>

            {/* Glowing Metric Bars */}
            <mesh position={[0.2, -0.25, 0.002]}>
              <planeGeometry args={[0.1, 0.35]} />
              <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={2} />
            </mesh>
            <mesh position={[0.35, -0.20, 0.002]}>
              <planeGeometry args={[0.1, 0.45]} />
              <meshStandardMaterial color="#C5A46E" emissive="#C5A46E" emissiveIntensity={2} />
            </mesh>
            <mesh position={[0.50, -0.15, 0.002]}>
              <planeGeometry args={[0.1, 0.55]} />
              <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={2} />
            </mesh>
            <mesh position={[0.65, -0.28, 0.002]}>
              <planeGeometry args={[0.1, 0.28]} />
              <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={2} />
            </mesh>
          </group>
        </group>
      </group>
    </Float>
  );
}
