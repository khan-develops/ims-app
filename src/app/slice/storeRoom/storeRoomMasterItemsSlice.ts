import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { IStoreRoomMaster } from '../../api/properties/IStoreRoom';
import { getStoreRoomMasterItems } from '../../api/storeRoom';

export interface StoreRoomMasterState {
    response: {
        content: IStoreRoomMaster[];
        totalElements: number;
        size: number;
        number: number;
    };
    status: 'idle' | 'loading' | 'success' | 'failed';
}

export const initialState: StoreRoomMasterState = {
    response: {
        content: [],
        totalElements: 0,
        size: 0,
        number: 0
    },
    status: 'idle'
};

export const getStoreRoomMasterItemsThunk = createAsyncThunk('getStoreRoomMasterItemsThunk', async (page: number) => {
    const response = await getStoreRoomMasterItems(page);
    return response.data;
});

export const storeRoomMasterItemsSlice = createSlice({
    name: 'storeRoomSlice',
    initialState,
    reducers: {
        changeStoreRoomMasterItems: (state, action: PayloadAction<IStoreRoomMaster[]>) => {
            state.response.content = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getStoreRoomMasterItemsThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getStoreRoomMasterItemsThunk.fulfilled, (state, action) => {
                state.status = 'success';
                state.response = action.payload;
            })
            .addCase(getStoreRoomMasterItemsThunk.rejected, (state) => {
                state.status = 'failed';
            });
    }
});

export const { changeStoreRoomMasterItems } = storeRoomMasterItemsSlice.actions;
export const selectStoreRoomMasterItems = (state: RootState) => state.storeRoomMasterItemsStore;
export default storeRoomMasterItemsSlice.reducer;
