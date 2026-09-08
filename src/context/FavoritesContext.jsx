import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import api from '../API/axios'
import { useApp } from './AppContext'

const FavoritesContext = createContext(null)

export const useFavorites = () => useContext(FavoritesContext)

export function FavoritesProvider({ children }) {
  const { user } = useApp()
  const [favorites, setFavorites] = useState([])
  const [ids, setIds] = useState(() => new Set())
  const [loading, setLoading] = useState(false)

  const makeKey = (type, id) => `${type}-${id}`

  // ========== جلب المفضلة: GET /favorites/my ==========
  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([])
      setIds(new Set())
      return
    }
    try {
      setLoading(true)
      const { data } = await api.get('/favorites/my', { params: { page: 1, limit: 100 } })
      const list = Array.isArray(data.data) ? data.data : (data.data?.favorites || [])
      setFavorites(list)
      setIds(new Set(list.map(f => makeKey(f.favorable_type, f.favorable_id))))
    } catch (err) {
      console.error('Fetch favorites error:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetchFavorites() }, [fetchFavorites])

  // ========== هل العنصر في المفضلة؟ ==========
  const isFavorite = useCallback(
    (type, id) => ids.has(makeKey(type, id)),
    [ids]
  )

  // ========== تبديل المفضلة: POST /favorites/toggle ==========
  const toggleFavorite = useCallback(async (type, id) => {
    if (!user) {
      const err = new Error('UNAUTHENTICATED')
      err.code = 'UNAUTHENTICATED'
      throw err
    }

    const k = makeKey(type, id)
    const wasFav = ids.has(k)

    // ✅ تحديث تفاؤلي فوري (القلب يتغير قبل استجابة السيرفر)
    setIds(prev => {
      const next = new Set(prev)
      wasFav ? next.delete(k) : next.add(k)
      return next
    })

    try {
      await api.post('/favorites/toggle', {
        favorable_type: type,
        favorable_id: Number(id)
      })
      fetchFavorites() // مزامنة القائمة الكاملة
      return !wasFav   // true = أُضيف، false = أُزيل
    } catch (err) {
      // ❌ تراجع عن التحديث التفاؤلي عند الفشل
      setIds(prev => {
        const next = new Set(prev)
        wasFav ? next.add(k) : next.delete(k)
        return next
      })
      throw err
    }
  }, [ids, user, fetchFavorites])

  const value = useMemo(() => ({
    favorites,
    ids,
    loading,
    isFavorite,
    toggleFavorite,
    refetch: fetchFavorites,
    count: ids.size
  }), [favorites, ids, loading, isFavorite, toggleFavorite, fetchFavorites])

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}