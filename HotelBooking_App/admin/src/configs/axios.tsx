import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:8080/api/'
})

const instanceAdmin = axios.create({
    baseURL: 'http://localhost:8080/api/'
})

export default instance
export { instanceAdmin }
