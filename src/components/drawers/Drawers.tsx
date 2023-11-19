import { useAppSelector } from '../../app/hooks';
import { Drawer } from '@mui/material';
import MasterUpdateForm from '../forms/MasterUpdateForm';
import MasterCreateForm from '../forms/MasterCreateForm';
import StoreRoomItemUpdateForm from '../forms/StoreRoomItemUpdateForm';
import { selectMasterDrawer } from '../../app/slice/drawerToggle/masterDrawerSlice';
import MasterAssignForm from '../forms/MasterAssignForm';

const Drawers = () => {
    const { toggleType } = useAppSelector(selectMasterDrawer);
    return (
        <div>
            <Drawer anchor="bottom" open={toggleType === 'MASTER_UPDATE'}>
                <MasterUpdateForm />
            </Drawer>
            <Drawer anchor="bottom" open={toggleType === 'MASTER_ADD'}>
                <MasterCreateForm />
            </Drawer>
            <Drawer anchor="right" open={toggleType === 'MASTER_ASSIGN'}>
                <MasterAssignForm />
            </Drawer>
            {/* <Drawer anchor="bottom" open={toggleType === 'STORE_ROOM_ADD'}>
                <StoreRoomItemUpdateForm />
            </Drawer> */}
        </div>
    );
};

export default Drawers;
