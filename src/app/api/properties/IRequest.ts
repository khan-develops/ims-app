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
    masterItem: IMaster
}

export interface IRequestMaster extends Partial<{ checked: boolean }> {
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
    masterItem: IMaster
}