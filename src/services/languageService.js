import api from './apiClient'

export const fetchTranslations = (lang='en') =>
  api.get(`/i18n/translations?lang=${lang}`)
