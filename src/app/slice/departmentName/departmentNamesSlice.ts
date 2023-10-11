import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { getDepartmentNames } from '../../api/departmentName';
import { IDepartmentName } from '../../api/properties/IDepartmentName';

export interface DepartmentNamesState {
    departmentNames: IDepartmentName[]
    status: 'idle' | 'loading' | 'success' | 'failed';
}

const initialState: DepartmentNamesState = {
    departmentNames: [],
    status: 'idle'
};

export const getDepartmentNamesThunk = createAsyncThunk('getDepartmentNamesThunk', async () => {
    const response = await getDepartmentNames();
    return response.data;
});

export const departmentNamesSlice = createSlice({
    name: 'departmentNamesSlice',
    initialState,
    reducers: {
        changeDepartmentName: (state, action: PayloadAction<IDepartmentName[]>) => {
            state.departmentNames = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDepartmentNamesThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getDepartmentNamesThunk.fulfilled, (state, action) => {
                state.status = 'success';
                state.departmentNames = action.payload;
            })
            .addCase(getDepartmentNamesThunk.rejected, (state) => {
                state.status = 'failed';
            })
    }
});

export const { changeDepartmentName } = departmentNamesSlice.actions;
export const selectDepartmentNames = (state: RootState) => state.departmentNamesStore;
export default departmentNamesSlice.reducer;
