import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
    const user = JSON.parse(localStorage.getItem("user"));//calling json for user
    if (!user) return <Navigate to="/login" replace />;//if user is not true then stay login
    if (user.role !== allowedRole) return <Navigate to={`/${user.role}page`} replace />;//check if user = role for specfic login 
  
    return children;
  };

export default ProtectedRoute;
