import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { IMaster } from '../../api/properties/IMaster';
import { drawer_toggle_type } from '../../../common/types';

export type drawerToggleTypeMaster =
    'MASTER_ASSIGN' |
    'MASTER_ADD' |
    'MASTER_UPDATE' | ''

export interface masterDrawerState {
    toggleType: drawerToggleTypeMaster;
    masterItem: IMaster | null;
}

export const initialState: masterDrawerState = {
    toggleType: '',
    masterItem: null
};

export const masterDrawerSlice = createSlice({
    name: 'drawerToggleSlice',
    initialState,
    reducers: {
        toggleMasterItemDrawer: (state, action: PayloadAction<masterDrawerState>) => {
            state.toggleType = action.payload.toggleType
            state.masterItem = action.payload.masterItem
        }
    }
});

export const { toggleMasterItemDrawer } = masterDrawerSlice.actions;
export const selectMasterDrawer = (state: RootState) => state.masterDrawerStore;
export default masterDrawerSlice.reducer;
