import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import masterReducer from './slice/master/masterItemsSlice';
import pageReducer from './common/pageSlice';
import masterDepartmentItemReducer from './slice/master/masterDepartmentItemSlice';
import departmentItemsReducer from './departments/departmentItemsSlice';
import requestTabReducer from './common/requestTabSlice';
import profileReducer from './profileSlice';
import searchReducer from './search';
import storeRoomMasterItemsReducer from './slice/storeRoom/storeRoomMasterItemsSlice';
import storeRoomUpdateReducer from './slice/storeRoom/storeRoomUpdateSlice';
import requestItemsUpdateReducer from './slice/request/requestMasterItemsUpdateSlice';
import requestMasterItemsReducer from './slice/request/requestMasterItemsPurchaseSlice';
import bottomToolbarItemsReducer from './bottomToolbar/bottomToolbarItems';
import requestMasterItemsCheckedReducer from './slice/request/requestMasterItemsCheckedSlice';
import requestMasterItemsCreateReducer from './slice/request/requestMasterItemsCreateSlice';
import requestMasterItemsCompleteReducer from './slice/request/requestMasterItemsCompleteSlice';
import requestMasterItemsPendingReducer from './slice/request/requestMasterItemsPendingSlice';
import requestMasterItemsUpdateReducer from './slice/request/requestMasterItemsUpdateSlice';
import requestMasterItemUpdateReducer from './slice/request/requestMasterItemUpdateSlice';
import masterDepartmentItemsReducer from './slice/master/masterDepartmentItemsSlice';
import masterItemUpdateReducer from './slice/master/masterItemUpdateSlice';
import profileDetailsReducer from './slice/profileDetail/profileDetailsSlice';
import updateProfileDetailReducer from './slice/profileDetail/updateProfileDetailSlice';
import profilesReducer from './profilesSlice';
import profileDetailReducer from './slice/profileDetail/profileDetailSlice';
import requestMasterItemsPendingCheckedReducer from './slice/request/requestMasterItemsPendingCheckedSlice';
import downloadDepartmentMasterItemsReducer from './download/downloadDepartmentMasterItemsSlice';
import departmentMasterItemsReducer from './slice/department/departmentMasterItemsSlice';
import departmentItemUpdateReducer from './slice/department/departmentItemUpdateSlice';
import departmentItemReducer from './slice/department/departmentItemSlice';
import masterItemCreateReducer from './slice/master/masterItemCreateSlice';
import totalAmountReducer from './slice/totalAmount';
import masterItemsFilterReducer from './slice/master/masterItemsFilterSlice';
import grandTotalReducer from './slice/grandTotalSlice';
import masterItemDeleteReducer from './slice/master/masterItemDeleteSlice';
import departmentNamesReducer from './slice/departmentName/departmentNamesSlice';
import departmentNameCreateReducer from './slice/departmentName/departmentNameActionSlice';
import departmentMasterItemAssignReducer from './slice/department/departmentMasterItemAssignSlice';
import requestMasterItemsDashboardReducer from './slice/request/dashboard/requestMasterItemsDashboardSlice'
import requestMasterItemsSelectedReducer from './slice/selectedRequests/requestMasterItemsPurchaseSelectedSlice';
import masterDrawerReducer from './slice/drawerToggle/masterDrawerSlice';
import departmentDrawerReducer from './slice/drawerToggle/departmentDrawerSlice'
import requestDrawerReducer from './slice/drawerToggle/requestDrawerSlice'
import purchaseRequestMasterItemsReducer from './slice/request/requestMasterItemsPurchaseSlice';
import requestMasterItemsPurchaseSelectedReducer from './slice/selectedRequests/requestMasterItemsPurchaseSelectedSlice';
import requestMasterItemsPendingSelectedReducer from './slice/selectedRequests/requestMasterItemsPendingSelectedSlice';
import requestMasterItemsCompleteSelectedReducer from './slice/selectedRequests/requestMasterItemsCompleteSelectedSlice';

export const store = configureStore({
    reducer: {
        masterItemsStore: masterReducer,
        masterItemCreateStore: masterItemCreateReducer,
        masterDepartmentItemStore: masterDepartmentItemReducer,
        pageStore: pageReducer,
        departmentItemsStore: departmentItemsReducer,
        requestMasterItemsStore: requestMasterItemsReducer,
        requestTabStore: requestTabReducer,
        profileStore: profileReducer,
        searchStore: searchReducer,
        storeRoomMasterItemsStore: storeRoomMasterItemsReducer,
        storeRoomUpdateStore: storeRoomUpdateReducer,
        requestItemsUpdateStore: requestItemsUpdateReducer,
        bottomToolbarItemsStore: bottomToolbarItemsReducer,
        requestMasterItemsCheckedStore: requestMasterItemsCheckedReducer,
        requestMasterItemsCreateStore: requestMasterItemsCreateReducer,
        requestMasterItemsCompleteStore: requestMasterItemsCompleteReducer,
        requestMasterItemsPendingStore: requestMasterItemsPendingReducer,
        requestMasterItemsUpdateStore: requestMasterItemsUpdateReducer,
        requestMasterItemUpdateStore: requestMasterItemUpdateReducer,
        masterDepartmentItemsStore: masterDepartmentItemsReducer,
        masterItemUpdateStore: masterItemUpdateReducer,
        profileDetailsStore: profileDetailsReducer,
        updateProfileDetailStore: updateProfileDetailReducer,
        profilesStore: profilesReducer,
        profileDetailStore: profileDetailReducer,
        requestMasterItemsPendingCheckedStore: requestMasterItemsPendingCheckedReducer,
        downloadDepartmentMasterItemsStore: downloadDepartmentMasterItemsReducer,
        departmentMasterItemsStore: departmentMasterItemsReducer,
        departmentItemUpdateStore: departmentItemUpdateReducer,
        departmentItemStore: departmentItemReducer,
        totalAmountStore: totalAmountReducer,
        masterItemsFilterStore: masterItemsFilterReducer,
        grandTotalStore: grandTotalReducer,
        masterItemDeleteStore: masterItemDeleteReducer,
        departmentNamesStore: departmentNamesReducer,
        departmentNameCreateStore: departmentNameCreateReducer,
        departmentMasterItemAssignStore: departmentMasterItemAssignReducer,
        requestMasterItemsDashboardStore: requestMasterItemsDashboardReducer,
        requestMasterItemsSelectedStore: requestMasterItemsSelectedReducer,
        masterDrawerStore: masterDrawerReducer,
        departmentDrawerStore: departmentDrawerReducer,
        requestDrawerStore: requestDrawerReducer,
        purchaseRequestMasterItemsStore: purchaseRequestMasterItemsReducer,
        requestMasterItemsPurchaseSelectedStore: requestMasterItemsPurchaseSelectedReducer,
        requestMasterItemsPendingSelectedStore: requestMasterItemsPendingSelectedReducer,
        requestMasterItemsCompleteSelectedStore: requestMasterItemsCompleteSelectedReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
