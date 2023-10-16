import { Box, Grid } from '@mui/material';
import { selectProfileDetail } from '../app/slice/profileDetail/profileDetailSlice';
import { useAppSelector } from '../app/hooks';
import Drawer from './drawers/Drawers';
import { Outlet } from 'react-router-dom';
import MenuAdmin from './menu/MenuAdmin';
import NavbarBottom from './navbar/NavbarBottom';
import { Fragment } from 'react';
import MenuSub from './menu/MenuSub';

const Layout = () => {
    const profileDetailSelector = useAppSelector(selectProfileDetail);

    return (
        <Grid container sx={{ height: '100%' }} direction="column" border={'1px solid red'}>
            <Grid item>
                <MenuAdmin />
            </Grid>
            <Grid item flexGrow={1}>
                <Outlet />
            </Grid>
            <Drawer />
        </Grid>

        // <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 2px)', border: '1px solid red' }}>
        //     {/* <Box>
        //         {profileDetailSelector.profileDetail?.role === ROLE.ADMINISTRATION ? <MenuAdmin /> : <MenuDepartment />}
        //         <MenuSub />
        //     </Box> */}
        //     <Box sx={{ padding: 1, flex: 1 }}>
        //         <Outlet />
        //         <Drawer />
        //     </Box>
        //     {/* <NavbarBottom /> */}
        // </Box>
    );
};

export default Layout;
