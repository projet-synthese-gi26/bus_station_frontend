// src/components/dashboard/DashboardHeader.tsx
"use client";

import Link from "next/link";
//import { Menu, Search, Bell, ChevronDown } from "lucide-react";
import { Menu, Bell, ChevronDown } from "lucide-react";
import Image from "next/image";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const DashboardHeader = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 flex w-full bg-white shadow-sm">
      <div className="flex flex-grow items-center justify-between py-4 px-4 md:px-6 2xl:px-10">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="z-50 block rounded-lg border border-gray-200 bg-white p-1.5 shadow-sm lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <div className="hidden sm:block">
          {/* Search bar can be added here if needed */}
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* Notification Bell */}
            <li className="relative">
              <Link
                href="#"
                className="relative flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  3
                </span>
              </Link>
            </li>
          </ul>

          {/* User Menu */}
          <div className="relative">
            <Link href="#" className="flex items-center gap-4">
              <span className="hidden text-right lg:block">
                <span className="block text-sm font-medium text-black">
                  Agency Name
                </span>
                <span className="block text-xs text-gray-500">Admin</span>
              </span>
              <span className="h-10 w-10 rounded-full">
                <Image
                  width={40}
                  height={40}
                  src={"/images/team/member1.svg"}
                  alt="User"
                  className="rounded-full"
                />
              </span>
              <ChevronDown className="hidden h-5 w-5 text-gray-500 sm:block" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
