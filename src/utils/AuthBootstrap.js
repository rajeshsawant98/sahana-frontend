import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, initialize } from "../redux/slices/authSlice";
import axiosInstance from "../utils/axiosInstance";

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const AuthBootstrap = () => {
  const dispatch = useDispatch();
  const {
    profileFetchedAt,
    user: cachedUser,
    initialized,
  } = useSelector((state) => state.auth);
  const ranOnce = useRef(false);

  useEffect(() => {
    if (initialized || ranOnce.current) return;
    ranOnce.current = true;

    const refreshSession = async () => {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        dispatch(initialize());
        return;
      }

      try {
        const { data: refreshData } = await axiosInstance.post(
          "/auth/refresh",
          {
            refresh_token: refreshToken,
          }
        );

        const accessToken = refreshData.access_token;

        const isCacheValid =
          cachedUser &&
          profileFetchedAt &&
          Date.now() - profileFetchedAt < CACHE_TTL;

        if (isCacheValid) {
          dispatch(
            login({
              user: cachedUser,
              accessToken,
              role: cachedUser.role || "user",
            })
          );
          return;
        }

        const { data: user } = await axiosInstance.get("/auth/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        console.log("🔎 /auth/me response:", user);

        dispatch(
          login({
            user: {
              email: user.email,
              name: user.name,
              role: user.role,
              bio: user.bio,
              phoneNumber: user.phoneNumber,
              location: user.location,
              interests: user.interests,
              profile_picture: user.profile_picture,
              birthdate: user.birthdate,
              profession: user.profession,
            },
            accessToken,
            role: user.role,
          })
        );
      } catch (err) {
        localStorage.removeItem("refreshToken");
        dispatch(initialize());
      }
    };

    refreshSession();
  }, [dispatch, initialized]);

  return null;
};

export default AuthBootstrap;
