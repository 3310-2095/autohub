"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Brand {
  id: number;
  name: string;
  logo: string;
  page?: string;
}

interface Car {
  id: number;
  name: string;
  image: string;
  brandLogo: string;
  brand: string;
  page?: string;
}

// Brand list
const brands: Brand[] = [
  { id: 1, name: "Suzuki", logo: "/carimage/logo.png", page: "/suzuki" },
  { id: 2, name: "Nissan", logo: "/images/image 2.png", page: "/nissan" },
  { id: 3, name: "Mitsubishi", logo: "/images/Mercedes Benz.png", page: "/mitsubishi" },

];

// Full car list
const cars: Car[] = [
  { id: 1, name: "Xl 7 Hatchback", image: "/carimage/xl7.png", brandLogo: "/carimage/logo.png", brand: "Suzuki", page: "/xl7suzuki" },
  { id: 2, name: "S-presso Hatchback", image: "/carimage/s-presso.png", brandLogo: "/carimage/logo.png", brand: "Suzuki" },
  { id: 3, name: "Jimny 3-Door SUV", image: "/carimage/jimny.png", brandLogo: "/carimage/logo.png", brand: "Suzuki" },
  { id: 4, name: "Ertiga", image: "/carimage/ertiga.png", brandLogo: "/carimage/logo.png", brand: "Suzuki" },
  { id: 6, name: "Navara", image: "/carimage/navara.png", brandLogo: "/images/image 2.png", brand: "Nissan" },
  { id: 7, name: "Kicks", image: "/carimage/kicks.png", brandLogo: "/images/image 2.png", brand: "Nissan" },
  { id: 8, name: "Xpander", image: "/carimage/xpander.png", brandLogo: "/images/Mercedes Benz.png", brand: "Mitsubishi" },
  { id: 8, name: "Xforce", image: "/carimage/xforce.png", brandLogo: "/images/Mercedes Benz.png", brand: "Mitsubishi" },
  { id: 8, name: "Montero", image: "/carimage/montero.png", brandLogo: "/images/Mercedes Benz.png", brand: "Mitsubishi" },
];

export default function CarListing() {
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  // Filter cars by brand if selected
  const filteredCars = selectedBrand ? cars.filter(car => car.brand === selectedBrand) : cars;

  return (
    <div className="px-3 sm:px-6 md:px-12 py-6 sm:py-10">
      {/* Brand Row */}
      <div className="w-full flex gap-4 sm:gap-6 justify-start sm:justify-center items-center overflow-x-auto bg-white mb-6 sm:mb-8 scrollbar-hide p-3 sm:p-4 rounded-xl">
        {brands.map((brand) => (
          <div
            key={brand.id}
            onClick={() => {
              if (brand.page) {
                router.push(brand.page); // Navigate to dedicated brand page
                setSelectedBrand(brand.name); // Also filter locally if needed
              }
            }}
            className={`flex min-w-[90px] sm:min-w-[140px] md:min-w-[160px] h-24 sm:h-28 md:h-36 rounded-lg shadow-sm border border-gray-200 items-center justify-center bg-white hover:shadow-md cursor-pointer transition ${
              selectedBrand === brand.name ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <Image
              src={brand.logo}
              alt={brand.name}
              width={120}
              height={120}
              className="object-contain max-h-[80%]"
            />
          </div>
        ))}
      </div>

      {/* Car Grid */}
      <div className="max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mx-auto">
        {filteredCars.map((car) => (
          <div
            key={car.id}
            onClick={() => car.page && router.push(car.page)}
            className="bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition p-3 cursor-pointer"
          >
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10]">
              <Image
                src={car.image}
                alt={car.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-contain rounded-lg"
                priority
              />
              {/* Brand Logo */}
              <div className="absolute -top-5 sm:-top-6 right-3 sm:right-4 bg-white shadow p-1 sm:p-1.5 rounded-xl">
                <Image
                  src={car.brandLogo}
                  alt="Brand Logo"
                  width={40}
                  height={40}
                  className="object-contain sm:w-[50px] sm:h-[50px]"
                />
              </div>
            </div>
            <p className="mt-3 text-center text-gray-800 font-medium text-sm sm:text-base">
              {car.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
