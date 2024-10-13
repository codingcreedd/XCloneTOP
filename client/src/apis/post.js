import axios from 'axios'

export default axios.create({
    baseURL: `http://localhost:4000/post`,
    withCredentials: true,
    validateStatus: (status) => {
        return true;
    }
});