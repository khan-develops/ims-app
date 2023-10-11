import {
    Box,
    FormControl,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    styled,
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import { KeyboardEvent, ChangeEvent, useEffect, useState } from 'react';
import moment from 'moment';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { STATUS } from '../common/constants';
import { updateRequestMasterItemThunk } from '../app/slice/request/requestMasterItemUpdateSlice';
import {
    changeRequestMasterItems,
    getRequestMasterItemsThunk,
    selectRequestMasterItems
} from '../app/slice/request/requestMasterItemsSlice';
import { IRequestMaster } from '../app/api/properties/IRequest';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#ffd740',
        fontSize: 13,
        fontWeight: 700,
        color: theme.palette.common.black
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 12
    }
}));

const columns: { field: string; headerName: string | JSX.Element }[] = [
    { field: 'item', headerName: 'Item' },
    { field: 'recentCN', headerName: 'Recent CN' },
    { field: 'quantity', headerName: 'Quantity' },
    { field: 'status', headerName: 'Status' },
    { field: 'time_revieved', headerName: 'Received Date' },
    { field: 'time_updated', headerName: 'Updated Date' },
    { field: 'department', headerName: 'Department' },
    { field: 'custom_text', headerName: 'Customer Text' },
    { field: 'detail', headerName: 'Detail' }
];

const RequestMasterAdmin = () => {
    const requestMasterItemsSelector = useAppSelector(selectRequestMasterItems);
    const dispatch = useAppDispatch();
    const [page, setPage] = useState<number>(0);
    const location = useLocation();

    useEffect(() => {
        dispatch(getRequestMasterItemsThunk({ state: location.state, page: page }));
    }, [dispatch, location.pathname, location.state, page]);

    const handleChangePage = (event: any, page: number): void => {
        setPage(page);
    };

    const handleStatusChange = (event: SelectChangeEvent, id: number) => {
        dispatch(
            changeRequestMasterItems(
                requestMasterItemsSelector.response.content.map((item) => ({
                    ...item,
                    status: item.id === id ? event.target.value : item.status
                }))
            )
        );
    };

    const handleDetailChange = (event: ChangeEvent<HTMLInputElement>, id: number) => {
        dispatch(
            changeRequestMasterItems(
                requestMasterItemsSelector.response.content.map((item) => ({
                    ...item,
                    detail: item.id === id ? event.target.value : item.detail
                }))
            )
        );
    };

    const handleEnterKey = (event: KeyboardEvent, requestMasterItem: IRequestMaster) => {
        dispatch(
            updateRequestMasterItemThunk({
                state: location.state,
                id: requestMasterItem.id,
                requestMasterItem: requestMasterItem
            })
        );
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }} component={Paper} elevation={3}>
            <TableContainer sx={{ height: '70vh' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ height: 50 }}>
                            {columns.length > 0 &&
                                columns.map((column) => (
                                    <StyledTableCell
                                        key={column.field}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <Box>{column.headerName}</Box>
                                    </StyledTableCell>
                                ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requestMasterItemsSelector.response.content.length > 0 &&
                            requestMasterItemsSelector.response.content.map((requestMasterItem, index) => (
                                <TableRow key={index}>
                                    <StyledTableCell>
                                        {requestMasterItem.item && requestMasterItem.item}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {requestMasterItem.recentCN && requestMasterItem.recentCN}
                                    </StyledTableCell>
                                    <StyledTableCell>{requestMasterItem.quantity}</StyledTableCell>
                                    <StyledTableCell>
                                        <FormControl fullWidth>
                                            <Select
                                                size="small"
                                                id={requestMasterItem.item}
                                                value={requestMasterItem.status}
                                                onChange={(event: SelectChangeEvent) =>
                                                    handleStatusChange(event, requestMasterItem.id)
                                                }>
                                                {Object.values(STATUS).map((status, index) => (
                                                    <MenuItem key={index} value={status}>
                                                        <Typography sx={{ fontSize: '10pt' }}>{status}</Typography>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {moment(requestMasterItem.timeRequested).format('MM/DD/YYYY')}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {moment(requestMasterItem.timeUpdated).format('MM/DD/YYYY')}
                                    </StyledTableCell>
                                    <StyledTableCell>{requestMasterItem.department}</StyledTableCell>
                                    <StyledTableCell>{requestMasterItem.customText}</StyledTableCell>
                                    <StyledTableCell>
                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            value={requestMasterItem.detail}
                                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                                handleDetailChange(event, requestMasterItem.id)
                                            }
                                            onKeyDown={(event: KeyboardEvent) =>
                                                handleEnterKey(event, requestMasterItem)
                                            }
                                        />
                                    </StyledTableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                sx={{ marginTop: 3 }}
                rowsPerPageOptions={[]}
                component="div"
                count={requestMasterItemsSelector.response.totalElements}
                rowsPerPage={requestMasterItemsSelector.response.size}
                page={requestMasterItemsSelector.response.number}
                onPageChange={handleChangePage}
                showFirstButton={true}
                showLastButton={true}
            />
        </Box>
    );
};

export default RequestMasterAdmin;
