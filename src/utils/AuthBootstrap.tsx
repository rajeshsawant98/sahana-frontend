import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, initialize } from "../redux/slices/authSlice";
import { fetchInitialCreatedEvents, fetchInitialRsvpEvents } from "../redux/slices/userEventsSlice";
import { refreshToken, getCurrentUser } from "../apis/authAPI";
import { updateAccessToken, getAccessToken } from "../redux/tokenManager";
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
    if (ranOnce.current) return;
    ranOnce.current = true;

    const refreshSession = async () => {
      const storedRefreshToken = localStorage.getItem("refreshToken");
      if (!storedRefreshToken) {
        dispatch(initialize());
        return;
      }

      try {
        // If we have a valid cache, we can skip the network call for the profile
        // But we might still want to refresh the token if it's old?
        // For now, we trust the cache logic below.
        
        const isCacheValid =
          cachedUser &&
          profileFetchedAt &&
          Date.now() - profileFetchedAt < CACHE_TTL;

        if (isCacheValid) {
           // Even if cache is valid, we might want to ensure we have a valid access token.
           // But since we persist the access token, and axios interceptors handle 401s,
           // we can safely rely on the persisted state + background refresh if needed.
           // However, let's at least trigger the event fetches if they are missing?
           // Actually, if userEvents is persisted, we might not need to fetch them again immediately.
           // But let's keep the behavior to fetch them to ensure freshness.
           
          dispatch(
            login({
              user: cachedUser,
              accessToken: getAccessToken() || "", // Use current token or empty
              role: cachedUser.role || "user",
            })
          );
          
          // Fetch user events data in the background for better UX
          Promise.allSettled([
            dispatch(fetchInitialCreatedEvents({ page_size: 12 })),
            dispatch(fetchInitialRsvpEvents({ page_size: 12 }))
          ]).catch((error) => {
            console.warn("Some user events failed to load:", error);
          });
          return;
        }

        // If cache is invalid or missing, we do the full refresh flow
        const refreshData = await refreshToken(storedRefreshToken);
        const accessToken: string = refreshData.access_token;

        // Update token manager with new access token
        updateAccessToken(accessToken);

        // Update refresh token if a new one is provided (token rotation)
        if (refreshData.refresh_token && refreshData.refresh_token !== storedRefreshToken) {
          localStorage.setItem("refreshToken", refreshData.refresh_token);
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
        Promise.allSettled([
          dispatch(fetchInitialCreatedEvents({ page_size: 12 })),
          dispatch(fetchInitialRsvpEvents({ page_size: 12 }))
        ]).catch((error) => {
          console.warn("Some user events failed to load:", error);
        });
      } catch (err) {
        console.error("Authentication refresh failed:", err);
        // Only clear if it's a real failure, not just network offline?
        // For now, keep existing logic but maybe be more careful.
        localStorage.removeItem("refreshToken");
        updateAccessToken(""); // Clear token from token manager
        dispatch(initialize());
      }
    };

    refreshSession();
  }, [dispatch, profileFetchedAt, cachedUser]);

  return null;
};

export default AuthBootstrap;