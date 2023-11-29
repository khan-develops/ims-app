import axios from 'axios';
import { IRequestMaster } from './properties/IRequest';

const baseUrl = process.env.REACT_APP_BASE_URL;

export const getRequestMasterItemsPurchase = (params: { requestCategory: string, page: number }) => {
    return axios.get(`${baseUrl}/requests/${params.requestCategory}/list?page=${params.page}`);
};

export const getMinmaxOrders = (params: { department: string, page: number }) => {
    return axios.get(`${baseUrl}/master-department/minmaxorder-${params.department}/list?page=${params.page}`);
};

export const sortRequestMasterItemsPurchase = (params: { requestCategory: string, page: number, column: string, direction: string }) => {
    return axios.get(`${baseUrl}/requests/${params.requestCategory}/sort?page=${params.page}&column=${params.column}&direction=${params.direction}`);
};

export const getRequestMasterItemsDashboard = (params: { department: string, requestCategory: string, page: number }) => {
    return axios.get(`${baseUrl}/request-master/${params.department}/${params.requestCategory}/list?page=${params.page}`);
};

export const sortRequestMasterItemsDashboard = (params: { department: string, requestCategory: string, page: number, column: string, direction: string }) => {
    return axios.get(`${baseUrl}/request-master/${params.department}/${params.requestCategory}/sort?&page=${params.page}&column=${params.column}&direction=${params.direction}`);
};

export const getRequestMasterItemsPending = (params: { department: string, requestCategory: string, page: number }) => {
    return axios.get(`${baseUrl}/request-master/${params.department}/${params.requestCategory}/list/pending?page=${params.page}`);
};

export const sortRequestMasterItemsPending = (params: { confirmation: 'COMPLETE' | 'WAITING', department: string, requestCategory: string, page: number, column: string, direction: string }) => {
    return axios.get(`${baseUrl}/request-master/${params.department}/${params.requestCategory}/sort?confirmation=${params.confirmation}&page=${params.page}&column=${params.column}&direction=${params.direction}`);
};

export const getRequestMasterItemsComplete = (params: { department: string, requestCategory: string, page: number }) => {
    return axios.get(`${baseUrl}/request-master/${params.department}/${params.requestCategory}/list/complete?page=${params.page}`);
};

export const sortRequestMasterItemsComplete = (params: { confirmation: 'COMPLETE' | 'WAITING', department: string, requestCategory: string, page: number, column: string, direction: string }) => {
    return axios.get(`${baseUrl}/request-master/${params.department}/${params.requestCategory}/sort?confirmation=${params.confirmation}&page=${params.page}&column=${params.column}&direction=${params.direction}`);
};

export const updateRequestMasterItems = (params: { department: string, requestCategory: string, requestItems: IRequestMaster[] }) => {
    return axios.patch(`${baseUrl}/request-master/${params.department}/${params.requestCategory}/list/update`, params.requestItems);
};

export const updateRequestMasterItem = (params: { department: string, requestCategory: string, requestMasterItem: IRequestMaster }) => {
    return axios.patch(
        `${baseUrl}/request-master/${params.department}/${params.requestCategory}/${params.requestMasterItem.id}/update`,
        params.requestMasterItem
    );
};

export const createRequestMasterItems = (params: { department: string, requestCategory: string, requestMasterItems: IRequestMaster[] }) => {
    return axios.post(`${baseUrl}/request-master/${params.department}/${params.requestCategory}/list/create`, params.requestMasterItems);
};