import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export const useTheme = () => {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  return { darkMode };
};
