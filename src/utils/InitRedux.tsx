import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { setDispatch } from "../redux/tokenManager";

const InitRedux = () => {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    setDispatch(dispatch);
  }, [dispatch]);

  return null;
};

export default InitRedux;