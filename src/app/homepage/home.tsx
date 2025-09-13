"use client";

import Image from "next/image";

interface Brand {
    id: number;
    name: string;
    logo: string;
}

interface Car {
    id: number;
    name: string;
    image: string;
    brandLogo: string;
}

const brands: Brand[] = [
    { id: 1, name: "Suzuki", logo: "/carimage/logo.png" },
    { id: 2, name: "JAC Motors", logo: "/logos/jac.png" },
    { id: 3, name: "Nissan", logo: "/logos/nissan.png" },
    { id: 4, name: "Mitsubishi", logo: "/logos/mitsubishi.png" },
     { id: 5, name: "Mitsubishi", logo: "/logos/mitsubishi.png" },
];

const cars: Car[] = [
    {
        id: 1,
        name: "Suzuki Swift Hatchback",
        image: "/carimage/suzuki5.png",
        brandLogo: "/logos/suzuki.png",
    },
    {
        id: 2,
        name: "Jac Swift Hatchback",
        image: "/cars/jac1.png",
        brandLogo: "/logos/jac.png",
    },
    {
        id: 3,
        name: "Nissan Swift Hatchback",
        image: "/cars/nissan1.png",
        brandLogo: "/logos/nissan.png",
    },
    {
        id: 4,
        name: "Mitsubishi Swift Hatchback",
        image: "/cars/mitsubishi1.png",
        brandLogo: "/logos/mitsubishi.png",
    },
    {
        id: 5,
        name: "Suzuki Swift Hatchback",
        image: "/cars/suzuki2.png",
        brandLogo: "/logos/suzuki.png",
    },
    {
        id: 6,
        name: "Suzuki Swift Hatchback",
        image: "/cars/suzuki3.png",
        brandLogo: "/logos/suzuki.png",
    },
];

export default function CarListing() {
    return (
        <div className="px-4 md:px-12 py-10">
            {/* Top Brand Row */}
            <div className="w-full items-center rounded-xl p-4 flex gap-4 overflow-x-auto bg-white mb-8 scrollbar-hide">
                {brands.map((brand) => (
                    <div
                        key={brand.id}
                        className="flex w-60 h-60 rounded-lg shadow-sm border border-gray-200 items-center justify-center bg-white hover:shadow-md cursor-pointer transition"
                    >
                        <Image
                            src={brand.logo}
                            alt={brand.name}
                            width={140}
                            height={140}
                            className="object-contain"
                        />
                    </div>
                ))}
            </div>

            {/* Cars Grid */}
            <div className="max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto">
                {cars.map((car) => (
                    <div
                        key={car.id}
                        className="bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition p-3"
                    >
                        <div className="relative w-full h-44">
                            <Image
                                src={car.image}
                                alt={car.name}
                                fill
                                className="object-contain rounded-lg"
                            />
                            <div className="absolute -top-6 right-4 bg-white shadow p-1 rounded-xl">
                                <Image
                                    src="/carimage/logo.png"
                                    alt="Brand Logo"
                                    width={60}
                                    height={60}
                                    className="object-contain"
                                />
                            </div>
                        </div>
                        <p className="mt-3 text-center text-gray-800 font-medium">
                            {car.name}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
