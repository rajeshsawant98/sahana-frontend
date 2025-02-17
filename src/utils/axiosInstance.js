import axios from "axios";

// Set base URL and headers
const axiosInstance = axios.create({
    //baseURL: "http://localhost:8000/api", 
    baseURL: "https://sahana-backend-856426602401.us-west1.run.app/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Add Authorization header if token exists
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;