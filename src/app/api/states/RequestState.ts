import { IRequestMaster } from "../properties/IRequest";

export interface RequestMasterItemsState {
    response: {
        content: IRequestMaster[];
        last: boolean;
        totalPages: number;
        totalElements: number;
        first: boolean;
        size: number;
        number: number;
        numberOfElements: number;
        empty: boolean;
    };
    status: 'idle' | 'loading' | 'success' | 'failed';
}