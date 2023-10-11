import {
    Button,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from '@mui/material';
import { ChangeEvent, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { toggleDrawer } from '../../app/slice/drawerToggle/drawerToggleTypeSlice';
import { useLocation } from 'react-router-dom';
import {
    changeRequestMasterItemsChecked,
    selectRequestMasterItemsChecked
} from '../../app/slice/request/requestMasterItemsCheckedSlice';

const columns: { field: string; headerName: string | JSX.Element }[] = [
    { field: 'item', headerName: 'Item' },
    { field: 'quantity', headerName: 'Quantity' },
    { field: 'custom_text', headerName: 'Cutom Text' }
];

const RequestItemEditForm = () => {
    const inputRef = useRef<HTMLDivElement | null>(null);
    const requestMasterItemsCheckedSelector = useAppSelector(selectRequestMasterItemsChecked);
    const location = useLocation();
    const dispatch = useAppDispatch();

    const handleClose = () => {
        dispatch(toggleDrawer({ type: '' }));
    };
    const handleCustomTextChange = (event: ChangeEvent<HTMLInputElement>, request_item_id: number) => {
        dispatch(
            changeRequestMasterItemsChecked(
                requestMasterItemsCheckedSelector.requestMasterItemsChecked.map((item) => ({
                    ...item,
                    custom_text: item.id === request_item_id ? event.target.value : item.customText
                }))
            )
        );
    };

    const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>, id: number) => {
        dispatch(
            changeRequestMasterItemsChecked(
                requestMasterItemsCheckedSelector.requestMasterItemsChecked.map((item) => ({
                    ...item,
                    quantity: item.id === id ? parseInt(event.target.value) : item.quantity
                }))
            )
        );
    };

    const handleSubmit = () => {
        // dispatch(
        //     updateRequestMasterItemsThunk({
        //         state: location.state,
        //         requestMasterItems: requestMasterItemsCheckedSelector.requestMasterItemsChecked.map((item) => ({
        //             quantity: 0,
        //             department: 'EXTRACTIONS',
        //             user: 'Batsaikhan Ulambayar',
        //             detail: 'detail',
        //             confirmation: item.confiration,
        //             custom_text: 'cutom text',
        //             location: 'store room',
        //             request_item_id: item.request_item_id,
        //             master_item_id: item.master_item_id,
        //             item: item.item
        //         }))
        //     })
        // );
    };

    return (
        <Stack direction="column" justifyContent="space-between" sx={{ padding: 2, minHeight: 300 }}>
            <TableContainer component={Paper}>
                <Table size="medium">
                    <TableHead>
                        <TableRow>
                            {columns.length > 0 &&
                                columns.map((column) => <TableCell key={column.field}>{column.headerName}</TableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requestMasterItemsCheckedSelector &&
                            requestMasterItemsCheckedSelector.requestMasterItemsChecked &&
                            requestMasterItemsCheckedSelector.requestMasterItemsChecked.length > 0 &&
                            requestMasterItemsCheckedSelector.requestMasterItemsChecked.map(
                                (requestMasterCheckedItem, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{requestMasterCheckedItem.item}</TableCell>
                                        <TableCell>
                                            <TextField
                                                ref={inputRef}
                                                sx={{ maxWidth: 120 }}
                                                type="number"
                                                InputProps={{
                                                    inputProps: { min: 0 }
                                                }}
                                                size="small"
                                                value={requestMasterCheckedItem.quantity}
                                                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                                    handleQuantityChange(event, requestMasterCheckedItem.id)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                ref={inputRef}
                                                sx={{ minWidth: 300 }}
                                                size="small"
                                                value={requestMasterCheckedItem.customText}
                                                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                                    handleCustomTextChange(event, requestMasterCheckedItem.id)
                                                }
                                            />
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Stack
                direction="row"
                justifyContent="space-around"
                alignItems="stretch"
                sx={{ padding: 2, height: '100%' }}>
                <Button onClick={handleSubmit}>SUBMIT </Button>
                <Button onClick={handleClose}>CLOSE </Button>
            </Stack>
        </Stack>
    );
};

export default RequestItemEditForm;
