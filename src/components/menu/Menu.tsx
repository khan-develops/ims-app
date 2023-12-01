import { AppBar, Box, Button, Toolbar } from '@mui/material';
import logo from '../../images/logo.png';
import Profile from '../Profile';
import MenuAdmin from './MenuAdmin';

const Menu = () => {
    return (
        <AppBar position="static" elevation={5} color="primary">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                    <img src={logo} alt={'USDTL IMS'} style={{ height: 40 }} />
                </Box>
                <MenuAdmin />
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Button
                        href="http://inventory.usdtl.com/chemicals"
                        size="small"
                        sx={{
                            color: '#fff',
                            fontWeight: '700'
                        }}>
                        Chemicals
                    </Button>
                    <Button
                        href="http://inventory.usdtl.com/chemicals-raw"
                        size="small"
                        sx={{
                            color: '#fff',
                            fontWeight: '700'
                        }}>
                        Raw Chemicals
                    </Button>
                </Box>
                <Box>
                    <Profile />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Menu;
