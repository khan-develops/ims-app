import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { IProfileDetail } from '../../api/properties/IProfileDetail';
import { createProfileDetail, getProfileDetail, updateProfileDetail } from '../../api/profileDetail';

export interface ProfileDetailState {
    profileDetail: IProfileDetail | null;
    status: 'idle' | 'loading' | 'success' | 'failed';
}

const initialState: ProfileDetailState = {
    profileDetail: null,
    status: 'idle'
};

export const getProfileDetailThunk = createAsyncThunk('getProfileDetailThunk', async (id: string) => {
    const response = await getProfileDetail(id);
    return response.data;
});

export const createProfileDetailThunk = createAsyncThunk('createUsersThunk', async (profileDetail: IProfileDetail) => {
    const response = await createProfileDetail(profileDetail);
    return response.data;
});

export const updateProfileDetailThunk = createAsyncThunk(
    'updateProfileDetailThunk',
    async (params: { id: string; profileDetail: IProfileDetail }) => {
        const response = await updateProfileDetail(params.id, params.profileDetail);
        return response.data;
    }
);

export const profileDetailSlice = createSlice({
    name: 'usersSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProfileDetailThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getProfileDetailThunk.fulfilled, (state, action) => {
                state.status = 'success';
                state.profileDetail = action.payload;
            })
            .addCase(getProfileDetailThunk.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(createProfileDetailThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createProfileDetailThunk.fulfilled, (state, action) => {
                state.status = 'success';
                state.profileDetail = action.payload;
            })
            .addCase(createProfileDetailThunk.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(updateProfileDetailThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateProfileDetailThunk.fulfilled, (state, action) => {
                state.status = 'success';
                state.profileDetail = action.payload;
            })
            .addCase(updateProfileDetailThunk.rejected, (state) => {
                state.status = 'failed';
            });
    }
});

export const { } = profileDetailSlice.actions;
export const selectProfileDetail = (state: RootState) => state.profileDetailStore;
export default profileDetailSlice.reducer;
