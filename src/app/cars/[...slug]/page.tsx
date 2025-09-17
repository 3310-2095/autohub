"use client";

import React, { useRef, useState, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { Object3D, Mesh } from "three";
import data from "@/app/data/data.json";
import { useParams } from "next/navigation";

// Define interfaces for data structure
interface Car {
    id: number;
    name: string;
    image: string;
    brandLogo: string;
    brand: string;
    page: string;
    price: string;
    modelPath: string;
    colors: string[];
    specs: {
        power: string;
        capacity: string;
        speed: string;
        torque: string;
        acceleration: string;
    };
}

const CarModel = ({
    modelPath,
    carName,
    onLoad,
    setCameraParams,
    orbitRef,
    setGroundY,
}: {
    modelPath: string;
    carName: string;
    onLoad: () => void;
    setCameraParams: (
        minDistance: number,
        maxDistance: number,
        cameraPosition: [number, number, number],
        target: [number, number, number]
    ) => void;
    orbitRef: React.RefObject<OrbitControlsImpl | null>;
    setGroundY: (y: number) => void;
}) => {
    const { scene } = useGLTF(modelPath);
    const modelRef = useRef<THREE.Group>(scene);
    const isPositionSet = useRef(false);

    useEffect(() => {
        if (!scene || isPositionSet.current) return;

        const box = new THREE.Box3().setFromObject(scene);
        const sizeVec = box.getSize(new THREE.Vector3());
        const size = sizeVec.length();
        const center = box.getCenter(new THREE.Vector3());

        console.log("Model:", carName, "Box Size:", sizeVec, "Center:", center);

        const validSize = isFinite(size) && size > 0 ? size : 2;

        const validCenter = {
            x: isFinite(center.x) ? center.x : 0,
            y: isFinite(center.y) ? center.y : 0,
            z: isFinite(center.z) ? center.z : 0,
        };

        // Move model so it sits on ground
        const bottomY = box.min.y;
        scene.position.set(-validCenter.x, -bottomY, -validCenter.z);
        scene.updateMatrix();
        isPositionSet.current = true;

        // Camera setup
        const minDistance = Math.max(validSize * 0.5, 1);
        const maxDistance = validSize * 3.5;
        const cameraPosition: [number, number, number] = [
            validCenter.x,
            validCenter.y + validSize * 0.8,
            validCenter.z + validSize * 2,
        ];
        const target: [number, number, number] = [
            validCenter.x,
            validCenter.y,
            validCenter.z,
        ];

        setCameraParams(minDistance, maxDistance, cameraPosition, target);

        // Ground plane
        setGroundY(box.min.y - 0.05);

        scene.traverse((child: Object3D) => {
            if ((child as Mesh).isMesh) {
                const mesh = child as Mesh;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
            }
        });

        onLoad();
    }, [scene, carName, onLoad, setCameraParams, setGroundY]);

    useFrame(() => {
        if (orbitRef.current) orbitRef.current.update();
        if (!isPositionSet.current) modelRef.current.updateMatrixWorld();
    });

    return <primitive object={scene} ref={modelRef} />;
};

// Loader
const Loader = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
        <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-t-4 border-white border-opacity-80 border-t-yellow-500 rounded-full animate-spin"></div>
    </div>
);

const CarDetailPage = () => {
    const orbitRef = useRef<OrbitControlsImpl | null>(null);
    const [loading, setLoading] = useState(true);
    const [groundY, setGroundY] = useState(-0.5);
    const [cameraParams, setCameraParams] = useState<{
        minDistance: number;
        maxDistance: number;
        cameraPosition: [number, number, number];
        target: [number, number, number];
    }>({
        minDistance: 2,
        maxDistance: 20,
        cameraPosition: [0, 1, 8],
        target: [0, 0, 0],
    });

    const params = useParams();
    const carId = params?.slug
        ? parseInt(
            Array.isArray(params.slug)
                ? params.slug[params.slug.length - 1]
                : params.slug
        )
        : null;

    const car: Car | undefined = data.cars.find((c) => c.id === carId);

    // ✅ Hooks must always run
    useGLTF.preload(car ? car.modelPath : "");

    useEffect(() => {
        if (orbitRef.current && car) {
            orbitRef.current.target.set(...cameraParams.target);
            orbitRef.current.update();
        }
    }, [cameraParams, car]);

    // ✅ Conditional return after hooks
    if (!car) {
        return <div className="text-white text-center p-6">Car not found</div>;
    }

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white">
            {/* Left Section */}
            <div className="w-full md:w-4/5 relative h-[50vh] md:h-screen">
                {loading && <Loader />}

                <div className="absolute top-2 left-2 md:top-4 md:left-10 z-10">
                    <h2 className="text-lg sm:text-xl md:text-xl font-bold leading-snug">
                        {car.name}
                    </h2>
                </div>

                <div className="relative w-full h-[50vh] md:h-screen">
                    <Canvas
                        shadows
                        camera={{ position: cameraParams.cameraPosition, fov: 50 }}
                        dpr={[
                            1,
                            typeof window !== "undefined"
                                ? window.devicePixelRatio
                                : 1,
                        ]}
                        gl={{
                            antialias: true,
                            toneMapping: THREE.ACESFilmicToneMapping,
                            outputColorSpace: THREE.SRGBColorSpace,
                        }}
                        className="w-full h-[50vh] md:h-screen"
                        style={{ background: "#1a1a1a" }}
                    >
                        <ambientLight intensity={0.6} />
                        <directionalLight
                            castShadow
                            position={[5, 8, 5]}
                            intensity={1.2}
                            shadow-mapSize-width={2048}
                            shadow-mapSize-height={2048}
                        />
                        <directionalLight
                            position={[-5, 5, -5]}
                            intensity={0.5}
                        />
                        <Environment preset="studio" />

                        {/* Dynamic Ground */}
                        <mesh
                            receiveShadow
                            rotation={[-Math.PI / 2, 0, 0]}
                            position={[0, groundY, 0]}
                        >
                            <planeGeometry args={[100, 100]} />
                            <meshStandardMaterial color="#2d2d2d" />
                        </mesh>

                        {/* Car */}
                        <Suspense fallback={<group />}>
                            <CarModel
                                modelPath={car.modelPath}
                                carName={car.name}
                                onLoad={() => setLoading(false)}
                                setCameraParams={(
                                    minDistance,
                                    maxDistance,
                                    cameraPosition,
                                    target
                                ) =>
                                    setCameraParams({
                                        minDistance,
                                        maxDistance,
                                        cameraPosition,
                                        target,
                                    })
                                }
                                orbitRef={orbitRef}
                                setGroundY={setGroundY}
                            />
                        </Suspense>

                        {/* <OrbitControls
                            ref={orbitRef}
                            enablePan={false}
                            enableDamping
                            dampingFactor={0.15}
                            minDistance={cameraParams.minDistance}
                            maxDistance={cameraParams.maxDistance}
                            target={cameraParams.target}
                        /> */}
                        <OrbitControls
                            ref={orbitRef}
                            enablePan={false}
                            enableDamping
                            dampingFactor={0.15}
                            minDistance={0}          // ✅ No lower zoom limit
                            maxDistance={Infinity}   // ✅ No upper zoom limit
                            target={cameraParams.target}
                        />

                    </Canvas>
                </div>
            </div>

            {/* Right Section */}
            <div
                className="w-full md:w-1/4 flex flex-col justify-between items-center p-4 md:p-6 mt-4 md:mt-0"
                style={{
                    background:
                        "linear-gradient(to bottom, rgba(75,85,99,0.8), rgba(55,65,81,0.8), rgba(31,41,55,0.8))",
                    backdropFilter: "blur(8px)",
                }}
            >
                <div className="text-center space-y-4 w-full max-w-xs">
                    <h2 className="text-md sm:text-xl md:text-2xl font-semibold border-b border-gray-600 pb-2 md:pb-4">
                        {car.price}
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
                <div className="grid grid-cols-2 gap-3 w-full max-w-xs text-center mt-6">
                    <div className="p-3 md:p-4 rounded-lg hover:bg-gray-600 transition">
                        <div className="text-base md:text-lg font-bold">
                            {car.specs.power}
                        </div>
                        <div className="text-xs sm:text-sm">Engine Power</div>
                    </div>
                    <div className="p-3 md:p-4 rounded-lg hover:bg-gray-600 transition">
                        <div className="text-base md:text-lg font-bold">
                            {car.specs.capacity}
                        </div>
                        <div className="text-xs sm:text-sm">Engine Capacity</div>
                    </div>
                    <div className="p-3 md:p-4 rounded-lg hover:bg-gray-600 transition">
                        <div className="text-base md:text-lg font-bold">
                            {car.specs.speed}
                        </div>
                        <div className="text-xs sm:text-sm">
                            Max
                            <span className="hidden md:inline">
                                <br />
                            </span>
                            Speed
                        </div>
                    </div>
                    <div className="p-3 md:p-4 rounded-lg hover:bg-gray-600 transition">
                        <div className="text-base md:text-lg font-bold">
                            {car.specs.torque}
                        </div>
                        <div className="text-xs sm:text-sm">Engine Torque</div>
                    </div>
                </div>

                {/* 0-100 */}
                <div className="text-center mt-6 p-3 md:p-4 rounded-lg hover:bg-gray-600 transition">
                    <div className="text-base md:text-lg font-semibold">
                        0-100 km/h
                    </div>
                    <div className="text-xs sm:text-sm text-gray-300">
                        {car.specs.acceleration}
                    </div>
                </div>

                {/* View Price */}
                <div className="w-full max-w-xs mt-6 mb-8">
                    <button className="w-full py-2.5 md:py-3 bg-white bg-opacity-90 text-black rounded-md hover:bg-gray-200 font-semibold transition text-base">
                        VIEW PRICE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CarDetailPage;
