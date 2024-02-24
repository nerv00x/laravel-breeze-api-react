import axios from 'axios';

const instance = axios.create({
    baseURL: "http://lapachanga-back.v2.test", // Asegúrate de incluir el protocolo 'http://' o 'https://'
    withXSRFToken: true,
    withCredentials: true,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    headers: {
        Accept: 'application/json', // Corrige el typo 'aplication' a 'application'
    }
});

// Agrega un interceptor de respuesta
instance.interceptors.response.use(
    (response) => {
        // Si la solicitud fue exitosa, devuelve la respuesta
        return response;
    },
    (error) => {
        // Si hay un error en la respuesta, manejarlo aquí
        throw error;
    }
);

export default instance;
