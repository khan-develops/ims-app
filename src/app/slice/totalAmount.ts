import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

const initialState: { totalAmount: number } = {
    totalAmount: 0
};

export const totalAmountSlice = createSlice({
    name: 'departmentMaster',
    initialState,
    reducers: {
        getTotalAmount: (state, action: PayloadAction<{ totalAmount: number }>) => {
            state.totalAmount = action.payload.totalAmount;
        }
    }
});

export const { getTotalAmount } = totalAmountSlice.actions;
export const selectTotalAmount = (state: RootState) => state.totalAmountStore;
export default totalAmountSlice.reducer;
