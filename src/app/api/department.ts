import axios from 'axios';
import { IDepartment } from './properties/IDepartment';

const baseUrl = process.env.REACT_APP_BASE_URL;

export const geDepartmentItems = (state: string, page: Number) => {
    return axios.get(`${baseUrl}${state}/list?page=${page}`);
};

export const getDepartmentItem = (params: { state: string; id: number }) => {
    return axios.get(`${baseUrl}${params.state}/${params.id}`);
};

export const createDepartmentItem = (params: { state: string; departmentItem: IDepartment }) => {
    return axios.post(`${baseUrl}${params.state}/create`, params.departmentItem);
};

export const updateDepartmentItem = (params: { state: string; departmentItem: IDepartment }) => {
    return axios.patch(`${baseUrl}/departments/${params.state}/${params.departmentItem.id}/update`, params.departmentItem);
};

export const updateDepartmentItemQuantity = (params: { state: string; departmentItemId: number; quantity: number; updateAction: 'received' | 'issued'; }) => {
    return axios.patch(`${baseUrl}/departments/${params.state}/${params.departmentItemId}/update-quantity?updateAction=${params.updateAction}&quantity=${params.quantity}`);
};

export const getDepartmentMasterItems = (params: { state: string; page: number }) => {
    return axios.get(`${baseUrl}/department-master/${params.state}/list?page=${params.page}`);
};

// export const assignDepartmentMasterItem = (params: { departments: string[]; masterItemId: number }) => {
//     return axios.post(`${baseUrl}/department-master/${params.masterItemId}/assign`, params.departments);
// };

export const getGrandTotal = (state: string) => {
    return axios.get(`${baseUrl}/department-master/${state}/grand-total`);
};
