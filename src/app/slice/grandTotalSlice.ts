import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getGrandTotal } from '../api/department';
import { RootState } from '../store';

export const initialState: {
    grandTotal: number;
    status: 'idle' | 'loading' | 'success' | 'failed';
} = {
    grandTotal: 0,
    status: 'idle'
};

export const getGrandTotalThunk = createAsyncThunk('getGrandTotalThunk', async (state: string) => {
    const response = await getGrandTotal(state);
    return response.data;
});

export const grandTotalSlice = createSlice({
    name: 'grandTotalSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getGrandTotalThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getGrandTotalThunk.fulfilled, (state, action) => {
                state.grandTotal = action.payload;
            })
            .addCase(getGrandTotalThunk.rejected, (state) => {
                state.status = 'failed';
            });
    }
});

export const {} = grandTotalSlice.actions;
export const selectGrandTotal = (state: RootState) => state.grandTotalStore;
export default grandTotalSlice.reducer;
