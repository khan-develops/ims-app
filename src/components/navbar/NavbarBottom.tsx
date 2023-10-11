import { BottomNavigation, BottomNavigationAction, Box, Paper } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DownloadIcon from '@mui/icons-material/Download';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { DRAWER_TOGGLE_TYPE } from '../../common/constants';
import { toggleDrawer } from '../../app/slice/drawerToggle/drawerToggleTypeSlice';
import { selectRequestMasterItemsChecked } from '../../app/slice/request/requestMasterItemsCheckedSlice';
import { useLocation } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';
import PreviewIcon from '@mui/icons-material/Preview';
import { selectRequestMasterItemsPendingChecked } from '../../app/slice/request/requestMasterItemsPendingCheckedSlice';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import FileSaver from 'file-saver';

const NavbarBottom = () => {
    const [value, setValue] = useState<number>(0);
    const dispatch = useAppDispatch();
    const requestMasterItemsCheckedSelector = useAppSelector(selectRequestMasterItemsChecked);
    const requestMasterItemsPendingCheckedSelector = useAppSelector(selectRequestMasterItemsPendingChecked);
    const location = useLocation();
    const baseUrl = process.env.REACT_APP_BASE_URL;

    const handleAddClick = () => {
        dispatch(
            toggleDrawer({
                type: DRAWER_TOGGLE_TYPE.ADD_MASTER_ITEM
            })
        );
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

    const handleEditClick = () => {
        dispatch(toggleDrawer({ type: DRAWER_TOGGLE_TYPE.UPDATE_REQUEST_EDIT }));
    };

    return (
        <Paper variant="elevation" elevation={5} sx={{ height: 80 }}>
            <BottomNavigation
                sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}>
                <Box sx={{ width: 10 }}>
                    {(location.pathname === '/departments/extractions' ||
                        location.pathname === '/departments/mass-spec' ||
                        location.pathname === '/departments/processing-lab' ||
                        location.pathname === '/departments/rd' ||
                        location.pathname === '/departments/screening' ||
                        location.pathname === '/departments/shipping' ||
                        location.pathname === '/departments/qc-qa') && (
                        <BottomNavigationAction
                            label="Download"
                            onClick={handleDownloadClick}
                            icon={<DownloadIcon color="primary" sx={{ fontSize: 40 }} />}
                        />
                    )}
                    {(location.pathname === '/general-request/list' ||
                        location.pathname === '/office-supply-request/list' ||
                        location.pathname === '/store-room-request/list') && (
                        <BottomNavigationAction
                            label="Review"
                            onClick={handleReviewClick}
                            icon={<PreviewIcon color="primary" sx={{ fontSize: 40 }} />}
                            disabled={requestMasterItemsCheckedSelector.requestMasterItemsChecked.length === 0}
                        />
                    )}
                    {(location.pathname === '/general-request/confirmation' ||
                        location.pathname === '/office-supply-request/confirmation' ||
                        location.pathname === '/store-room-request/confirmation') && (
                        <BottomNavigationAction
                            label="Send"
                            onClick={handleEditClick}
                            icon={<EditIcon color="primary" sx={{ fontSize: 40 }} />}
                            disabled={
                                requestMasterItemsPendingCheckedSelector.requestMasterItemsPendingChecked.length === 0
                            }
                        />
                    )}
                    {(location.pathname === '/general-request/confirmation' ||
                        location.pathname === '/office-supply-request/confirmation' ||
                        location.pathname === '/store-room-request/confirmation') && (
                        <BottomNavigationAction
                            label="Send"
                            onClick={handleEditClick}
                            icon={<SendIcon />}
                            disabled={
                                requestMasterItemsPendingCheckedSelector.requestMasterItemsPendingChecked.length === 0
                            }
                        />
                    )}
                    {location.pathname === '/admin/master' && (
                        <BottomNavigationAction
                            label="Add Item"
                            onClick={handleAddClick}
                            icon={<AddBoxIcon color="primary" sx={{ fontSize: 40 }} />}
                        />
                    )}
                </Box>
            </BottomNavigation>
        </Paper>
    );
};

export default NavbarBottom;
