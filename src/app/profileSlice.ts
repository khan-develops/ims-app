import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

export interface iProfile {
    displayName: string;
    givenName: string;
    jobTitle: string;
    mail: string;
    mobilePhone: string;
    officeLocation: string;
    preferredLanguage: string;
    surname: string;
    userPrincipalName: string;
    id: string;
}

export interface iProfileState {
    profile: iProfile | null;
    status: 'idle' | 'loading' | 'success' | 'failed';
}

const initialState: iProfileState = {
    profile: null,
    status: 'idle'
};

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        getProfile: (state, action) => {
            state.profile = action.payload;
        }
    }
});

export const { getProfile } = profileSlice.actions;
export const selectProfile = (state: RootState) => state.profileStore;
export default profileSlice.reducer;
