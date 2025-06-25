import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, initialize } from "../redux/slices/authSlice";
import { refreshToken, getCurrentUser } from "../apis/authAPI";
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

        const user = await getCurrentUser();

        console.log("🔎 /auth/me response:", user);

        dispatch(
          login({
            user,
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
  }, [dispatch, initialized, profileFetchedAt, cachedUser]);

  return null;
};

export default AuthBootstrap;