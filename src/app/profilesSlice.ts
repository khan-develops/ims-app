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

export interface iProfilesState {
    profiles: iProfile[];
    status: 'idle' | 'loading' | 'success' | 'failed';
}

const initialState: iProfilesState = {
    profiles: [],
    status: 'idle'
};

export const profilesSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        getProfiles: (state, action) => {
            state.profiles = action.payload;
        }
    }
});

export const { getProfiles } = profilesSlice.actions;
export const selectProfiles = (state: RootState) => state.profilesStore;
export default profilesSlice.reducer;
