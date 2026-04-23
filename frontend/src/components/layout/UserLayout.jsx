import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <div className="layout">
      <Topbar />
      <main className="layout-content">
        <Outlet />
      </main>
    </div>
  );
}