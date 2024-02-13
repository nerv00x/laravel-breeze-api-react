import { createContext, useEffect, useState } from "react";
import axios from "../lib/axios"; // Asegúrate de importar axios desde la ubicación correcta
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext({});
const SESSION_NAME = "session-verified";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();
  const sessionData = window.localStorage.getItem(SESSION_NAME);
  const initialSessionVerified = sessionData ? JSON.parse(sessionData) : false;
  const [sessionVerified, setSessionVerified] = useState(
    initialSessionVerified
  );

  const csrf = () => axios.get("/sanctum/csrf-cookie");

  // Función para realizar una solicitud GET
  const getApiData = async (url) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };
  const postApiData = async (url, data) => {
    try {
      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  // Función para realizar una solicitud POST a la ruta "/api/apuestas"
  const postApuestas = async (apuestaData) => {
    try {
      await csrf(); // Asegúrate de tener definida la función csrf
      const response = await postApiData("/api/apuestas", apuestaData);
      return response;
    } catch (error) {
      console.error("Error creating apuesta:", error);
      throw error;
    }
  };

  // Función para obtener el usuario
  const getUser = async () => {
    try {
      const data = await getApiData("/api/user");
      setUser(data);
      setSessionVerified(true);
      window.localStorage.setItem(SESSION_NAME, "true");
      // Guardar el ID del usuario en sessionStorage
      sessionStorage.setItem("userId", data.id);
    } catch (error) {
      console.error("Error getting user:", error);
    }
  };
  const login = async ({ ...data }) => {
    setErrors({});
    setLoading(true);
    try {
      await csrf();
      await axios.post("/login", data);
      await getUser();
    } catch (e) {
      if (typeof e === "object" && e !== null && "response" in e) {
        console.warn(e.response.data);
        setErrors(e.response.data.errors);
      } else {
        console.warn(e);
      }
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };
  const register = async ({ ...data }) => {
    setErrors({});
    setLoading(true);
    try {
      await csrf();
      await axios.post("/register", data);
      await getUser();
    } catch (e) {
      if (typeof e === "object" && e !== null && "response" in e) {
        console.warn(e.response.data);
        setErrors(e.response.data.errors);
      } else {
        console.warn(e);
      }
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };
  const sendPasswordResetLink = async ({ ...data }) => {
    setErrors({});
    setLoading(true);
    setStatus(null);
    try {
      await csrf();
      const response = await axios.post("/forgot-password", data);
      setStatus(response.data?.status);
    } catch (e) {
      if (typeof e === "object" && e !== null && "response" in e) {
        console.warn(e.response.data);
        setErrors(e.response.data.errors);
      } else {
        console.warn(e);
      }
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };
  const newPassword = async ({ ...data }) => {
    setErrors({});
    setLoading(true);
    setStatus(null);
    try {
      await csrf();
      const response = await axios.post("/reset-password", data);
      setStatus(response.data?.status);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (e) {
      if (typeof e === "object" && e !== null && "response" in e) {
        console.warn(e.response.data);
        setErrors(e.response.data.errors);
      } else {
        console.warn(e);
      }
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };
  const sendEmailVerificationLink = async () => {
    setErrors({});
    setLoading(true);
    setStatus(null);
    try {
      await csrf();
      const response = await axios.post("/email/verification-notification");
      setStatus(response.data?.status);
    } catch (e) {
      if (typeof e === "object" && e !== null && "response" in e) {
        console.warn(e.response.data);
        setErrors(e.response.data.errors);
      } else {
        console.warn(e);
      }
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };
  const logout = async () => {
    try {
      setSessionVerified(false);
      await axios.post("/logout");
      setUser(null);
      window.localStorage.removeItem(SESSION_NAME);
    } catch (e) {
      console.warn(e);
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        await getUser();
      } catch (e) {
        console.warn(e);
      } finally {
        setLoading(false);
        setSessionVerified(false);
      }
    };
    if (!user) {
      fetchUser();
    }
  }, [user]);
  return (
    <AuthContext.Provider
      value={{
        getApiData,
        postApiData,
        postApuestas,
        csrf,
        errors,
        user,
        login,
        register,
        logout,
        loading,
        status,
        sessionVerified,
        setStatus,
        sendPasswordResetLink,
        newPassword,
        sendEmailVerificationLink,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
