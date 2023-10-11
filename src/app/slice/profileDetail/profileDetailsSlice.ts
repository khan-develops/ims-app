import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { IProfileDetail } from '../../api/properties/IProfileDetail';
import { createProfileDetails, filterProfileDetails, getProfileDetails, syncProfileDetails } from '../../api/profileDetail';

export interface ProfileDetailState {
    response: {
        content: IProfileDetail[],
        number: number,
        totalElements: number,
        totalPages: number,
        size: number
    },
    status: 'idle' | 'loading' | 'success' | 'failed';
}

const initialState: ProfileDetailState = {
    response: {
        content: [],
        number: 0,
        totalElements: 0,
        totalPages: 0,
        size: 0
    },
    status: 'idle'
};

export const getProfileDetailsThunk = createAsyncThunk('getProfileDetailsThunk', async (page: number) => {
    const response = await getProfileDetails(page);
    return response.data;
});

export const filterProfileDetailsThunk = createAsyncThunk('filterProfileDetailsThunk', async (params: { displayName: string, page: number }) => {
    const response = await filterProfileDetails(params);
    return response.data;
});

export const createProfileDetailsThunk = createAsyncThunk(
    'createProfileDetailsThunk',
    async (profileDetails: IProfileDetail[]) => {
        const response = await createProfileDetails(profileDetails);
        return response.data;
    }
);

export const syncProfileDetailsThunk = createAsyncThunk(
    'createProfileDetailsThunk',
    async (params: { profileDetails: IProfileDetail[], page: number }) => {
        const response = await syncProfileDetails(params);
        return response.data;
    }
);

export const profileDetailsSlice = createSlice({
    name: 'usersSlice',
    initialState,
    reducers: {
        changeProfileDetails: (state, action: PayloadAction<IProfileDetail[]>) => {
            state.response.content = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProfileDetailsThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getProfileDetailsThunk.fulfilled, (state, action: PayloadAction<{
                content: IProfileDetail[],
                number: number,
                totalElements: number,
                totalPages: number,
                size: number
            }>) => {
                state.status = 'success';
                state.response = action.payload;
            })
            .addCase(getProfileDetailsThunk.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(filterProfileDetailsThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(filterProfileDetailsThunk.fulfilled, (state, action: PayloadAction<{
                content: IProfileDetail[],
                number: number,
                totalElements: number,
                totalPages: number,
                size: number
            }>) => {
                state.status = 'success';
                state.response = action.payload;
            })
            .addCase(filterProfileDetailsThunk.rejected, (state) => {
                state.status = 'failed';
            });
    }
});

export const { changeProfileDetails } = profileDetailsSlice.actions;
export const selectProfileDetails = (state: RootState) => state.profileDetailsStore;
export default profileDetailsSlice.reducer;
