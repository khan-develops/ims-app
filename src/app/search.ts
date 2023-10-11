import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

export interface SearchState {
    searchValue: string;
}

const initialState: SearchState = {
    searchValue: ''
};

export const searchSlice = createSlice({
    name: 'searchSlice',
    initialState,
    reducers: {
        getSearchValue: (state, action) => {
            state.searchValue = action.payload;
        }
    }
});

export const { getSearchValue } = searchSlice.actions;

export const selectSearchValue = (state: RootState) => state.searchStore;

export default searchSlice.reducer;
