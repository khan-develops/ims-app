import { MouseEvent, useEffect, useState } from 'react';
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
    ButtonGroup
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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#ffd740',
        fontSize: 11,
        fontWeight: 700,
        color: theme.palette.common.black
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 11
    }
}));

const columns: {
    field: string;
    tooltipName: string;
    headerName: string | JSX.Element;
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
        field: 'manufacturer',
        tooltipName: 'Manufacturer',
        headerName: 'M',
        align: 'left'
    },
    {
        field: 'recentCN',
        tooltipName: 'Recent CN',
        headerName: 'RCN',
        align: 'left'
    },
    {
        field: 'partNumber',
        tooltipName: 'Part Number',
        headerName: 'PN',
        align: 'left'
    },
    {
        field: 'recentVendor',
        tooltipName: 'Recent Vendor',
        headerName: 'RV',
        align: 'left'
    },
    {
        field: 'fisherCN',
        tooltipName: 'Fisher CN',
        headerName: 'FCN',
        align: 'left'
    },
    { field: 'vwrCN', tooltipName: 'VWR CN', headerName: 'VCN', align: 'left' },
    {
        field: 'labSourceCN',
        tooltipName: 'Lab Source CN',
        headerName: 'LSCN',
        align: 'left'
    },
    {
        field: 'otherCN',
        tooltipName: 'Other CN',
        headerName: 'OCN',
        align: 'left'
    },
    {
        field: 'unitPrice',
        tooltipName: 'Unit Price',
        headerName: 'AUP',
        align: 'left'
    },
    {
        field: 'category',
        tooltipName: 'Category',
        headerName: 'Ca',
        align: 'left'
    },
    {
        field: 'drugClass',
        tooltipName: 'Drug Class',
        headerName: 'DC',
        align: 'left'
    },
    { field: 'type', tooltipName: 'Type', headerName: 'Type', align: 'left' },
    { field: 'group', tooltipName: 'Group', headerName: 'Group', align: 'left' },
    {
        field: 'comments',
        tooltipName: 'Comment',
        headerName: 'Comment',
        align: 'left'
    }
];

const Master = (): JSX.Element => {
    const searchValueSelector = useAppSelector(selectSearchValue);
    const masterItemsSelector = useAppSelector(selectMasterItems);
    const departmentNamesSelector = useAppSelector(selectDepartmentNames);
    const dispatch = useAppDispatch();
    const [page, setPage] = useState<number>(0);
    const [masterItemId, setMasterItemId] = useState<number>(0);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [anchorElDelete, setAnchorElDelete] = useState<null | HTMLElement>(null);
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

    const handleIconClick = (event: MouseEvent<HTMLElement>, masterItemId: number | undefined, icon: string) => {
        if (masterItemId) {
            setMasterItemId(masterItemId);
            if (icon === 'ASSIGN') setAnchorElUser(event.currentTarget);
            if (icon === 'DELETE') setAnchorElDelete(event.currentTarget);
        }
    };

    const handleAssignItem = (event: MouseEvent<HTMLElement>, departmentName: string) => {
        dispatch(
            departmentMasterItemAssignThunk({
                state: departmentName,
                masterItemId: masterItemId
            })
        )
            .then((response) => {
                console.log(response.payload);
            })
            .catch((error: Error) => console.error(error.message));
        setAnchorElUser(null);
    };

    const handleCloseDepartmentMenu = () => {
        setAnchorElUser(null);
    };

    const handleDeleteConfirm = (event: MouseEvent<HTMLElement>) => {
        dispatch(deleteMasterItemThunk(masterItemId))
            .then((response) => {
                setAnchorElDelete(null);
                dispatch(getMasterItemsThunk(page));
            })
            .catch((error: Error) => console.error(error.message));
    };

    const handleDeleteCancel = (event: MouseEvent<HTMLElement>) => {
        setAnchorElDelete(null);
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

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }} component={Paper} elevation={3}>
            <TableContainer sx={{ height: '70vh' }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow sx={{ height: 50 }}>
                            {columns.length > 0 &&
                                columns.map((column) => (
                                    <StyledTableCell
                                        key={column.field}
                                        align={column.align}
                                        onClick={() => handleSort(column.field)}>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Typography
                                                sx={{ fontSize: 12, whiteSpace: 'nowrap', fontFamily: 'inherit' }}>
                                                {column.tooltipName}
                                            </Typography>
                                            {sort.column === column.field && <SortIcon sort={sort} />}
                                        </Box>
                                    </StyledTableCell>
                                ))}
                            <StyledTableCell align="center">Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {masterItemsSelector.response.content.length > 0 &&
                            masterItemsSelector.response.content.map((masterItem, index) => (
                                <TableRow key={index} hover>
                                    <StyledTableCell width={300}>{masterItem.item}</StyledTableCell>
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
                                    <StyledTableCell>{masterItem.drugClass}</StyledTableCell>
                                    <StyledTableCell>{masterItem.itemType}</StyledTableCell>
                                    <StyledTableCell>{masterItem.itemGroup}</StyledTableCell>
                                    <StyledTableCell width={180}>{masterItem.comment}</StyledTableCell>
                                    <StyledTableCell align="right">
                                        <ButtonGroup variant="outlined" size="small">
                                            <IconButton
                                                onClick={(event: MouseEvent<HTMLElement>) =>
                                                    handleEditClick(event, masterItem)
                                                }>
                                                <ModeEditIcon color="secondary" sx={{ fontSize: 16 }} />
                                            </IconButton>
                                            <IconButton
                                                onClick={(event: MouseEvent<HTMLElement>) =>
                                                    handleIconClick(event, masterItem.id, 'ASSIGN')
                                                }
                                                sx={{ marginLeft: 0.7, marginRight: 0.7 }}>
                                                <AssignmentTurnedInIcon color="secondary" sx={{ fontSize: 16 }} />
                                            </IconButton>
                                            <IconButton
                                                sx={{ marginLeft: 0.5 }}
                                                onClick={(event: MouseEvent<HTMLElement>) =>
                                                    handleIconClick(event, masterItem.id, 'DELETE')
                                                }>
                                                <DeleteIcon color="secondary" sx={{ fontSize: 16 }} />
                                            </IconButton>
                                        </ButtonGroup>
                                    </StyledTableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                sx={{ marginTop: 'auto' }}
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
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseDepartmentMenu}>
                {departmentNamesSelector.departmentNames
                    .filter((departmentNameDetail) => departmentNameDetail.hasInventory)
                    .map((departmentNameDetail, index) => (
                        <MenuItem
                            key={index}
                            onClick={(event: MouseEvent<HTMLElement>) =>
                                handleAssignItem(event, departmentNameDetail.name.split('_').join('-'))
                            }>
                            <Typography textAlign="center">{departmentNameDetail.name.split('_').join(' ')}</Typography>
                        </MenuItem>
                    ))}
            </Menu>
            <Menu
                key="delete-menu"
                id="delete-menu"
                anchorEl={anchorElDelete}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                open={Boolean(anchorElDelete)}
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
