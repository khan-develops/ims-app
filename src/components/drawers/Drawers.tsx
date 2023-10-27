import { useAppSelector } from '../../app/hooks';
import { Drawer } from '@mui/material';
import MasterUpdateForm from '../forms/MasterUpdateForm';
import MasterCreateForm from '../forms/MasterCreateForm';
import StoreRoomItemUpdateForm from '../forms/StoreRoomItemUpdateForm';
import { selectMasterDrawer } from '../../app/slice/drawerToggle/masterDrawerSlice';

const Drawers = () => {
    const { toggleType } = useAppSelector(selectMasterDrawer);
    return (
        <div>
            <Drawer anchor="bottom" open={toggleType === 'UPDATE_MASTER_ITEM'}>
                <MasterUpdateForm />
            </Drawer>
            <Drawer anchor="bottom" open={toggleType === 'ADD_MASTER_ITEM'}>
                <MasterCreateForm />
            </Drawer>
            <Drawer anchor="bottom" open={toggleType === 'UPDATE_STORE_ROOM_ITEM'}>
                <StoreRoomItemUpdateForm />
            </Drawer>
        </div>
    );
};

export default Drawers;
