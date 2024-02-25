import { createContext, useEffect, useState } from 'react';
import axios from '../lib/axios';
import { redirect, useNavigate } from 'react-router-dom';
export const AuthContext = createContext({});
const SESSION_NAME = 'session-verified';
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();
  const sessionData = window.localStorage.getItem(SESSION_NAME);
  const initialSessionVerified = sessionData ? JSON.parse(sessionData) : false;
  const [sessionVerified, setSessionVerified] = useState(initialSessionVerified);
  const csrf = () => {
    return fetch('/sanctum/csrf-cookie', {
      credentials: 'include', // Necesario para cookies como la CSRF
    });
  };

  const getUser = async () => {
    try {
      const response = await fetch('/api/user', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Network response was not ok.');
      const data = await response.json();
      setUser(data);
      setSessionVerified(true);
      window.localStorage.setItem(SESSION_NAME, 'true');
    } catch (e) {
      console.warn('Error ', e);
    }
  };

  const login = async (data) => {
    setErrors({});
    setLoading(true);
    try {
      await csrf(); // Esto debería configurar la cookie CSRF
      // Luego haces la petición POST con Fetch que ya debería enviar la cookie CSRF
      const response = await fetch("https://harkaitz.informaticamajada.es/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Para incluir la cookie CSRF
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Network response was not ok.');
      await getUser();
    } catch (e) {
      // Aquí manejas los errores, incluyendo el posible desajuste del token CSRF
      console.error(e.message);
      // ... manejo de errores específicos ...
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };
  const register = async ({ ...data }) => {
    setErrors({});
    setLoading(true);
    try {
      await csrf();
      await axios.post('/register', data);
      await getUser();
      navigate("/")
    }
    catch (e) {
      if (typeof e === 'object' && e !== null && 'response' in e) {
        console.warn(e.response.data);
        setErrors(e.response.data.errors);
      }
      else {
        console.warn(e);
      }
    }
    finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };
  const sendPasswordResetLink = async ({ ...data }) => {
    setErrors({});
    setLoading(true);
    setStatus(null);
    try {
      await csrf();
      const response = await axios.post('/forgot-password', data);
      setStatus(response.data?.status);
    }
    catch (e) {
      if (typeof e === 'object' && e !== null && 'response' in e) {
        console.warn(e.response.data);
        setErrors(e.response.data.errors);
      }
      else {
        console.warn(e);
      }
    }
    finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };
  const newPassword = async ({ ...data }) => {
    setErrors({});
    setLoading(true);
    setStatus(null);
    try {
      await csrf();
      const response = await axios.post('/reset-password', data);
      setStatus(response.data?.status);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
    catch (e) {
      if (typeof e === 'object' && e !== null && 'response' in e) {
        console.warn(e.response.data);
        setErrors(e.response.data.errors);
      }
      else {
        console.warn(e);
      }
    }
    finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };
  const sendEmailVerificationLink = async () => {
    setErrors({});
    setLoading(true);
    setStatus(null);
    try {
      await csrf();
      const response = await axios.post('/email/verification-notification');
      setStatus(response.data?.status);
    }
    catch (e) {
      if (typeof e === 'object' && e !== null && 'response' in e) {
        console.warn(e.response.data);
        setErrors(e.response.data.errors);
      }
      else {
        console.warn(e);
      }
    }
    finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };
  const logout = async () => {
    try {
      setSessionVerified(false);
      await axios.post('/logout');
      setUser(null);
      window.localStorage.removeItem(SESSION_NAME);
    }
    catch (e) {
      console.warn(e);
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        await getUser();
      }
      catch (e) {
        console.warn(e);
      }
      finally {
        setLoading(false);
        setSessionVerified(false);
      }
    };
    if (!user) {
      fetchUser();
    }
  }, [user]);
  return (<AuthContext.Provider value={{
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
  }}>
    {children}
  </AuthContext.Provider>);
}