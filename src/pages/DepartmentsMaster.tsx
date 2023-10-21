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
    TableSortLabel
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
import PreviewIcon from '@mui/icons-material/Preview';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import AddBoxIcon from '@mui/icons-material/AddBox';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { DRAWER_TOGGLE_TYPE } from '../common/constants';
import axios from 'axios';
import FileSaver from 'file-saver';
import { toggleDrawer } from '../app/slice/drawerToggle/drawerToggleTypeSlice';
import { IOrderDetail } from '../app/api/properties/IOrderDetail';
import { visuallyHidden } from '@mui/utils';

const columns: {
    id: keyof IMaster | keyof IOrderDetail;
    numeric: boolean;
    label: string;
    align: 'left' | 'right' | 'center';
    padding: 'checkbox' | 'normal' | 'none';
}[] = [
    { id: 'item', numeric: false, label: 'Item', align: 'left', padding: 'normal' },
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
        id: 'recentVendor',
        numeric: false,
        label: 'Recent Vendor',
        align: 'left',
        padding: 'normal'
    },
    {
        id: 'drugClass',
        numeric: false,
        label: 'Drug Class',
        align: 'left',
        padding: 'normal'
    },
    {
        id: 'totalQuantity',
        numeric: false,
        label: 'Total Qty',
        align: 'left',
        padding: 'normal'
    },
    {
        id: 'orderQuantity',
        numeric: false,
        label: 'Order Qty',
        align: 'left',
        padding: 'normal'
    },
    {
        id: 'unitPrice',
        numeric: false,
        label: 'Unit Price',
        align: 'left',
        padding: 'normal'
    },
    {
        id: 'totalPrice',
        numeric: false,
        label: 'Total Price',
        align: 'left',
        padding: 'normal'
    },
    {
        id: 'comment',
        numeric: false,
        label: 'Comment',
        align: 'left',
        padding: 'normal'
    },
    {
        id: 'category',
        numeric: false,
        label: 'Category',
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
        fontSize: 11,
        fontWeight: 400,
        color: theme.palette.common.black
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 11
    }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {},
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0
    }
}));

const baseUrl = process.env.REACT_APP_BASE_URL;

const MasterDepartmentRow = ({
    openRows,
    masterDepartmentItem,
    handleExpandRow
}: {
    openRows: number[];
    masterDepartmentItem: IMasterDepartment;
    handleExpandRow: (masterDepartmentItem: IMasterDepartment) => void;
}): JSX.Element => {
    const masterDepartmentItemsSelector = useAppSelector(selectMasterDepartmentItems);
    const dispatch = useAppDispatch();
    const location = useLocation();
    const inputRef = useRef<{
        location: HTMLDivElement | null;
        maximumQuantity: HTMLDivElement | null;
        minimumQuantity: HTMLDivElement | null;
        usageLevel: HTMLDivElement | null;
        lotNumber: HTMLDivElement | null;
        quantity: HTMLDivElement | null;
        expirationDate: HTMLDivElement | null;
        receivedDate: HTMLDivElement | null;
    }>({
        location: null,
        maximumQuantity: null,
        minimumQuantity: null,
        usageLevel: null,
        lotNumber: null,
        quantity: null,
        expirationDate: null,
        receivedDate: null
    });

    const getOrderQuantityColor = (masterDepartmentItem: IMasterDepartment) => {
        const minimumQuantity = masterDepartmentItem.departmentItems[0].minimumQuantity;
        const maximumQuantity = masterDepartmentItem.departmentItems[0].maximumQuantity;
        const totalQuantity =
            masterDepartmentItem.orderDetail === null ? null : masterDepartmentItem.orderDetail.totalQuantity;
        if (totalQuantity) {
            if (!minimumQuantity || !maximumQuantity) {
                return '#eded00';
            } else if (minimumQuantity === 1 && maximumQuantity === 1 && totalQuantity < 1) {
                return '#FF0000';
            } else if (totalQuantity < minimumQuantity) {
                return 'red';
            } else {
                return '#3CB371';
            }
        }
    };

    const handleEnterKey = (
        event: KeyboardEvent<HTMLDivElement>,
        departmentItem: IDepartment,
        ref: HTMLDivElement | null
    ) => {
        if (event.key === 'Enter') {
            inputRef.current.location = ref;
            departmentItem = {
                ...departmentItem,
                [(event.target as HTMLInputElement).name]: (event.target as HTMLInputElement).value
            };
            dispatch(
                updateDepartmentItemThunk({
                    state: location.state,
                    departmentItem: departmentItem
                })
            )
                .then(() => {
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
        if (dateType === 'expirationDate') {
            if (value) {
                departmentItem = { ...departmentItem, expirationDate: value };
            }
        }
        if (dateType === 'receivedDate') {
            if (value) {
                departmentItem = { ...departmentItem, receivedDate: value };
            }
        }
        dispatch(
            changeMasterDepartmentItems(
                masterDepartmentItemsSelector.response.content.map((originalMasterDepartmentItem) => ({
                    ...originalMasterDepartmentItem,
                    departmentItems:
                        originalMasterDepartmentItem.id === masterDepartmentItem.id
                            ? originalMasterDepartmentItem.departmentItems.map((originalDepartmentItem) => ({
                                  ...originalDepartmentItem,
                                  receivedDate:
                                      departmentItem.id === originalDepartmentItem.id
                                          ? value
                                          : originalDepartmentItem.receivedDate
                              }))
                            : masterDepartmentItem.departmentItems
                }))
            )
        );
    };

    return (
        <Fragment>
            <StyledTableRow hover>
                <TableCell>
                    <IconButton
                        sx={{ padding: 0 }}
                        onClick={() => handleExpandRow(masterDepartmentItem)}
                        color="inherit">
                        {openRows.includes(masterDepartmentItem.id) ? (
                            <KeyboardArrowUpIcon fontSize="medium" />
                        ) : (
                            <KeyboardArrowDownIcon fontSize="medium" />
                        )}
                    </IconButton>
                </TableCell>
                <StyledTableCell>{masterDepartmentItem.item}</StyledTableCell>
                <StyledTableCell>{masterDepartmentItem.purchaseUnit}</StyledTableCell>
                <StyledTableCell>{masterDepartmentItem.partNumber}</StyledTableCell>
                <StyledTableCell>{masterDepartmentItem.recentCN}</StyledTableCell>
                <StyledTableCell>{masterDepartmentItem.recentVendor}</StyledTableCell>
                <StyledTableCell>{masterDepartmentItem.drugClass}</StyledTableCell>
                <StyledTableCell sx={{ textAlign: 'center' }}>
                    <Typography variant="inherit" sx={{ fontWeight: 900 }}>
                        {masterDepartmentItem.orderDetail && masterDepartmentItem.orderDetail.totalQuantity}
                    </Typography>
                </StyledTableCell>
                <StyledTableCell
                    align="center"
                    sx={{
                        backgroundColor: getOrderQuantityColor(masterDepartmentItem)
                    }}>
                    {masterDepartmentItem.orderDetail && masterDepartmentItem.orderDetail.orderQuantity}
                </StyledTableCell>
                <StyledTableCell>${masterDepartmentItem.unitPrice}</StyledTableCell>
                <StyledTableCell>
                    ${masterDepartmentItem.orderDetail && masterDepartmentItem.orderDetail.totalPrice}
                </StyledTableCell>
                <StyledTableCell>{masterDepartmentItem.comment}</StyledTableCell>
                <StyledTableCell>{masterDepartmentItem.category}</StyledTableCell>
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
                                            <StyledSubTableCell align="left">Min Qty</StyledSubTableCell>
                                            <StyledSubTableCell align="left">Max Qty</StyledSubTableCell>
                                            <StyledSubTableCell align="left">Usage Level</StyledSubTableCell>
                                            <StyledSubTableCell>Qty</StyledSubTableCell>
                                            <StyledSubTableCell align="left">Lot #</StyledSubTableCell>
                                            <StyledSubTableCell align="left">Expiration Date</StyledSubTableCell>
                                            <StyledSubTableCell align="left">Received Date</StyledSubTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {masterDepartmentItem.departmentItems.map((departmentItem) => (
                                            <TableRow key={departmentItem.location} hover>
                                                <StyledSubTableCell>
                                                    <TextField
                                                        className={'location' + departmentItem.id.toString()}
                                                        ref={(ref) => (inputRef.current.location = ref)}
                                                        id={'location' + departmentItem.id.toString()}
                                                        size="small"
                                                        name="location"
                                                        defaultValue={
                                                            departmentItem.location === null
                                                                ? ''
                                                                : departmentItem.location
                                                        }
                                                        sx={{
                                                            '.MuiInputBase-input': {
                                                                padding: 1,
                                                                fontSize: 11,
                                                                width: 300
                                                            }
                                                        }}
                                                        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) =>
                                                            handleEnterKey(
                                                                event,
                                                                departmentItem,
                                                                inputRef.current.location
                                                            )
                                                        }
                                                    />
                                                </StyledSubTableCell>
                                                <StyledSubTableCell align="left">
                                                    <TextField
                                                        id="minimumQuantity"
                                                        ref={(ref) => (inputRef.current.minimumQuantity = ref)}
                                                        size="small"
                                                        type="number"
                                                        InputProps={{
                                                            inputProps: { min: 0 }
                                                        }}
                                                        name="minimumQuantity"
                                                        defaultValue={departmentItem.minimumQuantity}
                                                        sx={{
                                                            '.MuiInputBase-input': {
                                                                padding: 1,
                                                                fontSize: 11
                                                            }
                                                        }}
                                                        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) =>
                                                            handleEnterKey(
                                                                event,
                                                                departmentItem,
                                                                inputRef.current.minimumQuantity
                                                            )
                                                        }
                                                    />
                                                </StyledSubTableCell>
                                                <StyledSubTableCell align="left">
                                                    <TextField
                                                        id="maximumQuantity"
                                                        ref={(ref) => (inputRef.current.maximumQuantity = ref)}
                                                        size="small"
                                                        type="number"
                                                        InputProps={{
                                                            inputProps: { min: 0 }
                                                        }}
                                                        name="maximumQuantity"
                                                        sx={{
                                                            '.MuiInputBase-input': {
                                                                padding: 1,
                                                                fontWeight: 400,
                                                                fontSize: 11
                                                            }
                                                        }}
                                                        defaultValue={departmentItem.maximumQuantity}
                                                        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) =>
                                                            handleEnterKey(
                                                                event,
                                                                departmentItem,
                                                                inputRef.current.maximumQuantity
                                                            )
                                                        }
                                                    />
                                                </StyledSubTableCell>
                                                <StyledSubTableCell align="left">
                                                    <TextField
                                                        id="usageLevel"
                                                        ref={(ref) => (inputRef.current.usageLevel = ref)}
                                                        name="usageLevel"
                                                        sx={{
                                                            '.MuiInputBase-input': {
                                                                padding: 1,
                                                                fontWeight: 400,
                                                                fontSize: 11,
                                                                width: 250
                                                            }
                                                        }}
                                                        InputProps={{
                                                            inputProps: { min: 0 }
                                                        }}
                                                        size="small"
                                                        defaultValue={departmentItem.usageLevel}
                                                        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) =>
                                                            handleEnterKey(
                                                                event,
                                                                departmentItem,
                                                                inputRef.current.usageLevel
                                                            )
                                                        }
                                                    />
                                                </StyledSubTableCell>
                                                <StyledSubTableCell align="left">
                                                    <TextField
                                                        id="quantity"
                                                        ref={(ref) => (inputRef.current.quantity = ref)}
                                                        type="number"
                                                        name="quantity"
                                                        sx={{
                                                            '.MuiInputBase-input': {
                                                                padding: 1,
                                                                fontWeight: 400,
                                                                fontSize: 11
                                                            }
                                                        }}
                                                        InputProps={{
                                                            inputProps: { min: 0 }
                                                        }}
                                                        size="small"
                                                        defaultValue={departmentItem.quantity}
                                                        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) =>
                                                            handleEnterKey(
                                                                event,
                                                                departmentItem,
                                                                inputRef.current.quantity
                                                            )
                                                        }
                                                    />
                                                </StyledSubTableCell>
                                                <StyledSubTableCell align="left">
                                                    <TextField
                                                        id="lotNumber"
                                                        ref={(ref) => (inputRef.current.lotNumber = ref)}
                                                        size="small"
                                                        name="lotNumber"
                                                        defaultValue={
                                                            departmentItem.lotNumber === null
                                                                ? ''
                                                                : departmentItem.lotNumber
                                                        }
                                                        sx={{
                                                            '.MuiInputBase-input': {
                                                                padding: 1,
                                                                fontSize: 11
                                                            }
                                                        }}
                                                        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) =>
                                                            handleEnterKey(
                                                                event,
                                                                departmentItem,
                                                                inputRef.current.lotNumber
                                                            )
                                                        }
                                                    />
                                                </StyledSubTableCell>
                                                <StyledSubTableCell align="left">
                                                    <LocalizationProvider dateAdapter={AdapterMoment}>
                                                        <DateTimePicker
                                                            ref={(ref) => (inputRef.current.expirationDate = ref)}
                                                            value={departmentItem.expirationDate}
                                                            onChange={(value: Date | null) =>
                                                                handleDateChange(
                                                                    value,
                                                                    departmentItem,
                                                                    'expirationDate'
                                                                )
                                                            }
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    sx={{
                                                                        '.MuiInputBase-input': {
                                                                            padding: 1,
                                                                            fontSize: 11,
                                                                            width: 200
                                                                        }
                                                                    }}
                                                                />
                                                            )}
                                                            onClose={() => handleDatePickerClose(departmentItem)}
                                                        />
                                                    </LocalizationProvider>
                                                </StyledSubTableCell>
                                                <StyledSubTableCell align="left">
                                                    <LocalizationProvider dateAdapter={AdapterMoment}>
                                                        <DateTimePicker
                                                            inputRef={(ref) => (inputRef.current.receivedDate = ref)}
                                                            value={departmentItem.receivedDate}
                                                            onChange={(value: Date | null) =>
                                                                handleDateChange(value, departmentItem, 'receivedDate')
                                                            }
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    sx={{
                                                                        '.MuiInputBase-input': {
                                                                            padding: 1,
                                                                            fontSize: 11,
                                                                            width: 200
                                                                        }
                                                                    }}
                                                                />
                                                            )}
                                                            onClose={() => handleDatePickerClose(departmentItem)}
                                                        />
                                                    </LocalizationProvider>
                                                </StyledSubTableCell>
                                            </TableRow>
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
            </TableRow>
        </TableHead>
    );
};

const DepartmentsMaster = () => {
    const masterDepartmentItemsSelector = useAppSelector(selectMasterDepartmentItems);
    const [page, setPage] = useState<number>(0);
    const dispatch = useAppDispatch();
    const location = useLocation();
    const [openRows, setOpenRows] = useState<number[]>([]);
    const [sort, setSort] = useState<{ column: string; direction: '' | 'ASC' | 'DESC' }>({ column: '', direction: '' });
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [value, setValue] = useState<number>(0);
    const { state } = useLocation();
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof IMaster | keyof IOrderDetail>('id');

    useEffect(() => {
        dispatch(
            getMasterDepartmentItemsThunk({
                state: location.state,
                page: page
            })
        );
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

    const handleSort = (field: string) => {
        if (sort.direction === '') {
            setSort({ column: field, direction: 'ASC' });
            dispatch(
                sortMasterDepartmentItemsThunk({ state: location.state, page: page, column: field, direction: 'ASC' })
            );
        }
        if (sort.direction === 'ASC') {
            setSort({ column: field, direction: 'DESC' });
            dispatch(
                sortMasterDepartmentItemsThunk({ state: location.state, page: page, column: field, direction: 'DESC' })
            );
        }
        if (sort.direction === 'DESC') {
            setSort({ column: field, direction: '' });
            dispatch(
                sortMasterDepartmentItemsThunk({ state: location.state, page: page, column: field, direction: '' })
            );
        }
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
        dispatch(filterMasterDepartmentItemsThunk({ state: location.state, keyword: event.target.value, page: 0 }));
    };

    const handleAddClick = () => {
        dispatch(
            toggleDrawer({
                type: DRAWER_TOGGLE_TYPE.ADD_MASTER_ITEM
            })
        );
    };

    const handleRequestSort = (event: MouseEvent<unknown>, property: keyof IMaster | keyof IOrderDetail) => {
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
                                <BottomNavigationAction
                                    label="Review"
                                    onClick={handleReviewClick}
                                    icon={<PreviewIcon color="primary" sx={{ fontSize: 40 }} />}
                                />
                                {(location.pathname === '/general-request/confirmation' ||
                                    location.pathname === '/office-supply-request/confirmation' ||
                                    location.pathname === '/store-room-request/confirmation') && (
                                    <BottomNavigationAction
                                        label="Send"
                                        onClick={handleEditClick}
                                        icon={<EditIcon color="primary" sx={{ fontSize: 40 }} />}
                                    />
                                )}
                                <BottomNavigationAction label="Send" onClick={handleEditClick} icon={<SendIcon />} />
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

export default DepartmentsMaster;

// const handleQuantityChange = (
//     event: ChangeEvent<HTMLInputElement>,
//     masterDepartmentItemId: number | undefined,
//     departmentItemId: number
// ) => {
//     dispatch(
//         changeMasterDepartmentItems(
//             masterDepartmentItemsSelector.response.content.map((masterDepartmentItem) => ({
//                 ...masterDepartmentItem,
//                 departmentItems:
//                     masterDepartmentItem.id === masterDepartmentItemId
//                         ? masterDepartmentItem.departmentItems.map((departmentItem) => ({
//                               ...departmentItem,
//                               quantity:
//                                   departmentItem.id === departmentItemId
//                                       ? parseInt(event.target.value)
//                                       : departmentItem.quantity
//                           }))
//                         : masterDepartmentItem.departmentItems
//             }))
//         )
//     );
// };

// const handleLotNumberChange = (
//     event: ChangeEvent<HTMLInputElement>,
//     masterDepartmentItemId: number | undefined,
//     departmentItemId: number
// ) => {
//     dispatch(
//         changeMasterDepartmentItems(
//             masterDepartmentItemsSelector.response.content.map((masterDepartmentItem) => ({
//                 ...masterDepartmentItem,
//                 departmentItems:
//                     masterDepartmentItem.id === masterDepartmentItemId
//                         ? masterDepartmentItem.departmentItems.map((departmentItem) => ({
//                               ...departmentItem,
//                               lotNumber:
//                                   departmentItem.id === departmentItemId ? event.target.value : departmentItem.lotNumber
//                           }))
//                         : masterDepartmentItem.departmentItems
//             }))
//         )
//     );
// };

// const handleLocationChange = (
//     event: ChangeEvent<HTMLInputElement>,
//     masterDepartmentItemId: number | undefined,
//     departmentItemId: number
// ) => {
//     dispatch(
//         changeMasterDepartmentItems(
//             masterDepartmentItemsSelector.response.content.map((masterDepartmentItem) => ({
//                 ...masterDepartmentItem,
//                 departmentItems:
//                     masterDepartmentItem.id === masterDepartmentItemId
//                         ? masterDepartmentItem.departmentItems.map((departmentItem) => ({
//                               ...departmentItem,
//                               location:
//                                   departmentItem.id === departmentItemId ? event.target.value : departmentItem.location
//                           }))
//                         : masterDepartmentItem.departmentItems
//             }))
//         )
//     );
// };
// const handleMinimumQtyChange = (
//     event: ChangeEvent<HTMLInputElement>,
//     masterDepartmentItemId: number | undefined,
//     departmentItemId: number
// ) => {
//     dispatch(changeMasterDepartmentItems([...masterDepartmentItemsSelector.response.content]));
//     dispatch(
//         changeMasterDepartmentItems(
//             masterDepartmentItemsSelector.response.content.map((masterDepartmentItem) => ({
//                 ...masterDepartmentItem,
//                 departmentItems:
//                     masterDepartmentItem.id === masterDepartmentItemId
//                         ? masterDepartmentItem.departmentItems.map((departmentItem) => ({
//                               ...departmentItem,
//                               minimumQuantity:
//                                   departmentItem.id === departmentItemId
//                                       ? event.target.value
//                                       : departmentItem.location
//                           }))
//                         : masterDepartmentItem.departmentItems
//             }))
//         )
//     );
// };
// const handleMaximumQtyChange = (
//     event: ChangeEvent<HTMLInputElement>,
//     masterDepartmentItemId: number | undefined,
//     departmentItemId: number
// ) => {
// dispatch(
//     changeMasterDepartmentItems(
//         masterDepartmentItemsSelector.response.content.map((masterDepartmentItem) => ({
//             ...masterDepartmentItem,
//             departmentItems:
//                 masterDepartmentItem.id === masterDepartmentItemId
//                     ? masterDepartmentItem.departmentItems.map((departmentItem) => ({
//                           ...departmentItem,
//                           maximumQuantity:
//                               departmentItem.id === departmentItemId
//                                   ? event.target.value
//                                   : departmentItem.location
//                       }))
//                     : masterDepartmentItem.departmentItems
//         }))
//     )
// );
// };
// const handleUsageLevelChange = (
//     event: ChangeEvent<HTMLInputElement>,
//     masterDepartmentItemId: number | undefined,
//     departmentItemId: number
// ) => {
//     dispatch(
//         changeMasterDepartmentItems(
//             masterDepartmentItemsSelector.response.content.map((masterDepartmentItem) => ({
//                 ...masterDepartmentItem,
//                 departmentItems:
//                     masterDepartmentItem.id === masterDepartmentItemId
//                         ? masterDepartmentItem.departmentItems.map((departmentItem) => ({
//                               ...departmentItem,
//                               usageLevel:
//                                   departmentItem.id === departmentItemId
//                                       ? event.target.value
//                                       : departmentItem.usageLevel
//                           }))
//                         : masterDepartmentItem.departmentItems
//             }))
//         )
//     );
// };

// const handleExpirationDateChange = (
//     value: Date | null,
//     masterDepartmentItemId: number | undefined,
//     departmentItemId: number
// ) => {
//     dispatch(
//         changeMasterDepartmentItems(
//             masterDepartmentItemsSelector.response.content.map((masterDepartmentItem) => ({
//                 ...masterDepartmentItem,
//                 departmentItems:
//                     masterDepartmentItem.id === masterDepartmentItemId
//                         ? masterDepartmentItem.departmentItems.map((departmentItem) => ({
//                               ...departmentItem,
//                               expirationDate:
//                                   departmentItem.id === departmentItemId ? value : departmentItem.expirationDate
//                           }))
//                         : masterDepartmentItem.departmentItems
//             }))
//         )
//     );
// };

// const handleReceivedDateChange = (
//     value: Date | null,
//     masterDepartmentItemId: number | undefined,
//     departmentItemId: number
// ) => {
// dispatch(
//     changeMasterDepartmentItems(
//         masterDepartmentItemsSelector.response.content.map((masterDepartmentItem) => ({
//             ...masterDepartmentItem,
//             departmentItems:
//                 masterDepartmentItem.id === masterDepartmentItemId
//                     ? masterDepartmentItem.departmentItems.map((departmentItem) => ({
//                           ...departmentItem,
//                           receivedDate:
//                               departmentItem.id === departmentItemId ? value : departmentItem.receivedDate
//                       }))
//                     : masterDepartmentItem.departmentItems
//         }))
//     )
// );
// };
