import { AppBar, Box, Button, Toolbar } from '@mui/material';
import { Link, Outlet, useLocation } from 'react-router-dom';
import logo from '../../images/logo.png';
import Profile from '../Profile';
import { selectProfileDetail } from '../../app/slice/profileDetail/profileDetailSlice';
import { DEPARTMENT } from '../../common/constants';
import { useAppSelector } from '../../app/hooks';

const MenuDepartment = () => {
    const location = useLocation();
    const profileDetailSelector = useAppSelector(selectProfileDetail);

    return (
        <AppBar position="static" elevation={5} sx={{ backgroundColor: '#1347a4' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                    <img src={logo} alt={'USDTL IMS'} style={{ height: 40 }} />
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        sx={{
                            color: location.pathname === '/departments/extractions' ? 'yellow' : '#fff',
                            fontWeight: '700'
                        }}
                        component={Link}
                        to="/departments/extractions"
                        state="extractions">
                        extractions
                    </Button>
                    {profileDetailSelector.profileDetail?.department === DEPARTMENT.EXTRACTIONS && (
                        <Button
                            sx={{
                                color: location.pathname === '/extractions' ? 'yellow' : '#fff',
                                fontWeight: '700'
                            }}
                            component={Link}
                            to="/extractions"
                            state="extractions">
                            extractions
                        </Button>
                    )}
                    {profileDetailSelector.profileDetail?.department === DEPARTMENT.MASS_SPEC && (
                        <Button
                            sx={{
                                color: location.pathname === '/mass-spec' ? 'yellow' : '#fff',
                                fontWeight: '700'
                            }}
                            component={Link}
                            to="/mass-spec"
                            state="mass-spec">
                            mass-spec
                        </Button>
                    )}
                    {profileDetailSelector.profileDetail?.department === DEPARTMENT.PROCESSING_LAB && (
                        <Button
                            sx={{
                                color: location.pathname === '/processing-lab' ? 'yellow' : '#fff',
                                fontWeight: '700'
                            }}
                            component={Link}
                            to="/departments/processing-lab"
                            state="processing-lab">
                            Processing lab
                        </Button>
                    )}
                    {profileDetailSelector.profileDetail?.department === DEPARTMENT.RD && (
                        <Button
                            sx={{
                                color: location.pathname === '/rd' ? 'yellow' : '#fff',
                                fontWeight: '700'
                            }}
                            component={Link}
                            to="/rd"
                            state="rd">
                            r&d
                        </Button>
                    )}
                    {profileDetailSelector.profileDetail?.department === DEPARTMENT.SCREENING && (
                        <Button
                            sx={{
                                color: location.pathname === '/screening' ? 'yellow' : '#fff',
                                fontWeight: '700'
                            }}
                            component={Link}
                            to="/screening"
                            state="screening">
                            screening
                        </Button>
                    )}
                    {profileDetailSelector.profileDetail?.department === DEPARTMENT.SHIPPING && (
                        <Button
                            sx={{
                                color: location.pathname === '/shipping' ? 'yellow' : '#fff',
                                fontWeight: '700'
                            }}
                            component={Link}
                            to="/shipping"
                            state="shipping">
                            shipping
                        </Button>
                    )}
                    {profileDetailSelector.profileDetail?.department === DEPARTMENT.SHIPPING && (
                        <Button
                            sx={{
                                color: location.pathname === '/qc-internal-standards' ? 'yellow' : '#fff',
                                fontWeight: '700'
                            }}
                            component={Link}
                            to="/qc-internal-standards"
                            state="qc-internal-standards">
                            qc internal standards
                        </Button>
                    )}
                    {profileDetailSelector.profileDetail?.department === DEPARTMENT.QC_QA && (
                        <Button
                            sx={{
                                color: location.pathname === '/qc-qa' ? 'yellow' : '#fff',
                                fontWeight: '700'
                            }}
                            component={Link}
                            to="/departments/qc-qa"
                            state="qc-qa">
                            qc-qa
                        </Button>
                    )}
                    <Button
                        sx={{
                            color: location.pathname === '/requests/general-request/list' ? 'yellow' : '#fff',
                            fontWeight: '700'
                        }}
                        component={Link}
                        to="/requests/general-request/list"
                        state="general-request">
                        general request
                    </Button>
                    <Button
                        sx={{
                            color: location.pathname === '/office-supply-request/list' ? 'yellow' : '#fff',
                            fontWeight: '700'
                        }}
                        component={Link}
                        to="/office-supply-request/list"
                        state="office-supply-request">
                        office supply request
                    </Button>
                    <Button
                        sx={{
                            color: location.pathname === '/store-room-request/list' ? 'yellow' : '#fff',
                            fontWeight: '700'
                        }}
                        component={Link}
                        to="/store-room-request/list"
                        state="store-room-request">
                        store room request
                    </Button>
                </Box>

                <Box>
                    <Profile />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default MenuDepartment;
