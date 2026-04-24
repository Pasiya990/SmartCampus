import Topbar from "./Topbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import "./UserLayout.css";

export default function UserLayout() {
  const role = localStorage.getItem("role");

  const isUser = role === "USER";

  return (
    <div className="layout">

      {/* ✅ ONLY FOR USER */}
      {isUser && <Topbar />}

      <main className="layout-content">
        <Outlet />
      </main>

      {/* ✅ ONLY FOR USER */}
      {isUser && <Footer />}

    </div>
  );
}