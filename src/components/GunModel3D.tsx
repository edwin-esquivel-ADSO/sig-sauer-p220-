import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GunModel3DProps {
  explosionFactor: number; // 0 (assembled) to 1 (fully exploded)
  highlightPart?: string;
  isXRay?: boolean;
  isFiring?: boolean;
  isDecocked?: boolean;
  onPartClick?: (partId: string) => void;
}

interface MaterialPalette {
  nitron: THREE.Material;
  nitronFrame: THREE.Material;
  steel: THREE.Material;
  phosphated: THREE.Material;
  grips: THREE.Material;
  brass: THREE.Material;
  copper: THREE.Material;
  tritium: THREE.Material;
  accentHighlight: THREE.Material;
}

export const GunModel3D: React.FC<GunModel3DProps> = ({
  explosionFactor,
  highlightPart = 'all',
  isXRay = false,
  isFiring = false,
  isDecocked = false,
  onPartClick,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const slideGroupRef = useRef<THREE.Group>(null);
  const barrelGroupRef = useRef<THREE.Group>(null);
  const recoilGroupRef = useRef<THREE.Group>(null);
  const frameGroupRef = useRef<THREE.Group>(null);
  const leftGripRef = useRef<THREE.Group>(null);
  const rightGripRef = useRef<THREE.Group>(null);
  const magGroupRef = useRef<THREE.Group>(null);
  const hammerRef = useRef<THREE.Group>(null);
  const triggerRef = useRef<THREE.Group>(null);

  // Smooth lerped explosion factor for butter-smooth 60fps animations
  const smoothExplosion = useRef(0);
  const fireAnim = useRef(0);

  // Strictly typed PBR & X-Ray Materials
  const materials: MaterialPalette = useMemo(() => {
    if (isXRay) {
      const xrayMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        wireframe: true,
        transparent: true,
        opacity: 0.45,
        emissive: 0x0891b2,
        emissiveIntensity: 0.3,
      });

      const xraySteel = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.6,
        emissive: 0x0284c7,
        emissiveIntensity: 0.4,
      });

      return {
        nitron: xrayMat,
        nitronFrame: xrayMat,
        steel: xraySteel,
        phosphated: xraySteel,
        grips: xrayMat,
        brass: new THREE.MeshStandardMaterial({
          color: 0xfbbf24,
          metalness: 0.9,
          roughness: 0.2,
        }),
        copper: new THREE.MeshStandardMaterial({
          color: 0xd97706,
          metalness: 0.85,
          roughness: 0.25,
        }),
        tritium: new THREE.MeshBasicMaterial({ color: 0x22c55e }),
        accentHighlight: new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          wireframe: false,
          transparent: true,
          opacity: 0.7,
          emissive: 0xd97706,
          emissiveIntensity: 0.5,
        }),
      };
    }

    return {
      nitron: new THREE.MeshStandardMaterial({
        color: 0x181a1e,
        metalness: 0.85,
        roughness: 0.38,
      }),
      nitronFrame: new THREE.MeshStandardMaterial({
        color: 0x141518,
        metalness: 0.75,
        roughness: 0.45,
      }),
      steel: new THREE.MeshStandardMaterial({
        color: 0xd6d9e0,
        metalness: 0.95,
        roughness: 0.22,
      }),
      phosphated: new THREE.MeshStandardMaterial({
        color: 0x2b2e35,
        metalness: 0.6,
        roughness: 0.65,
      }),
      grips: new THREE.MeshStandardMaterial({
        color: 0x151619,
        metalness: 0.15,
        roughness: 0.78,
      }),
      brass: new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.92,
        roughness: 0.25,
      }),
      copper: new THREE.MeshStandardMaterial({
        color: 0xbf5700,
        metalness: 0.88,
        roughness: 0.28,
      }),
      tritium: new THREE.MeshBasicMaterial({ color: 0x22c55e }),
      accentHighlight: new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.5,
        roughness: 0.3,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.4,
      }),
    };
  }, [isXRay]);

  // Animation frame loop for smooth spatial displacement & mechanical action
  useFrame((_, delta) => {
    // Lerp explosion displacement smoothly
    smoothExplosion.current = THREE.MathUtils.lerp(
      smoothExplosion.current,
      explosionFactor,
      delta * 8
    );
    const e = smoothExplosion.current;

    // Firing recoil animation
    if (isFiring) {
      fireAnim.current = Math.min(1, fireAnim.current + delta * 12);
    } else {
      fireAnim.current = Math.max(0, fireAnim.current - delta * 10);
    }
    const recoilKick = Math.sin(fireAnim.current * Math.PI) * 0.45;

    // 1. SLIDE MOVEMENT (+Y up, -Z back)
    if (slideGroupRef.current) {
      slideGroupRef.current.position.y = 0.5 * e;
      slideGroupRef.current.position.z = -1.2 * e - recoilKick;
      slideGroupRef.current.position.x = 0;
    }

    // 2. BARREL MOVEMENT (+Y up, +Z forward, dropping tilt)
    if (barrelGroupRef.current) {
      barrelGroupRef.current.position.y = 0.9 * e - (recoilKick > 0.05 ? 0.08 : 0);
      barrelGroupRef.current.position.z = 1.0 * e - recoilKick * 0.3;
      barrelGroupRef.current.rotation.x = e * 0.15 - (recoilKick > 0.05 ? 0.1 : 0);
    }

    // 3. RECOIL SPRING & GUIDE ROD (-Y down, +Z forward)
    if (recoilGroupRef.current) {
      recoilGroupRef.current.position.y = -0.35 * e;
      recoilGroupRef.current.position.z = 1.6 * e;
    }

    // 4. GRIP PANELS (+X right, -X left)
    if (leftGripRef.current) {
      leftGripRef.current.position.x = -0.6 * e;
    }
    if (rightGripRef.current) {
      rightGripRef.current.position.x = 0.6 * e;
    }

    // 5. MAGAZINE (-Y downwards)
    if (magGroupRef.current) {
      magGroupRef.current.position.y = -2.2 * e;
      magGroupRef.current.position.z = -0.3 * e;
    }

    // 6. HAMMER COCK / DECOCK ROTATION
    if (hammerRef.current) {
      const targetHammerRot = isDecocked ? 0 : 0.65; // Cocked or Decocked
      hammerRef.current.rotation.x = THREE.MathUtils.lerp(
        hammerRef.current.rotation.x,
        targetHammerRot,
        delta * 14
      );
    }

    // 7. TRIGGER PULL
    if (triggerRef.current) {
      const triggerRot = isFiring ? -0.35 : 0;
      triggerRef.current.rotation.x = THREE.MathUtils.lerp(
        triggerRef.current.rotation.x,
        triggerRot,
        delta * 16
      );
    }
  });

  const isSlideHighlighted = highlightPart === 'slide' || highlightPart === 'all';
  const isBarrelHighlighted = highlightPart === 'barrel_spring' || highlightPart === 'barrel' || highlightPart === 'all';
  const isFrameHighlighted = highlightPart === 'frame_controls' || highlightPart === 'frame' || highlightPart === 'all';
  const isMagHighlighted = highlightPart === 'mag_ammo' || highlightPart === 'magazine' || highlightPart === 'all';

  return (
    <group ref={groupRef} dispose={null}>
      {/* ================================================================= */}
      {/* 1. SLIDE ASSEMBLY (CORREDERA NITRON)                             */}
      {/* ================================================================= */}
      <group
        ref={slideGroupRef}
        onClick={(e) => {
          e.stopPropagation();
          onPartClick?.('slide');
        }}
      >
        {/* Main Slide Body */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.56, 0.62, 3.8]} />
          <primitive object={isSlideHighlighted && highlightPart === 'slide' ? materials.accentHighlight : materials.nitron} />
        </mesh>

        {/* Upper Slide Chamfer / Bevel Top Profile */}
        <mesh position={[0, 0.77, 0]} castShadow>
          <boxGeometry args={[0.46, 0.1, 3.75]} />
          <primitive object={materials.nitron} />
        </mesh>

        {/* Stepped Front Dustcover Chin */}
        <mesh position={[0, 0.28, 1.4]} castShadow>
          <boxGeometry args={[0.55, 0.25, 0.9]} />
          <primitive object={materials.nitron} />
        </mesh>

        {/* Ejection Port Cutout (Chamber Window on top-right) */}
        <mesh position={[0.22, 0.58, 0.15]}>
          <boxGeometry args={[0.18, 0.38, 0.95]} />
          <primitive object={materials.steel} />
        </mesh>

        {/* Rear Cocking Serrations (Left & Right Gripping Grooves) */}
        {[-1.3, -1.4, -1.5, -1.6].map((z, idx) => (
          <React.Fragment key={`serration-${idx}`}>
            <mesh position={[-0.29, 0.48, z]}>
              <boxGeometry args={[0.02, 0.45, 0.04]} />
              <primitive object={materials.phosphated} />
            </mesh>
            <mesh position={[0.29, 0.48, z]}>
              <boxGeometry args={[0.02, 0.45, 0.04]} />
              <primitive object={materials.phosphated} />
            </mesh>
          </React.Fragment>
        ))}

        {/* Front Sight Post Dovetail */}
        <mesh position={[0, 0.86, 1.7]} castShadow>
          <boxGeometry args={[0.08, 0.14, 0.18]} />
          <primitive object={materials.nitron} />
        </mesh>
        {/* Front Night Sight Tritium Green Dot */}
        <mesh position={[0, 0.87, 1.62]}>
          <sphereGeometry args={[0.03, 12, 12]} />
          <primitive object={materials.tritium} />
        </mesh>

        {/* Rear Combat Sight Dovetail */}
        <mesh position={[0, 0.86, -1.72]} castShadow>
          <boxGeometry args={[0.34, 0.16, 0.2]} />
          <primitive object={materials.nitron} />
        </mesh>
        {/* Rear Night Sight Tritium Dual Dots */}
        <mesh position={[-0.1, 0.88, -1.64]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <primitive object={materials.tritium} />
        </mesh>
        <mesh position={[0.1, 0.88, -1.64]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <primitive object={materials.tritium} />
        </mesh>

        {/* External Heavy-Duty Extractor Claw */}
        <mesh position={[0.29, 0.48, -0.45]}>
          <boxGeometry args={[0.03, 0.12, 0.42]} />
          <primitive object={materials.steel} />
        </mesh>
      </group>

      {/* ================================================================= */}
      {/* 2. BARREL ASSEMBLY (CAÑÓN 4.4" & BLOQUE DE RECÁMARA .45 ACP)      */}
      {/* ================================================================= */}
      <group
        ref={barrelGroupRef}
        onClick={(e) => {
          e.stopPropagation();
          onPartClick?.('barrel');
        }}
      >
        {/* Cylindrical Barrel */}
        <mesh position={[0, 0.42, 0.95]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 2.3, 24]} />
          <primitive object={isBarrelHighlighted && highlightPart === 'barrel' ? materials.accentHighlight : materials.steel} />
        </mesh>

        {/* Barrel Muzzle Crown Bore (Hollow Interior) */}
        <mesh position={[0, 0.42, 2.11]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.05, 18]} />
          <primitive object={materials.phosphated} />
        </mesh>

        {/* Squared Chamber Block (Browning-Petter-SIG Rectangular Hood) */}
        <mesh position={[0, 0.48, 0.12]} castShadow>
          <boxGeometry args={[0.48, 0.52, 0.88]} />
          <primitive object={materials.steel} />
        </mesh>

        {/* Lower Camming Lug (No swinging link - solid cam track) */}
        <mesh position={[0, 0.14, 0.05]} castShadow>
          <boxGeometry args={[0.26, 0.28, 0.55]} />
          <primitive object={materials.phosphated} />
        </mesh>

        {/* Polished Feed Ramp */}
        <mesh position={[0, 0.22, -0.32]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.24, 0.18, 0.24]} />
          <primitive object={materials.steel} />
        </mesh>
      </group>

      {/* ================================================================= */}
      {/* 3. RECOIL ASSEMBLY (MUELLE TRENZADO Y VÁSTAGO GUÍA)              */}
      {/* ================================================================= */}
      <group
        ref={recoilGroupRef}
        onClick={(e) => {
          e.stopPropagation();
          onPartClick?.('recoil');
        }}
      >
        {/* Steel Guide Rod */}
        <mesh position={[0, 0.12, 0.75]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 2.1, 16]} />
          <primitive object={materials.steel} />
        </mesh>

        {/* Braided Wire Recoil Spring (Multi-strand coil simulation) */}
        <mesh position={[0, 0.12, 0.75]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 1.95, 16, 1, true]} />
          <meshStandardMaterial
            color={0x2d323b}
            roughness={0.4}
            metalness={0.9}
            wireframe={true}
          />
        </mesh>

        {/* SIG Signature Green Color Band at Spring Tip */}
        <mesh position={[0, 0.12, 1.7]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.125, 0.125, 0.15, 16]} />
          <meshStandardMaterial color={0x16a34a} roughness={0.5} />
        </mesh>
      </group>

      {/* ================================================================= */}
      {/* 4. FRAME & CONTROLS ASSEMBLY (ARMAZÓN 7075-T6 & MANDOS)          */}
      {/* ================================================================= */}
      <group
        ref={frameGroupRef}
        onClick={(e) => {
          e.stopPropagation();
          onPartClick?.('frame');
        }}
      >
        {/* Forward Dustcover / Frame Rails */}
        <mesh position={[0, 0.08, 0.85]} castShadow receiveShadow>
          <boxGeometry args={[0.54, 0.38, 2.05]} />
          <primitive object={isFrameHighlighted && highlightPart === 'frame' ? materials.accentHighlight : materials.nitronFrame} />
        </mesh>

        {/* Tactical Picatinny Accessory Rail Under Dustcover */}
        <mesh position={[0, -0.13, 0.95]}>
          <boxGeometry args={[0.42, 0.06, 1.5]} />
          <primitive object={materials.nitronFrame} />
        </mesh>

        {/* Central Frame Bridge & Locking Insert Area */}
        <mesh position={[0, -0.05, -0.3]} castShadow>
          <boxGeometry args={[0.54, 0.55, 1.1]} />
          <primitive object={materials.nitronFrame} />
        </mesh>

        {/* Ergonomic Trigger Guard with Combat Recurve */}
        <mesh position={[0, -0.44, 0.35]}>
          <torusGeometry args={[0.42, 0.06, 12, 28, Math.PI * 0.95]} />
          <primitive object={materials.nitronFrame} />
        </mesh>

        {/* Grip Frame Column (Angled 18 degrees) */}
        <mesh position={[0, -1.15, -0.55]} rotation={[0.22, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.5, 1.9, 0.95]} />
          <primitive object={materials.nitronFrame} />
        </mesh>

        {/* Extended Beavertail Profile at Grip Top */}
        <mesh position={[0, 0.15, -1.35]} rotation={[-0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.44, 0.22, 0.55]} />
          <primitive object={materials.nitronFrame} />
        </mesh>

        {/* DA/SA Curved Combat Trigger */}
        <group ref={triggerRef} position={[0, -0.32, 0.32]}>
          <mesh rotation={[0.3, 0, 0]} castShadow>
            <boxGeometry args={[0.12, 0.42, 0.14]} />
            <primitive object={materials.steel} />
          </mesh>
        </group>

        {/* External Skeletonized Combat Hammer */}
        <group ref={hammerRef} position={[0, 0.35, -1.55]}>
          <mesh rotation={[-0.2, 0, 0]} castShadow>
            <boxGeometry args={[0.14, 0.52, 0.25]} />
            <primitive object={materials.steel} />
          </mesh>
          {/* Hammer Serrated Thumb Spur */}
          <mesh position={[0, 0.26, -0.08]} rotation={[-0.6, 0, 0]}>
            <boxGeometry args={[0.16, 0.16, 0.16]} />
            <primitive object={materials.phosphated} />
          </mesh>
        </group>

        {/* Decocking Lever (Entspannhebel - Left Frame Thumb Paddle) */}
        <mesh
          position={[-0.29, -0.02, -0.45]}
          rotation={[0.1, 0, 0]}
          castShadow
          onClick={(e) => {
            e.stopPropagation();
            onPartClick?.('decocker');
          }}
        >
          <boxGeometry args={[0.06, 0.22, 0.36]} />
          <primitive object={materials.phosphated} />
        </mesh>

        {/* Slide Catch / Release Lever */}
        <mesh position={[-0.29, 0.16, -0.8]}>
          <boxGeometry args={[0.05, 0.12, 0.32]} />
          <primitive object={materials.phosphated} />
        </mesh>

        {/* Takedown Lever (Palanca de Despiece) */}
        <mesh position={[-0.29, 0.08, 0.38]}>
          <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
          <primitive object={materials.phosphated} />
        </mesh>

        {/* Push-Button Magazine Release */}
        <mesh position={[-0.27, -0.48, -0.32]}>
          <boxGeometry args={[0.08, 0.14, 0.14]} />
          <primitive object={materials.phosphated} />
        </mesh>
      </group>

      {/* ================================================================= */}
      {/* 5. GRIP PANELS (CACHAS G10 / TEXTURADAS CON MEDALLÓN)             */}
      {/* ================================================================= */}
      <group
        ref={leftGripRef}
        position={[-0.26, -1.15, -0.55]}
        rotation={[0.22, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onPartClick?.('frame');
        }}
      >
        {/* Left Grip Panel */}
        <mesh castShadow>
          <boxGeometry args={[0.08, 1.75, 0.88]} />
          <primitive object={materials.grips} />
        </mesh>
        {/* SIG Sauer Emblem Medallion */}
        <mesh position={[-0.045, 0.1, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.02, 16]} />
          <primitive object={materials.steel} />
        </mesh>
      </group>

      <group
        ref={rightGripRef}
        position={[0.26, -1.15, -0.55]}
        rotation={[0.22, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onPartClick?.('frame');
        }}
      >
        {/* Right Grip Panel */}
        <mesh castShadow>
          <boxGeometry args={[0.08, 1.75, 0.88]} />
          <primitive object={materials.grips} />
        </mesh>
        {/* SIG Sauer Emblem Medallion */}
        <mesh position={[0.045, 0.1, 0]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.02, 16]} />
          <primitive object={materials.steel} />
        </mesh>
      </group>

      {/* ================================================================= */}
      {/* 6. MAGAZINE & AMMUNITION (CARGADOR 8 RONDAS .45 ACP)              */}
      {/* ================================================================= */}
      <group
        ref={magGroupRef}
        position={[0, -1.2, -0.55]}
        rotation={[0.22, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onPartClick?.('magazine');
        }}
      >
        {/* Steel Magazine Body */}
        <mesh castShadow>
          <boxGeometry args={[0.38, 1.82, 0.78]} />
          <primitive object={isMagHighlighted && highlightPart === 'mag_ammo' ? materials.accentHighlight : materials.phosphated} />
        </mesh>

        {/* Polymer Magazine Baseplate / Floorplate */}
        <mesh position={[0, -0.96, 0.02]} castShadow>
          <boxGeometry args={[0.48, 0.14, 0.95]} />
          <primitive object={materials.grips} />
        </mesh>

        {/* Witness Holes on Magazine Body */}
        {[-0.5, -0.2, 0.1, 0.4].map((y, idx) => (
          <mesh key={`hole-${idx}`} position={[0.195, y, 0]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <primitive object={materials.steel} />
          </mesh>
        ))}

        {/* Visible .45 ACP Top Cartridge Ready for Feed */}
        <group position={[0, 0.94, 0.02]}>
          {/* Brass Casing */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.52, 16]} />
            <primitive object={materials.brass} />
          </mesh>
          {/* Copper FMJ Bullet Nose */}
          <mesh position={[0, 0, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
            <sphereGeometry args={[0.115, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <primitive object={materials.copper} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
