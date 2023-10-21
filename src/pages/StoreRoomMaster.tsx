import React, { Fragment, useRef, useState } from 'react';
import { useEffect, MouseEvent, KeyboardEvent, ChangeEvent } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    Box,
    TextField,
    styled,
    tableCellClasses,
    IconButton,
    Grid,
    BottomNavigation,
    BottomNavigationAction,
    AppBar,
    Toolbar,
    alpha,
    InputBase,
    Typography,
    TableSortLabel
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DRAWER_TOGGLE_TYPE } from '../common/constants';
import { toggleDrawer } from '../app/slice/drawerToggle/drawerToggleTypeSlice';
import { IStoreRoom } from '../app/api/properties/IStoreRoom';
import { selectRequestMasterItemsChecked } from '../app/slice/request/requestMasterItemsCheckedSlice';
import { selectRequestMasterItemsPendingChecked } from '../app/slice/request/requestMasterItemsPendingCheckedSlice';
import DownloadIcon from '@mui/icons-material/Download';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import PreviewIcon from '@mui/icons-material/Preview';
import axios from 'axios';
import FileSaver from 'file-saver';
import SearchIcon from '@mui/icons-material/Search';
import {
    changeMasterDepartmentItems,
    filterMasterDepartmentItemsThunk,
    getMasterDepartmentItemsThunk,
    selectMasterDepartmentItems,
    sortMasterDepartmentItemsThunk
} from '../app/slice/master/masterDepartmentItemsSlice';
import { IOrderDetail } from '../app/api/properties/IOrderDetail';
import { IMaster, IMasterDepartment } from '../app/api/properties/IMaster';
import { visuallyHidden } from '@mui/utils';
import { updateDepartmentItemQuantityThunk } from '../app/slice/department/departmentItemUpdateSlice';

const columns: {
    id: keyof IStoreRoom | keyof IMaster | keyof IOrderDetail;
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
        id: 'partNumber',
        numeric: false,
        label: 'Part Number',
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
        id: 'location',
        numeric: false,
        label: 'Location',
        align: 'left',
        padding: 'normal'
    },
    {
        id: 'totalQuantity',
        numeric: true,
        label: 'Total Qty',
        align: 'left',
        padding: 'normal'
    },
    {
        id: 'minimumQuantity',
        numeric: true,
        label: 'Min Qty',
        align: 'left',
        padding: 'normal'
    },
    {
        id: 'maximumQuantity',
        numeric: true,
        label: 'Max Qty',
        align: 'left',
        padding: 'normal'
    },
    {
        id: 'orderQuantity',
        numeric: true,
        label: 'Order Quantity',
        align: 'left',
        padding: 'normal'
    },
    {
        id: 'unitPrice',
        numeric: true,
        label: 'Unit Price',
        align: 'left',
        padding: 'normal'
    },
    {
        id: 'totalPrice',
        numeric: true,
        label: 'Total Price',
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
        fontSize: 12,
        fontWeight: 700,
        color: theme.palette.common.black,
        backgroundColor: '#c6c6c6',
        paddingTop: 12,
        paddingBottom: 12
    },
    [`&.${tableCellClasses.body}`]: {
        backgroundColor: '#f1f1f1',
        fontSize: 12,
        paddingTop: 8,
        paddingBottom: 8
    }
}));

const StyledTableItemCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.body}`]: {
        backgroundColor: '#f4f4f4',
        fontSize: 12,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 8,
        paddingBottom: 8,
        borderBottom: 'none'
    }
}));

type Order = 'asc' | 'desc';

interface EnhancedTableProps {
    onRequestSort: (
        event: MouseEvent<unknown>,
        property: keyof IStoreRoom | keyof IMaster | keyof IOrderDetail
    ) => void;
    order: Order;
    orderBy: string;
}

const EnhancedTableHead = (props: EnhancedTableProps) => {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler =
        (property: keyof IStoreRoom | keyof IMaster | keyof IOrderDetail) => (event: MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
        <TableHead sx={{ whiteSpace: 'nowrap' }}>
            <TableRow>
                {columns.map((headCell) => (
                    <StyledTableCell
                        key={headCell.id}
                        align={headCell.align}
                        sortDirection={orderBy === headCell.id ? order : false}>
                        <TableSortLabel
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
                <StyledTableCell align="left">Received</StyledTableCell>
                <StyledTableCell align="left">Issued</StyledTableCell>
                <StyledTableCell align="center" sx={{ paddingLeft: 2, paddingRight: 1 }}>
                    Edit
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ paddingLeft: 1, paddingRight: 2 }}>
                    Delete
                </StyledTableCell>
            </TableRow>
        </TableHead>
    );
};

const StoreRoomMasterRow = ({
    masterDepartmentItem,
    index
}: {
    masterDepartmentItem: IMasterDepartment;
    index: number;
}) => {
    const masterDepartmentItemsSelector = useAppSelector(selectMasterDepartmentItems);
    const dispatch = useAppDispatch();
    const location = useLocation();
    const inputRef = useRef<{
        quantity: HTMLDivElement | null;
        received: HTMLDivElement | null;
        issued: HTMLDivElement | null;
    }>({
        quantity: null,
        received: null,
        issued: null
    });

    const handleDeleteClick = (event: MouseEvent<HTMLElement>, masterDepartmentItem: IMasterDepartment) => {};

    const updateTotalQuantity = (
        event: KeyboardEvent<HTMLInputElement>,
        newMasterDepartmentItem: IMasterDepartment,
        updateAction: 'RECEIVED' | 'ISSUED',
        ref: HTMLDivElement | null
    ): void => {
        if (updateAction === 'RECEIVED') {
            inputRef.current.received = ref;
        }
        if (updateAction === 'ISSUED') {
            inputRef.current.issued = ref;
        }

        if (event.key === 'Enter') {
            dispatch(
                updateDepartmentItemQuantityThunk({
                    state: location.state,
                    departmentItemId: newMasterDepartmentItem.departmentItems[0].id,
                    quantity: parseInt((event.target as HTMLInputElement).value),
                    updateAction: updateAction
                })
            )
                .then((response) => {
                    changeMasterDepartmentItems(
                        masterDepartmentItemsSelector.response.content.map((masterDepartmentItem) => ({
                            ...masterDepartmentItem,
                            departmentItems:
                                masterDepartmentItem.id === newMasterDepartmentItem.id
                                    ? masterDepartmentItem.departmentItems.map((departmentItem) => ({
                                          ...departmentItem,
                                          quantity:
                                              response.payload.id === departmentItem.id
                                                  ? response.payload.quantity
                                                  : departmentItem.quantity
                                      }))
                                    : masterDepartmentItem.departmentItems
                        }))
                    );
                    if (ref) {
                        ref.style.backgroundColor = '#98FB98';
                        ref.style.transition = '1s background ease-in, 500ms transform ease-out 1s';
                        setTimeout(() => {
                            if (ref) {
                                ref.style.backgroundColor = '#FAFAFA';
                            }
                        }, 700);
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

    const handleEditClick = (event: MouseEvent<HTMLElement>, masterDepartmentItem: IMasterDepartment) => {
        if (masterDepartmentItem) {
            dispatch(
                toggleDrawer({
                    type: DRAWER_TOGGLE_TYPE.UPDATE_STORE_ROOM_ITEM,
                    storeRoomItem: {
                        id: masterDepartmentItem.id,
                        location: masterDepartmentItem.departmentItems[0].location,
                        quantity: masterDepartmentItem.departmentItems[0].quantity,
                        minimumQuantity: masterDepartmentItem.departmentItems[0].minimumQuantity,
                        maximumQuantity: masterDepartmentItem.departmentItems[0].maximumQuantity,
                        usageLevel: masterDepartmentItem.departmentItems[0].usageLevel,
                        lotNumber: masterDepartmentItem.departmentItems[0].lotNumber,
                        expirationDate: masterDepartmentItem.departmentItems[0].expirationDate,
                        receivedDate: masterDepartmentItem.departmentItems[0].receivedDate
                    }
                })
            );
        }
    };

    return (
        <Fragment>
            <TableRow>
                <StyledTableItemCell colSpan={columns.length + 4}>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ color: 'GrayText' }}>
                                {masterDepartmentItem.item}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'GrayText' }}>
                                {masterDepartmentItem.departmentItems[0].usageLevel}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="caption" sx={{ color: 'GrayText' }}>
                                {masterDepartmentItem.comment}
                            </Typography>
                        </Box>
                    </Box>
                </StyledTableItemCell>
            </TableRow>
            <TableRow key={index} hover>
                <StyledTableCell>{masterDepartmentItem.purchaseUnit}</StyledTableCell>
                <StyledTableCell>{masterDepartmentItem.partNumber}</StyledTableCell>
                <StyledTableCell>{masterDepartmentItem.recentCN}</StyledTableCell>
                <StyledTableCell>{masterDepartmentItem.departmentItems[0].location}</StyledTableCell>
                <StyledTableCell width={60}>
                    {masterDepartmentItem.departmentItems[0].quantity}
                    {/* <TextField
                        ref={inputRef}
                        size="small"
                        type="number"
                        InputProps={{
                            inputProps: { min: 0 }
                        }}
                        sx={{
                            '.MuiInputBase-input': {
                                padding: 1,
                                fontSize: 12
                            }
                        }}
                        id={masterDepartmentItem.id?.toString()}
                        value={masterDepartmentItem.departmentItems[0].quantity}
                        onKeyDown={(event: KeyboardEvent) => updateStoreRoomItem(event, masterDepartmentItem.id)}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            handleChangeQty(masterDepartmentItem.id, event)
                        }
                    /> */}
                </StyledTableCell>
                <StyledTableCell>{masterDepartmentItem.departmentItems[0].minimumQuantity}</StyledTableCell>
                <StyledTableCell>{masterDepartmentItem.departmentItems[0].maximumQuantity}</StyledTableCell>
                <StyledTableCell>
                    {masterDepartmentItem &&
                        masterDepartmentItem.orderDetail &&
                        masterDepartmentItem.orderDetail.orderQuantity}
                </StyledTableCell>
                <StyledTableCell>${masterDepartmentItem.unitPrice}</StyledTableCell>
                <StyledTableCell>
                    {masterDepartmentItem &&
                        masterDepartmentItem.orderDetail &&
                        masterDepartmentItem.orderDetail.totalQuantity}
                </StyledTableCell>
                <StyledTableCell width={70}>
                    <TextField
                        ref={(ref) => (inputRef.current.received = ref)}
                        size="small"
                        sx={{
                            '.MuiInputBase-input': {
                                padding: 1,
                                fontSize: 12
                            }
                        }}
                        onKeyDown={(event: KeyboardEvent<HTMLInputElement>) =>
                            updateTotalQuantity(event, masterDepartmentItem, 'RECEIVED', inputRef.current.received)
                        }
                    />
                </StyledTableCell>
                <StyledTableCell width={70}>
                    <TextField
                        ref={(ref) => (inputRef.current.issued = ref)}
                        size="small"
                        sx={{
                            '.MuiInputBase-input': {
                                padding: 1,
                                fontSize: 12
                            }
                        }}
                        onKeyDown={(event: KeyboardEvent<HTMLInputElement>) =>
                            updateTotalQuantity(event, masterDepartmentItem, 'ISSUED', inputRef.current.issued)
                        }
                    />
                </StyledTableCell>
                <StyledTableCell width={20} align="center" padding="none">
                    <IconButton
                        onClick={(event: MouseEvent<HTMLElement>) => handleEditClick(event, masterDepartmentItem)}>
                        <ModeEditIcon color="primary" fontSize="small" />
                    </IconButton>
                </StyledTableCell>
                <StyledTableCell width={20} align="center" padding="none">
                    <IconButton
                        onClick={(event: MouseEvent<HTMLElement>) => handleDeleteClick(event, masterDepartmentItem)}>
                        <DeleteIcon color="primary" fontSize="small" />
                    </IconButton>
                </StyledTableCell>
            </TableRow>
        </Fragment>
    );
};

const StoreRoomMaster = () => {
    const requestMasterItemsCheckedSelector = useAppSelector(selectRequestMasterItemsChecked);
    const requestMasterItemsPendingCheckedSelector = useAppSelector(selectRequestMasterItemsPendingChecked);
    const masterDepartmentItemsSelector = useAppSelector(selectMasterDepartmentItems);
    const [page, setPage] = useState<number>(0);
    const location = useLocation();
    const [value, setValue] = useState<number>(0);
    const dispatch = useAppDispatch();
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof IStoreRoom | keyof IMaster | keyof IOrderDetail>('id');

    useEffect(() => {
        dispatch(getMasterDepartmentItemsThunk({ state: location.state, page: page }));
    }, [dispatch, location.state, page]);

    const handleChangePage = (event: any, newPage: number): void => {
        setPage(newPage);
    };

    const handleAddClick = () => {
        dispatch(
            toggleDrawer({
                type: DRAWER_TOGGLE_TYPE.ADD_MASTER_ITEM
            })
        );
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

    const handleEditClick = () => {
        dispatch(toggleDrawer({ type: DRAWER_TOGGLE_TYPE.UPDATE_REQUEST_EDIT }));
    };

    const handleKeywordChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(filterMasterDepartmentItemsThunk({ state: location.state, keyword: event.target.value, page: page }));
    };

    const handleRequestSort = (
        event: MouseEvent<unknown>,
        property: keyof IStoreRoom | keyof IMaster | keyof IOrderDetail
    ) => {
        if (order === 'asc' && orderBy === 'id') {
            dispatch(
                sortMasterDepartmentItemsThunk({
                    state: location.state,
                    page: page,
                    column: property,
                    direction: order
                })
            )
                .then(() => setOrderBy(property))
                .catch((error: Error) => console.error(error.message));
        } else if (order === 'asc' && orderBy === property) {
            dispatch(
                sortMasterDepartmentItemsThunk({
                    state: location.state,
                    page: page,
                    column: property,
                    direction: order
                })
            )
                .then(() => setOrder('desc'))
                .catch((error: Error) => console.error(error.message));
        } else if (order === 'desc' && orderBy === property) {
            dispatch(
                sortMasterDepartmentItemsThunk({
                    state: location.state,
                    page: page,
                    column: property,
                    direction: order
                })
            )
                .then(() => {
                    setOrder('asc');
                    setOrderBy('id');
                })
                .catch((error: Error) => console.error(error.message));
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
            <Grid item padding={2}>
                <Paper elevation={2} sx={{ padding: 0.5 }}>
                    <TableContainer sx={{ height: 700, overflowY: 'auto' }}>
                        <Table stickyHeader>
                            <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
                            <TableBody>
                                {masterDepartmentItemsSelector.response &&
                                    masterDepartmentItemsSelector.response.content.length > 0 &&
                                    masterDepartmentItemsSelector.response.content.map(
                                        (masterDepartmentItem, index) => (
                                            <StoreRoomMasterRow
                                                key={index}
                                                masterDepartmentItem={masterDepartmentItem}
                                                index={index}
                                            />
                                        )
                                    )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
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
                                <BottomNavigationAction
                                    label="Download"
                                    onClick={handleDownloadClick}
                                    icon={<DownloadIcon color="primary" sx={{ fontSize: 40 }} />}
                                />
                                <BottomNavigationAction
                                    label="Review"
                                    onClick={handleReviewClick}
                                    icon={<PreviewIcon color="primary" sx={{ fontSize: 40 }} />}
                                    disabled={requestMasterItemsCheckedSelector.requestMasterItemsChecked.length === 0}
                                />
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
                                <BottomNavigationAction
                                    label="Send"
                                    onClick={handleEditClick}
                                    icon={<SendIcon />}
                                    disabled={
                                        requestMasterItemsPendingCheckedSelector.requestMasterItemsPendingChecked
                                            .length === 0
                                    }
                                />
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
                                    count={masterDepartmentItemsSelector.response.totalElements}
                                    rowsPerPage={masterDepartmentItemsSelector.response.size}
                                    page={masterDepartmentItemsSelector.response.number}
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

export default StoreRoomMaster;
