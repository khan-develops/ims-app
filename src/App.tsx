import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import Dashboard from './pages/Dashboard';
import Departments from './pages/DepartmentsMaster';
import Master from './pages/Master';
import StoreRoomMaster from './pages/StoreRoomMaster';
import RequestMaster from './pages/RequestMaster';
import RequestMasterAdmin from './pages/RequestMasterDashboard';
import Layout from './components/Layout';
import { Box, ThemeProvider, createTheme } from '@mui/material';
import Auth from './pages/Auth';
import RequestMasterItems from './components/RequestMasterItems';
import RequestMasterComplete from './components/RequestMasterItemsComplete';
import RequestMasterPending from './components/RequestMasterItemsPending';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />}>
            <Route path="admin">
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="master" element={<Master />} />
                <Route path="store-room" element={<StoreRoomMaster />} />
                <Route path="general-request-dashboard" element={<RequestMasterAdmin />} />
                <Route path="office-supply-request-dashboard" element={<RequestMasterAdmin />} />
                <Route path="store-room-request-dashboard" element={<RequestMasterAdmin />} />
            </Route>
            <Route path='requests'>
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
