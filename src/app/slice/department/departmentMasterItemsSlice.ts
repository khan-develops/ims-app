import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { IDepartmentMaster } from '../../api/properties/IDepartment';
import { getDepartmentMasterItems } from '../../api/department';

export interface DepartmentMasterItemsState {
    response: {
        content: IDepartmentMaster[];
        last: boolean;
        totalPages: number;
        totalElements: number;
        first: boolean;
        size: number;
        number: number;
        sorted: boolean;
        numberOfElements: number;
        empty: boolean;
    } | null;
    status: 'idle' | 'loading' | 'success' | 'failed';
}

const initialState: DepartmentMasterItemsState = {
    response: null,
    status: 'idle'
};

export const getDepartmentMasterItemsThunk = createAsyncThunk(
    'getDepartmentMasterItemsThunk',
    async (params: { state: string; page: number }) => {
        const response = await getDepartmentMasterItems(params);
        return response.data;
    }
);

export const departmentMasterItemsSlice = createSlice({
    name: 'transformedSlice',
    initialState,
    reducers: {
        changeDepartmentMasterItems: (state, action) => {
            state.response = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDepartmentMasterItemsThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getDepartmentMasterItemsThunk.fulfilled, (state, action) => {
                state.status = 'success';
                state.response = action.payload;
            })
            .addCase(getDepartmentMasterItemsThunk.rejected, (state) => {
                state.status = 'failed';
            });
    }
});

export const selectDepartmentMasterItems = (state: RootState) => state.departmentMasterItemsStore;
export const { changeDepartmentMasterItems } = departmentMasterItemsSlice.actions;
export default departmentMasterItemsSlice.reducer;
