import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../store"
import { IRequestMaster } from "../../api/properties/IRequest"

export const initialState: {
	requestMasterItems: IRequestMaster[]
} = {
	requestMasterItems: []
}

export const requestMasterItemsPendingSelectedSlice = createSlice({
	name: 'requestMasterItemsPendingSelectedSlice',
	initialState,
	reducers: {
		handleRequestMasterItemsPendingSelected: (state, action: PayloadAction<IRequestMaster[]>) => {
			state.requestMasterItems = action.payload
		}
	}
})

export const selectRequestMasterItemsPendingSelected = (state: RootState) => state.requestMasterItemsPendingSelectedStore;
export const { handleRequestMasterItemsPendingSelected } = requestMasterItemsPendingSelectedSlice.actions
export default requestMasterItemsPendingSelectedSlice.reducer