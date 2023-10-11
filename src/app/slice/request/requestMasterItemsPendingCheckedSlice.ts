import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { IRequestMaster } from '../../api/properties/IRequest';

export interface RequestMasterItemsPendingCheckedState {
    requestMasterItemsPendingChecked: IRequestMaster[];
}

const initialState: RequestMasterItemsPendingCheckedState = {
    requestMasterItemsPendingChecked: []
};

export const requestMasterItemsPendingCheckedSlice = createSlice({
    name: 'requestMasterItemsPendingCheckedSlice',
    initialState,
    reducers: {
        changeRequestItemsPendingChecked: (state, action) => {
            state.requestMasterItemsPendingChecked = action.payload;
        }
    }
});

export const selectRequestMasterItemsPendingChecked = (state: RootState) => state.requestMasterItemsPendingCheckedStore;

export const { changeRequestItemsPendingChecked } = requestMasterItemsPendingCheckedSlice.actions;

export default requestMasterItemsPendingCheckedSlice.reducer;
