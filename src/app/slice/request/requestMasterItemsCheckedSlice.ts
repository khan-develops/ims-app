import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { IRequestMaster } from '../../api/properties/IRequest';

export interface RequestMasterItemsCheckedState {
    requestMasterItemsChecked: IRequestMaster[];
}

const initialState: RequestMasterItemsCheckedState = {
    requestMasterItemsChecked: []
};

export const requestMasterItemsCheckedSlice = createSlice({
    name: 'requestMasterItemsCheckedSlice',
    initialState,
    reducers: {
        changeRequestMasterItemsChecked: (state, action: PayloadAction<IRequestMaster[]>) => {
            state.requestMasterItemsChecked = action.payload;
        }
    }
});

export const selectRequestMasterItemsChecked = (state: RootState) => state.requestMasterItemsCheckedStore;

export const { changeRequestMasterItemsChecked } = requestMasterItemsCheckedSlice.actions;

export default requestMasterItemsCheckedSlice.reducer;
