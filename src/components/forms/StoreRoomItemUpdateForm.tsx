import { Box, Button, Grid, InputAdornment, TextField } from '@mui/material';
import { ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectDrawerToggleType, toggleDrawer } from '../../app/slice/drawerToggle/drawerToggleTypeSlice';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { changeStoreRoomItem, updateStoreRoomItemThunk } from '../../app/slice/storeRoom/storeRoomUpdateSlice';
import {
    changeStoreRoomMasterItems,
    getStoreRoomMasterItemsThunk,
    selectStoreRoomMasterItems
} from '../../app/slice/storeRoom/storeRoomMasterItemsSlice';

const StoreRoomItemUpdateForm = () => {
    const drawer = useAppSelector(selectDrawerToggleType);
    const storeRoomMasterItemsSelector = useAppSelector(selectStoreRoomMasterItems);
    const { storeRoomItem } = drawer;
    const dispatch = useAppDispatch();

    const handleSubmit = () => {
        if (storeRoomItem) {
            dispatch(updateStoreRoomItemThunk(storeRoomItem))
                .then(() => {
                    dispatch(
                        changeStoreRoomMasterItems(
                            storeRoomMasterItemsSelector.response?.content.map((storeRoomMasterItem) => ({
                                ...storeRoomMasterItem,
                                location:
                                    storeRoomItem.id === storeRoomMasterItem.id
                                        ? storeRoomItem.location
                                        : storeRoomMasterItem.location,
                                quantity:
                                    storeRoomItem.id === storeRoomMasterItem.id
                                        ? storeRoomItem.quantity
                                        : storeRoomMasterItem.quantity,
                                lotNumber:
                                    storeRoomItem.id === storeRoomMasterItem.id
                                        ? storeRoomItem.lotNumber
                                        : storeRoomMasterItem.lotNumber,
                                usageLevel:
                                    storeRoomItem.id === storeRoomMasterItem.id
                                        ? storeRoomItem.usageLevel
                                        : storeRoomMasterItem.usageLevel,
                                minimumQuantity:
                                    storeRoomItem.id === storeRoomMasterItem.id
                                        ? storeRoomItem.minimumQuantity
                                        : storeRoomMasterItem.minimumQuantity,
                                maximumQuantity:
                                    storeRoomItem.id === storeRoomMasterItem.id
                                        ? storeRoomItem.maximumQuantity
                                        : storeRoomMasterItem.maximumQuantity,
                                expirationDate:
                                    storeRoomItem.id === storeRoomMasterItem.id
                                        ? storeRoomItem.expirationDate
                                        : storeRoomMasterItem.expirationDate,
                                receivedDate:
                                    storeRoomItem.id === storeRoomMasterItem.id
                                        ? storeRoomItem.receivedDate
                                        : storeRoomMasterItem.receivedDate
                            }))
                        )
                    );
                    dispatch(toggleDrawer({ type: '' }));
                })
                .catch((error: Error) => console.error(error.message));
        }
    };

    const handleCancel = () => {
        dispatch(toggleDrawer({ type: '' }));
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.name === 'location' && storeRoomItem) {
            dispatch(toggleDrawer({ ...drawer, storeRoomItem: { ...storeRoomItem, location: event.target.value } }));
        }
        if (event.target.name === 'usageLevel' && storeRoomItem) {
            dispatch(toggleDrawer({ ...drawer, storeRoomItem: { ...storeRoomItem, usageLevel: event.target.value } }));
        }
        if (event.target.name === 'minimumQuantity' && storeRoomItem) {
            dispatch(
                toggleDrawer({
                    ...drawer,
                    storeRoomItem: { ...storeRoomItem, minimumQuantity: parseInt(event.target.value) }
                })
            );
        }
        if (event.target.name === 'maximumQuantity' && storeRoomItem) {
            dispatch(
                toggleDrawer({
                    ...drawer,
                    storeRoomItem: { ...storeRoomItem, maximumQuantity: parseInt(event.target.value) }
                })
            );
        }
    };

    const handleDateChange = (value: Date | null, columnName: string) => {
        if (columnName === 'expirationDate') {
            dispatch(changeStoreRoomItem({ storeRoomItem: { expirationDate: value } }));
        }
        if (columnName === 'receivedDate') {
            dispatch(changeStoreRoomItem({ storeRoomItem: { expirationDate: value } }));
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
                        value={storeRoomItem?.location}
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
                        value={storeRoomItem?.usageLevel}
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
                        value={storeRoomItem?.maximumQuantity}
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
                        value={storeRoomItem?.minimumQuantity}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={4} xl={4} sx={{ padding: 1 }}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DateTimePicker
                            label="Expiration Date"
                            inputFormat="MM/DD/YYYY HH:MM"
                            value={storeRoomItem?.expirationDate}
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
                            value={storeRoomItem?.receivedDate}
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
