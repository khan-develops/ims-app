import axios from 'axios';
import { IRequestMaster } from './properties/IRequest';

const baseUrl = process.env.REACT_APP_BASE_URL;

export const getRequestMasterItems = (params: { state: string, page: number }) => {
    return axios.get(`${baseUrl}/request-master/${params.state}/list?page=${params.page}`);
};

export const getRequestMasterItemsPending = (params: { state: string, page: number }) => {
    return axios.get(`${baseUrl}/request-master/${params.state}/list/pending?page=${params.page}`);
};

export const getRequestMasterItemsComplete = (params: { state: string, page: number }) => {
    return axios.get(`${baseUrl}/request-master/${params.state}/list/complete?page=${params.page}`);
};

export const updateRequestMasterItems = (params: { state: string, requestItems: IRequestMaster[] }) => {
    return axios.patch(`${baseUrl}/request-master/${params.state}/list/update`, params.requestItems);
};

export const updateRequestMasterItem = (params: { state: string, id: number, requestMasterItem: IRequestMaster }) => {
    return axios.patch(
        `${baseUrl}/request-master/${params.state}/${params.id}/update`,
        params.requestMasterItem
    );
};

export const createRequestMasterItems = (params: { state: string, requestMasterItems: IRequestMaster[] }) => {
    return axios.post(`${baseUrl}/request-master/${params.state}/create`, params.requestMasterItems);
};