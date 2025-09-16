"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import data from "@/app/data/data.json"; // ✅ adjust path to your data.json

interface Car {
  id: number;
  name: string;
  image: string;
  brandLogo: string;
  brand: string;
  page?: string;
}
interface BrandPageProps {
  params: {
    slug: string[]; // catch-all slug is always array
  };
}

export default function BrandPage({ params }: BrandPageProps) {
  const router = useRouter();

  // ✅ Get brand from first segment
  const brand = params.slug?.[0] || "";

  const cars: Car[] = data.cars.filter(
    (car) => car.brand.toLowerCase() === brand.toLowerCase()
  );

  if (cars.length === 0) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-xl font-bold text-gray-600">
        No cars found for {brand}
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-6 lg:px-20 w-full py-6 mt-6 sm:mt-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 capitalize">
        {brand} Cars
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10 w-full">
        {cars.map((car) => (
          <div
            key={car.id}
            className={`relative shadow-md flex flex-col items-center rounded-xl transition-all hover:shadow-lg ${
              car.page ? "cursor-pointer" : "cursor-default"
            }`}
             onClick={() => router.push(`/cars/${car.id}`)} 
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
