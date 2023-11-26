import { AppBar, Box, Button, Menu, MenuItem, Toolbar } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../images/logo.png';
import Profile from '../Profile';
import { useState, MouseEvent } from 'react';

const MenuAdmin = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { pathname } = location;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [currentRequest, setCurrentRequest] = useState<
        'request' | 'general-request' | 'office-supply-request' | 'store-room-request'
    >('request');
    const open = Boolean(anchorEl);
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (request: 'general-request' | 'office-supply-request' | 'store-room-request') => {
        if (request === 'general-request' || request === 'office-supply-request' || request === 'store-room-request') {
            setCurrentRequest(request);
            navigate(`/admin/dashboard/requests/extractions/${request}`, {
                state: { requestCategory: 'store-room-request', view: 'admin', department: 'extractions' }
            });
        }
        setAnchorEl(null);
    };

    return (
        <AppBar position="static" elevation={5} color="primary">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                    <img src={logo} alt={'USDTL IMS'} style={{ height: 40 }} />
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Button
                        size="small"
                        sx={{
                            color: pathname === '/admin/master' ? 'yellow' : '#fff',
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
                            color: pathname === '/admin/store-room' ? 'yellow' : '#fff',
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
                            color: pathname === '/departments/extractions' ? 'yellow' : '#fff',
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
                            color: pathname === '/departments/mass-spec' ? 'yellow' : '#fff',
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
                            color: pathname === '/departments/rd' ? 'yellow' : '#fff',
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
                            color: pathname === '/departments/screening' ? 'yellow' : '#fff',
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
                            color: pathname === '/departments/shipping' ? 'yellow' : '#fff',
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
                            color: pathname === '/departments/processing-lab' ? 'yellow' : '#fff',
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
                            color: pathname === '/departments/qc-internal-standards' ? 'yellow' : '#fff',
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
                            color: pathname === '/departments/qc-qa' ? 'yellow' : '#fff',
                            fontWeight: '700'
                        }}
                        component={Link}
                        to="departments/qc-qa"
                        state="qc-qa">
                        qc-qa
                    </Button>
                    <div>
                        <Button
                            color="inherit"
                            sx={{
                                fontWeight: '700'
                            }}
                            size="small"
                            id="basic-button"
                            aria-controls={anchorEl ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={anchorEl ? 'true' : undefined}
                            onClick={handleClick}>
                            {currentRequest}
                        </Button>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button'
                            }}>
                            <MenuItem onClick={() => handleClose('general-request')}>General Request</MenuItem>
                            <MenuItem onClick={() => handleClose('office-supply-request')}>
                                Office Supply Request
                            </MenuItem>
                            <MenuItem onClick={() => handleClose('store-room-request')}>Store Room Request</MenuItem>
                        </Menu>
                    </div>
                    <Button
                        size="small"
                        variant="contained"
                        color="warning"
                        disableElevation
                        component={Link}
                        to="/admin/dashboard/access-manager"
                        state={{}}>
                        dashboard
                    </Button>
                </Box>
                <Box>
                    <Profile />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default MenuAdmin;
