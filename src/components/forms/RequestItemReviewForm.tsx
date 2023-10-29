import {
    Box,
    Button,
    ButtonGroup,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    TextField
} from '@mui/material';
import { ChangeEvent, Fragment, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useLocation } from 'react-router-dom';
import { createRequestMasterItemsThunk } from '../../app/slice/request/requestMasterItemsCreateSlice';
import { toggleRequestItemDrawer } from '../../app/slice/drawerToggle/requestDrawerSlice';
import {
    handleRequestMasterItemsPurchaseSelected,
    selectRequestMasterItemsPurchaseSelected
} from '../../app/slice/selectedRequests/requestMasterItemsPurchaseSelectedSlice';
import { selectProfileDetail } from '../../app/slice/profileDetail/profileDetailSlice';
import { IRequestMaster } from '../../app/api/properties/IRequest';

const RequestItemReviewForm = () => {
    const profileDetailSelector = useAppSelector(selectProfileDetail);
    const inputRef = useRef<HTMLDivElement | null>(null);
    const requestMasterItemsPurchaseSelectedSelector = useAppSelector(selectRequestMasterItemsPurchaseSelected);
    const location = useLocation();
    const dispatch = useAppDispatch();

    const { state } = location;

    const handleClose = () => {
        dispatch(toggleRequestItemDrawer(''));
    };
    const handleTextFieldChange = (event: ChangeEvent<HTMLInputElement>, requestItemId: number) => {
        dispatch(
            handleRequestMasterItemsPurchaseSelected(
                requestMasterItemsPurchaseSelectedSelector.requestMasterItems.map((item) => ({
                    ...item,
                    [event.target.name]:
                        item.id === requestItemId
                            ? event.target.name === 'quantity'
                                ? parseInt(event.target.value)
                                : event.target.value
                            : item[event.target.name as keyof IRequestMaster]
                }))
            )
        );
    };

    const handleSubmit = () => {
        dispatch(
            createRequestMasterItemsThunk({
                department: profileDetailSelector.profileDetail.department.toLowerCase().replace(' ', '_'),
                requestCategory: state.requestCategory,
                requestMasterItems: requestMasterItemsPurchaseSelectedSelector.requestMasterItems.map((item) => ({
                    ...item,
                    quantity: item.quantity,
                    requester: profileDetailSelector.profileDetail.displayName,
                    customDetail: item.customDetail,
                    customText: item.customDetail,
                    location: item.location,
                    itemId: item.masterItem.id
                }))
            })
        )
            .then((response) => {
                handleRequestMasterItemsPurchaseSelected([]);
                toggleRequestItemDrawer('');
            })
            .catch((error: Error) => console.error(error.message));
    };

    const handleRemoveSelectedItem = (requestItemId: number) => {
        dispatch(
            handleRequestMasterItemsPurchaseSelected([
                ...requestMasterItemsPurchaseSelectedSelector.requestMasterItems.filter(
                    (item) => item.id !== requestItemId
                )
            ])
        );
    };

    return (
        <Grid container direction="column" justifyContent="space-between" sx={{ height: '100%', width: 600 }}>
            <Grid item padding={1} sx={{ overFlowY: 'auto' }}>
                <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
                {requestMasterItemsPurchaseSelectedSelector.requestMasterItems &&
                    requestMasterItemsPurchaseSelectedSelector.requestMasterItems &&
                    requestMasterItemsPurchaseSelectedSelector.requestMasterItems.length > 0 &&
                    requestMasterItemsPurchaseSelectedSelector.requestMasterItems.map((requestMasterItem, index) => (
                        <Fragment key={index}>
                            <Card>
                                <CardHeader
                                    title={requestMasterItem.masterItem.item}
                                    titleTypographyProps={{ fontSize: 14 }}
                                />
                                <CardContent>
                                    <Grid container direction="column" spacing={3}>
                                        <Grid item>
                                            <TextField
                                                label="Quantity"
                                                name="quantity"
                                                InputLabelProps={{ shrink: true }}
                                                fullWidth
                                                ref={inputRef}
                                                type="number"
                                                InputProps={{
                                                    inputProps: { min: 0 }
                                                }}
                                                size="small"
                                                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                                    handleTextFieldChange(event, requestMasterItem.id)
                                                }
                                            />
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                label="Custom Text"
                                                name="customText"
                                                InputLabelProps={{ shrink: true }}
                                                fullWidth
                                                ref={inputRef}
                                                size="small"
                                                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                                    handleTextFieldChange(event, requestMasterItem.id)
                                                }
                                            />
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                label="Custom Detail"
                                                name="customDetail"
                                                InputLabelProps={{ shrink: true }}
                                                fullWidth
                                                ref={inputRef}
                                                size="small"
                                                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                                    handleTextFieldChange(event, requestMasterItem.id)
                                                }
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                                <Box display="flex" justifyContent="flex-end">
                                    <CardActions>
                                        <Button onClick={() => handleRemoveSelectedItem(requestMasterItem.id)}>
                                            Delete
                                        </Button>
                                    </CardActions>
                                </Box>
                            </Card>
                            <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
                        </Fragment>
                    ))}
            </Grid>
            <Grid item sx={{ padding: 2 }}>
                <ButtonGroup fullWidth variant="text">
                    <Button onClick={handleSubmit}>SUBMIT </Button>
                    <Button onClick={handleClose}>CLOSE </Button>
                </ButtonGroup>
            </Grid>
        </Grid>
    );
};

export default RequestItemReviewForm;
