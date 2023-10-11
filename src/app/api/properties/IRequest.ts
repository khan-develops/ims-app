import { IMaster } from "./IMaster";

export interface IRequest {
    id: number;
    item: string;
    recentCN: number;
    department: string;
    status: string;
    quantity: number;
    timeRequested: Date;
    timeUpdated: Date;
    comment: string;
    customText: string;
    detail: string;
}

export interface IRequestMaster {
    id: number;
    item: string;
    recentCN: number;
    department: string;
    status: string;
    quantity: number;
    timeRequested: Date;
    timeUpdated: Date;
    comment: string;
    customText: string;
    detail: string;
    masterItem: IMaster
}