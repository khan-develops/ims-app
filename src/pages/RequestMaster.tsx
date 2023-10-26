import { Button, Step, StepButton, Stepper, Tab, Tabs } from '@mui/material';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import RequestMasterDepartmentPending from '../components/RequestMasterItemsPending';
import RequestMasterDepartmentComplete from '../components/RequestMasterItemsComplete';
import RequestMasterDepartmentItems from '../components/RequestMasterItems';
import Filter1Icon from '@mui/icons-material/Filter1';
import Filter2Icon from '@mui/icons-material/Filter2';
import Filter3Icon from '@mui/icons-material/Filter3';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import {
    AppBar,
    BottomNavigation,
    BottomNavigationAction,
    Box,
    Grid,
    InputBase,
    Paper,
    TablePagination,
    Toolbar,
    alpha,
    styled
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useLocation } from 'react-router-dom';
import { toggleDrawer } from '../app/slice/drawerToggle/drawerToggleTypeSlice';
import { DRAWER_TOGGLE_TYPE } from '../common/constants';
import { selectRequestMasterItems } from '../app/slice/request/requestMasterItemsSlice';
import { IMaster } from '../app/api/properties/IMaster';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DownloadIcon from '@mui/icons-material/Download';
import PreviewIcon from '@mui/icons-material/Preview';
import FileSaver from 'file-saver';
import axios from 'axios';

type Order = 'asc' | 'desc';
const baseUrl = process.env.REACT_APP_BASE_URL;

const Search = styled('div')(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto'
    }
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '25rem'
        }
    }
}));

const RequestMasterItems = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const dispatch = useAppDispatch();
    const requestMasterItemsSelector = useAppSelector(selectRequestMasterItems);
    const [value, setValue] = useState<number>(0);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof IMaster>('id');
    const [page, setPage] = useState<number>(0);

    useEffect(() => {
        navigate(location.pathname, {
            state: location.state
        });
        setActiveStep(0);
    }, [location.state]);

    const handleChangePage = (event: any, newPage: number): void => {
        setPage(newPage);
    };

    const handleReviewClick = () => {
        dispatch(toggleDrawer({ type: DRAWER_TOGGLE_TYPE.UPDATE_REQUEST_REVIEW }));
    };

    const handleDownloadClick = () => {
        return axios.get(`${baseUrl}/download/${location.state}/list`).then((response) => {
            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            FileSaver.saveAs(blob, `${location.state}.xlsx`);
        });
    };

    const handleEditClick = () => {
        dispatch(toggleDrawer({ type: DRAWER_TOGGLE_TYPE.UPDATE_REQUEST_EDIT }));
    };

    const handleKeywordChange = (event: ChangeEvent<HTMLInputElement>) => {
        // dispatch(filterMasterDepartmentItemsThunk({ state: location.state, keyword: event.target.value, page: 0 }));
    };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        console.log(location);
        setValue(newValue);
    };

    return (
        <Grid container height="100%" direction="column" justifyContent="space-between">
            <Grid item>
                <AppBar
                    position="static"
                    elevation={5}
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                    <Toolbar variant="dense" sx={{ flexGrow: 1, justifyContent: 'center' }}>
                        <Search onChange={handleKeywordChange}>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
                        </Search>
                    </Toolbar>
                </AppBar>
            </Grid>
            <Grid item padding={2}>
                <Box sx={{ marginBottom: 2 }}>
                    <Paper square sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Tabs value={value} onChange={handleChange}>
                            <Tab
                                label="Items"
                                component={Link}
                                to={`/requests/${location.state}/list`}
                                state={location.state}
                            />
                            <Tab
                                label="confirmation"
                                component={Link}
                                to={`/requests/${location.state}/confirmation`}
                                state={location.state}
                            />
                            <Tab
                                label="status"
                                component={Link}
                                to={`/requests/${location.state}/status`}
                                state={location.state}
                            />
                        </Tabs>
                        <Button variant="text" sx={{ paddingRight: 2 }}>
                            SEND
                        </Button>
                    </Paper>
                </Box>
                <Outlet />
            </Grid>
            <Grid>
                <Grid item>
                    {' '}
                    <Paper variant="elevation" elevation={5} sx={{ height: 70 }}>
                        <BottomNavigation
                            sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}
                            showLabels
                            value={value}>
                            <Grid container justifyContent="space-between" paddingLeft={2} paddingRight={2}>
                                <Grid item>
                                    <BottomNavigationAction
                                        label="Download"
                                        onClick={handleDownloadClick}
                                        icon={<DownloadIcon color="primary" sx={{ fontSize: 40 }} />}
                                    />

                                    <BottomNavigationAction
                                        label="Review"
                                        onClick={handleReviewClick}
                                        icon={<PreviewIcon color="primary" sx={{ fontSize: 40 }} />}
                                    />
                                </Grid>
                                <Grid item alignItems="center">
                                    <TablePagination
                                        sx={{ marginTop: 1 }}
                                        rowsPerPageOptions={[]}
                                        component="div"
                                        count={requestMasterItemsSelector.response.totalElements}
                                        rowsPerPage={requestMasterItemsSelector.response.size}
                                        page={requestMasterItemsSelector.response.number}
                                        onPageChange={handleChangePage}
                                        showFirstButton={true}
                                        showLastButton={true}
                                    />
                                </Grid>
                            </Grid>
                        </BottomNavigation>
                    </Paper>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default RequestMasterItems;
