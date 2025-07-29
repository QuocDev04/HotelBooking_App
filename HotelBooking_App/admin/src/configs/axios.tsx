import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:3002/api/'
})

const instanceAdmin = axios.create({
    baseURL: 'http://localhost:3002/api/'
})

export default instance
export { instanceAdmin }
