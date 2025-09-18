import React, { useState, useRef, useEffect } from 'react';
import type { FirestoreUser } from '../types';

interface HeaderProps {
  user: FirestoreUser;
  orderCount: number;
  onLogout: () => void;
  isAdmin: boolean;
  onNavigate: (page: 'deals' | 'orders') => void;
}

const UserIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-light" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0012 11z" clipRule="evenodd" />
  </svg>
);


const Header: React.FC<HeaderProps> = ({ user, orderCount, onLogout, isAdmin, onNavigate }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <header className="bg-secondary shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4 text-light">
        <h1 className="text-2xl md:text-3xl font-bold tracking-wider">
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('deals'); }}>Loot Hi Loot Deals</a>
        </h1>
        <div className="flex items-center space-x-4">
            { isAdmin && <span className="font-bold bg-green-500 text-white text-xs px-2 py-1 rounded-full">ADMIN</span>}
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2 focus:outline-none">
              <UserIcon />
              <span className="hidden md:block font-medium">{user.name}</span>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-secondary rounded-lg shadow-xl border border-accent p-4 flex flex-col space-y-3">
                <div className="border-b border-accent pb-3">
                  <p className="font-semibold text-light capitalize">{user.name}</p>
                  <p className="text-sm text-highlight">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    onNavigate('orders');
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left bg-accent hover:bg-highlight text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  View My Orders ({orderCount})
                </button>
                <button
                  onClick={onLogout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
