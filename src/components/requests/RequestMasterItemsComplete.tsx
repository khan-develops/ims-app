import {
    BottomNavigation,
    BottomNavigationAction,
    Box,
    Button,
    Checkbox,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    styled,
    tableCellClasses
} from '@mui/material';
import { useEffect, useState, MouseEvent, ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import moment from 'moment';
import { useLocation } from 'react-router-dom';
import {
    getRequestMasterItemsCompleteThunk,
    selectRequestMasterItemsComplete,
    sortRequestMasterItemsCompleteThunk
} from '../../app/slice/request/requestMasterItemsCompleteSlice';
import { IMaster } from '../../app/api/properties/IMaster';
import { IRequest, IRequestMaster } from '../../app/api/properties/IRequest';
import { visuallyHidden } from '@mui/utils';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
import FileSaver from 'file-saver';
import {
    handleRequestMasterItemsCompleteSelected,
    selectRequestMasterItemsCompleteSelected
} from '../../app/slice/selectedRequests/requestMasterItemsCompleteSelectedSlice';
import { handleRequestMasterItemsPurchaseSelected } from '../../app/slice/selectedRequests/requestMasterItemsPurchaseSelectedSlice';

const columns: {
    id: keyof IMaster | keyof IRequest;
    numeric: boolean;
    label: string;
    align: 'left' | 'right' | 'center';
    padding: 'checkbox' | 'normal' | 'none';
    size: number;
}[] = [
    {
        id: 'item',
        numeric: false,
        label: 'Item',
        align: 'left',
        padding: 'normal',
        size: 80
    },

    {
        id: 'customDetail',
        numeric: false,
        label: 'Detail',
        align: 'left',
        padding: 'normal',
        size: 80
    },
    {
        id: 'recentCN',
        numeric: false,
        label: 'Recent CN',
        align: 'left',
        padding: 'normal',
        size: 80
    },
    {
        id: 'quantity',
        numeric: false,
        label: 'Order Quantity',
        align: 'left',
        padding: 'normal',
        size: 80
    },

    {
        id: 'orderStatus',
        numeric: false,
        label: 'Order Status',
        align: 'left',
        padding: 'normal',
        size: 80
    },
    {
        id: 'timeRequested',
        numeric: false,
        label: 'Time Requested',
        align: 'left',
        padding: 'normal',
        size: 80
    },
    {
        id: 'timeUpdated',
        numeric: false,
        label: 'Time Updated',
        align: 'left',
        padding: 'normal',
        size: 80
    }
];

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

type Order = 'asc' | 'desc';
const baseUrl = process.env.REACT_APP_BASE_URL;

interface EnhancedTableProps {
    onRequestSort: (event: MouseEvent<unknown>, property: keyof IMaster | keyof IRequest) => void;
    onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
}

const EnhancedTableHead = (props: EnhancedTableProps) => {
    const requestMasterItemsCompleteSelector = useAppSelector(selectRequestMasterItemsComplete);
    const requestMasterItemsCompleteSelectedSelector = useAppSelector(selectRequestMasterItemsCompleteSelected);
    const { onSelectAllClick, order, orderBy, onRequestSort } = props;
    const createSortHandler = (property: keyof IMaster | keyof IRequest) => (event: MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead sx={{ whiteSpace: 'nowrap' }}>
            <TableRow>
                <StyledTableCell padding="checkbox">
                    <Checkbox
                        color="default"
                        sx={{ paddingTop: 0, paddingBottom: 0, color: 'white' }}
                        indeterminate={
                            requestMasterItemsCompleteSelectedSelector.requestMasterItems.length > 0 &&
                            requestMasterItemsCompleteSelectedSelector.requestMasterItems.length <
                                requestMasterItemsCompleteSelector.response.content.length
                        }
                        checked={
                            requestMasterItemsCompleteSelector.response.content.length > 0 &&
                            requestMasterItemsCompleteSelectedSelector.requestMasterItems.length ===
                                requestMasterItemsCompleteSelector.response.content.length
                        }
                        onChange={onSelectAllClick}
                    />
                </StyledTableCell>
                {columns.map((headCell) => (
                    <StyledTableCell
                        key={headCell.id}
                        align={headCell.align}
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

const RequestMasterDepartmentCompleteRow = ({
    requestMasterItem
}: {
    requestMasterItem: IRequestMaster;
}): JSX.Element => {
    const dispatch = useAppDispatch();
    const requestMasterItemsCompleteSelectedSelector = useAppSelector(selectRequestMasterItemsCompleteSelected);

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>, requestMasterItem: IRequestMaster) => {
        if (event.target.checked) {
            dispatch(
                handleRequestMasterItemsCompleteSelected([
                    ...requestMasterItemsCompleteSelectedSelector.requestMasterItems,
                    requestMasterItem
                ])
            );
        } else {
            dispatch(
                handleRequestMasterItemsCompleteSelected([
                    ...requestMasterItemsCompleteSelectedSelector.requestMasterItems.filter(
                        (item) => item.id !== requestMasterItem.id
                    )
                ])
            );
        }
    };

    return (
        <TableRow>
            <StyledTableCell padding="checkbox">
                <Checkbox
                    color="default"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleCheckboxChange(event, requestMasterItem)}
                    checked={requestMasterItemsCompleteSelectedSelector.requestMasterItems.includes(requestMasterItem)}
                />
            </StyledTableCell>
            <StyledTableCell width={'40%'}>{requestMasterItem && requestMasterItem.masterItem.item}</StyledTableCell>

            <StyledTableCell>{requestMasterItem.customDetail}</StyledTableCell>
            <StyledTableCell width={150}>{requestMasterItem && requestMasterItem.masterItem.recentCN}</StyledTableCell>
            <StyledTableCell width={100}>
                <Button
                    fullWidth
                    disableElevation
                    variant="outlined"
                    disableRipple
                    sx={{ cursor: 'default', fontWeight: 900, fontSize: 14 }}>
                    {requestMasterItem.quantity}
                </Button>
            </StyledTableCell>

            <StyledTableCell width={100}>{requestMasterItem.orderStatus}</StyledTableCell>
            <StyledTableCell width={100}>
                {moment(requestMasterItem.timeRequested).format('MM/DD/YYYY')}
            </StyledTableCell>
            <StyledTableCell width={100}>{moment(requestMasterItem.timeUpdated).format('MM/DD/YYYY')}</StyledTableCell>
        </TableRow>
    );
};

const RequestMasterDepartmentComplete = () => {
    const requestMasterItemsCompleteSelector = useAppSelector(selectRequestMasterItemsComplete);
    const requestMasterItemsCompleteSelectedSelector = useAppSelector(selectRequestMasterItemsCompleteSelected);
    const dispatch = useAppDispatch();
    const [page, setPage] = useState<number>(0);
    const location = useLocation();
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof IMaster | keyof IRequest>('id');

    const { state } = location;

    useEffect(() => {
        console.log(state.department);
        dispatch(
            getRequestMasterItemsCompleteThunk({
                department: state.department,
                requestCategory: state && state.requestCategory,
                page
            })
        );
    }, [dispatch, location.state, page, state.department, state.requestCategory]);

    const handleRequestSort = (event: MouseEvent<unknown>, property: keyof IMaster | keyof IRequest) => {
        if (order === 'asc' && orderBy === 'id') {
            setOrder('asc');
            setOrderBy(property);
            dispatch(
                sortRequestMasterItemsCompleteThunk({
                    confirmation: 'COMPLETE',
                    department: state.department,
                    requestCategory: state && state.requestCategory,
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
                sortRequestMasterItemsCompleteThunk({
                    confirmation: 'COMPLETE',
                    department: state.department,
                    requestCategory: state && state.requestCategory,
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
                sortRequestMasterItemsCompleteThunk({
                    confirmation: 'COMPLETE',
                    department: state.department,
                    requestCategory: state && state.requestCategory,
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
                sortRequestMasterItemsCompleteThunk({
                    confirmation: 'COMPLETE',
                    department: state.department,
                    requestCategory: state && state.requestCategory,
                    page: page,
                    column: property,
                    direction: 'asc'
                })
            )
                .then(() => {})
                .catch((error: Error) => console.error(error.message));
        }
    };

    const handleDownloadClick = () => {
        return axios.get(`${baseUrl}/download/${location.state}/list`).then((response) => {
            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            FileSaver.saveAs(blob, `${location.state}.xlsx`);
        });
    };

    const handleChangePage = (event: any, newPage: number): void => {
        setPage(newPage);
    };

    const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
        if (
            requestMasterItemsCompleteSelectedSelector.requestMasterItems.length <
            requestMasterItemsCompleteSelector.response.content.length
        ) {
            dispatch(handleRequestMasterItemsPurchaseSelected(requestMasterItemsCompleteSelector.response.content));
        } else {
            dispatch(handleRequestMasterItemsPurchaseSelected([]));
        }
    };

    return (
        <Grid container direction="column" justifyContent="space-between" sx={{ height: 'calc(100% - 50px)' }}>
            <Grid></Grid>
            <Grid item padding={2}>
                <Paper elevation={2} sx={{ padding: 0.5 }}>
                    <TableContainer sx={{ height: 700, overflowY: 'auto' }}>
                        <Table stickyHeader>
                            <EnhancedTableHead
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                            />
                            <TableBody>
                                {requestMasterItemsCompleteSelector.response.content.length > 0 &&
                                    requestMasterItemsCompleteSelector.response.content.map(
                                        (requestMasterItem, index) => (
                                            <RequestMasterDepartmentCompleteRow
                                                requestMasterItem={requestMasterItem}
                                                key={index}
                                            />
                                        )
                                    )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>

            <Grid item>
                <Paper variant="elevation" elevation={5} sx={{ height: 70 }}>
                    <BottomNavigation
                        sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}
                        showLabels>
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
                                    count={requestMasterItemsCompleteSelector.response.totalElements}
                                    rowsPerPage={requestMasterItemsCompleteSelector.response.size}
                                    page={requestMasterItemsCompleteSelector.response.number}
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

export default RequestMasterDepartmentComplete;
