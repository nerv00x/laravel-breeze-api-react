// Sidebar.jsx

import React from 'react';

const Sidebar = () => {
  return (
    <div className="lg:w-64 bg-gray-800 h-full fixed top-12  left-0 overflow-y-auto">
      <div className="p-4">
        <ul className="space-y-4">
          <SidebarItem name="LEC" image="imagen-lec.jpg" />
          <SidebarItem name="SUPERLIGA" image="imagen-superliga.jpg" />
          <SidebarItem name="MSI" image="imagen-msi.jpg" />
        </ul>
      </div>
    </div>
  );
}

const SidebarItem = ({ name, image }) => {
  return (
    <li className="flex flex-col items-center p-2 hover:bg-gray-700 rounded-md transition duration-300 mt-4">
      <span className="text-white mb-5">{name}</span>
      <img src={image} alt={name} className="w-10 h-10 rounded-full" />
    </li>
  );
}

export default Sidebar;
