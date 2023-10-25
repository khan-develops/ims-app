import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    TextField
} from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { toggleDrawer } from '../../app/slice/drawerToggle/drawerToggleTypeSlice';
import { CATEGORY, DEPARTMENT } from '../../common/constants';
import { createMasterItemThunk } from '../../app/slice/master/masterItemCreateSlice';
import { changeMasterItems, selectMasterItems } from '../../app/slice/master/masterItemsSlice';
import { IMaster } from '../../app/api/properties/IMaster';

const MasterCreateForm = () => {
    const dispatch = useAppDispatch();
    const masterItemsSelector = useAppSelector(selectMasterItems);

    const [departments, setDepartments] = useState<string[]>([]);
    const [masterItem, setMasterItem] = useState<IMaster>({
        id: 0,
        item: '',
        manufacturer: '',
        recentCN: '',
        partNumber: '',
        recentVendor: '',
        fisherCN: '',
        vwrCN: '',
        labSourceCN: '',
        otherCN: '',
        purchaseUnit: '',
        unitPrice: 0,
        category: '',
        comment: '',
        itemType: '',
        itemGroup: '',
        drugClass: ''
    });

    const handleSubmit = () => {
        if (masterItem) {
            dispatch(
                createMasterItemThunk({
                    masterItem: masterItem,
                    departments: departments
                })
            )
                .then((response) => {
                    dispatch(
                        changeMasterItems(
                            masterItemsSelector.response.content.map((masterItem) => {
                                return masterItem.id === response.payload.id
                                    ? { ...masterItem, ...response.payload }
                                    : masterItem;
                            })
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
        setMasterItem({ ...masterItem, [event.target.id]: event.target.value });
    };

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (departments.some((department) => department === event.target.name)) {
            setDepartments(departments.filter((department) => department !== event.target.name));
        } else {
            setDepartments([...departments, event.target.name]);
        }
    };

    return (
        <Box sx={{ padding: 5 }}>
            <Grid container>
                <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4} sx={{ padding: 1 }}>
                            {' '}
                            <TextField
                                sx={{ width: '100%' }}
                                id="item"
                                name="item"
                                label="ITEM"
                                variant="outlined"
                                size="medium"
                                value={masterItem && masterItem.item}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4} sx={{ padding: 1 }}>
                            {' '}
                            <TextField
                                sx={{ width: '100%' }}
                                id="manufacturer"
                                label="MANUFACTURER"
                                variant="outlined"
                                size="medium"
                                value={masterItem && masterItem.manufacturer}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4} sx={{ padding: 1 }}>
                            {' '}
                            <TextField
                                sx={{ width: '100%' }}
                                id="recentCN"
                                name="recentCN"
                                label="RECENT CN"
                                variant="outlined"
                                size="medium"
                                value={masterItem && masterItem.recentCN}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4} sx={{ padding: 1 }}>
                            {' '}
                            <TextField
                                sx={{ width: '100%' }}
                                id="partNumber"
                                name="partNumber"
                                label="PART NUMBER"
                                variant="outlined"
                                size="medium"
                                value={masterItem && masterItem.partNumber}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4} sx={{ padding: 1 }}>
                            {' '}
                            <TextField
                                sx={{ width: '100%' }}
                                id="recentVendor"
                                name="recentVendor"
                                label="RECENT VENDOR"
                                variant="outlined"
                                size="medium"
                                value={masterItem && masterItem.recentVendor}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4} sx={{ padding: 1 }}>
                            {' '}
                            <TextField
                                sx={{ width: '100%' }}
                                id="fisherCN"
                                name="fisherCN"
                                label="FISHER CN"
                                variant="outlined"
                                size="medium"
                                value={masterItem && masterItem.fisherCN}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4} sx={{ padding: 1 }}>
                            {' '}
                            <TextField
                                sx={{ width: '100%' }}
                                id="vwrCN"
                                name="vwrCN"
                                label="VWR CN"
                                variant="outlined"
                                size="medium"
                                value={masterItem && masterItem.vwrCN}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4} sx={{ padding: 1 }}>
                            {' '}
                            <TextField
                                sx={{ width: '100%' }}
                                id="labSourceCN"
                                name="labSourceCN"
                                label="LAB SOURCE CN"
                                variant="outlined"
                                size="medium"
                                value={masterItem && masterItem.labSourceCN}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4} sx={{ padding: 1 }}>
                            {' '}
                            <TextField
                                sx={{ width: '100%' }}
                                id="otherCN"
                                name="otherCN"
                                label="OTHER CN"
                                variant="outlined"
                                size="medium"
                                value={masterItem && masterItem.otherCN}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4} sx={{ padding: 1 }}>
                            {' '}
                            <TextField
                                sx={{ width: '100%' }}
                                id="purchaseUnit"
                                name="purchaseUnit"
                                label="PURCHASE UNIT"
                                variant="outlined"
                                size="medium"
                                value={masterItem && masterItem.purchaseUnit}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4} sx={{ padding: 1 }}>
                            {' '}
                            <TextField
                                sx={{ width: '100%' }}
                                id="unitPrice"
                                name="unitPrice"
                                label="UNIT PRICE"
                                variant="outlined"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                                }}
                                size="medium"
                                value={masterItem && masterItem.unitPrice}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4} sx={{ padding: 1 }}>
                            <FormControl fullWidth>
                                <TextField
                                    sx={{ width: '100%' }}
                                    id="category"
                                    name="category"
                                    label="CATEGORY"
                                    variant="outlined"
                                    size="medium"
                                    value={masterItem && masterItem.category}
                                    onChange={handleChange}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4} sx={{ padding: 1 }}>
                            {' '}
                            <TextField
                                sx={{ width: '100%' }}
                                id="drugClass"
                                name="drugClass"
                                label="DRUG CLASS"
                                variant="outlined"
                                size="medium"
                                value={masterItem && masterItem.drugClass}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4} sx={{ padding: 1 }}>
                            {' '}
                            <TextField
                                sx={{ width: '100%' }}
                                id="type"
                                name="type"
                                label="TYPE"
                                variant="outlined"
                                size="medium"
                                value={masterItem && masterItem.itemType}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4} sx={{ padding: 1 }}>
                            {' '}
                            <TextField
                                sx={{ width: '100%' }}
                                id="itemGroup"
                                name="itemGroup"
                                label="GROUP"
                                variant="outlined"
                                size="medium"
                                value={masterItem && masterItem.itemGroup}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ padding: 1 }}>
                            <TextField
                                sx={{ width: '100%', marginTop: 2 }}
                                id="comment"
                                name="comment"
                                label="COMMENT"
                                variant="outlined"
                                size="medium"
                                multiline
                                rows={4}
                                value={masterItem && masterItem.comment}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={2} sm={2} md={2} lg={2} xl={2} sx={{ paddingTop: 1 }}>
                    <Paper sx={{ paddingLeft: 3, paddingTop: 2, paddingBottom: 2.5 }} variant="outlined">
                        <FormGroup
                            sx={{
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                            {Object.values(DEPARTMENT).map((department, index) => (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            onChange={handleCheckboxChange}
                                            checked={departments.some(
                                                (departmentName) => departmentName === department
                                            )}
                                            name={department}
                                        />
                                    }
                                    label={department.split('_').join(' ')}
                                    key={index}
                                />
                            ))}
                        </FormGroup>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container gap={5} sx={{ marginTop: 5 }} justifyContent="center">
                <Grid item>
                    <Button variant="outlined" onClick={handleSubmit} sx={{ width: 200 }}>
                        CREATE
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

export default MasterCreateForm;
