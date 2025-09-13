"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

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
  page: string;
}

const brands: Brand[] = [
  { id: 1, name: "Suzuki", logo: "/carimage/logo.png" },
  { id: 2, name: "JAC Motors", logo: "/images/Logo_jac-removebg-preview 1.png" },
  { id: 3, name: "Nissan", logo: "/images/image 2.png" },
  { id: 4, name: "Mitsubishi", logo: "/images/Mercedes Benz.png" },
  { id: 5, name: "Geely", logo: "/images/geely.png" },
];

const cars: Car[] = [
  {
    id: 1,
    name: "Suzuki Swift Hatchback",
    image: "/carimage/suzuki5.png",
    brandLogo: "/carimage/logo.png",
    page: "/suzuki",
  },
  {
    id: 2,
    name: "Jac Swift Hatchback",
    image: "/carimage/image 19.png",
    brandLogo: "/images/geely.png",
    page: "/jac",
  },
  {
    id: 3,
    name: "Nissan Swift Hatchback",
    image: "/carimage/suzuki6.png",
    brandLogo: "/images/image 2.png",
    page: "/nissan",
  },
  {
    id: 4,
    name: "Mitsubishi Swift Hatchback",
    image: "/carimage/suzuki7.png",
    brandLogo: "/images/Mercedes Benz.png",
    page: "/mitsubishi",
  },
  {
    id: 5,
    name: "Suzuki Swift Hatchback",
    image: "/carimage/suzuki5.png",
    brandLogo: "/images/image 2.png",
    page: "/suzuki-2",
  },
  {
    id: 6,
    name: "Suzuki Swift Hatchback",
    image: "/carimage/suzuki5.png",
    brandLogo: "/images/Logo_jac-removebg-preview 1.png",
    page: "/geely",
  },
];

export default function CarListing() {
  const router = useRouter();

  return (
    <div className="px-3 sm:px-6 md:px-12 py-6 sm:py-10">
      {/* ✅ Brand Row - scrollable on small screens */}
      <div className="w-full flex gap-4 sm:gap-6 justify-start sm:justify-center items-center overflow-x-auto bg-white mb-6 sm:mb-8 scrollbar-hide p-3 sm:p-4 rounded-xl">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="flex min-w-[90px] sm:min-w-[140px] md:min-w-[160px] h-24 sm:h-28 md:h-36 rounded-lg shadow-sm border border-gray-200 items-center justify-center bg-white hover:shadow-md cursor-pointer transition"
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

      {/* ✅ Car Grid - adjusts for all breakpoints */}
      <div className="max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mx-auto">
        {cars.map((car) => (
          <div
            key={car.id}
            onClick={() => router.push(car.page)}
            className="bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition p-3 cursor-pointer"
          >
            {/* ✅ Image container with fixed aspect ratio */}
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
