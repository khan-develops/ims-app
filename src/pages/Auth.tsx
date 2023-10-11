import { useMsal } from '@azure/msal-react';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import { loginRequest } from '../config/authConfig';
import { Fingerprint } from '@mui/icons-material';
import backgroundImage from '../images/wave-haikei3.svg';

const Auth = () => {
    const { instance } = useMsal();

    const handleLogin = () => {
        instance.loginRedirect(loginRequest).catch();
    };

    return (
        <Grid
            container
            direction="column"
            sx={{
                height: '100vh',
                backgroundImage: `url(${backgroundImage})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100vw'
            }}
        >
            <Grid item xs={3} sm={3} md={3} lg={3} xl={3}></Grid>
            <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h2" color="common.white">
                        WELCOME TO THE USDTL INVENTORY SYSTEM
                    </Typography>
                    <Typography variant="subtitle1" color="common.white">
                        A PROGRAM DESIGNED TO TRACK AND PROCURE INVENTORY
                    </Typography>
                </Box>
            </Grid>
            <Grid item sx={{ textAlign: 'center' }} xs={4} sm={4} md={4} lg={5} xl={4}>
                <IconButton aria-label="fingerprint" size="large" sx={{ color: 'common.white' }} onClick={handleLogin}>
                    <Fingerprint sx={{ fontSize: 80 }} />
                </IconButton>
            </Grid>
            <Grid
                item
                sx={{
                    textAlign: 'center',
                    paddingBottom: 2,
                    position: 'absolute',
                    bottom: 0,
                    width: '100%'
                }}
                xs={4}
                sm={4}
                md={4}
                lg={4}
                xl={4}
            >
                <Typography variant="body2">
                    Copyright © 2021 United States Drug Testing Laboratories Inc. All rights reserved.
                </Typography>
            </Grid>
        </Grid>
    );
};

export default Auth;
