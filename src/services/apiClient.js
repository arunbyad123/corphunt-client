import axios from 'axios'

// Use proxy base during dev. In production, set VITE_API_BASE accordingly.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api'
})

// Attach token later when you implement auth
// api.interceptors.request.use((config)=>{
//   const token = localStorage.getItem('token')
//   if(token) config.headers.Authorization = `Bearer ${token}`
//   return config
// })

export default api
