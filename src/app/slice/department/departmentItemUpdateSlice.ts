import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { IDepartment } from '../../api/properties/IDepartment';
import { updateDepartmentItem, updateDepartmentItemQuantity } from '../../api/department';

export interface DepartmentUpdateState {
    response: IDepartment | null;
    status: 'idle' | 'loading' | 'success' | 'failed';
}

const initialState: DepartmentUpdateState = {
    response: null,
    status: 'idle'
};

export const updateDepartmentItemThunk = createAsyncThunk(
    'updateDepartmentItemThunk',
    async (params: { state: string; departmentItem: IDepartment }) => {
        const response = await updateDepartmentItem(params);
        return response.data;
    }
);

export const updateDepartmentItemQuantityThunk = createAsyncThunk(
    'updateDepartmentItemQuantityThunk',
    async (params: { state: string; departmentItemId: number, quantity: number, updateAction: 'received' | 'issued' }) => {
        const response = await updateDepartmentItemQuantity(params);
        return response.data;
    }
);

export const departmentItemUpdateSlice = createSlice({
    name: 'updateDepartmentSlice',
    initialState,
    reducers: {
        changeDepartmentItem: (state, action) => {
            state.response = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateDepartmentItemThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateDepartmentItemThunk.fulfilled, (state, action) => {
                state.response = action.payload;
            })
            .addCase(updateDepartmentItemThunk.rejected, (state) => {
                state.status = 'failed';
            });
    }
});

export const { changeDepartmentItem } = departmentItemUpdateSlice.actions;
export const selectDepartmentItemUpdate = (state: RootState) => state.departmentItemUpdateStore;
export default departmentItemUpdateSlice.reducer;
