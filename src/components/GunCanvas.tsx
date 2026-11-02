import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';
import { GunModel3D } from './GunModel3D';

interface GunCanvasProps {
  explosionFactor: number;
  highlightPart?: string;
  isXRay?: boolean;
  isFiring?: boolean;
  isDecocked?: boolean;
  isWorkbenchMode?: boolean;
  cameraPos?: [number, number, number];
  cameraTarget?: [number, number, number];
  onPartClick?: (partId: string) => void;
}

// Camera controller that smoothly transitions during scrollytelling
const CameraController: React.FC<{
  targetPos?: [number, number, number];
  targetLookAt?: [number, number, number];
  isWorkbenchMode: boolean;
}> = ({ targetPos = [0, 0.4, 5.2], targetLookAt = [0, 0, 0], isWorkbenchMode }) => {
  const { camera, size } = useThree();
  const currentPos = useRef(new THREE.Vector3(...targetPos));
  const currentTarget = useRef(new THREE.Vector3(...targetLookAt));

  // Auto-adjust FOV for narrow mobile screens so the pistol fits comfortably
  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      const isMobile = size.width < 768;
      camera.fov = isMobile ? 55 : 42;
      camera.updateProjectionMatrix();
    }
  }, [camera, size.width]);

  useFrame((_, delta) => {
    if (!isWorkbenchMode) {
      // In scrollytelling mode, lerp camera smoothly
      const isMobile = size.width < 768;
      const zoomAdjust = isMobile ? 1.35 : 1.0;

      const destX = targetPos[0] * zoomAdjust;
      const destY = targetPos[1];
      const destZ = targetPos[2] * zoomAdjust;

      currentPos.current.x = THREE.MathUtils.lerp(currentPos.current.x, destX, delta * 3.5);
      currentPos.current.y = THREE.MathUtils.lerp(currentPos.current.y, destY, delta * 3.5);
      currentPos.current.z = THREE.MathUtils.lerp(currentPos.current.z, destZ, delta * 3.5);

      currentTarget.current.x = THREE.MathUtils.lerp(currentTarget.current.x, targetLookAt[0], delta * 3.5);
      currentTarget.current.y = THREE.MathUtils.lerp(currentTarget.current.y, targetLookAt[1], delta * 3.5);
      currentTarget.current.z = THREE.MathUtils.lerp(currentTarget.current.z, targetLookAt[2], delta * 3.5);

      camera.position.copy(currentPos.current);
      camera.lookAt(currentTarget.current);
    }
  });

  return null;
};

export const GunCanvas: React.FC<GunCanvasProps> = ({
  explosionFactor,
  highlightPart = 'all',
  isXRay = false,
  isFiring = false,
  isDecocked = false,
  isWorkbenchMode = false,
  cameraPos = [0, 0.4, 5.2],
  cameraTarget = [0, 0, 0],
  onPartClick,
}) => {
  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true,
        }}
        camera={{ position: cameraPos, fov: 45, near: 0.1, far: 50 }}
      >
        <color attach="background" args={['#07090e']} />

        {/* Ambient & Studio 3-Point Tactical Lighting */}
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[6, 8, 6]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[-6, 4, -4]} intensity={0.9} color="#38bdf8" />
        <pointLight position={[0, -2, 2]} intensity={0.7} color="#f59e0b" />
        <pointLight position={[0, 4, -2]} intensity={0.5} color="#e2e8f0" />

        {/* Camera Transition Control */}
        <CameraController
          targetPos={cameraPos}
          targetLookAt={cameraTarget}
          isWorkbenchMode={isWorkbenchMode}
        />

        {/* Free OrbitControls only active in interactive Workbench mode */}
        {isWorkbenchMode && (
          <OrbitControls
            enableDamping
            dampingFactor={0.08}
            minDistance={2.2}
            maxDistance={8.5}
            maxPolarAngle={Math.PI / 1.7}
            minPolarAngle={Math.PI / 6}
          />
        )}

        {/* 3D Model with subtle tactical floating idle animation when assembled */}
        {isWorkbenchMode ? (
          <GunModel3D
            explosionFactor={explosionFactor}
            highlightPart={highlightPart}
            isXRay={isXRay}
            isFiring={isFiring}
            isDecocked={isDecocked}
            onPartClick={onPartClick}
          />
        ) : (
          <Float
            speed={explosionFactor > 0.1 ? 0 : 1.2}
            rotationIntensity={explosionFactor > 0.1 ? 0 : 0.15}
            floatIntensity={explosionFactor > 0.1 ? 0 : 0.25}
          >
            <GunModel3D
              explosionFactor={explosionFactor}
              highlightPart={highlightPart}
              isXRay={isXRay}
              isFiring={isFiring}
              isDecocked={isDecocked}
              onPartClick={onPartClick}
            />
          </Float>
        )}

        {/* Floor Contact Shadows for tactile realism */}
        <ContactShadows
          position={[0, -2.4, 0]}
          opacity={0.65}
          scale={10}
          blur={2.2}
          far={4.5}
          color="#000000"
        />
      </Canvas>
    </div>
  );
};
