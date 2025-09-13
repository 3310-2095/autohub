"use client";

import React from "react";
import Image from "next/image"; // ✅ Import next/image
import { FiSearch, FiBell } from "react-icons/fi";

const Header = () => {
  return (
    <header className="w-full z-50">
      {/* Top Banner */}
      <div className="bg-[#000000] text-white h-[70px] max-w-8xl mx-auto px-4 sm:px-8 lg:px-20 flex items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-12 pr-5 py-3 rounded-md bg-white text-black text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 text-xl" />
        </div>

        {/* Right Section: Notification and Profile */}
        <div className="flex items-center space-x-6">
          <FiBell className="text-2xl cursor-pointer hover:text-gray-300" />

          {/* ✅ Fixed: Using Next.js <Image /> instead of <img> */}
          <div className="relative w-12 h-12">
            <Image
              src="/images/profile.jpg"
              alt="Profile"
              fill
              className="rounded-full object-cover border-2 border-gray-600"
              priority // Loads faster (good for LCP)
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
