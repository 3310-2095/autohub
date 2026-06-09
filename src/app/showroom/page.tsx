"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { useSearchParams } from "next/navigation";
import * as THREE from "three";

useGLTF.setDecoderPath("/draco/");


const MODEL_MAP: Record<string, string> = {
  // Mitsubishi
  mirageg4:          "/model/Mitsubishi-20260609T054405Z-3-001/Mitsubishi/MirageG4/Mirage.glb",
  "mirage-hatchback":"/model/Mitsubishi-20260609T054405Z-3-001/Mitsubishi/MirageHatchback/Hatchback.glb",
  xpander:           "/model/Mitsubishi-20260609T054405Z-3-001/Mitsubishi/Xpander/Xpander.glb",
  montero:           "/model/Mitsubishi-20260609T054405Z-3-001/Mitsubishi/Montero/Montero.glb",
  xforce:            "/model/Mitsubishi-20260609T054405Z-3-001/Mitsubishi/Xforce/Xforce.glb",
  // Nissan
  almera:            "/model/Nissan-20260609T054349Z-3-001/Nissan/Almera/Almera.glb",
  kicks:             "/model/Nissan-20260609T054349Z-3-001/Nissan/Kicks/Kicks.glb",
  livina:            "/model/Nissan-20260609T054349Z-3-001/Nissan/Livina/Livina.glb",
  navara:            "/model/Nissan-20260609T054349Z-3-001/Nissan/Navara/Navara.glb",
  // Suzuki
  celerio:           "/model/Suzuki-20260609T054307Z-3-001/Suzuki/Celerio/Celerio.glb",
  ertiga:            "/model/Suzuki-20260609T054307Z-3-001/Suzuki/Ertiga/Ertiga.glb",
  jimny:             "/model/Suzuki-20260609T054307Z-3-001/Suzuki/Jimny/Jimny.glb",
  spresso:           "/model/Suzuki-20260609T054307Z-3-001/Suzuki/Spresso/Spresso.glb",
  "s-presso":        "/model/Suzuki-20260609T054307Z-3-001/Suzuki/Spresso/Spresso.glb",
  xl7:               "/model/Suzuki-20260609T054307Z-3-001/Suzuki/XL7/XL7.glb",
};

// targetSize: how wide/long the car should appear (tune per model)
// yOffset: fine-tune vertical position (positive = up, negative = down)
const MODEL_CONFIG: Record<string, { targetSize: number; yOffset: number }> = {
  "/model/Mitsubishi-20260609T054405Z-3-001/Mitsubishi/MirageG4/Mirage.glb":          { targetSize: 4, yOffset: 0 },
  "/model/Mitsubishi-20260609T054405Z-3-001/Mitsubishi/MirageHatchback/Hatchback.glb": { targetSize: 4, yOffset: 0 },
  "/model/Mitsubishi-20260609T054405Z-3-001/Mitsubishi/Xpander/Xpander.glb":          { targetSize: 4, yOffset: 0 },
  "/model/Mitsubishi-20260609T054405Z-3-001/Mitsubishi/Montero/Montero.glb":          { targetSize: 4, yOffset: 0 },
  "/model/Mitsubishi-20260609T054405Z-3-001/Mitsubishi/Xforce/Xforce.glb":            { targetSize: 4, yOffset: 0 },
  "/model/Nissan-20260609T054349Z-3-001/Nissan/Almera/Almera.glb":                    { targetSize: 4, yOffset: 0 },
  "/model/Nissan-20260609T054349Z-3-001/Nissan/Kicks/Kicks.glb":                      { targetSize: 4, yOffset: 0 },
  "/model/Nissan-20260609T054349Z-3-001/Nissan/Livina/Livina.glb":                    { targetSize: 4, yOffset: 0 },
  "/model/Nissan-20260609T054349Z-3-001/Nissan/Navara/Navara.glb":                    { targetSize: 4, yOffset: 0 },
  "/model/Suzuki-20260609T054307Z-3-001/Suzuki/Celerio/Celerio.glb":                  { targetSize: 4, yOffset: 0 },
  "/model/Suzuki-20260609T054307Z-3-001/Suzuki/Ertiga/Ertiga.glb":                    { targetSize: 4, yOffset: 0 },
  "/model/Suzuki-20260609T054307Z-3-001/Suzuki/Jimny/Jimny.glb":                      { targetSize: 4, yOffset: 0 },
  "/model/Suzuki-20260609T054307Z-3-001/Suzuki/Spresso/Spresso.glb":                  { targetSize: 4, yOffset: 0 },
  "/model/Suzuki-20260609T054307Z-3-001/Suzuki/XL7/XL7.glb":                          { targetSize: 4, yOffset: 0 },
};

// The Y position of the showroom display platform floor
// Adjust this single value if all cars are too high or too low
const PLATFORM_Y = 0;

function getModelPath(modelName: string): string {
  const key = modelName.toLowerCase();
  for (const [k, v] of Object.entries(MODEL_MAP)) {
    if (key.includes(k)) return v;
  }
  return "/model/Mitsubishi-20260609T054405Z-3-001/Mitsubishi/Xpander/Xpander.glb";
}

function ShowroomBackground() {
  const { scene } = useGLTF("/showroom_3d.glb");
  return <primitive object={scene} />;
}

function CarModel({
  path,
  color,
  onInfo,
}: {
  path: string;
  color: string;
  onInfo?: (info: string) => void;
}) {
  const { scene } = useGLTF(path);
  const fitted = useRef(false);

  useEffect(() => {
    fitted.current = false;
  }, [path]);

  useEffect(() => {
    if (fitted.current) return;
    fitted.current = true;

    const cfg = MODEL_CONFIG[path] ?? { targetSize: 4, yOffset: 0 };

    // Raw bounding box before any transform
    scene.position.set(0, 0, 0);
    scene.scale.setScalar(1);
    scene.rotation.set(0, 0, 0);
    scene.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = cfg.targetSize / maxDim;
    scene.scale.setScalar(scale);
    scene.updateMatrixWorld(true);

    // Recompute after scale
    const box2 = new THREE.Box3().setFromObject(scene);
    const center2 = new THREE.Vector3();
    box2.getCenter(center2);

    scene.position.set(
      -center2.x,
      PLATFORM_Y - box2.min.y + cfg.yOffset,
      -center2.z
    );

    if (onInfo) {
      onInfo(
        `scale:${scale.toFixed(3)} | raw size: ${size.x.toFixed(1)}x${size.y.toFixed(1)}x${size.z.toFixed(1)} | minY:${box2.min.y.toFixed(2)} | posY:${scene.position.y.toFixed(2)}`
      );
    }
  }, [scene, path, onInfo]);

  useEffect(() => {
    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m) => {
        const mat = m as THREE.MeshStandardMaterial;
        if (mat?.name?.toLowerCase().includes("palette")) {
          mat.color.set(color);
          mat.needsUpdate = true;
          mat.roughness = 0.05;
          mat.metalness = 1.0;
        }
      });
    });
  }, [color, scene]);

  return <primitive object={scene} />;
}

useGLTF.preload("/showroom_3d.glb");

function ShowroomContent() {
  const searchParams = useSearchParams();
  const modelName = searchParams.get("model") || "xpander";
  const modelPath = getModelPath(modelName);
  const color = "darkred";
  const [debugInfo, setDebugInfo] = useState("");

  useGLTF.preload(modelPath);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <Canvas camera={{ position: [0, 2, 6], fov: 50 }}>
        <Environment preset="apartment" background />
        <OrbitControls
          enablePan={true}
          minDistance={0.5}
          maxDistance={20}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          zoomSpeed={1.5}
        />
        <Suspense fallback={null}>
          <ShowroomBackground />
          <CarModel path={modelPath} color={color} onInfo={setDebugInfo} />
        </Suspense>
      </Canvas>

      {/* Debug overlay - remove once all models are tuned */}
      {debugInfo && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-black/70 text-green-400 text-xs px-4 py-2 rounded font-mono">
          {modelName} | {debugInfo}
        </div>
      )}
    </div>
  );
}

export default function ShowroomPage() {
  return (
    <Suspense fallback={<div className="w-full h-screen bg-black" />}>
      <ShowroomContent />
    </Suspense>
  );
}
