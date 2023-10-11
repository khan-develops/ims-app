import { IMaster } from './IMaster';

export interface IStoreRoom {
    id: number;
    location: string;
    quantity: number;
    minimumQuantity: number;
    maximumQuantity: number;
    usageLevel: string;
    lotNumber: string;
    expirationDate: Date;
    receivedDate: Date;
}

export interface IStoreRoomMaster {
    id: number;
    location: string;
    quantity: number;
    minimumQuantity: number;
    maximumQuantity: number;
    usageLevel: string;
    lotNumber: string;
    expirationDate: Date;
    receivedDate: Date;
    masterItem: IMaster;
}
