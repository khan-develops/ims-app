import { Box, Button, Grid, TextField } from '@mui/material';
import { ChangeEvent, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectDrawerToggleType, toggleDrawer } from '../../app/slice/drawerToggle/drawerToggleTypeSlice';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { changeDepartmentItem } from '../../app/slice/department/departmentItemUpdateSlice';

const UpdateItemForm = () => {
    const { departmentItem } = useAppSelector(selectDrawerToggleType);
    const dispatch = useAppDispatch();

    useEffect(() => {}, []);

    const handleSubmit = () => {
        dispatch(toggleDrawer({ type: '' }));
    };

    const handleCancel = () => {
        dispatch(toggleDrawer({ type: '' }));
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.name === 'location') {
            dispatch(
                changeDepartmentItem({
                    departmentItem: { location: event.target.value }
                })
            );
        }
        if (event.target.name === 'usageLevel') {
            dispatch(
                changeDepartmentItem({
                    departmentItem: { usageLevel: event.target.value }
                })
            );
        }
        if (event.target.name === 'minimumQuantity') {
            dispatch(
                changeDepartmentItem({
                    departmentItem: { minimumQuantity: event.target.value }
                })
            );
        }
        if (event.target.name === 'maximumQuantity') {
            dispatch(
                changeDepartmentItem({
                    departmentItem: { maximumQuantity: event.target.value }
                })
            );
        }
    };

    const handleDateChange = (value: Date | null, columnName: string) => {
        if (columnName === 'expirationDate') {
            dispatch(changeDepartmentItem({ departmentItem: { expirationDate: value } }));
        }
        if (columnName === 'receivedDate') {
            dispatch(changeDepartmentItem({ departmentItem: { expirationDate: value } }));
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
                        label="LOCAITON"
                        variant="outlined"
                        size="small"
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
                        variant="outlined"
                        size="small"
                        value={departmentItem?.usageLevel}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={4} xl={4} sx={{ padding: 1 }}>
                    <TextField
                        sx={{ width: '100%' }}
                        name="maximumQuantity"
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
                        id="minimumQuantity"
                        label="MINIMUM QAUNTITY"
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
                            renderInput={(params) => <TextField {...params} size="small" sx={{ width: '100%' }} />}
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
                            renderInput={(params) => <TextField {...params} size="small" sx={{ width: '100%' }} />}
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

export default UpdateItemForm;
