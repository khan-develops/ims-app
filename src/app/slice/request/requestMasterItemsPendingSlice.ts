import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { getRequestMasterItemsPending } from '../../api/request';
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

export const getRequestMasterItemsPendingThunk = createAsyncThunk(
    'getRequestMasterDepartmentItemsThunk',
    async (params: { state: string; page: number }) => {
        const response = await getRequestMasterItemsPending(params);
        return response.data;
    }
);

export const requestMasterItemsPendingSlice = createSlice({
    name: 'requestMasterItemsPendingSlice',
    initialState,
    reducers: {
        changeRequestMasterItemsPending: (state, action) => {
            state.response = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getRequestMasterItemsPendingThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getRequestMasterItemsPendingThunk.fulfilled, (state, action) => {
                state.response = action.payload;
            })
            .addCase(getRequestMasterItemsPendingThunk.rejected, (state) => {
                state.status = 'failed';
            });
    }
});

export const selectRequestMasterItemsPending = (state: RootState) => state.requestMasterItemsPendingStore;

export const { changeRequestMasterItemsPending } = requestMasterItemsPendingSlice.actions;

export default requestMasterItemsPendingSlice.reducer;
