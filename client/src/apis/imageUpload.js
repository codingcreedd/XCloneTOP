import axios from 'axios'

export default axios.create({
    baseURL: `http://localhost:4000/image`,
    withCredentials: true,
    validateStatus: (status) => {
        return true;
    }
});