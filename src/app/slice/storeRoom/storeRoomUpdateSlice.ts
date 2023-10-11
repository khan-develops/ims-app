import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { IStoreRoom } from '../../api/properties/IStoreRoom';
import { updateStoreRoomItem } from '../../api/storeRoom';

export interface StoreRoomUpdateState {
    response: null | IStoreRoom;
    status: 'idle' | 'loading' | 'success' | 'failed';
}

export const initialState: StoreRoomUpdateState = {
    response: null,
    status: 'idle'
};

export const updateStoreRoomItemThunk = createAsyncThunk(
    'updateStoreRoomItemThunk',
    async (storeRoomItem: IStoreRoom) => {
        const response = await updateStoreRoomItem(storeRoomItem);
        return response.data;
    }
);

export const storeRoomUpdateSlice = createSlice({
    name: 'storeRoomSlice',
    initialState,
    reducers: {
        changeStoreRoomItem: (state, action) => {
            state = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateStoreRoomItemThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateStoreRoomItemThunk.fulfilled, (state, action) => {
                state.status = 'success';
                state.response = action.payload;
            })
            .addCase(updateStoreRoomItemThunk.rejected, (state) => {
                state.status = 'failed';
            });
    }
});

export const { changeStoreRoomItem } = storeRoomUpdateSlice.actions;
export const selectStoreRoomUpdate = (state: RootState) => state.storeRoomUpdateStore;

export default storeRoomUpdateSlice.reducer;
