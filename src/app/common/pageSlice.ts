import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface IPage {
    page: number;
    size: number;
}

const initialState: IPage = {
    page: 0,
    size: 10
};

export const pageSlice = createSlice({
    name: 'paginationSlice',
    initialState,
    reducers: {
        handlePage: (state, action) => {
            state.page = action.payload;
        },
        handleSize: (state, action) => {
            state.size = action.payload;
        }
    }
});

export const { handlePage, handleSize } = pageSlice.actions;
export const selectPage = (state: RootState) => state.pageStore;
export default pageSlice.reducer;
