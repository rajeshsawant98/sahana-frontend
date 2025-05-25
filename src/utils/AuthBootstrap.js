import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login, initialize } from "../redux/slices/authSlice";
import axiosInstance from "../utils/axiosInstance";

const AuthBootstrap = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const refresh = async () => {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        dispatch(initialize());
        return;
      }

      try {
        const res = await axiosInstance.post("/auth/refresh", {
          refresh_token: refreshToken,
        });

        dispatch(
          login({
            user: { email: res.data.email },
            accessToken: res.data.access_token,
            role: res.data.role,
          })
        );
      } catch (err) {
        localStorage.removeItem("refreshToken");
        dispatch(initialize());
        console.warn("Auto-login failed.");
      }
    };

    refresh();
  }, [dispatch]);

  return null;
};

export default AuthBootstrap;