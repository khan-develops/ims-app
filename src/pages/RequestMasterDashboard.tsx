import {
    alpha,
    AppBar,
    BottomNavigation,
    BottomNavigationAction,
    Box,
    Chip,
    FormControl,
    FormControlLabel,
    Grid,
    InputBase,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    SelectChangeEvent,
    styled,
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TextField,
    Toolbar,
    Typography
} from '@mui/material';
import { KeyboardEvent, ChangeEvent, useEffect, useState, MouseEvent } from 'react';
import moment from 'moment';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { STATUS } from '../common/constants';
import { updateRequestMasterItemThunk } from '../app/slice/request/requestMasterItemUpdateSlice';
import {
    changeRequestMasterItems,
    getRequestMasterItemsThunk,
    selectRequestMasterItems
} from '../app/slice/request/requestMasterItemsSlice';
import { IRequest, IRequestMaster } from '../app/api/properties/IRequest';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PreviewIcon from '@mui/icons-material/Preview';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import FileSaver from 'file-saver';
import { IMaster } from '../app/api/properties/IMaster';
import { visuallyHidden } from '@mui/utils';
import { inventoryRequestDepartments } from '../components/common/routes';
import { getRequestMasterItemsDashboardThunk } from '../app/slice/request/dashboard/requestMasterItemsDashboardSlice';
import { toggleMasterItemDrawer } from '../app/slice/drawerToggle/masterDrawerSlice';
import { toggleRequestItemDrawer } from '../app/slice/drawerToggle/requestDrawerSlice';
import { selectProfileDetail } from '../app/slice/profileDetail/profileDetailSlice';

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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        fontSize: 12,
        fontWeight: 700,
        color: theme.palette.common.white,
        backgroundColor: '#2f3643',
        paddingTop: 12,
        paddingBottom: 12
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 12,
        paddingTop: 8,
        paddingBottom: 8
    }
}));

const columns: {
    id: keyof IMaster | keyof IRequest;
    numeric: boolean;
    label: string;
    align: 'left' | 'right' | 'center';
    padding: 'checkbox' | 'normal' | 'none';
    size: number;
}[] = [
    { id: 'item', numeric: false, label: 'Item', align: 'left', padding: 'normal', size: 400 },
    {
        id: 'recentCN',
        numeric: false,
        label: 'Recent CN',
        align: 'left',
        padding: 'normal',
        size: 100
    },
    {
        id: 'quantity',
        numeric: true,
        label: 'Quantity',
        align: 'center',
        padding: 'normal',
        size: 80
    },
    {
        id: 'confirmation',
        numeric: true,
        label: 'Confirmation',
        align: 'center',
        padding: 'normal',
        size: 80
    },
    {
        id: 'orderStatus',
        numeric: true,
        label: 'Status',
        align: 'center',
        padding: 'normal',
        size: 80
    },
    {
        id: 'timeRequested',
        numeric: true,
        label: 'Time Requested',
        align: 'center',
        padding: 'normal',
        size: 80
    },
    {
        id: 'timeUpdated',
        numeric: true,
        label: 'Time Updated',
        align: 'center',
        padding: 'normal',
        size: 80
    },
    {
        id: 'department',
        numeric: true,
        label: 'Department',
        align: 'center',
        padding: 'normal',
        size: 80
    },
    {
        id: 'requester',
        numeric: true,
        label: 'Requester',
        align: 'center',
        padding: 'normal',
        size: 80
    },
    {
        id: 'customText',
        numeric: true,
        label: 'Custom Text',
        align: 'center',
        padding: 'normal',
        size: 80
    },
    {
        id: 'customDetail',
        numeric: true,
        label: 'Detail',
        align: 'center',
        padding: 'normal',
        size: 80
    }
];

type Order = 'asc' | 'desc';
interface EnhancedTableProps {
    onRequestSort: (event: MouseEvent<unknown>, property: keyof IMaster | keyof IRequest) => void;
    order: Order;
    orderBy: string;
}

const EnhancedTableHead = (props: EnhancedTableProps) => {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property: keyof IMaster | keyof IRequest) => (event: MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead sx={{ whiteSpace: 'nowrap' }}>
            <TableRow>
                {columns.map((headCell) => (
                    <StyledTableCell
                        key={headCell.id}
                        align={headCell.align}
                        width={headCell.size}
                        sortDirection={orderBy === headCell.id ? order : false}>
                        <TableSortLabel
                            sx={{
                                '&.MuiTableSortLabel-root': {
                                    color: 'white'
                                },
                                '&.MuiTableSortLabel-root:hover': {
                                    color: 'white'
                                },
                                '&.Mui-active': {
                                    color: 'white'
                                },
                                '& .MuiTableSortLabel-icon': {
                                    color: 'white !important'
                                }
                            }}
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}>
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </StyledTableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};

const RequestMasterAdmin = () => {
    const requestMasterItemsSelector = useAppSelector(selectRequestMasterItems);
    const profileDetailSelector = useAppSelector(selectProfileDetail);
    const dispatch = useAppDispatch();
    const [page, setPage] = useState<number>(0);
    const location = useLocation();
    const [value, setValue] = useState<number>(0);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof IMaster | keyof IRequest>('id');

    const { state } = location;

    useEffect(() => {
        dispatch(
            getRequestMasterItemsDashboardThunk({
                department: profileDetailSelector.profileDetail.department,
                requestCategory: state.requestCategory,
                page: page
            })
        );
    }, [
        dispatch,
        location.pathname,
        location.state,
        page,
        profileDetailSelector.profileDetail.department,
        state.requestCategory
    ]);

    const handleChangePage = (event: any, page: number): void => {
        setPage(page);
    };

    const handleStatusChange = (event: SelectChangeEvent, id: number) => {
        dispatch(
            changeRequestMasterItems(
                requestMasterItemsSelector.response.content.map((item) => ({
                    ...item,
                    status: item.id === id ? event.target.value : item.confirmation
                }))
            )
        );
    };

    const handleDetailChange = (event: ChangeEvent<HTMLInputElement>, id: number) => {
        dispatch(
            changeRequestMasterItems(
                requestMasterItemsSelector.response.content.map((item) => ({
                    ...item,
                    detail: item.id === id ? event.target.value : item.confirmation
                }))
            )
        );
    };

    const handleEnterKey = (event: KeyboardEvent, requestMasterItem: IRequestMaster) => {
        dispatch(
            updateRequestMasterItemThunk({
                department: profileDetailSelector.profileDetail.department,
                requestCategory: state.requestCategory,
                requestMasterItem: requestMasterItem
            })
        );
    };

    const handleKeywordChange = (event: ChangeEvent<HTMLInputElement>) => {
        // dispatch(getSearchValue(event.target.value));
        // if (state === 'master') {
        //     dispatch(filterMasterItemsThunk({ keyword: event.target.value, page: 0 }));
        // } else {
        //     dispatch(filter({ state: state, keyword: event.target.value, page: 0 }));
        // }
    };

    const handleAddClick = () => {
        dispatch(
            toggleMasterItemDrawer({
                toggleType: 'ADD_MASTER_ITEM',
                masterItem: null
            })
        );
    };

    const handleEditClick = () => {
        dispatch(toggleRequestItemDrawer('UPDATE_REQUEST_EDIT'));
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

    const handleRequestSort = (event: MouseEvent<unknown>, property: keyof IMaster | keyof IRequest) => {
        // if (order === 'asc' && orderBy === 'id') {
        //     dispatch(
        //         sortRequestMast({
        //             state: location.state,
        //             page: page,
        //             column: property,
        //             direction: order
        //         })
        //     )
        //         .then(() => setOrderBy(property))
        //         .catch((error: Error) => console.error(error.message));
        // } else if (order === 'asc' && orderBy === property) {
        //     dispatch(
        //         sortMasterDepartmentItemsThunk({
        //             state: location.state,
        //             page: page,
        //             column: property,
        //             direction: order
        //         })
        //     )
        //         .then(() => setOrder('desc'))
        //         .catch((error: Error) => console.error(error.message));
        // } else if (order === 'desc' && orderBy === property) {
        //     dispatch(
        //         sortMasterDepartmentItemsThunk({
        //             state: location.state,
        //             page: page,
        //             column: property,
        //             direction: order
        //         })
        //     )
        //         .then(() => {
        //             setOrder('asc');
        //             setOrderBy('id');
        //         })
        //         .catch((error: Error) => console.error(error.message));
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
            <Grid item padding={2}>
                <Paper elevation={2} sx={{ padding: 0.5 }}>
                    <Toolbar>
                        <FormControl sx={{ width: '100%' }}>
                            <RadioGroup
                                sx={{ display: 'flex', justifyContent: 'space-between' }}
                                row
                                defaultValue={profileDetailSelector.profileDetail.department}
                                name="request-type">
                                {inventoryRequestDepartments.map((department) => (
                                    <Chip
                                        label={department.label}
                                        variant="outlined"
                                        icon={
                                            <FormControlLabel value={department.value} control={<Radio />} label="" />
                                        }
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>
                    </Toolbar>
                    <TableContainer sx={{ height: 700, overflowY: 'auto' }}>
                        <Table stickyHeader>
                            <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
                            <TableBody>
                                {requestMasterItemsSelector.response.content.length > 0 &&
                                    requestMasterItemsSelector.response.content.map((requestMasterItem, index) => (
                                        <TableRow key={index}>
                                            <StyledTableCell>{requestMasterItem.masterItem.item}</StyledTableCell>
                                            <StyledTableCell>
                                                {requestMasterItem.recentCN && requestMasterItem.recentCN}
                                            </StyledTableCell>
                                            <StyledTableCell>{requestMasterItem.quantity}</StyledTableCell>
                                            <StyledTableCell>
                                                <FormControl fullWidth>
                                                    <Select
                                                        size="small"
                                                        name="confirmation"
                                                        value={requestMasterItem.confirmation}
                                                        onChange={(event: SelectChangeEvent) =>
                                                            handleStatusChange(event, requestMasterItem.id)
                                                        }>
                                                        {Object.values(STATUS).map((status, index) => (
                                                            <MenuItem key={index} value={status}>
                                                                <Typography sx={{ fontSize: '10pt' }}>
                                                                    {status}
                                                                </Typography>
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {moment(requestMasterItem.timeRequested).format('MM/DD/YYYY')}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {moment(requestMasterItem.timeUpdated).format('MM/DD/YYYY')}
                                            </StyledTableCell>
                                            <StyledTableCell>{requestMasterItem.department}</StyledTableCell>
                                            <StyledTableCell>{requestMasterItem.customText}</StyledTableCell>
                                            <StyledTableCell>
                                                <TextField
                                                    size="small"
                                                    variant="outlined"
                                                    value={requestMasterItem.customDetail}
                                                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                                        handleDetailChange(event, requestMasterItem.id)
                                                    }
                                                    onKeyDown={(event: KeyboardEvent) =>
                                                        handleEnterKey(event, requestMasterItem)
                                                    }
                                                />
                                            </StyledTableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
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
                                    label="Review"
                                    onClick={handleReviewClick}
                                    icon={<PreviewIcon color="primary" sx={{ fontSize: 40 }} />}
                                />

                                <BottomNavigationAction
                                    label="Send"
                                    onClick={handleEditClick}
                                    icon={<EditIcon color="primary" sx={{ fontSize: 40 }} />}
                                />

                                <BottomNavigationAction label="Send" onClick={handleEditClick} icon={<SendIcon />} />

                                <BottomNavigationAction
                                    label="Add Item"
                                    onClick={handleAddClick}
                                    icon={<AddBoxIcon color="primary" sx={{ fontSize: 40 }} />}
                                />

                                {/* <Switch /> */}
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
    );
};

export default RequestMasterAdmin;
