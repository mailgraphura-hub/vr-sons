import { Bell, LogOut, CheckCheck, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getService, patchService, deleteService } from "../../service/axios";

export default function Header() {
  const location = useLocation();

  const [userName, setUserName] = useState("User");
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  const fetchNotifications = async () => {
    const res = await getService("/notification");

    if (res.ok) {
      const data = res.data.data || [];

      setNotifications(data);

      // calculate unread count directly
      const unread = data.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    }
  };


  useEffect(() => {
    fetchNotifications();

    const storedName = localStorage.getItem("username");
    if (storedName) setUserName(storedName);
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, []);



  useEffect(() => {
    if (openNotification) {
      fetchNotifications();
    }
  }, [openNotification]);



  useEffect(() => {
    function handleClickOutside(e) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setOpenNotification(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setOpenUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  const markAsRead = async (id) => {
    await patchService(`/notification/${id}/read`);

    setNotifications((prev) =>
      prev.map((n) =>
        n._id === id ? { ...n, isRead: true } : n
      )
    );

    setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
  };

  /* ================= MARK ALL AS READ ================= */

  const markAllRead = async () => {
    await Promise.all(
      notifications
        .filter((n) => !n.isRead)
        .map((n) => patchService(`/notification/${n._id}/read`))
    );

    const updated = notifications.map((n) => ({
      ...n,
      isRead: true,
    }));

    setNotifications(updated);
    setUnreadCount(0);
  };

  /* ================= DELETE ALL ================= */

  const clearAll = async () => {
    await Promise.all(
      notifications.map((n) => deleteService(`/notification/${n._id}`))
    );

    setNotifications([]);
    setUnreadCount(0);
  };

  /* ================= PAGE TITLE ================= */

  const pageTitle =
    location.pathname.split("/").pop()?.replace(/-/g, " ") || "Dashboard";

  const formattedTitle =
    pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);

  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-30">
      <h1 className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-black to-gray-500 bg-clip-text text-transparent">
        {formattedTitle}
      </h1>

      <div className="flex items-center gap-6">
        {/* 🔔 NOTIFICATION */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setOpenNotification(!openNotification)}
            className="relative text-gray-600 hover:text-black transition"
          >
            <Bell size={20} />

            {/* 🔴 BADGE */}
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-md">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {openNotification && (
            <div className="absolute right-0 mt-4 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50">
                <h3 className="text-sm font-semibold">Notifications</h3>

                {notifications.length > 0 && (
                  <div className="flex gap-3 text-xs">
                    <button
                      onClick={markAllRead}
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <CheckCheck size={14} />
                      Mark all
                    </button>

                    <button
                      onClick={clearAll}
                      className="flex items-center gap-1 text-red-500 hover:underline"
                    >
                      <Trash2 size={14} />
                      Clear
                    </button>
                  </div>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-sm text-gray-500">
                    No notifications
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => markAsRead(item._id)}
                      className={`px-4 py-3 text-sm border-b hover:bg-gray-50 cursor-pointer ${
                        !item.isRead ? "bg-blue-50 font-semibold" : ""
                      }`}
                    >
                      {item.message}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* 👤 USER MENU */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setOpenUserMenu(!openUserMenu)}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium">{userName}</span>
          </button>

          {openUserMenu && (
            <div className="absolute right-0 mt-3 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600">
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}