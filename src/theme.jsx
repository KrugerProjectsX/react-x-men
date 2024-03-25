import { createTheme, responsiveFontSizes } from '@mui/material'
import React from 'react'

const theme = createTheme({
palette:{
    primary:{
        main: '#10A75f'
    },
    secondary:{
        main:'#e53935'
    },
    common:{
        main:'#e53935'
    }
},
typography:{},
spacing: 10,
});

export default responsiveFontSizes( theme);