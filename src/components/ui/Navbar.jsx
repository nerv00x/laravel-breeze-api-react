/* eslint-disable react-hooks/exhaustive-deps */
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";
import "./index.css";

const initialNavigation = [
  { name: "Home", path: "/", current: true },
  { name: "Directos", path: "/directos", current: false },
  { name: "Salas", path: "/salas", current: false },
  { name: "Apuestas", path: "/apuestas", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const Saldo = sessionStorage.getItem("Saldo")

export default function Navbar() {
  const { logout } = useAuthContext();
  const [navigation, setNavigation] = useState(initialNavigation);

  useEffect(() => {
    const user_tipo = sessionStorage.getItem("TipoUsuario");
    if (user_tipo === "admin" && !navigation.some(item => item.name === "Admin")) {
      setNavigation([
        ...navigation,
        { name: "Admin", path: "/admin", current: false }
      ]);
    }
    console.log(navigation);
  }, []);

  return (
    <Disclosure as="nav" className="bg-50 shadow-md" style={{ zIndex: 9999 }}>
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-stone-400 hover:bg-stone-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center mr-40">
                  <img
                    className="h-8 w-auto"
                    src="/logo.png"
                    alt="Your Company"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block ml-auto"> {/* Mover los enlaces hacia la derecha */}
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                          classNames(
                            isActive
                              ? "bg-stone-900 text-white"
                              : "text-stone-600 hover:bg-stone-700 hover:text-white",
                            "rounded-md px-3 py-2 text-sm font-medium"
                          )
                        }
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  className="relative rounded-full bg-stone-800 p-1 text-stone-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-stone-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://randomuser.me/api/portraits/men/1.jpg"
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-4 py-3">
                        <p className="text-sm">Signed in as</p>
                        <p className="font-bold text-gray-900">{sessionStorage.getItem("NombreUsuario")}</p>
                        <p className="text-sm text-gray-500">{sessionStorage.getItem("TipoUsuario")}</p>
                      </div>
                      <div className="border-t border-gray-100"></div>
                      <div className="px-4 py-3">
                        <p className="text-sm">Saldo</p>
                        <p className="font-bold text-gray-900">${Saldo}</p>
                      </div>
                      <div className="border-t border-gray-100"></div>
                      <div className="px-4 py-3">
                        <Link
                          to="/"
                          onClick={logout}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        >
                          Sign out
                        </Link>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    classNames(
                      isActive
                        ? "bg-stone-900 text-white"
                        : "text-stone-300 hover:bg-stone-700 hover:text-white",
                      "block rounded-md px-3 py-2 text-base font-medium"
                    )
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
