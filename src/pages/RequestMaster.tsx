import { Button, Drawer, Tab, Tabs } from '@mui/material';
import { Link, Outlet, useNavigate } from 'react-router-dom';
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
import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useLocation } from 'react-router-dom';
import { IMaster } from '../app/api/properties/IMaster';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import PreviewIcon from '@mui/icons-material/Preview';
import FileSaver from 'file-saver';
import axios from 'axios';
import RequestItemReviewForm from '../components/forms/RequestItemReviewForm';
import { selectRequestDrawer, toggleRequestItemDrawer } from '../app/slice/drawerToggle/requestDrawerSlice';
import { selectRequestMasterItemsPurchaseSelected } from '../app/slice/selectedRequests/requestMasterItemsPurchaseSelectedSlice';
import { selectRequestMasterItemsSelected } from '../app/slice/selectedRequests/requestMasterItemsSelectedSlice';
import { selectRequestMasterItems } from '../app/slice/request/requestMasterItemsSlice';

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
    const requestMasterItemsPurchaseSelectedSelector = useAppSelector(selectRequestMasterItemsPurchaseSelected);
    const requestMasterItemsSelector = useAppSelector(selectRequestMasterItems);
    const [value, setValue] = useState<number>(0);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof IMaster>('id');
    const [page, setPage] = useState<number>(0);
    const { toggleType } = useAppSelector(selectRequestDrawer);

    useEffect(() => {
        navigate(location.pathname, {
            state: location.state
        });
        setActiveStep(0);
    }, [location.state, toggleType]);

    const handleChangePage = (event: any, newPage: number): void => {
        setPage(newPage);
    };

    const handleReviewClick = () => {
        dispatch(toggleRequestItemDrawer('UPDATE_REQUEST_REVIEW'));
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
        dispatch(toggleRequestItemDrawer('UPDATE_REQUEST_EDIT'));
    };

    const handleKeywordChange = (event: ChangeEvent<HTMLInputElement>) => {
        // dispatch(filterMasterDepartmentItemsThunk({ state: location.state, keyword: event.target.value, page: 0 }));
    };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Fragment>
            <Drawer anchor="right" open={toggleType === 'UPDATE_REQUEST_REVIEW'}>
                <RequestItemReviewForm />
            </Drawer>
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
                            <Button
                                variant="text"
                                sx={{ paddingRight: 4 }}
                                onClick={() => dispatch(toggleRequestItemDrawer('UPDATE_REQUEST_REVIEW'))}
                                disabled={requestMasterItemsPurchaseSelectedSelector.requestMasterItems.length < 1}>
                                REVIEW
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
        </Fragment>
    );
};

export default RequestMasterItems;
