import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { act } from 'react-dom/test-utils';

const baseUrl = process.env.REACT_APP_BASE_URL;

export const getDepartmentItem = (params: { pathName: string; page: number; size: number }) => {
    return axios.put(`${baseUrl}${params.pathName}/list?page=${params.page}&size=${params.size}`);
};

export const updateDepartmentItem = (params: {
    departmentName: string;
    id: number;
    departmentItem: IDepartmentItem;
}) => {
    return axios.put(`${baseUrl}${params.departmentName}/${params.id}`, params.departmentItem);
};

export const getDepartmentItems = (params: { state: string; page: number }) => {
    return axios.get(`${baseUrl}/departments/${params.state}/list?page=${params.page}`);
};

export interface IDepartmentItem {
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

export interface IDepartmentState {
    response: {
        content: IDepartmentItem[];
        pageable?: {
            sort: {
                empty: boolean;
                sorted: boolean;
                unsorted: boolean;
            };
            offset: number;
            pageNumber: number;
            pageSize: number;
            paged: boolean;
            unpaged: boolean;
        };
        last?: boolean;
        totalPages?: number;
        totalElements?: number;
        first?: boolean;
        size?: number;
        number?: number;
        sort?: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        numberOfElements?: number;
        empty?: boolean;
    };
    status: 'idle' | 'loading' | 'success' | 'failed';
}

const initialState: IDepartmentState = {
    response: {
        content: []
    },
    status: 'idle'
};

export const getDepartmentItemsThunk = createAsyncThunk(
    'getDepartmentItemsThunk',
    async (params: { state: string; page: number }) => {
        const response = await getDepartmentItems(params);
        return response.data;
    }
);

export const dpeartmentItemsSlice = createSlice({
    name: 'departmentMaster',
    initialState,
    reducers: {
        changeDepartmentItems: (state, action) => {
            state.response = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDepartmentItemsThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getDepartmentItemsThunk.fulfilled, (state, action) => {
                state.response = action.payload;
            })
            .addCase(getDepartmentItemsThunk.rejected, (state) => {
                state.status = 'failed';
            });
    }
});

export const { changeDepartmentItems } = dpeartmentItemsSlice.actions;

export const selectDepartmentItems = (state: RootState) => state.departmentItemsStore;

export default dpeartmentItemsSlice.reducer;
