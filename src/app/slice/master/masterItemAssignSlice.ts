import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { assignMasterItem } from '../../api/master';
import { IMaster } from '../../api/properties/IMaster';

interface IMasterAssignState {
    masterItem: IMaster | undefined;
    status: 'idle' | 'loading' | 'success' | 'failed';
}

export const initialState: IMasterAssignState = {
    masterItem: undefined,
    status: 'idle'
};

export const assignMasterItemThunk = createAsyncThunk(
    'assignMasterItemThunk',
    async (params: { id: number; department: string }) => {
        const response = await assignMasterItem(params);
        return response.data;
    }
);

const masterItemAssignSlice = createSlice({
    name: 'masterFormSlice',
    initialState,
    reducers: {},
    extraReducers(builder) {
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

// export const { } = masterItemAssignSlice.actions;

export const selectMasterItemAssign = (state: RootState) => state.masterItemAssignStore;

export default masterItemAssignSlice.reducer;
