import axios from 'axios';
const instance = axios.create({
    baseURL: "https://harkaitzreact.informaticamajada.es",
    withXSRFToken: true,
    withCredentials: true,
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
