import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { updateRequestMasterItems } from '../../api/request';
import { IRequestMaster } from '../../api/properties/IRequest';

export interface RequestMasterItemsUpdateState {
    response: IRequestMaster[];
    status: 'idle' | 'loading' | 'success' | 'failed';
}

const initialState: RequestMasterItemsUpdateState = {
    response: [],
    status: 'idle'
};

export const updateRequestMasterItemsThunk = createAsyncThunk(
    'updateRequestMasterItemsThunk',
    async (params: { state: string; requestItems: IRequestMaster[] }) => {
        const response = await updateRequestMasterItems(params);
        return response.data;
    }
);

export const requestMasterItemsUpdateSlice = createSlice({
    name: 'updateStoreRoomRequestSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateRequestMasterItemsThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateRequestMasterItemsThunk.fulfilled, (state, action) => {
                state.response = action.payload;
            })
            .addCase(updateRequestMasterItemsThunk.rejected, (state) => {
                state.status = 'failed';
            });
    }
});

export const selectRequestMasterItemsUpdate = (state: RootState) => state.requestMasterItemsUpdateStore;
export default requestMasterItemsUpdateSlice.reducer;
