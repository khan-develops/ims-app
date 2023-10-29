import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../store"
import { IRequestMaster } from "../../api/properties/IRequest"

export const initialState: {
	requestMasterItems: IRequestMaster[]
} = {
	requestMasterItems: []
}

export const requestMasterItemsCompleteSelectedSlice = createSlice({
	name: 'requestMasterItemsCompleteSelectedSlice',
	initialState,
	reducers: {
		handleRequestMasterItemsCompleteSelected: (state, action: PayloadAction<IRequestMaster[]>) => {
			state.requestMasterItems = action.payload
		}
	}
})

export const selectRequestMasterItemsCompleteSelected = (state: RootState) => state.requestMasterItemsCompleteSelectedStore;
export const { handleRequestMasterItemsCompleteSelected } = requestMasterItemsCompleteSelectedSlice.actions
export default requestMasterItemsCompleteSelectedSlice.reducer