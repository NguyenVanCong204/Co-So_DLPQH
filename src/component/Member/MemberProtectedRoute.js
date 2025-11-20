import { useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

function MemberProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const location = useLocation();
  const warnedRef = useRef(false);
  const isAuthenticated = Boolean(token && user);

  if (!isAuthenticated) {
    if (!warnedRef.current) {
      toast.warn("Vui lòng đăng nhập để tiếp tục");
      warnedRef.current = true;
    }
    return <Navigate to="/" replace state={{ from: location?.pathname }} />;
  }

  return children;
}

export default MemberProtectedRoute;

