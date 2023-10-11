import {
    Box,
    Checkbox,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    styled,
    tableCellClasses
} from '@mui/material';
import { ChangeEvent, useEffect, useState, KeyboardEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useLocation } from 'react-router-dom';
import {
    changeRequestMasterItemsPending,
    getRequestMasterItemsPendingThunk,
    selectRequestMasterItemsPending
} from '../app/slice/request/requestMasterItemsPendingSlice';
import {
    changeRequestItemsPendingChecked,
    selectRequestMasterItemsPendingChecked
} from '../app/slice/request/requestMasterItemsPendingCheckedSlice';
import { updateRequestMasterItemThunk } from '../app/slice/request/requestMasterItemUpdateSlice';
import { IRequestMaster } from '../app/api/properties/IRequest';

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
    { field: '', headerName: 'Select' },
    { field: 'item', headerName: 'Item' },
    { field: 'recentCN', headerName: 'Recent CN' },
    { field: 'orderQuantity', headerName: 'Order Quantity' },
    { field: 'customText', headerName: 'Custom Text' },
    { field: 'detail', headerName: 'Detail' }
];

const RequestMasterDepartmentPending = () => {
    const requestMasterItemsPendingSelector = useAppSelector(selectRequestMasterItemsPending);
    const requestMasterItemsPendingCheckedSelector = useAppSelector(selectRequestMasterItemsPendingChecked);
    const dispatch = useAppDispatch();
    const [page, setPage] = useState<number>(0);

    const location = useLocation();

    useEffect(() => {
        dispatch(
            getRequestMasterItemsPendingThunk({
                state: location.state,
                page: page
            })
        );
    }, [dispatch, location.pathname, location.state, page]);

    const handleChangePage = (event: any, page: number): void => {
        setPage(page);
    };

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>, departmentMasterItem: IRequestMaster) => {
        const exists = requestMasterItemsPendingCheckedSelector.requestMasterItemsPendingChecked.some(
            (item) => item.id === departmentMasterItem.id
        );
        if (exists) {
            dispatch(
                changeRequestItemsPendingChecked(
                    requestMasterItemsPendingCheckedSelector.requestMasterItemsPendingChecked.filter(
                        (item) => item.id !== departmentMasterItem.id
                    )
                )
            );
        }
        if (!exists) {
            dispatch(
                changeRequestItemsPendingChecked([
                    ...requestMasterItemsPendingCheckedSelector.requestMasterItemsPendingChecked,
                    departmentMasterItem
                ])
            );
        }
    };

    const handleChangeQuantity = (event: ChangeEvent<HTMLInputElement>, id: number) => {
        dispatch(
            changeRequestMasterItemsPending({
                ...requestMasterItemsPendingSelector.response,
                content: requestMasterItemsPendingSelector.response.content.map((requestMasterItemPending) => ({
                    ...requestMasterItemPending,
                    quantity:
                        requestMasterItemPending.id === id
                            ? parseInt(event.target.value)
                            : requestMasterItemPending.quantity
                }))
            })
        );
    };

    const handleUpdateQuantity = (event: KeyboardEvent, requestMasterItem: IRequestMaster) => {
        if (event.key === 'Enter') {
            dispatch(
                updateRequestMasterItemThunk({
                    state: location.state,
                    id: requestMasterItem.id,
                    requestMasterItem: requestMasterItem
                })
            );
        }
    };

    const handleChangeCustomText = (event: ChangeEvent<HTMLInputElement>, id: number) => {
        dispatch(
            changeRequestMasterItemsPending({
                ...requestMasterItemsPendingSelector.response,
                content: requestMasterItemsPendingSelector.response.content.map((requestMasterItemPending) => ({
                    ...requestMasterItemPending,
                    custom_text:
                        requestMasterItemPending.id === id
                            ? parseInt(event.target.value)
                            : requestMasterItemPending.customText
                }))
            })
        );
    };

    const handleUpdateCustomText = (event: KeyboardEvent, requestMasterItem: IRequestMaster) => {
        if (event.key === 'Enter') {
            dispatch(
                updateRequestMasterItemThunk({
                    state: location.state,
                    id: requestMasterItem.id,
                    requestMasterItem: requestMasterItem
                })
            );
        }
    };

    return (
        <Box component={Paper} elevation={3}>
            <TableContainer sx={{ height: '60vh' }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow sx={{ height: 50 }}>
                            {columns.length > 0 &&
                                columns.map((column) => (
                                    <StyledTableCell key={column.field}>{column.headerName}</StyledTableCell>
                                ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requestMasterItemsPendingSelector.response.content.length > 0 &&
                            requestMasterItemsPendingSelector.response.content.map((requestMasterItem, index) => (
                                <TableRow key={index}>
                                    <StyledTableCell>
                                        <Checkbox
                                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                                handleCheckboxChange(event, requestMasterItem)
                                            }
                                            checked={
                                                requestMasterItemsPendingCheckedSelector.requestMasterItemsPendingChecked.find(
                                                    (item) => item.id === requestMasterItem.id
                                                ) !== undefined
                                            }
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell>{requestMasterItem.item}</StyledTableCell>
                                    <StyledTableCell>{requestMasterItem.recentCN}</StyledTableCell>
                                    <StyledTableCell width={100}>
                                        <TextField
                                            variant="standard"
                                            size="small"
                                            type="number"
                                            InputProps={{
                                                inputProps: { min: 0 }
                                            }}
                                            id={requestMasterItem.id.toString()}
                                            value={requestMasterItem.quantity}
                                            onKeyDown={(event: React.KeyboardEvent) =>
                                                handleUpdateQuantity(event, requestMasterItem)
                                            }
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                handleChangeQuantity(event, requestMasterItem.id)
                                            }
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <TextField
                                            variant="standard"
                                            sx={{ width: 150 }}
                                            size="small"
                                            id={requestMasterItem.id.toString()}
                                            value={requestMasterItem.customText}
                                            onKeyDown={(event: React.KeyboardEvent) =>
                                                handleUpdateCustomText(event, requestMasterItem)
                                            }
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                handleChangeCustomText(event, requestMasterItem.id)
                                            }
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell>{requestMasterItem.detail}</StyledTableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                sx={{ marginTop: 3 }}
                rowsPerPageOptions={[]}
                component="div"
                count={requestMasterItemsPendingSelector.response.totalElements}
                rowsPerPage={requestMasterItemsPendingSelector.response.size}
                page={requestMasterItemsPendingSelector.response.number}
                onPageChange={handleChangePage}
                showFirstButton={true}
                showLastButton={true}
            />
        </Box>
    );
};

export default RequestMasterDepartmentPending;
