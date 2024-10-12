import axios from 'axios'

export default axios.create({
    baseURL: `http://localhost:4000/user`,
    withCredentials: true,
    validateStatus: (status) => {
        return true;
    }
});