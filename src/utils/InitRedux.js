import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setDispatch } from "../redux/tokenManager";

const InitRedux = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    setDispatch(dispatch);
  }, [dispatch]);
  return null;
};

export default InitRedux;