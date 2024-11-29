import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const location = useLocation();

  let role = localStorage.getItem('role')
  if (role === 'admin' || role === 'homeroom') {
    return children;
  }
  
  return <Navigate state={location.pathname} to="/auth/sign-in" />;
};

export default PrivateRoute;
