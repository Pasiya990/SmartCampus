import Topbar from "./Topbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import "./UserLayout.css";

export default function UserLayout() {
  return (
    <div className="layout">

      <header className="layout-header">
        <Topbar />
      </header>

      <main className="layout-content">
        <Outlet />
      </main>

      <footer className="layout-footer">
        <Footer />
      </footer>

    </div>
  );
}