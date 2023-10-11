import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

const initialState: { value: number } = {
    value: 0
};

export const requestTabSlice = createSlice({
    name: 'requestTabSlice',
    initialState,
    reducers: {
        changeTab: (state, action) => {
            state.value = action.payload;
        }
    }
});

export const { changeTab } = requestTabSlice.actions;
export const selectRequestTab = (state: RootState) => state.requestTabStore;
export default requestTabSlice.reducer;
