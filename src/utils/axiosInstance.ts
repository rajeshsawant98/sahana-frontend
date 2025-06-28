import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { updateAccessToken, getAccessToken } from "../redux/tokenManager";

// Set base URL and headers
const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api", 
    //baseURL: "https://sahana-backend-856426602401.us-west1.run.app/api", // Use this for production
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Ensures cookies (refresh token) are sent if used
});

// Attach access token to every request
axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const accessToken = getAccessToken();
        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle expired tokens
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error) => {
        
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Prevent infinite loops

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) throw new Error("No refresh token found");

                // Request a new access token
                const res = await axios.post(
                    "https://sahana-backend-856426602401.us-west1.run.app/api/auth/refresh",
                    //"http://localhost:8000/api/auth/refresh",
                    { refresh_token: refreshToken }
                );

                const newAccessToken: string = res.data.access_token;
                updateAccessToken(newAccessToken); // Update Redux store or context

                // Retry original request with new token
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }
                return axiosInstance(originalRequest);
            } catch (err) {
                console.error("Session expired. Redirecting to login.");
                localStorage.removeItem("refreshToken");
                updateAccessToken(""); // Clear token via tokenManager
                window.location.href = "/"; // Redirect user
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
