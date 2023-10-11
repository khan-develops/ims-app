import axios from 'axios'
import { IProfileDetail } from './properties/IProfileDetail';

const baseUrl = process.env.REACT_APP_BASE_URL;

export const createProfileDetail = (profileDetail: IProfileDetail) => {
    return axios.post(`${baseUrl}/profile-details/create`, profileDetail);
};

export const updateProfileDetail = (id: string, profileDetail: IProfileDetail) => {
    return axios.patch(`${baseUrl}/profile-details/${id}/update`, profileDetail);
};

export const createProfileDetails = (users: IProfileDetail[]) => {
    return axios.post(`${baseUrl}/profile-details/create`, users);
};

export const syncProfileDetails = (params: { profileDetails: IProfileDetail[], page: number }) => {
    return axios.post(`${baseUrl}/profile-details/sync?page=${params.page}`, params.profileDetails);
};

export const getProfileDetails = (page: number) => {
    return axios.get(`${baseUrl}/profile-details/list?page=${page}`);
};

export const filterProfileDetails = (params: { displayName: string, page: number }) => {
    return axios.get(`${baseUrl}/profile-details/filter?displayName=${params.displayName}&page=${params.page}`);
};

export const getProfileDetail = (id: string) => {
    return axios.get(`${baseUrl}/profile-details/${id}`);
};