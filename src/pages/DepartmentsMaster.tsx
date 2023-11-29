import { ChangeEvent, Fragment, useRef, KeyboardEvent, useState } from 'react';
import { useEffect, MouseEvent } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
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
    tableCellClasses,
    styled,
    TextField,
    Typography,
    Collapse,
    IconButton,
    Grid,
    BottomNavigation,
    BottomNavigationAction,
    AppBar,
    Toolbar,
    alpha,
    InputBase,
    TableSortLabel,
    Button
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { handlePage } from '../app/common/pageSlice';
import {
    changeMasterDepartmentItems,
    filterMasterDepartmentItemsThunk,
    getMasterDepartmentItemsThunk,
    selectMasterDepartmentItems,
    sortMasterDepartmentItemsThunk
} from '../app/slice/master/masterDepartmentItemsSlice';
import { IDepartment } from '../app/api/properties/IDepartment';
import { updateDepartmentItemThunk } from '../app/slice/department/departmentItemUpdateSlice';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { IMaster, IMasterDepartment } from '../app/api/properties/IMaster';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { IOrderDetail } from '../app/api/properties/IOrderDetail';
import { visuallyHidden } from '@mui/utils';
import { toggleDepartmentItemDrawer } from '../app/slice/drawerToggle/departmentDrawerSlice';
import { getGrandTotalThunk, selectGrandTotal } from '../app/slice/grandTotalSlice';
import { updateQuantityDepartmentItemThunk } from '../app/slice/master/masterDepartmentItemSlice';

const columns: {
    id: keyof IMaster | keyof IOrderDetail;
    numeric: boolean;
    label: string;
    align: 'left' | 'right' | 'center';
    padding: 'checkbox' | 'normal' | 'none';
    size: number;
}[] = [
    { id: 'item', numeric: false, label: 'Item', align: 'left', padding: 'normal', size: 400 },
    {
        id: 'purchaseUnit',
        numeric: false,
        label: 'Purchase Unit',
        align: 'left',
        padding: 'normal',
        size: 100
    },
    {
        id: 'partNumber',
        numeric: false,
        label: 'Part Number',
        align: 'left',
        padding: 'normal',
        size: 100
    },
    {
        id: 'recentCN',
        numeric: false,
        label: 'Recent CN',
        align: 'left',
        padding: 'normal',
        size: 100
    },
    {
        id: 'recentVendor',
        numeric: false,
        label: 'Recent Vendor',
        align: 'left',
        padding: 'normal',
        size: 150
    },
    {
        id: 'totalQuantity',
        numeric: true,
        label: 'Total Qty',
        align: 'center',
        padding: 'normal',
        size: 80
    },
    {
        id: 'orderQuantity',
        numeric: false,
        label: 'Order Qty',
        align: 'center',
        padding: 'normal',
        size: 80
    },
    {
        id: 'unitPrice',
        numeric: false,
        label: 'Unit Price',
        align: 'left',
        padding: 'normal',
        size: 80
    },
    {
        id: 'totalPrice',
        numeric: false,
        label: 'Total Price',
        align: 'left',
        padding: 'normal',
        size: 80
    },
    {
        id: 'category',
        numeric: false,
        label: 'Category',
        align: 'left',
        padding: 'normal',
        size: 80
    },
    {
        id: 'drugClass',
        numeric: false,
        label: 'Drug Class',
        align: 'left',
        padding: 'normal',
        size: 80
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

const StyledSubTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#f8fafc',
        fontSize: 12,
        fontWeight: 400,
        color: theme.palette.common.black
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 12
    }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {},
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0
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

const baseUrl = process.env.REACT_APP_BASE_URL;

const DepartmentRow = ({
    departmentItem,
    masterDepartmentItem
}: {
    departmentItem: IDepartment;
    masterDepartmentItem: IMasterDepartment;
}): JSX.Element => {
    const masterDepartmentItemsSelector = useAppSelector(selectMasterDepartmentItems);
    const dispatch = useAppDispatch();
    const location = useLocation();
    const [updateAction, setUpdateAction] = useState<{
        action: 'received' | 'issued' | 'direct';
        position: 'center' | 'left' | 'right';
    }>({ action: 'direct', position: 'center' });
    const inputRef = useRef<{
        location: HTMLDivElement | null;
        maximumQuantity: HTMLDivElement | null;
        minimumQuantity: HTMLDivElement | null;
        usageLevel: HTMLDivElement | null;
        lotNumber: HTMLDivElement | null;
        quantity: HTMLInputElement | null;
        expirationDate: HTMLDivElement | null;
        receivedDate: HTMLDivElement | null;
        issued: HTMLDivElement | null;
        received: HTMLDivElement | null;
    }>({
        location: null,
        maximumQuantity: null,
        minimumQuantity: null,
        usageLevel: null,
        lotNumber: null,
        quantity: null,
        expirationDate: null,
        receivedDate: null,
        issued: null,
        received: null
    });

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
            if (updateAction.action === 'direct') {
                dispatch(
                    updateQuantityDepartmentItemThunk({
                        department: location.state,
                        quantity: departmentItem.quantity,
                        masterId: masterDepartmentItem.id,
                        departmentId: departmentItem.id,
                        updateAction: 'direct'
                    })
                )
                    .then((response) => {
                        console.log(response);
                        dispatch(
                            changeMasterDepartmentItems(
                                masterDepartmentItemsSelector.response.content.map((originalMasterDepartmentItem) => ({
                                    ...originalMasterDepartmentItem,
                                    orderDetail:
                                        originalMasterDepartmentItem.id === masterDepartmentItem.id
                                            ? response.payload.orderDetail
                                            : originalMasterDepartmentItem.orderDetail
                                }))
                            )
                        );

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
                    updateQuantityDepartmentItemThunk({
                        department: location.state,
                        quantity: parseInt((event.target as HTMLInputElement).value),
                        masterId: masterDepartmentItem.id,
                        departmentId: departmentItem.id,
                        updateAction: updateAction.action
                    })
                )
                    .then((response) => {
                        dispatch(
                            changeMasterDepartmentItems(
                                masterDepartmentItemsSelector.response.content.map((originalMasterDepartmentItem) => ({
                                    ...originalMasterDepartmentItem,
                                    departmentItems:
                                        originalMasterDepartmentItem.id === masterDepartmentItem.id
                                            ? originalMasterDepartmentItem.departmentItems.map(
                                                  (originalDepartmentItem) => ({
                                                      ...originalDepartmentItem,
                                                      quantity: departmentItem.quantity
                                                  })
                                              )
                                            : originalMasterDepartmentItem.departmentItems
                                }))
                            )
                        );
                        if (inputRef && inputRef.current && inputRef.current.quantity) {
                            inputRef.current.quantity.value = response.payload.quantity;
                            inputRef.current.quantity?.blur();
                        }
                        setUpdateAction({
                            action: 'direct',
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

    const handleDatePickerClose = (departmentItem: IDepartment) => {
        dispatch(
            updateDepartmentItemThunk({
                state: location.state,
                departmentItem: departmentItem
            })
        )
            .then((response) => console.log(response))
            .catch((error: Error) => console.error(error.message));
    };

    const handleDateChange = (
        value: Date | null,
        departmentItem: IDepartment,
        dateType: 'expirationDate' | 'receivedDate'
    ) => {
        dispatch(
            changeMasterDepartmentItems(
                masterDepartmentItemsSelector.response.content.map((originalMasterDepartmentItem) => ({
                    ...originalMasterDepartmentItem,
                    departmentItems:
                        originalMasterDepartmentItem.id === masterDepartmentItem.id
                            ? originalMasterDepartmentItem.departmentItems.map((originalDepartmentItem) => ({
                                  ...originalDepartmentItem,
                                  [dateType]:
                                      departmentItem.id === originalDepartmentItem.id
                                          ? value
                                          : originalDepartmentItem[dateType]
                              }))
                            : originalMasterDepartmentItem.departmentItems
                }))
            )
        );
    };

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

    const handleDeleteClick = (event: MouseEvent<HTMLElement>, masterDepartmentItem: IMasterDepartment) => {};

    const handleIssuedReceived = (actionType: 'issued' | 'received' | 'direct') => {
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

    const closeIssuedReceived = (defaultValue: number) => {
        if (inputRef && inputRef.current && inputRef.current.quantity) {
            inputRef.current.quantity?.blur();
        }
        setUpdateAction({
            action: 'direct',
            position: 'center'
        });
    };

    return (
        <TableRow hover>
            <StyledSubTableCell>{departmentItem.location}</StyledSubTableCell>
            <StyledSubTableCell>{departmentItem.usageLevel}</StyledSubTableCell>
            <StyledSubTableCell>{departmentItem.lotNumber}</StyledSubTableCell>
            <StyledSubTableCell width={70}>{departmentItem.minimumQuantity}</StyledSubTableCell>
            <StyledSubTableCell width={70}>{departmentItem.maximumQuantity}</StyledSubTableCell>
            <StyledSubTableCell width={150}>
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
                                    onClick={() => closeIssuedReceived(departmentItem.quantity)}
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
                                    onClick={() => closeIssuedReceived(departmentItem.quantity)}
                                    color="error">
                                    <CloseIcon />
                                </IconButton>
                            ) : (
                                <IconButton edge="end" color="warning" onClick={() => handleIssuedReceived('issued')}>
                                    <RemoveIcon />
                                </IconButton>
                            )
                    }}
                    size="small"
                    defaultValue={departmentItem.quantity}
                    onKeyDown={(event: KeyboardEvent<HTMLElement>) =>
                        updateQuantity(event, departmentItem, inputRef.current.quantity)
                    }
                />
            </StyledSubTableCell>
            <StyledSubTableCell width={100}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                        ref={(ref) => (inputRef.current.expirationDate = ref)}
                        value={departmentItem.expirationDate}
                        onChange={(value: Date | null) => handleDateChange(value, departmentItem, 'expirationDate')}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                sx={{
                                    '.MuiInputBase-input': {
                                        padding: 1,
                                        fontSize: 12,
                                        width: 140
                                    }
                                }}
                            />
                        )}
                        onClose={() => handleDatePickerClose(departmentItem)}
                    />
                </LocalizationProvider>
            </StyledSubTableCell>
            <StyledSubTableCell width={100}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                        inputRef={(ref) => (inputRef.current.receivedDate = ref)}
                        value={departmentItem.receivedDate}
                        onChange={(value: Date | null) => handleDateChange(value, departmentItem, 'receivedDate')}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                sx={{
                                    '.MuiInputBase-input': {
                                        padding: 1,
                                        fontSize: 12,
                                        width: 140
                                    }
                                }}
                            />
                        )}
                        onClose={() => handleDatePickerClose(departmentItem)}
                    />
                </LocalizationProvider>
            </StyledSubTableCell>
            <StyledTableCell width={20} align="center" padding="none">
                <IconButton onClick={(event: MouseEvent<HTMLElement>) => handleEditClick(event, masterDepartmentItem)}>
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
    );
};

const MasterDepartmentRow = ({
    openRows,
    masterDepartmentItem,
    handleExpandRow
}: {
    openRows: number[];
    masterDepartmentItem: IMasterDepartment;
    handleExpandRow: (masterDepartmentItem: IMasterDepartment) => void;
}): JSX.Element => {
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

    return (
        <Fragment>
            <TableRow>
                <StyledTableItemCell colSpan={columns.length + 1}>
                    <Box sx={{ width: '100%', display: 'flex', marginLeft: 7 }}>
                        <Typography variant="body2" sx={{ color: 'GrayText' }}>
                            {masterDepartmentItem.comment}
                        </Typography>
                    </Box>
                </StyledTableItemCell>
            </TableRow>
            <StyledTableRow hover>
                <TableCell padding="checkbox">
                    <IconButton onClick={() => handleExpandRow(masterDepartmentItem)} color="inherit">
                        {openRows.includes(masterDepartmentItem.id) ? (
                            <KeyboardArrowUpIcon fontSize="medium" />
                        ) : (
                            <KeyboardArrowDownIcon fontSize="medium" />
                        )}
                    </IconButton>
                </TableCell>
                <StyledTableCell width={'30%'}>{masterDepartmentItem.item}</StyledTableCell>
                <StyledTableCell width={100}>{masterDepartmentItem.purchaseUnit}</StyledTableCell>
                <StyledTableCell width={100}>{masterDepartmentItem.partNumber}</StyledTableCell>
                <StyledTableCell width={100}>{masterDepartmentItem.recentCN}</StyledTableCell>
                <StyledTableCell width={150}>{masterDepartmentItem.recentVendor}</StyledTableCell>
                <StyledTableCell width={70}>
                    {masterDepartmentItem.orderDetail && masterDepartmentItem.orderDetail.totalQuantity && (
                        <Button
                            fullWidth
                            variant="outlined"
                            disableRipple
                            sx={{ cursor: 'default', fontWeight: '900', fontSize: 14 }}>
                            {masterDepartmentItem.orderDetail.totalQuantity}
                        </Button>
                    )}
                </StyledTableCell>
                <StyledTableCell width={80}>
                    {masterDepartmentItem.departmentItems[0].maximumQuantity !== null ? (
                        <Button
                            fullWidth
                            disableElevation
                            variant="contained"
                            color={getOrderQuantityColor(masterDepartmentItem)}
                            disableRipple
                            sx={{ cursor: 'default', fontWeight: 900, fontSize: 14 }}>
                            {masterDepartmentItem.orderDetail.orderQuantity}
                        </Button>
                    ) : (
                        <Typography>No</Typography>
                    )}

                    {/* {(masterDepartmentItem.departmentItems[0].maximumQuantity &&
                    masterDepartmentItem.departmentItems[0].minimumQuantity &&
                    masterDepartmentItem.orderDetail) ? 
                      
                     : 
                        <Box>NO<Box/>
                        } */}
                </StyledTableCell>
                <StyledTableCell>
                    <Button
                        fullWidth
                        variant="outlined"
                        disableRipple
                        sx={{ cursor: 'default', fontWeight: 900, fontSize: 14 }}>
                        <span style={{ marginRight: 1 }}>$</span>
                        {masterDepartmentItem.unitPrice}
                    </Button>
                </StyledTableCell>
                <StyledTableCell>
                    {masterDepartmentItem.orderDetail && (
                        <Button
                            fullWidth
                            variant="outlined"
                            disableRipple
                            sx={{ cursor: 'default', fontWeight: 900, fontSize: 14 }}>
                            <span style={{ marginRight: 1 }}>$</span>
                            {masterDepartmentItem.orderDetail.totalPrice}
                        </Button>
                    )}
                </StyledTableCell>
                <StyledTableCell>{masterDepartmentItem.category}</StyledTableCell>
                <StyledTableCell>{masterDepartmentItem.drugClass}</StyledTableCell>
            </StyledTableRow>
            {openRows.find((id) => id === masterDepartmentItem.id) && (
                <TableRow hover>
                    <TableCell colSpan={13}>
                        <Collapse in={openRows.includes(masterDepartmentItem.id)} timeout="auto" unmountOnExit>
                            <Paper sx={{ margin: 2 }} elevation={1} square>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <StyledSubTableCell>Location</StyledSubTableCell>
                                            <StyledSubTableCell align="left">Usage Level</StyledSubTableCell>
                                            <StyledSubTableCell align="left">Lot #</StyledSubTableCell>

                                            <StyledSubTableCell align="left">Min Qty</StyledSubTableCell>
                                            <StyledSubTableCell align="left">Max Qty</StyledSubTableCell>
                                            <StyledSubTableCell>Qty</StyledSubTableCell>
                                            <StyledSubTableCell align="left">Expiration Date</StyledSubTableCell>
                                            <StyledSubTableCell align="left">Received Date</StyledSubTableCell>
                                            <StyledSubTableCell align="left">Edit</StyledSubTableCell>
                                            <StyledSubTableCell align="left">Delete</StyledSubTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {masterDepartmentItem.departmentItems.map((departmentItem, index) => (
                                            <DepartmentRow
                                                key={index}
                                                departmentItem={departmentItem}
                                                masterDepartmentItem={masterDepartmentItem}
                                            />
                                        ))}
                                    </TableBody>
                                </Table>
                            </Paper>
                        </Collapse>
                    </TableCell>
                </TableRow>
            )}
        </Fragment>
    );
};

type Order = 'asc' | 'desc';
interface EnhancedTableProps {
    onRequestSort: (event: MouseEvent<unknown>, property: keyof IMaster | keyof IOrderDetail) => void;
    openRows: number[];
    order: Order;
    orderBy: string;
    handleExpandAllRow: () => void;
}

const EnhancedTableHead = (props: EnhancedTableProps) => {
    const { openRows, order, orderBy, onRequestSort, handleExpandAllRow } = props;
    const masterDepartmentItemsSelector = useAppSelector(selectMasterDepartmentItems);
    const createSortHandler = (property: keyof IMaster | keyof IOrderDetail) => (event: MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead sx={{ whiteSpace: 'nowrap' }}>
            <TableRow>
                <StyledTableCell padding="checkbox" align="center">
                    <IconButton onClick={handleExpandAllRow} sx={{ padding: 0 }} color="inherit">
                        {openRows.length > 0 &&
                        openRows.length !== masterDepartmentItemsSelector.response.content.length ? (
                            <UnfoldMoreIcon fontSize="medium" color="inherit" />
                        ) : masterDepartmentItemsSelector.response.content.every((masterDepartmentItem) =>
                              openRows.includes(masterDepartmentItem.id)
                          ) ? (
                            <KeyboardArrowUpIcon fontSize="medium" color="inherit" />
                        ) : (
                            <KeyboardArrowDownIcon fontSize="medium" color="inherit" />
                        )}
                    </IconButton>
                </StyledTableCell>
                {columns.map((headCell) => (
                    <StyledTableCell
                        key={headCell.id}
                        align={headCell.align}
                        width={headCell.size}
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

const DepartmentsMaster = () => {
    const masterDepartmentItemsSelector = useAppSelector(selectMasterDepartmentItems);
    const { grandTotal } = useAppSelector(selectGrandTotal);
    const [page, setPage] = useState<number>(0);
    const dispatch = useAppDispatch();
    const location = useLocation();
    const [openRows, setOpenRows] = useState<number[]>([]);
    const [value, setValue] = useState<number>(0);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof IMaster | keyof IOrderDetail>('id');

    useEffect(() => {
        dispatch(
            getMasterDepartmentItemsThunk({
                state: location.state,
                page: page
            })
        );
        dispatch(getGrandTotalThunk(location.state));
    }, [dispatch, location.state, page]);

    const handleChangePage = (event: any, newPage: number): void => {
        setPage(newPage);
        dispatch(handlePage(newPage));
    };

    const handleExpandRow = (masterDepartmentItem: IMasterDepartment) => {
        if (openRows.includes(masterDepartmentItem.id)) {
            setOpenRows(openRows.filter((id) => id !== masterDepartmentItem.id));
        } else {
            setOpenRows([...openRows, masterDepartmentItem.id]);
        }
    };

    const handleDownloadClick = async (): Promise<void> => {
        return await axios
            .get(`${baseUrl}/download/${location.state}/list`, { responseType: 'blob' })
            .then((response) => {
                const blob = new Blob([response.data]);
                const blobUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = blobUrl;
                a.download = `${location.state}.xlsx`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(blobUrl);
            })
            .catch((error: Error) => console.error(error.message));
    };

    const handleKeywordChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(filterMasterDepartmentItemsThunk({ state: location.state, keyword: event.target.value, page: 0 }));
    };

    const handleRequestSort = (event: MouseEvent<unknown>, property: keyof IMaster | keyof IOrderDetail) => {
        if (order === 'asc' && orderBy === 'id') {
            setOrder('asc');
            setOrderBy(property);
            dispatch(
                sortMasterDepartmentItemsThunk({
                    state: location.state,
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
                sortMasterDepartmentItemsThunk({
                    state: location.state,
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
                sortMasterDepartmentItemsThunk({
                    state: location.state,
                    page: page,
                    column: 'id',
                    direction: 'asc'
                })
            )
                .then(() => {})
                .catch((error: Error) => console.error(error.message));
        }
    };

    const handleExpandAllRow = () => {
        if (masterDepartmentItemsSelector.response.content.length > 0) {
            if (
                openRows.length === 0 ||
                (openRows.length > 0 && openRows.length !== masterDepartmentItemsSelector.response.content.length)
            ) {
                setOpenRows(
                    masterDepartmentItemsSelector.response.content.reduce((result: number[], masterDepartmentItem) => {
                        if (masterDepartmentItem.id) {
                            result.push(masterDepartmentItem.id);
                        }
                        return result;
                    }, [])
                );
            } else {
                setOpenRows([]);
            }
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
                            <EnhancedTableHead
                                openRows={openRows}
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                                handleExpandAllRow={handleExpandAllRow}
                            />
                            <TableBody>
                                {masterDepartmentItemsSelector.response.content.length > 0 &&
                                    masterDepartmentItemsSelector.response.content.map((masterDepartmentItem) => (
                                        <MasterDepartmentRow
                                            key={masterDepartmentItem.id}
                                            openRows={openRows}
                                            masterDepartmentItem={masterDepartmentItem}
                                            handleExpandRow={handleExpandRow}
                                        />
                                    ))}
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

export default DepartmentsMaster;
