import { ChangeEvent, Fragment, useRef, KeyboardEvent, useState } from 'react';
import { useEffect } from 'react';
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
    IconButton
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { handlePage } from '../app/common/pageSlice';
import {
    changeMasterDepartmentItems,
    getMasterDepartmentItemsThunk,
    selectMasterDepartmentItems,
    sortMasterDepartmentItemsThunk
} from '../app/slice/master/masterDepartmentItemsSlice';
import { IDepartment } from '../app/api/properties/IDepartment';
import { updateDepartmentItemThunk } from '../app/slice/department/departmentItemUpdateSlice';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { IMaster, IMasterDepartment } from '../app/api/properties/IMaster';

const columns: {
    field: string;
    tooltipName: string | JSX.Element;
    headerName: string;
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
        field: 'recentVendor',
        tooltipName: 'Recent Vendor',
        headerName: 'RV',
        align: 'left'
    },
    {
        field: 'drugClass',
        tooltipName: 'Drug Class',
        headerName: 'DC',
        align: 'left'
    },
    {
        field: 'totalQuantity',
        tooltipName: 'Total Qty',
        headerName: 'TQ',
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
    {
        field: 'totalPrice',
        tooltipName: 'Total Price',
        headerName: 'TP',
        align: 'left'
    },
    {
        field: 'comment',
        tooltipName: 'Comment',
        headerName: 'Comment',
        align: 'left'
    },
    {
        field: 'category',
        tooltipName: 'Category',
        headerName: 'C',
        align: 'left'
    }
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#ffd740',
        fontSize: 11,
        fontWeight: 600,
        color: theme.palette.common.black
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 11,
        fontWeight: 400
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

const Row = ({
    open,
    masterDepartmentItem,
    handleExpandRow
}: {
    open: number[];
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

    const handleEnterKey = (
        event: KeyboardEvent<HTMLDivElement>,
        departmentItem: IDepartment,
        ref: HTMLDivElement | null
    ) => {
        if (event.key === 'Enter') {
            inputRef.current.location = ref;
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

    const handleQuantityChange = (
        event: ChangeEvent<HTMLInputElement>,
        masterDepartmentItemId: number | undefined,
        departmentItemId: number
    ) => {
        dispatch(
            changeMasterDepartmentItems(
                masterDepartmentItemsSelector.response.content.map((masterDepartmentItem) => ({
                    ...masterDepartmentItem,
                    departmentItems:
                        masterDepartmentItem.id === masterDepartmentItemId
                            ? masterDepartmentItem.departmentItems.map((departmentItem) => ({
                                  ...departmentItem,
                                  quantity:
                                      departmentItem.id === departmentItemId
                                          ? parseInt(event.target.value)
                                          : departmentItem.quantity
                              }))
                            : masterDepartmentItem.departmentItems
                }))
            )
        );
    };

    const handleLotNumberChange = (
        event: ChangeEvent<HTMLInputElement>,
        masterDepartmentItemId: number | undefined,
        departmentItemId: number
    ) => {
        dispatch(
            changeMasterDepartmentItems(
                masterDepartmentItemsSelector.response.content.map((masterDepartmentItem) => ({
                    ...masterDepartmentItem,
                    departmentItems:
                        masterDepartmentItem.id === masterDepartmentItemId
                            ? masterDepartmentItem.departmentItems.map((departmentItem) => ({
                                  ...departmentItem,
                                  lotNumber:
                                      departmentItem.id === departmentItemId
                                          ? event.target.value
                                          : departmentItem.lotNumber
                              }))
                            : masterDepartmentItem.departmentItems
                }))
            )
        );
    };

    const handleLocationChange = (
        event: ChangeEvent<HTMLInputElement>,
        masterDepartmentItemId: number | undefined,
        departmentItemId: number
    ) => {
        dispatch(
            changeMasterDepartmentItems(
                masterDepartmentItemsSelector.response.content.map((masterDepartmentItem) => ({
                    ...masterDepartmentItem,
                    departmentItems:
                        masterDepartmentItem.id === masterDepartmentItemId
                            ? masterDepartmentItem.departmentItems.map((departmentItem) => ({
                                  ...departmentItem,
                                  location:
                                      departmentItem.id === departmentItemId
                                          ? event.target.value
                                          : departmentItem.location
                              }))
                            : masterDepartmentItem.departmentItems
                }))
            )
        );
    };
    const handleMinimumQtyChange = (
        event: ChangeEvent<HTMLInputElement>,
        masterDepartmentItemId: number | undefined,
        departmentItemId: number
    ) => {
        dispatch(
            changeMasterDepartmentItems(
                masterDepartmentItemsSelector.response.content.map((masterDepartmentItem) => ({
                    ...masterDepartmentItem,
                    departmentItems:
                        masterDepartmentItem.id === masterDepartmentItemId
                            ? masterDepartmentItem.departmentItems.map((departmentItem) => ({
                                  ...departmentItem,
                                  minimumQuantity:
                                      departmentItem.id === departmentItemId
                                          ? event.target.value
                                          : departmentItem.location
                              }))
                            : masterDepartmentItem.departmentItems
                }))
            )
        );
    };
    const handleMaximumQtyChange = (
        event: ChangeEvent<HTMLInputElement>,
        masterDepartmentItemId: number | undefined,
        departmentItemId: number
    ) => {
        dispatch(
            changeMasterDepartmentItems(
                masterDepartmentItemsSelector.response.content.map((masterDepartmentItem) => ({
                    ...masterDepartmentItem,
                    departmentItems:
                        masterDepartmentItem.id === masterDepartmentItemId
                            ? masterDepartmentItem.departmentItems.map((departmentItem) => ({
                                  ...departmentItem,
                                  maximumQuantity:
                                      departmentItem.id === departmentItemId
                                          ? event.target.value
                                          : departmentItem.location
                              }))
                            : masterDepartmentItem.departmentItems
                }))
            )
        );
    };
    const handleUsageLevelChange = (
        event: ChangeEvent<HTMLInputElement>,
        masterDepartmentItemId: number | undefined,
        departmentItemId: number
    ) => {
        dispatch(
            changeMasterDepartmentItems(
                masterDepartmentItemsSelector.response.content.map((masterDepartmentItem) => ({
                    ...masterDepartmentItem,
                    departmentItems:
                        masterDepartmentItem.id === masterDepartmentItemId
                            ? masterDepartmentItem.departmentItems.map((departmentItem) => ({
                                  ...departmentItem,
                                  usageLevel:
                                      departmentItem.id === departmentItemId
                                          ? event.target.value
                                          : departmentItem.usageLevel
                              }))
                            : masterDepartmentItem.departmentItems
                }))
            )
        );
    };

    const handleExpirationDateChange = (
        value: Date | null,
        masterDepartmentItemId: number | undefined,
        departmentItemId: number
    ) => {
        dispatch(
            changeMasterDepartmentItems(
                masterDepartmentItemsSelector.response.content.map((masterDepartmentItem) => ({
                    ...masterDepartmentItem,
                    departmentItems:
                        masterDepartmentItem.id === masterDepartmentItemId
                            ? masterDepartmentItem.departmentItems.map((departmentItem) => ({
                                  ...departmentItem,
                                  expirationDate:
                                      departmentItem.id === departmentItemId ? value : departmentItem.expirationDate
                              }))
                            : masterDepartmentItem.departmentItems
                }))
            )
        );
    };

    const handleReceivedDateChange = (
        value: Date | null,
        masterDepartmentItemId: number | undefined,
        departmentItemId: number
    ) => {
        dispatch(
            changeMasterDepartmentItems(
                masterDepartmentItemsSelector.response.content.map((masterDepartmentItem) => ({
                    ...masterDepartmentItem,
                    departmentItems:
                        masterDepartmentItem.id === masterDepartmentItemId
                            ? masterDepartmentItem.departmentItems.map((departmentItem) => ({
                                  ...departmentItem,
                                  receivedDate:
                                      departmentItem.id === departmentItemId ? value : departmentItem.receivedDate
                              }))
                            : masterDepartmentItem.departmentItems
                }))
            )
        );
    };

    const handleClose = (departmentItem: IDepartment) => {
        dispatch(
            updateDepartmentItemThunk({
                state: location.state,
                departmentItem: departmentItem
            })
        );
    };

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

    return (
        <Fragment>
            <StyledTableRow hover sx={{ height: 45 }}>
                <TableCell width={1}>
                    <IconButton
                        aria-label="expand-row"
                        sx={{ fontSize: 8 }}
                        onClick={() => handleExpandRow(masterDepartmentItem)}>
                        {masterDepartmentItemsSelector.response.content.every((masterDepartmentItem, index) =>
                            open.includes(masterDepartmentItem.id)
                        ) ? (
                            <KeyboardArrowUpIcon fontSize="medium" />
                        ) : (
                            <KeyboardArrowDownIcon fontSize="medium" />
                        )}
                    </IconButton>
                </TableCell>
                <StyledTableCell width={400}>{masterDepartmentItem.item}</StyledTableCell>
                <StyledTableCell width={120}>{masterDepartmentItem.purchaseUnit}</StyledTableCell>
                <StyledTableCell>{masterDepartmentItem.partNumber}</StyledTableCell>
                <StyledTableCell>{masterDepartmentItem.recentCN}</StyledTableCell>
                <StyledTableCell width={200}>{masterDepartmentItem.recentVendor}</StyledTableCell>
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
                <StyledTableCell>${masterDepartmentItem.orderDetail && masterDepartmentItem.orderDetail.totalPrice}</StyledTableCell>
                <StyledTableCell width={200}>{masterDepartmentItem.comment}</StyledTableCell>
                <StyledTableCell width={80}>{masterDepartmentItem.category}</StyledTableCell>
            </StyledTableRow>
            {open.find((id) => id === masterDepartmentItem.id) && (
                <TableRow>
                    <TableCell colSpan={13}>
                        <Collapse in={open.includes(masterDepartmentItem.id)} timeout="auto" unmountOnExit>
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
                                                        id={'location' + departmentItem.id.toString()}
                                                        ref={(ref) => (inputRef.current.location = ref)}
                                                        size="small"
                                                        name="location"
                                                        value={
                                                            departmentItem.location === null
                                                                ? ''
                                                                : departmentItem.location
                                                        }
                                                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                                            handleLocationChange(
                                                                event,
                                                                masterDepartmentItem.id,
                                                                departmentItem.id
                                                            )
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
                                                        value={departmentItem.minimumQuantity}
                                                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                                            handleMinimumQtyChange(
                                                                event,
                                                                masterDepartmentItem.id,
                                                                departmentItem.id
                                                            )
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
                                                        value={departmentItem.maximumQuantity}
                                                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                                            handleMaximumQtyChange(
                                                                event,
                                                                masterDepartmentItem.id,
                                                                departmentItem.id
                                                            )
                                                        }
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
                                                        value={departmentItem.usageLevel}
                                                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                                            handleUsageLevelChange(
                                                                event,
                                                                masterDepartmentItem.id,
                                                                departmentItem.id
                                                            )
                                                        }
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
                                                        value={departmentItem.quantity}
                                                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                                            handleQuantityChange(
                                                                event,
                                                                masterDepartmentItem.id,
                                                                departmentItem.id
                                                            )
                                                        }
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
                                                        value={
                                                            departmentItem.lotNumber === null
                                                                ? ''
                                                                : departmentItem.lotNumber
                                                        }
                                                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                                            handleLotNumberChange(
                                                                event,
                                                                masterDepartmentItem.id,
                                                                departmentItem.id
                                                            )
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
                                                                handleExpirationDateChange(
                                                                    value,
                                                                    masterDepartmentItem.id,
                                                                    departmentItem.id
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
                                                            onClose={() => handleClose(departmentItem)}
                                                        />
                                                    </LocalizationProvider>
                                                </StyledSubTableCell>
                                                <StyledSubTableCell align="left">
                                                    <LocalizationProvider dateAdapter={AdapterMoment}>
                                                        <DateTimePicker
                                                            inputRef={(ref) => (inputRef.current.receivedDate = ref)}
                                                            value={departmentItem.receivedDate}
                                                            onChange={(value: Date | null) =>
                                                                handleReceivedDateChange(
                                                                    value,
                                                                    masterDepartmentItem.id,
                                                                    departmentItem.id
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
                                                            onClose={() => handleClose(departmentItem)}
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

const DepartmentsMaster = () => {
    const masterDepartmentItemsSelector = useAppSelector(selectMasterDepartmentItems);
    const [page, setPage] = useState<number>(0);
    const dispatch = useAppDispatch();
    const location = useLocation();
    const [open, setOpen] = useState<number[]>([]);
    const [sort, setSort] = useState<{ column: string; direction: '' | 'ASC' | 'DESC' }>({ column: '', direction: '' });
    const containerRef = useRef<HTMLDivElement | null>(null);

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

    const handleExpandAllRow = () => {
        if (masterDepartmentItemsSelector.response.content.length > 0) {
            if (open.length === 0) {
                setOpen(
                    masterDepartmentItemsSelector.response.content.reduce((result: number[], masterDepartmentItem) => {
                        if (masterDepartmentItem.id) {
                            result.push(masterDepartmentItem.id);
                        }
                        return result;
                    }, [])
                );
            } else {
                setOpen([]);
            }
        }
    };

    const handleExpandRow = (masterDepartmentItem: IMasterDepartment) => {
        if (open.includes(masterDepartmentItem.id)) {
            setOpen(open.filter((id) => id !== masterDepartmentItem.id));
        } else {
            setOpen([...open, masterDepartmentItem.id]);
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

    const SortIcon = (): JSX.Element => {
        if (sort.direction === 'ASC') {
            return <KeyboardArrowUpIcon fontSize="small" />;
        }
        if (sort.direction === 'DESC') {
            return <KeyboardArrowDownIcon fontSize="small" />;
        }
        return <></>;
    };

    return (
        <Box
            sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            component={Paper}
            elevation={3}
            ref={containerRef}>
            <TableContainer sx={{ height: '70vh' }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow sx={{ height: 50 }}>
                            <StyledTableCell align="left" width={1}>
                                <IconButton
                                    aria-label="expand-header"
                                    size="small"
                                    sx={{ fontSize: 2 }}
                                    onClick={handleExpandAllRow}>
                                    {masterDepartmentItemsSelector.response.content.every((masterDepartmentItem) =>
                                        open.includes(masterDepartmentItem.id)
                                    ) ? (
                                        <KeyboardArrowUpIcon fontSize="large" />
                                    ) : (
                                        <KeyboardArrowDownIcon fontSize="large" />
                                    )}
                                </IconButton>
                            </StyledTableCell>
                            {columns.length > 0 &&
                                columns.map((column, index) => (
                                    <Fragment key={index}>
                                        <StyledTableCell align={column.align} onClick={() => handleSort(column.field)}>
                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                {column.tooltipName}
                                                {sort.column === column.field && <SortIcon />}
                                            </Box>
                                        </StyledTableCell>
                                    </Fragment>
                                ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {masterDepartmentItemsSelector.response.content.length > 0 &&
                            masterDepartmentItemsSelector.response.content.map((masterDepartmentItem, index) => (
                                <Row
                                    key={index}
                                    open={open}
                                    masterDepartmentItem={masterDepartmentItem}
                                    handleExpandRow={handleExpandRow}
                                />
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                sx={{ marginTop: 'auto' }}
                rowsPerPageOptions={[]}
                component="div"
                count={masterDepartmentItemsSelector.response.totalElements}
                rowsPerPage={masterDepartmentItemsSelector.response.size}
                page={masterDepartmentItemsSelector?.response.number}
                onPageChange={handleChangePage}
                showFirstButton={true}
                showLastButton={true}
            />
        </Box>
    );
};

export default DepartmentsMaster;
