import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import Dashboard from './pages/Dashboard';
import Departments from './pages/DepartmentsMaster';
import Master from './pages/Master';
import StoreRoomMaster from './pages/StoreRoomMaster';
import RequestMaster from './pages/RequestMaster';
import RequestMasterDashboard from './pages/RequestMasterDashboard';
import Layout from './components/Layout';
import { Box, ThemeProvider, createTheme } from '@mui/material';
import Auth from './pages/Auth';
import RequestMasterItems from './components/requests/RequestMasterItemsPurchase';
import RequestMasterComplete from './components/requests/RequestMasterItemsComplete';
import RequestMasterPending from './components/requests/RequestMasterItemsPending';
import MinMaxItems from './pages/MinMaxItems';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />}>
            <Route path="admin">
                <Route path="dashboard">
                    <Route path="min-max-order">
                        <Route path="extractions" element={<MinMaxItems />} />
                        <Route path="mass-spec" element={<MinMaxItems />} />
                        <Route path="processing-lab" element={<MinMaxItems />} />
                        <Route path="rd" element={<MinMaxItems />} />
                        <Route path="screening" element={<MinMaxItems />} />
                        <Route path="shipping" element={<MinMaxItems />} />
                        <Route path="shipping" element={<MinMaxItems />} />
                        <Route path="qc-internal-standards" element={<MinMaxItems />} />
                        <Route path="qc-qa" element={<MinMaxItems />} />
                    </Route>
                    <Route path="access-manager" element={<Dashboard />} />
                    <Route path="requests">
                        <Route path="mass-spec">
                            <Route path="general-request" element={<RequestMasterDashboard />} />
                            <Route path="office-supply-request" element={<RequestMasterDashboard />} />
                            <Route path="store-room-request" element={<RequestMasterDashboard />} />
                        </Route>
                        <Route path="processing-lab">
                            <Route path="general-request" element={<RequestMasterDashboard />} />
                            <Route path="office-supply-request" element={<RequestMasterDashboard />} />
                            <Route path="store-room-request" element={<RequestMasterDashboard />} />
                        </Route>
                        <Route path="rd">
                            <Route path="general-request" element={<RequestMasterDashboard />} />
                            <Route path="office-supply-request" element={<RequestMasterDashboard />} />
                            <Route path="store-room-request" element={<RequestMasterDashboard />} />
                        </Route>
                        <Route path="screening">
                            <Route path="general-request" element={<RequestMasterDashboard />} />
                            <Route path="office-supply-request" element={<RequestMasterDashboard />} />
                            <Route path="store-room-request" element={<RequestMasterDashboard />} />
                        </Route>
                        <Route path="shipping">
                            <Route path="general-request" element={<RequestMasterDashboard />} />
                            <Route path="office-supply-request" element={<RequestMasterDashboard />} />
                            <Route path="store-room-request" element={<RequestMasterDashboard />} />
                        </Route>
                        <Route path="shipping">
                            <Route path="general-request" element={<RequestMasterDashboard />} />
                            <Route path="office-supply-request" element={<RequestMasterDashboard />} />
                            <Route path="store-room-request" element={<RequestMasterDashboard />} />
                        </Route>
                        <Route path="qc-internal-standards">
                            <Route path="general-request" element={<RequestMasterDashboard />} />
                            <Route path="office-supply-request" element={<RequestMasterDashboard />} />
                            <Route path="store-room-request" element={<RequestMasterDashboard />} />
                        </Route>
                        <Route path="qc-qa">
                            <Route path="general-request" element={<RequestMasterDashboard />} />
                            <Route path="office-supply-request" element={<RequestMasterDashboard />} />
                            <Route path="store-room-request" element={<RequestMasterDashboard />} />
                        </Route>
                        <Route path="extractions">
                            <Route path="general-request" element={<RequestMasterDashboard />} />
                            <Route path="office-supply-request" element={<RequestMasterDashboard />} />
                            <Route path="store-room-request" element={<RequestMasterDashboard />} />
                        </Route>
                    </Route>
                </Route>

                <Route path="master" element={<Master />} />
                <Route path="store-room" element={<StoreRoomMaster />} />
            </Route>
            <Route path="departments">
                <Route path="extractions" element={<Departments />} />
                <Route path="mass-spec" element={<Departments />} />
                <Route path="processing-lab" element={<Departments />} />
                <Route path="rd" element={<Departments />} />
                <Route path="screening" element={<Departments />} />
                <Route path="shipping" element={<Departments />} />
                <Route path="shipping" element={<Departments />} />
                <Route path="qc-internal-standards" element={<Departments />} />
                <Route path="qc-qa" element={<Departments />} />
            </Route>
            <Route path="requests">
                <Route path="general-request" element={<RequestMaster />}>
                    <Route path="mass-spec">
                        <Route path="confirmation" element={<RequestMasterPending />} />
                        <Route path="status" element={<RequestMasterComplete />} />
                    </Route>
                    <Route path="list" element={<RequestMasterItems />} />
                </Route>
                <Route path="office-supply-request" element={<RequestMaster />}>
                    <Route path="list" element={<RequestMasterItems />} />
                    <Route path="mass-spec">
                        <Route path="confirmation" element={<RequestMasterPending />} />
                        <Route path="status" element={<RequestMasterComplete />} />
                    </Route>
                </Route>
                <Route path="store-room-request" element={<RequestMaster />}>
                    <Route path="list" element={<RequestMasterItems />} />
                    <Route path="mass-spec">
                        <Route path="confirmation" element={<RequestMasterPending />} />
                        <Route path="status" element={<RequestMasterComplete />} />
                    </Route>
                </Route>
                <Route path="general-request" element={<RequestMaster />}>
                    <Route path="list" element={<RequestMasterItems />} />
                    <Route path="processing-lab">
                        <Route path="confirmation" element={<RequestMasterPending />} />
                        <Route path="status" element={<RequestMasterComplete />} />
                    </Route>
                </Route>
                <Route path="office-supply-request" element={<RequestMaster />}>
                    <Route path="list" element={<RequestMasterItems />} />
                    <Route path="processing-lab">
                        <Route path="confirmation" element={<RequestMasterPending />} />
                        <Route path="status" element={<RequestMasterComplete />} />
                    </Route>
                </Route>
                <Route path="store-room-request" element={<RequestMaster />}>
                    <Route path="list" element={<RequestMasterItems />} />
                    <Route path="processing-lab">
                        <Route path="confirmation" element={<RequestMasterPending />} />
                        <Route path="status" element={<RequestMasterComplete />} />
                    </Route>
                </Route>
                <Route path="rd">
                    {' '}
                    <Route path="general-request" element={<RequestMaster />}>
                        <Route path="list" element={<RequestMasterItems />} />
                        <Route path="confirmation" element={<RequestMasterPending />} />
                        <Route path="status" element={<RequestMasterComplete />} />
                    </Route>
                    <Route path="office-supply-request" element={<RequestMaster />}>
                        <Route path="list" element={<RequestMasterItems />} />
                        <Route path="confirmation" element={<RequestMasterPending />} />
                        <Route path="status" element={<RequestMasterComplete />} />
                    </Route>
                    <Route path="store-room-request" element={<RequestMaster />}>
                        <Route path="list" element={<RequestMasterItems />} />
                        <Route path="confirmation" element={<RequestMasterPending />} />
                        <Route path="status" element={<RequestMasterComplete />} />
                    </Route>
                </Route>
                <Route path="screening">
                    {' '}
                    <Route path="general-request" element={<RequestMaster />}>
                        <Route path="list" element={<RequestMasterItems />} />
                        <Route path="confirmation" element={<RequestMasterPending />} />
                        <Route path="status" element={<RequestMasterComplete />} />
                    </Route>
                    <Route path="office-supply-request" element={<RequestMaster />}>
                        <Route path="list" element={<RequestMasterItems />} />
                        <Route path="confirmation" element={<RequestMasterPending />} />
                        <Route path="status" element={<RequestMasterComplete />} />
                    </Route>
                    <Route path="store-room-request" element={<RequestMaster />}>
                        <Route path="list" element={<RequestMasterItems />} />
                        <Route path="confirmation" element={<RequestMasterPending />} />
                        <Route path="status" element={<RequestMasterComplete />} />
                    </Route>
                </Route>
                <Route path="shipping">
                    {' '}
                    <Route path="general-request" element={<RequestMaster />}>
                        <Route path="list" element={<RequestMasterItems />} />
                        <Route path="confirmation" element={<RequestMasterPending />} />
                        <Route path="status" element={<RequestMasterComplete />} />
                    </Route>
                    <Route path="office-supply-request" element={<RequestMaster />}>
                        <Route path="list" element={<RequestMasterItems />} />
                        <Route path="confirmation" element={<RequestMasterPending />} />
                        <Route path="status" element={<RequestMasterComplete />} />
                    </Route>
                    <Route path="store-room-request" element={<RequestMaster />}>
                        <Route path="list" element={<RequestMasterItems />} />
                        <Route path="confirmation" element={<RequestMasterPending />} />
                        <Route path="status" element={<RequestMasterComplete />} />
                    </Route>
                </Route>
                <Route path="shipping">
                    {' '}
                    <Route path="general-request" element={<RequestMaster />}>
                        <Route path="list" element={<RequestMasterItems />} />
                        <Route path="confirmation" element={<RequestMasterPending />} />
                        <Route path="status" element={<RequestMasterComplete />} />
                    </Route>
                    <Route path="office-supply-request" element={<RequestMaster />}>
                        <Route path="list" element={<RequestMasterItems />} />
                        <Route path="confirmation" element={<RequestMasterPending />} />
                        <Route path="status" element={<RequestMasterComplete />} />
                    </Route>
                    <Route path="store-room-request" element={<RequestMaster />}>
                        <Route path="list" element={<RequestMasterItems />} />
                        <Route path="confirmation" element={<RequestMasterPending />} />
                        <Route path="status" element={<RequestMasterComplete />} />
                    </Route>
                </Route>
                <Route path="qc-internal-standards">
                    {' '}
                    <Route path="general-request" element={<RequestMaster />}>
                        <Route path="list" element={<RequestMasterItems />} />
                        <Route path="confirmation" element={<RequestMasterPending />} />
                        <Route path="status" element={<RequestMasterComplete />} />
                    </Route>
                    <Route path="office-supply-request" element={<RequestMaster />}>
                        <Route path="list" element={<RequestMasterItems />} />
                        <Route path="confirmation" element={<RequestMasterPending />} />
                        <Route path="status" element={<RequestMasterComplete />} />
                    </Route>
                    <Route path="store-room-request" element={<RequestMaster />}>
                        <Route path="list" element={<RequestMasterItems />} />
                        <Route path="confirmation" element={<RequestMasterPending />} />
                        <Route path="status" element={<RequestMasterComplete />} />
                    </Route>
                </Route>
                <Route path="qc-qa">
                    {' '}
                    <Route path="general-request" element={<RequestMaster />}>
                        <Route path="list" element={<RequestMasterItems />} />
                        <Route path="confirmation" element={<RequestMasterPending />} />
                        <Route path="status" element={<RequestMasterComplete />} />
                    </Route>
                    <Route path="office-supply-request" element={<RequestMaster />}>
                        <Route path="list" element={<RequestMasterItems />} />
                        <Route path="confirmation" element={<RequestMasterPending />} />
                        <Route path="status" element={<RequestMasterComplete />} />
                    </Route>
                    <Route path="store-room-request" element={<RequestMaster />}>
                        <Route path="list" element={<RequestMasterItems />} />
                        <Route path="confirmation" element={<RequestMasterPending />} />
                        <Route path="status" element={<RequestMasterComplete />} />
                    </Route>
                </Route>
                <Route path="extractions">
                    <Route path="general-request" element={<RequestMaster />}>
                        <Route path="list" element={<RequestMasterItems />} />
                        <Route path="confirmation" element={<RequestMasterPending />} />
                        <Route path="status" element={<RequestMasterComplete />} />
                    </Route>
                    <Route path="office-supply-request" element={<RequestMaster />}>
                        <Route path="list" element={<RequestMasterItems />} />
                        <Route path="confirmation" element={<RequestMasterPending />} />
                        <Route path="status" element={<RequestMasterComplete />} />
                    </Route>
                    <Route path="store-room-request" element={<RequestMaster />}>
                        <Route path="list" element={<RequestMasterItems />} />
                        <Route path="confirmation" element={<RequestMasterPending />} />
                        <Route path="status" element={<RequestMasterComplete />} />
                    </Route>
                </Route>
            </Route>
        </Route>
    )
);

const theme = createTheme({
    palette: {
        primary: {
            main: '#1347a4' // your primary color
        },
        secondary: {
            main: '#2f3643' // your secondary color
        }
    }
});

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ height: '100%' }}>
                <UnauthenticatedTemplate>
                    <Auth />
                </UnauthenticatedTemplate>
                <AuthenticatedTemplate>
                    <RouterProvider router={router} />
                </AuthenticatedTemplate>
            </Box>
        </ThemeProvider>
    );
};

export default App;
