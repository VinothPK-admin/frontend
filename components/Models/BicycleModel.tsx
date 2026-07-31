"use client";

import { useMemo } from "react";
import * as THREE from "three";

interface TubeProps {
  from: [number, number, number];
  to: [number, number, number];
  radius?: number;
  color?: string;
  metalness?: number;
  roughness?: number;
  emissive?: string;
  emissiveIntensity?: number;
}

export function Tube({
  from,
  to,
  radius = 0.03,
  color = "#C5A46E",
  metalness = 0.9,
  roughness = 0.2,
  emissive = "#000000",
  emissiveIntensity = 0,
}: TubeProps) {
  const { position, quaternion, distance } = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const dist = start.distanceTo(end);
    const pos = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

    const dir = new THREE.Vector3().subVectors(end, start).normalize();
    const quat = new THREE.Quaternion();
    quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);

    return { position: pos, quaternion: quat, distance: dist };
  }, [from, to]);

  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[radius, radius, distance, 16]} />
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
      />
    </mesh>
  );
}

interface WheelProps {
  position: [number, number, number];
  rotationZ?: number;
}

export function Wheel({ position, rotationZ = 0 }: WheelProps) {
  const spokeCount = 16;
  const spokeRadius = 0.50;

  const spokes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < spokeCount; i++) {
      const angle = (i * 2 * Math.PI) / spokeCount;
      const zOffset = i % 2 === 0 ? 0.025 : -0.025;
      const targetZ = i % 2 === 0 ? 0.01 : -0.01;
      const toX = spokeRadius * Math.cos(angle);
      const toY = spokeRadius * Math.sin(angle);
      arr.push({
        from: [0, 0, zOffset] as [number, number, number],
        to: [toX, toY, targetZ] as [number, number, number],
      });
    }
    return arr;
  }, [spokeCount, spokeRadius]);

  return (
    <group position={position} rotation={[0, 0, rotationZ]}>
      {/* Outer Rubber Tyre */}
      <mesh>
        <torusGeometry args={[0.55, 0.05, 24, 64]} />
        <meshStandardMaterial color="#161618" roughness={0.85} metalness={0.1} />
      </mesh>

      {/* Tyre Tread Accent Ring */}
      <mesh>
        <torusGeometry args={[0.552, 0.008, 16, 64]} />
        <meshStandardMaterial color="#333336" roughness={0.9} />
      </mesh>

      {/* Metallic Rim Wall */}
      <mesh>
        <torusGeometry args={[0.51, 0.025, 24, 64]} />
        <meshStandardMaterial color="#C5A46E" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* Inner Glowing Rim Line */}
      <mesh>
        <torusGeometry args={[0.49, 0.005, 16, 64]} />
        <meshStandardMaterial color="#C5A46E" emissive="#C5A46E" emissiveIntensity={2} />
      </mesh>

      {/* Center Wheel Hub */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.12, 20]} />
        <meshStandardMaterial color="#222225" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Hub Axle Cap Left & Right */}
      <mesh position={[0, 0, 0.065]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.02, 16]} />
        <meshStandardMaterial color="#C5A46E" metalness={1} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0, -0.065]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.02, 16]} />
        <meshStandardMaterial color="#C5A46E" metalness={1} roughness={0.1} />
      </mesh>

      {/* Disc Brake Rotor */}
      <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.004, 32]} />
        <meshStandardMaterial color="#d0d0d0" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Spokes */}
      {spokes.map((spoke, idx) => (
        <Tube
          key={idx}
          from={spoke.from}
          to={spoke.to}
          radius={0.0035}
          color="#cccccc"
          metalness={0.9}
          roughness={0.1}
        />
      ))}
    </group>
  );
}

export function RealisticBicycle({ wheelRotation = 0 }: { wheelRotation?: number }) {
  return (
    <group position={[0, 0, 0]}>
      {/* --- FRAME TUBES --- */}
      {/* Bottom Bracket Shell */}
      <mesh position={[0, -0.38, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.14, 20]} />
        <meshStandardMaterial color="#111113" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Head Tube */}
      <Tube from={[0.72, 0.65, 0]} to={[0.77, 0.38, 0]} radius={0.045} color="#111113" metalness={0.9} />

      {/* Head Tube Top Cap */}
      <mesh position={[0.72, 0.67, 0]}>
        <cylinderGeometry args={[0.048, 0.048, 0.04, 16]} />
        <meshStandardMaterial color="#C5A46E" metalness={1} roughness={0.1} />
      </mesh>

      {/* Top Tube (Gold Aero) */}
      <Tube from={[0.70, 0.62, 0]} to={[-0.43, 0.53, 0]} radius={0.038} color="#C5A46E" metalness={0.95} roughness={0.1} />

      {/* Down Tube (Black Aero) */}
      <Tube from={[0.75, 0.40, 0]} to={[0, -0.38, 0]} radius={0.048} color="#111113" metalness={0.9} roughness={0.2} />

      {/* Seat Tube (Gold Aero) */}
      <Tube from={[0, -0.38, 0]} to={[-0.45, 0.55, 0]} radius={0.04} color="#C5A46E" metalness={0.95} roughness={0.1} />

      {/* Seat Collar Clamp */}
      <mesh position={[-0.45, 0.57, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.04, 16]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Seatpost */}
      <Tube from={[-0.45, 0.57, 0]} to={[-0.52, 0.85, 0]} radius={0.028} color="#1a1a1d" metalness={0.8} />

      {/* Fork Blades (Left & Right) */}
      <Tube from={[0.76, 0.38, -0.04]} to={[1.1, -0.4, -0.055]} radius={0.025} color="#C5A46E" metalness={0.9} />
      <Tube from={[0.76, 0.38, 0.04]} to={[1.1, -0.4, 0.055]} radius={0.025} color="#C5A46E" metalness={0.9} />

      {/* Chain Stays (Left & Right) */}
      <Tube from={[0, -0.38, -0.04]} to={[-1.1, -0.4, -0.06]} radius={0.022} color="#111113" metalness={0.8} />
      <Tube from={[0, -0.38, 0.04]} to={[-1.1, -0.4, 0.06]} radius={0.022} color="#111113" metalness={0.8} />

      {/* Seat Stays (Left & Right) */}
      <Tube from={[-0.43, 0.50, -0.03]} to={[-1.1, -0.4, -0.055]} radius={0.02} color="#C5A46E" metalness={0.9} />
      <Tube from={[-0.43, 0.50, 0.03]} to={[-1.1, -0.4, 0.055]} radius={0.02} color="#C5A46E" metalness={0.9} />

      {/* --- COCKPIT & HANDLEBARS --- */}
      {/* Stem */}
      <Tube from={[0.71, 0.66, 0]} to={[0.82, 0.74, 0]} radius={0.032} color="#1a1a1d" metalness={0.9} />
      {/* Handlebar Center Bar */}
      <Tube from={[0.82, 0.74, -0.32]} to={[0.82, 0.74, 0.32]} radius={0.022} color="#111113" metalness={0.9} />
      {/* Drop Bars Left & Right */}
      <Tube from={[0.82, 0.74, -0.32]} to={[0.92, 0.58, -0.32]} radius={0.02} color="#1a1a1d" />
      <Tube from={[0.82, 0.74, 0.32]} to={[0.92, 0.58, 0.32]} radius={0.02} color="#1a1a1d" />
      {/* Handlebar Grips */}
      <mesh position={[0.92, 0.58, -0.32]}>
        <sphereGeometry args={[0.028, 16, 16]} />
        <meshStandardMaterial color="#C5A46E" />
      </mesh>
      <mesh position={[0.92, 0.58, 0.32]}>
        <sphereGeometry args={[0.028, 16, 16]} />
        <meshStandardMaterial color="#C5A46E" />
      </mesh>

      {/* --- SADDLE --- */}
      <group position={[-0.52, 0.86, 0]} rotation={[0, 0, 0.08]}>
        {/* Main Cushion */}
        <mesh position={[-0.02, 0, 0]}>
          <boxGeometry args={[0.36, 0.045, 0.15]} />
          <meshStandardMaterial color="#141416" roughness={0.8} />
        </mesh>
        {/* Saddle Nose */}
        <mesh position={[0.16, -0.005, 0]} rotation={[0, 0, -Math.PI / 2 - 0.2]}>
          <coneGeometry args={[0.065, 0.18, 16]} />
          <meshStandardMaterial color="#141416" roughness={0.8} />
        </mesh>
        {/* Gold Underrail Accent */}
        <mesh position={[0, -0.03, 0]}>
          <boxGeometry args={[0.22, 0.012, 0.08]} />
          <meshStandardMaterial color="#C5A46E" metalness={1} roughness={0.1} />
        </mesh>
      </group>

      {/* --- DRIVETRAIN --- */}
      {/* Front Chainring */}
      <mesh position={[0, -0.38, 0.045]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.008, 32]} />
        <meshStandardMaterial color="#C5A46E" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* Crank Arms */}
      <Tube from={[0, -0.38, 0.065]} to={[0, -0.60, 0.075]} radius={0.022} color="#C5A46E" metalness={0.95} />
      <Tube from={[0, -0.38, -0.065]} to={[0, -0.16, -0.075]} radius={0.022} color="#C5A46E" metalness={0.95} />

      {/* Pedals */}
      <mesh position={[0, -0.60, 0.11]}>
        <boxGeometry args={[0.11, 0.028, 0.08]} />
        <meshStandardMaterial color="#222" roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.16, -0.11]}>
        <boxGeometry args={[0.11, 0.028, 0.08]} />
        <meshStandardMaterial color="#222" roughness={0.7} />
      </mesh>

      {/* Rear Cassette Gears */}
      <mesh position={[-1.1, -0.4, 0.045]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.04, 0.025, 24]} />
        <meshStandardMaterial color="#d0d0d0" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Drive Chain */}
      <Tube from={[0, -0.22, 0.045]} to={[-1.1, -0.32, 0.045]} radius={0.006} color="#dddddd" metalness={0.9} />
      <Tube from={[0, -0.54, 0.045]} to={[-1.1, -0.48, 0.045]} radius={0.006} color="#dddddd" metalness={0.9} />

      {/* Front Light Emblem */}
      <mesh position={[0.78, 0.60, 0]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.02, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={3} />
      </mesh>

      {/* --- WHEELS --- */}
      <Wheel position={[1.1, -0.4, 0]} rotationZ={wheelRotation} />
      <Wheel position={[-1.1, -0.4, 0]} rotationZ={wheelRotation} />
    </group>
  );
}
