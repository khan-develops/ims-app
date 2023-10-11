import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { IRequestMaster } from '../../api/properties/IRequest';
import { createRequestMasterItems } from '../../api/request';

export interface RequestMasterItemsCreateState {
    response: IRequestMaster[];
    status: 'idle' | 'loading' | 'success' | 'failed';
}

const initialState: RequestMasterItemsCreateState = {
    response: [],
    status: 'idle'
};

export const createRequestMasterItemsThunk = createAsyncThunk(
    'createRequestMasterItemsThunk',
    async (params: { state: string; requestMasterItems: IRequestMaster[] }) => {
        const response = await createRequestMasterItems(params);
        return response.data;
    }
);

export const requestMasterItemsCreateSlice = createSlice({
    name: 'requestItemsCreateSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createRequestMasterItemsThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createRequestMasterItemsThunk.fulfilled, (state, action) => {
                state.response = action.payload;
            })
            .addCase(createRequestMasterItemsThunk.rejected, (state) => {
                state.status = 'failed';
            });
    }
});

export const selectRequestMasterItemsCreate = (state: RootState) => state.requestMasterItemsCreateStore;
export default requestMasterItemsCreateSlice.reducer;
