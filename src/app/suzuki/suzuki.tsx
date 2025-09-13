"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

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
    name: "Eirtiga",
    image: "/carimage/suzuki5.png",
    brandLogo: "/logos/suzuki.png",
  },
];

export default function CarGrid() {
  const router = useRouter();

  return (
    <div className="px-4 sm:px-8 lg:px-20 w-full py-6 mt-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 w-full">
        {cars.map((car) => (
          <div
            key={car.id}
            className="relative shadow-md flex flex-col items-center cursor-pointer transition-all rounded-xl hover:shadow-lg"
            onClick={() => router.push(`/xl7suzuki`)} // ✅ navigate to dynamic route
          >
            {/* Brand Logo */}
            <div className="absolute -top-6 right-4 bg-white shadow p-1 rounded-xl">
              <Image
                src="/carimage/logo.png"
                alt="Brand Logo"
                width={50}
                height={50}
                className="object-contain"
              />
            </div>

            {/* Car Image */}
            <div className="flex flex-col justify-center items-center h-full w-full bg-gradient-to-b from-[#f5f5f5] to-[#d9d9d9] rounded-xl px-3 py-8 shadow-inner">
              <Image
                src={car.image}
                alt={car.name}
                width={300}
                height={200}
                className="object-contain drop-shadow-lg"
              />
              <h3 className="text-center font-bold text-black mt-2 text-sm sm:text-base lg:text-lg">
                {car.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
