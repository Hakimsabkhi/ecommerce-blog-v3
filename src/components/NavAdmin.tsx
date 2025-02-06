"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaBars, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { DashboardAdmin } from "@/lib/page"; 

const NavAdmin = () => {
  const { data: session, status } = useSession();
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Handle link click
  const handleClick = (link: string) => {
    setActiveLink(link);
    setIsMenuOpen(false);
    setOpenDropdown(null);
  };

  // Toggle dropdown menu
  const toggleDropdown = (groupName: string) => {
    setOpenDropdown((prev) => (prev === groupName ? null : groupName));
  };

  useEffect(() => {
    // Placeholder for any session or status-related side effects
  }, [session, status]);

  if (status === "loading") {
    return null;
  }

  return (
    <nav className="bg-gray-800 w-full">
      <div className="w-[90%] mx-auto">
        <div className="flex items-center justify-between h-[60px]">
          <p className="text-white font-bold text-xl cursor-pointer">Dashboard</p>

          {/* Mobile menu toggle button */}
          <div className="xl:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden xl:flex xl:items-center gap-4 h-full">
            {DashboardAdmin.map((item) => {
              if (item.group) {
                // Handle grouped items
                return (
                  <div
                    key={item.group}
                    className="relative group h-full"
                    onMouseEnter={() => setOpenDropdown(item.group)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <div className="flex items-center gap-2 px-2 h-full w-fit min-w-[130px]">
                      <p className="text-gray-300 text-sm font-medium cursor-pointer">
                        {item.group}
                      </p>
                      {openDropdown === item.group ? (
                        <FaChevronUp className="text-gray-300" />
                      ) : (
                        <FaChevronDown className="text-gray-300" />
                      )}
                    </div>
                    {openDropdown === item.group && (
                      <div className="absolute bg-gray-800 border-t-2 text-gray-300 shadow-lg w-full z-50">
                        {item.items.map((link) => (
                          link.path && (
                            <Link key={link.name} href={link.path}>
                              <p
                                onClick={() => handleClick(link.name)}
                                className={`p-2 text-sm font-medium cursor-pointer hover:bg-gray-300 hover:text-gray-900 ${
                                  activeLink === link.name ? "bg-gray-600" : ""
                                }`}
                              >
                                {link.name}
                              </p>
                            </Link>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                );
              } 
            })}
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="xl:hidden bg-gray-700 z-50">
            <div className="flex flex-col gap-4 p-4">
              {DashboardAdmin.map((item) => {
                if (item.group) {
                  // Handle grouped items
                  return (
                    <div key={item.group} className="flex flex-col gap-2">
                      <div
                        className="flex items-center justify-between text-gray-300 font-medium cursor-pointer"
                        onClick={() => toggleDropdown(item.group)}
                      >
                        <p className="text-sm p-2">{item.group}</p>
                        {openDropdown === item.group ? <FaChevronUp /> : <FaChevronDown />}
                      </div>
                      {openDropdown === item.group &&
                        item.items.map((link) => (
                          link.path && (
                            <Link key={link.name} href={link.path}>
                              <p
                                onClick={() => handleClick(link.name)}
                                className={`text-gray-300 hover:bg-gray-600 hover:text-white p-2 text-sm font-medium cursor-pointer ${
                                  activeLink === link.name ? "bg-gray-600" : ""
                                }`}
                              >
                                {link.name}
                              </p>
                            </Link>
                          )
                        ))}
                    </div>
                  );
                } 
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavAdmin;
