import { Box, Grid } from '@mui/material';
import { selectProfileDetail } from '../app/slice/profileDetail/profileDetailSlice';
import { useAppSelector } from '../app/hooks';
import Drawer from './drawers/Drawers';
import { Outlet } from 'react-router-dom';
import MenuAdmin from './menu/MenuAdmin';
import NavbarBottom from './navbar/NavbarBottom';
import { Fragment } from 'react';
import MenuSub from './menu/MenuSub';
import MenuDepartment from './menu/MenuDepartment';

const Layout = () => {
    const profileDetailSelector = useAppSelector(selectProfileDetail);

    return (
        <Grid container sx={{ height: '100%' }} direction="column">
            <Grid item>
                {/* <MenuAdmin /> */}
                <MenuDepartment />
            </Grid>
            <Grid item flexGrow={1}>
                <Outlet />
            </Grid>
            <Drawer />
        </Grid>
    );
};

export default Layout;
