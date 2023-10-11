import { AppBar, Box, Button, IconButton, Toolbar } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../images/logo.png';
import Profile from '../Profile';
import DashboardIcon from '@mui/icons-material/Dashboard';

const MenuAdmin = () => {
    const location = useLocation();

    return (
        <AppBar position="static" elevation={5} sx={{ backgroundColor: '#1347a4' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                    <img src={logo} alt={'USDTL IMS'} style={{ height: 40 }} />
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Button
                        size="small"
                        sx={{
                            color: location.pathname === '/admin/master' ? 'yellow' : '#fff',
                            fontWeight: '700'
                        }}
                        component={Link}
                        to="/admin/master"
                        state="master">
                        master
                    </Button>
                    <Button
                        size="small"
                        sx={{
                            color: location.pathname === '/admin/store-room' ? 'yellow' : '#fff',
                            fontWeight: '700'
                        }}
                        component={Link}
                        to="/admin/store-room"
                        state="store-room">
                        store room
                    </Button>
                    <Button
                        size="small"
                        sx={{
                            color: location.pathname === '/departments/extractions' ? 'yellow' : '#fff',
                            fontWeight: '700'
                        }}
                        component={Link}
                        to="/departments/extractions"
                        state="extractions">
                        extractions
                    </Button>
                    <Button
                        size="small"
                        sx={{
                            color: location.pathname === '/departments/mass-spec' ? 'yellow' : '#fff',
                            fontWeight: '700'
                        }}
                        component={Link}
                        to="departments/mass-spec"
                        state="mass-spec">
                        mass spec
                    </Button>
                    <Button
                        size="small"
                        sx={{
                            color: location.pathname === '/departments/rd' ? 'yellow' : '#fff',
                            fontWeight: '700'
                        }}
                        component={Link}
                        to="/departments/rd"
                        state="rd">
                        r&d
                    </Button>
                    <Button
                        size="small"
                        sx={{
                            color: location.pathname === '/departments/screening' ? 'yellow' : '#fff',
                            fontWeight: '700'
                        }}
                        component={Link}
                        to="/departments/screening"
                        state="screening">
                        screening
                    </Button>
                    <Button
                        size="small"
                        sx={{
                            color: location.pathname === '/departments/shipping' ? 'yellow' : '#fff',
                            fontWeight: '700'
                        }}
                        component={Link}
                        to="/departments/shipping"
                        state="shipping">
                        shipping
                    </Button>
                    <Button
                        size="small"
                        sx={{
                            color: location.pathname === '/departments/processing-lab' ? 'yellow' : '#fff',
                            fontWeight: '700'
                        }}
                        component={Link}
                        to="/departments/processing-lab"
                        state="processing-lab">
                        processing lab
                    </Button>
                    <Button
                        size="small"
                        sx={{
                            color: location.pathname === '/departments/qc-internal-standards' ? 'yellow' : '#fff',
                            fontWeight: '700'
                        }}
                        component={Link}
                        to="/departments/qc-internal-standards"
                        state="qc-internal-standards">
                        qc internal standards
                    </Button>
                    <Button
                        size="small"
                        sx={{
                            color: location.pathname === '/departments/qc-qa' ? 'yellow' : '#fff',
                            fontWeight: '700'
                        }}
                        component={Link}
                        to="departments/qc-qa"
                        state="qc-qa">
                        qc-qa
                    </Button>
                    <Button
                        size="small"
                        sx={{
                            color: location.pathname === '/admin/request/general' ? 'yellow' : '#fff',
                            fontWeight: '700'
                        }}
                        component={Link}
                        to="/admin/request/general"
                        state="general">
                        general
                    </Button>
                    <Button
                        size="small"
                        sx={{
                            color: location.pathname === '/admin/request/office-supply' ? 'yellow' : '#fff',
                            fontWeight: '700'
                        }}
                        component={Link}
                        to="/admin/request/office-supply"
                        state="office-supply">
                        office supply
                    </Button>
                    <Button
                        size="small"
                        sx={{
                            color: location.pathname === '/admin/request/store-room' ? 'yellow' : '#fff',
                            fontWeight: '700'
                        }}
                        component={Link}
                        to="/admin/request/store-room"
                        state="store-room">
                        store room
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        color="secondary"
                        sx={{
                            color: location.pathname === '/admin/dashboard' ? 'yellow' : '#fff',
                            fontWeight: '700',
                            border: '1px solid yellow'
                        }}
                        component={Link}
                        to="/admin/dashboard"
                        state="store-room">
                        dashboard
                    </Button>
                    {/* <IconButton>
                        <DashboardIcon />
                    </IconButton> */}
                </Box>
                <Box>
                    <Profile />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default MenuAdmin;
