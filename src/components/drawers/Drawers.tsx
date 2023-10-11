import { useAppSelector } from '../../app/hooks';
import { selectDrawerToggleType } from '../../app/slice/drawerToggle/drawerToggleTypeSlice';
import { DRAWER_TOGGLE_TYPE } from '../../common/constants';
import { Drawer } from '@mui/material';
import MasterUpdateForm from '../forms/MasterUpdateForm';
import MasterCreateForm from '../forms/MasterCreateForm';
import StoreRoomItemUpdateForm from '../forms/StoreRoomItemUpdateForm';

const Drawers = () => {
    const { type, masterItem } = useAppSelector(selectDrawerToggleType);
    return (
        <div>
            <Drawer anchor="bottom" open={type === DRAWER_TOGGLE_TYPE.UPDATE_MASTER_ITEM}>
                <MasterUpdateForm />
            </Drawer>
            <Drawer anchor="bottom" open={type === DRAWER_TOGGLE_TYPE.ADD_MASTER_ITEM}>
                <MasterCreateForm />
            </Drawer>
            <Drawer anchor="bottom" open={type === DRAWER_TOGGLE_TYPE.UPDATE_STORE_ROOM_ITEM}>
                <StoreRoomItemUpdateForm />
            </Drawer>
        </div>
    );
};

export default Drawers;
