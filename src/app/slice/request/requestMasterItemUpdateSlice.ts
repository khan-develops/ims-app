import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { IRequestMaster } from '../../api/properties/IRequest';
import { updateRequestMasterItem } from '../../api/request';

export interface RequestItemUpdateState {
    response: IRequestMaster | null;
    status: 'idle' | 'loading' | 'success' | 'failed';
}

const initialState: RequestItemUpdateState = {
    response: null,
    status: 'idle'
};

export const updateRequestMasterItemThunk = createAsyncThunk(
    'updateRequestMasterItemThunk',
    async (params: { state: string; id: number; requestMasterItem: IRequestMaster }) => {
        const response = await updateRequestMasterItem(params);
        return response.data;
    }
);

export const requestMasterItemUpdateSlice = createSlice({
    name: 'requestMasterItemUpdateSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateRequestMasterItemThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateRequestMasterItemThunk.fulfilled, (state, action) => {
                state.response = action.payload;
            })
            .addCase(updateRequestMasterItemThunk.rejected, (state) => {
                state.status = 'failed';
            });
    }
});

export const selectRequestMasterItemUpdate = (state: RootState) => state.requestMasterItemUpdateStore;
export default requestMasterItemUpdateSlice.reducer;
