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
    TablePagination,
    Box,
    Stack,
    ButtonGroup
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { IMaster } from '../app/api/properties/IMaster';
import { filterMasterItemsThunk, getMasterItemsThunk, selectMasterItems } from '../app/slice/master/masterItemsSlice';
import { selectSearchValue } from '../app/search';
import { getDepartmentNamesThunk, selectDepartmentNames } from '../app/slice/departmentName/departmentNamesSlice';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DownloadIcon from '@mui/icons-material/Download';
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
import { deleteMasterItemThunk } from '../app/slice/master/masterItemDeleteSlice';
import { selectMasterDrawer, toggleMasterItemDrawer } from '../app/slice/drawerToggle/masterDrawerSlice';

const headerCell: {
    id: keyof IMaster;
    numeric: boolean;
    label: string;
    align: 'left' | 'right' | 'center';
    padding: 'checkbox' | 'normal' | 'none';
}[] = [
    {
        id: 'purchaseUnit',
        numeric: false,
        label: 'Purchase Unit',
        align: 'left',
        padding: 'normal'
    },
    {
        id: 'manufacturer',
        numeric: false,
        label: 'Manufacturer',
        align: 'left',
        padding: 'normal'
    },
    {
        id: 'recentVendor',
        numeric: false,
        label: 'Recent Vendor',
        align: 'left',
        padding: 'normal'
    },
    {
        id: 'recentCN',
        numeric: false,
        label: 'Recent CN',
        align: 'left',
        padding: 'normal'
    },
    {
        id: 'partNumber',
        numeric: false,
        label: 'Part Number',
        align: 'left',
        padding: 'normal'
    },
    {
        id: 'fisherCN',
        numeric: false,
        label: 'Fisher CN',
        align: 'left',
        padding: 'normal'
    },
    {
        id: 'vwrCN',
        numeric: false,
        label: 'VWR CN',
        align: 'left',
        padding: 'normal'
    },
    {
        id: 'labSourceCN',
        numeric: false,
        label: 'Lab Source CN',
        align: 'left',
        padding: 'normal'
    },
    {
        id: 'otherCN',
        numeric: false,
        label: 'Other CN',
        align: 'left',
        padding: 'normal'
    },
    {
        id: 'unitPrice',
        numeric: false,
        label: 'Unit Price',
        align: 'left',
        padding: 'normal'
    },
    {
        id: 'category',
        numeric: false,
        label: 'Category',
        align: 'left',
        padding: 'normal'
    },
    {
        id: 'drugClass',
        numeric: false,
        label: 'Drug Class',
        align: 'left',
        padding: 'normal'
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
        color: theme.palette.common.black,
        paddingTop: 1,
        paddingBottom: 1
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 12,
        paddingTop: 10,
        paddingBottom: 10
    }
}));

const MasterCardItem = ({
    masterItem,
    handleActionClick
}: {
    masterItem: IMaster;
    index: number;
    page: number;
    handleActionClick: (event: MouseEvent<HTMLElement>, masterItem: IMaster, action: 'ASSIGN' | 'DELETE') => void;
}): JSX.Element => {
    const dispatch = useAppDispatch();
    const { state } = useLocation();

    useEffect(() => {
        dispatch(getGrandTotalThunk(state));
    }, [dispatch, state]);

    const handleEditAction = (masterItem: IMaster) => {
        dispatch(
            toggleMasterItemDrawer({
                toggleType: 'MASTER_UPDATE',
                masterItem: masterItem
            })
        );
    };

    const handleAssign = () => {
        dispatch(toggleMasterItemDrawer({ toggleType: 'MASTER_ASSIGN', masterItem: masterItem }));
    };

    return (
        <Card sx={{ marginBottom: 1, padding: 0.5 }}>
            <CardHeader
                sx={{ backgroundColor: '#FAFAFA', paddingTop: 1, paddingBottom: 1 }}
                title={
                    masterItem &&
                    masterItem.item && (
                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                            <Typography variant="subtitle2" sx={{ marginRight: 1, color: '#E30B5C' }}>
                                Name:
                            </Typography>
                            <Typography variant="subtitle2">{masterItem.item}</Typography>
                        </Box>
                    )
                }
                titleTypographyProps={{ variant: 'button', marginLeft: 1 }}
                subheader={
                    masterItem &&
                    masterItem.comment && (
                        <Stack direction="row">
                            <Typography variant="body2" sx={{ marginRight: 1, color: '#E30B5C' }}>
                                Comment:
                            </Typography>{' '}
                            <Typography variant="body2">{masterItem.comment}</Typography>
                        </Stack>
                    )
                }
                subheaderTypographyProps={{ variant: 'caption', marginLeft: 1 }}
            />
            <CardContent sx={{ padding: 0.5 }}>
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
                            <TableRow hover>
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
            <CardActions sx={{ justifyContent: 'flex-end', paddingBottom: 0, paddingTop: 0, paddingRight: 4 }}>
                <Button size="small" onClick={handleAssign}>
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
    const masterDrawerSelector = useAppSelector(selectMasterDrawer);
    const searchValueSelector = useAppSelector(selectSearchValue);
    const masterItemsSelector = useAppSelector(selectMasterItems);
    const dispatch = useAppDispatch();
    const [page, setPage] = useState<number>(0);

    const [anchorElDelete, setAnchorElDelete] = useState<{ anchorEl: null | HTMLElement; masterItem: IMaster | null }>({
        anchorEl: null,
        masterItem: null
    });
    const [value, setValue] = useState<number>(0);
    const requestMasterItemsPendingCheckedSelector = useAppSelector(selectRequestMasterItemsPendingChecked);
    const location = useLocation();
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const { state } = useLocation();

    const handleAddClick = () => {
        dispatch(
            toggleMasterItemDrawer({
                toggleType: 'MASTER_ADD',
                masterItem: null
            })
        );
    };

    const handleEditClick = () => {
        dispatch(toggleMasterItemDrawer({ toggleType: 'MASTER_UPDATE', masterItem: null }));
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
        console.log(masterDrawerSelector);
        dispatch(getDepartmentNamesThunk());
        if (searchValueSelector && searchValueSelector.searchValue) {
            dispatch(filterMasterItemsThunk({ keyword: searchValueSelector.searchValue, page: page }));
        } else {
            dispatch(getMasterItemsThunk(page));
        }
    }, [dispatch, masterDrawerSelector, page, searchValueSelector]);

    const handleChangePage = (event: any, newPage: number): void => {
        setPage(newPage);
        if (searchValueSelector && searchValueSelector.searchValue) {
            dispatch(filterMasterItemsThunk({ keyword: searchValueSelector.searchValue, page: newPage }));
        }
    };

    const handleActionClick = (
        event: MouseEvent<HTMLElement>,
        masterItem: IMaster,
        action: 'ASSIGN' | 'EDIT' | 'DELETE'
    ) => {
        if (action === 'DELETE') {
            setAnchorElDelete({ anchorEl: event.currentTarget, masterItem: masterItem });
        }
    };

    const handleCloseMenu = () => {
        setAnchorElDelete({ anchorEl: null, masterItem: null });
    };

    const handleDeleteConfirm = () => {
        if (anchorElDelete && anchorElDelete.masterItem && anchorElDelete.masterItem.id) {
            dispatch(deleteMasterItemThunk(anchorElDelete.masterItem.id))
                .then(() => {
                    setAnchorElDelete({ anchorEl: null, masterItem: null });
                    dispatch(getMasterItemsThunk(page));
                })
                .catch((error: Error) => console.error(error.message));
        }
    };

    const handleDeleteCancel = () => {
        setAnchorElDelete({ anchorEl: null, masterItem: null });
    };

    const handleKeywordChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(getSearchValue(event.target.value));
        if (state === 'master') {
            dispatch(filterMasterItemsThunk({ keyword: event.target.value, page: 0 }));
        } else {
            dispatch(filterMasterDepartmentItemsThunk({ state: state, keyword: event.target.value, page: 0 }));
        }
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
            <Grid item sx={{ height: 700, overflowY: 'auto', paddingLeft: 2, paddingRight: 2 }}>
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
                <Paper variant="elevation" elevation={5} sx={{ height: 70 }}>
                    <BottomNavigation
                        sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}
                        showLabels
                        value={value}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                        }}>
                        <Grid container justifyContent="space-between" paddingLeft={2} paddingRight={2}>
                            <Grid item>
                                <BottomNavigationAction
                                    label="Download"
                                    onClick={handleDownloadClick}
                                    icon={<DownloadIcon color="primary" sx={{ fontSize: 40 }} />}
                                />
                                <BottomNavigationAction
                                    label="Add Item"
                                    onClick={handleAddClick}
                                    icon={<AddBoxIcon color="primary" sx={{ fontSize: 40 }} />}
                                />
                            </Grid>
                            <Grid item paddingTop={2} paddingBottom={2}>
                                <ButtonGroup size="small" variant="text">
                                    <Button>Purchase Unit</Button>
                                    <Button>Manufacturer</Button>
                                    <Button>Recent Vendor</Button>
                                    <Button>Recent CN</Button>
                                    <Button>Part Number</Button>
                                    <Button>Fisher CN</Button>
                                    <Button>VWR CN</Button>
                                    <Button>Lab Source CN</Button>
                                    <Button>Other CN</Button>
                                    <Button>Unit Price</Button>
                                    <Button>Category</Button>
                                    <Button>Drug Class</Button>
                                </ButtonGroup>
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
