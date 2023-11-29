import {
    alpha,
    AppBar,
    BottomNavigation,
    BottomNavigationAction,
    Box,
    Button,
    FormControl,
    Grid,
    InputBase,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    styled,
    Tab,
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Tabs,
    TextField,
    Toolbar,
    Typography
} from '@mui/material';
import { KeyboardEvent, ChangeEvent, useEffect, useState, MouseEvent } from 'react';
import moment from 'moment';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { STATUS } from '../common/constants';
import { updateRequestMasterItemThunk } from '../app/slice/request/requestMasterItemUpdateSlice';
import { IRequest, IRequestMaster } from '../app/api/properties/IRequest';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
import FileSaver from 'file-saver';
import { IMaster } from '../app/api/properties/IMaster';
import { visuallyHidden } from '@mui/utils';
import { requestsDashboard } from '../components/common/routes';
import {
    changeRequestMasterItemsDashboard,
    getRequestMasterItemsDashboardThunk,
    selectRequestMasterDashboardItems,
    sortRequestMasterItemsDashboardThunk
} from '../app/slice/request/dashboard/requestMasterItemsDashboardSlice';
import { toggleMasterItemDrawer } from '../app/slice/drawerToggle/masterDrawerSlice';
import { toggleRequestItemDrawer } from '../app/slice/drawerToggle/requestDrawerSlice';
import { selectProfileDetail } from '../app/slice/profileDetail/profileDetailSlice';
import { getMinMaxOrdersThunk, selectMinMaxOrders } from '../app/slice/orders/minMaxOrdersSlice';
import { IMinMaxMasterOrder } from '../app/api/properties/IMinMaxOrder';

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
        id: 'recentVendor',
        numeric: false,
        label: 'Recent Vendor',
        align: 'left',
        padding: 'normal',
        size: 100
    },
    {
        id: 'quantity',
        numeric: true,
        label: 'Order Quantity',
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
    },
    {
        id: 'comment',
        numeric: true,
        label: 'Comment',
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

const RequestMasterDashboardRow = ({ minMaxOrder }: { minMaxOrder: IMinMaxMasterOrder }) => {
    const minMaxOrdersSelector = useAppSelector(selectMinMaxOrders);
    const profileDetailSelector = useAppSelector(selectProfileDetail);
    const dispatch = useAppDispatch();
    const location = useLocation();

    const { state } = location;

    const handleStatusChange = (event: SelectChangeEvent, id: number) => {
        // dispatch(
        //     changeRequestMasterItemsDashboard(
        //         minMaxOrdersSelector.response.content.map((item) => ({
        //             ...item,
        //             status: item.id === id ? event.target.value : item.confirmation
        //         }))
        //     )
        // );
    };

    const handleDetailChange = (event: ChangeEvent<HTMLInputElement>, id: number) => {
        // dispatch(
        //     changeRequestMasterItemsDashboard(
        //         minMaxOrdersSelector.response.content.map((item) => ({
        //             ...item,
        //             detail: item.id === id ? event.target.value : item.confirmation
        //         }))
        //     )
        // );
    };

    const handleEnterKey = (event: KeyboardEvent, minMaxOrder: IMinMaxMasterOrder) => {
        // dispatch(
        //     updateRequestMasterItemThunk({
        //         department: profileDetailSelector.profileDetail.department.toLowerCase().replace('_', '-'),
        //         requestCategory: state.requestCategory,
        //         requestMasterItem: requestMasterItem
        //     })
        // );
    };
    return (
        <TableRow>
            <StyledTableCell>{minMaxOrder.masterItem.item}</StyledTableCell>
            <StyledTableCell>
                <Button
                    fullWidth
                    disableElevation
                    variant="outlined"
                    disableRipple
                    sx={{ cursor: 'default', fontWeight: 900, fontSize: 14 }}>
                    {minMaxOrder.quantity}
                </Button>
            </StyledTableCell>
            <StyledTableCell>{moment(minMaxOrder.timeRequested).format('MM/DD/YYYY')}</StyledTableCell>
            <StyledTableCell>{moment(minMaxOrder.timeUpdated).format('MM/DD/YYYY')}</StyledTableCell>
            <StyledTableCell>{minMaxOrder.department}</StyledTableCell>
            <StyledTableCell>{minMaxOrder.customText}</StyledTableCell>
            <StyledTableCell>
                <TextField
                    size="small"
                    variant="outlined"
                    value={minMaxOrder.customDetail}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleDetailChange(event, minMaxOrder.id)}
                    onKeyDown={(event: KeyboardEvent) => handleEnterKey(event, minMaxOrder)}
                />
            </StyledTableCell>
        </TableRow>
    );
};

const MinMaxItems = (): JSX.Element => {
    const minMaxOrdersSelector = useAppSelector(selectMinMaxOrders);
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
            getMinMaxOrdersThunk({
                department: state.department,
                page: page
            })
        );
    }, [
        dispatch,
        location.pathname,
        location.state,
        page,
        profileDetailSelector.profileDetail.department,
        state.department,
        state.requestCategory
    ]);

    const handleChangePage = (event: any, page: number): void => {
        setPage(page);
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
                toggleType: 'MASTER_ADD',
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
        if (order === 'asc' && orderBy === 'id') {
            setOrder('asc');
            setOrderBy(property);
            dispatch(
                sortRequestMasterItemsDashboardThunk({
                    department: state.department,
                    requestCategory: state.requestCategory,
                    page: page,
                    column: property,
                    direction: 'asc'
                })
            )
                .then()
                .catch((error: Error) => console.error(error.message));
        } else if (order === 'asc' && orderBy === property) {
            setOrder('desc');
            setOrderBy(property);
            dispatch(
                sortRequestMasterItemsDashboardThunk({
                    department: state.department,
                    requestCategory: state.requestCategory,
                    page: page,
                    column: property,
                    direction: 'desc'
                })
            )
                .then()
                .catch((error: Error) => console.error(error.message));
        } else if (order === 'desc' && orderBy === property) {
            setOrder('asc');
            setOrderBy('id');
            dispatch(
                sortRequestMasterItemsDashboardThunk({
                    department: state.department,
                    requestCategory: state.requestCategory,
                    page: page,
                    column: property,
                    direction: 'asc'
                })
            )
                .then(() => {})
                .catch((error: Error) => console.error(error.message));
        } else {
            setOrder('asc');
            setOrderBy(property);
            dispatch(
                sortRequestMasterItemsDashboardThunk({
                    department: state.department,
                    requestCategory: state.requestCategory,
                    page: page,
                    column: property,
                    direction: 'asc'
                })
            )
                .then(() => {})
                .catch((error: Error) => console.error(error.message));
        }
    };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
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
                <Paper elevation={2} sx={{ padding: 0.5 }}>
                    <Box marginBottom={2}>
                        <Tabs value={value} onChange={handleChange} textColor="inherit">
                            {requestsDashboard.map((department) => (
                                <Tab
                                    label={department.label}
                                    component={Link}
                                    to={`/admin/dashboard/requests/${department.value}/${state.requestCategory}`}
                                    state={{
                                        requestCategory: state.requestCategory,
                                        department: department.value,
                                        tabIndex: 0
                                    }}
                                />
                            ))}
                        </Tabs>
                    </Box>

                    <TableContainer sx={{ height: 600, overflowY: 'auto' }}>
                        <Table stickyHeader>
                            <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
                            <TableBody>
                                {minMaxOrdersSelector.response.content.length > 0 &&
                                    minMaxOrdersSelector.response.content.map((minMaxOrder, index) => (
                                        <RequestMasterDashboardRow minMaxOrder={minMaxOrder} key={index} />
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
                            </Grid>
                            <Grid item alignItems="center">
                                <TablePagination
                                    sx={{ marginTop: 1 }}
                                    rowsPerPageOptions={[]}
                                    component="div"
                                    count={minMaxOrdersSelector.response.totalElements}
                                    rowsPerPage={minMaxOrdersSelector.response.size}
                                    page={minMaxOrdersSelector.response.number}
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

export default MinMaxItems;
