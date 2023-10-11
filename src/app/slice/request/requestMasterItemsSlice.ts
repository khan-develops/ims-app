import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { getRequestMasterItems } from '../../api/request';
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

export const getRequestMasterItemsThunk = createAsyncThunk(
    'getRequestMasterDepartmentItemsThunk',
    async (params: { state: string; page: number }) => {
        const response = await getRequestMasterItems(params);
        return response.data;
    }
);

export const requestMasterItemsSlice = createSlice({
    name: 'requestItemsSlice',
    initialState,
    reducers: {
        changeRequestMasterItems: (state, action: PayloadAction<IRequestMaster[]>) => {
            state.response.content = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getRequestMasterItemsThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getRequestMasterItemsThunk.fulfilled, (state, action) => {
                state.response = action.payload;
            })
            .addCase(getRequestMasterItemsThunk.rejected, (state) => {
                state.status = 'failed';
            });
    }
});

export const selectRequestMasterItems = (state: RootState) => state.requestMasterItemsStore;

export const { changeRequestMasterItems } = requestMasterItemsSlice.actions;

export default requestMasterItemsSlice.reducer;
