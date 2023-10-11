import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { IMasterDepartment } from '../../api/properties/IMaster';
import { getMasterDepartmentItem } from '../../api/master';

export interface MasterDepartmentItemState {
    response: IMasterDepartment | null;
    status: 'idle' | 'loading' | 'success' | 'failed';
}

const initialState: MasterDepartmentItemState = {
    response: null,
    status: 'idle'
};

export const getMasterDepartmentItemThunk = createAsyncThunk(
    'getMasterDepartmentItemThunk',
    async (params: { state: string; id: number }) => {
        const response = await getMasterDepartmentItem(params);
        return response.data;
    }
);

export const masterDepartmentItemSlice = createSlice({
    name: 'masterDepartmentItemSlice',
    initialState,
    reducers: {
        changeMasterDepartmentItem: (state, action) => {
            state.response = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMasterDepartmentItemThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getMasterDepartmentItemThunk.fulfilled, (state, action) => {
                state.response = action.payload;
            })
            .addCase(getMasterDepartmentItemThunk.rejected, (state) => {
                state.status = 'failed';
            });
    }
});

export const { changeMasterDepartmentItem } = masterDepartmentItemSlice.actions;

export const selectMasterDepartmentItem = (state: RootState) => state.masterDepartmentItemStore;

export default masterDepartmentItemSlice.reducer;
