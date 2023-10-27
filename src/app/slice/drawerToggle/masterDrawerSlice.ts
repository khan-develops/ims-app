import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { IMaster } from '../../api/properties/IMaster';
import { drawer_toggle_type } from '../../../common/types';

interface masterDrawerState {
    toggleType: drawer_toggle_type;
    masterItem: IMaster | null;
}

const initialState: masterDrawerState = {
    toggleType: '',
    masterItem: null
};

export const masterDrawerSlice = createSlice({
    name: 'drawerToggleSlice',
    initialState,
    reducers: {
        toggleMasterItemDrawer: (state, action: PayloadAction<masterDrawerState>) => {
            state = action.payload
        }
    }
});

export const { toggleMasterItemDrawer } = masterDrawerSlice.actions;
export const selectMasterDrawer = (state: RootState) => state.masterDrawerStore;
export default masterDrawerSlice.reducer;
