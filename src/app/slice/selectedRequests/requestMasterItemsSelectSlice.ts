import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../store"

export const initialState: {
	requestMasterItems: number[]
} = {
	requestMasterItems: []
}

export const requestMasterItemsSelectedSlice = createSlice({
	name: 'requestMasterItemsSelectedSlice',
	initialState,
	reducers: {
		handleRequestMasterItemsSelected: (state, action: PayloadAction<number[]>) => {
			state.requestMasterItems = action.payload
		}
	}
})

export const selectRequestMasterItemsSelected = (state: RootState) => state.requestMasterItemsSelectedStore;
export const { handleRequestMasterItemsSelected } = requestMasterItemsSelectedSlice.actions
export default requestMasterItemsSelectedSlice.reducer