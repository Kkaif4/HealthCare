// frontend/src/components/Common/ProtectedRoute.jsx
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading, checkAuthState } = AuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      if (!loading && !user) {
        const isAuthenticated = await checkAuthState();
        if (!isAuthenticated) navigate("/login");
      }
    };
    verifyAuth();
  }, [user, loading, checkAuthState, navigate]);

  if (loading) return <div className="text-center p-8">Loading...</div>;
  return user ? <Outlet /> : null;
};

export default ProtectedRoute;
