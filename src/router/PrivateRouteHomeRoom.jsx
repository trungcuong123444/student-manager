import { Navigate, useLocation } from "react-router-dom";

const PrivateRouteHomeRoom = ({ children }) => {
  const location = useLocation();

  let role = localStorage.getItem('role')
  if (role === 'none' || role === 'homeroom' || role === 'parent') {
    return children;
  }
  
  return <Navigate state={location.pathname} to="/auth/sign-in" />;
};

export default PrivateRouteHomeRoom;
