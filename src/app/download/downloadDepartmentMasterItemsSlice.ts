import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

const baseUrl = process.env.REACT_APP_BASE_URL;

export const downloadDepartmentMasterItems = (params: { state: string }) => {
    return axios.get(`${baseUrl}/download/${params.state}/list`, {
        headers: {
            'Content-Disposition': 'attachment; filename=template.xlsx',
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        },
        responseType: 'blob'
    });
};

export interface IDownloadDepartmentMasterItemsState {
    code: string;
    status: 'idle' | 'loading' | 'success' | 'failed';
}

export const initialState: IDownloadDepartmentMasterItemsState = {
    code: 'success',
    status: 'idle'
};

export const downloadDepartmentMasterItemsThunk = createAsyncThunk(
    'downloadDepartmentMasterItemsThunk',
    async (params: { state: string }) => {
        const response = await downloadDepartmentMasterItems(params);
        return response.data;
    }
);

export const downloadDepartmentMasterItemsSlice = createSlice({
    name: 'downloadDepartmentMasterItemsSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(downloadDepartmentMasterItemsThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(downloadDepartmentMasterItemsThunk.fulfilled, (state, action) => {
                state.code = action.payload;
            })
            .addCase(downloadDepartmentMasterItemsThunk.rejected, (state) => {
                state.status = 'failed';
            });
    }
});

export const selectDownloadDepartmentMasterItems = (state: RootState) => state.downloadDepartmentMasterItemsStore;
export default downloadDepartmentMasterItemsSlice.reducer;
