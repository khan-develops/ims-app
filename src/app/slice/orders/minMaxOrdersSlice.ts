import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { getMinmaxOrders } from '../../api/request';
import { IMinMaxMasterOrder } from '../../api/properties/IMinMaxOrder';

export interface MinMaxOrderState {
    response: {
        content: IMinMaxMasterOrder[];
        last: boolean;
        totalPages: number;
        totalElements: number;
        first: boolean;
        size: number;
        number: number;
        numberOfElements: number;
        empty: boolean;
    };
    status: 'idle' | 'loading' | 'success' | 'failed';
}

const initialState: MinMaxOrderState = {
    response: {
        content: [],
        last: false,
        totalPages: 0,
        totalElements: 0,
        first: false,
        size: 0,
        number: 0,
        numberOfElements: 0,
        empty: false
    },
    status: 'idle'
};

export const getMinMaxOrdersThunk = createAsyncThunk(
    'getMinMaxOrdersThunk',
    async (params: { department: string, page: number }) => {
        const response = await getMinmaxOrders(params);
        return response.data;
    }
);

export const minMaxOrdersSlice = createSlice({
    name: 'requestItemsSlice',
    initialState,
    reducers: {
        changeRequestMasterItems: (state, action) => {
            state.response = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMinMaxOrdersThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getMinMaxOrdersThunk.fulfilled, (state, action) => {
                state.response = action.payload;
            })
            .addCase(getMinMaxOrdersThunk.rejected, (state) => {
                state.status = 'failed';
            })
    }
});

export const selectMinMaxOrders = (state: RootState) => state.minMaxOrdersStore;

export const { } = minMaxOrdersSlice.actions;

export default minMaxOrdersSlice.reducer;
