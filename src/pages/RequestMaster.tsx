import { Box, Step, StepButton, Stepper } from '@mui/material';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { changeTab } from '../app/common/requestTabSlice';
import { useAppDispatch } from '../app/hooks';
import RequestMasterDepartmentPending from '../components/RequestMasterItemsPending';
import RequestMasterDepartmentComplete from '../components/RequestMasterItemsComplete';
import RequestMasterDepartmentItems from '../components/RequestMasterItems';
import Filter1Icon from '@mui/icons-material/Filter1';
import Filter2Icon from '@mui/icons-material/Filter2';
import Filter3Icon from '@mui/icons-material/Filter3';
import BorderColorIcon from '@mui/icons-material/BorderColor';

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}>
            {value === 0 && <RequestMasterDepartmentItems />}
            {value === 1 && <RequestMasterDepartmentPending />}
            {value === 2 && <RequestMasterDepartmentComplete />}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`
    };
}

const RequestMasterDepartment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const dispatch = useAppDispatch();

    useEffect(() => {
        navigate(`/departments/${location.state}-request/list`, {
            state: location.state
        });
        setActiveStep(0);
    }, [location.state]);

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        dispatch(changeTab(newValue));
    };

    const isStepFailed = (step: number) => {
        return step === 1;
    };

    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };

    return (
        <Box sx={{ width: '100%', padding: 2 }}>
            <Stepper activeStep={2} sx={{ marginBottom: 4 }}>
                <Step>
                    <StepButton
                        icon={
                            activeStep === 0 ? <BorderColorIcon color="secondary" /> : <Filter1Icon color="primary" />
                        }
                        onClick={handleStep(0)}
                        component={Link}
                        to={`/departments/${location.state}-request/list`}
                        state={location.state}>
                        List
                    </StepButton>
                </Step>
                <Step>
                    <StepButton
                        icon={
                            activeStep === 1 ? <BorderColorIcon color="secondary" /> : <Filter2Icon color="primary" />
                        }
                        onClick={handleStep(1)}
                        component={Link}
                        to={`/departments/${location.state}-request/confirmation`}
                        state={location.state}>
                        Confirmation
                    </StepButton>
                </Step>
                <Step>
                    <StepButton
                        icon={
                            activeStep === 2 ? <BorderColorIcon color="secondary" /> : <Filter3Icon color="primary" />
                        }
                        onClick={handleStep(2)}
                        component={Link}
                        to={`/departments/${location.state}-request/status`}
                        state={location.state}>
                        Status
                    </StepButton>
                </Step>
            </Stepper>
            <Outlet />
        </Box>
    );
};

export default RequestMasterDepartment;
