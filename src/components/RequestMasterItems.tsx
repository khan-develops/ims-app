import {
    AppBar,
    BottomNavigation,
    BottomNavigationAction,
    Box,
    Checkbox,
    Drawer,
    Grid,
    InputBase,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Toolbar,
    alpha,
    styled,
    tableCellClasses
} from '@mui/material';
import { ChangeEvent, useEffect, useState, MouseEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useLocation } from 'react-router-dom';
import { selectDrawerToggleType, toggleDrawer } from '../app/slice/drawerToggle/drawerToggleTypeSlice';
import { DRAWER_TOGGLE_TYPE } from '../common/constants';
import RequestItemReviewForm from './forms/RequestItemReviewForm';
import { getRequestMasterItemsThunk, selectRequestMasterItems } from '../app/slice/request/requestMasterItemsSlice';
import {
    changeRequestMasterItemsChecked,
    selectRequestMasterItemsChecked
} from '../app/slice/request/requestMasterItemsCheckedSlice';
import { IRequestMaster } from '../app/api/properties/IRequest';
import { IMaster } from '../app/api/properties/IMaster';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DownloadIcon from '@mui/icons-material/Download';
import PreviewIcon from '@mui/icons-material/Preview';
import { visuallyHidden } from '@mui/utils';
import FileSaver from 'file-saver';
import axios from 'axios';

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
        backgroundColor: '#f9f9f9',
        fontSize: 12,
        fontWeight: 700,
        color: theme.palette.common.black,
        paddingTop: 1,
        paddingBottom: 1
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 12,
        paddingTop: 10,
        paddingBottom: 10
    }
}));

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
        id: 'purchaseUnit',
        numeric: false,
        label: 'Purchase Unit',
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
        id: 'partNumber',
        numeric: false,
        label: 'Part Number',
        align: 'left',
        padding: 'normal',
        size: 80
    }
];

type Order = 'asc' | 'desc';
const baseUrl = process.env.REACT_APP_BASE_URL;

interface EnhancedTableProps {
    onRequestSort: (event: MouseEvent<unknown>, property: keyof IMaster) => void;
    order: Order;
    orderBy: string;
}

const EnhancedTableHead = (props: EnhancedTableProps) => {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property: keyof IMaster) => (event: MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead sx={{ whiteSpace: 'nowrap' }}>
            <TableRow>
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

const RequestMasterItems = () => {
    const requestMasterItemsSelector = useAppSelector(selectRequestMasterItems);
    const requestMasterItemsCheckedSelector = useAppSelector(selectRequestMasterItemsChecked);
    const { type } = useAppSelector(selectDrawerToggleType);
    const dispatch = useAppDispatch();
    const [page, setPage] = useState<number>(0);
    const location = useLocation();
    const [selectedDepartment, setSelectedDepartment] = useState<string>('extractions');
    const [value, setValue] = useState<number>(0);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof IMaster>('id');

    useEffect(() => {
        dispatch(getRequestMasterItemsThunk({ state: location.state, department: selectedDepartment, page: page }));
    }, [dispatch, location.pathname, location.state, page, useAppSelector]);



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

    const handleKeywordChange = (event: ChangeEvent<HTMLInputElement>) => {
        // dispatch(filterMasterDepartmentItemsThunk({ state: state, keyword: event.target.value, page: 0 }));
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

    const handleAddClick = () => {
        dispatch(
            toggleDrawer({
                type: DRAWER_TOGGLE_TYPE.ADD_MASTER_ITEM
            })
        );
    };

    return (
 
                <Box component={Paper} elevation={3}>
                    <TableContainer sx={{ height: '60vh' }}>
                        <Table size="small" stickyHeader>
                            <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
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
                                            <StyledTableCell>{requestMasterItem.masterItem.item}</StyledTableCell>
                                            <StyledTableCell>{requestMasterItem.recentCN}</StyledTableCell>
                                            <StyledTableCell>
                                                {requestMasterItem.masterItem.purchaseUnit}
                                            </StyledTableCell>
                                            <StyledTableCell>{requestMasterItem.masterItem.partNumber}</StyledTableCell>
                                            <StyledTableCell>{requestMasterItem.customDetail}</StyledTableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Drawer anchor="bottom" open={type === DRAWER_TOGGLE_TYPE.UPDATE_REQUEST_REVIEW}>
                        <RequestItemReviewForm />
                    </Drawer>
                </Box>

    );
};

export default RequestMasterItems;
