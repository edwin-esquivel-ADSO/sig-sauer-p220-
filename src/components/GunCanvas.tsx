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

// Camera controller with responsive framing:
// - On desktop: shifts gun to the RIGHT side (leaving left side for text cards)
// - On mobile: shifts gun upward to the TOP half (leaving bottom half for text cards)
const CameraController: React.FC<{
  targetPos?: [number, number, number];
  targetLookAt?: [number, number, number];
  isWorkbenchMode: boolean;
}> = ({ targetPos = [0, 0.4, 5.2], targetLookAt = [0, 0, 0], isWorkbenchMode }) => {
  const { camera, size } = useThree();
  const currentPos = useRef(new THREE.Vector3(...targetPos));
  const currentTarget = useRef(new THREE.Vector3(...targetLookAt));

  // Dynamic FOV tuning
  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      const isMobile = size.width < 768;
      const isTablet = size.width >= 768 && size.width < 1024;
      camera.fov = isMobile ? 58 : isTablet ? 48 : 44;
      camera.updateProjectionMatrix();
    }
  }, [camera, size.width]);

  useFrame((_, delta) => {
    if (!isWorkbenchMode) {
      const isMobile = size.width < 768;
      const isDesktop = size.width >= 1024;

      // On desktop, shift camera left so the gun is on the right
      const offsetX = isDesktop ? -1.35 : 0;
      // On mobile, elevate camera so the gun is in the top 45% of screen
      const offsetY = isMobile ? -0.85 : 0;
      const zoomAdjust = isMobile ? 1.15 : 1.0;

      const destX = (targetPos[0] + offsetX) * zoomAdjust;
      const destY = targetPos[1] + offsetY;
      const destZ = targetPos[2] * zoomAdjust;

      currentPos.current.x = THREE.MathUtils.lerp(currentPos.current.x, destX, delta * 3.5);
      currentPos.current.y = THREE.MathUtils.lerp(currentPos.current.y, destY, delta * 3.5);
      currentPos.current.z = THREE.MathUtils.lerp(currentPos.current.z, destZ, delta * 3.5);

      const lookTargetX = targetLookAt[0] + offsetX;
      const lookTargetY = targetLookAt[1] + offsetY;
      currentTarget.current.x = THREE.MathUtils.lerp(currentTarget.current.x, lookTargetX, delta * 3.5);
      currentTarget.current.y = THREE.MathUtils.lerp(currentTarget.current.y, lookTargetY, delta * 3.5);
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
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.95,
        }}
        camera={{ position: cameraPos, fov: 45, near: 0.1, far: 50 }}
      >
        {/* Light theme background */}
        <color attach="background" args={['#f8fafc']} />

        {/* Balanced Studio Lighting that preserves true deep black without specular blowout */}
        <ambientLight intensity={0.65} />
        <directionalLight
          position={[6, 8, 7]}
          intensity={1.4}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}
        />
        {/* Soft fill light */}
        <directionalLight position={[-6, 4, 3]} intensity={0.7} color="#ffffff" />
        {/* Subtle rim light for gun contours */}
        <directionalLight position={[0, -4, -5]} intensity={0.5} color="#e2e8f0" />
        <pointLight position={[3, 2, 3]} intensity={0.5} color="#f59e0b" />
        <pointLight position={[-3, 2, 2]} intensity={0.4} color="#0284c7" />

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
            minDistance={2.0}
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
            speed={explosionFactor > 0.1 ? 0 : 1.1}
            rotationIntensity={explosionFactor > 0.1 ? 0 : 0.12}
            floatIntensity={explosionFactor > 0.1 ? 0 : 0.2}
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

        {/* Floor Contact Shadows for tactile realism on light floor */}
        <ContactShadows
          position={[0, -2.3, 0]}
          opacity={0.35}
          scale={10}
          blur={2.4}
          far={4.5}
          color="#1e293b"
        />
      </Canvas>
    </div>
  );
};
