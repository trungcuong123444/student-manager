import { Navigate, useLocation } from "react-router-dom";

const PrivateRouteAdmin = ({ children }) => {
  const location = useLocation();

  let role = localStorage.getItem('role')
  if (role === 'admin') {
    return children;
  }
  
  return <Navigate state={location.pathname} to="/auth/sign-in" />;
};

export default PrivateRouteAdmin;
