import { IMaster } from './IMaster';

export interface IDepartment {
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

export interface IDepartmentMaster {
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
