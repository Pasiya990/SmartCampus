import Topbar from "./Topbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import "./UserLayout.css";

export default function UserLayout() {
  // ✅ Always decode fresh from token — never trust localStorage role alone
  let role = null;

  try {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      role = payload.role;

      // ✅ Keep localStorage in sync with token
      localStorage.setItem("role", role);
    }
  } catch {
    role = localStorage.getItem("role");
  }

  const isUser = role === "USER";

  return (
    <div className="layout">
      {isUser && <Topbar />}

      <main className="layout-content">
        <Outlet />
      </main>

      {isUser && <Footer />}
    </div>
  );
}