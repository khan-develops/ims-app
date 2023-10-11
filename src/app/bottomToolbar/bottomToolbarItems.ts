import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface IBottomToolbarItems {
    type: string;
}

export interface IBottomToolbarState {
    buttonType: string;
}

const initialState: IBottomToolbarState = {
    buttonType: ''
};

export const bottomToolbarItemsSlice = createSlice({
    name: 'requestReviewSlice',
    initialState,
    reducers: {
        handleBottomToolbarItemClick: (state, action) => {
            state.buttonType = action.payload;
        }
    }
});

export const { handleBottomToolbarItemClick } = bottomToolbarItemsSlice.actions;

export const selectBottomToolbarItems = (state: RootState) => state.bottomToolbarItemsStore;

export default bottomToolbarItemsSlice.reducer;
