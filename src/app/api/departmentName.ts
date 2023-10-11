import axios from "axios";

const baseUrl = process.env.REACT_APP_BASE_URL;

export const getDepartmentNames = () => {
    return axios.get(`${baseUrl}/profile-details/department-names/list`);
};

export const createDepartmentName = (params: { name: string, mapping: string }) => {
    return axios.post(`${baseUrl}/profile-details/department-names/create`, params);
};

export const updateDepartmentName = (params: { id: number, name: string, mapping: string }) => {
    return axios.patch(`${baseUrl}/profile-details/department-names/${params.id}/update`, params);
};

export const deleteDepartmentName = (id: number) => {
    return axios.delete(`${baseUrl}/profile-details/department-names/${id}/delete`);
};
