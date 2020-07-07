import { createMuiTheme } from '@material-ui/core/styles';
import * as React from 'react';
import { ThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#543D2B",
        },
        secondary: {
            main: "#d1c5b6",
        },
    },
});

export const MuiTheme: React.FC = props => (
        <ThemeProvider theme={theme}>
            {props.children}
        </ThemeProvider>
);