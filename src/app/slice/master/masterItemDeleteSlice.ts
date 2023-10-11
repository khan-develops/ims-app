import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteMasterItem } from "../../api/master";
import { IMaster } from "../../api/properties/IMaster";
import { RootState } from "../../store";

export interface MasterItemState {
    masterItem: IMaster | undefined;
    status: 'idle' | 'loading' | 'success' | 'failed';
}

const initialState: MasterItemState = {
    masterItem: undefined,
    status: 'idle'
};

export const deleteMasterItemThunk = createAsyncThunk(
    'deleteMasterItemThunk',
    async (masterItemId: number) => {
        const response = await deleteMasterItem(masterItemId);
        return response.data;
    }
);

export const masterItemDeleteSlice = createSlice({
    name: 'masterItemDeleteSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(deleteMasterItemThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteMasterItemThunk.fulfilled, (state, action) => {
                state.status = 'success';
                state.masterItem = action.payload;
            })
            .addCase(deleteMasterItemThunk.rejected, (state) => {
                state.status = 'failed';
            });
    }

})

export const selectMasterItemDelete = (state: RootState) => state.masterItemDeleteStore;

export default masterItemDeleteSlice.reducer;