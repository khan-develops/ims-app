import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { createDepartmentName, deleteDepartmentName, updateDepartmentName } from '../../api/departmentName';
import { IDepartmentName } from '../../api/properties/IDepartmentName';

export interface DepartmentNameCreateState {
    departmentName: IDepartmentName,
    status: 'idle' | 'loading' | 'success' | 'failed';
}

const initialState: DepartmentNameCreateState = {
    departmentName: { id: 0, name: '', mapping: '', hasInventory: false },
    status: 'idle'
};

export const departmentNameCreateThunk = createAsyncThunk('departmentNameCreateThunk', async (params: { name: string, mapping: string }) => {
    const response = await createDepartmentName(params);
    return response.data;
});

export const departmentNameUpdateThunk = createAsyncThunk('departmentNameUpdateThunk', async (params: IDepartmentName) => {
    const response = await updateDepartmentName(params);
    return response.data;
});

export const departmentNameDeleteThunk = createAsyncThunk('departmentNameDeleteThunk', async (id: number) => {
    const response = await deleteDepartmentName(id);
    return response.data;
});

export const departmentNameCreateSlice = createSlice({
    name: 'departmentNameCreateSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(departmentNameCreateThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(departmentNameCreateThunk.fulfilled, (state, action) => {
                state.status = 'success';
                state.departmentName = action.payload;
            })
            .addCase(departmentNameCreateThunk.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(departmentNameUpdateThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(departmentNameUpdateThunk.fulfilled, (state, action) => {
                state.status = 'success';
                state.departmentName = action.payload;
            })
            .addCase(departmentNameUpdateThunk.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(departmentNameDeleteThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(departmentNameDeleteThunk.fulfilled, (state, action) => {
                state.status = 'success';
                state.departmentName = action.payload;
            })
            .addCase(departmentNameDeleteThunk.rejected, (state) => {
                state.status = 'failed';
            })
    }
});

// export const { } = departmentNameCreateSlice.actions;
export const selectDepartmentNameCreate = (state: RootState) => state.departmentNameCreateStore;
export default departmentNameCreateSlice.reducer;
