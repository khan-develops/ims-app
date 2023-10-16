import React, { useRef, useState } from 'react';
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
    InputBase
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import {
    changeStoreRoomMasterItems,
    getStoreRoomMasterItemsThunk,
    selectStoreRoomMasterItems
} from '../app/slice/storeRoom/storeRoomMasterItemsSlice';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DRAWER_TOGGLE_TYPE } from '../common/constants';
import { toggleDrawer } from '../app/slice/drawerToggle/drawerToggleTypeSlice';
import { IStoreRoomMaster } from '../app/api/properties/IStoreRoom';
import { getTotalAmount } from '../app/slice/totalAmount';
import { updateStoreRoomItemThunk } from '../app/slice/storeRoom/storeRoomUpdateSlice';
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
import { filterMasterItemsThunk } from '../app/slice/master/masterItemsSlice';
import { filterMasterDepartmentItemsThunk } from '../app/slice/master/masterDepartmentItemsSlice';
import { getSearchValue } from '../app/search';

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
        fontSize: 11,
        fontWeight: 700,
        color: theme.palette.common.black
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 11
    }
}));

const columns: {
    field: string;
    tooltipName: string;
    headerName: string | JSX.Element;
    align: 'left' | 'center' | 'right';
}[] = [
    { field: 'item', tooltipName: 'Item', headerName: 'Item', align: 'left' },
    {
        field: 'purchaseUnit',
        tooltipName: 'Purchase Unit',
        headerName: 'PU',
        align: 'left'
    },
    {
        field: 'partNumber',
        tooltipName: 'Part Number',
        headerName: 'PN',
        align: 'left'
    },
    {
        field: 'recentCN',
        tooltipName: 'Recent CN',
        headerName: 'RCN',
        align: 'left'
    },
    {
        field: 'location',
        tooltipName: 'Location',
        headerName: 'L',
        align: 'left'
    },
    {
        field: 'totalQuantity',
        tooltipName: 'Total Quantity',
        headerName: 'TQ',
        align: 'left'
    },
    {
        field: 'usageLevel',
        tooltipName: 'Usage Level',
        headerName: 'UL',
        align: 'left'
    },
    {
        field: 'minimumQuantity',
        tooltipName: 'Min Qty',
        headerName: 'MinQ',
        align: 'left'
    },
    {
        field: 'maximumQuantity',
        tooltipName: 'Max Qty',
        headerName: 'MaxQ',
        align: 'left'
    },
    {
        field: 'orderQuantity',
        tooltipName: 'Order Qty',
        headerName: 'OQ',
        align: 'left'
    },
    {
        field: 'unitPrice',
        tooltipName: 'Unit Price',
        headerName: 'UP',
        align: 'left'
    },
    { field: 'issued', tooltipName: 'Issued', headerName: 'Iss', align: 'left' },
    {
        field: 'received',
        tooltipName: 'Received',
        headerName: 'Rec',
        align: 'left'
    },
    {
        field: 'totalQrice',
        tooltipName: 'Total Price',
        headerName: 'TP',
        align: 'left'
    },
    {
        field: 'comments',
        tooltipName: 'Comment',
        headerName: 'Comment',
        align: 'left'
    },
    {
        field: 'action',
        tooltipName: 'Edit | Delete',
        headerName: 'Edit | Delete',
        align: 'right'
    }
];

const StoreRoomMaster = () => {
    const storeRoomMasterItemsSelector = useAppSelector(selectStoreRoomMasterItems);
    const [page, setPage] = useState<number>(0);
    const location = useLocation();
    const [value, setValue] = useState<number>(0);
    const dispatch = useAppDispatch();
    const requestMasterItemsCheckedSelector = useAppSelector(selectRequestMasterItemsChecked);
    const requestMasterItemsPendingCheckedSelector = useAppSelector(selectRequestMasterItemsPendingChecked);
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const { state } = useLocation();

    useEffect(() => {
        dispatch(getStoreRoomMasterItemsThunk(page))
            .then((response) => {
                const total = response.payload.content.reduce(
                    (total: number, storeRoomMasterItem: IStoreRoomMaster) =>
                        total + storeRoomMasterItem.masterItem.unitPrice * storeRoomMasterItem.quantity,
                    0
                );
                dispatch(getTotalAmount({ totalAmount: total }));
            })
            .catch((error: Error) => console.error(error.message));
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
        dispatch(getSearchValue(event.target.value));
        if (state === 'master') {
            dispatch(filterMasterItemsThunk({ keyword: event.target.value, page: 0 }));
        } else {
            dispatch(filterMasterDepartmentItemsThunk({ state: state, keyword: event.target.value, page: 0 }));
        }
        // if (
        //     state === 'extractions' ||
        //     state === 'mass-spec' ||
        //     state === 'rd' ||
        //     state === 'screening' ||
        //     state === 'shipping' ||
        //     state === 'processing_lab' ||
        //     state === 'qc-internal-standards' ||
        //     state === 'qc-qa' ||
        //     state === 'store-room'
        // ) {
        //     dispatch(filterMasterItemsThunk({ keyword: event.target.value, page: 0 }));
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
            <Grid item padding={2} flexGrow={1}>
                <TableContainer sx={{ height: '100%', overflowY: 'auto' }} component={Paper} elevation={2}>
                    <Table stickyHeader>
                        <TableHead sx={{ height: 45, whiteSpace: 'nowrap' }}>
                            <TableRow>
                                {columns.length > 0 &&
                                    columns.map((column) => (
                                        <StyledTableCell key={column.field} align={column.align}>
                                            <Box>{column.tooltipName}</Box>
                                        </StyledTableCell>
                                    ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {storeRoomMasterItemsSelector.response &&
                                storeRoomMasterItemsSelector.response.content.length > 0 &&
                                storeRoomMasterItemsSelector.response.content.map((storeRoomMasterItem, index) => (
                                    <Row storeRoomMasterItem={storeRoomMasterItem} index={index} />
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
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
                                {' '}
                                {(location.pathname === '/departments/extractions' ||
                                    location.pathname === '/departments/mass-spec' ||
                                    location.pathname === '/departments/processing-lab' ||
                                    location.pathname === '/departments/rd' ||
                                    location.pathname === '/departments/screening' ||
                                    location.pathname === '/departments/shipping' ||
                                    location.pathname === '/departments/qc-qa') && (
                                    <BottomNavigationAction
                                        label="Download"
                                        onClick={handleDownloadClick}
                                        icon={<DownloadIcon color="primary" sx={{ fontSize: 40 }} />}
                                    />
                                )}
                                {(location.pathname === '/general-request/list' ||
                                    location.pathname === '/office-supply-request/list' ||
                                    location.pathname === '/store-room-request/list') && (
                                    <BottomNavigationAction
                                        label="Review"
                                        onClick={handleReviewClick}
                                        icon={<PreviewIcon color="primary" sx={{ fontSize: 40 }} />}
                                        disabled={
                                            requestMasterItemsCheckedSelector.requestMasterItemsChecked.length === 0
                                        }
                                    />
                                )}
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
                                {(location.pathname === '/general-request/confirmation' ||
                                    location.pathname === '/office-supply-request/confirmation' ||
                                    location.pathname === '/store-room-request/confirmation') && (
                                    <BottomNavigationAction
                                        label="Send"
                                        onClick={handleEditClick}
                                        icon={<SendIcon />}
                                        disabled={
                                            requestMasterItemsPendingCheckedSelector.requestMasterItemsPendingChecked
                                                .length === 0
                                        }
                                    />
                                )}
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
                                    count={storeRoomMasterItemsSelector.response.totalElements}
                                    rowsPerPage={storeRoomMasterItemsSelector.response.size}
                                    page={storeRoomMasterItemsSelector.response.number}
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

const Row = ({ storeRoomMasterItem, index }: { storeRoomMasterItem: IStoreRoomMaster; index: number }) => {
    const storeRoomMasterItemsSelector = useAppSelector(selectStoreRoomMasterItems);
    const dispatch = useAppDispatch();
    const inputRef = useRef<HTMLDivElement | null>(null);

    const handleDeleteClick = (event: MouseEvent<HTMLElement>, storeRoomMasterItem: IStoreRoomMaster) => {};

    const updateStoreRoomItem = (event: KeyboardEvent, id: number) => {
        const storeRoomMasterItem = storeRoomMasterItemsSelector.response?.content.find((item) => item.id === id);
        if (storeRoomMasterItem) {
            if (event.key === 'Enter') {
                dispatch(
                    updateStoreRoomItemThunk({
                        id: storeRoomMasterItem.id,
                        location: storeRoomMasterItem.location,
                        quantity: storeRoomMasterItem.quantity,
                        minimumQuantity: storeRoomMasterItem.minimumQuantity,
                        maximumQuantity: storeRoomMasterItem.maximumQuantity,
                        usageLevel: storeRoomMasterItem.usageLevel,
                        lotNumber: storeRoomMasterItem.lotNumber,
                        expirationDate: storeRoomMasterItem.expirationDate,
                        receivedDate: storeRoomMasterItem.receivedDate
                    })
                )
                    .then(() => {
                        if (inputRef.current) {
                            inputRef.current.style.backgroundColor = '#98FB98';
                            inputRef.current.style.transition = '1s background ease-in, 500ms transform ease-out 1s';
                            setTimeout(() => {
                                if (inputRef.current) {
                                    inputRef.current.style.backgroundColor = '#FAFAFA';
                                    inputRef.current.blur();
                                }
                            }, 700);
                        }
                    })
                    .catch((error: Error) => {
                        if (inputRef.current) {
                            inputRef.current.style.backgroundColor = '#FF0000';
                            inputRef.current.style.transition = '1s background ease-in, 500ms transform ease-out 1s';
                            setTimeout(() => {
                                if (inputRef.current) {
                                    inputRef.current.style.backgroundColor = '#FAFAFA';
                                }
                            }, 700);
                        }
                        console.error(error.message);
                    });
            }
        }
    };

    const handleChangeQty = (id: number, event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(
            changeStoreRoomMasterItems(
                storeRoomMasterItemsSelector.response.content.map((storeRoomMasterItem) => ({
                    ...storeRoomMasterItem,
                    quantity:
                        storeRoomMasterItem.id === id ? parseInt(event.target.value) : storeRoomMasterItem.quantity
                }))
            )
        );
    };

    const getTotalPrice = (unitPrice: number, quantity: number) => {
        return unitPrice * quantity;
    };

    const handleEditClick = (event: MouseEvent<HTMLElement>, storeRoomMasterItem: IStoreRoomMaster) => {
        if (storeRoomMasterItem) {
            dispatch(
                toggleDrawer({
                    type: DRAWER_TOGGLE_TYPE.UPDATE_STORE_ROOM_ITEM,
                    storeRoomItem: {
                        id: storeRoomMasterItem.id,
                        location: storeRoomMasterItem.location,
                        quantity: storeRoomMasterItem.quantity,
                        minimumQuantity: storeRoomMasterItem.minimumQuantity,
                        maximumQuantity: storeRoomMasterItem.maximumQuantity,
                        usageLevel: storeRoomMasterItem.usageLevel,
                        lotNumber: storeRoomMasterItem.lotNumber,
                        expirationDate: storeRoomMasterItem.expirationDate,
                        receivedDate: storeRoomMasterItem.receivedDate
                    }
                })
            );
        }
    };

    return (
        <TableRow key={index} hover>
            <StyledTableCell>{storeRoomMasterItem.masterItem.item}</StyledTableCell>
            <StyledTableCell>{storeRoomMasterItem.masterItem.purchaseUnit}</StyledTableCell>
            <StyledTableCell>{storeRoomMasterItem.masterItem.partNumber}</StyledTableCell>
            <StyledTableCell>{storeRoomMasterItem.masterItem.recentCN}</StyledTableCell>
            <StyledTableCell>{storeRoomMasterItem.location}</StyledTableCell>
            <StyledTableCell width={100}>
                <TextField
                    ref={inputRef}
                    fullWidth
                    size="small"
                    type="number"
                    InputProps={{
                        inputProps: { min: 0 }
                    }}
                    sx={{
                        '.MuiInputBase-input': {
                            padding: 1,
                            fontSize: 11
                        }
                    }}
                    id={storeRoomMasterItem.id?.toString()}
                    value={storeRoomMasterItem.quantity}
                    onKeyDown={(event: KeyboardEvent) => updateStoreRoomItem(event, storeRoomMasterItem.id)}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleChangeQty(storeRoomMasterItem.id, event)}
                />
            </StyledTableCell>
            <StyledTableCell>{storeRoomMasterItem.usageLevel}</StyledTableCell>
            <StyledTableCell>{storeRoomMasterItem.minimumQuantity}</StyledTableCell>
            <StyledTableCell>{storeRoomMasterItem.maximumQuantity}</StyledTableCell>
            <StyledTableCell>order quantity</StyledTableCell>
            <StyledTableCell>${storeRoomMasterItem.masterItem.unitPrice}</StyledTableCell>
            <StyledTableCell>issued</StyledTableCell>
            <StyledTableCell>received</StyledTableCell>
            <StyledTableCell>
                ${getTotalPrice(storeRoomMasterItem.masterItem.unitPrice, storeRoomMasterItem.quantity)}
            </StyledTableCell>
            <StyledTableCell width={200}>{storeRoomMasterItem.masterItem.comment}</StyledTableCell>
            <StyledTableCell>
                <Box sx={{ display: 'flex' }}>
                    <IconButton
                        sx={{ marginLeft: '0.7rem', marginRight: '0.7rem' }}
                        onClick={(event: MouseEvent<HTMLElement>) => handleEditClick(event, storeRoomMasterItem)}>
                        <ModeEditIcon color="primary" fontSize="small" />
                    </IconButton>
                    <IconButton
                        onClick={(event: MouseEvent<HTMLElement>) => handleDeleteClick(event, storeRoomMasterItem)}>
                        <DeleteIcon color="primary" fontSize="small" />
                    </IconButton>
                </Box>
            </StyledTableCell>
        </TableRow>
    );
};

export default StoreRoomMaster;
