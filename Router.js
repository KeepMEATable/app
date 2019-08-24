import React from 'react';
import { Router, Stack } from 'react-native-router-flux';

import WaitingLineRoutes from './routes/waitingLine';

const RouterComponent = () => {
    return (
        <Router>
            <Stack key="root">
                {WaitingLineRoutes}
            </Stack>
        </Router>
    );
};

export default RouterComponent;
