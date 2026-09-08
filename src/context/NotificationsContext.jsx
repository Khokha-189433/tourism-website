import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react'
import api from '../API/axios'
import { useApp } from './AppContext'

const defaultContextValue = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  fetchNotifications: () => {},
  fetchUnreadCount: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  addLocalNotification: () => {}, // ✅ جديد: إضافة إشعار محلي للاختبار
}

const NotificationsContext = createContext(defaultContextValue)

export const useNotifications = () => useContext(NotificationsContext)

export function NotificationsProvider({ children }) {
  const { user } = useApp()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const pollRef = useRef(null)

  // ========== استخراج العدد من استجابة API (بكل الصيغ الممكنة) ==========
  const extractCount = (data) => {
    if (typeof data === 'number') return data
    if (!data) return 0
    return (
      data.unread_count ??
      data.unreadCount ??
      data.count ??
      data.data?.unread_count ??
      data.data?.unreadCount ??
      data.data?.count ??
      data.data ??
      0
    )
  }

  // ========== استخراج القائمة من استجابة API (بكل الصيغ الممكنة) ==========
  const extractList = (data) => {
    if (Array.isArray(data)) return data
    if (Array.isArray(data?.data)) return data.data
    if (Array.isArray(data?.data?.notifications)) return data.data.notifications
    if (Array.isArray(data?.notifications)) return data.notifications
    return []
  }

  // ========== عدد غير المقروء ==========
  const fetchUnreadCount = useCallback(async () => {
    if (!user) return
    try {
      const { data } = await api.get('/notifications/unread-count')
      const count = Number(extractCount(data)) || 0
      setUnreadCount(count)
    } catch (err) {
      // 404 يعني أن الـ endpoint غير موجود بعد - تجاهل
      if (err.response?.status !== 404) {
        console.error('Fetch unread count error:', err)
      }
    }
  }, [user])

  // ========== قائمة الإشعارات ==========
  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([])
      setUnreadCount(0)
      return
    }
    setLoading(true)
    try {
      const { data } = await api.get('/notifications', { params: { page: 1, limit: 50 } })
      const list = extractList(data)
      setNotifications(list)
      await fetchUnreadCount()
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error('Fetch notifications error:', err)
      }
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }, [user, fetchUnreadCount])

  // ========== تعليم كمقروء ==========
  const markAsRead = useCallback(async (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read_at: n.read_at || new Date().toISOString(), is_read: true } : n))
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
    try {
      await api.patch(`/notifications/${id}/read`)
    } catch (err) {
      console.error('Mark as read error:', err)
      fetchNotifications()
    }
  }, [fetchNotifications])

  // ========== تعليم الكل كمقروء ==========
  const markAllAsRead = useCallback(async () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString(), is_read: true }))
    )
    setUnreadCount(0)
    try {
      await api.patch('/notifications/read-all')
    } catch (err) {
      console.error('Mark all as read error:', err)
      fetchNotifications()
    }
  }, [fetchNotifications])

  // ✅ جديد: إضافة إشعار محلي للاختبار (مؤقت - يختفي عند إعادة التحميل)
  const addLocalNotification = useCallback((notif) => {
    const newNotif = {
      id: `local-${Date.now()}`,
      type: 'general',
      title_ar: notif.title || 'إشعار تجريبي',
      message_ar: notif.message || 'هذا إشعار تجريبي من الواجهة',
      createdAt: new Date().toISOString(),
      read_at: null,
      is_read: false,
      ...notif,
    }
    setNotifications(prev => [newNotif, ...prev])
    setUnreadCount(prev => prev + 1)
  }, [])

  // ========== polling كل 15 ثانية (أسرع للاختبار) ==========
  useEffect(() => {
    if (!user) {
      setNotifications([])
      setUnreadCount(0)
      return
    }
    fetchNotifications()
    pollRef.current = setInterval(fetchUnreadCount, 15000)
    return () => clearInterval(pollRef.current)
  }, [user, fetchNotifications, fetchUnreadCount])

  const value = useMemo(() => ({
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    addLocalNotification,
  }), [notifications, unreadCount, loading, fetchNotifications, fetchUnreadCount, markAsRead, markAllAsRead, addLocalNotification])

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}