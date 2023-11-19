import { Box, Button, ButtonGroup, Checkbox, Divider, FormControlLabel, FormGroup } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectDepartmentNames } from '../../app/slice/departmentName/departmentNamesSlice';
import { ChangeEvent, useState } from 'react';
import { selectMasterDrawer, toggleMasterItemDrawer } from '../../app/slice/drawerToggle/masterDrawerSlice';
import { useLocation } from 'react-router-dom';
import { departmentMasterItemAssignThunk } from '../../app/slice/department/departmentMasterItemAssignSlice';

const MasterAssignForm = () => {
    const departmentNamesSelector = useAppSelector(selectDepartmentNames);
    const masterDrawerSelector = useAppSelector(selectMasterDrawer);
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
    const location = useLocation();
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
                departmentMasterItemAssignThunk({
                    state: location.state,
                    masterItemId: masterDrawerSelector.masterItem.id
                })
            )
                .then(() => dispatch(toggleMasterItemDrawer({ toggleType: '', masterItem: null })))
                .catch((error: Error) => console.error(error.message));
        }
    };

    return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
            <FormGroup
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 4
                }}>
                {departmentNamesSelector.departmentNames.map((department, index) => (
                    <FormControlLabel
                        control={<Checkbox onChange={handleCheckboxChange} name={department.name} />}
                        label={department.name.split('_').join(' ')}
                        key={index}
                    />
                ))}
            </FormGroup>
            <Divider variant="middle" />
            <ButtonGroup variant="text" fullWidth sx={{ marginTop: 2 }}>
                <Button onClick={handleSubmit}>Submit</Button>
                <Button onClick={() => dispatch(toggleMasterItemDrawer({ toggleType: '', masterItem: null }))}>
                    Cancel
                </Button>
            </ButtonGroup>
        </Box>
    );
};

export default MasterAssignForm;
