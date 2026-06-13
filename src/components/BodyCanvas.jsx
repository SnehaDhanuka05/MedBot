import { Suspense, useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Center, Bounds } from '@react-three/drei';
import { useAppContext } from '../context/AppContext';
import * as THREE from 'three';

function FallbackCapsule() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.35, 1.2, 16, 32]} />
        <meshStandardMaterial
          color="#8b5cf6"
          transparent
          opacity={0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.15, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color="#a78bfa"
          transparent
          opacity={0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      {/* Wireframe overlay */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.36, 1.22, 16, 32]} />
        <meshBasicMaterial color="#c4b5fd" wireframe transparent opacity={0.3} />
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <sphereGeometry args={[0.31, 32, 32]} />
        <meshBasicMaterial color="#c4b5fd" wireframe transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function AutoScaledModel({ gender, onModelInfo }) {
  const modelPath = gender === 'female' ? '/female.glb' : '/male.glb';
  const groupRef = useRef();
  const { viewport, camera } = useThree();

  let model = null;
  let loadError = false;

  try {
    const gltf = useGLTF(modelPath);
    model = gltf.scene;
  } catch (e) {
    loadError = true;
  }

  const clonedScene = useMemo(() => {
    if (model) {
      const clone = model.clone(true);
      clone.traverse((child) => {
        if (child.isMesh) {
          child.material = child.material.clone();
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      return clone;
    }
    return null;
  }, [model]);

  // Compute bounding box and auto-scale to fill ~70% of viewport height
  const { scale, yOffset, modelHeight } = useMemo(() => {
    if (!clonedScene) return { scale: 1, yOffset: 0, modelHeight: 2 };

    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const rawHeight = size.y;
    const rawWidth = size.x;

    // Target: fill roughly 75% of visible viewport height
    // viewport.height is the height in world units visible at z=0
    const targetHeight = viewport.height * 0.75;
    const targetWidth = viewport.width * 0.4;

    // Scale to fit both height and width constraints
    const scaleByHeight = targetHeight / rawHeight;
    const scaleByWidth = targetWidth / rawWidth;
    const finalScale = Math.min(scaleByHeight, scaleByWidth);

    // Offset so feet are near the bottom of view
    const scaledHeight = rawHeight * finalScale;
    const scaledBottom = (box.min.y * finalScale);
    const yOff = -(viewport.height * 0.5) - scaledBottom + (viewport.height * 0.08);

    return {
      scale: finalScale,
      yOffset: yOff,
      modelHeight: scaledHeight,
    };
  }, [clonedScene, viewport.height, viewport.width]);

  // Send model measurements back to parent for hitbox positioning
  useEffect(() => {
    if (clonedScene && onModelInfo) {
      const box = new THREE.Box3().setFromObject(clonedScene);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);

      onModelInfo({
        scale,
        yOffset,
        rawHeight: size.y,
        rawCenter: center,
        rawMin: box.min.clone(),
        rawMax: box.max.clone(),
      });
    }
  }, [clonedScene, scale, yOffset, onModelInfo]);

  if (loadError || !clonedScene) {
    return <FallbackCapsule />;
  }

  return (
    <primitive
      ref={groupRef}
      object={clonedScene}
      scale={scale}
      position={[0, yOffset, 0]}
    />
  );
}

function BodyHitbox({ position, size, bodyPart, label }) {
  const { selectedBodyPart, setSelectedBodyPart } = useAppContext();
  const meshRef = useRef();
  const isSelected = selectedBodyPart === bodyPart;

  useFrame((state) => {
    if (meshRef.current) {
      if (isSelected) {
        meshRef.current.material.opacity = 0.25 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      } else {
        meshRef.current.material.opacity = 0;
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedBodyPart(bodyPart);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        if (meshRef.current && !isSelected) {
          meshRef.current.material.opacity = 0.12;
        }
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'default';
        if (meshRef.current && !isSelected) {
          meshRef.current.material.opacity = 0;
        }
      }}
    >
      <boxGeometry args={size} />
      <meshBasicMaterial
        color={isSelected ? '#34d399' : '#8b5cf6'}
        transparent
        opacity={0}
        depthWrite={false}
      />
      {isSelected && (
        <Html center distanceFactor={8} position={[size[0] * 0.8, 0, 0]}>
          <div
            style={{
              background: 'rgba(139, 92, 246, 0.9)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: '600',
              fontFamily: 'Inter, sans-serif',
              whiteSpace: 'nowrap',
              border: '1px solid rgba(255,255,255,0.2)',
              pointerEvents: 'none',
              boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
            }}
          >
            {label}
          </div>
        </Html>
      )}
    </mesh>
  );
}

function LoadingFallback() {
  return (
    <Html center>
      <div
        style={{
          color: 'white',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            border: '3px solid rgba(255,255,255,0.2)',
            borderTopColor: '#8b5cf6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <span style={{ opacity: 0.8 }}>Loading Model...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </Html>
  );
}

function SceneContent() {
  const { gender } = useAppContext();
  const { viewport } = useThree();
  const [modelInfo, setModelInfo] = useState(null);

  const handleModelInfo = useCallback((info) => {
    setModelInfo(info);
  }, []);

  // Compute hitbox positions based on actual model dimensions
  const hitboxes = useMemo(() => {
    if (!modelInfo) {
      // Default positions (before model loads)
      return {
        head:    { position: [0, 1.35, 0.1],  size: [0.55, 0.5, 0.55] },
        chest:   { position: [0, 0.45, 0.1],  size: [0.75, 0.65, 0.5] },
        stomach: { position: [0, -0.2, 0.1],  size: [0.65, 0.55, 0.45] },
      };
    }

    const { scale, yOffset, rawMin, rawMax, rawCenter } = modelInfo;
    const rawH = rawMax.y - rawMin.y;

    // Calculate key anatomical positions in world space:
    // Head: ~88-100% of model height from bottom
    // Chest: ~65-78% of model height from bottom
    // Stomach: ~52-65% of model height from bottom
    const headY    = rawMin.y * scale + rawH * scale * 0.94 + yOffset;
    const chestY   = rawMin.y * scale + rawH * scale * 0.72 + yOffset;
    const stomachY = rawMin.y * scale + rawH * scale * 0.58 + yOffset;

    const bodyWidth = (rawMax.x - rawMin.x) * scale;
    const bodyDepth = (rawMax.z - rawMin.z) * scale;

    return {
      head: {
        position: [0, headY, bodyDepth * 0.15],
        size: [bodyWidth * 0.6, rawH * scale * 0.12, bodyDepth * 0.7],
      },
      chest: {
        position: [0, chestY, bodyDepth * 0.15],
        size: [bodyWidth * 0.85, rawH * scale * 0.13, bodyDepth * 0.65],
      },
      stomach: {
        position: [0, stomachY, bodyDepth * 0.15],
        size: [bodyWidth * 0.75, rawH * scale * 0.12, bodyDepth * 0.6],
      },
    };
  }, [modelInfo]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-3, 3, -3]} intensity={0.4} />
      <pointLight position={[0, 3, 0]} intensity={0.5} color="#a78bfa" />

      <Suspense fallback={<LoadingFallback />}>
        <AutoScaledModel gender={gender} onModelInfo={handleModelInfo} />
      </Suspense>

      {/* Invisible hitboxes over body regions */}
      <BodyHitbox
        position={hitboxes.head.position}
        size={hitboxes.head.size}
        bodyPart="head"
        label="Head"
      />
      <BodyHitbox
        position={hitboxes.chest.position}
        size={hitboxes.chest.size}
        bodyPart="chest"
        label="Chest"
      />
      <BodyHitbox
        position={hitboxes.stomach.position}
        size={hitboxes.stomach.size}
        bodyPart="stomach"
        label="Stomach"
      />

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={2.5}
        maxDistance={8}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.6}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

export default function BodyCanvas() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0.5, 4], fov: 50 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        resize={{ scroll: false, debounce: { scroll: 50, resize: 50 } }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
