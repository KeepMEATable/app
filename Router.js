import React from 'react';
import { Router, Stack } from 'react-native-router-flux';

import HolderRoutes from './routes/holder';

const RouterComponent = () => {
    return (
        <Router>
            <Stack key="root">
                {HolderRoutes}
            </Stack>
        </Router>
    );
};

export default RouterComponent;
