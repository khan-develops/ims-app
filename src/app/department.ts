import axios from 'axios';
import { IDepartment } from './api/properties/IDepartment';

const baseUrl = process.env.REACT_APP_BASE_URL;

export const getDepartmentItems = (params: { state: string; page: number }) => {
    return axios.get(`${baseUrl}${params.state}/list?page=${params.page}}`);
};

export const getDepartmentItem = (params: { state: string; page: number }) => {
    return axios.get(`${baseUrl}${params.state}/list?page=${params.page}}`);
};

export const createDepartmentItem = (params: { state: string; id: number; departmentItem: IDepartment }) => {
    return axios.post(`${baseUrl}${params.state}/${params.id}`, params.departmentItem);
};

export const updateDepartmentItem = (params: { state: string; id: number; departmentItem: IDepartment }) => {
    return axios.put(`${baseUrl}${params.state}/${params.id}`, params.departmentItem);
};

export const deleteDepartmentItem = (params: { state: string; id: number }) => {
    return axios.post(`${baseUrl}${params.state}/${params.id}`);
};

export const getDepartmentMasterItems = (params: { state: string; page: number }) => {
    return axios.get(`${baseUrl}${params.state}/list?page=${params.page}}`);
};
