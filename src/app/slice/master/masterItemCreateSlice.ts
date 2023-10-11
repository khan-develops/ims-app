import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { IMaster } from '../../api/properties/IMaster';
import { createMasterItem } from '../../api/master';

export interface MasterItemState {
    masterItem: IMaster | undefined;
    status: 'idle' | 'loading' | 'success' | 'failed';
}

const initialState: MasterItemState = {
    masterItem: undefined,
    status: 'idle'
};

export const createMasterItemThunk = createAsyncThunk(
    'createMasterItemThunk',
    async (params: { masterItem: IMaster; departments: string[] }) => {
        const response = await createMasterItem(params);
        return response.data;
    }
);

export const masterItemCreateSlice = createSlice({
    name: 'master',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createMasterItemThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createMasterItemThunk.fulfilled, (state, action) => {
                state.status = 'success';
                state.masterItem = action.payload;
            })
            .addCase(createMasterItemThunk.rejected, (state) => {
                state.status = 'failed';
            });
    }
});

export const selectMasterItemCreate = (state: RootState) => state.masterItemCreateStore;

export default masterItemCreateSlice.reducer;
