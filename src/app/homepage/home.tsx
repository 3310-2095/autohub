"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
interface Brand {
  id: string;
  name: string;
  logo: string;
}

interface Car {
  _id: string;
  sectionData: {
    model: {
      image: string;
      modelimage: string;
      make: string;
      Model: string;
      price: string;
      Enginepower: string;
      Enginecapacity: string;
      Maxspeed: string;
      Enginetorque: string;
      "0-100km/h": string;
    };
  };
}

interface ApiResponse {
  success: boolean;
  message: string;
  count: number;
  data: {
    _id: string;
    sectionData: {
      brand?: {
        name: string;
        logo: string;
      };
      model?: {
        image: string;
        modelimage: string;
        make: string;
        Model: string;
        price: string;
        Enginepower: string;
        Enginecapacity: string;
        Maxspeed: string;
        Enginetorque: string;
        "0-100km/h": string;
      };
    };
  }[];
}

function CarListingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch brands and cars from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch brands
        const brandsResponse = await fetch("https://crmapi.conscor.com/api/general/mfind", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "LHCHoE0IlCOuESA4VQuJ",
          },
          body: JSON.stringify({
            dbName: "virtualcar",
            collectionName: "brand",
            limit: 0,
          }),
        });

        // Fetch cars
        const carsResponse = await fetch("https://crmapi.conscor.com/api/general/mfind", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "LHCHoE0IlCOuESA4VQuJ",
          },
          body: JSON.stringify({
            dbName: "virtualcar",
            collectionName: "model",
            limit: 0,
          }),
        });

        const brandsResult: ApiResponse = await brandsResponse.json();
        const carsResult: ApiResponse = await carsResponse.json();

        if (brandsResult.success) {
          const fetchedBrands: Brand[] = brandsResult.data
            .filter((item) => item.sectionData.brand)
            .map((item) => ({
              id: item._id,
              name: item.sectionData.brand!.name,
              logo: item.sectionData.brand!.logo,
            }));
          setBrands(fetchedBrands);
        }

        if (carsResult.success) {
          const fetchedCars: Car[] = carsResult.data
            .filter((item) => item.sectionData.model)
            .map((item) => ({
              _id: item._id,
              sectionData: {
                model: item.sectionData.model!
              }
            }));
          setCars(fetchedCars);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle brand selection from query params
  useEffect(() => {
    const brand = searchParams.get("brand");
    if (brand) {
      setSelectedBrand(brand);
    }
  }, [searchParams]);

  const filteredCars = selectedBrand
    ? cars.filter((car) => {
        const brandId = brands.find(b => b.name === selectedBrand)?.id;
        return car.sectionData.model.make === brandId;
      })
    : [];

  if (loading) {
    return (
      <div className="px-3 sm:px-6 md:px-12 py-6 sm:py-10">
        {/* Brand Row Skeleton */}
        <div className="w-full flex gap-3 sm:gap-6 justify-start sm:justify-center items-center overflow-x-auto mb-6 sm:mb-8 scrollbar-hide p-2 sm:p-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex min-w-[70px] sm:min-w-[110px] md:min-w-[140px] h-16 sm:h-24 md:h-28 items-center justify-center bg-gray-200 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
        
        {/* Cars Grid Skeleton */}
        <div className="max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mx-auto">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-lg border border-gray-300 p-2 sm:p-3 bg-transparent">
              <div className="w-full aspect-square sm:aspect-[16/10] bg-gray-200 rounded animate-pulse"></div>
              <div className="mt-2 sm:mt-3 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="px-3 sm:px-6 md:px-12 py-6 sm:py-10">
      {/* Brand Row */}
      <div className="w-full flex gap-3 sm:gap-6 justify-start sm:justify-center items-center overflow-x-auto mb-6 sm:mb-8 scrollbar-hide p-2 sm:p-3">
        {brands.map((brand) => (
          <div
            key={brand.id}
            onClick={() => {
              const newBrand = selectedBrand === brand.name ? null : brand.name;
              setSelectedBrand(newBrand);
              if (newBrand) {
                router.push(`/?brand=${newBrand}`);
              } else {
                router.push("/");
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

      {/* Show Cars for Selected Brand */}
      {selectedBrand && (
        <div className="max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mx-auto">
          {filteredCars.map((car) => (
            <div
              key={car._id}
              onClick={() => router.push(`/cars/${car._id}`)}
              className="rounded-lg border border-gray-300 transition p-2 sm:p-3 cursor-pointer bg-transparent"
            >
              <div className="relative w-full aspect-square sm:aspect-[16/10]">
                <Image
                  src={car.sectionData.model.modelimage}
                  alt={car.sectionData.model.Model}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-contain"
                  priority
                />
                {/* Brand Logo */}
                <div className="absolute -top-3 sm:-top-9 right-2 sm:right-3">
                  <Image
                    src={brands.find(b => b.id === car.sectionData.model.make)?.logo || ''}
                    alt="Brand Logo"
                    width={50}
                    height={50}
                    className="object-contain sm:w-[50px] sm:h-[50px]"
                  />
                </div>
              </div>
              <p className="mt-2 sm:mt-3 text-center text-gray-800 font-medium text-xs sm:text-sm md:text-base">
                {car.sectionData.model.Model}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CarListing() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CarListingContent />
    </Suspense>
  );
}