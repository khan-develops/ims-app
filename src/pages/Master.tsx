import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    styled,
    Menu,
    MenuItem,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    CardHeader,
    Grid,
    TablePagination
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { toggleDrawer } from '../app/slice/drawerToggle/drawerToggleTypeSlice';
import { DRAWER_TOGGLE_TYPE } from '../common/constants';
import { IMaster } from '../app/api/properties/IMaster';
import {
    filterMasterItemsThunk,
    getMasterItemsThunk,
    selectMasterItems,
    sortMasterItemsThunk
} from '../app/slice/master/masterItemsSlice';
import { selectSearchValue } from '../app/search';
import { getDepartmentNamesThunk, selectDepartmentNames } from '../app/slice/departmentName/departmentNamesSlice';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DownloadIcon from '@mui/icons-material/Download';
import { selectRequestMasterItemsChecked } from '../app/slice/request/requestMasterItemsCheckedSlice';
import SendIcon from '@mui/icons-material/Send';
import PreviewIcon from '@mui/icons-material/Preview';
import { selectRequestMasterItemsPendingChecked } from '../app/slice/request/requestMasterItemsPendingCheckedSlice';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import FileSaver from 'file-saver';
import InputBase from '@mui/material/InputBase';
import { alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import SearchIcon from '@mui/icons-material/Search';
import { useLocation } from 'react-router-dom';
import { getGrandTotalThunk, selectGrandTotal } from '../app/slice/grandTotalSlice';
import { filterMasterDepartmentItemsThunk } from '../app/slice/master/masterDepartmentItemsSlice';
import { getSearchValue } from '../app/search';

const headerCell: {
    id: keyof IMaster;
    numeric: boolean;
    label: string;
    align: 'left' | 'right' | 'center';
}[] = [
    {
        id: 'purchaseUnit',
        numeric: false,
        label: 'Purchase Unit',
        align: 'left'
    },
    {
        id: 'manufacturer',
        numeric: false,
        label: 'Manufacturer',
        align: 'left'
    },
    {
        id: 'recentVendor',
        numeric: false,
        label: 'Recent Vendor',
        align: 'left'
    },
    {
        id: 'recentCN',
        numeric: false,
        label: 'Recent CN',
        align: 'left'
    },
    {
        id: 'partNumber',
        numeric: false,
        label: 'Part Number',
        align: 'left'
    },
    {
        id: 'fisherCN',
        numeric: false,
        label: 'Fisher CN',
        align: 'left'
    },
    {
        id: 'vwrCN',
        numeric: false,
        label: 'VWR CN',
        align: 'left'
    },
    {
        id: 'labSourceCN',
        numeric: false,
        label: 'Lab Source CN',
        align: 'left'
    },
    {
        id: 'otherCN',
        numeric: false,
        label: 'Other CN',
        align: 'left'
    },
    {
        id: 'unitPrice',
        numeric: false,
        label: 'Unit Price',
        align: 'left'
    },
    {
        id: 'category',
        numeric: false,
        label: 'Category',
        align: 'left'
    },
    {
        id: 'drugClass',
        numeric: false,
        label: 'Drug Class',
        align: 'left'
    }
];

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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#f9f9f9',
        fontSize: 12,
        fontWeight: 700,
        color: theme.palette.common.black
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 12
    }
}));

const MasterCardItem = ({
    masterItem,
    index,
    page,
    handleActionClick
}: {
    masterItem: IMaster;
    index: number;
    page: number;
    handleActionClick: (event: MouseEvent<HTMLElement>, masterItem: IMaster, action: 'ASSIGN' | 'DELETE') => void;
}): JSX.Element => {
    const dispatch = useAppDispatch();
    const { grandTotal } = useAppSelector(selectGrandTotal);
    const { state } = useLocation();

    useEffect(() => {
        dispatch(getGrandTotalThunk(state));
    }, [dispatch, state]);

    const handleEditAction = (masterItem: IMaster) => {
        dispatch(
            toggleDrawer({
                type: DRAWER_TOGGLE_TYPE.UPDATE_MASTER_ITEM,
                masterItem: masterItem
            })
        );
    };

    // const handleAssign = (departmentName: string): void => {
    //     dispatch(deleteMasterItemThunk(masterItem.id))
    //         .then((response) => {
    //             setAnchorElDelete({ anchorEl: null, masterItem: null });
    //             dispatch(getMasterItemsThunk(page));
    //         })
    //         .catch((error: Error) => console.error(error.message));
    // };

    // const handleEditClick = (event: MouseEvent<HTMLElement>, masterItem: IMaster) => {
    //     dispatch(
    //         toggleDrawer({
    //             type: DRAWER_TOGGLE_TYPE.UPDATE_MASTER_ITEM,
    //             masterItem: masterItem
    //         })
    //     );
    // };

    // const handleAssignItem = (departmentName: string) => {
    //     // dispatch(
    //     //     departmentMasterItemAssignThunk({
    //     //         state: departmentName,
    //     //         masterItem: anchorElAssign.masterItem
    //     //     })
    //     // )
    //     //     .then((response) => {
    //     //         console.log(response.payload);
    //     //     })
    //     //     .catch((error: Error) => console.error(error.message));
    //     setAnchorElAssign({ anchorEl: null, masterItem: null });
    // };

    // const handleCloseDepartmentMenu = () => {
    //     setAnchorElAssign({ anchorEl: null, masterItem: null });
    // };

    return (
        <Card>
            <CardHeader
                sx={{ backgroundColor: '#ececec' }}
                title={masterItem.item}
                titleTypographyProps={{ variant: 'body1', marginLeft: 1 }}
                subheader={masterItem.comment}
                subheaderTypographyProps={{ variant: 'body2', marginLeft: 1 }}
            />
            <CardContent>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {headerCell.map((headCell) => (
                                    <StyledTableCell>{headCell.label}</StyledTableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <StyledTableCell>{masterItem.purchaseUnit}</StyledTableCell>
                                <StyledTableCell>{masterItem.manufacturer}</StyledTableCell>
                                <StyledTableCell>{masterItem.recentCN}</StyledTableCell>
                                <StyledTableCell>{masterItem.partNumber}</StyledTableCell>
                                <StyledTableCell>{masterItem.recentVendor}</StyledTableCell>
                                <StyledTableCell>{masterItem.fisherCN}</StyledTableCell>
                                <StyledTableCell>{masterItem.vwrCN}</StyledTableCell>
                                <StyledTableCell>{masterItem.labSourceCN}</StyledTableCell>
                                <StyledTableCell>{masterItem.otherCN}</StyledTableCell>
                                <StyledTableCell>${masterItem.unitPrice}</StyledTableCell>
                                <StyledTableCell>{masterItem.category}</StyledTableCell>
                                <StyledTableCell>{masterItem.drugClass}</StyledTableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button
                    size="small"
                    onClick={(event: MouseEvent<HTMLElement>) => handleActionClick(event, masterItem, 'ASSIGN')}>
                    Assign
                </Button>
                <Button size="small" onClick={() => handleEditAction(masterItem)}>
                    Edit
                </Button>
                <Button
                    size="small"
                    onClick={(event: MouseEvent<HTMLElement>) => handleActionClick(event, masterItem, 'DELETE')}>
                    Delete
                </Button>
            </CardActions>
        </Card>
    );
};

const Master = (): JSX.Element => {
    const searchValueSelector = useAppSelector(selectSearchValue);
    const masterItemsSelector = useAppSelector(selectMasterItems);
    const departmentNamesSelector = useAppSelector(selectDepartmentNames);
    const [selectedItems, setSelectedItems] = useState<IMaster[]>([]);
    const dispatch = useAppDispatch();
    const [page, setPage] = useState<number>(0);
    const [anchorElAssign, setAnchorElAssign] = useState<{ anchorEl: null | HTMLElement; masterItem: IMaster | null }>({
        anchorEl: null,
        masterItem: null
    });
    const [anchorElEdit, setAnchorElEdit] = useState<{ anchorEl: null | HTMLElement; masterItem: IMaster | null }>({
        anchorEl: null,
        masterItem: null
    });
    const [anchorElDelete, setAnchorElDelete] = useState<{ anchorEl: null | HTMLElement; masterItem: IMaster | null }>({
        anchorEl: null,
        masterItem: null
    });
    const [sort, setSort] = useState<{ column: string; direction: '' | 'ASC' | 'DESC' }>({ column: '', direction: '' });
    const [value, setValue] = useState<number>(0);
    const requestMasterItemsCheckedSelector = useAppSelector(selectRequestMasterItemsChecked);
    const requestMasterItemsPendingCheckedSelector = useAppSelector(selectRequestMasterItemsPendingChecked);
    const location = useLocation();
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const { state } = useLocation();

    const handleAddClick = () => {
        dispatch(
            toggleDrawer({
                type: DRAWER_TOGGLE_TYPE.ADD_MASTER_ITEM
            })
        );
    };

    const handleEditClick = () => {
        dispatch(toggleDrawer({ type: DRAWER_TOGGLE_TYPE.UPDATE_REQUEST_EDIT }));
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

    useEffect(() => {
        dispatch(getDepartmentNamesThunk());
        if (searchValueSelector && searchValueSelector.searchValue) {
            dispatch(filterMasterItemsThunk({ keyword: searchValueSelector.searchValue, page: page }));
        } else {
            dispatch(getMasterItemsThunk(page));
        }
    }, [dispatch, page]);

    const handleChangePage = (event: any, newPage: number): void => {
        setPage(newPage);
        if (searchValueSelector && searchValueSelector.searchValue) {
            dispatch(filterMasterItemsThunk({ keyword: searchValueSelector.searchValue, page: newPage }));
        }
    };

    const handleSort = (field: string) => {
        if (sort.direction === '') {
            setSort({ column: field, direction: 'ASC' });
            dispatch(sortMasterItemsThunk({ page: page, column: field, direction: 'ASC' }));
        }
        if (sort.direction === 'ASC') {
            setSort({ column: field, direction: 'DESC' });
            dispatch(sortMasterItemsThunk({ page: page, column: field, direction: 'DESC' }));
        }
        if (sort.direction === 'DESC') {
            setSort({ column: field, direction: '' });
            dispatch(sortMasterItemsThunk({ page: page, column: field, direction: '' }));
        }
    };

    const handleActionClick = (
        event: MouseEvent<HTMLElement>,
        masterItem: IMaster,
        action: 'ASSIGN' | 'EDIT' | 'DELETE'
    ) => {
        if (action === 'ASSIGN') {
            setAnchorElAssign({ anchorEl: event.currentTarget, masterItem: masterItem });
        } else if (action === 'EDIT') {
            setAnchorElEdit({ anchorEl: event.currentTarget, masterItem: masterItem });
        }
        if (action === 'DELETE') {
            setAnchorElDelete({ anchorEl: event.currentTarget, masterItem: masterItem });
        }
    };

    const handleCloseMenu = () => {
        setAnchorElAssign({ anchorEl: null, masterItem: null });
        setAnchorElEdit({ anchorEl: null, masterItem: null });
        setAnchorElDelete({ anchorEl: null, masterItem: null });
    };

    const handleDeleteConfirm = (event: MouseEvent<HTMLElement>) => {
        // dispatch(deleteMasterItemThunk(anchorElDelete.masterItem.id))
        //     .then((response) => {
        //         setAnchorElDelete({ anchorEl: null, masterItem: null });
        //         dispatch(getMasterItemsThunk(page));
        //     })
        //     .catch((error: Error) => console.error(error.message));
    };

    const handleDeleteCancel = () => {
        setAnchorElDelete({ anchorEl: null, masterItem: null });
    };

    const handleAssign = (departmentName: string) => {
        console.log(departmentName);
    };

    const handleKeywordChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(getSearchValue(event.target.value));
        if (state === 'master') {
            dispatch(filterMasterItemsThunk({ keyword: event.target.value, page: 0 }));
        } else {
            dispatch(filterMasterDepartmentItemsThunk({ state: state, keyword: event.target.value, page: 0 }));
        }
        // if (
        //     state === 'extractions' ||
        //     state === 'mass-spec' ||
        //     state === 'rd' ||
        //     state === 'screening' ||
        //     state === 'shipping' ||
        //     state === 'processing_lab' ||
        //     state === 'qc-internal-standards' ||
        //     state === 'qc-qa' ||
        //     state === 'store-room'
        // ) {
        //     dispatch(filterMasterItemsThunk({ keyword: event.target.value, page: 0 }));
        // }
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
            <Grid item padding={1} sx={{ height: '80vh', overflowY: 'auto' }}>
                {masterItemsSelector.response.content.length > 0 &&
                    masterItemsSelector.response.content.map((masterItem, index) => (
                        <MasterCardItem
                            masterItem={masterItem}
                            index={index}
                            page={page}
                            handleActionClick={handleActionClick}
                        />
                    ))}
            </Grid>
            <Grid item>
                <Paper variant="elevation" elevation={5} sx={{ height: 80 }}>
                    <BottomNavigation
                        sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}
                        showLabels
                        value={value}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                        }}>
                        <Grid container justifyContent="space-between" paddingLeft={2} paddingRight={2}>
                            <Grid item>
                                {' '}
                                {(location.pathname === '/departments/extractions' ||
                                    location.pathname === '/departments/mass-spec' ||
                                    location.pathname === '/departments/processing-lab' ||
                                    location.pathname === '/departments/rd' ||
                                    location.pathname === '/departments/screening' ||
                                    location.pathname === '/departments/shipping' ||
                                    location.pathname === '/departments/qc-qa') && (
                                    <BottomNavigationAction
                                        label="Download"
                                        onClick={handleDownloadClick}
                                        icon={<DownloadIcon color="primary" sx={{ fontSize: 40 }} />}
                                    />
                                )}
                                {(location.pathname === '/general-request/list' ||
                                    location.pathname === '/office-supply-request/list' ||
                                    location.pathname === '/store-room-request/list') && (
                                    <BottomNavigationAction
                                        label="Review"
                                        onClick={handleReviewClick}
                                        icon={<PreviewIcon color="primary" sx={{ fontSize: 40 }} />}
                                        disabled={
                                            requestMasterItemsCheckedSelector.requestMasterItemsChecked.length === 0
                                        }
                                    />
                                )}
                                {(location.pathname === '/general-request/confirmation' ||
                                    location.pathname === '/office-supply-request/confirmation' ||
                                    location.pathname === '/store-room-request/confirmation') && (
                                    <BottomNavigationAction
                                        label="Send"
                                        onClick={handleEditClick}
                                        icon={<EditIcon color="primary" sx={{ fontSize: 40 }} />}
                                        disabled={
                                            requestMasterItemsPendingCheckedSelector.requestMasterItemsPendingChecked
                                                .length === 0
                                        }
                                    />
                                )}
                                {(location.pathname === '/general-request/confirmation' ||
                                    location.pathname === '/office-supply-request/confirmation' ||
                                    location.pathname === '/store-room-request/confirmation') && (
                                    <BottomNavigationAction
                                        label="Send"
                                        onClick={handleEditClick}
                                        icon={<SendIcon />}
                                        disabled={
                                            requestMasterItemsPendingCheckedSelector.requestMasterItemsPendingChecked
                                                .length === 0
                                        }
                                    />
                                )}
                                {location.pathname === '/admin/master' && (
                                    <BottomNavigationAction
                                        label="Add Item"
                                        onClick={handleAddClick}
                                        icon={<AddBoxIcon color="primary" sx={{ fontSize: 40 }} />}
                                    />
                                )}
                                {/* <Switch /> */}
                            </Grid>
                            <Grid item alignItems="center">
                                <TablePagination
                                    sx={{ marginTop: 1 }}
                                    rowsPerPageOptions={[]}
                                    component="div"
                                    count={masterItemsSelector.response.totalElements}
                                    rowsPerPage={masterItemsSelector.response.size}
                                    page={masterItemsSelector.response.number}
                                    onPageChange={handleChangePage}
                                    showFirstButton={true}
                                    showLastButton={true}
                                />
                            </Grid>
                        </Grid>
                    </BottomNavigation>
                </Paper>
            </Grid>

            <Menu
                key="profile-menu"
                id="profile-menu"
                anchorEl={anchorElAssign.anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                open={Boolean(anchorElAssign.anchorEl)}
                onClose={handleCloseMenu}>
                {departmentNamesSelector.departmentNames
                    .filter((departmentName) => departmentName.hasInventory)
                    .map((departmentName, index) => (
                        <MenuItem key={index} onClick={() => handleAssign(departmentName.name)}>
                            <Typography textAlign="center">{departmentName.name.split('_').join(' ')}</Typography>
                        </MenuItem>
                    ))}
            </Menu>
            <Menu
                key="delete-menu"
                id="delete-menu"
                anchorEl={anchorElDelete.anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                open={Boolean(anchorElDelete.anchorEl)}
                onClose={handleCloseMenu}>
                <MenuItem key="confirm" onClick={handleDeleteConfirm}>
                    <Typography textAlign="center">Confirm</Typography>
                </MenuItem>
                <MenuItem key="cancel" onClick={handleDeleteCancel}>
                    <Typography textAlign="center">Cancel</Typography>
                </MenuItem>
            </Menu>
        </Grid>
    );
};

export default Master;
