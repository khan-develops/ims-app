import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { IDepartmentItem } from '../department/departmentItemsSlice';
import { DrawerType } from '../../../common/types';
import { IRequest } from '../../api/properties/IRequest';

interface requestDrawerState {
    toggleType: DrawerType;
    requestItem: IRequest | null;
}

const initialState: requestDrawerState = {
    toggleType: '',
    requestItem: null
};

export const requestDrawerSlice = createSlice({
    name: 'drawerToggleSlice',
    initialState,
    reducers: {
        toggleRequestItemDrawer: (state, action: PayloadAction<DrawerType>) => {
            state.toggleType = action.payload
        }
    }
});

export const { toggleRequestItemDrawer } = requestDrawerSlice.actions;
export const selectRequestDrawer = (state: RootState) => state.requestDrawerStore;
export default requestDrawerSlice.reducer;
