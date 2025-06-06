import axios from "axios";

const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1` || "http://localhost:4000/api/v1",
    withCredentials: true // This allows cookies to be sent with requests, useful for authentication
});

export default axiosInstance;
