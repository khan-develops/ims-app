import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { IDepartmentItem } from '../department/departmentItemsSlice';
import { DrawerType } from '../../../common/types';

interface departmentDrawerState {
    drawerType: DrawerType;
    departmentItem: IDepartmentItem | null;
}

const initialState: departmentDrawerState = {
    drawerType: '',
    departmentItem: null
};

export const departmentDrawerSlice = createSlice({
    name: 'departmentDrawerSlice',
    initialState,
    reducers: {
        toggleDepartmentDrawer: (state, action: PayloadAction<departmentDrawerState>) => {
            state.departmentItem = action.payload.departmentItem
            state.drawerType = action.payload.drawerType
        }
    }
});

export const { toggleDepartmentDrawer } = departmentDrawerSlice.actions;
export const selectDepartmentDrawer = (state: RootState) => state.departmentDrawerStore;
export default departmentDrawerSlice.reducer;
