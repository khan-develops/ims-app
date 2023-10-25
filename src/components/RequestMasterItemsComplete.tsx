import {
    Box,
    Checkbox,
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
import { useAppDispatch, useAppSelector } from '../app/hooks';
import moment from 'moment';
import { useLocation } from 'react-router-dom';
import {
    getRequestMasterItemsCompleteThunk,
    selectRequestMasterItemsComplete
} from '../app/slice/request/requestMasterItemsCompleteSlice';
import { IMaster } from '../app/api/properties/IMaster';
import { IRequest } from '../app/api/properties/IRequest';
import { visuallyHidden } from '@mui/utils';
import { selectDrawerToggleType } from '../app/slice/drawerToggle/drawerToggleTypeSlice';

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
        id: 'customText',
        numeric: false,
        label: 'Custom Text',
        align: 'left',
        padding: 'normal',
        size: 80
    },
    {
        id: 'timeReceived',
        numeric: false,
        label: 'Time Received',
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
    },
    {
        id: 'customDetail',
        numeric: false,
        label: 'Detail',
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
    selectedIds: number[];
}

const EnhancedTableHead = (props: EnhancedTableProps) => {
    const requestMasterItemsCompleteSelector = useAppSelector(selectRequestMasterItemsComplete);
    const { onSelectAllClick, order, orderBy, onRequestSort, selectedIds } = props;
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
                            selectedIds.length > 0 &&
                            selectedIds.length < requestMasterItemsCompleteSelector.response.content.length
                        }
                        checked={
                            requestMasterItemsCompleteSelector.response.content.length > 0 &&
                            selectedIds.length === requestMasterItemsCompleteSelector.response.content.length
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

const RequestMasterDepartmentComplete = () => {
    const requestMasterItemsCompleteSelector = useAppSelector(selectRequestMasterItemsComplete);
    const dispatch = useAppDispatch();
    const [page, setPage] = useState<number>(0);
    const [selectedDepartment, setSelectedDepartment] = useState<string>('extractions');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const { type } = useAppSelector(selectDrawerToggleType);
    const location = useLocation();
    const [value, setValue] = useState<number>(0);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof IMaster>('id');
    const [dense, setDense] = useState(false);

    useEffect(() => {
        dispatch(
            getRequestMasterItemsCompleteThunk({
                state: location.state,
                department: selectedDepartment,
                page
            })
        );
    }, [dispatch, location.state, page]);

    const handleChangePage = (event: any, page: number): void => {
        setPage(page);
    };

    return (
        <Box component={Paper} elevation={3}>
            <TableContainer sx={{ height: '60vh' }}>
                <Table stickyHeader>
                    <EnhancedTableHead
                        selectedIds={selectedIds}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                        {requestMasterItemsCompleteSelector.response.content.length > 0 &&
                            requestMasterItemsCompleteSelector.response.content.map((requestItem, index) => (
                                <TableRow key={index}>
                                    <StyledTableCell>{requestItem && requestItem.masterItem.item}</StyledTableCell>
                                    <StyledTableCell>{requestItem && requestItem.recentCN}</StyledTableCell>
                                    <StyledTableCell>{requestItem.quantity}</StyledTableCell>
                                    <StyledTableCell>{requestItem.confirmation}</StyledTableCell>
                                    <StyledTableCell>
                                        {moment(requestItem.timeRequested).format('MM/DD/YYYY')}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {moment(requestItem.timeUpdated).format('MM/DD/YYYY')}
                                    </StyledTableCell>
                                    <StyledTableCell>{requestItem.customDetail}</StyledTableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                sx={{ marginTop: 3 }}
                rowsPerPageOptions={[]}
                component="div"
                count={requestMasterItemsCompleteSelector.response.totalElements}
                rowsPerPage={requestMasterItemsCompleteSelector.response.size}
                page={requestMasterItemsCompleteSelector.response.number}
                onPageChange={handleChangePage}
                showFirstButton={true}
                showLastButton={true}
            />
        </Box>
    );
};

export default RequestMasterDepartmentComplete;
