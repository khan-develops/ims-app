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
    TextField,
    styled,
    tableCellClasses
} from '@mui/material';
import { ChangeEvent, useEffect, useState, KeyboardEvent, MouseEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useLocation } from 'react-router-dom';
import {
    changeRequestMasterItemsPending,
    getRequestMasterItemsPendingThunk,
    selectRequestMasterItemsPending
} from '../app/slice/request/requestMasterItemsPendingSlice';
import {
    changeRequestItemsPendingChecked,
    selectRequestMasterItemsPendingChecked
} from '../app/slice/request/requestMasterItemsPendingCheckedSlice';
import { updateRequestMasterItemThunk } from '../app/slice/request/requestMasterItemUpdateSlice';
import { IRequest, IRequestMaster } from '../app/api/properties/IRequest';
import { IMaster } from '../app/api/properties/IMaster';
import { visuallyHidden } from '@mui/utils';
import FileSaver from 'file-saver';
import { selectDrawerToggleType, toggleDrawer } from '../app/slice/drawerToggle/drawerToggleTypeSlice';
import { DRAWER_TOGGLE_TYPE } from '../common/constants';
import axios from 'axios';

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
    const requestMasterItemsPendingSelector = useAppSelector(selectRequestMasterItemsPending);
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
                            selectedIds.length < requestMasterItemsPendingSelector.response.content.length
                        }
                        checked={
                            requestMasterItemsPendingSelector.response.content.length > 0 &&
                            selectedIds.length === requestMasterItemsPendingSelector.response.content.length
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

const RequestMasterDepartmentPending = () => {
    const requestMasterItemsPendingSelector = useAppSelector(selectRequestMasterItemsPending);
    const requestMasterItemsPendingCheckedSelector = useAppSelector(selectRequestMasterItemsPendingChecked);
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
            getRequestMasterItemsPendingThunk({
                state: location.state,
                department: selectedDepartment,
                page: page
            })
        );
    }, [dispatch, location.pathname, location.state, page]);

    const handleChangePage = (event: any, page: number): void => {
        setPage(page);
    };

    // const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>, departmentMasterItem: IRequestMaster) => {
    //     const exists = requestMasterItemsPendingCheckedSelector.requestMasterItemsPendingChecked.some(
    //         (item) => item.id === departmentMasterItem.id
    //     );
    //     if (exists) {
    //         dispatch(
    //             changeRequestItemsPendingChecked(
    //                 requestMasterItemsPendingCheckedSelector.requestMasterItemsPendingChecked.filter(
    //                     (item) => item.id !== departmentMasterItem.id
    //                 )
    //             )
    //         );
    //     }
    //     if (!exists) {
    //         dispatch(
    //             changeRequestItemsPendingChecked([
    //                 ...requestMasterItemsPendingCheckedSelector.requestMasterItemsPendingChecked,
    //                 departmentMasterItem
    //             ])
    //         );
    //     }
    // };

    const handleChangeQuantity = (event: ChangeEvent<HTMLInputElement>, id: number) => {
        dispatch(
            changeRequestMasterItemsPending({
                ...requestMasterItemsPendingSelector.response,
                content: requestMasterItemsPendingSelector.response.content.map((requestMasterItemPending) => ({
                    ...requestMasterItemPending,
                    quantity:
                        requestMasterItemPending.id === id
                            ? parseInt(event.target.value)
                            : requestMasterItemPending.quantity
                }))
            })
        );
    };

    const handleUpdateQuantity = (event: KeyboardEvent, requestMasterItem: IRequestMaster) => {
        if (event.key === 'Enter') {
            dispatch(
                updateRequestMasterItemThunk({
                    state: location.state,
                    department: selectedDepartment,
                    requestMasterItem: requestMasterItem
                })
            );
        }
    };

    const handleChangeCustomText = (event: ChangeEvent<HTMLInputElement>, id: number) => {
        dispatch(
            changeRequestMasterItemsPending({
                ...requestMasterItemsPendingSelector.response,
                content: requestMasterItemsPendingSelector.response.content.map((requestMasterItemPending) => ({
                    ...requestMasterItemPending,
                    custom_text:
                        requestMasterItemPending.id === id
                            ? parseInt(event.target.value)
                            : requestMasterItemPending.customText
                }))
            })
        );
    };

    const handleUpdateCustomText = (event: KeyboardEvent, requestMasterItem: IRequestMaster) => {
        if (event.key === 'Enter') {
            dispatch(
                updateRequestMasterItemThunk({
                    state: location.state,
                    department: selectedDepartment,
                    requestMasterItem: requestMasterItem
                })
            );
        }
    };

    const handleAddClick = () => {
        dispatch(
            toggleDrawer({
                type: DRAWER_TOGGLE_TYPE.ADD_MASTER_ITEM
            })
        );
    };

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>, masterRequestItem: IRequestMaster) => {
        if (event.target.checked) {
            setSelectedIds([...selectedIds, masterRequestItem.id]);
        } else {
            setSelectedIds([...selectedIds.filter((id) => id !== masterRequestItem.id)]);
        }
    };

    const handleKeywordChange = (event: ChangeEvent<HTMLInputElement>) => {
        // dispatch(filterMasterDepartmentItemsThunk({ state: state, keyword: event.target.value, page: 0 }));
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

    const handleEditClick = (event: MouseEvent<HTMLElement>) => {
        // if (masterDepartmentItem) {
        //     dispatch(
        //         toggleDrawer({
        //             type: DRAWER_TOGGLE_TYPE.UPDATE_STORE_ROOM_ITEM,
        //             storeRoomItem: {
        //                 id: masterDepartmentItem.id,
        //                 location: masterDepartmentItem.departmentItems[0].location,
        //                 quantity: masterDepartmentItem.departmentItems[0].quantity,
        //                 minimumQuantity: masterDepartmentItem.departmentItems[0].minimumQuantity,
        //                 maximumQuantity: masterDepartmentItem.departmentItems[0].maximumQuantity,
        //                 usageLevel: masterDepartmentItem.departmentItems[0].usageLevel,
        //                 lotNumber: masterDepartmentItem.departmentItems[0].lotNumber,
        //                 expirationDate: masterDepartmentItem.departmentItems[0].expirationDate,
        //                 receivedDate: masterDepartmentItem.departmentItems[0].receivedDate
        //             }
        //         })
        //     );
        // }
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
        if (selectedIds.length < requestMasterItemsPendingSelector.response.content.length) {
            setSelectedIds(
                requestMasterItemsPendingSelector.response.content.reduce(
                    (acc: number[], requestMasterItem) =>
                        acc.includes(requestMasterItem.id) ? acc : [...acc, requestMasterItem.id],
                    []
                )
            );
        } else {
            setSelectedIds([]);
        }
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
                            {requestMasterItemsPendingSelector.response.content.length > 0 &&
                                requestMasterItemsPendingSelector.response.content.map((requestMasterItem, index) => (
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

                                        <StyledTableCell>{requestMasterItem.masterItem.item}</StyledTableCell>
                                        <StyledTableCell>{requestMasterItem.recentCN}</StyledTableCell>
                                        <StyledTableCell width={100}>
                                            <TextField
                                                size="small"
                                                type="number"
                                                InputProps={{
                                                    inputProps: { min: 0 }
                                                }}
                                                id={requestMasterItem.id.toString()}
                                                value={requestMasterItem.quantity}
                                                onKeyDown={(event: React.KeyboardEvent) =>
                                                    handleUpdateQuantity(event, requestMasterItem)
                                                }
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                    handleChangeQuantity(event, requestMasterItem.id)
                                                }
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <TextField
                                                variant="standard"
                                                sx={{ width: 150 }}
                                                size="small"
                                                id={requestMasterItem.id.toString()}
                                                value={requestMasterItem.customText}
                                                onKeyDown={(event: React.KeyboardEvent) =>
                                                    handleUpdateCustomText(event, requestMasterItem)
                                                }
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                    handleChangeCustomText(event, requestMasterItem.id)
                                                }
                                            />
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

export default RequestMasterDepartmentPending;
