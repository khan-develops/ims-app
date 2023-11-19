import { Fragment, useRef, useState } from 'react';
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
    TableSortLabel,
    Button,
    Stack
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { IStoreRoom } from '../app/api/properties/IStoreRoom';
import { selectRequestMasterItemsPendingChecked } from '../app/slice/request/requestMasterItemsPendingCheckedSlice';
import AddBoxIcon from '@mui/icons-material/AddBox';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import FileSaver from 'file-saver';
import {
    filterMasterDepartmentItemsThunk,
    getMasterDepartmentItemsThunk,
    selectMasterDepartmentItems,
    sortMasterDepartmentItemsThunk
} from '../app/slice/master/masterDepartmentItemsSlice';
import { IOrderDetail } from '../app/api/properties/IOrderDetail';
import { IMaster, IMasterDepartment } from '../app/api/properties/IMaster';
import { visuallyHidden } from '@mui/utils';
import {
    updateDepartmentItemQuantityThunk,
    updateDepartmentItemThunk
} from '../app/slice/department/departmentItemUpdateSlice';
import { toggleDepartmentItemDrawer } from '../app/slice/drawerToggle/departmentDrawerSlice';
import { toggleRequestItemDrawer } from '../app/slice/drawerToggle/requestDrawerSlice';
import { toggleMasterItemDrawer } from '../app/slice/drawerToggle/masterDrawerSlice';
import { getGrandTotalThunk, selectGrandTotal } from '../app/slice/grandTotalSlice';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import { IDepartment } from '../app/api/properties/IDepartment';

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
        align: 'center',
        padding: 'normal'
    },
    {
        id: 'minimumQuantity',
        numeric: true,
        label: 'Min Qty',
        align: 'center',
        padding: 'normal'
    },
    {
        id: 'maximumQuantity',
        numeric: true,
        label: 'Max Qty',
        align: 'center',
        padding: 'normal'
    },
    {
        id: 'orderQuantity',
        numeric: true,
        label: 'Order Qty',
        align: 'center',
        padding: 'normal'
    },
    {
        id: 'unitPrice',
        numeric: true,
        label: 'Unit Price',
        align: 'center',
        padding: 'normal'
    },
    {
        id: 'totalPrice',
        numeric: true,
        label: 'Total Price',
        align: 'center',
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

const StyledTableItemCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.body}`]: {
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
    const dispatch = useAppDispatch();
    const location = useLocation();
    const inputRef = useRef<{
        quantity: HTMLInputElement | null;
        received: HTMLDivElement | null;
        issued: HTMLDivElement | null;
    }>({
        quantity: null,
        received: null,
        issued: null
    });

    const [updateAction, setUpdateAction] = useState<{
        action: 'received' | 'issued' | '';
        position: 'center' | 'left' | 'right';
    }>({ action: '', position: 'center' });

    const handleDeleteClick = (event: MouseEvent<HTMLElement>, masterDepartmentItem: IMasterDepartment) => {};

    const handleEditClick = (event: MouseEvent<HTMLElement>, masterDepartmentItem: IMasterDepartment) => {
        if (masterDepartmentItem) {
            dispatch(
                toggleDepartmentItemDrawer({
                    toggleType: 'UPDATE_STORE_ROOM_ITEM',
                    departmentItem: {
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

    const getOrderQuantityColor = (masterDepartmentItem: IMasterDepartment) => {
        const minimumQuantity = masterDepartmentItem.departmentItems[0].minimumQuantity;
        const maximumQuantity = masterDepartmentItem.departmentItems[0].maximumQuantity;
        const totalQuantity =
            masterDepartmentItem.orderDetail === null ? null : masterDepartmentItem.orderDetail.totalQuantity;
        if (totalQuantity) {
            if (!minimumQuantity || !maximumQuantity) {
                return 'warning';
            } else if (minimumQuantity === 1 && maximumQuantity === 1 && totalQuantity < 1) {
                return 'error';
            } else if (totalQuantity < minimumQuantity) {
                return 'error';
            } else {
                return 'success';
            }
        }
    };

    const closeIssuedReceived = (defaultValue: number) => {
        if (inputRef && inputRef.current && inputRef.current.quantity) {
            inputRef.current.quantity?.blur();
        }
        setUpdateAction({
            action: '',
            position: 'center'
        });
    };

    const handleIssuedReceived = (actionType: 'issued' | 'received' | '') => {
        if (inputRef && inputRef.current && inputRef.current.quantity) {
            inputRef.current.quantity?.focus();
            inputRef.current.quantity.value = '';
        }
        if (actionType === 'received') {
            setUpdateAction({
                action: actionType,
                position: 'right'
            });
        }
        if (actionType === 'issued') {
            setUpdateAction({
                action: actionType,
                position: 'left'
            });
        }
    };

    const updateQuantity = (
        event: KeyboardEvent<HTMLElement>,
        departmentItem: IDepartment,
        ref: HTMLInputElement | null
    ) => {
        if (event.key === 'Enter') {
            departmentItem = {
                ...departmentItem,
                [(event.target as HTMLInputElement).name]: (event.target as HTMLInputElement).value
            };
            if (updateAction.action === '') {
                dispatch(
                    updateDepartmentItemThunk({
                        state: location.state,
                        departmentItem: departmentItem
                    })
                )
                    .then(() => {
                        inputRef.current.quantity = ref;
                        if (ref) {
                            ref.style.backgroundColor = '#98FB98';
                            ref.style.transition = '1s background ease-in, 500ms transform ease-out 1s';
                            setTimeout(() => {
                                if (ref) {
                                    ref.style.backgroundColor = '#FAFAFA';
                                }
                            }, 700);
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
            } else {
                dispatch(
                    updateDepartmentItemQuantityThunk({
                        state: location.state,
                        departmentItemId: departmentItem.id,
                        quantity: parseInt((event.target as HTMLInputElement).value),
                        updateAction: updateAction.action
                    })
                )
                    .then((response) => {
                        if (inputRef && inputRef.current && inputRef.current.quantity) {
                            inputRef.current.quantity.value = response.payload.quantity;
                            inputRef.current.quantity?.blur();
                        }
                        setUpdateAction({
                            action: '',
                            position: 'center'
                        });
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
        }
    };

    return (
        <Fragment>
            <TableRow>
                <StyledTableItemCell colSpan={columns.length + 4}>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Stack direction="row">
                                <Typography variant="subtitle2" sx={{ marginRight: 1, color: '#E30B5C' }}>
                                    Name:
                                </Typography>
                                <Typography variant="subtitle2"> {masterDepartmentItem.item}</Typography>
                            </Stack>
                            <Stack direction="row">
                                <Typography variant="subtitle2" sx={{ marginRight: 1, color: '#E30B5C' }}>
                                    Usage level:
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'GrayText' }}>
                                    {masterDepartmentItem.departmentItems[0].usageLevel}
                                </Typography>
                            </Stack>
                        </Box>
                        {masterDepartmentItem.comment && (
                            <Stack direction="row">
                                <Typography variant="body2" sx={{ marginRight: 1, color: '#E30B5C' }}>
                                    Comment:
                                </Typography>{' '}
                                <Typography variant="body2"> {masterDepartmentItem.comment}</Typography>
                            </Stack>
                        )}
                    </Box>
                </StyledTableItemCell>
            </TableRow>
            <TableRow key={index} hover>
                <StyledTableCell>{masterDepartmentItem.purchaseUnit}</StyledTableCell>
                <StyledTableCell>{masterDepartmentItem.partNumber}</StyledTableCell>
                <StyledTableCell>{masterDepartmentItem.recentCN}</StyledTableCell>
                <StyledTableCell>{masterDepartmentItem.departmentItems[0].location}</StyledTableCell>
                <StyledTableCell width={150}>
                    <TextField
                        id="quantity"
                        type="number"
                        name="quantity"
                        inputRef={(ref) => (inputRef.current.quantity = ref)}
                        InputProps={{
                            inputProps: {
                                min: 0,
                                style: { textAlign: updateAction.position, fontWeight: 700, fontSize: 14 }
                            },
                            startAdornment:
                                updateAction.action === 'issued' ? null : updateAction.action === 'received' ? (
                                    <IconButton
                                        edge="start"
                                        onClick={() =>
                                            closeIssuedReceived(masterDepartmentItem.departmentItems[0].quantity)
                                        }
                                        color="error">
                                        <CloseIcon />
                                    </IconButton>
                                ) : (
                                    <IconButton
                                        edge="start"
                                        onClick={() => handleIssuedReceived('received')}
                                        color="success">
                                        <AddIcon />
                                    </IconButton>
                                ),
                            endAdornment:
                                updateAction.action === 'received' ? null : updateAction.action === 'issued' ? (
                                    <IconButton
                                        edge="end"
                                        onClick={() =>
                                            closeIssuedReceived(masterDepartmentItem.departmentItems[0].quantity)
                                        }
                                        color="error">
                                        <CloseIcon />
                                    </IconButton>
                                ) : (
                                    <IconButton
                                        edge="end"
                                        color="warning"
                                        onClick={() => handleIssuedReceived('issued')}>
                                        <RemoveIcon />
                                    </IconButton>
                                )
                        }}
                        size="small"
                        defaultValue={masterDepartmentItem.departmentItems[0].quantity}
                        onKeyDown={(event: KeyboardEvent<HTMLElement>) =>
                            updateQuantity(event, masterDepartmentItem.departmentItems[0], inputRef.current.quantity)
                        }
                    />
                </StyledTableCell>
                <StyledTableCell width={100}>
                    <Button
                        fullWidth
                        variant="outlined"
                        disableRipple
                        sx={{ cursor: 'default', fontWeight: '900', fontSize: 14 }}>
                        {masterDepartmentItem.departmentItems[0].minimumQuantity}
                    </Button>
                </StyledTableCell>
                <StyledTableCell width={100}>
                    <Button
                        fullWidth
                        variant="outlined"
                        disableRipple
                        sx={{ cursor: 'default', fontWeight: '900', fontSize: 14 }}>
                        {masterDepartmentItem.departmentItems[0].maximumQuantity}
                    </Button>
                </StyledTableCell>
                <StyledTableCell width={80}>
                    {masterDepartmentItem.orderDetail && (
                        <Button
                            fullWidth
                            disableElevation
                            variant="contained"
                            color={getOrderQuantityColor(masterDepartmentItem)}
                            disableRipple
                            sx={{ cursor: 'default', fontWeight: 900, fontSize: 14 }}>
                            {masterDepartmentItem.orderDetail.totalQuantity}
                        </Button>
                    )}
                </StyledTableCell>
                <StyledTableCell width={100}>
                    <Button
                        fullWidth
                        variant="outlined"
                        disableRipple
                        sx={{ cursor: 'default', fontWeight: '900', fontSize: 14 }}>
                        ${masterDepartmentItem.unitPrice}
                    </Button>
                </StyledTableCell>
                <StyledTableCell>
                    {masterDepartmentItem && masterDepartmentItem.orderDetail && (
                        <Button
                            fullWidth
                            variant="outlined"
                            disableRipple
                            sx={{ cursor: 'default', fontWeight: '900', fontSize: 14 }}>
                            ${masterDepartmentItem.orderDetail.totalPrice}
                        </Button>
                    )}
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
    const { grandTotal } = useAppSelector(selectGrandTotal);
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
            toggleMasterItemDrawer({
                toggleType: 'MASTER_ADD',
                masterItem: null
            })
        );
        dispatch(getGrandTotalThunk(location.state));
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
        dispatch(toggleRequestItemDrawer('UPDATE_REQUEST_EDIT'));
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
                    <Toolbar variant="dense" sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Box width={140}></Box>
                        <Search onChange={handleKeywordChange}>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
                        </Search>
                        <Box width={140}>
                            {grandTotal && grandTotal !== 0 && (
                                <Typography sx={{ fontWeight: 600, color: 'yellow' }}>
                                    ${grandTotal.toLocaleString()}
                                </Typography>
                            )}
                        </Box>
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
