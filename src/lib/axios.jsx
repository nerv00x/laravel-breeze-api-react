import axios from 'axios';
const instance = axios.create({
    baseURL:"https://laravel-breeze-api-react-1.onrender.com",
    withXSRFToken: true,
    withCredentials: true,
    xsrfCookieName:'XSRF-TOKEN',
    xsrfHeaderName:'X-XSRF-TOKEN',
    headers:{
        Accept:'aplication/json',
    }
});
// Add a response interceptor
instance.interceptors.response.use((response) => {
    // If the request was successful, return the response
    return response;
}, (error) => {
    // If there's an error in the response, handle it here
    throw error;
});
export default instance;
