import axios from 'axios';
import { IRequestMaster } from './properties/IRequest';

const baseUrl = process.env.REACT_APP_BASE_URL;

export const getRequestMasterItemsPurchase = (params: { state: string, page: number }) => {
    return axios.get(`${baseUrl}/requests/${params.state}/list?page=${params.page}`);
};

export const getRequestMasterItems = (params: { state: string, page: number }) => {
    return axios.get(`${baseUrl}/requests/${params.state}/list?page=${params.page}`);
};

export const getRequestMasterItemsDashboard = (params: { state: string, department: string, page: number }) => {
    return axios.get(`${baseUrl}/request-master/${params.department}/${params.state}/list?page=${params.page}`);
};

export const getRequestMasterItemsPending = (params: { state: string, department: string, page: number }) => {
    return axios.get(`${baseUrl}/request-master/${params.department}/${params.state}/list/pending?page=${params.page}`);
};

export const getRequestMasterItemsComplete = (params: { state: string, department: string, page: number }) => {
    return axios.get(`${baseUrl}/request-master/${params.department}/${params.state}/list/complete?page=${params.page}`);
};

export const updateRequestMasterItems = (params: { state: string, department: string, requestItems: IRequestMaster[] }) => {
    return axios.patch(`${baseUrl}/request-master/${params.department}/${params.state}/list/update`, params.requestItems);
};

export const updateRequestMasterItem = (params: { state: string, department: string, requestMasterItem: IRequestMaster }) => {
    return axios.patch(
        `${baseUrl}/request-master/${params.department}/${params.state}/${params.requestMasterItem.id}/update`,
        params.requestMasterItem
    );
};

export const createRequestMasterItems = (params: { state: string, department: string, requestMasterItems: IRequestMaster[] }) => {
    return axios.post(`${baseUrl}/request-master/${params.department}/${params.state}/list/create`, params.requestMasterItems);
};