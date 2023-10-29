import {
    BottomNavigation,
    BottomNavigationAction,
    Box,
    Checkbox,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    styled,
    tableCellClasses
} from '@mui/material';
import { ChangeEvent, useEffect, useState, MouseEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useLocation } from 'react-router-dom';
import { IMaster } from '../../app/api/properties/IMaster';
import { visuallyHidden } from '@mui/utils';
import {
    getPurchaseRequestMasterItemsThunk,
    selectRequestMasterItems,
    sortPurchaseRequestMasterItemsThunk
} from '../../app/slice/request/requestMasterItemsPurchaseSlice';
import { IRequest, IRequestMaster } from '../../app/api/properties/IRequest';
import {
    handleRequestMasterItemsPurchaseSelected,
    selectRequestMasterItemsPurchaseSelected
} from '../../app/slice/selectedRequests/requestMasterItemsPurchaseSelectedSlice';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
import FileSaver from 'file-saver';

const columns: {
    id: keyof IMaster | keyof IRequest;
    numeric: boolean;
    label: string;
    align: 'left' | 'right' | 'center';
    padding: 'checkbox' | 'normal' | 'none';
    size: number;
}[] = [
    {
        id: 'item',
        numeric: false,
        label: 'Item',
        align: 'left',
        padding: 'normal',
        size: 80
    },
    {
        id: 'recentCN',
        numeric: false,
        label: 'Recent CN',
        align: 'left',
        padding: 'normal',
        size: 80
    },
    {
        id: 'purchaseUnit',
        numeric: false,
        label: 'Purchase Unit',
        align: 'left',
        padding: 'normal',
        size: 80
    },

    {
        id: 'partNumber',
        numeric: false,
        label: 'Part Number',
        align: 'left',
        padding: 'normal',
        size: 80
    },
    {
        id: 'comment',
        numeric: false,
        label: 'Comment',
        align: 'left',
        padding: 'normal',
        size: 80
    }
];

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

type Order = 'asc' | 'desc';
const baseUrl = process.env.REACT_APP_BASE_URL;

interface EnhancedTableProps {
    onRequestSort: (event: MouseEvent<unknown>, property: keyof IMaster | keyof IRequest) => void;
    onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    requestMasterItemsPurchaseSelected: IRequestMaster[];
}

const EnhancedTableHead = (props: EnhancedTableProps) => {
    const requestMasterItemSelector = useAppSelector(selectRequestMasterItems);
    const { onSelectAllClick, order, orderBy, onRequestSort, requestMasterItemsPurchaseSelected } = props;
    const createSortHandler = (property: keyof IMaster | keyof IRequest) => (event: MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead sx={{ whiteSpace: 'nowrap' }}>
            <TableRow>
                <StyledTableCell padding="checkbox">
                    <Checkbox
                        color="default"
                        sx={{ paddingTop: 0, paddingBottom: 0, color: 'white' }}
                        indeterminate={
                            requestMasterItemsPurchaseSelected.length > 0 &&
                            requestMasterItemsPurchaseSelected.length <
                                requestMasterItemSelector.response.content.length
                        }
                        checked={
                            requestMasterItemSelector.response.content.length > 0 &&
                            requestMasterItemsPurchaseSelected.length ===
                                requestMasterItemSelector.response.content.length
                        }
                        onChange={onSelectAllClick}
                    />
                </StyledTableCell>
                {columns.map((headCell) => (
                    <StyledTableCell
                        key={headCell.id}
                        align={headCell.align}
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

const RequestMasterItemsPurchaseRow = ({ requestMasterItem }: { requestMasterItem: IRequestMaster }): JSX.Element => {
    const dispatch = useAppDispatch();
    const requestMasterItemsPurchaseSelectedSelector = useAppSelector(selectRequestMasterItemsPurchaseSelected);

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>, requestMasterItem: IRequestMaster) => {
        if (event.target.checked) {
            dispatch(
                handleRequestMasterItemsPurchaseSelected([
                    ...requestMasterItemsPurchaseSelectedSelector.requestMasterItems,
                    requestMasterItem
                ])
            );
        } else {
            dispatch(
                handleRequestMasterItemsPurchaseSelected([
                    ...requestMasterItemsPurchaseSelectedSelector.requestMasterItems.filter(
                        (item) => item.id !== requestMasterItem.id
                    )
                ])
            );
        }
    };

    return (
        <TableRow>
            <StyledTableCell padding="checkbox">
                <Checkbox
                    color="default"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleCheckboxChange(event, requestMasterItem)}
                    defaultChecked={requestMasterItemsPurchaseSelectedSelector.requestMasterItems.includes(
                        requestMasterItem
                    )}
                />
            </StyledTableCell>
            <StyledTableCell width={800}>{requestMasterItem.masterItem.item}</StyledTableCell>
            <StyledTableCell width={150}>{requestMasterItem.recentCN}</StyledTableCell>
            <StyledTableCell width={150}>{requestMasterItem.masterItem.purchaseUnit}</StyledTableCell>
            <StyledTableCell width={150}>{requestMasterItem.masterItem.partNumber}</StyledTableCell>
            <StyledTableCell>{requestMasterItem.masterItem.comment}</StyledTableCell>
        </TableRow>
    );
};

const RequestMasterItemsPurchase = () => {
    const requestMasterItemsSelector = useAppSelector(selectRequestMasterItems);
    const requestMasterItemsPurchaseSelectedSelector = useAppSelector(selectRequestMasterItemsPurchaseSelected);
    const dispatch = useAppDispatch();
    const location = useLocation();
    const [page, setPage] = useState<number>(0);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof IMaster | keyof IRequest>('id');

    const { state } = location;

    useEffect(() => {
        dispatch(getPurchaseRequestMasterItemsThunk({ requestCategory: state.requestCategory, page: page }));
    }, [dispatch, location, page, state.requestCategory]);

    const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
        if (
            requestMasterItemsPurchaseSelectedSelector.requestMasterItems.length <
            requestMasterItemsSelector.response.content.length
        ) {
            dispatch(handleRequestMasterItemsPurchaseSelected(requestMasterItemsSelector.response.content));
        } else {
            dispatch(handleRequestMasterItemsPurchaseSelected([]));
        }
    };

    const handleRequestSort = (event: MouseEvent<unknown>, property: keyof IMaster | keyof IRequest) => {
        if (order === 'asc' && orderBy === 'id') {
            setOrder('asc');
            setOrderBy(property);
            dispatch(
                sortPurchaseRequestMasterItemsThunk({
                    requestCategory: state.requestCategory,
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
                sortPurchaseRequestMasterItemsThunk({
                    requestCategory: state.requestCategory,
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
                sortPurchaseRequestMasterItemsThunk({
                    requestCategory: state.requestCategory,
                    page: page,
                    column: 'id',
                    direction: 'asc'
                })
            )
                .then(() => {})
                .catch((error: Error) => console.error(error.message));
        } else {
            setOrder('asc');
            setOrderBy(property);
            dispatch(
                sortPurchaseRequestMasterItemsThunk({
                    requestCategory: state.requestCategory,
                    page: page,
                    column: property,
                    direction: 'asc'
                })
            )
                .then(() => {})
                .catch((error: Error) => console.error(error.message));
        }
    };

    const handleDownloadClick = () => {
        return axios.get(`${baseUrl}/download/${location.state}/list`).then((response) => {
            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            FileSaver.saveAs(blob, `${location.state}.xlsx`);
        });
    };

    const handleChangePage = (event: any, newPage: number): void => {
        setPage(newPage);
    };

    return (
        <Grid container direction="column" justifyContent="space-between" sx={{ height: 'calc(100% - 50px)' }}>
            <Grid></Grid>
            <Grid item padding={2}>
                <Paper elevation={2} sx={{ padding: 0.5 }}>
                    <TableContainer sx={{ height: 700, overflowY: 'auto' }}>
                        <Table stickyHeader>
                            <EnhancedTableHead
                                requestMasterItemsPurchaseSelected={
                                    requestMasterItemsPurchaseSelectedSelector.requestMasterItems
                                }
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                            />
                            <TableBody>
                                {requestMasterItemsSelector.response.content.length > 0 &&
                                    requestMasterItemsSelector.response.content.map((requestMasterItem, index) => (
                                        <RequestMasterItemsPurchaseRow
                                            requestMasterItem={requestMasterItem}
                                            key={index}
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
                        showLabels>
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
                                    count={requestMasterItemsSelector.response.totalElements}
                                    rowsPerPage={requestMasterItemsSelector.response.size}
                                    page={requestMasterItemsSelector.response.number}
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

export default RequestMasterItemsPurchase;
