import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../store"
import { IRequestMaster } from "../../api/properties/IRequest"

export const initialState: {
	requestMasterItems: IRequestMaster[]
} = {
	requestMasterItems: []
}

export const requestMasterItemsSelectedSlice = createSlice({
	name: 'requestMasterItemsSelectedSlice',
	initialState,
	reducers: {
		handleRequestMasterItemsSelected: (state, action: PayloadAction<IRequestMaster[]>) => {
			state.requestMasterItems = action.payload
		}
	}
})

export const selectRequestMasterItemsSelected = (state: RootState) => state.requestMasterItemsSelectedStore;
export const { handleRequestMasterItemsSelected } = requestMasterItemsSelectedSlice.actions
export default requestMasterItemsSelectedSlice.reducer