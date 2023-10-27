import { Box, Button, Checkbox, FormControlLabel, FormGroup, Grid } from '@mui/material';
import { useState, ChangeEvent } from 'react';
import { DEPARTMENT } from '../common/constants';
import { useAppDispatch } from '../app/hooks';
import { toggleMasterItemDrawer } from '../app/slice/drawerToggle/masterDrawerSlice';

const AssignItemForm = () => {
    const dispatch = useAppDispatch();

    const [departments, setDepartments] = useState<string[]>([]);

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (departments.some((department) => department === event.target.name)) {
            setDepartments(departments.filter((department) => department !== event.target.name));
        } else {
            setDepartments([...departments, event.target.name]);
        }
    };

    const handleSubmit = () => {
        throw new Error('Function not implemented.');
    };

    const handleCancel = () => {
        dispatch(toggleMasterItemDrawer({ toggleType: '', masterItem: null }));
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-around',
                height: '100%',
                padding: 10
            }}>
            <FormGroup>
                {Object.values(DEPARTMENT).map((department, index) => (
                    <FormControlLabel
                        control={
                            <Checkbox
                                onChange={handleCheckboxChange}
                                checked={departments.some((departmentName) => departmentName === department)}
                                name={department}
                            />
                        }
                        label={department.split('_').join(' ')}
                        key={index}
                    />
                ))}
            </FormGroup>
            <Grid container spacing={2} direction="column">
                <Grid item>
                    <Button variant="outlined" onClick={handleSubmit} sx={{ width: 200 }}>
                        ASSIGN
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

export default AssignItemForm;
