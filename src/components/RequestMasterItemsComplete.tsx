import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    styled,
    tableCellClasses
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import moment from 'moment';
import { useLocation } from 'react-router-dom';
import {
    getRequestMasterItemsCompleteThunk,
    selectRequestMasterItemsComplete
} from '../app/slice/request/requestMasterItemsCompleteSlice';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#ffd740',
        fontSize: 14,
        color: theme.palette.common.black
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 13
    }
}));

const columns: { field: string; headerName: string | JSX.Element }[] = [
    { field: 'item', headerName: 'Item' },
    { field: 'recentCN', headerName: 'Recent CN' },
    { field: 'orderQuantity', headerName: 'Order Quantity' },
    { field: 'status', headerName: 'Status' },
    { field: 'timeReceived', headerName: 'Received Date' },
    { field: 'timeUpdated', headerName: 'Updated Date' },
    { field: 'detail', headerName: 'Detail' }
];

const RequestMasterDepartmentComplete = () => {
    const requestMasterItemsCompleteSelector = useAppSelector(selectRequestMasterItemsComplete);
    const dispatch = useAppDispatch();
    const [page, setPage] = useState<number>(0);

    const location = useLocation();

    useEffect(() => {
        dispatch(
            getRequestMasterItemsCompleteThunk({
                state: location.state,
                page
            })
        );
    }, [dispatch, location.state, page]);

    const handleChangePage = (event: any, page: number): void => {
        setPage(page);
    };

    return (
        <Box component={Paper} elevation={3}>
            <TableContainer sx={{ height: '60vh' }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow sx={{ height: 50 }}>
                            {columns.length > 0 &&
                                columns.map((column) => (
                                    <StyledTableCell key={column.field}>{column.headerName}</StyledTableCell>
                                ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requestMasterItemsCompleteSelector.response.content.length > 0 &&
                            requestMasterItemsCompleteSelector.response.content.map((requestItem, index) => (
                                <TableRow key={index}>
                                    <StyledTableCell>{requestItem && requestItem.item}</StyledTableCell>
                                    <StyledTableCell>{requestItem && requestItem.recentCN}</StyledTableCell>
                                    <StyledTableCell>{requestItem.quantity}</StyledTableCell>
                                    <StyledTableCell>{requestItem.status}</StyledTableCell>
                                    <StyledTableCell>
                                        {moment(requestItem.timeRequested).format('MM/DD/YYYY')}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {moment(requestItem.timeUpdated).format('MM/DD/YYYY')}
                                    </StyledTableCell>
                                    <StyledTableCell>{requestItem.detail}</StyledTableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                sx={{ marginTop: 3 }}
                rowsPerPageOptions={[]}
                component="div"
                count={requestMasterItemsCompleteSelector.response.totalElements}
                rowsPerPage={requestMasterItemsCompleteSelector.response.size}
                page={requestMasterItemsCompleteSelector.response.number}
                onPageChange={handleChangePage}
                showFirstButton={true}
                showLastButton={true}
            />
        </Box>
    );
};

export default RequestMasterDepartmentComplete;
