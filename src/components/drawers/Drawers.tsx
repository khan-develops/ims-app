import { useAppSelector } from '../../app/hooks';
import { Drawer } from '@mui/material';
import MasterUpdateForm from '../forms/MasterUpdateForm';
import MasterCreateForm from '../forms/MasterCreateForm';
import { selectMasterDrawer } from '../../app/slice/drawerToggle/masterDrawerSlice';
import MasterAssignForm from '../forms/MasterAssignForm';
import DepartmentItemUpdateForm from '../forms/DepartmentItemUpdateForm';
import { selectDepartmentDrawer } from '../../app/slice/drawerToggle/departmentDrawerSlice';

const Drawers = () => {
    const masterDrawerSelector = useAppSelector(selectMasterDrawer);
    const departmentDrawerSelector = useAppSelector(selectDepartmentDrawer);
    return (
        <div>
            <Drawer anchor="bottom" open={masterDrawerSelector.drawerType === 'UPDATE_MASTER_ITEM'}>
                <MasterUpdateForm />
            </Drawer>
            <Drawer anchor="bottom" open={masterDrawerSelector.drawerType === 'ADD_MASTER_ITEM'}>
                <MasterCreateForm />
            </Drawer>
            <Drawer anchor="right" open={masterDrawerSelector.drawerType === 'ASSIGN_MASTER_ITEM'}>
                <MasterAssignForm />
            </Drawer>
            <Drawer anchor="bottom" open={departmentDrawerSelector.drawerType === 'UPDATE_DEPARTMENT_ITEM'}>
                <DepartmentItemUpdateForm />
            </Drawer>
            {/* <Drawer anchor="bottom" open={toggleType === 'STORE_ROOM_ADD'}>
                <StoreRoomItemUpdateForm />
            </Drawer> */}
        </div>
    );
};

export default Drawers;
