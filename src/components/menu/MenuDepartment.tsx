import { AppBar, Box, Button, Toolbar } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../images/logo.png';
import Profile from '../Profile';
import { selectProfileDetail } from '../../app/slice/profileDetail/profileDetailSlice';
import { DEPARTMENT } from '../../common/constants';
import { useAppSelector } from '../../app/hooks';

const MenuDepartment = () => {
    const location = useLocation();
    const { state, pathname } = location;
    const profileDetailSelector = useAppSelector(selectProfileDetail);

    return (
        <AppBar position="static" elevation={5} sx={{ backgroundColor: '#1347a4' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                    <img src={logo} alt={'USDTL IMS'} style={{ height: 40 }} />
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    {profileDetailSelector.profileDetail?.department === DEPARTMENT.EXTRACTIONS && (
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
                    )}
                    {profileDetailSelector.profileDetail?.department === DEPARTMENT.MASS_SPEC && (
                        <Button
                            sx={{
                                color: pathname === '/departments/mass-spec' ? 'yellow' : '#fff',
                                fontWeight: '700'
                            }}
                            component={Link}
                            to="/departments/mass-spec"
                            state="mass-spec">
                            mass-spec
                        </Button>
                    )}
                    {profileDetailSelector.profileDetail?.department === DEPARTMENT.PROCESSING_LAB && (
                        <Button
                            sx={{
                                color: pathname === '/departments/processing-lab' ? 'yellow' : '#fff',
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
                                color: pathname === '/departments/rd' ? 'yellow' : '#fff',
                                fontWeight: '700'
                            }}
                            component={Link}
                            to="/departments/rd"
                            state="rd">
                            r&d
                        </Button>
                    )}
                    {profileDetailSelector.profileDetail?.department === DEPARTMENT.SCREENING && (
                        <Button
                            sx={{
                                color: pathname === '/departments/screening' ? 'yellow' : '#fff',
                                fontWeight: '700'
                            }}
                            component={Link}
                            to="/departments/screening"
                            state="screening">
                            screening
                        </Button>
                    )}
                    {profileDetailSelector.profileDetail?.department === DEPARTMENT.SHIPPING && (
                        <Button
                            sx={{
                                color: pathname === '/departments/shipping' ? 'yellow' : '#fff',
                                fontWeight: '700'
                            }}
                            component={Link}
                            to="/departments/shipping"
                            state="shipping">
                            shipping
                        </Button>
                    )}
                    {profileDetailSelector.profileDetail?.department === DEPARTMENT.SHIPPING && (
                        <Button
                            sx={{
                                color: pathname === '/departments/qc-internal-standards' ? 'yellow' : '#fff',
                                fontWeight: '700'
                            }}
                            component={Link}
                            to="/departments/qc-internal-standards"
                            state="qc-internal-standards">
                            qc internal standards
                        </Button>
                    )}
                    {profileDetailSelector.profileDetail?.department === DEPARTMENT.QC_QA && (
                        <Button
                            sx={{
                                color: pathname === '/departments/qc-qa' ? 'yellow' : '#fff',
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
                            color: location.state.requestCategory === 'general-request' ? 'yellow' : '#fff',
                            fontWeight: '700'
                        }}
                        component={Link}
                        to={`/requests/general-request/list`}
                        state={{
                            requestCategory: 'general-request',
                            department: profileDetailSelector.profileDetail.department.toLowerCase().replace('_', '-')
                        }}>
                        general request
                    </Button>
                    <Button
                        sx={{
                            color: state.requestCategory === 'office-supply-request' ? 'yellow' : '#fff',
                            fontWeight: '700'
                        }}
                        component={Link}
                        to={`/requests/office-supply-request/list`}
                        state={{
                            requestCategory: 'office-supply-request',
                            department: profileDetailSelector.profileDetail.department.toLowerCase().replace('_', '-')
                        }}>
                        office supply request
                    </Button>
                    <Button
                        sx={{
                            color: state.requestCategory === 'store-room-request' ? 'yellow' : '#fff',
                            fontWeight: '700'
                        }}
                        component={Link}
                        to={`/requests/store-room-request/list`}
                        state={{
                            requestCategory: 'store-room-request',
                            department: profileDetailSelector.profileDetail.department.toLowerCase().replace('_', '-')
                        }}>
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
