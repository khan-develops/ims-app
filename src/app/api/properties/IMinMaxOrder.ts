import { IMaster } from "./IMaster";

export interface IMinMaxOrder {
    id: number;
    department: string;
    orderStatus: string;
    quantity: number;
    timeRequested: Date;
    timeUpdated: Date;
    customText: string;
    customDetail: string;
}

export interface IMinMaxMasterOrder {
    id: number;
    department: string;
    orderStatus: string;
    quantity: number;
    timeRequested: Date;
    timeUpdated: Date;
    customText: string;
    customDetail: string;
    masterItem: IMaster
}