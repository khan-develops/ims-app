import axios from 'axios';
import { IStoreRoom } from './properties/IStoreRoom';

const baseUrl = process.env.REACT_APP_BASE_URL;

export const getStoreRoomItems = (page: Number) => {
    return axios.get(`${baseUrl}/store-room/list?page=${page}`);
};

export const getStoreRoomItem = (id: number) => {
    return axios.get(`${baseUrl}/store-room/${id}`);
};

export const createStoreRoomItem = (storeRoomItem: IStoreRoom) => {
    return axios.post(`${baseUrl}/store-room`, storeRoomItem);
};

export const updateStoreRoomItem = (storeRoomItem: IStoreRoom) => {
    return axios.patch(`${baseUrl}/store-room/${storeRoomItem.id}/update`, storeRoomItem);
};

export const getStoreRoomMasterItems = (page: number) => {
    return axios.get(`${baseUrl}/store-room-master/list?page=${page}`);
};
