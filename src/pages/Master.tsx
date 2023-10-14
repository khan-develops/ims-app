import { ChangeEvent, Fragment, MouseEvent, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Paper,
    Box,
    styled,
    Menu,
    MenuItem,
    Typography,
    ButtonGroup,
    Checkbox,
    TableSortLabel,
    Divider,
    Card,
    CardContent,
    CardActions,
    Button
} from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { tableCellClasses } from '@mui/material/TableCell';
import { toggleDrawer } from '../app/slice/drawerToggle/drawerToggleTypeSlice';
import { DRAWER_TOGGLE_TYPE } from '../common/constants';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IMaster } from '../app/api/properties/IMaster';
import { departmentMasterItemAssignThunk } from '../app/slice/department/departmentMasterItemAssignSlice';
import {
    filterMasterItemsThunk,
    getMasterItemsThunk,
    selectMasterItems,
    sortMasterItemsThunk
} from '../app/slice/master/masterItemsSlice';
import { deleteMasterItemThunk } from '../app/slice/master/masterItemDeleteSlice';
import { selectSearchValue } from '../app/search';
import SortIcon from '../components/common/SortIcon';
import { getDepartmentNamesThunk, selectDepartmentNames } from '../app/slice/departmentName/departmentNamesSlice';
import { visuallyHidden } from '@mui/utils';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#ffd740',
        fontSize: 12,
        fontWeight: 700,
        color: theme.palette.common.black
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 12
    }
}));

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headerCell: {
    id: keyof IMaster;
    numeric: boolean;
    disablePadding: boolean;
    label: string;
    align: 'left' | 'right' | 'center';
}[] = [
    {
        id: 'item',
        numeric: false,
        disablePadding: false,
        label: 'Item',
        align: 'left'
    },
    {
        id: 'purchaseUnit',
        numeric: false,
        disablePadding: false,
        label: 'Purchase Unit',
        align: 'left'
    },
    {
        id: 'manufacturer',
        numeric: false,
        disablePadding: false,
        label: 'Manufacturer',
        align: 'left'
    },
    {
        id: 'recentVendor',
        numeric: false,
        disablePadding: false,
        label: 'Recent Vendor',
        align: 'left'
    },
    {
        id: 'recentCN',
        numeric: false,
        disablePadding: false,
        label: 'Recent CN',
        align: 'left'
    },
    {
        id: 'partNumber',
        numeric: false,
        disablePadding: false,
        label: 'Part Number',
        align: 'left'
    },
    {
        id: 'fisherCN',
        numeric: false,
        disablePadding: false,
        label: 'Fisher CN',
        align: 'left'
    },
    {
        id: 'vwrCN',
        numeric: false,
        disablePadding: false,
        label: 'VWR CN',
        align: 'left'
    },
    {
        id: 'labSourceCN',
        numeric: false,
        disablePadding: false,
        label: 'Lab Source CN',
        align: 'left'
    },
    {
        id: 'otherCN',
        numeric: false,
        disablePadding: false,
        label: 'Other CN',
        align: 'left'
    },
    {
        id: 'unitPrice',
        numeric: false,
        disablePadding: false,
        label: 'Unit Price',
        align: 'left'
    },
    {
        id: 'category',
        numeric: false,
        disablePadding: false,
        label: 'Category',
        align: 'left'
    },
    {
        id: 'drugClass',
        numeric: false,
        disablePadding: false,
        label: 'Drug Class',
        align: 'left'
    },
    {
        id: 'itemType',
        numeric: false,
        disablePadding: false,
        label: 'Type',
        align: 'left'
    },
    {
        id: 'itemGroup',
        numeric: false,
        disablePadding: false,
        label: 'Group',
        align: 'left'
    }
];

type Order = 'asc' | 'desc';

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: MouseEvent<unknown>, property: keyof IMaster) => void;
    onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property: keyof IMaster) => (event: MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead sx={{ whiteSpace: 'nowrap' }}>
            <TableRow sx={{ height: 55 }}>
                <StyledTableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts'
                        }}
                    />
                </StyledTableCell>
                {headerCell.map((headCell) => (
                    <StyledTableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={'normal'}
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
}

const MasterTableRow = ({ masterItem, index }: { masterItem: IMaster; index: number }): JSX.Element => {
    // const isItemSelected = isSelected(masterItem.id);
    const labelId = `enhanced-table-checkbox-${index}`;
    return (
        <Fragment>
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                    <TableRow>
                        <StyledTableCell colSpan={4}>{masterItem.item}</StyledTableCell>
                        <StyledTableCell colSpan={4}>{masterItem.comment}</StyledTableCell>
                    </TableRow>
                    <TableRow key={index} hover>
                        <StyledTableCell>{masterItem.purchaseUnit}</StyledTableCell>
                        <StyledTableCell>{masterItem.manufacturer}</StyledTableCell>
                        <StyledTableCell>{masterItem.recentCN}</StyledTableCell>
                        <StyledTableCell>{masterItem.partNumber}</StyledTableCell>
                        <StyledTableCell>{masterItem.recentVendor}</StyledTableCell>
                        <StyledTableCell>{masterItem.fisherCN}</StyledTableCell>
                        <StyledTableCell>{masterItem.vwrCN}</StyledTableCell>
                        <StyledTableCell>{masterItem.labSourceCN}</StyledTableCell>
                        <StyledTableCell>{masterItem.otherCN}</StyledTableCell>
                        <StyledTableCell>${masterItem.unitPrice}</StyledTableCell>
                        <StyledTableCell>{masterItem.category}</StyledTableCell>
                        <StyledTableCell padding="none">{masterItem.drugClass}</StyledTableCell>
                        <StyledTableCell padding="none">{masterItem.itemType}</StyledTableCell>
                        <StyledTableCell padding="none">{masterItem.itemGroup}</StyledTableCell>
                        {/* <StyledTableCell align="right">
            <ButtonGroup variant="outlined" size="small">
                <IconButton
                    onClick={(event: MouseEvent<HTMLElement>) =>
                        handleEditClick(event, masterItem)
                    }>
                    <ModeEditIcon color="secondary" sx={{ fontSize: 16 }} />
                </IconButton>
                <IconButton
                    onClick={(event: MouseEvent<HTMLElement>) =>
                        handleAssignIconClick(event, masterItem.id, 'ASSIGN')
                    }
                    sx={{ marginLeft: 0.7, marginRight: 0.7 }}>
                    <AssignmentTurnedInIcon color="secondary" sx={{ fontSize: 16 }} />
                </IconButton>
                <IconButton
                    sx={{ marginLeft: 0.5 }}
                    onClick={(event: MouseEvent<HTMLElement>) =>
                        handleDeleteIconClick(event, masterItem.id, 'DELETE')
                    }>
                    <DeleteIcon color="secondary" sx={{ fontSize: 16 }} />
                </IconButton>
            </ButtonGroup>
        </StyledTableCell> */}
                    </TableRow>
                </CardContent>
                <CardActions>
                    <Button size="small">Learn More</Button>
                </CardActions>
            </Card>
            <TableRow>
                <StyledTableCell colSpan={4}>{masterItem.item}</StyledTableCell>
                <StyledTableCell colSpan={4}>{masterItem.comment}</StyledTableCell>
            </TableRow>
            <TableRow key={index} hover>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        // checked={isItemSelected}
                        inputProps={{
                            'aria-labelledby': labelId
                        }}
                    />
                </TableCell>
                <StyledTableCell>{masterItem.purchaseUnit}</StyledTableCell>
                <StyledTableCell>{masterItem.manufacturer}</StyledTableCell>
                <StyledTableCell>{masterItem.recentCN}</StyledTableCell>
                <StyledTableCell>{masterItem.partNumber}</StyledTableCell>
                <StyledTableCell>{masterItem.recentVendor}</StyledTableCell>
                <StyledTableCell>{masterItem.fisherCN}</StyledTableCell>
                <StyledTableCell>{masterItem.vwrCN}</StyledTableCell>
                <StyledTableCell>{masterItem.labSourceCN}</StyledTableCell>
                <StyledTableCell>{masterItem.otherCN}</StyledTableCell>
                <StyledTableCell>${masterItem.unitPrice}</StyledTableCell>
                <StyledTableCell>{masterItem.category}</StyledTableCell>
                <StyledTableCell padding="none">{masterItem.drugClass}</StyledTableCell>
                <StyledTableCell padding="none">{masterItem.itemType}</StyledTableCell>
                <StyledTableCell padding="none">{masterItem.itemGroup}</StyledTableCell>
                {/* <StyledTableCell align="right">
            <ButtonGroup variant="outlined" size="small">
                <IconButton
                    onClick={(event: MouseEvent<HTMLElement>) =>
                        handleEditClick(event, masterItem)
                    }>
                    <ModeEditIcon color="secondary" sx={{ fontSize: 16 }} />
                </IconButton>
                <IconButton
                    onClick={(event: MouseEvent<HTMLElement>) =>
                        handleAssignIconClick(event, masterItem.id, 'ASSIGN')
                    }
                    sx={{ marginLeft: 0.7, marginRight: 0.7 }}>
                    <AssignmentTurnedInIcon color="secondary" sx={{ fontSize: 16 }} />
                </IconButton>
                <IconButton
                    sx={{ marginLeft: 0.5 }}
                    onClick={(event: MouseEvent<HTMLElement>) =>
                        handleDeleteIconClick(event, masterItem.id, 'DELETE')
                    }>
                    <DeleteIcon color="secondary" sx={{ fontSize: 16 }} />
                </IconButton>
            </ButtonGroup>
        </StyledTableCell> */}
            </TableRow>
        </Fragment>
    );
};


const Master = (): JSX.Element => {
    const searchValueSelector = useAppSelector(selectSearchValue);
    const masterItemsSelector = useAppSelector(selectMasterItems);
    const departmentNamesSelector = useAppSelector(selectDepartmentNames);
    const [selectedItems, setSelectedItems] = useState<IMaster[]>([]);
    const [order, setOrder] = useState<Order>('asc');
    const [dense, setDense] = useState<boolean>(false);
    const [orderBy, setOrderBy] = useState<keyof IMaster>('category');
    const dispatch = useAppDispatch();
    const [page, setPage] = useState<number>(0);
    const [anchorElAssign, setAnchorElAssign] = useState<{ anchorEl: null | HTMLElement; masterItemId: number }>({
        anchorEl: null,
        masterItemId: 0
    });
    const [anchorElDelete, setAnchorElDelete] = useState<{ anchorEl: null | HTMLElement; masterItemId: number }>({
        anchorEl: null,
        masterItemId: 0
    });
    const [sort, setSort] = useState<{ column: string; direction: '' | 'ASC' | 'DESC' }>({ column: '', direction: '' });

    useEffect(() => {
        dispatch(getDepartmentNamesThunk());
        if (searchValueSelector && searchValueSelector.searchValue) {
            dispatch(filterMasterItemsThunk({ keyword: searchValueSelector.searchValue, page: page }));
        } else {
            dispatch(getMasterItemsThunk(page));
        }
    }, [dispatch, page]);

    const handleChangePage = (event: any, newPage: number): void => {
        setPage(newPage);
        if (searchValueSelector && searchValueSelector.searchValue) {
            dispatch(filterMasterItemsThunk({ keyword: searchValueSelector.searchValue, page: newPage }));
        }
    };

    const handleEditClick = (event: MouseEvent<HTMLElement>, masterItem: IMaster) => {
        dispatch(
            toggleDrawer({
                type: DRAWER_TOGGLE_TYPE.UPDATE_MASTER_ITEM,
                masterItem: masterItem
            })
        );
    };

    const handleAssignIconClick = (event: MouseEvent<HTMLElement>, masterItemId: number, icon: string) => {
        setAnchorElAssign({ anchorEl: event.currentTarget, masterItemId: masterItemId });
    };

    const handleDeleteIconClick = (event: MouseEvent<HTMLElement>, masterItemId: number, icon: string) => {
        setAnchorElAssign({ anchorEl: event.currentTarget, masterItemId: masterItemId });
    };

    const handleAssignItem = (departmentName: string) => {
        dispatch(
            departmentMasterItemAssignThunk({
                state: departmentName,
                masterItemId: anchorElAssign.masterItemId
            })
        )
            .then((response) => {
                console.log(response.payload);
            })
            .catch((error: Error) => console.error(error.message));
        setAnchorElAssign({ anchorEl: null, masterItemId: 0 });
    };

    const handleCloseDepartmentMenu = () => {
        setAnchorElAssign({ anchorEl: null, masterItemId: 0 });
    };

    const handleDeleteConfirm = (event: MouseEvent<HTMLElement>) => {
        dispatch(deleteMasterItemThunk(anchorElDelete.masterItemId))
            .then((response) => {
                setAnchorElDelete({ anchorEl: null, masterItemId: 0 });
                dispatch(getMasterItemsThunk(page));
            })
            .catch((error: Error) => console.error(error.message));
    };

    const handleDeleteCancel = () => {
        setAnchorElDelete({ anchorEl: null, masterItemId: 0 });
    };

    const handleSort = (field: string) => {
        if (sort.direction === '') {
            setSort({ column: field, direction: 'ASC' });
            dispatch(sortMasterItemsThunk({ page: page, column: field, direction: 'ASC' }));
        }
        if (sort.direction === 'ASC') {
            setSort({ column: field, direction: 'DESC' });
            dispatch(sortMasterItemsThunk({ page: page, column: field, direction: 'DESC' }));
        }
        if (sort.direction === 'DESC') {
            setSort({ column: field, direction: '' });
            dispatch(sortMasterItemsThunk({ page: page, column: field, direction: '' }));
        }
    };

    const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = masterItemsSelector.response.content.map((masterItem) => masterItem);
            setSelectedItems(newSelected);
            return;
        }
        setSelectedItems([]);
    };

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof IMaster) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // const isSelected = (id: number) => selectedItems.some((item) => item.id === id);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }} component={Paper} elevation={3}>
            <TableContainer sx={{ height: '70vh' }}>
                <Table stickyHeader size="medium">
                    <EnhancedTableHead
                        numSelected={selectedItems.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={masterItemsSelector.response.content.length}
                    />
                    <TableBody>
                        {masterItemsSelector.response.content.length > 0 &&
                            masterItemsSelector.response.content.map((masterItem, index) => {
                                return <MasterTableRow masterItem={masterItem} index={index} />;
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <Divider variant="fullWidth" sx={{ flexGrow: 1 }} />
            <TablePagination
                rowsPerPageOptions={[]}
                component="div"
                count={masterItemsSelector.response.totalElements}
                rowsPerPage={masterItemsSelector.response.size}
                page={masterItemsSelector.response.number}
                onPageChange={handleChangePage}
                showFirstButton={true}
                showLastButton={true}
            />
            <Menu
                key="profile-menu"
                id="profile-menu"
                anchorEl={anchorElAssign.anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                open={Boolean(anchorElAssign.anchorEl)}
                onClose={handleCloseDepartmentMenu}>
                {departmentNamesSelector.departmentNames
                    .filter((departmentNameDetail) => departmentNameDetail.hasInventory)
                    .map((departmentNameDetail, index) => (
                        <MenuItem
                            key={index}
                            onClick={() =>
                                handleAssignItem(departmentNameDetail.name.toLowerCase().split('_').join('-'))
                            }>
                            <Typography textAlign="center">{departmentNameDetail.name.split('_').join(' ')}</Typography>
                        </MenuItem>
                    ))}
            </Menu>
            <Menu
                key="delete-menu"
                id="delete-menu"
                anchorEl={anchorElDelete.anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                open={Boolean(anchorElDelete.anchorEl)}
                onClose={handleCloseDepartmentMenu}>
                <MenuItem key="confirm" onClick={handleDeleteConfirm}>
                    <Typography textAlign="center">Confirm</Typography>
                </MenuItem>
                <MenuItem key="cancel" onClick={handleDeleteCancel}>
                    <Typography textAlign="center">Cancel</Typography>
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default Master;
