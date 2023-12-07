import { Box, Button, ButtonGroup, Checkbox, Divider, FormControlLabel, FormGroup, Grid } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectDepartmentNames } from '../../app/slice/departmentName/departmentNamesSlice';
import { ChangeEvent, useState } from 'react';
import { selectMasterDrawer, toggleMasterDrawer } from '../../app/slice/drawerToggle/masterDrawerSlice';
import { assignMasterItemThunk } from '../../app/slice/master/masterItemAssignSlice';

const MasterAssignForm = () => {
    const departmentNamesSelector = useAppSelector(selectDepartmentNames);
    const masterDrawerSelector = useAppSelector(selectMasterDrawer);
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
    const dispatch = useAppDispatch();

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (selectedDepartments.some((department) => department === event.target.name)) {
            setSelectedDepartments(selectedDepartments.filter((department) => department !== event.target.name));
        } else {
            setSelectedDepartments([...selectedDepartments, event.target.name]);
        }
    };

    const handleSubmit = (): void => {
        if (masterDrawerSelector.masterItem) {
            dispatch(
                assignMasterItemThunk({
                    departments: selectedDepartments,
                    id: masterDrawerSelector.masterItem.id
                })
            )
                .then(() => dispatch(toggleMasterDrawer({ drawerType: '', masterItem: null })))
                .catch((error: Error) => console.error(error.message));
        }
    };

    return (
        <Grid container direction="column" padding={1} justifyContent="space-between">
            <Grid item sx={{ overflowY: 'auto', height: 850 }}>
                <FormGroup
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: 3,
                        overflowY: 'scroll'
                    }}>
                    {departmentNamesSelector.departmentNames.map((department, index) => (
                        <FormControlLabel
                            control={<Checkbox onChange={handleCheckboxChange} name={department.name} />}
                            label={department.name.split('_').join(' ')}
                            key={index}
                        />
                    ))}
                </FormGroup>
            </Grid>
            <Grid item>
                <ButtonGroup variant="text" fullWidth sx={{ marginTop: 4 }}>
                    <Button onClick={handleSubmit}>Submit</Button>
                    <Button onClick={() => dispatch(toggleMasterDrawer({ drawerType: '', masterItem: null }))}>
                        Cancel
                    </Button>
                </ButtonGroup>
            </Grid>
        </Grid>
    );
};

export default MasterAssignForm;
