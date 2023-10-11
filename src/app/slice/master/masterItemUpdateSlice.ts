import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { IMaster } from '../../api/properties/IMaster';
import { updateMasterItem } from '../../api/master';

export interface IMasterItemState {
    masterItem: IMaster | undefined;
    status: 'idle' | 'loading' | 'success' | 'failed';
}

const initialState: IMasterItemState = {
    masterItem: undefined,
    status: 'idle'
};

export const updateMasterItemThunk = createAsyncThunk('updateMasterItemThunk', async (masterItem: IMaster) => {
    const response = await updateMasterItem(masterItem);
    return response.data;
});

export const masterItemUpdateSlice = createSlice({
    name: 'master',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateMasterItemThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateMasterItemThunk.fulfilled, (state, action) => {
                state.status = 'success';
                state.masterItem = action.payload;
            })
            .addCase(updateMasterItemThunk.rejected, (state) => {
                state.status = 'failed';
            });
    }
});

export const selectMasterItemUpdate = (state: RootState) => state.masterItemUpdateStore;

export default masterItemUpdateSlice.reducer;
