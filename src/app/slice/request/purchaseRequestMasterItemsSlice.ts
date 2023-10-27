import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { getPurchaseRequestMasterItems } from '../../api/request';
import { RequestMasterItemsState } from '../../api/states/RequestState';
import { IRequestMaster } from '../../api/properties/IRequest';

const initialState: RequestMasterItemsState = {
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

export const getPurchaseRequestMasterItemsThunk = createAsyncThunk(
    'getPurchaseRequestMasterItemsThunk',
    async (params: { state: string, page: number }) => {
        const response = await getPurchaseRequestMasterItems(params);
        return response.data;
    }
);

export const purchaseRequestMasterItemsSlice = createSlice({
    name: 'purchaseRequestMasterItemsSlice',
    initialState,
    reducers: {
        changePurchaseRequestMasterItems: (state, action: PayloadAction<IRequestMaster[]>) => {
            state.response.content = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPurchaseRequestMasterItemsThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getPurchaseRequestMasterItemsThunk.fulfilled, (state, action) => {
                state.response = action.payload;
            })
            .addCase(getPurchaseRequestMasterItemsThunk.rejected, (state) => {
                state.status = 'failed';
            });
    }
});

export const selectRequestMasterItems = (state: RootState) => state.purchaseRequestMasterItemsStore;

export const { changePurchaseRequestMasterItems } = purchaseRequestMasterItemsSlice.actions;

export default purchaseRequestMasterItemsSlice.reducer;
