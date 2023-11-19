import { Box, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { useAppSelector } from '../../app/hooks';
import { selectDepartmentNames } from '../../app/slice/departmentName/departmentNamesSlice';
import { ChangeEvent, useEffect, useState } from 'react';

const MasterAssignForm = () => {
    const departmentNamesSelector = useAppSelector(selectDepartmentNames);
    const [departments, setDepartments] = useState<string[]>([]);

    useEffect(() => {
        departmentNamesSelector.departmentNames.map((departmentName) =>
            setDepartments((prevDepartment) => [...prevDepartment, departmentName.name])
        );
    }, [departmentNamesSelector.departmentNames]);

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (departments.some((department) => department === event.target.name)) {
            setDepartments(departments.filter((department) => department !== event.target.name));
        } else {
            setDepartments([...departments, event.target.name]);
        }
    };

    return (
        <Box>
            <FormGroup
                sx={{
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                {departmentNamesSelector.departmentNames.map((department, index) => (
                    <FormControlLabel
                        control={
                            <Checkbox
                                onChange={handleCheckboxChange}
                                checked={departments.some((departmentName) => departmentName === department.name)}
                                name={department.name}
                            />
                        }
                        label={department.name.split('_').join(' ')}
                        key={index}
                    />
                ))}
            </FormGroup>
        </Box>
    );
};

export default MasterAssignForm;
