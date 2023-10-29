import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { getRequestMasterItemsComplete, sortRequestMasterItemsComplete } from '../../api/request';
import { RequestMasterItemsState } from '../../api/states/RequestState';

const initialState: RequestMasterItemsState = {
    response: {
        content: [],
        last: false,
        totalPages: 0,
        totalElements: 0,
        first: false,
        size: 0,
        number: 0,
        numberOfElements: 0,
        empty: false
    },
    status: 'idle'
};

export const getRequestMasterItemsCompleteThunk = createAsyncThunk(
    'getRequestMasterDepartmentItemsThunk',
    async (params: { department: string, requestCategory: string, page: number }) => {
        const response = await getRequestMasterItemsComplete(params);
        return response.data;
    }
);

export const sortRequestMasterItemsCompleteThunk = createAsyncThunk(
    'sortRequestMasterItemsCompleteThunk',
    async (params: { department: string, requestCategory: string, page: number, column: string, direction: string }) => {
        const response = await sortRequestMasterItemsComplete(params);
        return response.data;
    }
);

export const requestMasterItemsCompleteSlice = createSlice({
    name: 'requestItemsSlice',
    initialState,
    reducers: {
        changeRequestMasterItems: (state, action) => {
            state.response = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getRequestMasterItemsCompleteThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getRequestMasterItemsCompleteThunk.fulfilled, (state, action) => {
                state.response = action.payload;
            })
            .addCase(getRequestMasterItemsCompleteThunk.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(sortRequestMasterItemsCompleteThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(sortRequestMasterItemsCompleteThunk.fulfilled, (state, action) => {
                state.response = action.payload;
            })
            .addCase(sortRequestMasterItemsCompleteThunk.rejected, (state) => {
                state.status = 'failed';
            });
    }
});

export const selectRequestMasterItemsComplete = (state: RootState) => state.requestMasterItemsCompleteStore;

export const { changeRequestMasterItems } = requestMasterItemsCompleteSlice.actions;

export default requestMasterItemsCompleteSlice.reducer;
