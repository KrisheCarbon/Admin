"use client";

export default function Navbar({ onToggleSidebar }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-8 lg:px-12 xl:px-24">

        {/* --- Left Section --- */}
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Button */}
          <button
            aria-label="Toggle Sidebar"
            onClick={onToggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100 md:hidden transition-all duration-200"
          >
            <img
              src="/icons/menu.svg"
              alt="Menu"
              className="h-6 w-6"
            />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src="/icons/logo.png"
              alt="kriSHE Logo"
              className="h-10 w-12 object-contain"
            />
            <span className="text-base sm:text-lg font-semibold tracking-wide text-gray-700">
              kriSHE Admin
            </span>
          </div>
        </div>

        {/* --- Right Section --- */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search Button */}
          <button
            aria-label="Search"
            className="relative p-2 rounded-md hover:bg-gray-100 transition-all duration-200"
          >
            <img
              src="/icons/search.svg"
              alt="Search"
              className="h-5 w-5 sm:h-6 sm:w-6"
            />
          </button>

          {/* Notifications */}
          <button
            aria-label="Notifications"
            className="relative p-2 rounded-md hover:bg-gray-100 transition-all duration-200"
          >
            <img
              src="/icons/bell.svg"
              alt="Notifications"
              className="h-5 w-5 sm:h-6 sm:w-6"
            />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* Profile */}
          <button
            aria-label="Profile"
            className="flex items-center gap-2 rounded-full border border-gray-200 p-1 pl-2 hover:bg-gray-50 transition-all duration-200"
          >
            <img
              src="/icons/profile.svg"
              alt="Profile"
              className="h-6 w-6 sm:h-7 sm:w-7 rounded-full"
            />
            <span className="hidden sm:block text-sm font-medium pr-2 text-gray-700">
              Admin
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
