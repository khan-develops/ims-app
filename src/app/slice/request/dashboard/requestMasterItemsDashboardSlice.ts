import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../store';
import { getRequestMasterItemsDashboard } from '../../../api/request';
import { RequestMasterItemsState } from '../../../api/states/RequestState';
import { IRequestMaster } from '../../../api/properties/IRequest';

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

export const getRequestMasterItemsDashboardThunk = createAsyncThunk(
    'getRequestMasterItemsDashboardThunk',
    async (params: { department: string, requestCategory: string, page: number }) => {
        const response = await getRequestMasterItemsDashboard(params);
        return response.data;
    }
);

export const requestMasterItemsDashboardSlice = createSlice({
    name: 'requestItemsSlice',
    initialState,
    reducers: {
        changeRequestMasterItemsDashboard: (state, action: PayloadAction<IRequestMaster[]>) => {
            state.response.content = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getRequestMasterItemsDashboardThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getRequestMasterItemsDashboardThunk.fulfilled, (state, action) => {
                state.response = action.payload;
            })
            .addCase(getRequestMasterItemsDashboardThunk.rejected, (state) => {
                state.status = 'failed';
            });
    }
});

export const selectRequestMasterItems = (state: RootState) => state.requestMasterItemsDashboardStore;

export const { changeRequestMasterItemsDashboard } = requestMasterItemsDashboardSlice.actions;

export default requestMasterItemsDashboardSlice.reducer;
