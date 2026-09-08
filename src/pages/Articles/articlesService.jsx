import api from '../../API/axios'

export const articlesService = {
  // جلب قائمة المقالات مع الفلاتر والترقيم
  async getAll(params = {}) {
    const { data } = await api.get('/articles', { params })
    return {
      articles: data.data || [],
      pagination: data.pagination || { total: 0, page: 1, totalPages: 1 }
    }
  },

  // جلب مقالة واحدة بالـ slug (الأفضل لـ SEO)
  async getBySlug(slug) {
    const { data } = await api.get(`/articles/slug/${slug}`)
    return data.data
  },

  // جلب مقالة واحدة بالـ ID
  async getById(id) {
    const { data } = await api.get(`/articles/${id}`)
    return data.data
  }
}