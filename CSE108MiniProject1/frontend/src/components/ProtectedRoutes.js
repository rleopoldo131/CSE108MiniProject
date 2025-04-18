import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== allowedRole) return <Navigate to={`/${user.role}page`} replace />;
  
    return children;
  };

export default ProtectedRoute;
