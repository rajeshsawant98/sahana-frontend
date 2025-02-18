import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const ProtectedRoute = ({ element }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const verifyToken = async () => {
            const accessToken = localStorage.getItem("access_token");

            if (!accessToken) {
                setIsAuthenticated(false);
                return;
            }

            try {
                // Call any protected route to verify the token
                await axiosInstance.get("/auth/me");
                setIsAuthenticated(true);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    try {
                        // Attempt token refresh
                        const refreshResponse = await axiosInstance.post("/auth/refresh");
                        localStorage.setItem("access_token", refreshResponse.data.access_token);
                        setIsAuthenticated(true);
                    } catch (refreshError) {
                        console.error("Session expired. Redirecting to login.");
                        localStorage.removeItem("access_token");
                        setIsAuthenticated(false);
                    }
                } else {
                    setIsAuthenticated(false);
                }
            }
        };

        verifyToken();
    }, []);

    if (isAuthenticated === null) return <div>Loading...</div>; // Show loading while checking
    return isAuthenticated ? element : <Navigate to="/" />;
};

export default ProtectedRoute;