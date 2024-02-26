import React, { useState } from 'react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Botón de alternancia del Sidebar */}
      <button
        className="lg:hidden relative top-0 left- m-4 text-white focus:outline-none z-50"
        onClick={toggleSidebar}
      >
        <svg
          className="h-8 w-8 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M19 13H5v-2h14v2zM3 8h18V6H3v2zm16 7H5v-2h14v2z"
            />
          ) : (
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"
            />
          )}
        </svg>
      </button>

      {/* Contenido del Sidebar */}
      <div
        className={`border-2 bg-opacity-75 h-full fixed top-12 left-0 lg:w-56 md:w-40 w-16 overflow-y-auto z-40 ${
          isOpen ? 'block' : 'hidden lg:block'
        }`}
      >
        <div className="p-4">
          <ul className="space-y-4">
            <SidebarItem name="LEC" image="imagen-lec.png" />
            <SidebarItem name="SUPERLIGA" image="imagen-superliga.png" />
            <SidebarItem name="MSI" image="imagen-msi.png" />
          </ul>
        </div>
      </div>
    </div>
  );
}

const SidebarItem = ({ name, image }) => {
  return (
    <li className="flex flex-col items-center p-2 hover:bg-lime-700 border border-red-600 rounded-md transition duration-300 my-5 mt-5">
      <span className="text-slate mb-2">{name}</span>
      <img src={image} alt={name} className="w-12 h-12 rounded-full" />
    </li>
  );
}

export default Sidebar;
