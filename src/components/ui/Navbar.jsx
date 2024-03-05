import { Menubar } from "primereact/menubar";
import { Badge } from "primereact/badge";
import { BellIcon } from "@heroicons/react/24/outline";
import useAuthContext from "../../hooks/useAuthContext";
import { Fragment, useState } from "react";
import "./index.css"; // Importa tus estilos CSS personalizados aquí

const initialNavigation = [
  { label: "Home", icon: "pi pi-fw pi-home", command: () => { window.location = "/"; } },
  { label: "Directos", icon: "pi pi-fw pi-video", command: () => { window.location = "/directos"; } },
  { label: "Salas", icon: "pi pi-fw pi-chart-line", command: () => { window.location = "/salas"; } },
  { label: "Apuestas", icon: "pi pi-fw pi-dollar", command: () => { window.location = "/apuestas"; } },
  { label: "Admin", icon: "pi pi-fw pi-user-plus", command: () => { window.location = "/admin"; }, visible: sessionStorage.getItem("TipoUsuario") === "admin" }
];

const UserProfileIcon = () => (
  <img
    className="h-8 w-8 rounded-full"
    src="https://randomuser.me/api/portraits/men/1.jpg"
    alt=""
  />
);

export default function Navbar() {
  const { logout } = useAuthContext();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    // Redirigir a la página de inicio de sesión u otra página después de cerrar sesión si es necesario
  };

  return (
    <Menubar model={initialNavigation} end={
      <Fragment>
        <div className="bg-gray-800 rounded-full p-1 mr-4">
          <Badge value="4" severity="danger">
            <BellIcon className="h-6 w-6 text-white" aria-hidden="true" />
          </Badge>
        </div>
        <div className="relative">
          <button className="user-profile-button" onClick={() => setShowDropdown(!showDropdown)}>
            <UserProfileIcon />
          </button>
          {showDropdown && (
            <div className="dropdown-menu absolute mt-2 py-2 w-48 bg-gray-800 rounded-md shadow-lg">
              <div className="dropdown-item">
                <UserProfileIcon />
              </div>
              <div className="dropdown-item">
                <button className="logout-button" onClick={handleLogout}>Sign out</button>
              </div>
            </div>
          )}
        </div>
      </Fragment>
    } />
  );
}
