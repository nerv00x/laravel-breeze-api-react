import React, { useState } from 'react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Botón de alternancia del Sidebar */}













      {/* Contenido del Sidebar */}
      <div
        className={`border-2 bg-opacity-75 h-full fixed bottom-0 left-0 lg:w-40 md:w-32 w-16 overflow-y-auto z-40 ${isOpen ? 'block' : 'hidden lg:block'
          }`}
        style={{ flexDirection: 'column-reverse' }} // Cambia la dirección del flujo de columnas de abajo hacia arriba
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
