import Sidebar from "../components/user/sidebar";
import Header from "../components/user/Header";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 md:ml-64">
        <Header />
        <main className="pt-16 p-8 bg-gray-50 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
