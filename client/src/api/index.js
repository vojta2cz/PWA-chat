import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
})

export const insertUser = payload => api.post(`/user`, payload)
export const loginUser = payload => api.post(`/login`, payload)
export const getAllUsers = name => api.get(`/list/${name}`)
//export const updateUserById = (id, payload) => api.put(`/user/${id}`, payload)
const deleteUserById = id => api.delete(`/user/${id}`)
export const getUserById = mail => api.get(`/user/${mail}`)
export const getUserByName = name => api.get(`/user/${name}`);

export const createRoom = payload => api.post(`/room`, payload)
export const deleteRoom = payload => api.post(`/deleteRoom`, payload)
export const getAllRooms = name => api.get(`/rooms/${name}`)
export const getRoomById = id => api.get(`/room/${id}`)

export const getAllMessages = payload => api.post('/messages', payload)
const createMessage = payload => api.post('/message', payload)
const deleteMessage = payload => api.delete('/deleteMessage', payload)




const apis = {
    insertUser,
    getAllUsers,
   // updateUserById,
    deleteUserById,
    getUserById,
    getUserByName,
    loginUser,

    createRoom,
    deleteRoom,
    getAllRooms,
    getRoomById,

    getAllMessages,
    createMessage,
    deleteMessage,
}

export default apis