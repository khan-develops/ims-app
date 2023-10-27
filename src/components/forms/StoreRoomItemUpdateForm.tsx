import { Box, Button, Grid, InputAdornment, TextField } from '@mui/material';
import { ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { changeStoreRoomItem, updateStoreRoomItemThunk } from '../../app/slice/storeRoom/storeRoomUpdateSlice';
import {
    changeStoreRoomMasterItems,
    getStoreRoomMasterItemsThunk,
    selectStoreRoomMasterItems
} from '../../app/slice/storeRoom/storeRoomMasterItemsSlice';
import { selectDepartmentDrawer, toggleDepartmentItemDrawer } from '../../app/slice/drawerToggle/departmentDrawerSlice';

const StoreRoomItemUpdateForm = () => {
    const { toggleType, departmentItem } = useAppSelector(selectDepartmentDrawer);
    const storeRoomMasterItemsSelector = useAppSelector(selectStoreRoomMasterItems);
    const dispatch = useAppDispatch();

    const handleSubmit = () => {
        if (departmentItem) {
            dispatch(updateStoreRoomItemThunk(departmentItem))
                .then(() => {
                    dispatch(
                        changeStoreRoomMasterItems(
                            storeRoomMasterItemsSelector.response?.content.map((storeRoomMasterItem) => ({
                                ...storeRoomMasterItem,
                                location:
                                    departmentItem.id === storeRoomMasterItem.id
                                        ? departmentItem.location
                                        : storeRoomMasterItem.location,
                                quantity:
                                    departmentItem.id === storeRoomMasterItem.id
                                        ? departmentItem.quantity
                                        : storeRoomMasterItem.quantity,
                                lotNumber:
                                    departmentItem.id === storeRoomMasterItem.id
                                        ? departmentItem.lotNumber
                                        : storeRoomMasterItem.lotNumber,
                                usageLevel:
                                    departmentItem.id === storeRoomMasterItem.id
                                        ? departmentItem.usageLevel
                                        : storeRoomMasterItem.usageLevel,
                                minimumQuantity:
                                    departmentItem.id === storeRoomMasterItem.id
                                        ? departmentItem.minimumQuantity
                                        : storeRoomMasterItem.minimumQuantity,
                                maximumQuantity:
                                    departmentItem.id === storeRoomMasterItem.id
                                        ? departmentItem.maximumQuantity
                                        : storeRoomMasterItem.maximumQuantity,
                                expirationDate:
                                    departmentItem.id === storeRoomMasterItem.id
                                        ? departmentItem.expirationDate
                                        : storeRoomMasterItem.expirationDate,
                                receivedDate:
                                    departmentItem.id === storeRoomMasterItem.id
                                        ? departmentItem.receivedDate
                                        : storeRoomMasterItem.receivedDate
                            }))
                        )
                    );
                    dispatch(toggleDepartmentItemDrawer({ toggleType: '', departmentItem: null }));
                })
                .catch((error: Error) => console.error(error.message));
        }
    };

    const handleCancel = () => {
        dispatch(toggleDepartmentItemDrawer({ toggleType: '', departmentItem: null }));
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.name === 'location' && departmentItem) {
            dispatch(
                toggleDepartmentItemDrawer({
                    toggleType: 'UPDATE_DEPARTMENT_ITEM',
                    departmentItem: { ...departmentItem, location: event.target.value }
                })
            );
        }
        if (event.target.name === 'usageLevel' && departmentItem) {
            dispatch(
                toggleDepartmentItemDrawer({
                    toggleType: 'UPDATE_DEPARTMENT_ITEM',
                    departmentItem: { ...departmentItem, usageLevel: event.target.value }
                })
            );
        }
        if (event.target.name === 'minimumQuantity' && departmentItem) {
            dispatch(
                toggleDepartmentItemDrawer({
                    toggleType: 'UPDATE_DEPARTMENT_ITEM',
                    departmentItem: { ...departmentItem, minimumQuantity: parseInt(event.target.value) }
                })
            );
        }
        if (event.target.name === 'maximumQuantity' && departmentItem) {
            dispatch(
                toggleDepartmentItemDrawer({
                    toggleType: 'UPDATE_DEPARTMENT_ITEM',
                    departmentItem: { ...departmentItem, maximumQuantity: parseInt(event.target.value) }
                })
            );
        }
    };

    const handleDateChange = (value: Date | null, columnName: string) => {
        if (columnName === 'expirationDate') {
            dispatch(changeStoreRoomItem({ departmentItem: { expirationDate: value } }));
        }
        if (columnName === 'receivedDate') {
            dispatch(changeStoreRoomItem({ departmentItem: { expirationDate: value } }));
        }
    };

    return (
        <Box sx={{ padding: 5 }}>
            <Grid container>
                <Grid item xs={12} sm={12} md={6} lg={4} xl={4} sx={{ padding: 1 }}>
                    <TextField
                        sx={{ width: '100%' }}
                        name="location"
                        id="location"
                        label="LOCATION"
                        variant="outlined"
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        value={departmentItem?.location}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange(event)}
                    />
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={4} xl={4} sx={{ padding: 1 }}>
                    <TextField
                        sx={{ width: '100%' }}
                        name="usageLevel"
                        id="usageLevel"
                        label="USAGE LEVEL"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        size="small"
                        value={departmentItem?.usageLevel}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={4} xl={4} sx={{ padding: 1 }}>
                    <TextField
                        sx={{ width: '100%' }}
                        type="number"
                        InputProps={{
                            inputProps: { min: 0 }
                        }}
                        name="maximumQuantity"
                        InputLabelProps={{ shrink: true }}
                        id="maximumQuantity"
                        label="MAXIMUM QUANTITY"
                        variant="outlined"
                        size="small"
                        value={departmentItem?.maximumQuantity}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={4} xl={4} sx={{ padding: 1 }}>
                    <TextField
                        sx={{ width: '100%' }}
                        InputProps={{
                            inputProps: { min: 0 }
                        }}
                        type="number"
                        id="minimumQuantity"
                        name="minimumQuantity"
                        InputLabelProps={{ shrink: true }}
                        label="MINIMUM QUANTITY"
                        variant="outlined"
                        size="small"
                        value={departmentItem?.minimumQuantity}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={4} xl={4} sx={{ padding: 1 }}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DateTimePicker
                            label="Expiration Date"
                            inputFormat="MM/DD/YYYY HH:MM"
                            value={departmentItem?.expirationDate}
                            onChange={(value: Date | null) => handleDateChange(value, 'expirationDate')}
                            renderInput={(params) => (
                                <TextField {...params} size="small" sx={{ width: '100%' }} name="expirationDate" />
                            )}
                        />
                    </LocalizationProvider>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={4} xl={4} sx={{ padding: 1 }}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DateTimePicker
                            label="Received Date"
                            inputFormat="MM/DD/YYYY HH:MM"
                            value={departmentItem?.receivedDate}
                            onChange={(value: Date | null) => handleDateChange(value, 'receivedDate')}
                            renderInput={(params) => (
                                <TextField {...params} size="small" sx={{ width: '100%' }} name="receivedDate" />
                            )}
                        />
                    </LocalizationProvider>
                </Grid>
            </Grid>

            <Grid container gap={5} sx={{ paddingTop: 10 }} justifyContent="center">
                <Grid item>
                    <Button variant="outlined" onClick={handleSubmit} sx={{ width: 200 }}>
                        UPDATE
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="outlined" color="secondary" onClick={handleCancel} sx={{ width: 200 }}>
                        CANCEL
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default StoreRoomItemUpdateForm;
