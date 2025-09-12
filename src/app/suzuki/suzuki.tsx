"use client";

import Image from "next/image";
import { useState } from "react";

interface Car {
    id: number;
    name: string;
    image: string;
    brandLogo: string;
}

const cars: Car[] = [
    {
        id: 1,
        name: "Xl 7 Hatchback",
        image: "/carimage/suzuki5.png",
        brandLogo: "/logos/suzuki.png",
    },
    {
        id: 2,
        name: "S-presso Hatchback",
        image: "/carimage/suzuki6.png",
        brandLogo: "/logos/suzuki.png",
    },
    {
        id: 3,
        name: "Jimny 3-Door SUV",
        image: "/carimage/suzuki7.png",
        brandLogo: "/logos/suzuki.png",
    },
    {
        id: 4,
        name: "Eirtiga ",
        image: "/carimage/suzuki5.png",
        brandLogo: "/logos/suzuki.png",
    },
];

export default function CarGrid() {
    const [selectedCar, setSelectedCar] = useState<number | null>(null);

    return (
        <div className="p-20 spacing w-full py-6 mt-10">
            {/* ✅ Changed to grid with 3 columns */}
            <div className="grid grid-cols-3 gap-10 w-full">
                {cars.map((car) => (
                    <div
                        key={car.id}
                        className={`relative shadow-md flex flex-col items-center cursor-pointer transition-all rounded-xl hover:shadow-lg ${selectedCar === car.id ? "" : ""
                            }`}
                        onClick={() => setSelectedCar(car.id)}
                    >
                        {/* Brand Logo (top-right) */}
                        <div className="absolute -top-6 right-4 bg-white shadow p-1 rounded-xl">
                            <Image
                                src="/carimage/logo.png"
                                alt="Brand Logo"
                                width={60}
                                height={60}
                                className="object-contain"
                            />
                        </div>

                        {/* Car Image with smooth gradient background */}
                        <div className="flex flex-col justify-center items-center h-full w-full bg-gradient-to-b from-[#f5f5f5] rounded-xl px-3 py-8 to-[#d9d9d9] shadow-inner">
                            <Image
                                src={car.image}
                                alt={car.name}
                                width={300}
                                height={200}
                                className="object-contain drop-shadow-lg"
                            />
                            <h3 className="text-center font-bold text-black mt-2 mr-32">
                                {car.name}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
