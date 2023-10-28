import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../store"
import { IRequestMaster } from "../../api/properties/IRequest"

export const initialState: {
	requestMasterItems: IRequestMaster[]
} = {
	requestMasterItems: []
}

export const requestMasterItemsPurchaseSelectedSlice = createSlice({
	name: 'requestMasterItemsPurchaseSelectedSlice',
	initialState,
	reducers: {
		handleRequestMasterItemsPurchaseSelected: (state, action: PayloadAction<IRequestMaster[]>) => {
			state.requestMasterItems = action.payload
		}
	}
})

export const selectRequestMasterItemsPurchaseSelected = (state: RootState) => state.requestMasterItemsPurchaseSelectedStore;
export const { handleRequestMasterItemsPurchaseSelected } = requestMasterItemsPurchaseSelectedSlice.actions
export default requestMasterItemsPurchaseSelectedSlice.reducer