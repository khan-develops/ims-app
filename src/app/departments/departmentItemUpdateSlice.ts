import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { IDepartmentItem } from './departmentItemsSlice';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_URL;

export const updateDepartmentItem = (pathname: string, departmentItem: IDepartmentItem) => {
    return axios.patch(`${baseUrl}${pathname}/${departmentItem.id}/update`, departmentItem);
};

export interface IDepartmentUpdateState {
    response: IDepartmentItem | undefined;
    status: 'idle' | 'loading' | 'success' | 'failed';
}

const initialState: IDepartmentUpdateState = {
    response: undefined,
    status: 'idle'
};

export const updateDepartmentItemThunk = createAsyncThunk(
    'updateDepartmentItemThunk',
    async (params: { pathname: string; departmentItem: IDepartmentItem }) => {
        const response = await updateDepartmentItem(params.pathname, params.departmentItem);
        return response.data;
    }
);

export const departmentItemUpdateSlice = createSlice({
    name: 'updateDepartmentSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateDepartmentItemThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateDepartmentItemThunk.fulfilled, (state, action) => {
                state.response = action.payload;
            })
            .addCase(updateDepartmentItemThunk.rejected, (state) => {
                state.status = 'failed';
            });
    }
});

export const selectDepartmentItemUpdate = (state: RootState) => state.departmentItemUpdateStore;

export default departmentItemUpdateSlice.reducer;
