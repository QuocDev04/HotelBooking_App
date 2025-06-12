import axios from 'axios'

const instanceClient = axios.create({
    baseURL: 'http://localhost:8080/api/'
})
export default instanceClient
