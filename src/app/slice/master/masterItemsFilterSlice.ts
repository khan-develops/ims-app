import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { IMaster } from '../../api/properties/IMaster';
import { filterMasterItems } from '../../api/master';

export interface MasterState {
    response: {
        content: IMaster[];
        last?: boolean;
        totalPages?: number;
        totalElements?: number;
        first?: boolean;
        size?: number;
        number?: number;
        numberOfElements?: number;
        empty?: boolean;
    };
    status: 'idle' | 'loading' | 'success' | 'failed';
}

const initialState: MasterState = {
    response: {
        content: []
    },
    status: 'idle'
};

export const filterMasterItemsThunk = createAsyncThunk(
    'filterMasterItemsThunk',
    async (params: { page: number; keyword: string }) => {
        const response = await filterMasterItems(params);
        return response.data;
    }
);

export const masterItemsFilterSlice = createSlice({
    name: 'master',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(filterMasterItemsThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(filterMasterItemsThunk.fulfilled, (state, action) => {
                state.status = 'success';
                state.response = action.payload;
            })
            .addCase(filterMasterItemsThunk.rejected, (state) => {
                state.status = 'failed';
            });
    }
});

export const {} = masterItemsFilterSlice.actions;
export const selectMasterItemsFilter = (state: RootState) => state.masterItemsFilterStore;
export default masterItemsFilterSlice.reducer;
