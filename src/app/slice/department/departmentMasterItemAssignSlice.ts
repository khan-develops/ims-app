import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { assignDepartmentMasterItem } from "../../api/department";
import { IDepartmentMaster } from "../../api/properties/IDepartment";
import { RootState } from "../../store";

const initialState: {
	response: IDepartmentMaster | null,
	status: 'idle' | 'loading' | 'success' | 'failed';
} = {
	response: null,
	status: 'idle'
}

export const departmentMasterItemAssignThunk = createAsyncThunk(
	'departmentMasterItemAssignThunk',
	async (params: { state: string; masterItemId: number }) => {
		const response = await assignDepartmentMasterItem(params);
		return response.data;
	}
)

const departmentMasterItemAssignSlice = createSlice({
	name: 'departmentMasterItemAssignSlice',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(departmentMasterItemAssignThunk.pending, (state) => {
			state.status = 'loading';
		})
			.addCase(departmentMasterItemAssignThunk.fulfilled, (state, action: PayloadAction<IDepartmentMaster>) => {
				state.response = action.payload;
			})
			.addCase(departmentMasterItemAssignThunk.rejected, (state) => {
				state.status = 'failed';
			});
	}
})

export const selectDepartmentMasterItemAssign = (state: RootState) => state.departmentMasterItemAssignStore;
export default departmentMasterItemAssignSlice.reducer;