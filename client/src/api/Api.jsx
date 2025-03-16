import axios from 'axios';

//Create a reusable Axios instance
const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    }
})

export const fetchRecords = async () => {
    try {
        const response = await api.get('/records');
        return response.data
    } catch (error) {
        console.error("Error fetching records:", error);
        throw error
    }
}