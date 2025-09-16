"use client";

import React, { useRef, useState, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { Object3D, Mesh, Material } from "three";

const CarModel = ({ color, onLoad }: { color: string; onLoad: () => void }) => {
  const { scene } = useGLTF("/xcl7/XL7 Final Beige EXTERIOR (1).glb");

  useEffect(() => {
    scene.traverse((child: Object3D) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        if (mesh.material) {
          const material = mesh.material as Material;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh.material = material.clone();
          (mesh.material as THREE.MeshStandardMaterial).color = new THREE.Color(
            color
          );
          mesh.material.needsUpdate = true;
        }
      }
    });

    onLoad(); // Notify parent that model has loaded
  }, [color, scene, onLoad]);

  return (
    <primitive object={scene} scale={[1.5, 1.5, 1.5]} position={[0, -1, 0]} />
  );
};

// Loader Overlay
const Loader = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
    <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-t-4 border-white border-opacity-80 border-t-yellow-500 rounded-full animate-spin"></div>
  </div>
);

const XL7SuzukiPage = () => {
  const orbitRef = useRef<OrbitControlsImpl | null>(null);
  const [carColor, setCarColor] = useState("#ffffff");
  const [loading, setLoading] = useState(true);

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white">
      {/* Left Section - 3D Car */}
      <div className="w-full md:w-4/5 relative h-[50vh] md:h-screen">
        {/* Loader Overlay */}
        {loading && <Loader />}

        {/* Title & Color Selector */}
        <div className="absolute top-2 left-2 md:top-4 md:left-10 z-10 flex flex-col md:flex-row gap-3 md:gap-16">
          <h2 className="text-lg sm:text-xl md:text-3xl font-bold leading-snug">
            Suzuki Swift Hatchback 5-door
          </h2>
          <div className="flex items-center gap-2 md:space-x-4">
            <h4 className="text-sm sm:text-base md:text-sm">Colors:</h4>
            <div
              onClick={() => setCarColor("#ffffff")}
              className="w-5 h-5 md:w-8 md:h-8 rounded-full bg-white border-2 border-gray-400 cursor-pointer hover:border-yellow-500 transition"
            ></div>
            <div
              onClick={() => setCarColor("#c53030")}
              className="w-5 h-5 md:w-8 md:h-8 rounded-full bg-red-600 border-2 border-gray-400 cursor-pointer hover:border-yellow-500 transition"
            ></div>
            <div
              onClick={() => setCarColor("#3182ce")}
              className="w-5 h-5 md:w-8 md:h-8 rounded-full bg-blue-600 border-2 border-gray-400 cursor-pointer hover:border-yellow-500 transition"
            ></div>
          </div>
        </div>

        {/* 3D Canvas */}
        <div className="relative w-full h-[50vh] md:h-screen">
          <Canvas
            shadows
            camera={{ position: [0, 1, 6], fov: 50 }}
            className="w-full h-[50vh] md:h-screen"
            style={{ background: "#1a1a1a" }}
          >
            <ambientLight intensity={0.3} />
            <directionalLight
              castShadow
              position={[5, 5, 5]}
              intensity={1}
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-near={0.1}
              shadow-camera-far={50}
              shadow-camera-left={-10}
              shadow-camera-right={10}
              shadow-camera-top={10}
              shadow-camera-bottom={-10}
            />

            {/* Ground */}
            <mesh
              receiveShadow
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -1, 0]}
            >
              <planeGeometry args={[50, 50]} />
              <meshStandardMaterial color="#2d2d2d" />
            </mesh>

            {/* Car Model */}
            <Suspense fallback={null}>
              <CarModel color={carColor} onLoad={() => setLoading(false)} />
            </Suspense>

            <OrbitControls ref={orbitRef} enablePan={false} />
          </Canvas>
        </div>
      </div>

      {/* Right Section - Info Panel */}
      <div
        className="w-full md:w-1/5 flex flex-col justify-between items-center p-4 md:p-6 mt-4 md:mt-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(75,85,99,0.8), rgba(55,65,81,0.8), rgba(31,41,55,0.8))",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="text-center space-y-4 w-full max-w-xs">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold border-b border-gray-600 pb-2 md:pb-4">
            ₱ 600.000
          </h2>
          <div className="flex justify-center gap-2">
            <button className="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition text-xs sm:text-sm md:text-sm">
              Interior
            </button>
            <button className="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 bg-white text-black rounded-md hover:bg-gray-200 transition text-xs sm:text-sm md:text-sm">
              Exterior
            </button>
          </div>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 w-full max-w-xs text-center mt-4 md:mt-6">
          <div className="bg-opacity-70 p-2 sm:p-3 md:p-4 rounded-lg hover:bg-gray-600 transition">
            <div className="text-sm sm:text-base md:text-xl font-bold">94 hp</div>
            <div className="text-xs sm:text-sm">Engine Power</div>
          </div>
          <div className="bg-opacity-70 p-2 sm:p-3 md:p-4 rounded-lg hover:bg-gray-600 transition">
            <div className="text-sm sm:text-base md:text-xl font-bold">1.2 L</div>
            <div className="text-xs sm:text-sm">Engine Capacity</div>
          </div>
          <div className="bg-opacity-70 p-2 sm:p-3 md:p-4 rounded-lg hover:bg-gray-600 transition">
            <div className="text-sm sm:text-base md:text-xl font-bold">
              112 mph
            </div>
            <div className="text-xs sm:text-sm">Max Speed</div>
          </div>
          <div className="p-2 sm:p-3 md:p-4 rounded-lg hover:bg-gray-600 transition">
            <div className="text-sm sm:text-base md:text-xl font-bold">
              118 Nm
            </div>
            <div className="text-xs sm:text-sm">Engine Torque</div>
          </div>
        </div>

        {/* 0-100 km/h */}
        <div className="text-center mt-4 md:mt-6 space-y-1 p-2 sm:p-3 md:p-4 rounded-lg hover:bg-gray-600 transition">
          <div className="text-sm sm:text-base md:text-xl font-semibold">
            0-100 km/h
          </div>
          <div className="text-xs sm:text-sm text-gray-300">11.5 seconds</div>
        </div>

        {/* View Price */}
        <div className="w-full max-w-xs mt-4 md:mt-6 mb-6 md:mb-10">
          <button className="w-full py-2 sm:py-2.5 md:py-3 bg-white bg-opacity-90 text-black rounded-md hover:bg-gray-200 font-semibold transition text-sm sm:text-base md:text-base">
            VIEW PRICE
          </button>
        </div>
      </div>
    </div>
  );
};

export default XL7SuzukiPage;
