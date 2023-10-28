import {
    Box,
    Checkbox,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    TextField,
    styled,
    tableCellClasses
} from '@mui/material';
import { ChangeEvent, useEffect, useState, KeyboardEvent, MouseEvent, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useLocation } from 'react-router-dom';
import {
    getRequestMasterItemsPendingThunk,
    selectRequestMasterItemsPending
} from '../../app/slice/request/requestMasterItemsPendingSlice';
import { updateRequestMasterItemThunk } from '../../app/slice/request/requestMasterItemUpdateSlice';
import { IRequest, IRequestMaster } from '../../app/api/properties/IRequest';
import { IMaster } from '../../app/api/properties/IMaster';
import { visuallyHidden } from '@mui/utils';
import { selectRequestDrawer } from '../../app/slice/drawerToggle/requestDrawerSlice';
import {
    handleRequestMasterItemsPendingSelected,
    selectRequestMasterItemsPendingSelected
} from '../../app/slice/selectedRequests/requestMasterItemsPendingSelectedSlice';
import { selectProfileDetail } from '../../app/slice/profileDetail/profileDetailSlice';

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
    requestMasterItemsPendingSelectedSelector: IRequestMaster[];
}

const EnhancedTableHead = (props: EnhancedTableProps) => {
    const requestMasterItemsPendingSelector = useAppSelector(selectRequestMasterItemsPending);
    const { onSelectAllClick, order, orderBy, onRequestSort, requestMasterItemsPendingSelectedSelector } = props;
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
                            requestMasterItemsPendingSelectedSelector.length > 0 &&
                            requestMasterItemsPendingSelectedSelector.length <
                                requestMasterItemsPendingSelector.response.content.length
                        }
                        defaultChecked={
                            requestMasterItemsPendingSelector.response.content.length > 0 &&
                            requestMasterItemsPendingSelectedSelector.length ===
                                requestMasterItemsPendingSelector.response.content.length
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

const RequestMasterItemsPendingRow = ({ requestMasterItem }: { requestMasterItem: IRequestMaster }) => {
    const requestMasterItemsPendingSelectedSelector = useAppSelector(selectRequestMasterItemsPendingSelected);
    const profileDetailSelector = useAppSelector(selectProfileDetail);
    const dispatch = useAppDispatch();
    const location = useLocation();
    const inputRef = useRef<{ quantity: HTMLDivElement | null; customText: HTMLDivElement | null }>({
        quantity: null,
        customText: null
    });

    const updateRequestMasterItem = (
        event: KeyboardEvent,
        requestMasterItem: IRequestMaster,
        ref: HTMLDivElement | null
    ) => {
        if (event.key === 'Enter') {
            requestMasterItem = {
                ...requestMasterItem,
                [(event.target as HTMLInputElement).name]: (event.target as HTMLInputElement).value
            };
            dispatch(
                updateRequestMasterItemThunk({
                    state: location.state,
                    department: profileDetailSelector.profileDetail.department.toLowerCase().replace(' ', '_'),
                    requestMasterItem: requestMasterItem
                })
            )
                .then(() => {
                    if ((event.target as HTMLInputElement).name === 'quantity') {
                        inputRef.current.quantity = ref;
                    }
                    if ((event.target as HTMLInputElement).name === 'customText') {
                        inputRef.current.customText = ref;
                    }

                    if (ref) {
                        ref.style.backgroundColor = '#98FB98';
                        ref.style.transition = '1s background ease-in, 1000ms transform ease-out 1s';
                        setTimeout(() => {
                            if (ref) {
                                ref.style.backgroundColor = '#FAFAFA';
                            }
                        }, 1000);
                        ref.blur();
                    }
                })
                .catch((error: Error) => {
                    console.error(error.message);
                    if (ref) {
                        ref.style.backgroundColor = '#FF0000';
                        ref.style.transition = '1s background ease-in, 500ms transform ease-out 1s';
                        setTimeout(() => {
                            if (ref) {
                                ref.style.backgroundColor = '#FAFAFA';
                            }
                        }, 700);
                    }
                });
        }
    };

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>, requestMasterItem: IRequestMaster) => {
        if (event.target.checked) {
            dispatch(
                handleRequestMasterItemsPendingSelected([
                    ...requestMasterItemsPendingSelectedSelector.requestMasterItems,
                    requestMasterItem
                ])
            );
        } else {
            dispatch(
                handleRequestMasterItemsPendingSelected([
                    ...requestMasterItemsPendingSelectedSelector.requestMasterItems.filter(
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
                    checked={requestMasterItemsPendingSelectedSelector.requestMasterItems.includes(requestMasterItem)}
                />
            </StyledTableCell>

            <StyledTableCell width={600}>{requestMasterItem.masterItem.item}</StyledTableCell>
            <StyledTableCell width={200}>{requestMasterItem.masterItem.recentCN}</StyledTableCell>
            <StyledTableCell width={100}>
                <TextField
                    name="quantity"
                    size="small"
                    type="number"
                    inputRef={(ref) => (inputRef.current.quantity = ref)}
                    InputProps={{
                        inputProps: { min: 0, style: { fontSize: 14 } }
                    }}
                    defaultValue={requestMasterItem.quantity}
                    onKeyDown={(event: KeyboardEvent) =>
                        updateRequestMasterItem(event, requestMasterItem, inputRef.current.quantity)
                    }
                />
            </StyledTableCell>
            <StyledTableCell width={400}>
                <TextField
                    name="customText"
                    size="small"
                    inputRef={(ref) => (inputRef.current.customText = ref)}
                    fullWidth
                    InputProps={{
                        inputProps: { style: { fontSize: 14 } }
                    }}
                    defaultValue={requestMasterItem.customText}
                    onKeyDown={(event: KeyboardEvent) =>
                        updateRequestMasterItem(event, requestMasterItem, inputRef.current.customText)
                    }
                />
            </StyledTableCell>
            <StyledTableCell>{requestMasterItem.customDetail}</StyledTableCell>
        </TableRow>
    );
};

const RequestMasterDepartmentPending = () => {
    const requestMasterItemsPendingSelector = useAppSelector(selectRequestMasterItemsPending);
    const requestMasterItemsPendingSelectedSelector = useAppSelector(selectRequestMasterItemsPendingSelected);
    const dispatch = useAppDispatch();
    const [page, setPage] = useState<number>(0);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const { toggleType } = useAppSelector(selectRequestDrawer);
    const location = useLocation();
    const [value, setValue] = useState<number>(0);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof IMaster>('id');
    const [dense, setDense] = useState(false);
    const profileDetailSelector = useAppSelector(selectProfileDetail);

    useEffect(() => {
        dispatch(
            getRequestMasterItemsPendingThunk({
                state: location.state,
                department: profileDetailSelector.profileDetail.department.toLowerCase().replace(' ', '_'),
                page: page
            })
        );
    }, [dispatch, location.pathname, location.state, page, profileDetailSelector.profileDetail.department]);

    const handleKeywordChange = (event: ChangeEvent<HTMLInputElement>) => {
        // dispatch(filterMasterDepartmentItemsThunk({ state: state, keyword: event.target.value, page: 0 }));
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

    const handleSelectAllClick = () => {
        if (
            requestMasterItemsPendingSelectedSelector.requestMasterItems.length <
            requestMasterItemsPendingSelector.response.content.length
        ) {
            dispatch(handleRequestMasterItemsPendingSelected(requestMasterItemsPendingSelector.response.content));
        } else {
            dispatch(handleRequestMasterItemsPendingSelected([]));
        }
    };

    return (
        <Box>
            <Paper elevation={2} sx={{ padding: 0.5 }}>
                <TableContainer sx={{ height: 600, overflowY: 'auto' }}>
                    <Table stickyHeader>
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            requestMasterItemsPendingSelectedSelector={
                                requestMasterItemsPendingSelectedSelector.requestMasterItems
                            }
                        />
                        <TableBody>
                            {requestMasterItemsPendingSelector.response &&
                                requestMasterItemsPendingSelector.response.content &&
                                requestMasterItemsPendingSelector.response.content.length > 0 &&
                                requestMasterItemsPendingSelector.response.content.map((requestMasterItem, index) => (
                                    <RequestMasterItemsPendingRow requestMasterItem={requestMasterItem} key={index} />
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default RequestMasterDepartmentPending;
