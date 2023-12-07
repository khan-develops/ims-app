import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { IMaster } from '../../api/properties/IMaster';
import { DrawerType } from '../../../common/types';

export interface masterDrawerState {
    drawerType: DrawerType;
    masterItem: IMaster | null;
}

export const initialState: masterDrawerState = {
    drawerType: '',
    masterItem: null
};

export const masterDrawerSlice = createSlice({
    name: 'masterDrawerSlice',
    initialState,
    reducers: {
        toggleMasterDrawer: (state, action: PayloadAction<masterDrawerState>) => {
            state.drawerType = action.payload.drawerType
            state.masterItem = action.payload.masterItem
        }
    }
});

export const { toggleMasterDrawer } = masterDrawerSlice.actions;
export const selectMasterDrawer = (state: RootState) => state.masterDrawerStore;
export default masterDrawerSlice.reducer;
