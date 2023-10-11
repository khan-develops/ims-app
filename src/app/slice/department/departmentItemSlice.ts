import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../store';

const baseUrl = process.env.REACT_APP_BASE_URL;

export const updateDepartmentItem = (state: string, departmentItemId: Number) => {
    return axios.get(`${baseUrl}${state}/${departmentItemId}`);
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
    response:
    | {
        content: IDepartmentItem[];
        pageable: {
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
        last: boolean;
        totalPages: number;
        totalElements: number;
        first: boolean;
        size: number;
        number: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        numberOfElements: number;
        empty: boolean;
    }
    | undefined;
    status: 'idle' | 'loading' | 'success' | 'failed';
}

const initialState: IDepartmentState = {
    response: undefined,
    status: 'idle'
};

export const getDepartmentItemThunk = createAsyncThunk(
    'getDepartmentItemThunk',
    async (params: { state: string; departmentItemId: Number }) => {
        const response = await updateDepartmentItem(params.state, params.departmentItemId);
        return response.data;
    }
);

export const departmentItemSlice = createSlice({
    name: 'departmentMaster',
    initialState,
    reducers: {
        changeDepartmentItems: (state, action) => {
            state.response = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDepartmentItemThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getDepartmentItemThunk.fulfilled, (state, action) => {
                state.response = action.payload;
            })
            .addCase(getDepartmentItemThunk.rejected, (state) => {
                state.status = 'failed';
            });
    }
});

export const { changeDepartmentItems } = departmentItemSlice.actions;
export const selectDepartmentItem = (state: RootState) => state.departmentItemStore;
export default departmentItemSlice.reducer;
