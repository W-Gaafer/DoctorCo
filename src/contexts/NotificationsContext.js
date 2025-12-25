import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
  const { user } = useAuth();
  const [allNotifications, setAllNotifications] = useState([]);

  // Load from localStorage initially
  useEffect(() => {
    try {
      const storedNotifications = localStorage.getItem("notifications");
      setAllNotifications(
        storedNotifications ? JSON.parse(storedNotifications) : []
      );
    } catch (e) {
      setAllNotifications([]);
    }
  }, []);

  // Keep synced across tabs / changes
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "notifications") {
        try {
          setAllNotifications(e.newValue ? JSON.parse(e.newValue) : []);
        } catch (err) {
          setAllNotifications([]);
        }
      }
    };
    window.addEventListener("storage", handler);
    const interval = setInterval(() => {
      try {
        const storedNotifications = localStorage.getItem("notifications");
        setAllNotifications(
          storedNotifications ? JSON.parse(storedNotifications) : []
        );
      } catch (e) {
        // ignore
      }
    }, 30000);

    return () => {
      window.removeEventListener("storage", handler);
      clearInterval(interval);
    };
  }, []);

  // Filter notifications for current user and sort by newest first
  const notifications = (() => {
    if (!user) return [];
    const ids = [user.userId, user.id, user.email, user.phoneNumber]
      .filter((x) => x !== undefined && x !== null)
      .map((x) => String(x));

    const matched = allNotifications
      .filter((n) => ids.includes(String(n.recipientId)))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // الأحدث فوق

    // Debug
    if (allNotifications.length > 0 && matched.length === 0) {
      // eslint-disable-next-line no-console
      console.warn(
        "Notifications present but none matched current user. user ids:",
        ids,
        "notifications:",
        allNotifications
      );
    }

    return matched;
  })();

  function persist(list) {
    try {
      localStorage.setItem("notifications", JSON.stringify(list));
    } catch (err) {
      // ignore
    }
  }

  function createNotification(notification) {
    const n = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      read: false,
      createdAt: new Date().toISOString(),
      ...notification,
    };
    let created = null;
    setAllNotifications((prev) => {
      // ضيف الإشعار الجديد في البداية ليظهر فوق
      const updated = [n, ...prev];
      persist(updated);
      created = n;
      return updated;
    });
    return created;
  }

  function markAsRead(id) {
    setAllNotifications((prev) => {
      const updated = prev.map((x) => (x.id === id ? { ...x, read: true } : x));
      persist(updated);
      return updated;
    });
  }

  function markAllRead() {
    setAllNotifications((prev) => {
      const updated = prev.map((x) => ({ ...x, read: true }));
      persist(updated);
      return updated;
    });
  }

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        createNotification,
        markAsRead,
        markAllRead,
        allNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}

export default NotificationsContext;
