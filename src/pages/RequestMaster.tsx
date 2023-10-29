import { Drawer, Tab, Tabs } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';
import { AppBar, InputBase, Toolbar, alpha, styled } from '@mui/material';
import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { useAppSelector } from '../app/hooks';
import { useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import RequestItemReviewForm from '../components/forms/RequestItemReviewForm';
import { selectRequestDrawer } from '../app/slice/drawerToggle/requestDrawerSlice';
import { selectProfileDetail } from '../app/slice/profileDetail/profileDetailSlice';

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
    const [value, setValue] = useState<number>(0);
    const { toggleType } = useAppSelector(selectRequestDrawer);
    const profileDetailSelector = useAppSelector(selectProfileDetail);

    const { state, pathname } = location;

    useEffect(() => {
        if (pathname === `/requests/${state.requestCategory}/list`) {
            setValue(0);
        }
        if (pathname === `/requests/${state.requestCategory}/confirmation`) {
            setValue(1);
        }
        if (pathname === `/requests/${state.requestCategory}/status`) {
            setValue(2);
        }
    }, [pathname, state]);

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
            <AppBar position="static" elevation={5}>
                <Toolbar
                    variant="dense"
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                    <Tabs value={value} onChange={handleChange} textColor="inherit">
                        <Tab
                            label="Items"
                            component={Link}
                            to={`/requests/${state.requestCategory}/list`}
                            state={{
                                requestCategory: state.requestCategory,
                                department: profileDetailSelector.profileDetail.department
                                    .toLowerCase()
                                    .replace('_', '-'),
                                tabIndex: 0
                            }}
                        />
                        <Tab
                            label="confirmation"
                            component={Link}
                            to={`/requests/${state.requestCategory}/confirmation`}
                            state={{
                                requestCategory: state.requestCategory,
                                department: profileDetailSelector.profileDetail.department
                                    .toLowerCase()
                                    .replace('_', '-'),
                                tabIndex: 1
                            }}
                        />
                        <Tab
                            label="status"
                            component={Link}
                            to={`/requests/${state.requestCategory}/status`}
                            state={{
                                requestCategory: state.requestCategory,
                                department: profileDetailSelector.profileDetail.department
                                    .toLowerCase()
                                    .replace('_', '-'),
                                tabIndex: 2
                            }}
                        />
                    </Tabs>
                    <Search onChange={handleKeywordChange}>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
                    </Search>
                </Toolbar>
            </AppBar>
            <Outlet />
        </Fragment>
    );
};

export default RequestMasterItems;
