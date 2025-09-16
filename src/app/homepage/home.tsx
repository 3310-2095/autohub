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

const brands: Brand[] = [
  { id: 1, name: "Suzuki", logo: "/carimage/logo.png", page: "/suzuki" },
  { id: 2, name: "Nissan", logo: "/images/image 2.png", page: "/nissan" },
  { id: 3, name: "Mitsubishi", logo: "/images/Mercedes Benz.png", page: "/mitsubishi" },
];

const cars: Car[] = [
  { id: 1, name: "Xl 7 Hatchback", image: "/carimage/xl7.png", brandLogo: "/carimage/logo.png", brand: "Suzuki", page:"/xl7suzuki" },
  { id: 2, name: "S-presso Hatchback", image: "/carimage/s-presso.png", brandLogo: "/carimage/logo.png", brand: "Suzuki" },
  { id: 3, name: "Jimny 3-Door SUV", image: "/carimage/jimny.png", brandLogo: "/carimage/logo.png", brand: "Suzuki" },
  { id: 4, name: "Ertiga", image: "/carimage/ertiga.png", brandLogo: "/carimage/logo.png", brand: "Suzuki" },
  { id: 6, name: "Navara", image: "/carimage/navara.png", brandLogo: "/images/image 2.png", brand: "Nissan"},
  { id: 7, name: "Kicks", image: "/carimage/kicks.png", brandLogo: "/images/image 2.png", brand: "Nissan" },
  { id: 8, name: "Xpander", image: "/carimage/xpander.png", brandLogo: "/images/Mercedes Benz.png", brand: "Mitsubishi",  },
  { id: 9, name: "Xforce", image: "/carimage/xforce.png", brandLogo: "/images/Mercedes Benz.png", brand: "Mitsubishi" },
  { id: 10, name: "Montero", image: "/carimage/montero.png", brandLogo: "/images/Mercedes Benz.png", brand: "Mitsubishi" },
];

export default function CarListing() {
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const filteredCars = selectedBrand ? cars.filter(car => car.brand === selectedBrand) : cars;

  return (
    <div className="px-3 sm:px-6 md:px-12 py-6 sm:py-10">
      {/* Brand Row */}
      <div className="w-full flex gap-3 sm:gap-6 justify-start sm:justify-center items-center overflow-x-auto mb-6 sm:mb-8 scrollbar-hide p-2 sm:p-3">
        {brands.map((brand) => (
          <div
            key={brand.id}
            onClick={() => {
              if (brand.page) {
                router.push(brand.page);
                setSelectedBrand(brand.name);
              }
            }}
            className={`flex min-w-[70px] sm:min-w-[110px] md:min-w-[140px] h-16 sm:h-24 md:h-28 items-center justify-center cursor-pointer transition ${
              selectedBrand === brand.name ? "ring-2 ring-blue-500 rounded-lg" : ""
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
      <div className="max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mx-auto">
        {filteredCars.map((car) => (
          <div
            key={car.id}
            onClick={() => car.page && router.push(car.page)}
            className="rounded-lg border-1 border-gray-300 transition p-2 sm:p-3 cursor-pointer bg-transparent"
          >
            <div className="relative w-full aspect-square sm:aspect-[16/10]">
              <Image
                src={car.image}
                alt={car.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-contain"
                priority
              />
              {/* Brand Logo */}
              <div className="absolute -top-3 sm:-top-9 right-2 sm:right-3">
                <Image
                  src={car.brandLogo}
                  alt="Brand Logo"
                  width={50}
                  height={50}
                  className="object-contain sm:w-[50px] sm:h-[50px]"
                />
              </div>
            </div>
            <p className="mt-2 sm:mt-3 text-center text-gray-800 font-medium text-xs sm:text-sm md:text-base">
              {car.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
