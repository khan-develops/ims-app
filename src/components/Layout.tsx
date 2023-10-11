import { Outlet } from 'react-router-dom';
import NavbarBottom from './navbar/NavbarBottom';
import { Box } from '@mui/material';
import MenuSub from './menu/MenuSub';
import MenuAdmin from './menu/MenuAdmin';
import MenuDepartment from './menu/MenuDepartment';
import { selectProfileDetail } from '../app/slice/profileDetail/profileDetailSlice';
import { useAppSelector } from '../app/hooks';
import { ROLE } from '../common/constants';
import Drawer from './drawers/Drawers';

const Layout = () => {
    const profileDetailSelector = useAppSelector(selectProfileDetail);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Box>
                {profileDetailSelector.profileDetail?.role === ROLE.ADMINISTRATION ? <MenuAdmin /> : <MenuDepartment />}
                <MenuSub />
            </Box>
            <Box sx={{ padding: 1, flex: 1 }}>
                <Outlet />
                <Drawer />
            </Box>
            <NavbarBottom />
        </Box>
    );
};

export default Layout;
