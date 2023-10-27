import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { IDepartmentItem } from '../department/departmentItemsSlice';
import { drawer_toggle_type } from '../../../common/types';

interface departmentDrawerState {
    toggleType: drawer_toggle_type;
    departmentItem: IDepartmentItem | null;
}

const initialState: departmentDrawerState = {
    toggleType: '',
    departmentItem: null
};

export const departmentDrawerSlice = createSlice({
    name: 'drawerToggleSlice',
    initialState,
    reducers: {
        toggleDepartmentItemDrawer: (state, action: PayloadAction<departmentDrawerState>) => {
            state = action.payload
        }
    }
});

export const { toggleDepartmentItemDrawer } = departmentDrawerSlice.actions;
export const selectDepartmentDrawer = (state: RootState) => state.departmentDrawerStore;
export default departmentDrawerSlice.reducer;
