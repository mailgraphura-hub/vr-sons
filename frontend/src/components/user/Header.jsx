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
    try {
      const res = await getService("/notification");
      if (res?.ok) {
        const data = res.data.data || [];
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.isRead).length);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const storedName = localStorage.getItem("username");
    if (storedName) setUserName(storedName);
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (openNotification) fetchNotifications();
  }, [openNotification]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (notificationRef.current && !notificationRef.current.contains(e.target))
        setOpenNotification(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setOpenUserMenu(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    await patchService(`/notification/${id}/read`);
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const markAllRead = async () => {
    await Promise.all(
      notifications.filter((n) => !n.isRead).map((n) => patchService(`/notification/${n._id}/read`))
    );
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const clearAll = async () => {
    await Promise.all(notifications.map((n) => deleteService(`/notification/${n._id}`)));
    setNotifications([]);
    setUnreadCount(0);
  };

  const pageTitle = location.pathname.split("/").pop()?.replace(/-/g, " ") || "Dashboard";
  const formattedTitle = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);

  const avatarInitial = userName.charAt(0).toUpperCase();

  return (
    <header
      className="fixed top-0 right-0 left-0 md:left-64 h-16 flex items-center justify-between px-4 md:px-8 z-30"
      style={{ backgroundColor: "#fffaf6", borderBottom: "1px solid #ede0d4" }}
    >
      {/* PAGE TITLE — desktop only */}
      <h1 className="hidden md:block text-xl font-bold text-stone-800 truncate">
        {formattedTitle}
      </h1>

      {/* Mobile spacer — keeps right-side icons pushed right */}
      <div className="md:hidden" />

      <div className="flex items-center gap-3 md:gap-5">

        {/* 🔔 NOTIFICATIONS */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setOpenNotification(!openNotification)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl transition"
            style={{ backgroundColor: "#fde8df" }}
          >
            <Bell size={17} color="#c97b5a" />
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 text-white text-[9px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1"
                style={{ backgroundColor: "#c97b5a" }}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {openNotification && (
            <div
              className="absolute right-0 mt-3 w-[calc(100vw-2rem)] sm:w-80 max-w-sm rounded-2xl shadow-xl overflow-hidden"
              style={{ backgroundColor: "#fff", border: "1px solid #ede0d4" }}
            >
              {/* Notif Header */}
              <div
                className="flex justify-between items-center px-4 py-3"
                style={{ backgroundColor: "#fde8df", borderBottom: "1px solid #f3d5c8" }}
              >
                <h3 className="text-sm font-bold text-stone-700">Notifications</h3>
                {notifications.length > 0 && (
                  <div className="flex gap-3 text-xs">
                    <button
                      onClick={markAllRead}
                      className="flex items-center gap-1 font-semibold"
                      style={{ color: "#c97b5a" }}
                    >
                      <CheckCheck size={13} />
                      Mark all
                    </button>
                    <button
                      onClick={clearAll}
                      className="flex items-center gap-1 text-red-400 font-semibold"
                    >
                      <Trash2 size={13} />
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {/* Notif List */}
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-sm text-stone-400">
                    No notifications
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => markAsRead(item._id)}
                      className="px-4 py-3 text-sm cursor-pointer transition"
                      style={{
                        borderBottom: "1px solid #f5ede4",
                        backgroundColor: !item.isRead ? "#fef6f0" : "#fff",
                        fontWeight: !item.isRead ? "600" : "400",
                        color: !item.isRead ? "#92400e" : "#57534e",
                      }}
                    >
                      <div className="flex items-start gap-2">
                        {!item.isRead && (
                          <span
                            className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: "#c97b5a" }}
                          />
                        )}
                        <span className={!item.isRead ? "ml-0" : "ml-4"}>{item.message}</span>
                      </div>
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
            className="flex items-center gap-2.5"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-sm"
              style={{ backgroundColor: "#c97b5a", color: "#fff" }}
            >
              {avatarInitial}
            </div>
            <div className="hidden sm:flex flex-col items-start leading-tight">
              <span className="text-sm font-semibold text-stone-700 max-w-[120px] truncate">
                {userName}
              </span>
              <span className="text-xs" style={{ color: "#c97b5a" }}>
                My Account
              </span>
            </div>
          </button>

          {openUserMenu && (
            <div
              className="absolute right-0 mt-3 w-44 rounded-2xl shadow-lg overflow-hidden py-1"
              style={{ backgroundColor: "#fff", border: "1px solid #ede0d4" }}
            >
              <button className="w-full text-left px-4 py-3 text-sm font-medium flex items-center gap-2 hover:bg-red-50 transition"
                style={{ color: "#c0392b" }}
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}