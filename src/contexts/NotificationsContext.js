import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
  const { user } = useAuth();
  const [allNotifications, setAllNotifications] = useState([]);

  // Load from localStorage initially
  useEffect(() => {
    try {
      const raw = localStorage.getItem("notifications");
      setAllNotifications(raw ? JSON.parse(raw) : []);
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
        const raw = localStorage.getItem("notifications");
        setAllNotifications(raw ? JSON.parse(raw) : []);
      } catch (e) {
        // ignore
      }
    }, 30000);

    return () => {
      window.removeEventListener("storage", handler);
      clearInterval(interval);
    };
  }, []);

  // Filter notifications for current user (loose equality)
  const notifications = user
    ? allNotifications.filter((n) => String(n.recipientId) === String(user.userId))
    : [];

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
    const updated = [...allNotifications, n];
    setAllNotifications(updated);
    persist(updated);
    return n;
  }

  function markAsRead(id) {
    const updated = allNotifications.map((x) => (x.id === id ? { ...x, read: true } : x));
    setAllNotifications(updated);
    persist(updated);
  }

  function markAllRead() {
    const updated = allNotifications.map((x) => ({ ...x, read: true }));
    setAllNotifications(updated);
    persist(updated);
  }

  return (
    <NotificationsContext.Provider
      value={{ notifications, createNotification, markAsRead, markAllRead, allNotifications }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}

export default NotificationsContext;
