import axios from 'axios'

const instanceClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL 
})
export default instanceClient
