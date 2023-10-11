import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { getDepartmentMasterItems } from '../../api/department';

export interface IDepartmentMasterState {
    response: {
        content: IDepartmentMasterState[];
        last: boolean;
        totalPages: number;
        totalElements: number;
        first: boolean;
        size: number;
        number: number;
        sorted: boolean;
        numberOfElements: number;
        empty: boolean;
    };
    status: 'idle' | 'loading' | 'success' | 'failed';
}

const initialState: IDepartmentMasterState = {
    response: {
        content: [],
        last: false,
        totalPages: 0,
        totalElements: 0,
        first: false,
        size: 0,
        number: 0,
        sorted: false,
        numberOfElements: 0,
        empty: false
    },
    status: 'idle'
};

export const getDepartmentMasterItemsThunk = createAsyncThunk(
    'getDepartmentMasterItemsThunk',
    async (params: { state: string; page: number }) => {
        const response = await getDepartmentMasterItems(params);
        return response.data;
    }
);

export const departmentMasterSlice = createSlice({
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
export const { changeDepartmentMasterItems } = departmentMasterSlice.actions;
export default departmentMasterSlice.reducer;
