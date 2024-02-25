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
  const csrf = () => axios.get('/sanctum/csrf-cookie');
  const getUser = async () => {
    try {
      const { data } = await axios.get('/api/user');
      setUser(data);
      setSessionVerified(true);
      window.localStorage.setItem(SESSION_NAME, 'true');
    } catch (e) {
      console.warn('Error ', e);
    }
  };

  const login = async ({ _token, ...restData }) => {
    const csrfToken = _token; // csrfToken now holds the value of _token
    const data = restData;    // data is an object with the rest of the properties
    setErrors({});
    setLoading(true);
    try {
      await csrf(); // This should set the CSRF cookie
      // Then you make the POST request with Axios which should now send the CSRF cookie
      await axios.post("/login", data, {
        headers: {
          'X-CSRF-TOKEN': csrfToken // Pass the CSRF token in the request headers
        }
      });
      await getUser();
    } catch (e) {
      // Here you handle errors, including any possible CSRF token mismatch
      // ...
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