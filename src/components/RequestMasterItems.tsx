import {
    Box,
    Checkbox,
    Drawer,
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
import { ChangeEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useLocation } from 'react-router-dom';
import { selectDrawerToggleType } from '../app/slice/drawerToggle/drawerToggleTypeSlice';
import { DRAWER_TOGGLE_TYPE } from '../common/constants';
import RequestItemReviewForm from './forms/RequestItemReviewForm';
import { getRequestMasterItemsThunk, selectRequestMasterItems } from '../app/slice/request/requestMasterItemsSlice';
import {
    changeRequestMasterItemsChecked,
    selectRequestMasterItemsChecked
} from '../app/slice/request/requestMasterItemsCheckedSlice';
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
    { field: 'purchaseUnit', headerName: 'Purchase Unit' },
    { field: 'partNumber', headerName: 'Part Number' },
    { field: 'comment', headerName: 'Comment' }
];

const RequestMasterDepartmentItems = () => {
    const requestMasterItemsSelector = useAppSelector(selectRequestMasterItems);
    const requestMasterItemsCheckedSelector = useAppSelector(selectRequestMasterItemsChecked);
    const { type } = useAppSelector(selectDrawerToggleType);
    const dispatch = useAppDispatch();
    const [page, setPage] = useState<number>(0);
    const location = useLocation();

    useEffect(() => {
        dispatch(getRequestMasterItemsThunk({ state: location.state, page: page }));
    }, [dispatch, location.pathname, location.state, page, useAppSelector]);

    const handleChangePage = (event: any, page: number): void => {
        setPage(page);
    };

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>, departmentMasterItem: IRequestMaster) => {
        const exists = requestMasterItemsCheckedSelector.requestMasterItemsChecked.some(
            (item) => item.id === departmentMasterItem.id
        );
        if (exists) {
            dispatch(
                changeRequestMasterItemsChecked(
                    requestMasterItemsCheckedSelector.requestMasterItemsChecked.filter(
                        (item) => item.id !== departmentMasterItem.id
                    )
                )
            );
        }
        if (!exists) {
            dispatch(
                changeRequestMasterItemsChecked([
                    ...requestMasterItemsCheckedSelector.requestMasterItemsChecked,
                    departmentMasterItem
                ])
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
                        {requestMasterItemsSelector.response.content.length > 0 &&
                            requestMasterItemsSelector.response.content.map((requestMasterItem, index) => (
                                <TableRow key={index}>
                                    <StyledTableCell>
                                        <Checkbox
                                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                                handleCheckboxChange(event, requestMasterItem)
                                            }
                                            checked={
                                                requestMasterItemsCheckedSelector.requestMasterItemsChecked.find(
                                                    (item) => item.id === requestMasterItem.id
                                                ) !== undefined
                                            }
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell>{requestMasterItem.item}</StyledTableCell>
                                    <StyledTableCell>{requestMasterItem.recentCN}</StyledTableCell>
                                    <StyledTableCell>{requestMasterItem.masterItem.purchaseUnit}</StyledTableCell>
                                    <StyledTableCell>{requestMasterItem.masterItem.partNumber}</StyledTableCell>
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
                count={requestMasterItemsSelector.response.totalElements}
                rowsPerPage={requestMasterItemsSelector.response.size}
                page={requestMasterItemsSelector.response.number}
                onPageChange={handleChangePage}
                showFirstButton={true}
                showLastButton={true}
            />
            <Drawer anchor="bottom" open={type === DRAWER_TOGGLE_TYPE.UPDATE_REQUEST_REVIEW}>
                <RequestItemReviewForm />
            </Drawer>
        </Box>
    );
};

export default RequestMasterDepartmentItems;
