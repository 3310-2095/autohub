"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface Car {
  id: number;
  name: string;
  image: string;
  brandLogo: string;
  page?: string; // ✅ optional page property
}

const cars: Car[] = [
  {
    id: 1,
    name: "Xpander",
    image: "/carimage/xpander.png",
    brandLogo: "/images/mitsubishi.png",
    page: "/xl7suzuki", // ✅ link added only here
  },
  {
    id: 2,
    name: "Xforce",
    image: "/carimage/xforce.png",
    brandLogo: "/images/mitsubishi.png",
  },
  {
    id: 3,
    name: "Montero",
    image: "/carimage/montero.png",
    brandLogo: "/images/mitsubishi.png",
  },
 
];

export default function CarGrid() {
  const router = useRouter();

  return (
    <div className="px-2 sm:px-6 lg:px-20 w-full py-6 mt-6 sm:mt-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10 w-full">
        {cars.map((car) => (
          <div
            key={car.id}
            className={`relative shadow-md flex flex-col items-center rounded-xl transition-all hover:shadow-lg ${
              car.page ? "cursor-pointer" : "cursor-default"
            }`}
            onClick={() => car.page && router.push(car.page)}
          >
            {/* Brand Logo */}
            <div className="absolute -top-5 sm:-top-6 right-2 sm:right-4 bg-white shadow p-1 rounded-xl">
              <Image
                src={car.brandLogo}
                alt="Brand Logo"
                width={40}
                height={40}
                className="object-contain sm:w-[50px] sm:h-[50px]"
              />
            </div>

            {/* Car Image + Name */}
            <div className="flex flex-col justify-center items-center w-full h-[200px] sm:h-[240px] lg:h-[260px] bg-gradient-to-b from-gray-100 to-gray-300 rounded-xl py-6 sm:py-8">
              <Image
                src={car.image}
                alt={car.name}
                width={250}
                height={180}
                className="object-contain bg-transparent mix-blend-multiply w-[60%] sm:w-[75%] lg:w-[80%]"
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
