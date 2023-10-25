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
import { IRequest, IRequestMaster } from '../app/api/properties/IRequest';
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

    const handleRequestSort = (event: MouseEvent<unknown>, property: keyof IMaster | keyof IRequest) => {
        // if (order === 'asc' && orderBy === 'id') {
        //     dispatch(
        //         sortMasterDepartmentItemsThunk({
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

    const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
        if (selectedIds.length < requestMasterItemsCompleteSelector.response.content.length) {
            setSelectedIds(
                requestMasterItemsCompleteSelector.response.content.reduce(
                    (acc: number[], requestMasterItem) =>
                        acc.includes(requestMasterItem.id) ? acc : [...acc, requestMasterItem.id],
                    []
                )
            );
        } else {
            setSelectedIds([]);
        }
    };

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>, requestMasterItem: IRequestMaster) => {
        // const exists = requestMasterItemsPendingCheckedSelector.requestMasterItemsPendingChecked.some(
        //     (item) => item.id === departmentMasterItem.id
        // );
        // if (exists) {
        //     dispatch(
        //         changeRequestItemsPendingChecked(
        //             requestMasterItemsPendingCheckedSelector.requestMasterItemsPendingChecked.filter(
        //                 (item) => item.id !== departmentMasterItem.id
        //             )
        //         )
        //     );
        // }
        // if (!exists) {
        //     dispatch(
        //         changeRequestItemsPendingChecked([
        //             ...requestMasterItemsPendingCheckedSelector.requestMasterItemsPendingChecked,
        //             departmentMasterItem
        //         ])
        //     );
        // }
    };

    return (
        <Box>
            <Paper elevation={2} sx={{ padding: 0.5 }}>
                <TableContainer sx={{ height: 600, overflowY: 'auto' }}>
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
                                requestMasterItemsCompleteSelector.response.content.map((requestMasterItem, index) => (
                                    <TableRow key={index}>
                                        <StyledTableCell padding="checkbox">
                                            <Checkbox
                                                color="default"
                                                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                                    handleCheckboxChange(event, requestMasterItem)
                                                }
                                                checked={selectedIds.includes(requestMasterItem.id)}
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {requestMasterItem && requestMasterItem.masterItem.item}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {requestMasterItem && requestMasterItem.masterItem.recentCN}
                                        </StyledTableCell>
                                        <StyledTableCell>{requestMasterItem.quantity}</StyledTableCell>
                                        <StyledTableCell>{requestMasterItem.confirmation}</StyledTableCell>
                                        <StyledTableCell>
                                            {moment(requestMasterItem.timeRequested).format('MM/DD/YYYY')}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {moment(requestMasterItem.timeUpdated).format('MM/DD/YYYY')}
                                        </StyledTableCell>
                                        <StyledTableCell>{requestMasterItem.customDetail}</StyledTableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default RequestMasterDepartmentComplete;
