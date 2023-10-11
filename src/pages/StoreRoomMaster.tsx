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
    IconButton
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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#ffd740',
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
    const dispatch = useAppDispatch();
    const [page, setPage] = useState<number>(0);
    const location = useLocation();

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

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }} component={Paper} elevation={3}>
            <TableContainer sx={{ height: '70vh' }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow sx={{ height: 50 }}>
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
            {storeRoomMasterItemsSelector.response && (
                <TablePagination
                    sx={{ marginTop: 3 }}
                    rowsPerPageOptions={[]}
                    component="div"
                    count={storeRoomMasterItemsSelector.response.totalElements}
                    rowsPerPage={storeRoomMasterItemsSelector.response.size}
                    page={storeRoomMasterItemsSelector.response.number}
                    onPageChange={handleChangePage}
                    showFirstButton={true}
                    showLastButton={true}
                />
            )}
        </Box>
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
