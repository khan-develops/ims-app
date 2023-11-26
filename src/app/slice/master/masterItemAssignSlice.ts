import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { IMaster } from '../../api/properties/IMaster';
import { assignMasterItem } from '../../api/master';

export interface MasterItemState {
    masterItem: IMaster | undefined;
    status: 'idle' | 'loading' | 'success' | 'failed';
}

const initialState: MasterItemState = {
    masterItem: undefined,
    status: 'idle'
};

export const assignMasterItemThunk = createAsyncThunk(
    'assignMasterItemThunk',
    async (params: { id: number; departments: string[] }) => {
        const response = await assignMasterItem(params);
        return response.data;
    }
);

export const masterItemAssignSlice = createSlice({
    name: 'master',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(assignMasterItemThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(assignMasterItemThunk.fulfilled, (state, action) => {
                state.status = 'success';
                state.masterItem = action.payload;
            })
            .addCase(assignMasterItemThunk.rejected, (state) => {
                state.status = 'failed';
            });
    }
});

export const selectMasterItemCreate = (state: RootState) => state.masterItemAssignStore;

export default masterItemAssignSlice.reducer;
