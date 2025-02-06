import React, { useEffect, useRef, useCallback, useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

interface DropdownProps {
  username: string;
  role: string;
}

const Dropdown: React.FC<DropdownProps> = ({ username, role }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(true);

  const closeDropdown = useCallback(() => {
    setDropdownOpen(false);
  }, []);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      closeDropdown();
    }
  }, [closeDropdown]);

  const handleScroll = useCallback(() => {
    closeDropdown();
  }, [closeDropdown]);

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("scroll", handleScroll, true);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll, true);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [dropdownOpen, handleClickOutside, handleScroll]);

  return dropdownOpen ? (

      <div className="flex flex-col w-[200px] max-md:w-[180px] border-[#15335D] border-4 rounded-lg bg-white z-30">
        <div className="px-4 py-2 text-sm text-gray-900">
          <div className="font-bold">{username}</div>
          <div className="text-gray-500">Role: {role}</div>
        </div>
        <div className="border-t border-gray-100"></div>
        {(role === 'Admin' || role === 'SuperAdmin') && (
          <Link
            href="/admin/users"
            className="block px-4 py-2 text-sm text-primary hover:bg-primary hover:text-white"
          >
            Dashboard
          </Link>
        )}
        <Link
          href="/settings"
          className="block px-4 py-2 text-sm text-primary hover:bg-primary hover:text-white"
        >
          Settings
        </Link>
        <Link
          href="/orderhistory"
          className="block px-4 py-2 text-sm text-primary hover:bg-primary hover:text-white"
        >
          Purchase History
        </Link>
        <Link
          href="#"
          className="block px-4 py-2 text-sm text-primary hover:bg-primary hover:text-white"
          onClick={(e) => {
            e.preventDefault();
            signOut();
          }}
        >
          Sign out
        </Link>
      </div>
  ) : null;
};

export default Dropdown;