import axios from 'axios';
import { data } from 'react-router-dom';

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

export const addNewRecords = async (data) => {
    try {
        const response = await api.post('/records', data)
        return response.data
    } catch(error) {
        console.error("error creating new record", error)
        throw error
    }
}

export const updateRecords = async (type, id, data) => {
    try {
        const response = await api.put(`/records/${type}/${id}`, data)
        return response.data;
    } catch (error) {
        console.error("Error updating record:", error);
        throw error;
    }
}

export const deleteRecords = async (type, id) => {
    try {
        const response = await api.delete(`records/${type}/${id}`)
        return response.data
    } catch (error) {
        console.error("Error deleting record:", error);
        throw error;
    }
}