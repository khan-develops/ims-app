import {
    Box,
    Checkbox,
    Drawer,
    FormControlLabel,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    styled,
    tableCellClasses
} from '@mui/material';
import { ChangeEvent, useEffect, useState, MouseEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useLocation } from 'react-router-dom';
import { selectDrawerToggleType, toggleDrawer } from '../app/slice/drawerToggle/drawerToggleTypeSlice';
import { DRAWER_TOGGLE_TYPE } from '../common/constants';
import RequestItemReviewForm from './forms/RequestItemReviewForm';
import { IMaster } from '../app/api/properties/IMaster';
import { visuallyHidden } from '@mui/utils';
import FileSaver from 'file-saver';
import axios from 'axios';
import { changeMasterItems, getMasterItemsThunk, selectMasterItems } from '../app/slice/master/masterItemsSlice';

const columns: {
    id: keyof IMaster;
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
    onRequestSort: (event: MouseEvent<unknown>, property: keyof IMaster) => void;
    onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    selectedIds: number[];
}

const EnhancedTableHead = (props: EnhancedTableProps) => {
    const masterItemsSelector = useAppSelector(selectMasterItems);
    const { onSelectAllClick, order, orderBy, onRequestSort, selectedIds } = props;
    const createSortHandler = (property: keyof IMaster) => (event: MouseEvent<unknown>) => {
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
                            selectedIds.length > 0 && selectedIds.length < masterItemsSelector.response.content.length
                        }
                        checked={
                            masterItemsSelector.response.content.length > 0 &&
                            selectedIds.length === masterItemsSelector.response.content.length
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

const RequestMasterItems = () => {
    const masterItemsSelector = useAppSelector(selectMasterItems);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const { type } = useAppSelector(selectDrawerToggleType);
    const dispatch = useAppDispatch();
    const [page, setPage] = useState<number>(0);
    const location = useLocation();
    const [selectedDepartment, setSelectedDepartment] = useState<string>('extractions');
    const [value, setValue] = useState<number>(0);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof IMaster>('id');
    const [dense, setDense] = useState(false);

    useEffect(() => {
        dispatch(getMasterItemsThunk(page));
    }, [dispatch, page]);

    const handleAddClick = () => {
        dispatch(
            toggleDrawer({
                type: DRAWER_TOGGLE_TYPE.ADD_MASTER_ITEM
            })
        );
    };

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>, masterItem: IMaster) => {
        if (event.target.checked) {
            setSelectedIds([...selectedIds, masterItem.id]);
        } else {
            setSelectedIds([...selectedIds.filter((id) => id !== masterItem.id)]);
        }
    };

    const handleKeywordChange = (event: ChangeEvent<HTMLInputElement>) => {
        // dispatch(filterMasterDepartmentItemsThunk({ state: state, keyword: event.target.value, page: 0 }));
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

    const handleEditClick = (event: MouseEvent<HTMLElement>) => {
        // if (masterDepartmentItem) {
        //     dispatch(
        //         toggleDrawer({
        //             type: DRAWER_TOGGLE_TYPE.UPDATE_STORE_ROOM_ITEM,
        //             storeRoomItem: {
        //                 id: masterDepartmentItem.id,
        //                 location: masterDepartmentItem.departmentItems[0].location,
        //                 quantity: masterDepartmentItem.departmentItems[0].quantity,
        //                 minimumQuantity: masterDepartmentItem.departmentItems[0].minimumQuantity,
        //                 maximumQuantity: masterDepartmentItem.departmentItems[0].maximumQuantity,
        //                 usageLevel: masterDepartmentItem.departmentItems[0].usageLevel,
        //                 lotNumber: masterDepartmentItem.departmentItems[0].lotNumber,
        //                 expirationDate: masterDepartmentItem.departmentItems[0].expirationDate,
        //                 receivedDate: masterDepartmentItem.departmentItems[0].receivedDate
        //             }
        //         })
        //     );
        // }
    };

    const handleRequestSort = (event: MouseEvent<unknown>, property: keyof IMaster) => {
        // if (order === 'asc' && orderBy === 'id') {
        //     dispatch(
        //         sortMasterDepartmentItemsThunk({
        //             state: location.state,
        //             page: page,
        //             column: property,
        //             direction: order
        //         })
        //     )
        //         .then(() => setOrderBy(property))
        //         .catch((error: Error) => console.error(error.message));
        // } else if (order === 'asc' && orderBy === property) {
        //     dispatch(
        //         sortMasterDepartmentItemsThunk({
        //             state: location.state,
        //             page: page,
        //             column: property,
        //             direction: order
        //         })
        //     )
        //         .then(() => setOrder('desc'))
        //         .catch((error: Error) => console.error(error.message));
        // } else if (order === 'desc' && orderBy === property) {
        //     dispatch(
        //         sortMasterDepartmentItemsThunk({
        //             state: location.state,
        //             page: page,
        //             column: property,
        //             direction: order
        //         })
        //     )
        //         .then(() => {
        //             setOrder('asc');
        //             setOrderBy('id');
        //         })
        //         .catch((error: Error) => console.error(error.message));
        // }
    };

    const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
        if (selectedIds.length < masterItemsSelector.response.content.length) {
            setSelectedIds(
                masterItemsSelector.response.content.reduce(
                    (acc: number[], masterItem) => (acc.includes(masterItem.id) ? acc : [...acc, masterItem.id]),
                    []
                )
            );
        } else {
            setSelectedIds([]);
        }
    };

    return (
        <Box>
            <Paper elevation={2} sx={{ padding: 0.5 }}>
                <TableContainer sx={{ height: 600, overflowY: 'auto' }}>
                    <Table stickyHeader>
                        <EnhancedTableHead
                            selectedIds={selectedIds}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {masterItemsSelector.response.content.length > 0 &&
                                masterItemsSelector.response.content.map((masterItem, index) => (
                                    <TableRow key={index}>
                                        <StyledTableCell padding="checkbox">
                                            <Checkbox
                                                color="default"
                                                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                                    handleCheckboxChange(event, masterItem)
                                                }
                                                checked={selectedIds.includes(masterItem.id)}
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell>{masterItem.item}</StyledTableCell>
                                        <StyledTableCell>{masterItem.recentCN}</StyledTableCell>
                                        <StyledTableCell>{masterItem.purchaseUnit}</StyledTableCell>
                                        <StyledTableCell>{masterItem.partNumber}</StyledTableCell>
                                        <StyledTableCell>{masterItem.comment}</StyledTableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Drawer anchor="bottom" open={type === DRAWER_TOGGLE_TYPE.UPDATE_REQUEST_REVIEW}>
                    <RequestItemReviewForm />
                </Drawer>
            </Paper>
        </Box>
    );
};

export default RequestMasterItems;
