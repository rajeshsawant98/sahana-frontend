import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, initialize } from "../redux/slices/authSlice";
import { fetchCreatedEvents, fetchRSVPedEvents } from "../redux/slices/userEventsSlice";
import { refreshToken, getCurrentUser } from "../apis/authAPI";
import { updateAccessToken } from "../redux/tokenManager";
import { RootState } from "../redux/store";
import { AppDispatch } from "../redux/store";

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const AuthBootstrap = () => {
  const dispatch: AppDispatch = useDispatch();
  const {
    profileFetchedAt,
    user: cachedUser,
    initialized,
  } = useSelector((state: RootState) => state.auth);

  const ranOnce = useRef(false);

  useEffect(() => {
    if (initialized || ranOnce.current) return;
    ranOnce.current = true;

    const refreshSession = async () => {
      const storedRefreshToken = localStorage.getItem("refreshToken");
      if (!storedRefreshToken) {
        dispatch(initialize());
        return;
      }

      try {
        const refreshData = await refreshToken(storedRefreshToken);
        const accessToken: string = refreshData.access_token;

        // Update token manager with new access token
        updateAccessToken(accessToken);

        // Update refresh token if a new one is provided (token rotation)
        if (refreshData.refresh_token && refreshData.refresh_token !== storedRefreshToken) {
          localStorage.setItem("refreshToken", refreshData.refresh_token);
        }

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
          
          // Fetch user events data in the background for better UX
          // Use Promise.allSettled to handle errors gracefully
          Promise.allSettled([
            dispatch(fetchCreatedEvents({ page: 1, page_size: 12 })),
            dispatch(fetchRSVPedEvents({ page: 1, page_size: 12 }))
          ]).catch((error) => {
            console.warn("Some user events failed to load:", error);
          });
          return;
        }

        const user = await getCurrentUser();

        dispatch(
          login({
            user,
            accessToken,
            role: user.role,
          })
        );
        
        // Fetch user events data in the background for better UX
        // Use Promise.allSettled to handle errors gracefully
        Promise.allSettled([
          dispatch(fetchCreatedEvents({ page: 1, page_size: 12 })),
          dispatch(fetchRSVPedEvents({ page: 1, page_size: 12 }))
        ]).catch((error) => {
          console.warn("Some user events failed to load:", error);
        });
      } catch (err) {
        console.error("Authentication refresh failed:", err);
        localStorage.removeItem("refreshToken");
        updateAccessToken(""); // Clear token from token manager
        dispatch(initialize());
      }
    };

    refreshSession();
  }, [dispatch, initialized, profileFetchedAt, cachedUser]);

  return null;
};

export default AuthBootstrap;