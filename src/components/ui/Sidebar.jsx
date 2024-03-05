import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { Image } from 'primereact/image';

const CustomSidebar = () => {
  const [visible, setVisible] = useState(false);

  const items = [
    { name: 'LEC', image: 'imagen-lec.png' },
    { name: 'SUPERLIGA', image: 'imagen-superliga.png' },
    { name: 'MSI', image: 'imagen-msi.png' }
  ];

  return (
    <div className="custom-sidebar-container">
      <Button icon="pi pi-bars" onClick={() => setVisible(true)} className="p-button-rounded p-button-secondary p-button-text" />
      <Sidebar visible={visible} onHide={() => setVisible(false)} position="left" className="custom-sidebar">
        <ul className="p-d-flex p-flex-column p-jc-center p-ai-center">
          {items.map((item, index) => (
            <SidebarItem key={index} name={item.name} image={item.image} />
          ))}
        </ul>
      </Sidebar>
    </div>
  );
}

const SidebarItem = ({ name, image }) => {
  return (
    <li className="flex flex-col items-center p-2 hover:bg-lime-700 border border-red-600 rounded-md transition duration-300 my-5 mt-5">
      <span className="text-slate mb-2">{name}</span>
      <Image src={image} alt={name} className="w-6 h-6 rounded-full" />
    </li>
  );
}

export default CustomSidebar;
