import { IMaster } from "./IMaster";

export interface IRequest {
    id: number;
    recentCN: number;
    department: string;
    confirmation: string;
    orderStatus: string;
    quantity: number;
    timeRequested: Date;
    timeUpdated: Date;
    requester: string;
    customText: string;
    location: string;
    customDetail: string;
}

export interface IRequestMaster {
    id: number;
    recentCN: number;
    department: string;
    confirmation: string;
    orderStatus: string;
    quantity: number;
    timeRequested: Date;
    timeUpdated: Date;
    requester: string;
    customText: string;
    customDetail: string;
    location: string;
    masterItem: IMaster
}