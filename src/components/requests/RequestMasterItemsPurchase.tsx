import {
    Box,
    Checkbox,
    Drawer,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    styled,
    tableCellClasses
} from '@mui/material';
import { ChangeEvent, useEffect, useState, MouseEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useLocation } from 'react-router-dom';
import RequestItemReviewForm from '../forms/RequestItemReviewForm';
import { IMaster } from '../../app/api/properties/IMaster';
import { visuallyHidden } from '@mui/utils';
import {
    getPurchaseRequestMasterItemsThunk,
    selectRequestMasterItems
} from '../../app/slice/request/purchaseRequestMasterItemsSlice';
import { IRequest, IRequestMaster } from '../../app/api/properties/IRequest';
import {
    handleRequestMasterItemsSelected,
    selectRequestMasterItemsSelected
} from '../../app/slice/selectedRequests/requestMasterItemsSelectSlice';
import { selectRequestDrawer } from '../../app/slice/drawerToggle/requestDrawerSlice';

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
        id: 'purchaseUnit',
        numeric: false,
        label: 'Purchase Unit',
        align: 'left',
        padding: 'normal',
        size: 80
    },

    {
        id: 'partNumber',
        numeric: false,
        label: 'Part Number',
        align: 'left',
        padding: 'normal',
        size: 80
    },
    {
        id: 'comment',
        numeric: false,
        label: 'Comment',
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
    const requestMasterItemSelector = useAppSelector(selectRequestMasterItems);
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
                            selectedIds.length < requestMasterItemSelector.response.content.length
                        }
                        checked={
                            requestMasterItemSelector.response.content.length > 0 &&
                            selectedIds.length === requestMasterItemSelector.response.content.length
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

const RequestMasterItemsPurchase = () => {
    const requestMasterItemsSelector = useAppSelector(selectRequestMasterItems);
    const requestMasterItemsSelectedSelector = useAppSelector(selectRequestMasterItemsSelected);
    const { toggleType } = useAppSelector(selectRequestDrawer);
    const dispatch = useAppDispatch();
    const [page, setPage] = useState<number>(0);
    const location = useLocation();
    const [selectedDepartment, setSelectedDepartment] = useState<string>('extractions');
    const [value, setValue] = useState<number>(0);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof IMaster>('id');
    const [dense, setDense] = useState(false);

    useEffect(() => {
        dispatch(getPurchaseRequestMasterItemsThunk({ state: location.state, page: page }));
    }, [dispatch, page, location]);

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>, requestMasterItem: IRequestMaster) => {
        if (event.target.checked) {
            dispatch(
                handleRequestMasterItemsSelected([
                    ...requestMasterItemsSelectedSelector.requestMasterItems,
                    requestMasterItem.id
                ])
            );
        } else {
            dispatch(
                handleRequestMasterItemsSelected([
                    ...requestMasterItemsSelectedSelector.requestMasterItems.filter((id) => id !== requestMasterItem.id)
                ])
            );
        }
    };

    const handleRequestSort = (event: MouseEvent<unknown>, property: keyof IMaster | keyof IRequest) => {};

    const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
        if (
            requestMasterItemsSelectedSelector.requestMasterItems.length <
            requestMasterItemsSelector.response.content.length
        ) {
            dispatch(
                handleRequestMasterItemsSelected(
                    requestMasterItemsSelector.response.content.reduce(
                        (acc: number[], masterItem) => (acc.includes(masterItem.id) ? acc : [...acc, masterItem.id]),
                        []
                    )
                )
            );
        } else {
            dispatch(handleRequestMasterItemsSelected([]));
        }
    };

    return (
        <Box>
            <Paper elevation={2} sx={{ padding: 0.5 }}>
                <TableContainer sx={{ height: 600, overflowY: 'auto' }}>
                    <Table stickyHeader>
                        <EnhancedTableHead
                            selectedIds={requestMasterItemsSelectedSelector.requestMasterItems}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {requestMasterItemsSelector.response.content.length > 0 &&
                                requestMasterItemsSelector.response.content.map((requestMasterItem, index) => (
                                    <TableRow key={index}>
                                        <StyledTableCell padding="checkbox">
                                            <Checkbox
                                                color="default"
                                                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                                    handleCheckboxChange(event, requestMasterItem)
                                                }
                                                checked={requestMasterItemsSelectedSelector.requestMasterItems.includes(
                                                    requestMasterItem.id
                                                )}
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell>{requestMasterItem.masterItem.item}</StyledTableCell>
                                        <StyledTableCell>{requestMasterItem.recentCN}</StyledTableCell>
                                        <StyledTableCell>{requestMasterItem.masterItem.purchaseUnit}</StyledTableCell>
                                        <StyledTableCell>{requestMasterItem.masterItem.partNumber}</StyledTableCell>
                                        <StyledTableCell>{requestMasterItem.masterItem.comment}</StyledTableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Drawer anchor="bottom" open={toggleType === 'UPDATE_REQUEST_REVIEW'}>
                    <RequestItemReviewForm />
                </Drawer>
            </Paper>
        </Box>
    );
};

export default RequestMasterItemsPurchase;
